import {io, Socket} from "socket.io-client";

interface SocketHandlers {
  onUpdateSocketId?: (id: string | null) => void;
}

export default class SocketManager{
  _socket: null | Socket = null;
  socketId: null | string = "";
  handlers: SocketHandlers = {};

  get socket(){
    if(this._socket){
      return this._socket;
    }else{
      throw new Error("No socket");
    }
  }

  addSocketHandler(socket: Socket){
    socket.on("connect", () => {
      this.setSocketId(socket.id);
      console.log(`socket connected (socketId: ${socket.id})`);
    });
    socket.on('disconnect', () => {
      this.setSocketId(null);
      console.log("socket disconnected");
    });
  }

  connectSocket(url: string){
    const socket = io(url);
    this.setSocket(socket);
    return socket;
  }

  init(socketUrl:string, handlers:SocketHandlers = {}){
    this.handlers = handlers;
    this.connectSocket(socketUrl);
    this.addSocketHandler(this.socket);
    return this.socket;
  }

  setSocket(socket: Socket){
    this._socket = socket;
  }

  setSocketId(id: string | null){
    this.socketId = id;
    if(this.handlers.onUpdateSocketId){
      this.handlers.onUpdateSocketId(id);
    }
  }
}