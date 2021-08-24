import React from "react";
import styled from "@emotion/styled";
import useInput from "hooks/useInput";
import { primaryButtonStyle, textInputStyle } from "styles";

interface TextInputProps {
	onSubmit: (value: string) => void;
  submitButtonText: string;
}

const Self = styled.div`
	display: flex;
`;

const StyledInput = styled.input`
	${textInputStyle}
	flex-grow: 1;
	margin-right: 10px;
`;

const StyledButton = styled.button`	
	${primaryButtonStyle}
`

const TextInput: React.FC<TextInputProps> = ({ onSubmit, submitButtonText }) => {
	const {
		value,
		setValue: setValue,
		handleChange: handleChangeMessage,
	} = useInput();

	const handleInputKeyUp = (event: React.KeyboardEvent) => {
		if (event.key === "Enter") {
			if (value) {
				onSubmit(value);
				setValue("");
			}
		}
	};

	const handleClickSendButton = () => {
		if (value) {
			onSubmit(value);
			setValue("");
		}
	};

	return (
		<Self>
			<StyledInput
				type="text"
				value={value}
				onChange={handleChangeMessage}
				onKeyUp={handleInputKeyUp}
			/>
			<StyledButton onClick={handleClickSendButton}>{submitButtonText}</StyledButton>
		</Self>
	);
};

export default TextInput;
