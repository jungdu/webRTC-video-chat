import {Socket} from "socket.io-client"

export function addSocketHandler(socket: Socket){
  socket.on("connect", () => {
    console.log("socket connected...");
  })
}