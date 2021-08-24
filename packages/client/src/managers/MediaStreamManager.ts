
interface MediaStreamManagerHandlers {
  onNewTrack: (trackEvent: RTCTrackEvent, socketId: string) => void;

}

export default class MediaStreamManager {
  currentUserStream: MediaStream | null = null;
  handlers: MediaStreamManagerHandlers = {
    onNewTrack: () => {},
  }
  
  private setCurrentUserStream(stream: MediaStream){
    this.currentUserStream = stream;
  }

  getUserMedia(){
    return new Promise<MediaStream>((resolve, reject) => {
      window.navigator.getUserMedia({
        audio: false,
        video: {width: 640, height: 480},
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
  
  setUserMediaStream(stream: MediaStream){
    this.setCurrentUserStream(stream);
  }

  addRTCMediaStreamHandler(rtcPeerConnection: RTCPeerConnection, socketId: string){
    rtcPeerConnection.ontrack = (event) => {
      this.handlers.onNewTrack(event, socketId)
    };

    if(this.currentUserStream){
      rtcPeerConnection.addTrack(this.currentUserStream.getTracks()[0], this.currentUserStream);
    }
  }
}