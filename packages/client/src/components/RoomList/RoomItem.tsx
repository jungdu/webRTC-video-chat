import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";
import { roomItemStyle } from "./styles";

interface RoomItemProps{
  roomId: string;
  roomName: string;
}

const StyledLink = styled(Link)`
  ${roomItemStyle}
`

const RoomItem: React.FC<RoomItemProps> = ({
  roomId,
  roomName,
}) => {
  return <StyledLink to={`/chat-room/${roomId}`}>
    {roomName}
  </StyledLink>;
};

export default RoomItem;