import React, { useEffect } from "react"
import VideoItem from "./VideoItem"
import { ComponentMeta } from "@storybook/react"
import { mediaStreamManager } from "managers"
import styled from "@emotion/styled"
import { RecoilRoot, useRecoilCallback } from "recoil"
import { chatUserAtomFamily } from "recoilStates/chatStates"

export default {
  title: 'Components/VideoChat/VideoItem',
  component: VideoItem,
} as ComponentMeta<typeof VideoItem>

const VideoItemContainer = styled.div`
  width: 300px;
  height: 250px;
`

const DefaultComp:React.FC = () => {
  const setChatUser = useRecoilCallback<[{
    userId: string;
    mediaStream: MediaStream[];
    userName: string;
  }], void>(({set}) => ({mediaStream, userId, userName}) => {
    set(chatUserAtomFamily(userId), {
      mediaStream,
      userName,
    })
  })

  useEffect(() => {
    mediaStreamManager.getUserMedia().then(mediaStream => {
      console.log("mediaStream :", mediaStream)
      setChatUser({
        userId: "abc",
        mediaStream: [mediaStream],
        userName: "테스트 유저 네임"
      });
    }).catch((e) => {
      console.log("e :", e)
    })
  }, [])

  return <VideoItemContainer><VideoItem userId="abc"/></VideoItemContainer>;
}

export const Default = () => {
  return <RecoilRoot>
    <DefaultComp></DefaultComp>
  </RecoilRoot>
}

