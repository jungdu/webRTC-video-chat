import {Socket} from "socket.io-client"

export function addSocketHandler(socket: Socket){
  let socketId: string = "";

  socket.on("connect", () => {
    socketId = socket.id;
    console.log("socket connected... socketId:", socket.id);
  });
}