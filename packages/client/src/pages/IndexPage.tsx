import React from "react";
import styled from "@emotion/styled";
import CreateRoomForm from "components/CreateRoomForm";
import useChatRoomList from "hooks/useChatRoomList";
import StyledRoomList from "components/RoomList/StyledRoomList";

const Self = styled.div`
  margin: 20px auto 0;
  max-width: 700px;
`;

const RoomList = styled(StyledRoomList)`
  width: 100%;
`

const SectionTitle = styled.div`
  margin: 30px 0 12px;
  font-size: 20px;
`

const IndexPage: React.FC = () => {
  useChatRoomList();

  return <Self>
    <SectionTitle>채팅방 생성</SectionTitle>
    <CreateRoomForm />
    <SectionTitle>채팅방 목록</SectionTitle>
    <RoomList/>
  </Self>;
};

export default IndexPage;