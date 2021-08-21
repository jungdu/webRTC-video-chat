import React from "react";
import styled from "@emotion/styled";
import useInput from "hooks/useInput";

interface MessageInputProps {
	sendMessage: (message: string) => void;
}

const Self = styled.div`
	display: flex;
`;

const StyledInput = styled.input`
	flex-grow: 1;
	margin-right: 10px;
	padding: 5px 5px;
	font-size: 15px;
`;

const MessageInput: React.FC<MessageInputProps> = ({ sendMessage }) => {
	const {
		value: message,
		setValue: setMessage,
		handleChange: handleChangeMessage,
	} = useInput();

	const handleInputKeyUp = (event: React.KeyboardEvent) => {
		if (event.key === "Enter") {
			if (message) {
				sendMessage(message);
				setMessage("");
			}
		}
	};

	const handleClickSendButton = () => {
		if (message) {
			sendMessage(message);
			setMessage("");
		}
	};

	return (
		<Self>
			<StyledInput
				type="text"
				value={message}
				onChange={handleChangeMessage}
				onKeyUp={handleInputKeyUp}
			/>
			<button onClick={handleClickSendButton}>보내기</button>
		</Self>
	);
};

export default MessageInput;
