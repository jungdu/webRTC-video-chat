import React from "react"
import { RecoilRoot } from "recoil";
import StyleVideoList from "./StyledVideoList";
import { chatUsersIdListState } from "recoilStates/chatStates";
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
  set(chatUsersIdListState, [
    "abc"
  ])
}}><VideoList/></RecoilRoot>


export const TwoUser = () => <RecoilRoot initializeState={({set}) => {
  set(chatUsersIdListState, [
    "abc", "cdf", "dddd"
  ])
}}><VideoList/></RecoilRoot>

export const ForUser = () => <RecoilRoot initializeState={({set}) => {
  set(chatUsersIdListState, [
    "abc", "cdf", "dddd", "sodfasvi"
  ])
}}><VideoList/></RecoilRoot>

export const FiveUser = () => <RecoilRoot initializeState={({set}) => {
  set(chatUsersIdListState, [
    "abc", "cdf", "dddd", "sodfasvi", "sviuhuisdhiuwfe"
  ])
}}><VideoList/></RecoilRoot>