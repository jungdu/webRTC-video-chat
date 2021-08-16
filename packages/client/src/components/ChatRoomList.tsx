import React from "react";
import { useRecoilValue } from "recoil";
import { chatRoomsState } from "recoilStates/chatStates";

const ChatRoomList: React.FC = () => {
	const chatRooms = useRecoilValue(chatRoomsState);

	return (
		<ul>
			{chatRooms.length > 0 ? (
				chatRooms.map((chatRoom) => (
					<li key={chatRoom.roomId}>
						{chatRoom.roomId}: {chatRoom.roomName}
					</li>
				))
			) : (
				<li>생성된 방이 없습니다.</li>
			)}
		</ul>
	);
};

export default ChatRoomList;
