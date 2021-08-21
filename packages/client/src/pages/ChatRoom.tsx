import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { chatRoomManager, rtcConnectionManager, socketManager } from "managers";
import { useRecoilValue } from "recoil";
import { connectedSocketIdState } from "recoilStates/chatStates";
import TextChat from "components/TextChat";
import useRTCConnection from "hooks/useRTCConnection";

const Self = styled.div``;

const ChatRoom: React.FC = () => {
  useRTCConnection();
  const connectedSocketId = useRecoilValue(connectedSocketIdState)
  
  const { chatRoomId } = useParams<{
    chatRoomId?: string;
  }>();

  const joinRoom = async () => {
    if(chatRoomId){
      const currentSocket = socketManager.getCurrentSocket();
      const joinedRoom = await chatRoomManager.joinRoom(socketManager.getCurrentSocket(), chatRoomId);
      joinedRoom.userSocketIds.forEach((socketId) => {
        rtcConnectionManager.connectPeer(currentSocket, socketId);
      })
    }
  }

  useEffect(() => {
    if(connectedSocketId){
      joinRoom();      
    }
  }, [connectedSocketId])

  return <Self>
    <h1>Chat Room</h1>
    <TextChat />
  </Self>;
};

export default ChatRoom;