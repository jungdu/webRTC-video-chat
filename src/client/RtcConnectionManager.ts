import { Socket } from "socket.io-client";
import managers from "./managers";
import { CandidateData, RtcConnectionType } from "./types";

interface Connections {
  [RtcConnectionType.ANSWER]: {
    [id: string]: RTCPeerConnection
  };
  [RtcConnectionType.OFFER]: {
    [id: string]: RTCPeerConnection
  }; 
}

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

export default class RtcConnectionManager{
  connections:Connections= {
    [RtcConnectionType.ANSWER]: {},
    [RtcConnectionType.OFFER]: {}, 
  }

  offerConnections:{
    [id:string]: RTCPeerConnection
  } = {};
  answerConnections:{
    [id:string]: RTCPeerConnection
  } = {};

  constructor(){
    // @ts-expect-error
    window.offerConnections = this.offerConnections;
    // @ts-expect-error
    window.answerConnections = this.answerConnections;
  }

  addOfferConnection(socketId: string, connection: RTCPeerConnection){
    this.connections[RtcConnectionType.OFFER][socketId] = connection;
  }

  addAnswerConnection(socketId: string, connection: RTCPeerConnection){
    this.connections[RtcConnectionType.ANSWER][socketId] = connection;
  }

  addCandidateHandler(connection: RTCPeerConnection, socket: Socket, destSocketId: string, type: RtcConnectionType){
    console.log("addCandidateHandler ");
    connection.onicecandidate = event => {
      console.log("icecandidate:::event:", event);
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

  createConnection(type: RtcConnectionType, destSocketId: string){
    const connection = new RTCPeerConnection(ICE_SERVERS);
    connection.addEventListener('datachannel', this.handleDataChannel)
    connection.addEventListener('iceconnectionstatechange', () => {
      this.handleConnectionStateChange(connection, type, destSocketId)
    })
    
    switch(type){
      case RtcConnectionType.OFFER:
        this.addOfferConnection(destSocketId, connection);
        break;
      case RtcConnectionType.ANSWER:
        this.addAnswerConnection(destSocketId, connection);
        break;
      default:
        throw new Error("Invalid RTCPeerConnection ");
    }

    return connection;
  }

  getAnswerConnection(socketId: string){
    const connection = this.connections[RtcConnectionType.ANSWER][socketId];
    if(connection){
      return connection
    }else{
      throw new Error("No answer connection")
    }
  }

  getOfferConnection(socketId: string){
    const connection = this.connections[RtcConnectionType.OFFER][socketId];
    if(connection){
      return connection;
    }else{
      throw new Error("No offer connection")
    }
  }

  handleConnectionStateChange = (connection: RTCPeerConnection,type: RtcConnectionType, destSocketId: string) => {
    switch(connection.connectionState){
      case "closed":
        console.log(`RTCConnection closed (socketId: ${destSocketId})`);
        delete this.connections[type][destSocketId];
        break;
      default:
    }
  }

  handleDataChannel = (event: RTCDataChannelEvent) => {
    const dataChannel = event.channel;
    const {dataChannelManager} = managers;
    dataChannelManager.registerDataChannel(dataChannel);
  }
}