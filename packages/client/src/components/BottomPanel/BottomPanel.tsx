import React from "react";
import styled from "@emotion/styled";
import { bottomHeightPx, RightPanelMode } from "pages/pageVariables";
import UsersIconOrig from "components/icons/UsersIcon";
import CommentsIconOrig from "components/icons/CommentsIcon";
import { css } from "@emotion/react";

interface BottomPanelProps {
	onSetRightPanelMode: (mode: RightPanelMode) => void;
}

const iconColors = {
	default: "#ccc",
	hover: "#fff",
};

const iconStyle = css`
	width: 35px;
	height: 35px;
	padding: 15px;
	cursor: pointer;

	& path {
		fill: ${iconColors.default} !important;
	}

	&:hover path {
		fill: ${iconColors.hover} !important;
	}
`;

const UsersIcon = styled(UsersIconOrig)`
	margin-left: auto;
	${iconStyle}
`;

const CommentsIcon = styled(CommentsIconOrig)`
	${iconStyle}
`;

const Self = styled.div`
	display: flex;
	align-items: center;
	background-color: #222;
	height: ${bottomHeightPx}px;
	padding: 0 30px;
`;

const BottomPanel: React.FC<BottomPanelProps> = ({ onSetRightPanelMode }) => {
	return (
		<Self>
			<UsersIcon onClick={() => onSetRightPanelMode("userList")} />
			<CommentsIcon onClick={() => onSetRightPanelMode("messageList")} />
		</Self>
	);
};

export default BottomPanel;
