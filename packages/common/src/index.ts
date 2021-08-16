import {Socket} from "socket.io"
import {Socket as ClientSocket} from "socket.io-client"



export enum RTCConnectionType {
  OFFER = "OFFER",
  ANSWER = "ANSWER"
}

export interface Room {
  roomId: string;
  createdBy: string;
  roomName: string;
  userSocketIds: string[];
}

interface AnswerData {
  answerSocketId: string;
  answer: RTCSessionDescriptionInit;
  offerSocketId: string;
}

interface CandidateData {
  candidate: RTCIceCandidate;
  destSocketId: string;
  fromSocketId: string;
  type: RTCConnectionType;
}

interface OfferData {
  answerSocketId: string;
  offer: RTCSessionDescriptionInit;
  offerSocketId: string;
}

type SocketHandler<T extends any[]> = (...args: T) => void;

type ClientRTCConnectionMessage = {
  answer: SocketHandler<[msg:AnswerData]>;
  offer: SocketHandler<[msg:OfferData]>;
  candidate: SocketHandler<[msg: CandidateData]>;
}

type ServerRTCConnectionMessage = {
  offer: SocketHandler<[msg:OfferData]>;
  answer: SocketHandler<[msg:AnswerData]>
  candidate: SocketHandler<[msg: CandidateData]>
}

type ClientChatRoomMessage = {
  createRoom: SocketHandler<[msg: {roomName: string}, cb?: (room:Room) => void]>;
  joinRoom: SocketHandler<[msg: {roomId:string}, cb?: (room:Room) => void]>;
  joinLobby: SocketHandler<[cb: (room: Room[]) => void]>;
  getRooms: SocketHandler<[cb: (room: Room[]) => void]>;
  getRoomInfo: SocketHandler<[msg: {roomId: string}]>
  exitRoom: SocketHandler<[msg: {roomId: string}]>;
}

type ServerChatRoomMessage = {
  newRoom: SocketHandler<[room:Room]>;
}


type ClientToServerMessage = ClientChatRoomMessage & ClientRTCConnectionMessage

type ServerToClientMessage = ServerChatRoomMessage & ServerRTCConnectionMessage;

export type TypedClientSocket = ClientSocket<ServerToClientMessage, ClientToServerMessage>;

export type TypedServerSocket = Socket<ClientToServerMessage, ServerToClientMessage>;