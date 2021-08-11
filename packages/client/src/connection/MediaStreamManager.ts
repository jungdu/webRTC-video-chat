
interface MediaStreamManagerHandlers {
  onGetCameraStream: (stream: MediaStream) => void;
  onTrack: (trackEvent: RTCTrackEvent) => void;
}

export default class MediaStreamManager{
  handlers: MediaStreamManagerHandlers;
  myCameraStream: MediaStream | null = null;

  constructor({
    handlers
  }: {
    handlers: MediaStreamManagerHandlers
  }){
    this.handlers = handlers;

    this.getCameraMediaStream().then(stream => {
      console.log("stream :", stream)
      this.handlers.onGetCameraStream(stream)
      this.myCameraStream = stream;
    });
  }

  addRtcMediaStreamHandler(rtcPeerConnection: RTCPeerConnection){
    rtcPeerConnection.ontrack = this.handlers.onTrack;
    if(this.myCameraStream){
      rtcPeerConnection.addTrack(this.myCameraStream.getTracks()[0], this.myCameraStream);
    }
  }

  getCameraMediaStream(){
    return new Promise<MediaStream>((resolve, reject) => {
      debugger;
      window.navigator.getUserMedia({audio: false, video: {width: 1280, height: 720}}, function(stream){
        resolve(stream);
      }, function(err){
        reject(err)
      })
    })
  }
}