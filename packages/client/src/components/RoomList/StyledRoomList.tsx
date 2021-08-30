import React from "react";
import styled from "@emotion/styled";
import { useRecoilValue } from "recoil";
import { chatRoomsState } from "recoilStates/chatStates";
import RoomItem from "./RoomItem";
import { roomItemStyle } from "./styles";

interface ChatRoomListProps {
	className?: string;
}

const Self = styled.div``;

const EmptyRoomItem = styled.div`
	${roomItemStyle}
`;

const StyledChatRoomList: React.FC<ChatRoomListProps> = ({ className }) => {
	const chatRooms = useRecoilValue(chatRoomsState);

	return (
		<Self className={className}>
			{chatRooms.length > 0 ? (
				chatRooms.map(({ roomId, roomName }) => (
					<RoomItem roomId={roomId} roomName={roomName} />
				))
			) : (
				<EmptyRoomItem>존재하는 방이 없습니다.</EmptyRoomItem>
			)}
		</Self>
	);
};

export default StyledChatRoomList;
