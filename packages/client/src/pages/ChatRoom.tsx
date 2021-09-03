import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import {
	chatRoomManager,
	rtcConnectionManager,
	socketManager,
	currentUserManager,
} from "managers";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
	chatUsersIdListState,
	connectedSocketIdState,
} from "recoilStates/chatStates";
import StyledTextChat from "components/TextChat/StyledTextChat";
import StyledUserList from "components/UserList/StyledUserList";
import useRtcConnection from "hooks/useRtcConnection";
import StyledVideoList from "components/VideoChat/StyledVideoList";
import MediaSetting from "components/MediaSetting";
import { useResetChatUser, useSetChatUser } from "hooks/useRecoilCallbacks";
import { bottomHeightPx, RightPanelMode } from "./pageVariables";
import BottomPanel from "components/BottomPanel/BottomPanel";
import CloseIcon from "components/icons/CloseIcon";

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
`;

const RightPanel = styled.div`
	position: relative;
	width: 420px;
	background-color: #fff;
	border-radius: 5px;
	height: 100%;
	flex-shrink: 0;
`;

const PanelCloseButton = styled(CloseIcon)`
	position: absolute;
	width: 30px;
	height: 30px;
	top: 19px;
	right: 7px;
	cursor: pointer;
`;

const LeftPanel = styled.div`
	flex-grow: 1;
`;

const VideoList = styled(StyledVideoList)`
	height: 100%;
`;

const ChatRoom: React.FC = () => {
	useRtcConnection();
	const connectedSocketId = useRecoilValue(connectedSocketIdState);
	const [finishedSetting, setFinishedSetting] = useState<boolean>(false);
	const setChatUsersIdList = useSetRecoilState(chatUsersIdListState);
	const setChatUser = useSetChatUser();
	const resetChatUser = useResetChatUser();
	const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>(
		"messageList"
	);
	const rightPanelContent = useMemo(() => {
		const handleClosePanelButton = () => {
			setRightPanelMode("none");
		};

		switch (rightPanelMode) {
			case "messageList":
				return (
					<RightPanel>
						<TextChat />
						<PanelCloseButton onClick={handleClosePanelButton} />
					</RightPanel>
				);
			case "userList":
				return (
					<RightPanel>
						<UserList />
						<PanelCloseButton onClick={handleClosePanelButton} />
					</RightPanel>
				);
			case "none":
				return null;
			default:
				throw new Error("Invalid type of right panel mode");
		}
	}, [rightPanelMode]);

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
		setChatUser(connectedSocketId, {
			mediaStream: userMediaStream ? [userMediaStream] : null,
			userName: currentUserManager.getUserName(),
		});

		const otherUsersSocketId = joinedRoom.userSocketIds.filter(
			(userSocketId) => userSocketId !== connectedSocketId
		);

		otherUsersSocketId.forEach((socketId) => {
			rtcConnectionManager.connectPeer(currentSocket, socketId);
		});
	};

	const leaveRoom = () => {
		resetChatUser(connectedSocketId!);
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
				{rightPanelContent}
			</Content>
			<BottomPanel onSetRightPanelMode={setRightPanelMode} />
		</Self>
	) : (
		<MediaSetting
			onFinishMediaSetting={(mediaStream, userName) => {
				currentUserManager.initialize({
					mediaStream,
					userName,
				});
				setFinishedSetting(true);
			}}
		/>
	);
};

export default ChatRoom;
