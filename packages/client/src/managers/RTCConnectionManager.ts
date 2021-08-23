import DataChannelManager from "./DataChannelManager";
import MediaStreamManager from "./MediaStreamManager";
import { TypedClientSocket, RTCConnectionType } from "@videochat/common"
import RTCConnectionStore from "./RTCConnectionStore";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};



export default class RTCConnectionManager{
  connectionStore: RTCConnectionStore;
  dataChannelManager:DataChannelManager;
  mediaStreamManager:MediaStreamManager;

  constructor(managers: {
    dataChannelManager: DataChannelManager,
    mediaStreamManager: MediaStreamManager,
  }, connectionStore: RTCConnectionStore){
    this.dataChannelManager = managers.dataChannelManager;
    this.mediaStreamManager = managers.mediaStreamManager;

    this.connectionStore = connectionStore;
  }

  private addIceCandidateHandler(connection: RTCPeerConnection, destSocketId: string, type: RTCConnectionType, socket:TypedClientSocket){
    connection.onicecandidate = event => {
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

  private createConnection(type: RTCConnectionType, destSocketId: string){
    const connection = new RTCPeerConnection(ICE_SERVERS);
    this.connectionStore.setConnection(type, destSocketId, connection);
    return connection;
  }

  addSocketHandler(
    socket: TypedClientSocket,
  ){
    socket.on('offer', async (message) => {
      const {offer, offerSocketId} = message;
      const rtcPeerConnection = this.createConnection(RTCConnectionType.ANSWER, offerSocketId)
      this.dataChannelManager.addRtcDataChannelHandler(rtcPeerConnection, offerSocketId);
      this.mediaStreamManager.addRTCMediaStreamHandler(rtcPeerConnection, offerSocketId);

      this.addIceCandidateHandler(rtcPeerConnection, offerSocketId, RTCConnectionType.ANSWER, socket);
      rtcPeerConnection.setRemoteDescription(offer);
      const answer = await rtcPeerConnection.createAnswer();
      rtcPeerConnection.setLocalDescription(answer);
      socket.emit('answer', {
        answerSocketId: socket.id,
        answer,
        offerSocketId,
      });
    });

    socket.on('answer', (message) => {
      const {answer, answerSocketId} = message;
      const rtcPeerConnection = this.connectionStore.getConnection(RTCConnectionType.OFFER, answerSocketId);
      if(!rtcPeerConnection){
        throw new Error("No peerConnection for answer")
      }
      rtcPeerConnection.setRemoteDescription(answer);
    });

    socket.on('candidate', (message) => {
      const { candidate, fromSocketId, type } = message;
      const connectionType = type === RTCConnectionType.OFFER ? RTCConnectionType.ANSWER : RTCConnectionType.OFFER;
      const rtcPeerConnection = this.connectionStore.getConnection(connectionType, fromSocketId);
      if(!rtcPeerConnection){
        throw new Error(`No peerConnection for iceCandidate type: ${type}, fromSocketId: ${fromSocketId}`);
      }
      rtcPeerConnection.addIceCandidate(candidate);
    });
  }

  deleteSocketHandler(socket: TypedClientSocket){
    socket.off('offer');
    socket.off('answer');
    socket.off('candidate');
  }

  closeConnections(){
    this.connectionStore.closeConnections();
  }

  async connectPeer(socket: TypedClientSocket, answerSocketId: string){
    if(!socket.id){
      throw new Error("connectRTCPeer:::No socket id");
    }

    const rtcPeerConnection = this.createConnection(RTCConnectionType.OFFER, answerSocketId);
    this.addIceCandidateHandler(rtcPeerConnection, answerSocketId, RTCConnectionType.OFFER, socket);
    this.mediaStreamManager.addRTCMediaStreamHandler(rtcPeerConnection, answerSocketId);
    this.dataChannelManager.createDataChannel(rtcPeerConnection, answerSocketId);
  
    const offer = await rtcPeerConnection.createOffer();
    rtcPeerConnection.setLocalDescription(offer);
    
    socket.emit('offer', {
      answerSocketId,
      offer,
      offerSocketId: socket.id,
    });
  }
}
