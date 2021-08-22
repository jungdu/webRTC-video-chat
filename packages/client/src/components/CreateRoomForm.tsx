import useInput from "hooks/useInput";
import { chatRoomManager, socketManager } from "managers";
import React from "react";
import { useHistory } from "react-router-dom";
import TextInput from "./common/TextInput";

const CreateRoomForm: React.FC = () => {
  const history = useHistory();

  const handleClickCreateRoom = (roomName: string) => {
    if(roomName){
      chatRoomManager.createRoom(socketManager.getCurrentSocket(), roomName).then(room => {
        history.push(`/chat-room/${room.roomId}`)
      })
    }
  }

  return <TextInput onSubmit={handleClickCreateRoom} submitButtonText="방 생성" />;
};

export default CreateRoomForm;