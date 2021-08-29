import { DataChannelMessage } from "types";
import RTCConnectionStore from "./RTCConnectionStore";

interface DataChannelHandlers{
  onOpen?: (socketId: string, dataChannel: RTCDataChannel) => void;
  onMessage?: (dataChannelMessage: DataChannelMessage, socketId: string) => void;
  onClose?: (socketId: string) => void;
}
export default class DataChannelManager {
  private handlers: DataChannelHandlers = {};
  private connectionStore: RTCConnectionStore;
  
  constructor(connectionStore: RTCConnectionStore){
    this.connectionStore = connectionStore;
  }
  
  private addDataChannelHandlers(dataChannel: RTCDataChannel, socketId: string, onSuccessConnecting?: () => void){
    dataChannel.addEventListener('open', () => {
      console.log("dataChannelOpened");
      if(onSuccessConnecting){
        onSuccessConnecting();
      }

      if(this.handlers.onOpen) {
        this.handlers.onOpen(socketId, dataChannel);
      };
    })
  
    dataChannel.addEventListener('message', (event) => {
      const {onMessage} = this.handlers;
      if(onMessage) onMessage(JSON.parse(event.data), socketId);
    })
  
    dataChannel.addEventListener('close', () => {
      console.log("dataChannelClosed");
      this.connectionStore.deleteDataChannel(socketId);
      // dataChannel이 닫히면 close 이벤트가 바로 들어옴.
      // RTCConnectionStateChange 이벤트는 반응이 느려서 그 사이에 사용자가 같은 채팅방을 다시 방문하면 에러가 발생하게됨
      this.connectionStore.deleteConnection(socketId);

      const {onClose} = this.handlers;
      if(onClose) onClose(socketId);
    })
  }

  addRtcDataChannelHandler(rtcConnection: RTCPeerConnection, socketId: string){
    rtcConnection.addEventListener('datachannel', (event) => {
      const dataChannel = event.channel;
      this.connectionStore.addDataChannel(socketId, dataChannel);
      this.addDataChannelHandlers(dataChannel, socketId);
    })
  }

  broadcast(dataChannelMessage: DataChannelMessage){
    this.connectionStore.getDataChannels().forEach((dataChannel) => {
      this.sendMessage(dataChannel, dataChannelMessage);
    })
  }

  sendMessage(dataChannel: RTCDataChannel, dataChannelMessage: DataChannelMessage){
    if(dataChannel.readyState === "open"){
      dataChannel.send(JSON.stringify(dataChannelMessage));
    }   
  }

  createDataChannel(peerConnection: RTCPeerConnection, socketId:string, onSuccessConnecting: () => void){
    this.addRtcDataChannelHandler(peerConnection, socketId);
    const dataChannel = peerConnection.createDataChannel('basicDataChannel');
    dataChannel.binaryType = "arraybuffer";
    this.connectionStore.addDataChannel(socketId, dataChannel);
    this.addDataChannelHandlers(dataChannel, socketId, onSuccessConnecting);
  }

  setHandlers(handlers: DataChannelHandlers){
    this.handlers = handlers;
  }
}