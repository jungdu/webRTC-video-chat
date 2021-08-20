import React from "react";
import dateformat from "dateformat"
import styled from "@emotion/styled";

import {MessageInfo} from "types"

interface MessageProps extends MessageInfo {

}

const Self = styled.div`
  padding-top: 10px;
`;

const StyledSender = styled.span`
  color: #666;
  font-size: 15px;
  margin-right: 5px;
  font-weight: bold;
`

const StyledTime = styled.span`
  color: #666;
  font-size: 15px;
`

const StyledMessageValue = styled.div`
  font-size: 18px;  
`

function formatTime(time: number){
  const date = new Date(time);
  return dateformat(date, "hh:MM TT");
}

const MessageItem: React.FC<MessageProps> = ({
  userId,
  value,
  time,
}) => {
  return <Self>
    <div>
      <StyledSender>{userId}</StyledSender>
      <StyledTime>{formatTime(time)}</StyledTime>
    </div>
    <StyledMessageValue>
      {value}
    </StyledMessageValue>
  </Self>;
};

export default MessageItem;