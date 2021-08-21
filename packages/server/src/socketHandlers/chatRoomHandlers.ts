import ChatRoomManager from "../managers/ChatRoomManager"
import {TypedServerSocket, TypedServerSocketServer} from "@videochat/common"

const lobby = "lobby";

export function addChatRoomHandlers(socket: TypedServerSocket, socketServer: TypedServerSocketServer, chatRoomManager: ChatRoomManager){
  socket.on("createRoom", (msg, cb) => {
    const newRoom = chatRoomManager.createRooms({
      roomName: msg.roomName,
      createdBy: socket.id,
    });

    socketServer.to(lobby).emit("createdRoom", newRoom);

    if(cb){
      cb(newRoom);
    }
  });

  socket.on("joinRoom", (msg, cb) => {
    try{
      const room = chatRoomManager.joinRoom(msg.roomId, socket.id);
      console.log("room :", room)
      if(cb){
        cb(room);
      }
    }catch(e){
      if(cb){
        cb(null);
      }
    }
  })

  socket.on("joinLobby", (cb) =>{
    socket.join(lobby);
    const rooms = chatRoomManager.getRooms();
    cb(rooms);
  })

  socket.on("getRooms", (cb) => {
    const rooms = chatRoomManager.getRooms();
    if(cb){
      cb(rooms);
    }
  })

  socket.on("leaveRoom", (msg) => {
    const room = chatRoomManager.leaveRoom(msg.roomId, socket.id);
    if(!room){
      socket.to(lobby).emit("deletedRoom", msg.roomId);
    }
  });

  socket.on("leaveLobby", () => {
    socket.join(lobby);
  })

  socket.on("disconnect", () => {
    chatRoomManager.leaveJoinedRoom(socket.id)
  })
}