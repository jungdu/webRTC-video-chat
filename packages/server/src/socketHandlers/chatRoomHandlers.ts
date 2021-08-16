import {Socket, Server as SocketIoServer} from "socket.io"
import ChatRoomManager, { Room } from "../managers/ChatRoomManager"
import {TypedServerSocket} from "@videochat/common"

interface CreateRoomMsg {
  roomName: string;
}

interface JoinRoomMsg {
  roomId: string;
}

interface GetRoomMsg {
  roomId: string;
}

interface ExitRoomMsg{
  roomId: string;
}

export function addChatRoomHandlers(socket: TypedServerSocket, socketServer: SocketIoServer, chatRoomManager: ChatRoomManager){
  socket.on("createRoom", (msg, cb) => {
    const newRoom = chatRoomManager.createRooms({
      roomName: msg.roomName,
      createdBy: socket.id,
    });

    socketServer.to("lobby").emit("newRoom", newRoom);

    if(cb){
      cb(newRoom);
    }
  });

  socket.on("joinRoom", (msg, cb) => {
    const room = chatRoomManager.joinRoom(msg.roomId, socket.id);
    if(cb){
      cb(room);
    }
  })

  socket.on("joinLobby", (cb) =>{
    socket.join("lobby");
    const rooms = chatRoomManager.getRooms();
    cb(rooms);
  })

  socket.on("getRooms", (cb: (room: Room[]) => void) => {
    const rooms = chatRoomManager.getRooms();
    if(cb){
      cb(rooms);
    }
  })

  socket.on("exitRoom", (msg: ExitRoomMsg) => {
    chatRoomManager.exitRoom(msg.roomId, socket.id);
  });
}