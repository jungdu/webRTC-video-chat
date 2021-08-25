import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { useRecoilState } from "recoil";
import { chatMessagesState } from "recoilStates/chatStates";
import MessageItem from "./MessageItem";
import { dataChannelManager } from "managers";
import TextInput from "components/common/TextInput";

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
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 20px 0 20px;
	font-size: 20px;
`;

const StyledTextChat: React.FC<TextChatProps> = ({ className }) => {
	const [chatMessages, setChatMessages] = useRecoilState(chatMessagesState);
	const messageListRef = useRef<HTMLDivElement>(null);

	const handleSendMessage = (message: string) => {
		setChatMessages((chatMessages) => [
			...chatMessages,
			{
      time: new Date().getTime(),
				userId: "Me",
				value: message,
			},
		]);
		dataChannelManager.broadcast({
			type: "ChatMessage",
			value: message,
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
				{chatMessages.map(({ time, userId, value }) => (
					<MessageItem userId={userId} time={time} value={value} />
				))}
			</MessageList>
			<TextInput onSubmit={handleSendMessage} submitButtonText="보내기"/>
		</Self>
	);
};

export default StyledTextChat;
