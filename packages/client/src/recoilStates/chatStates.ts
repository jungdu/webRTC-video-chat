import { atom, atomFamily, selector } from "recoil";
import { Room } from "@videochat/common";
import { MessageInfo } from "types";

export interface ChatUser {
  mediaStream: null | MediaStream[];
  userName: null | string;
}

export const connectedSocketIdState = atom<string | null>({
  key: "connectedSocketId",
  default: null,
});

export const chatMessagesState = atom<MessageInfo[]>({
  key: "messagesState",
  default: []
})

export const chatUsersIdListState = atom<string[]>({
  key: "chatUsersIdListState",
  default: [],
})

export const chatUserAtomFamily = atomFamily<ChatUser, {}>({
  key: "chatUserAtomFamily",
  default: {
    mediaStream: null,
    userName: null
  }
})

export const chatRoomsState = atom<Room[]>({
  key: "chatRoomsState",
  default: []
});