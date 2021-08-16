import {Socket, Server as SocketIoServer} from "socket.io"
import ChatRoomManager, { Room } from "../managers/ChatRoomManager"

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

export function addChatRoomHandlers(socket: Socket, socketServer: SocketIoServer, chatRoomManager: ChatRoomManager){
  socket.on("createRoom", (msg: CreateRoomMsg, cb?: (room:Room) => {}) => {
    const newRoom = chatRoomManager.createRooms({
      roomName: msg.roomName,
      createdBy: socket.id,
    });

    socketServer.to("lobby").emit("newRoom", newRoom);

    if(cb){
      cb(newRoom);
    }
  });

  socket.on("joinRoom", (msg: JoinRoomMsg, cb?: (room: Room) => void) => {
    const room = chatRoomManager.joinRoom(msg.roomId, socket.id);
    if(cb){
      cb(room);
    }
  })

  socket.on("joinLobby", (callback: (rooms:Room[]) => void) =>{
    socket.join("lobby");
    const rooms = chatRoomManager.getRooms();
    callback(rooms);
  })

  socket.on("getRooms", (cb: (room: Room[]) => void) => {
    const rooms = chatRoomManager.getRooms();
    if(cb){
      cb(rooms);
    }
  })

  socket.on("getRoomInfo", (msg: GetRoomMsg) => {
    const room = chatRoomManager.getRoom(msg.roomId);
    socket.emit("roomInfo", room);
  })

  socket.on("exitRoom", (msg: ExitRoomMsg) => {
    chatRoomManager.exitRoom(msg.roomId, socket.id);
  });
}