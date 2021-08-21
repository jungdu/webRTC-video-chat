import React, { useEffect, useState } from "react"
import VideoItem from "./VideoItem"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import { mediaStreamManager } from "managers"
import styled from "@emotion/styled"

export default {
  title: 'Components/VideoChat/VideoItem',
  component: VideoItem,
} as ComponentMeta<typeof VideoItem>

const VideoItemContainer = styled.div`
  width: 300px;
  height: 250px;
`

const Template: ComponentStory<typeof VideoItem> = (args) => {
  const [mediaStream, setMediaStream] = useState<MediaStream|null>(null);

  useEffect(() => {
    mediaStreamManager.getUserMedia().then(mediaStream => {
      setMediaStream(mediaStream);
    }).catch(() => {
      console.info("No device to get user media");
    })
  }, [])

  return <VideoItemContainer><VideoItem {...args} stream={mediaStream}/></VideoItemContainer>;
}

export const Default = Template.bind({});
Default.args = {
  userId: "유저 아이디"
}