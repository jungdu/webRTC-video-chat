import { nanoid } from "nanoid"

export interface Room {
  roomId: string;
  createdBy: string;
  roomName: string;
  userSocketIds: string[];
}

export default class ChatRoomManager {
  rooms:Room[] = [];

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
      userSocketIds: [createdBy],
    };
    this.rooms.push(newRoom)
    return newRoom;
  }

  leaveRoom(roomId: string, socketId: string){
    const room = this.getRoom(roomId);
    if(!this.isUserInRoom(room, socketId)){
      throw new Error("User isn't on userSocketIds")
    }
    
    room.userSocketIds = room.userSocketIds.filter(userSocketId => userSocketId !== socketId);
    
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
      throw new Error(`No room roomId: ${roomId}`)
    }
    return room;
  }

  joinRoom(roomId: string, socketId: string){
    const room = this.getRoom(roomId);
    if(this.isUserInRoom(room, socketId)){
      throw new Error("User is already in the room")
    }

    room.userSocketIds.push(socketId);
    return room;
  }
}