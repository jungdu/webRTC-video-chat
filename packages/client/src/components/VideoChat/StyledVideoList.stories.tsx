import React from "react"
import { RecoilRoot } from "recoil";
import StyleVideoList from "./StyledVideoList";
import { chatMediaStreamsState } from "recoilStates/chatStates";
import styled from "@emotion/styled";

const VideoList = styled(StyleVideoList)`
  width: 100%;
  height: 1000px;
`

export default {
  title: 'Components/VideoChat/StyledVideoList',
  component: VideoList,
}

export const OneUser = () => <RecoilRoot initializeState={({set}) => {
  set(chatMediaStreamsState, [
    {
      mediaStream: null,
      userId: "abc"
    }
  ])
}}><VideoList/></RecoilRoot>


export const TwoUser = () => <RecoilRoot initializeState={({set}) => {
  set(chatMediaStreamsState, [
    {
      mediaStream: null,
      userId: "abc"
    },
    {
      mediaStream: null,
      userId: "손님A"
    },
  ])
}}><VideoList/></RecoilRoot>

export const ForUser = () => <RecoilRoot initializeState={({set}) => {
  set(chatMediaStreamsState, [
    {
      mediaStream: null,
      userId: "abc"
    },
    {
      mediaStream: null,
      userId: "손님A"
    },
    {
      mediaStream: null,
      userId: "방장"
    },
    {
      mediaStream: null,
      userId: "Hello World"
    }
  ])
}}><VideoList/></RecoilRoot>

export const FiveUser = () => <RecoilRoot initializeState={({set}) => {
  set(chatMediaStreamsState, [
    {
      mediaStream: null,
      userId: "abc"
    },
    {
      mediaStream: null,
      userId: "손님A"
    },
    {
      mediaStream: null,
      userId: "방장"
    },
    {
      mediaStream: null,
      userId: "Hello World"
    },
    {
      mediaStream: null,
      userId: "Newbie"
    }
  ])
}}><VideoList/></RecoilRoot>