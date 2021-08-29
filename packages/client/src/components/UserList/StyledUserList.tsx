import React from "react";
import styled from "@emotion/styled";
import UserItem from "./UserItem";
import { useRecoilValue } from "recoil";
import { chatUsersIdListState } from "recoilStates/chatStates";
import { panelTopStyle } from "components/RoomList/styles";

interface UserListProps {
	className?: string;
}

const PanelTop = styled.div`
	${panelTopStyle}
`;

const Self = styled.div`
	box-sizing: border-box;
	padding: 0 20px;
`;

const StyledUserList: React.FC<UserListProps> = ({ className }) => {
	const chatUserIdList = useRecoilValue(chatUsersIdListState);
	console.log("chatUserIdList :", chatUserIdList);
	return (
		<Self className={className}>
			<PanelTop>유저 리스트({chatUserIdList.length})</PanelTop>
			{chatUserIdList.map((chatUsersId) => (
				<UserItem key={chatUsersId} userId={chatUsersId} />
			))}
		</Self>
	);
};

export default StyledUserList;
