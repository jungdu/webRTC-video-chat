import { ChangeEvent, useState } from "react"

export default function useInput(){
  const [value, setValue] = useState<string>("");

  function handleChange(event: ChangeEvent<HTMLInputElement>){
    setValue(event.currentTarget.value);
  }

  return {
    value,
    handleChange
  }
}