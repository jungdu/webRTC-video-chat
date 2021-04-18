import { Socket } from "socket.io-client";
import { CandidateData, RtcConnectionType } from "./types";

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

  constructor(){
    // @ts-expect-error
    window.offerConnections = this.connections[RtcConnectionType.OFFER];
    // @ts-expect-error
    window.answerConnections = this.connections[RtcConnectionType.ANSWER];
  }

  addConnection(type: RtcConnectionType, socketId:string, connection: RTCPeerConnection){
    this.connections[type].set(socketId, connection);
    if(this.handlers.onAddConnection) this.handlers.onAddConnection(socketId);
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