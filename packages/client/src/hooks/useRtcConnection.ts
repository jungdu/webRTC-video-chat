import { dataChannelManager, mediaStreamManager, rtcConnectionManager, socketManager } from "managers";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { chatMediaStreamsState, chatMessagesState, connectedSocketIdState } from "recoilStates/chatStates";

export default function useRtcConnection(){
  const connectedSocketId = useRecoilValue(connectedSocketIdState);
  const setChatMessage = useSetRecoilState(chatMessagesState)
  const setChatMediaStreams = useSetRecoilState(chatMediaStreamsState)

  useEffect(() => {
    if(connectedSocketId){
      const currentSocket = socketManager.getCurrentSocket();
      if(!currentSocket){
        throw new Error("no socket to add socket handlers")
      }

      rtcConnectionManager.addSocketHandler(currentSocket);
      dataChannelManager.setHandlers({
        onMessage: function(event: MessageEvent<any>, socketId: string){
          setChatMessage((messages) => [...messages, {
            socketId,
            message: event.data,
        }])
      }});

      mediaStreamManager.setHandlers({
        onNewTrack: function(rtcTrackEvent, socketId){
          console.log("onNewTrack");
          setChatMediaStreams(function(mediaStreams){
            const newStreams = [...rtcTrackEvent.streams];
            return [...mediaStreams, {
              socketId: socketId,
              mediaStream:newStreams
            }]
          })
        }
      })
    }
  }, [connectedSocketId])
}