import CurrentUserManager from "./CurrentUserManager";

interface MediaStreamManagerHandlers {
  onNewTrack: (trackEvent: RTCTrackEvent, socketId: string) => void;

}

export default class MediaStreamManager {
  currentUserManager:CurrentUserManager;
  handlers: MediaStreamManagerHandlers = {
    onNewTrack: () => {},
  }

  constructor(currentUserManager: CurrentUserManager){
    this.currentUserManager = currentUserManager;    
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
  
  addRTCMediaStreamHandler(rtcPeerConnection: RTCPeerConnection, socketId: string){
    rtcPeerConnection.ontrack = (event) => {
      this.handlers.onNewTrack(event, socketId)
    };

    const currentUserStream = this.currentUserManager.getMediaStream();
    if(currentUserStream){
      rtcPeerConnection.addTrack(currentUserStream.getTracks()[0], currentUserStream);
    }else{
      // RTC offer가 currentUserStream이 없는 경우에 addTransceiver를 추가해주지 않으면 stream들을 받지 못함.
      rtcPeerConnection.addTransceiver("video");
    }
  }
}