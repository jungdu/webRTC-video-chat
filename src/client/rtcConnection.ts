import {Socket} from "socket.io-client";
import RtcConnectionManager from "./RtcConnectionManager";
import { OfferData, RtcConnectionType } from "./types";

export async function connectRTCPeer(socket: Socket, answerSocketId: string, rtcConnectionManager:RtcConnectionManager){
  if(!socket.id){
    throw new Error("connectRTCPeer:::No socket id");
  }

  const rtcPeerConnection = rtcConnectionManager.createConnection(RtcConnectionType.OFFER, answerSocketId);
  rtcConnectionManager.addCandidateHandler(rtcPeerConnection, socket, answerSocketId, RtcConnectionType.OFFER);
  createDataChannel(rtcPeerConnection);
  const offer = await rtcPeerConnection.createOffer();
  rtcPeerConnection.setLocalDescription(offer);
  
  const data:OfferData = {
    answerSocketId,
    offer,
    offerSocketId: socket.id,
  }
  socket.emit('offer', data);
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