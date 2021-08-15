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
      mediaStreamManager.setUserMediaStream().then(stream =>{
        videoRefCurrent.srcObject = stream; 
        videoRefCurrent.onloadedmetadata = function(){
          videoRefCurrent.play();
        }
      });
    }
  }, [videoRef.current])

  return <StyledVideo ref={videoRef}/>
}

export default UserMediaPreview