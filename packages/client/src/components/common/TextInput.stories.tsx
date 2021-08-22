import React from "react"
import TextInput from "./TextInput"
import { ComponentMeta, ComponentStory } from "@storybook/react"


export default {
  title: 'Components/common/TextInput',
  component: TextInput,
  argTypes: {
    onSubmit: {
      action: 'onSubmit'
    }
  }
} as ComponentMeta<typeof TextInput>

const Template: ComponentStory<typeof TextInput> = (args) => <TextInput {...args}/>

export const Default = Template.bind({});
Default.args = {
  submitButtonText: "전송"
}
