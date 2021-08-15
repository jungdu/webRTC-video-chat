export const enum RTCConnectionType {
  OFFER = "OFFER",
  ANSWER = "ANSWER"
}

export interface AnswerData {
  answerSocketId: string;
  answer: RTCSessionDescriptionInit;
  offerSocketId: string;
}

export interface CandidateData {
  candidate: RTCIceCandidate;
  destSocketId: string;
  fromSocketId: string;
  type: RTCConnectionType;
}

export interface OfferData {
  answerSocketId: string;
  offer: RTCSessionDescriptionInit;
  offerSocketId: string;
}