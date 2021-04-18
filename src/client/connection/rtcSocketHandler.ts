import {Socket} from "socket.io-client"
import DataChannelManager from "./DataChannelManager";
import RtcConnectionManager from "./RtcConnectionManager";
import { AnswerData, CandidateData, OfferData, RtcConnectionType } from "./types";

export function addRtcSocketHandler(socket:Socket, rtcConnectionManager: RtcConnectionManager, dataChannelManager:DataChannelManager){
  socket.on('offer', async ({
    offer,
    offerSocketId,
  }:OfferData) => {
    const rtcPeerConnection = rtcConnectionManager.createConnection(RtcConnectionType.ANSWER, offerSocketId);
    dataChannelManager.addRtcDataChannelHandler(rtcPeerConnection, offerSocketId);

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
    const rtcPeerConnection = rtcConnectionManager.getConnection(RtcConnectionType.OFFER, answerSocketId);
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
    const rtcPeerConnection = type === RtcConnectionType.OFFER 
      ? rtcConnectionManager.getConnection(RtcConnectionType.ANSWER,fromSocketId) 
      : rtcConnectionManager.getConnection(RtcConnectionType.OFFER, fromSocketId);
    if(!rtcPeerConnection){
      throw new Error("onCandidate:::No rtcPeerConnection")
    }
    rtcPeerConnection.addIceCandidate(candidate);
  })
}
