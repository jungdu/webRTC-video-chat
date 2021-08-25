export interface MessageInfo {
  userId: string;
  value: string;
  time: number;
}

interface SetUserName {
  type: "SetUserName";
  value: string;
}

interface ChatMessage {
  type: "ChatMessage";
  value: string;
}

export type DataChannelMessage = SetUserName | ChatMessage;