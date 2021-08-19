import React from "react";
import styled from "@emotion/styled"
import { useRecoilValue } from "recoil";
import { chatMediaStreamsState } from "recoilStates/chatStates";
import ConnectedUser from "./ConnectedUser";

const ConnectedUsers: React.FC = () => {
  const chatMediaStreams = useRecoilValue(chatMediaStreamsState);
  return <div>{chatMediaStreams.map(({userId, mediaStream}) => <ConnectedUser 
    key={userId}
    mediaStream={mediaStream}
  />)}</div>;
};

export default ConnectedUsers;