import {
	dataChannelManager,
	mediaStreamManager,
	rtcConnectionManager,
	socketManager,
} from "managers";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
	chatMediaStreamsState,
	chatMessagesState,
	connectedSocketIdState,
} from "recoilStates/chatStates";

// TODO 여기저기 메니저를 참조해서 번잡한데 구조적인 수정이 필요함
export default function useRTCConnection() {
	const connectedSocketId = useRecoilValue(connectedSocketIdState);
	const setChatMessage = useSetRecoilState(chatMessagesState);
	const setChatMediaStreams = useSetRecoilState(chatMediaStreamsState);
	const setChatMessages = useSetRecoilState(chatMessagesState);

	useEffect(() => {
		if (connectedSocketId) {
			const currentSocket = socketManager.getCurrentSocket();
			rtcConnectionManager.addSocketHandler(currentSocket);

			dataChannelManager.setHandlers({
				onMessage: function (event: MessageEvent<any>, socketId: string) {
					setChatMessage((messages) => [
						...messages,
						{
							userId: socketId,
							value: event.data,
							time: new Date().getTime(),
						},
					]);
				},
				onClose: function (socketId) {
					setChatMediaStreams(function(chatMediaStreams){
						return chatMediaStreams.filter(chatMediaStream => chatMediaStream.userId !== socketId)
					})		
				}
			});

			mediaStreamManager.setHandlers({
				onNewTrack: function (rtcTrackEvent, socketId) {
					setChatMediaStreams(function (chatMediaStreams) {
						const newStreams = [...rtcTrackEvent.streams];
						const newChatMediaStreams = [...chatMediaStreams];
						const idx = chatMediaStreams.findIndex(chatMediaStream => chatMediaStream.userId === socketId);
						if(idx === -1 ){
							newChatMediaStreams.push({
								userId: socketId,
								mediaStream: newStreams
							})
						}else{
							newChatMediaStreams[idx] = {
								...newChatMediaStreams[idx],
								mediaStream: newStreams
							}
						}
						return newChatMediaStreams;
					});
				},
			});

			return () => {
				rtcConnectionManager.deleteSocketHandler(currentSocket);
				rtcConnectionManager.closeConnections();
				setChatMediaStreams([]);
				setChatMessages([])
			};
		}
	}, [connectedSocketId]);
}
