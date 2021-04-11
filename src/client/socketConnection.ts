import {io} from "socket.io-client";

export function connectSocket(socketServerUrl: string){
  const socket = io(socketServerUrl);
  return socket;
}