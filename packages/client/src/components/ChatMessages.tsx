import React from "react";
import { useRecoilValue } from "recoil";
import { chatMessagesState } from "recoilStates/chatStates";

const ChatMessages: React.FC = () => {
  const chatMessages = useRecoilValue(chatMessagesState);

  return <ul>
  {chatMessages.map(({userId, value}) => <li>
    {userId}: {value}
  </li>)}
</ul>;
};

export default ChatMessages;