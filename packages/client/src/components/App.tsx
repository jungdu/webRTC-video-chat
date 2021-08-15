import React from 'react';
import {rtcConnectionManager, socketManager, dataChannelManager} from "managers"
import useInput from "hooks/useInput"
import useSocketConnection from 'hooks/useSocketConnection';
import useRtcConnection from 'hooks/useRtcConnection';
import UserMediaPreview from './UserMediaPreview';
import ConnectedUsers from './ConnectedUsers';
import ChatMessages from './ChatMessages';
import SocketInfo from './SocketInfo';


function App() {
  useSocketConnection();
  useRtcConnection();

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
    if(socket){
      rtcConnectionManager.connectPeer(socket, targetId);
    }
  }

  const handleClickSend = () => {
    dataChannelManager.broadcast(message);
  }

  return (
    <>
      <h1>Chat App</h1>
      <SocketInfo/>
      <p>
        <input type="text" value={targetId} onChange={handleTargetIdChange}/>
        <button onClick={handleClickConnect}>CONNECT</button>
      </p>
      <p>
        <input type="text" value={message} onChange={handleMessageChange}/>
        <button onClick={handleClickSend}>SEND</button>
      </p>
      <ChatMessages/>
      <UserMediaPreview/>
      <ConnectedUsers/>
    </>
  );
}

export default App;
