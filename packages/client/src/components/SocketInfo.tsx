import React from "react";
import { useRecoilValue } from "recoil";
import { connectedSocketIdState } from "recoilStates/chatStates";

const SocketInfo: React.FC = () => {
  const socketId = useRecoilValue(connectedSocketIdState);

  return <div>
    <p>socket url: {process.env.REACT_APP_SOCKET_URL}</p>
    <p>socket id: {socketId}</p>
  </div>;
};

export default SocketInfo;