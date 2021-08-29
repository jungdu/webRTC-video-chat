import React, { useRef } from "react"
import StyledDivFitContain from "./StyledDivFitContain"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import styled from "@emotion/styled"

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  background: #555;
  width: 500px;
  height: 300px;
`

const DivFitContain = styled(StyledDivFitContain)`
  background-color: red;
`

export default {
  title: "Components/common/StyledDivFitContain",
  component: DivFitContain,
} as ComponentMeta<typeof DivFitContain>

const Template: ComponentStory<typeof DivFitContain> = (args) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  return <Container ref={parentRef}><DivFitContain {...args} parentRef={parentRef}/></Container>
}

export const Default = Template.bind({});
Default.args = {
  ratio: 1.2
}