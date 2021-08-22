interface UserInfo {
  roomId?: string;
}

export default class UserManager {
  users = new Map<string, UserInfo>();
  
  setJoinedRoom(socketId: string, roomId: string){
    const userInfo = this.users.get(socketId);
    if(userInfo && userInfo.roomId){
      throw new Error("User already joined a room");
    }

    this.users.set(socketId, {...userInfo, roomId});
  }

  removeJoinedRoom(socketId: string, roomId: string){
    const userInfo = this.users.get(socketId);

    if(userInfo && userInfo.roomId && userInfo.roomId === roomId){
      this.users.set(socketId, {...userInfo, roomId: undefined})
    }else{
      throw new Error("Invalid roomId to remove userInfo: ");
    }
  }

  getJoinedRoomId(socketId: string){
    const userInfo = this.users.get(socketId);
    if(userInfo && userInfo.roomId){
      return userInfo.roomId;
    }
    return null;
  }
}