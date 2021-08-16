import useInput from "hooks/useInput";
import { chatRoomManager, socketManager } from "managers";
import React from "react";

// import {useHistory} from "react-router-dom"

const CreateRoomForm: React.FC = () => {
  const {
    value: roomName,
    handleChange
  } = useInput();

  const handleClickCreateRoom = () => {
    chatRoomManager.createRoom(socketManager.getCurrentSocket(), roomName)
  }

  return <div>
    <input type="text" onChange={handleChange}/>
    <button onClick={handleClickCreateRoom}>방 생성</button>
  </div>;
};

export default CreateRoomForm;