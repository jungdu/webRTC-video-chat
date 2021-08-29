import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useRecoilValue } from "recoil";
import { chatUsersIdListState } from "recoilStates/chatStates";
import VideoItem from "./VideoItem";
import { debounce } from "lodash";

interface VideoListProps {
	className?: string;
}

const Self = styled.div`
	display: flex;
	justify-content: stretch;
	align-items: stretch;
	flex-wrap: wrap;

	label: VideoList;
`;

const VideoItemContainer = styled.div<{
	minHeight: string | null;
}>`
	position: relative;
	${({ minHeight }) =>
		minHeight
			? `
    min-width: ${minHeight};
  `
			: `
    display: none;
  `};

	label: VideoItemContainer;
`;

const StyledVideoList: React.FC<VideoListProps> = ({ className }) => {
	const chatUsersIdList = useRecoilValue(chatUsersIdListState);
	const selfRef = useRef<HTMLDivElement>(null);
	const [itemMinHeight, setItemMinHeight] = useState<null | string>(null);

	useEffect(() => {
		const selfCurrent = selfRef.current;

		if (selfCurrent) {
			const userCountSqrt = Math.sqrt(chatUsersIdList.length);
			const updateItemMinHeight = () => {
				const ratio = selfCurrent.clientWidth / selfCurrent.clientHeight;
				const columnCount =
					ratio < 1 ? Math.floor(userCountSqrt) : Math.ceil(userCountSqrt);
				setItemMinHeight(`${100 / columnCount}%`);
			};
			const handleResize = debounce(updateItemMinHeight, 500);

			updateItemMinHeight();
			window.addEventListener("resize", handleResize);
			return () => {
				window.removeEventListener("resize", handleResize);
			};
		}
	}, [selfRef, chatUsersIdList]);

	return (
		<Self className={className} ref={selfRef}>
			{chatUsersIdList.map((userId) => (
				<VideoItemContainer key={userId} minHeight={itemMinHeight}>
					<VideoItem userId={userId} />
				</VideoItemContainer>
			))}
		</Self>
	);
};

export default StyledVideoList;
