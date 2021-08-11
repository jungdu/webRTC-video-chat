import { Socket } from "socket.io-client";
import { AnswerData, OfferData, CandidateData, RtcConnectionType } from "./types";
import DataChannelManager from "./DataChannelManager";
import MediaStreamManager from "./MediaStreamManager";
interface RtcConnectionHandlers {
  onAddConnection?: (socketId: string) => void;
  onCloseConnection?: (socketId: string) => void;
}
interface Connections {
  [RtcConnectionType.ANSWER]: Map<string, RTCPeerConnection>;
  [RtcConnectionType.OFFER]: Map<string, RTCPeerConnection>;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

export default class RtcConnectionManager{
  connections:Connections= {
    [RtcConnectionType.ANSWER]: new Map(),
    [RtcConnectionType.OFFER]: new Map(), 
  }
  handlers: RtcConnectionHandlers = {};
  socket: Socket;
  dataChannelManager: DataChannelManager;
  mediaStreamManager: MediaStreamManager;

  constructor(socket:Socket, managers: {
    dataChannelManager: DataChannelManager, 
    mediaStreamManager: MediaStreamManager
  }){
    // 디버깅 용
    // @ts-expect-error
    window.offerConnections = this.connections[RtcConnectionType.OFFER];
    // @ts-expect-error
    window.answerConnections = this.connections[RtcConnectionType.ANSWER];
    
    this.socket = socket;
    this.dataChannelManager = managers.dataChannelManager;
    this.mediaStreamManager = managers.mediaStreamManager;
    
    this.addSocketHandler();
  }

  addConnection(type: RtcConnectionType, socketId:string, connection: RTCPeerConnection){
    this.connections[type].set(socketId, connection);
    if(this.handlers.onAddConnection) this.handlers.onAddConnection(socketId);
  }

  addCandidateHandler(connection: RTCPeerConnection, destSocketId: string, type: RtcConnectionType){
    console.log("addCandidateHandler ");
    connection.onicecandidate = event => {
      console.log("icecandidate:::event:", event);
      const {candidate} = event;
      if(candidate){
        const data:CandidateData = {
         candidate,
         destSocketId,
         fromSocketId: this.socket.id,
         type, 
        }
        this.socket.emit('candidate', data)
      }
    }
  }

  addSocketHandler(){
    this.socket.on('offer', async ({
      offer,
      offerSocketId,
    }:OfferData) => {
      const rtcPeerConnection = this.createConnection(RtcConnectionType.ANSWER, offerSocketId);
      this.dataChannelManager.addRtcDataChannelHandler(rtcPeerConnection, offerSocketId);
      this.mediaStreamManager.addRtcMediaStreamHandler(rtcPeerConnection);
  
      console.log("on offer ", rtcPeerConnection);
      this.addCandidateHandler(rtcPeerConnection, offerSocketId, RtcConnectionType.ANSWER)
      rtcPeerConnection.setRemoteDescription(offer);
      const answer = await rtcPeerConnection.createAnswer();
      rtcPeerConnection.setLocalDescription(answer);
      
      const data: AnswerData = {
        answerSocketId: this.socket.id,
        answer,
        offerSocketId,
      }
      this.socket.emit('answer', data);
    });
  
    this.socket.on('answer', ({
      answerSocketId,
      answer,
    }: AnswerData) => {
      const rtcPeerConnection = this.getConnection(RtcConnectionType.OFFER, answerSocketId);
      console.log("on answer :", rtcPeerConnection)
      if(rtcPeerConnection){
        rtcPeerConnection.setRemoteDescription(answer);
      }else{
        throw new Error("new rtcPeerConnection")
      }
    });
  
    this.socket.on('candidate', ({
      candidate,
      fromSocketId,
      type,
    }: CandidateData) => {
      console.log("on candidate type", type);
      const rtcPeerConnection = type === RtcConnectionType.OFFER 
        ? this.getConnection(RtcConnectionType.ANSWER,fromSocketId) 
        : this.getConnection(RtcConnectionType.OFFER, fromSocketId);
      if(!rtcPeerConnection){
        throw new Error("onCandidate:::No rtcPeerConnection")
      }
      rtcPeerConnection.addIceCandidate(candidate);
    })
  }

  async connectPeer(answerSocketId: string){
    if(!this.socket.id){
      throw new Error("connectRTCPeer:::No socket id");
    }

    const rtcPeerConnection = this.createConnection(RtcConnectionType.OFFER, answerSocketId);
    this.addCandidateHandler(rtcPeerConnection, answerSocketId, RtcConnectionType.OFFER);
    this.dataChannelManager.addRtcDataChannelHandler(rtcPeerConnection, answerSocketId);
    this.mediaStreamManager.addRtcMediaStreamHandler(rtcPeerConnection);
    // createOffer 전에 dataChannel 생성 해둬야함!
    this.dataChannelManager.createDataChannel(rtcPeerConnection, answerSocketId);
  
    const offer = await rtcPeerConnection.createOffer();
    rtcPeerConnection.setLocalDescription(offer);
    
    const data:OfferData = {
      answerSocketId,
      offer,
      offerSocketId: this.socket.id,
    }
    this.socket.emit('offer', data);
  }

  createConnection(type: RtcConnectionType, destSocketId: string){
    const connection = new RTCPeerConnection(ICE_SERVERS);

    connection.addEventListener('iceconnectionstatechange', () => {
      console.log("iceconnectionstatechange");
      this.handleConnectionStateChange(connection, type, destSocketId)
    })
    
    this.addConnection(type, destSocketId, connection)
    return connection;
  }

  deleteConnection(type: RtcConnectionType, socketId: string){
    console.log("this.connections[type] before delete:", this.connections[type])
    if(this.connections[type].has(socketId)){
      this.connections[type].delete(socketId);
      console.log("this.connections[type] after delete:", this.connections[type])
      if(this.handlers.onCloseConnection) this.handlers.onCloseConnection(socketId);
    }else{
      throw new Error("No connection to delete");
    }
  }

  getConnection(type: RtcConnectionType, socketId:string){
    if(this.connections[type].has(socketId)){
      return this.connections[type].get(socketId)
    }else{
      throw new Error("No connection to return");
    }
  }

  getConnectionIds(){
    return [
      ...this.connections[RtcConnectionType.ANSWER].keys(),
      ...this.connections[RtcConnectionType.OFFER].keys()
    ]
  }

  handleConnectionStateChange = (connection: RTCPeerConnection,type: RtcConnectionType, destSocketId: string) => {
    switch(connection.iceConnectionState){
      case "disconnected":
        console.log(`RTCConnection closed (socketId: ${destSocketId})`);
        this.deleteConnection(type, destSocketId);
        break;
      default:
    }
  }

  setHandlers(handlers: RtcConnectionHandlers){
    this.handlers = handlers;
  }
}