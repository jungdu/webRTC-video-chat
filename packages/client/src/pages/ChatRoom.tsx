import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { chatRoomManager, rtcConnectionManager, socketManager } from "managers";
import { useRecoilValue } from "recoil";
import { connectedSocketIdState } from "recoilStates/chatStates";
import StyledTextChat from "components/TextChat/StyledTextChat";
import useRTCConnection from "hooks/useRTCConnection";
import StyledVideoList from "components/VideoChat/StyledVideoList";

const bottomHeightPx = 50;

const Self = styled.div`
  height: 100vh;
  background: #202124;
`;

const Content = styled.div`
  display: flex;
  position: relative;
  height: calc(100% - ${bottomHeightPx}px);
`

const BottomPanel = styled.div`
  height: ${bottomHeightPx}px;
`

const TextChat = styled(StyledTextChat)`
  height: 100%;
`

const RightPanel = styled.div`
  width: 420px;
  background-color: #fff;
  border-radius: 5px;
  height: 100%;
`

const LeftPanel = styled.div`
  flex-grow: 1;
`

const VideoList = styled(StyledVideoList)`
  height: 100%;
`

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
    <Content>
      <LeftPanel>
        <VideoList />
      </LeftPanel>
      <RightPanel>
        <TextChat />
      </RightPanel>
    </Content>
    <BottomPanel>

    </BottomPanel>
  </Self>;
};

export default ChatRoom;