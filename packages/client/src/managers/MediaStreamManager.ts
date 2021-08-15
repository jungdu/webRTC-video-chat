
interface MediaStreamManagerHandlers {
  onNewTrack: (trackEvent: RTCTrackEvent) => void;
}

export default class MediaStreamManager {
  currentUserStream: MediaStream | null = null;
  handlers: MediaStreamManagerHandlers = {
    onNewTrack: () => undefined,
  }
  
  private setCurrentUserStream(stream: MediaStream){
    this.currentUserStream = stream;
  }

  private getUserMedia(){
    return new Promise<MediaStream>((resolve, reject) => {
      window.navigator.getUserMedia({
        audio: false,
        video: {width: 1280, height: 720},
      }, function(stream){
        resolve(stream);
      }, function(err){
        reject(err)
      })
    })
  }

  setHandlers(handlers: MediaStreamManagerHandlers){
    this.handlers = handlers;
  }
  
  async setUserMediaStream(){
    const stream = await this.getUserMedia();
    this.setCurrentUserStream(stream);
    return stream;
  }

  addRTCMediaStreamHandler(rtcPeerConnection: RTCPeerConnection){
    rtcPeerConnection.ontrack = this.handlers.onNewTrack;
    if(this.currentUserStream){
      rtcPeerConnection.addTrack(this.currentUserStream.getTracks()[0], this.currentUserStream);
    }
  }
}