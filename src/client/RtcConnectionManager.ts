import { Socket } from "socket.io-client";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

export default class RtcConnectionManager{
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
    this.offerConnections[socketId] = connection;
  }

  addAnswerConnection(socketId: string, connection: RTCPeerConnection){
    this.answerConnections[socketId] = connection;
  }

  addCandidateHandler(connection: RTCPeerConnection, socket: Socket, destSocketId: string, type: "offer"|"answer"){
    console.log("addCandidateHandler");
    connection.onicecandidate = event => {
      console.log("icecandidate:::event:", event);
      const {candidate} = event;
      if(candidate){
        socket.emit('candidate', {
          candidate,
          destSocketId,
          fromSocketId: socket.id,
          type,
        })     
      }
    }
  }

  createConnection(){
    const connection = new RTCPeerConnection(ICE_SERVERS);
    connection.addEventListener('datachannel', this.handleDataChannel)
    return connection;
  }

  getOfferConnection(socketId: string){
    const connection = this.offerConnections[socketId];
    if(connection){
      return connection;
    }else{
      throw new Error("No offer connection")
    }
  }

  getAnswerConnection(socketId: string){
    const connection = this.answerConnections[socketId];
    if(connection){
      return connection
    }else{
      throw new Error("No answer connection")
    }
  }

  handleDataChannel(this: RTCPeerConnection, event: RTCDataChannelEvent){
    const dataChannel = event.channel;
    console.log("dataChannel :", dataChannel);

    dataChannel.addEventListener('open', () => {
      console.log("dataChannel opened!");
    })

    dataChannel.addEventListener('message', (event) => {
      event.data
    })

    setInterval(() => {
      dataChannel.send("ping")
    }, 1000)
  }
}