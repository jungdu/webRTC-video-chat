import { nanoid } from "nanoid"
import UserManager from "./UserManager"

export interface Room {
  roomId: string;
  createdBy: string;
  roomName: string;
  userSocketIds: string[];
}

export class NoRoomError extends Error{
  constructor(roomId: string){
    const message = `There is no room with the id ${roomId}`
    super(message)
  }
}
export default class ChatRoomManager {
  userManager: UserManager = new UserManager();

  rooms:Room[] = [];
  joinedRoomById = new Map<string, string>()

  private isUserInRoom(room: Room, socketId: string){
    return !!room.userSocketIds.find(userSocketId => userSocketId === socketId);
  }

  private deleteRoom(emptyRoom: Room){
    this.rooms = this.rooms.filter(room => room !== emptyRoom);
  }

  createRooms({
    roomName,
    createdBy,
  }: Pick<Room, "roomName" | "createdBy">){

    const newRoom:Room = {
      roomId: nanoid(),
      roomName,
      createdBy,
      userSocketIds: [],
    };
    this.rooms.push(newRoom)
    return newRoom;
  }

  leaveJoinedRoom(socketId: string){
    const roomId = this.userManager.getJoinedRoomId(socketId);
    if(roomId){
      const leavedRoom = this.leaveRoom(roomId, socketId)
      if(!leavedRoom){
        return roomId;
      }
    }
    return null;
  }

  leaveRoom(roomId: string, socketId: string){
    const room = this.getRoom(roomId);
    if(!this.isUserInRoom(room, socketId)){
      throw new Error("User isn't on userSocketIds")
    }
    
    room.userSocketIds = room.userSocketIds.filter(userSocketId => userSocketId !== socketId);
    this.userManager.removeJoinedRoom(socketId, roomId);

    if(room.userSocketIds.length <= 0){
      this.deleteRoom(room);
      return null;
    }

    return room;
  }

  getRooms(){
    return this.rooms;
  }

  getRoom(roomId: string){
    const room = this.rooms.find(room => room.roomId === roomId);
    if(!room){
      throw new NoRoomError(roomId)
    }
    return room;
  }

  joinRoom(roomId: string, socketId: string){
    const room = this.getRoom(roomId);
    if(this.isUserInRoom(room, socketId)){
      throw new Error("User is already in the room")
    }

    room.userSocketIds.push(socketId);
    this.userManager.setJoinedRoom(socketId, roomId);
    return room;
  }
}