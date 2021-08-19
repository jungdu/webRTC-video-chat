import React from "react"
import MessageInputOrig from "./MessageInput"
import { ComponentMeta, ComponentStory } from "@storybook/react"


export default {
  title: 'Components/TextChat/MessageInput',
  component: MessageInputOrig,
  argTypes: {
    sendMessage: {
      action: 'sendMessage'
    }
  }
} as ComponentMeta<typeof MessageInputOrig>

const Template: ComponentStory<typeof MessageInputOrig> = (args) => <MessageInputOrig {...args}/>

export const Default = Template.bind({});
