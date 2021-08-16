import React from "react";
import styled from "@emotion/styled";
import ChatRoomList from "components/ChatRoomList";
import CreateRoomForm from "components/CreateRoomForm";
import useChatRoomList from "hooks/useChatRoomList";

const Self = styled.div``;

const IndexPage: React.FC = () => {
  useChatRoomList();

  return <Self>
    <h1>index page</h1>
    <CreateRoomForm />
    <ChatRoomList />
  </Self>;
};

export default IndexPage;