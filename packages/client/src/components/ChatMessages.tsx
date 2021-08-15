import React from "react";
import { useRecoilValue } from "recoil";
import { chatMessagesState } from "recoilStates/chatStates";

const ChatMessages: React.FC = () => {
  const chatMessages = useRecoilValue(chatMessagesState);

  return <ul>
  {chatMessages.map(({socketId, message}) => <li>
    {socketId}: {message}
  </li>)}
</ul>;
};

export default ChatMessages;