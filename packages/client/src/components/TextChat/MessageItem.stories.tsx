import React from "react"
import MessageItem from "./MessageItem"
import { ComponentMeta, ComponentStory } from "@storybook/react"

export default {
  title: 'Components/TextChat/MessageItem',
  component: MessageItem,
  argTypes: {
    time: {
      control: {
        type: "number",
        step: 1000 * 60 * 60
      }
    }
  }
} as ComponentMeta<typeof MessageItem>

const Template: ComponentStory<typeof MessageItem> = (args) => <MessageItem {...args}/>

export const Default = Template.bind({});
Default.args = {
  userName: "someone",
  time: new Date().getTime(),
  value: "blah blah",
}
