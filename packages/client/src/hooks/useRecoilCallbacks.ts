import { useRecoilCallback } from "recoil";
import { ChatUser, chatUserAtomFamily } from "recoilStates/chatStates";

export function useSetChatUser() {
	return useRecoilCallback<
		[userId: string, chatUserProperties: ChatUser],
		void
	>(({ set }) => (userId, chatUserProperties) => {
		set(chatUserAtomFamily(userId), chatUserProperties);
	});
}

export function useUpdateChatUser() {
	return useRecoilCallback<
		[userId: string, chatUserProperties: Partial<ChatUser>],
		void
	>(({ set }) => (userId, chatUserProperties) => {
		set(chatUserAtomFamily(userId), (chatUser) => ({
			...chatUser,
			...chatUserProperties
		}));
	});
}

export function useResetChatUser(){
  return useRecoilCallback<[userId: string], void>(({reset}) => (userId) => {
    reset(chatUserAtomFamily(userId));
  })
}