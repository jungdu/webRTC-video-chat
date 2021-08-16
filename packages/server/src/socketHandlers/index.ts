import {Socket, Server as socketIoServer} from "socket.io"
import ChatRoomManager from "../managers/ChatRoomManager";
import { addChatRoomHandlers } from "./chatRoomHandlers";
import { addRTCConnectionHandlers } from "./rtcConnectionHandlers"

export function addSocketHandler(socketServer: socketIoServer){
  const chatRoomManager = new ChatRoomManager();
  socketServer.on('connection', function(socket: Socket){
    addRTCConnectionHandlers(socket);
    addChatRoomHandlers(socket, socketServer, chatRoomManager);
  })
}