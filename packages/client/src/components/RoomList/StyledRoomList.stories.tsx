import React from "react"
import StyledRoomList from "./StyledRoomList"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import { RecoilRoot } from "recoil"
import { chatRoomsState } from "recoilStates/chatStates"
import styled from "@emotion/styled"

const RoomList = styled(StyledRoomList)`
  width: 500px;
  height: 200px;
  overflow: scroll;
`

export default {
  title: "Components/RoomList/RoomList",
  component: RoomList,
} as ComponentMeta<typeof RoomList>

const dummyRoom = {
  roomId: "abc",
  createdBy: "someone",
  userSocketIds: [],
}

const Template: ComponentStory<typeof RoomList> = (args) => <RecoilRoot initializeState={({set}) => {
  set(chatRoomsState, [
    {
      ...dummyRoom,
      roomName: "First Room",
    },
    {
      ...dummyRoom,
      roomName: "Second Room",
    },
    {
      ...dummyRoom,
      roomName: "Third Room",
    },
    {
      ...dummyRoom,
      roomName: "Forth Room",
    },
    {
      ...dummyRoom,
      roomName: "Fifth Room",
    }
  ])
}}><RoomList {...args} /></RecoilRoot>

export const Default = Template.bind({});