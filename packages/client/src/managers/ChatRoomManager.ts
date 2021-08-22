import { TypedClientSocket, Room } from "@videochat/common";

interface ChatRoomHandlers {
  onUpdateRoom?: (room: Room[]) => void;
}

export default class ChatRoomManager{
  private rooms: Room[] = [];
  private handlers: ChatRoomHandlers = {}

  private setRooms(rooms: Room[]){
    this.rooms = rooms;

    if(this.handlers.onUpdateRoom){
      this.handlers.onUpdateRoom(rooms)
    }
  }

  addSocketHandler(socket: TypedClientSocket){
    socket.on('createdRoom', (newRoom) => {
      this.setRooms(this.rooms.concat(newRoom));
    });
    
    socket.on('deletedRoom', (roomId) => {
      this.setRooms(this.rooms.filter(room => room.roomId !== roomId));
    });
  }

  createRoom(socket: TypedClientSocket, roomName: string){
    return new Promise<Room>(resolve => {
      socket.emit('createRoom', {roomName}, (room) => {
        resolve(room)
      })
    })
  }

  joinRoom(socket: TypedClientSocket, roomId: string){
    return new Promise<Room>((resolve, reject) => {
      socket.emit('joinRoom', {roomId}, (room) => {
        if(room){
          resolve(room);
        }else{
          reject("No room to join")
        }
      });
    })
  }

  leaveRoom(socket: TypedClientSocket, roomId: string){
    socket.emit('leaveRoom', {roomId});
  }

  removeSocketHandler(socket: TypedClientSocket){
    socket.off('createdRoom');
    socket.off('deletedRoom');
  }

  setHandler(handlers: ChatRoomHandlers){
    this.handlers = handlers;
  }

  subscribe(socket: TypedClientSocket){
    this.addSocketHandler(socket);
    socket.emit("joinLobby", cb => {
      this.setRooms(cb);
    })
  }

  unsubscribe(socket: TypedClientSocket){
    this.removeSocketHandler(socket);
    socket.emit("leaveLobby")
    this.setRooms([]);
  }
}