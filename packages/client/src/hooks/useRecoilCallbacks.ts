import { useRecoilCallback } from "recoil";
import { chatUserAtomFamily } from "recoilStates/chatStates";

export function useSetChatUserMediaStream() {
	return useRecoilCallback<
		[userId: string, mediaStream: MediaStream[] | null],
		void
	>(({ set }) => (userId, mediaStream) => {
		set(chatUserAtomFamily(userId), {
			mediaStream,
		});
	});
}

export function useResetChatUser(){
  return useRecoilCallback<[userId: string], void>(({reset}) => (userId) => {
    reset(chatUserAtomFamily(userId));
  })
}