import React from "react";
import StyledUserList from "./StyledUserList";
import { ComponentMeta } from "@storybook/react";
import { RecoilRoot } from "recoil";
import styled from "@emotion/styled";
import {
	chatUserAtomFamily,
	chatUsersIdListState,
} from "recoilStates/chatStates";

export default {
	title: "Components/StyledUserList",
	component: StyledUserList,
} as ComponentMeta<typeof StyledUserList>;

const UserList = styled(StyledUserList)`
	height: 500px;
	width: 300px;
	border: 1px solid black;
`;

export const Default = () => (
	<RecoilRoot
		initializeState={({ set }) => {
			const userA = {
				userId: "a",
				userName: "유저 A",
			};
			const userB = {
				userId: "b",
				userName: "유저 B",
			};

			set(chatUsersIdListState, [userA.userId, userB.userId, "unknownUserId"]);
			set(chatUserAtomFamily(userA.userId), {
				userName: userA.userName,
				mediaStream: null,
			});
			set(chatUserAtomFamily(userB.userId), {
				userName: userB.userName,
				mediaStream: null,
			});
		}}
	>
		<UserList />
	</RecoilRoot>
);
