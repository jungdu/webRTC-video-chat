import React from "react";
import UserItem from "./UserItem";
import { ComponentMeta } from "@storybook/react";
import { RecoilRoot } from "recoil";
import { chatUserAtomFamily } from "recoilStates/chatStates";

export default {
	title: "Components/UserList/UserItem",
	component: UserItem,
} as ComponentMeta<typeof UserItem>;

const userId = "abcdef";

export const Default = () => (
	<RecoilRoot
		initializeState={({ set }) => {
			set(chatUserAtomFamily(userId), {
				mediaStream: null,
				userName: "유저 네임 001",
			});
		}}
	>
		<UserItem userId={userId} />
	</RecoilRoot>
);

export const WithoutUserName = () => (
	<RecoilRoot>
		<UserItem userId={"Invalid"} />
	</RecoilRoot>
);
