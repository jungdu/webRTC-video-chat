import React, { useMemo } from "react";
import styled from "@emotion/styled";
import { useRecoilValue } from "recoil";
import { chatUsersIdListState } from "recoilStates/chatStates";
import VideoItem from "./VideoItem";

interface VideoListProps {
	className?: string;
}

const MAX_MEDIA_STREAM_COUNT = 9;

const Self = styled.div<{
  columnCount: number;
}>`
	display: grid;
  grid-template-columns: ${({columnCount}) => `repeat(${columnCount}, 1fr)`};
`;

const VideoItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;;
`;

const StyledVideoList: React.FC<VideoListProps> = ({ className }) => {
	const chatUsersIdList = useRecoilValue(chatUsersIdListState);

  const getColumnCount = () => {
    const streamCount = chatUsersIdList.length;
    if(streamCount <= 1){
      return 1;
    }
    if(streamCount <= 4){
      return 2;
    }
    if(streamCount <= 9){
      return 3;
    }
    throw new Error("media stream count is grater than maximum of stream count");
  }

	return (
		<Self className={className} columnCount={getColumnCount()}>
			{chatUsersIdList.map(userId => (
				<VideoItemContainer key={userId}>
					<VideoItem userId={userId} />
				</VideoItemContainer>
			))}
		</Self>
	);
};

export default StyledVideoList;
