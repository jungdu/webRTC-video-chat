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
	font-size: 18px;
`

const MessageInput: React.FC<MessageInputProps> = ({ sendMessage }) => {
	const {
		value: message,
		setValue: setMessage,
		handleChange: handleChangeMessage,
	} = useInput();

	const handleInputKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter") {
			sendMessage(message);
			setMessage("");
		}
	};

	const handleClickSendButton = () => {
		sendMessage(message);
		setMessage("");
	};

	return (
		<Self>
			<StyledInput
				type="text"
				value={message}
				onChange={handleChangeMessage}
				onKeyDown={handleInputKeyDown}
			/>
			<button onClick={handleClickSendButton}>보내기</button>
		</Self>
	);
};

export default MessageInput;
