import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { chatRoomManager, socketManager } from "managers";
import { useRecoilValue } from "recoil";
import { connectedSocketIdState } from "recoilStates/chatStates";

const Self = styled.div``;

const ChatRoom: React.FC = () => {
  const connectedSocketId = useRecoilValue(connectedSocketIdState)
  const { chatRoomId } = useParams<{
    chatRoomId?: string;
  }>();

  const joinRoom = async () => {
    if(chatRoomId){
      const joinedRoom = await chatRoomManager.joinRoom(socketManager.getCurrentSocket(), chatRoomId);
      console.log(joinedRoom);
    }
  }

  useEffect(() => {
    if(connectedSocketId){
      joinRoom();      
    }
  }, [connectedSocketId])

  return <Self>
    <h1>Chat Room</h1>
  </Self>;
};

export default ChatRoom;