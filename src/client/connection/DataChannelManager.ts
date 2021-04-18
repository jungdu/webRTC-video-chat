
interface DataChannelHandlers{
  onOpen?: (socketId: string) => void;
  onMessage?: (event: MessageEvent, socketId: string) => void;
  onClose?: (socketId: string) => void;
}
export default class DataChannelManager {
  dataChannels: RTCDataChannel[] = [];
  handlers: DataChannelHandlers = {};

  constructor(){
    // @ts-expect-error
    window.dataChannels = this.dataChannels;
  }

  addDataChannelHandlers(dataChannel: RTCDataChannel, socketId: string){
    dataChannel.addEventListener('open', () => {
      console.log("dataChannel onOpen")
      const {onOpen} = this.handlers;
      if(onOpen) onOpen(socketId);
    })
  
    dataChannel.addEventListener('message', (event) => {
      console.log("dataChannel onMessage event.data :", event.data)
      const {onMessage} = this.handlers;
      if(onMessage) onMessage(event, socketId);
    })
  
    dataChannel.addEventListener('close', () => {
      console.log("dataChannel onClose");
      this.removeClosedChannels();
      const {onClose} = this.handlers;
      if(onClose) onClose(socketId);
    })
  }

  broadcast(data: string){
    console.log("broadcast data:", data)
    this.dataChannels.forEach(dataChannel => {
      dataChannel.send(data);
    });
  }

  createDataChannel(peerConnection: RTCPeerConnection, socketId:string){
    this.addRtcDataChannelHandler(peerConnection, socketId);
    const dataChannel = peerConnection.createDataChannel('basicDataChannel');
    dataChannel.binaryType = "arraybuffer";
    this.dataChannels.push(dataChannel);
    this.addDataChannelHandlers(dataChannel, socketId);
  }

  addRtcDataChannelHandler (rtcConnection: RTCPeerConnection, socketId: string){
    rtcConnection.addEventListener('datachannel', (event) => {
      const dataChannel = event.channel;
      this.registerDataChannel(dataChannel, socketId);
    })
  }

  registerDataChannel(dataChannel: RTCDataChannel, socketId:string){
    this.dataChannels.push(dataChannel);
    this.addDataChannelHandlers(dataChannel, socketId);
  }

  removeClosedChannels(){
    this.dataChannels.filter(dataChannel => dataChannel.readyState === "closed")
  }

  setHandlers(handlers: DataChannelHandlers){
    this.handlers = handlers;
  }
}