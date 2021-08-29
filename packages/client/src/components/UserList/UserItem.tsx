import React from "react";
import styled from "@emotion/styled";
import { useRecoilValue } from "recoil";
import { chatUserAtomFamily } from "recoilStates/chatStates";
import VideoCamIconOrig from "components/icons/VideoCamIcon";

interface UserItemProps {
	userId: string;
}

const Self = styled.div`
	display: flex;
	align-items: center;
	padding: 10px;
	& + & {
		border-top: 1px solid #e9e9e9;
	}

	label: UserItem;
`;

const VideoCamIcon = styled(VideoCamIconOrig)`
	margin-left: auto;
	margin-right: 10px;
`;

const GreenDot = styled.div`
	background-color: #1fff0f;
	border-radius: 50%;
	width: 10px;
	height: 10px;
`;

const UserItem: React.FC<UserItemProps> = ({ userId }) => {
	const chatUser = useRecoilValue(chatUserAtomFamily(userId));

	return (
		<Self>
			{chatUser.userName || "Unknown"}
			<VideoCamIcon />
			<GreenDot />
		</Self>
	);
};

export default UserItem;
