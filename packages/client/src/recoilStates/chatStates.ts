import { atom } from "recoil";
import { Room } from "@videochat/common";
import { MessageInfo } from "types";

export const connectedSocketIdState = atom<string | null>({
  key: "connectedSocketId",
  default: null,
});

export const chatMessagesState = atom<MessageInfo[]>({
  key: "messagesState",
  default: []
})

export const chatMediaStreamsState = atom<{
  userId: string;
  mediaStream: MediaStream[] | null;
}[]>({
  key: "chatMediaStreamsState",
  default: [],
})

export const chatRoomsState = atom<Room[]>({
  key: "chatRoomsState",
  default: []
});