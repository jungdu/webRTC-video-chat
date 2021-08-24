import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { mediaStreamManager } from "managers";
import { primaryButtonStyle, textInputStyle } from "styles";
import useInput from "hooks/useInput";

interface MediaSettingProps {
  onFinishMediaSetting: (mediaStream: MediaStream | null, userName: string) => void;
}

const Self = styled.div`
  margin: 60px auto 0 auto;
  width: 400px;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 300px;
  background: #333;
  border-radius: 3px;
` 

const StyledButton = styled.button`
  ${primaryButtonStyle}
  margin-top: 12px;
  width: 100%;
`

const StyledInput = styled.input`
  ${textInputStyle};
  margin-top: 40px;
  box-sizing: border-box;
  width: 100%;
`

const StyledErrorMessage = styled.div`
  margin-top: 3px;
  color: #FF0558;
  font-size: 13px;
`

const MediaSetting: React.FC<MediaSettingProps> = ({onFinishMediaSetting}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaStreamRef = useRef<null | MediaStream>(null);
  const [errorMessage, setErrorMessage] = useState<string|null>(null);

  const {
    value: userName,
    handleChange: handleChangeUserName,
  } = useInput();
  
  useEffect(() => {
    mediaStreamManager.getUserMedia().then((stream) => {
      mediaStreamRef.current = stream;
      mediaStreamManager.setUserMediaStream(stream);
      if(videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }).catch((e) => {
      // TODO 에러 처리
      console.error("e :", e)
    })
  }, [videoRef])

  const handleLoadedMetadata = () => {
    if(videoRef.current){
      videoRef.current.play();
    }
  }
  
  const handleSubmit = () => {
    if(!userName){
      setErrorMessage("USER NAME을 설정해 주세요.")
    }else{
      onFinishMediaSetting(mediaStreamRef.current, userName);
    }
  }

  useEffect(() => {
    if(userName){
      setErrorMessage(null);
    }
  }, [userName]);
  
  return <Self>
    <StyledVideo ref={videoRef} onLoadedMetadata={handleLoadedMetadata}/>
    <StyledInput placeholder="USER NAME" onChange={handleChangeUserName} value={userName}/>
    <StyledButton onClick={handleSubmit}>입장</StyledButton>
    {errorMessage && <StyledErrorMessage>{errorMessage}</StyledErrorMessage>}
  </Self>;
};

export default MediaSetting;