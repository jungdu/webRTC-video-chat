import React from "react"
import BottomPanel from "./BottomPanel"
import { ComponentMeta, ComponentStory } from "@storybook/react"

export default {
  title: "Components/Panel/BottomPanel",
  component: BottomPanel,
  argTypes: {
    onSetRightPanelMode: {
      action: "onSetRightPanelMode"
    }
  }
} as ComponentMeta<typeof BottomPanel>

const Template: ComponentStory<typeof BottomPanel> = (args) => <BottomPanel {...args} />

export const Default = Template.bind({});