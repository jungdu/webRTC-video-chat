import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { chatRoomManager, rtcConnectionManager, socketManager } from "managers";
import { useRecoilValue } from "recoil";
import { connectedSocketIdState } from "recoilStates/chatStates";
import StyledTextChat from "components/TextChat/StyledTextChat";
import useRTCConnection from "hooks/useRTCConnection";

const Self = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #202124;
`;

const Content = styled.div`
  display: flex;
  position: relative;
  flex-grow: 1;
`

const BottomPanel = styled.div`
  height: 50px;
`

const TextChat = styled(StyledTextChat)`
  height: 100%;
`

const RightPanel = styled.div`
  width: 420px;
  background-color: #fff;
  border-radius: 5px;
  margin-top: 15px;
  margin-right: 12px;
`

const LeftPanel = styled.div`
  flex-grow: 1;
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