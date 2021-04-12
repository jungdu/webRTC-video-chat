import {Socket} from "socket.io-client"
import RtcConnectionManager from "./RtcConnectionManager"

export function addSocketHandler(socket: Socket, rtcConnectionManager:RtcConnectionManager){
  let socketId: string = "";

  socket.on("connect", () => {
    socketId = socket.id;
    updateSocketId(socketId);
    console.log("socket connected... socketId:", socket.id);
  });

  addRTCSocketHandler(socket, rtcConnectionManager);
}

function addRTCSocketHandler(socket:Socket, rtcConnectionManager:RtcConnectionManager){
  socket.on('offer', async ({
    offer,
    offerSocketId,
  }) => {
    const rtcPeerConnection = rtcConnectionManager.createConnection();
    console.log("on offer ", rtcPeerConnection);
    rtcConnectionManager.addCandidateHandler(rtcPeerConnection, socket, offerSocketId, "offer")
    rtcPeerConnection.setRemoteDescription(offer);
    const answer = await rtcPeerConnection.createAnswer();
    rtcPeerConnection.setLocalDescription(answer);
    rtcConnectionManager.addAnswerConnection(offerSocketId, rtcPeerConnection);
    socket.emit('answer', {
      answerSocketId: socket.id,
      answer,
      offerSocketId,
    });
  });

  socket.on('answer', ({
    offerSocketId,
    answer,
  }) => {
    const rtcPeerConnection = rtcConnectionManager.getOfferConnection(offerSocketId);
    console.log("on answer :", rtcPeerConnection)
    if(rtcPeerConnection){
      rtcPeerConnection.setRemoteDescription(answer);
    }else{
      throw new Error("new rtcPeerConnection")
    }
  });

  socket.on('candidate', ({
    candidate,
    fromSocketId,
    type,
  }) => {
    console.log("on candidate type", type);
    const rtcPeerConnection = type === "offer" ? rtcConnectionManager.getAnswerConnection(fromSocketId) :rtcConnectionManager.getOfferConnection(fromSocketId);
    if(!rtcPeerConnection){
      throw new Error("onCandidate:::No rtcPeerConnection")
    }
    rtcPeerConnection.addIceCandidate(candidate);
  })
}

function updateSocketId(socketId:string){
  const socketIdSpan = document.getElementById("socketIdSpan") as HTMLSpanElement;
  socketIdSpan.innerHTML = socketId;
}