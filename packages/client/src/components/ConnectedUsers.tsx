import React from "react";
import styled from "@emotion/styled"
import { useRecoilValue } from "recoil";
import { chatMediaStreamsState } from "recoilStates/chatStates";
import ConnectedUser from "./ConnectedUser";

const ConnectedUsers: React.FC = () => {
  const chatMediaStreams = useRecoilValue(chatMediaStreamsState);
  console.log("chatMediaStreams :", chatMediaStreams);
  return <div>{chatMediaStreams.map(({socketId, mediaStream}) => <ConnectedUser 
    key={socketId}
    mediaStream={mediaStream}
  />)}</div>;
};

export default ConnectedUsers;