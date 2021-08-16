import React from "react";
import styled from "@emotion/styled";
import SocketInfo from "components/SocketInfo";
import ChatMessages from "components/ChatMessages";
import UserMediaPreview from "components/UserMediaPreview";
import ConnectedUsers from "components/ConnectedUsers";
import { dataChannelManager, rtcConnectionManager, socketManager } from "managers";
import useInput from "hooks/useInput";

const ConnectionTest: React.FC = () => {
  const {
    value: targetId,
    handleChange: handleTargetIdChange
  } = useInput();
  const {
    value: message,
    handleChange: handleMessageChange
  } = useInput();

  const handleClickConnect = () => {
    const socket = socketManager.getCurrentSocket();
    rtcConnectionManager.connectPeer(socket, targetId);
  }

  const handleClickSend = () => {
    dataChannelManager.broadcast(message);
  }

	return (
		<div>
			<h1>Chat App</h1>
			<SocketInfo />
			<p>
				<input type="text" value={targetId} onChange={handleTargetIdChange} />
				<button onClick={handleClickConnect}>CONNECT</button>
			</p>
			<p>
				<input type="text" value={message} onChange={handleMessageChange} />
				<button onClick={handleClickSend}>SEND</button>
			</p>
			<ChatMessages />
			<UserMediaPreview />
			<ConnectedUsers />
		</div>
	);
};

export default ConnectionTest;
