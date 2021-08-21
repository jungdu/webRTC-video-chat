import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import StyledRelativeHeightDiv from "components/common/StyledRelativeHeightDiv";
import { userInfo } from "os";

interface VideoItemProps {
  stream: MediaStream | null,
  userId: string,
}

const Self = styled(StyledRelativeHeightDiv)`
  background: #111;
  width: 100%;
  margin: 5px;
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

const VideoItem: React.FC<VideoItemProps> = ({ stream, userId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoadedMetadata = () => {
    videoRef.current!.play();
  }
  
  useEffect(() => {
    if(stream && videoRef.current){
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef.current])

  return <Self heightPercent={70}>
    <StyledVideo ref={videoRef} onLoadedMetadata={handleLoadedMetadata}/>
    <StyledUserInfo>
      {userId}
    </StyledUserInfo>
  </Self>;
};

export default VideoItem;