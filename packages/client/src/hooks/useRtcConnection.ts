import {
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
import { useResetChatUser, useSetChatUserMediaStream } from "./useRecoilCallbacks";

// TODO 여기저기 메니저를 참조해서 번잡한데 구조적인 수정이 필요함
export default function useRTCConnection() {
	const connectedSocketId = useRecoilValue(connectedSocketIdState);
	const setChatMessages = useSetRecoilState(chatMessagesState);
	const setChatUsersIdList = useSetRecoilState(chatUsersIdListState);

	const resetChatUser = useResetChatUser();
	const setChatUserMediaStream = useSetChatUserMediaStream();

	useEffect(() => {
		if (connectedSocketId) {
			const currentSocket = socketManager.getCurrentSocket();
			rtcConnectionManager.addSocketHandler(currentSocket);

			dataChannelManager.setHandlers({
				onOpen: function(socketId){
					setChatUsersIdList((chatUsersIdList) => pushUniqueItem(chatUsersIdList, socketId))
				},
				onMessage: function (message: DataChannelMessage, socketId: string) {
					switch(message.type){
						case "ChatMessage":
						setChatMessages((messages) => [
							...messages,
							{
								userId: socketId,
								value: message.value,
								time: new Date().getTime(),
							},
						]);
						break;
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
					setChatUserMediaStream(socketId, streams);
				},
			});

			return () => {
				rtcConnectionManager.deleteSocketHandler(currentSocket);
				rtcConnectionManager.closeConnections();
				setChatMessages([])
			};
		}
	}, [connectedSocketId]);
}
