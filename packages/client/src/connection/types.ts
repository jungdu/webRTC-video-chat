export const enum RtcConnectionType {
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
  type: RtcConnectionType;
}

export interface OfferData {
  answerSocketId: string;
  offer: RTCSessionDescriptionInit;
  offerSocketId: string;
}