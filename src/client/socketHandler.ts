import {Socket} from "socket.io-client"
import { AnswerData, CandidateData, OfferData, RtcConnectionType } from "./types";
import managers from "./managers"

export function addSocketHandler(socket: Socket ){
  let socketId: string = "";

  socket.on("connect", () => {
    socketId = socket.id;
    updateSocketId(socketId);
    console.log("socket connected... socketId:", socket.id);
  });

  addRTCSocketHandler(socket);
}

function addRTCSocketHandler(socket:Socket){
  socket.on('offer', async ({
    offer,
    offerSocketId,
  }:OfferData) => {
    const { rtcConnectionManager } = managers;
    const rtcPeerConnection = rtcConnectionManager.createConnection(RtcConnectionType.ANSWER, offerSocketId);
    console.log("on offer ", rtcPeerConnection);
    rtcConnectionManager.addCandidateHandler(rtcPeerConnection, socket, offerSocketId, RtcConnectionType.ANSWER)
    rtcPeerConnection.setRemoteDescription(offer);
    const answer = await rtcPeerConnection.createAnswer();
    rtcPeerConnection.setLocalDescription(answer);
    
    const data: AnswerData = {
      answerSocketId: socket.id,
      answer,
      offerSocketId,
    }
    socket.emit('answer', data);
  });

  socket.on('answer', ({
    answerSocketId,
    answer,
  }: AnswerData) => {
    const { rtcConnectionManager } = managers;
    const rtcPeerConnection = rtcConnectionManager.getOfferConnection(answerSocketId);
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
  }: CandidateData) => {
    console.log("on candidate type", type);
    const {rtcConnectionManager} = managers;
    const rtcPeerConnection = type === RtcConnectionType.OFFER ? rtcConnectionManager.getAnswerConnection(fromSocketId) :rtcConnectionManager.getOfferConnection(fromSocketId);
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