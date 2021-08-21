import React, { useEffect, useState } from "react"
import VideoItem from "./VideoItem"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import { mediaStreamManager } from "managers"

export default {
  title: 'Components/VideoChat/VideoItem',
  component: VideoItem,
} as ComponentMeta<typeof VideoItem>

const Template: ComponentStory<typeof VideoItem> = (args) => {
  const [mediaStream, setMediaStream] = useState<MediaStream|null>(null);

  useEffect(() => {
    mediaStreamManager.getUserMedia().then(mediaStream => {
      setMediaStream(mediaStream);
    })    
  }, [])

  return <VideoItem {...args} stream={mediaStream}/>
}

export const Default = Template.bind({});
Default.args = {
  userId: "유저 아이디"
}