import { mediaStreamManager } from "managers";
import styled from "@emotion/styled"
import React, { useEffect, useRef } from "react"

const StyledVideo = styled.video`
  width: 300px;
  height: 200px;
`

const UserMediaPreview:React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoRefCurrent = videoRef.current;
    if(videoRefCurrent){
      mediaStreamManager.getUserMedia().then(stream => {
        mediaStreamManager.setUserMediaStream(stream);
        videoRefCurrent.srcObject = stream; 
      })
    }
  }, [videoRef.current])

  const handleLoadedMetadata = () => {
    if(videoRef.current){
      videoRef.current.play();
    }
  }

  return <StyledVideo ref={videoRef} onLoadedMetadata={handleLoadedMetadata}/>
}

export default UserMediaPreview