export default class CurrentUserManager {
  userName: string|null = null;
  mediaStream: MediaStream| null = null;
  
  clear(){
    this.userName = null;
    this.mediaStream = null;
  }

  initialize({
    userName,
    mediaStream,
  }: {
    userName: string;
    mediaStream: MediaStream | null;
  }){
    this.setUserName(userName);
    this.setMediaStream(mediaStream);
  }

  getUserName(){
    if(!this.userName){
      throw new Error("No userName");
    }
    return this.userName;
  }

  getMediaStream(){
    return this.mediaStream;
  }

  setUserName(userName: string){
    if(this.userName){
      throw new Error("User name is already exist");
    }
    this.userName = userName;
  }

  setMediaStream(mediaStream:MediaStream | null){
    this.mediaStream = mediaStream;
  }
}