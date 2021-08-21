import React from "react";
import styled from "@emotion/styled";

interface StyledRelativeHeightDivProps {
  className?: string;
  heightPercent: number;
}

const Self = styled.div`
  position: relative;
`;

const Space = styled.div<{
  height: number;
}>`
  padding-top: ${({height}) => `${height}%`};
`

const Content = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const StyledRelativeHeightDiv: React.FC<StyledRelativeHeightDivProps> = ({
  className,
  heightPercent,
  children
}) => {
  return <Self className={className}>
    <Space height={heightPercent}/>
    <Content>{children}</Content>
  </Self>;
};

export default StyledRelativeHeightDiv;