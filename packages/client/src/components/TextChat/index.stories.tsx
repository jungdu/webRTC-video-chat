import React from "react"
import { ComponentStory } from "@storybook/react";
import { RecoilRoot } from "recoil";
import TextChat from "./index";
import { chatMessagesState } from "recoilStates/chatStates";

export default {
  title: 'Components/TextChat/TextChat',
  component: TextChat,
  decorators: [(storyFn:() => JSX.Element) => <RecoilRoot initializeState={({set}) => {
    set(chatMessagesState, [
      {
        time: 1629397770000,
        userId: "테스트1",
        value: "안녕하세요"
      },
      {
        time: 1629497780000,
        userId: "테스트2",
        value: "안녕하세요!!!"
      },
      {
        time: 1629597790000,
        userId: "방장",
        value: "하이"
      },
      {
        time: 1629697770000,
        userId: "테스트1",
        value: "안녕하세요"
      },
      {
        time: 1629797780000,
        userId: "테스트2",
        value: "안녕하세요!!!"
      },
      {
        time: 1629897790000,
        userId: "방장",
        value: "하이"
      },
      {
        time: 1629997770000,
        userId: "테스트1",
        value: "안녕하세요"
      },
      {
        time: 16309397780000,
        userId: "테스트2",
        value: "안녕하세요!!!"
      },
      {
        time: 1632397790000,
        userId: "방장",
        value: "하이"
      },
      {
        time: 1634397770000,
        userId: "테스트1",
        value: "안녕하세요"
      },
      {
        time: 1635397780000,
        userId: "테스트2",
        value: "안녕하세요!!!"
      },
      {
        time: 1635307780000,
        userId: "테스트2",
        value: "안녕하세요!!!"
      }
    ])
  }}>{storyFn()}</RecoilRoot>]
}

const Template: ComponentStory<typeof TextChat> = (args) => <TextChat {...args} />

export const Default = Template.bind({});