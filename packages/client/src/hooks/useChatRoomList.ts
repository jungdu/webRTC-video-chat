import { chatRoomManager, socketManager } from "managers";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { chatRoomsState, connectedSocketIdState } from "recoilStates/chatStates";


export default function useChatRoomList(){
  const connectedSocketId = useRecoilValue(connectedSocketIdState);
  const setChatRooms = useSetRecoilState(chatRoomsState);

  useEffect(() => {
    chatRoomManager.setHandler({
      onUpdateRoom: (rooms) => {
        setChatRooms(rooms);
      }
    })
  }, [])

  useEffect(() => {
    if(connectedSocketId){
      const currentSocket = socketManager.getCurrentSocket();
      chatRoomManager.subscribe(currentSocket);
      return () => {
        setChatRooms([]);
        chatRoomManager.unsubscribe(currentSocket)
      };
    }
  }, [connectedSocketId])
}