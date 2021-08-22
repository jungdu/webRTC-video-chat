import React from "react"
import RoomItem from "./RoomItem"
import { ComponentMeta, ComponentStory } from "@storybook/react"

export default {
  title: "Components/RoomList/RoomItem",
  component: RoomItem,
  decorators: []
} as ComponentMeta<typeof RoomItem>

const Template: ComponentStory<typeof RoomItem> = (args) => <RoomItem {...args} />

export const Default = Template.bind({});
Default.args = {
  roomId: "something",
  roomName: "테스트 방"
}