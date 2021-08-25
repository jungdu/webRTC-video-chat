import { DataChannelMessage } from "types";
import RTCConnectionStore from "./RTCConnectionStore";

interface DataChannelHandlers{
  onOpen?: (socketId: string) => void;
  onMessage?: (dataChannelMessage: DataChannelMessage, socketId: string) => void;
  onClose?: (socketId: string) => void;
}
export default class DataChannelManager {
  private handlers: DataChannelHandlers = {};
  private connectionStore: RTCConnectionStore;
  
  constructor(connectionStore: RTCConnectionStore){
    this.connectionStore = connectionStore;
  }
  
  private addDataChannelHandlers(dataChannel: RTCDataChannel, socketId: string){
    dataChannel.addEventListener('open', () => {
      console.log("dataChannelOpened");
      const {onOpen} = this.handlers;
      if(onOpen) onOpen(socketId);
    })
  
    dataChannel.addEventListener('message', (event) => {
      const {onMessage} = this.handlers;
      if(onMessage) onMessage(JSON.parse(event.data), socketId);
    })
  
    dataChannel.addEventListener('close', () => {
      this.connectionStore.deleteDataChannel(socketId);
      // dataChannel이 닫히면 close 이벤트가 바로 들어옴.
      // RTCConnectionStateChange 이벤트는 반응이 느려서 그 사이에 사용자가 같은 채팅방을 다시 방문하면 에러가 발생하게됨
      this.connectionStore.deleteConnection(socketId);

      const {onClose} = this.handlers;
      if(onClose) onClose(socketId);
    })
  }

  private registerDataChannel(dataChannel: RTCDataChannel, socketId:string){
    this.connectionStore.addDataChannel(socketId, dataChannel)
    this.addDataChannelHandlers(dataChannel, socketId);
  }

  addRtcDataChannelHandler(rtcConnection: RTCPeerConnection, socketId: string){
    rtcConnection.addEventListener('datachannel', (event) => {
      const dataChannel = event.channel;
      this.registerDataChannel(dataChannel, socketId);
    })
  }

  broadcast(dataChannelMessage: DataChannelMessage){
    this.connectionStore.getDataChannels().forEach((dataChannel) => {
      if(dataChannel.readyState === "open"){
        dataChannel.send(JSON.stringify(dataChannelMessage));
      }
    })
  }

  createDataChannel(peerConnection: RTCPeerConnection, socketId:string){
    this.addRtcDataChannelHandler(peerConnection, socketId);
    const dataChannel = peerConnection.createDataChannel('basicDataChannel');
    dataChannel.binaryType = "arraybuffer";
    this.registerDataChannel(dataChannel, socketId);
  }

  setHandlers(handlers: DataChannelHandlers){
    this.handlers = handlers;
  }
}