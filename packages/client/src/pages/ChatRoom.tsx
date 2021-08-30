import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { chatRoomManager, rtcConnectionManager, socketManager, currentUserManager, mediaStreamManager } from "managers";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	chatUserAtomFamily,
	chatUsersIdListState,
	connectedSocketIdState,
} from "recoilStates/chatStates";
import StyledTextChat from "components/TextChat/StyledTextChat";
import StyledUserList from "components/UserList/StyledUserList";
import useRTCConnection from "hooks/useRTCConnection";
import StyledVideoList from "components/VideoChat/StyledVideoList";
import MediaSetting from "components/MediaSetting";
import { useResetChatUser, useSetChatUser } from "hooks/useRecoilCallbacks";
import { bottomHeightPx, RightPanelMode } from "./pageVariables";
import BottomPanel from "components/BottomPanel/BottomPanel";

const Self = styled.div`
	height: 100vh;
	background: #202124;
`;

const Content = styled.div`
	display: flex;
	position: relative;
	height: calc(100% - ${bottomHeightPx}px);
`;

const TextChat = styled(StyledTextChat)`
	height: 100%;
`;

const UserList = styled(StyledUserList)`
	height: 100%;
`

const RightPanel = styled.div`
	width: 420px;
	background-color: #fff;
	border-radius: 5px;
	height: 100%;
	flex-shrink: 0;
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
	const [finishedSetting, setFinishedSetting] = useState<boolean>(false);
	const setChatUsersIdList = useSetRecoilState(chatUsersIdListState);
	const setChatUser = useSetChatUser();
	const resetChatUser = useResetChatUser();
	const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>("userList");
	const rightPanelContent = useMemo(() => {
		switch(rightPanelMode){
			case "messageList":
				return <TextChat />
			case "userList": 
				return <UserList />
			default:
				throw new Error("Invalid type of right panel mode");
		}
	}, [rightPanelMode])
	
	const { chatRoomId } = useParams<{
		chatRoomId?: string;
	}>();

	const joinRoom = async () => {
		if (!chatRoomId) {
			throw new Error("No chatroom id");
		}

		if (!connectedSocketId) {
			throw new Error("No connectedSocketId");
		}

		const currentSocket = socketManager.getCurrentSocket();
		const joinedRoom = await chatRoomManager.joinRoom(
			socketManager.getCurrentSocket(),
			chatRoomId
		);
		setChatUsersIdList(joinedRoom.userSocketIds);

		const userMediaStream = currentUserManager.getMediaStream();
		setChatUser(
			connectedSocketId,
			{
				mediaStream: userMediaStream ? [userMediaStream] : null,
				userName: currentUserManager.getUserName(),
			}
		);
		
		const otherUsersSocketId = joinedRoom.userSocketIds.filter(
			(userSocketId) => userSocketId !== connectedSocketId
		);

		otherUsersSocketId.forEach((socketId) => {
			rtcConnectionManager.connectPeer(currentSocket, socketId);
		});
	};

	const leaveRoom = () => {
		resetChatUser(connectedSocketId!)
		if (chatRoomId) {
			chatRoomManager.leaveRoom(socketManager.getCurrentSocket(), chatRoomId);
		}
		currentUserManager.clear();
	};

	useEffect(() => {
		if (connectedSocketId && finishedSetting) {
			joinRoom();
			return () => {
				leaveRoom();
			};
		}
	}, [connectedSocketId, finishedSetting]);

	return finishedSetting ? (
		<Self>
			<Content>
				<LeftPanel>
					<VideoList />
				</LeftPanel>
				<RightPanel>
					{rightPanelContent}
				</RightPanel>
			</Content>
			<BottomPanel onSetRightPanelMode={setRightPanelMode}/>
		</Self>
	) : (
		<MediaSetting
			onFinishMediaSetting={(mediaStream, userName) => {
				currentUserManager.initialize({
					mediaStream,
					userName,
				})
				setFinishedSetting(true);
			}}
		/>
	);
};

export default ChatRoom;
