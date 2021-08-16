import {io, Socket} from "socket.io-client"

export default class SocketManager {
  currentSocket:Socket|null = null;

  getCurrentSocket(){
    if(!this.currentSocket){
      throw new Error("No currentSocket to get")
    }
    return this.currentSocket;  
  }

  connect(){
      if(this.currentSocket){
        throw new Error("CurrentSocket is already exist");
      }

      const socketUrl = process.env.REACT_APP_SOCKET_URL;
      if(!socketUrl){
        throw new Error("REACT_APP_SOCKET_URL is undefined.");
      }

      const socket = io(socketUrl);
      this.currentSocket = socket;
      return socket;
  }
}