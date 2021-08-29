import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { useRecoilState } from "recoil";
import { chatMessagesState } from "recoilStates/chatStates";
import MessageItem from "./MessageItem";
import { currentUserManager, dataChannelManager } from "managers";
import TextInput from "components/common/TextInput";
import { panelTopStyle } from "components/RoomList/styles";

interface TextChatProps {
	className?: string;
}

const Self = styled.div`
	display: flex;
	flex-direction: column;
	padding: 0 20px 20px;
	box-sizing: border-box;
`;

const MessageList = styled.div`
	flex-grow: 1;
	flex-shrink: 1;
	overflow: scroll;
	margin-bottom: 12px;
`;

const PanelTop = styled.div`
	${panelTopStyle}
`;

const StyledTextChat: React.FC<TextChatProps> = ({ className }) => {
	const [chatMessages, setChatMessages] = useRecoilState(chatMessagesState);
	const messageListRef = useRef<HTMLDivElement>(null);

	const handleSendMessage = (message: string) => {
		const currentUserName = currentUserManager.getUserName();
		setChatMessages((chatMessages) => [
			...chatMessages,
			{
      time: new Date().getTime(),
				userName: currentUserName,
				value: message,
			},
		]);
		dataChannelManager.broadcast({
			type: "ChatMessage",
			value: message,
			userName: currentUserName,
		});
	};

	useEffect(() => {
		const messageListCurrent = messageListRef.current;
		if (messageListCurrent) {
			messageListCurrent.scrollTop = messageListCurrent.scrollHeight;
		}
	}, [chatMessages]);

	return (
		<Self className={className}>
			<PanelTop>메시지</PanelTop>
			<MessageList ref={messageListRef}>
				{chatMessages.map(({ time, userName, value }) => (
					<MessageItem userName={userName} time={time} value={value} />
				))}
			</MessageList>
			<TextInput onSubmit={handleSendMessage} submitButtonText="보내기"/>
		</Self>
	);
};

export default StyledTextChat;
