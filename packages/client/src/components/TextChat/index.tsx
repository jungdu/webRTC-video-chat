import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { useRecoilState } from "recoil";
import { chatMessagesState } from "recoilStates/chatStates";
import MessageInput from "./MessageInput";
import MessageItem from "./MessageItem";
import { dataChannelManager } from "managers";

const Self = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 600px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
`;

const MessageList = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  overflow: scroll;
  margin-bottom: 12px;
`

const TextChat: React.FC = () => {
  const [chatMessages, setChatMessages] = useRecoilState(chatMessagesState);
  const messageListRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (message: string) => {
    setChatMessages((chatMessages) => [...chatMessages, {
      time: new Date().getTime(),
      userId: "Me",
      value: message,
    }])
    dataChannelManager.broadcast(message);
  }

  useEffect(() => {
    const messageListCurrent = messageListRef.current;
    if(messageListCurrent){
      messageListCurrent.scrollTop = messageListCurrent.scrollHeight;
    }
  }, [chatMessages])

  return <Self>
    <MessageList ref={messageListRef}>
      {chatMessages.map(({time, userId, value}) => <MessageItem 
        userId={userId}
        time={time}
        value={value}
      />)}
    </MessageList>
    <MessageInput
      sendMessage={handleSendMessage}
    />
  </Self>;
};

export default TextChat;