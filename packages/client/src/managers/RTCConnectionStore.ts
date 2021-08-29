import { RTCConnectionType } from "@videochat/common"

export default class RTCConnectionStore {
  answerConnections = new Map<string, RTCPeerConnection>();
  offerConnections = new Map<string, RTCPeerConnection>();
  dataChannels = new Map<string, RTCDataChannel>();

  constructor(){
    // @ts-ignore
    window.offerConnections = this.offerConnections;
    // @ts-ignore
    window.answerConnections = this.answerConnections;
    // @ts-ignore
    window.dataChannels = this.dataChannels;

    window.addEventListener('beforeunload', () => {
      this.closeConnections();
    })
  }
  
  addDataChannel(socketId: string, dataChannel: RTCDataChannel){
    this.dataChannels.set(socketId, dataChannel);
  }

  closeConnections(){
    this.answerConnections.forEach(closeConnection);
    this.offerConnections.forEach(closeConnection)

    function closeConnection(connection: RTCPeerConnection){
      connection.close();
    }
  }

  deleteConnection(socketId: string){
    const result = this.offerConnections.delete(socketId) || this.answerConnections.delete(socketId);
    if(!result){
      throw new Error(`No connection to delete socketId ${socketId}`)
    }
  }

  deleteDataChannel(socketId: string){
    if(!this.dataChannels.has(socketId)){
      throw new Error(`No datachannel to delete socketId ${socketId}`);
    }
    this.dataChannels.delete(socketId);
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

  getDataChannel(socketId: string){
    const result = this.dataChannels.get(socketId)
    if(!result){
      throw new Error(`No datachannel to get socketId: ${socketId}`)
    }
    return result;
  }

  getDataChannels(){
    return this.dataChannels;
  }
  
  setConnection(type: RTCConnectionType, socketId: string, connection: RTCPeerConnection){
    const connectionMap = this.getConnectionMap(type);
    if(connectionMap.get(socketId)){
      throw new Error("Already exist socketId")
    }
    connectionMap.set(socketId, connection);
    
    connection.addEventListener("connectionstatechange", () => {
      if(connection.connectionState === "failed"){
        connectionMap.delete(socketId);
      }
    })
  }

}