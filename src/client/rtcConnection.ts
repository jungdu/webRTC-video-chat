import {Socket} from "socket.io-client";
import RtcConnectionManager from "./RtcConnectionManager";

export async function connectRTCPeer(socket: Socket, answerSocketId: string, rtcConnectionManager:RtcConnectionManager){
  if(!socket.id){
    throw new Error("connectRTCPeer:::No socket id");
  }

  const rtcPeerConnection = rtcConnectionManager.createConnection();
  rtcConnectionManager.addOfferConnection(socket.id, rtcPeerConnection);
  rtcConnectionManager.addCandidateHandler(rtcPeerConnection, socket, answerSocketId, "offer");
  createDataChannel(rtcPeerConnection);
  const offer = await rtcPeerConnection.createOffer();
  rtcPeerConnection.setLocalDescription(offer);
  
  socket.emit('offer', {
    answerSocketId,
    offer,
    offerSocketId: socket.id,
  });
}

function createDataChannel(peerConnection: RTCPeerConnection){
  console.log("createDataChannel");
  const dataChannel = peerConnection.createDataChannel('sendDataChannel');
  dataChannel.binaryType = "arraybuffer";
  dataChannel.addEventListener('open', () => {
    console.log("dataChannel opend")
    dataChannel.send('opened');
  })

  dataChannel.addEventListener('message', (event) => {
    console.log("event.data :", event.data)
  })

  dataChannel.addEventListener('close', () => {
    console.log("dataChannel closed");
  })
}