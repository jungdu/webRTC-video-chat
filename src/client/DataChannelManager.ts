export default class DataChannelManager {
  dataChannels: RTCDataChannel[] = [];

  constructor(){
    // @ts-expect-error
    window.dataChannels = this.dataChannels;
  }

  addDataChannelHandlers(dataChannel: RTCDataChannel){
    dataChannel.addEventListener('open', () => {
      console.log("dataChannel opend")
      dataChannel.send('opened');
    })
  
    dataChannel.addEventListener('message', (event) => {
      console.log("event.data :", event.data)
    })
  
    dataChannel.addEventListener('close', () => {
      console.log("dataChannel closed");
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
}