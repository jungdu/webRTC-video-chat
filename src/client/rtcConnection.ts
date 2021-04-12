import {Socket} from "socket.io-client";
import managers from "./managers";
import { OfferData, RtcConnectionType } from "./types";

export async function connectRTCPeer(socket: Socket, answerSocketId: string ){
  if(!socket.id){
    throw new Error("connectRTCPeer:::No socket id");
  }
  const { rtcConnectionManager, dataChannelManager } = managers;
  const rtcPeerConnection = rtcConnectionManager.createConnection(RtcConnectionType.OFFER, answerSocketId);
  rtcConnectionManager.addCandidateHandler(rtcPeerConnection, socket, answerSocketId, RtcConnectionType.OFFER);
  // createOffer 전에 dataChannel 생성 해둬야함!
  dataChannelManager.createDataChannel(rtcPeerConnection);
  const offer = await rtcPeerConnection.createOffer();
  rtcPeerConnection.setLocalDescription(offer);
  
  const data:OfferData = {
    answerSocketId,
    offer,
    offerSocketId: socket.id,
  }
  socket.emit('offer', data);

  // TO FIX
  // offer에서 answer로 ping 쏘는 로직
  let count = 0;
  setInterval(() => {
    count++
    dataChannelManager.broadcast(`ping from offer(${socket.id}): ${count}`);
  }, 1000)
}