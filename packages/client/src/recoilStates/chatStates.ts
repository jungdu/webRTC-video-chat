import { atom } from "recoil";

export const connectedSocketIdState = atom<string | null>({
  key: "connectedSocketId",
  default: null,
});

export const chatMessagesState = atom<{
  from: string;
  message: string;
}[]>({
  key: "messagesState",
  default: []
})

export const chatMediaStreamsState = atom<MediaStream[][]>({
  key: "chatMediaStreamsState",
  default: [],
})