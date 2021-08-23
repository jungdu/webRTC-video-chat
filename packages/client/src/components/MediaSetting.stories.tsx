import React from "react"
import MediaSetting from "./MediaSetting"
import { ComponentMeta, ComponentStory } from "@storybook/react"

export default {
  title: "Components/MediaSetting",
  component: MediaSetting,
  argTypes: {
    onFinishMediaSetting: {
      action: 'finishMediaSetting'
    }
  }
} as ComponentMeta<typeof MediaSetting>

const Template: ComponentStory<typeof MediaSetting> = (args) => <MediaSetting {...args} />

export const Default = Template.bind({});
Default.args = {
}