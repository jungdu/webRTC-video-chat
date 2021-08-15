import React from "react";
import styled from "@emotion/styled"
import { useRecoilValue } from "recoil";
import { chatMediaStreamsState } from "recoilStates/chatStates";
import ConnectedUser from "./ConnectedUser";

const ConnectedUsers: React.FC = () => {
  const chatMediaStreams = useRecoilValue(chatMediaStreamsState);
  console.log("chatMediaStreams :", chatMediaStreams);
  return <div>{chatMediaStreams.map(chatMediaStream => <ConnectedUser mediaStream={chatMediaStream}/>)}</div>;
};

export default ConnectedUsers;