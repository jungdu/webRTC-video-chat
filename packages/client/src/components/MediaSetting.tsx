import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { mediaStreamManager } from "managers";
import { primaryButtonStyle } from "styles/ButtonStyles";

interface MediaSettingProps {
  onFinishMediaSetting: () => void;
}

const Self = styled.div`
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledVideo = styled.video`
  width: 400px;
` 

const StyledButton = styled.button`
  ${primaryButtonStyle}
  margin-top: 20px;
  width: 400px;
`

const MediaSetting: React.FC<MediaSettingProps> = ({onFinishMediaSetting}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  
  useEffect(() => {
    mediaStreamManager.getUserMedia().then((stream) => {
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
  
  return <Self>
    <StyledVideo ref={videoRef} onLoadedMetadata={handleLoadedMetadata}/>
    <div>
      <StyledButton onClick={onFinishMediaSetting}>입장</StyledButton>
    </div>
  </Self>;
};

export default MediaSetting;