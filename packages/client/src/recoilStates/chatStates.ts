import { atom } from "recoil";
import { Room } from "@videochat/common";

export const connectedSocketIdState = atom<string | null>({
  key: "connectedSocketId",
  default: null,
});

export const chatMessagesState = atom<{
  socketId: string;
  message: string;
}[]>({
  key: "messagesState",
  default: []
})

export const chatMediaStreamsState = atom<{
  socketId: string
  mediaStream: MediaStream[]
}[]>({
  key: "chatMediaStreamsState",
  default: [],
})

export const chatRoomsState = atom<Room[]>({
  key: "chatRoomsState",
  default: []
});