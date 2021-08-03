import {Socket} from "socket.io-client";
import DataChannelManager from "./DataChannelManager";
import RtcConnectionManager from "./RtcConnectionManager";
import { OfferData, RtcConnectionType } from "./types";

export async function connectRTCPeer(socket: Socket, answerSocketId: string, rtcConnectionManager: RtcConnectionManager, dataChannelManager: DataChannelManager){
  if(!socket.id){
    throw new Error("connectRTCPeer:::No socket id");
  }
  const rtcPeerConnection = rtcConnectionManager.createConnection(RtcConnectionType.OFFER, answerSocketId);
  rtcConnectionManager.addCandidateHandler(rtcPeerConnection, answerSocketId, RtcConnectionType.OFFER);
  dataChannelManager.addRtcDataChannelHandler(rtcPeerConnection, answerSocketId);
  // createOffer 전에 dataChannel 생성 해둬야함!
  dataChannelManager.createDataChannel(rtcPeerConnection, answerSocketId);

  const offer = await rtcPeerConnection.createOffer();
  rtcPeerConnection.setLocalDescription(offer);
  
  const data:OfferData = {
    answerSocketId,
    offer,
    offerSocketId: socket.id,
  }
  socket.emit('offer', data);
}