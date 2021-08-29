import {
	currentUserManager,
	dataChannelManager,
	mediaStreamManager,
	rtcConnectionManager,
	socketManager,
} from "managers";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
	chatMessagesState,
	chatUsersIdListState,
	connectedSocketIdState,
} from "recoilStates/chatStates";
import { DataChannelMessage } from "types";
import { pushUniqueItem } from "utils";
import { useResetChatUser, useUpdateChatUser } from "./useRecoilCallbacks";

// TODO 여기저기 메니저를 참조해서 번잡한데 구조적인 수정이 필요함
export default function useRTCConnection() {
	const connectedSocketId = useRecoilValue(connectedSocketIdState);
	const setChatMessages = useSetRecoilState(chatMessagesState);
	const setChatUsersIdList = useSetRecoilState(chatUsersIdListState);

	const resetChatUser = useResetChatUser();
	const updateChatUser = useUpdateChatUser();

	useEffect(() => {
		if (connectedSocketId) {
			const currentSocket = socketManager.getCurrentSocket();
			rtcConnectionManager.addSocketHandler(currentSocket);

			dataChannelManager.setHandlers({
				onOpen: function(socketId, dataChannel){
					setChatUsersIdList((chatUsersIdList) => pushUniqueItem(chatUsersIdList, socketId))
					dataChannelManager.sendMessage(dataChannel, {
						type: "SetUserName",
						value: currentUserManager.getUserName(),
					})
				},
				onMessage: function (message: DataChannelMessage, socketId: string) {
					switch(message.type){
						case "ChatMessage":
						setChatMessages((messages) => [
							...messages,
							{
								userName: message.userName,
								value: message.value,
								time: new Date().getTime(),
							},
						]);
						break;
						case "SetUserName":
							updateChatUser(socketId, {
								userName: message.value
							})
						break;
						default:
							throw new Error("Undefined type of message");
					}
				},
				onClose: function (socketId) {
					setChatUsersIdList((idList) => idList.filter(id => id !== socketId));
					resetChatUser(socketId)
				}
			});

			mediaStreamManager.setHandlers({
				onNewTrack: function (rtcTrackEvent, socketId) {
					const streams = [...rtcTrackEvent.streams]
					updateChatUser(socketId, {
						mediaStream:streams,
					});
				},
			});

			return () => {
				rtcConnectionManager.closeConnections();
				rtcConnectionManager.deleteSocketHandler(currentSocket);
				setChatMessages([])
			};
		}
	}, [connectedSocketId]);
}
