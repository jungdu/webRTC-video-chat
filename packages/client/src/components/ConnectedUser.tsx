import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";

interface ConnectedUserProps {
  mediaStream: MediaStream[];
}

const Self = styled.div``;

const UserVideo = styled.video`
  width: 300px;
  height: 200px;  
`

const ConnectedUser: React.FC<ConnectedUserProps> = ({
  mediaStream
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() =>{
    const videoRefCurrent = videoRef.current;
    if(videoRefCurrent){
      videoRefCurrent.srcObject = mediaStream[0];
      videoRefCurrent.onloadedmetadata = function(){
        videoRefCurrent.play();
      }
    }
  }, [mediaStream, videoRef.current])

  return <Self>
    <UserVideo ref={videoRef}/>
  </Self>;
};

export default ConnectedUser;