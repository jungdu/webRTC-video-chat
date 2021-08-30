import React from "react";
import IconContainer, { IconContainerProps } from "./IconContainer";

const CloseIcon: React.FC<IconContainerProps> = ({ ...IconContainerProps }) => {
	return (
		<IconContainer {...IconContainerProps}>
			<svg
				width="100%"
				height="100%"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
					fill="black"
				/>
			</svg>
		</IconContainer>
	);
};

export default CloseIcon;
