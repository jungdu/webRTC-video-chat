import { dataChannelManager, mediaStreamManager, rtcConnectionManager, socketManager } from "managers";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { chatMediaStreamsState, chatMessagesState, connectedSocketIdState } from "recoilStates/chatStates";

export default function useRTCConnection(){
  const connectedSocketId = useRecoilValue(connectedSocketIdState);
  const setChatMessage = useSetRecoilState(chatMessagesState)
  const setChatMediaStreams = useSetRecoilState(chatMediaStreamsState)

  useEffect(() => {
    if(connectedSocketId){
      const currentSocket = socketManager.getCurrentSocket();
      rtcConnectionManager.addSocketHandler(currentSocket);
      dataChannelManager.setHandlers({
        onMessage: function(event: MessageEvent<any>, socketId: string){
          setChatMessage((messages) => [...messages, {
            userId: socketId,
            value: event.data,
            time: new Date().getTime()
        }])
      }});

      mediaStreamManager.setHandlers({
        onNewTrack: function(rtcTrackEvent, socketId){
          setChatMediaStreams(function(mediaStreams){
            const newStreams = [...rtcTrackEvent.streams];
            return [...mediaStreams, {
              userId: socketId,
              mediaStream:newStreams
            }]
          })
        }
      })
      
      return () => {
        rtcConnectionManager.deleteSocketHandler(currentSocket);
      }
    }
  }, [connectedSocketId])
}