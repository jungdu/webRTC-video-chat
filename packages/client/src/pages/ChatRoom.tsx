import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { chatRoomManager, rtcConnectionManager, socketManager } from "managers";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { chatMediaStreamsState, connectedSocketIdState } from "recoilStates/chatStates";
import StyledTextChat from "components/TextChat/StyledTextChat";
import useRTCConnection from "hooks/useRTCConnection";
import StyledVideoList from "components/VideoChat/StyledVideoList";
import MediaSetting from "components/MediaSetting";

const bottomHeightPx = 50;

const Self = styled.div`
	height: 100vh;
	background: #202124;
`;

const Content = styled.div`
	display: flex;
	position: relative;
	height: calc(100% - ${bottomHeightPx}px);
`;

const BottomPanel = styled.div`
	height: ${bottomHeightPx}px;
`;

const TextChat = styled(StyledTextChat)`
	height: 100%;
`;

const RightPanel = styled.div`
	width: 420px;
	background-color: #fff;
	border-radius: 5px;
	height: 100%;
`;

const LeftPanel = styled.div`
	flex-grow: 1;
`;

const VideoList = styled(StyledVideoList)`
	height: 100%;
`;

const ChatRoom: React.FC = () => {
	useRTCConnection();
	const connectedSocketId = useRecoilValue(connectedSocketIdState);
	const [finishedMediaSetting, setFinishedMediaSetting] = useState<{
		finished: boolean;
		userMediaStream: MediaStream | null;
	}>({
		finished: false,
		userMediaStream: null
	});
	const setChatMediaStream = useSetRecoilState(chatMediaStreamsState);

	const { chatRoomId } = useParams<{
		chatRoomId?: string;
	}>();

	const joinRoom = async () => {
		if (chatRoomId) {
			const currentSocket = socketManager.getCurrentSocket();
			const joinedRoom = await chatRoomManager.joinRoom(
				socketManager.getCurrentSocket(),
				chatRoomId
			);

			const otherUsersSocketId = joinedRoom.userSocketIds.filter(userSocketId => userSocketId !== connectedSocketId);
			
			setChatMediaStream([
				{
					userId: "me",
					mediaStream: finishedMediaSetting.userMediaStream ? [finishedMediaSetting.userMediaStream]: null,
				},
				...otherUsersSocketId.map(socketId => {
					return {
						userId: socketId,
						mediaStream: null,
					}
				})
			]);

			otherUsersSocketId.forEach((socketId) => {
				rtcConnectionManager.connectPeer(currentSocket, socketId);
			});
		}
	};

	const leaveRoom = () => {
		if (chatRoomId) {
			chatRoomManager.leaveRoom(socketManager.getCurrentSocket(), chatRoomId);
		}
	};

	useEffect(() => {
		if (connectedSocketId && finishedMediaSetting.finished) {
			joinRoom();
			return () => {
				leaveRoom();
			};
		}
	}, [connectedSocketId, finishedMediaSetting]);

	return finishedMediaSetting.finished ? (
    <Self>
      <Content>
        <LeftPanel>
          <VideoList />
        </LeftPanel>
        <RightPanel>
          <TextChat />
        </RightPanel>
      </Content>
      <BottomPanel></BottomPanel>
    </Self>
  ) : (
    <MediaSetting onFinishMediaSetting={(mediaStream) => {
			setFinishedMediaSetting({
				finished: true,
				userMediaStream: mediaStream
			});
		}}/>
  );
};

export default ChatRoom;