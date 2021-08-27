import {Socket} from "socket.io"
import { logger } from "../utils/logger";

export function addRTCConnectionHandlers(socket: Socket){
  logger.devLog("new socket connected");

  socket.on('offer', arg => {
    logger.devLog("offer from : " + socket.id)
    socket.to(arg.answerSocketId).emit('offer', arg);
  })

  socket.on('answer', arg => {
    logger.devLog("answer  from : " + socket.id)
    socket.to(arg.offerSocketId).emit('answer', arg);
  })

  socket.on('candidate', arg => {
    logger.devLog("candidateFromOffer from : " + socket.id);
    socket.to(arg.destSocketId).emit('candidate', arg)
  })
}