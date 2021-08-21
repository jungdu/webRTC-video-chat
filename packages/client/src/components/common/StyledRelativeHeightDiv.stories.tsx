import React from "react"
import StyledRelativeHeightDiv from "./StyledRelativeHeightDiv"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import styled from "@emotion/styled"

const RelativeHeightDiv = styled(StyledRelativeHeightDiv)`
  background: #000;
  width: 300px;
`

export default {
  title: 'Components/common/StyledRelativeHeightDiv',
  component: RelativeHeightDiv,
} as ComponentMeta<typeof RelativeHeightDiv>

const Template: ComponentStory<typeof RelativeHeightDiv> = (args) => <RelativeHeightDiv {...args}/>

export const Square = Template.bind({});
Square.args = {
  heightPercent: 100
}
