import React from "react";
import styled from "@emotion/styled";


const defaultIconSize = {
  width: "24px",
  height: "24px"
}

const Self = styled.div`
  display: inline-block;
  width: ${defaultIconSize.width};
  height: ${defaultIconSize.height};
`;

export interface IconContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const IconContainer: React.FC<IconContainerProps> = ({className, children, ...divProps}) => {
  return <Self className={className} {...divProps}>
    {children}
  </Self>;
};

export default IconContainer;