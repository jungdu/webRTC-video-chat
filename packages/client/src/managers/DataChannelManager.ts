
interface DataChannelHandlers{
  onOpen?: (socketId: string) => void;
  onMessage?: (event: MessageEvent, socketId: string) => void;
  onClose?: (socketId: string) => void;
}
export default class DataChannelManager {
  private dataChannels: RTCDataChannel[] = [];
  private handlers: DataChannelHandlers = {};
  
  private addDataChannelHandlers(dataChannel: RTCDataChannel, socketId: string){
    dataChannel.addEventListener('open', () => {
      console.log("dataChannelOpened");
      const {onOpen} = this.handlers;
      if(onOpen) onOpen(socketId);
    })
  
    dataChannel.addEventListener('message', (event) => {
      const {onMessage} = this.handlers;
      if(onMessage) onMessage(event, socketId);
    })
  
    dataChannel.addEventListener('close', () => {
      this.removeClosedChannels();
      const {onClose} = this.handlers;
      if(onClose) onClose(socketId);
    })
  }

  private registerDataChannel(dataChannel: RTCDataChannel, socketId:string){
    this.dataChannels.push(dataChannel);
    this.addDataChannelHandlers(dataChannel, socketId);
  }

  private removeClosedChannels(){
    this.dataChannels.filter(dataChannel => dataChannel.readyState === "closed")
  }

  addRtcDataChannelHandler(rtcConnection: RTCPeerConnection, socketId: string){
    rtcConnection.addEventListener('datachannel', (event) => {
      const dataChannel = event.channel;
      this.registerDataChannel(dataChannel, socketId);
    })
  }

  broadcast(data: string){
    this.dataChannels
      .filter(dataChannels => dataChannels.readyState === "open")
      .forEach(dataChannel => {
        dataChannel.send(data);
      });
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