import { Socket } from "socket.io-client";
import DataChannelManager from "./DataChannelManager";
import MediaStreamManager from "./MediaStreamManager";
import { AnswerData, CandidateData, OfferData, RTCConnectionType } from "./types";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

class ConnectionStore {
  answerConnections = new Map<string, RTCPeerConnection>();
  offerConnections = new Map<string, RTCPeerConnection>();

  setConnection(type: RTCConnectionType, socketId: string, connection: RTCPeerConnection){
    const connectionMap = this.getConnectionMap(type);
    if(connectionMap.get(socketId)){
      throw new Error("Already exist socketId")
    }
    connectionMap.set(socketId, connection);
  }
  
  getConnection(type: RTCConnectionType, socketId: string){
    const connectionMap = this.getConnectionMap(type);
    return connectionMap.get(socketId);
  }

  getConnectionMap(type: RTCConnectionType){
    switch(type){
      case RTCConnectionType.ANSWER:
        return this.answerConnections;
      case RTCConnectionType.OFFER:
        return this.offerConnections;
      default:
        throw new Error("Invalid RTCConnectionType");
    }
  }
}

export default class RTCConnectionManager{
  connectionStore = new ConnectionStore();
  dataChannelManager:DataChannelManager;
  mediaStreamManager:MediaStreamManager;

  constructor(managers: {
    dataChannelManager: DataChannelManager,
    mediaStreamManager: MediaStreamManager,
  }){
    this.dataChannelManager = managers.dataChannelManager;
    this.mediaStreamManager = managers.mediaStreamManager;
  }

  private addIceCandidateHandler(connection: RTCPeerConnection, destSocketId: string, type: RTCConnectionType, socket:Socket){
    connection.onicecandidate = event => {
      const {candidate} = event;
      if(candidate){
        const data:CandidateData = {
         candidate,
         destSocketId,
         fromSocketId: socket.id,
         type, 
        }
        socket.emit('candidate', data)
      }
    }
  }

  private createConnection(type: RTCConnectionType, destSocketId: string){
    const connection = new RTCPeerConnection(ICE_SERVERS);
    this.connectionStore.setConnection(type, destSocketId, connection);
    return connection;
  }

  addSocketHandler(
    socket: Socket,
  ){
    socket.on('offer', async (message: OfferData) => {
      const {offer, offerSocketId} = message;
      const rtcPeerConnection = this.createConnection(RTCConnectionType.ANSWER, offerSocketId)
      this.dataChannelManager.addRtcDataChannelHandler(rtcPeerConnection, offerSocketId);
      this.mediaStreamManager.addRTCMediaStreamHandler(rtcPeerConnection, offerSocketId);

      this.addIceCandidateHandler(rtcPeerConnection, offerSocketId, RTCConnectionType.ANSWER, socket);
      rtcPeerConnection.setRemoteDescription(offer);
      const answer = await rtcPeerConnection.createAnswer();
      rtcPeerConnection.setLocalDescription(answer);
      const sendMessage: AnswerData = {
        answerSocketId: socket.id,
        answer,
        offerSocketId,
      }

      socket.emit('answer', sendMessage);
    });

    socket.on('answer', (message: AnswerData) => {
      const {answer, answerSocketId} = message;
      const rtcPeerConnection = this.connectionStore.getConnection(RTCConnectionType.OFFER, answerSocketId);
      if(!rtcPeerConnection){
        throw new Error("No peerConnection for answer")
      }
      rtcPeerConnection.setRemoteDescription(answer);
    });

    socket.on('candidate', (message:CandidateData) => {
      const { candidate, fromSocketId, type } = message;
      const connectionType = type === RTCConnectionType.OFFER ? RTCConnectionType.ANSWER : RTCConnectionType.OFFER;
      const rtcPeerConnection = this.connectionStore.getConnection(connectionType, fromSocketId);
      if(!rtcPeerConnection){
        throw new Error(`No peerConnection for iceCandidate type: ${type}, fromSocketId: ${fromSocketId}`);
      }
      rtcPeerConnection.addIceCandidate(candidate);
    });
  }

  async connectPeer(socket: Socket, answerSocketId: string){
    if(!socket.id){
      throw new Error("connectRTCPeer:::No socket id");
    }

    const rtcPeerConnection = this.createConnection(RTCConnectionType.OFFER, answerSocketId);
    this.addIceCandidateHandler(rtcPeerConnection, answerSocketId, RTCConnectionType.OFFER, socket);
    this.mediaStreamManager.addRTCMediaStreamHandler(rtcPeerConnection, answerSocketId);
    this.dataChannelManager.createDataChannel(rtcPeerConnection, answerSocketId);
  
    const offer = await rtcPeerConnection.createOffer();
    rtcPeerConnection.setLocalDescription(offer);
    
    const data:OfferData = {
      answerSocketId,
      offer,
      offerSocketId: socket.id,
    }
    socket.emit('offer', data);
  }
}
