export interface MessageInfo {
  userName: string;
  value: string;
  time: number;
}

interface SetUserName {
  type: "SetUserName";
  value: string;
}

interface ChatMessage {
  type: "ChatMessage";
  userName: string;
  value: string;
}

export type DataChannelMessage = SetUserName | ChatMessage;