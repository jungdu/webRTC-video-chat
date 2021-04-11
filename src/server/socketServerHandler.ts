import socketIo, {Socket} from "socket.io"

export function addSocketHandler(socketServer: socketIo.Server){
  socketServer.on('connection', function(socket: Socket){
    console.log("new socket connected");
  })  
}