import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { useRecoilValue } from "recoil";
import { chatUserAtomFamily } from "recoilStates/chatStates";
import StyledDivFitContain from "components/common/StyledDivFitContain";

interface VideoItemProps {
  userId: string,
}

const DivFitContain = styled(StyledDivFitContain)`
  position: relative;
`

const Self = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  background: #111;
  width: 100%;
  height: 100%;
`;

const StyledVideo = styled.video`
  background: #555;
  width: 100%;
  height: 100%;
`

const StyledUserInfo = styled.div`
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  color: #ddd;
  padding: 10px;
`

const VideoItem: React.FC<VideoItemProps> = ({ userId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {mediaStream, userName} = useRecoilValue(chatUserAtomFamily(userId))
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoadedMetadata = () => {
    videoRef.current!.play();
  }
  
  useEffect(() => {
    if(mediaStream && videoRef.current){
      videoRef.current.srcObject = mediaStream[0];
    }
  }, [mediaStream, videoRef.current])

  return <Self ref={containerRef}>
    <DivFitContain ratio={1.2} parentRef={containerRef}>
      <StyledVideo ref={videoRef} onLoadedMetadata={handleLoadedMetadata}/>
      <StyledUserInfo>
        { userName || "Unknown" }
      </StyledUserInfo>
    </DivFitContain>
  </Self>;
};

export default VideoItem;