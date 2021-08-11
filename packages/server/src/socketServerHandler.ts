import socketIo, {Socket} from "socket.io"

export function addSocketHandler(socketServer: socketIo.Server){
  socketServer.on('connection', function(socket: Socket){
    console.log("new socket connected");

    socket.on('offer', arg => {
      console.log("offer:::arg :", arg)
      socket.to(arg.answerSocketId).emit('offer', arg);
    })

    socket.on('answer', arg => {
      console.log("answer:::arg :", arg)
      socket.to(arg.offerSocketId).emit('answer', arg);
    })

    socket.on('candidate', arg => {
      console.log("candidateFromOffer:::arg", arg);
      socket.to(arg.destSocketId).emit('candidate', arg)
    })
  })
}