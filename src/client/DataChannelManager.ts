
interface DataChannelHandlers{
  onOpen?: () => void;
  onMessage?: (event: MessageEvent) => void;
  onClose?: () => void;
}
export default class DataChannelManager {
  dataChannels: RTCDataChannel[] = [];
  handlers: DataChannelHandlers = {};

  constructor(){
    // @ts-expect-error
    window.dataChannels = this.dataChannels;
  }

  addDataChannelHandlers(dataChannel: RTCDataChannel){
    dataChannel.addEventListener('open', () => {
      console.log("dataChannel onOpen")
      const {onOpen} = this.handlers;
      if(onOpen) onOpen();
    })
  
    dataChannel.addEventListener('message', (event) => {
      console.log("dataChannel onMessage event.data :", event.data)
      const {onMessage} = this.handlers;
      if(onMessage) onMessage(event);
    })
  
    dataChannel.addEventListener('close', () => {
      console.log("dataChannel onClose");
      const {onClose} = this.handlers;
      if(onClose) onClose();
    })
  }

  broadcast(data: string){
    console.log("broadcast data:", data)
    this.dataChannels.forEach(dataChannel => {
      dataChannel.send(data);
    });
  }

  createDataChannel(peerConnection: RTCPeerConnection){
    const dataChannel = peerConnection.createDataChannel('basicDataChannel');
    dataChannel.binaryType = "arraybuffer";
    this.dataChannels.push(dataChannel);
    this.addDataChannelHandlers(dataChannel);
  }

  registerDataChannel(dataChannel: RTCDataChannel){
    this.dataChannels.push(dataChannel);
    this.addDataChannelHandlers(dataChannel);
  }

  setHandlers(handlers: DataChannelHandlers){
    this.handlers = handlers;
  }
}