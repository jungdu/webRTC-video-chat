import { socketManager } from "managers";
import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { connectedSocketIdState } from "recoilStates/chatStates";

export default function useSocketConnection(){
  const [connectedSocketId, setConnectedSocketId] = useRecoilState(connectedSocketIdState);

  useEffect(() => {
    if(connectedSocketId){
      throw new Error("connectedSocketId is already exist")
    }

    const socket = socketManager.connect()
    socket.on('connect', () => {
      setConnectedSocketId(socket.id);
    })

    socket.on('disconnect', () => {
      setConnectedSocketId(null);
    })
  }, []);
}