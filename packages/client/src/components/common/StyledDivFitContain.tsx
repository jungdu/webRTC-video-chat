import React, { RefObject, useEffect, useState } from "react";
import styled from "@emotion/styled";

interface DivFitContainProps {
  className?: string;
  parentRef: RefObject<HTMLElement>;
  ratio: number;
}

const Self = styled.div<{size: {
  width: number;
  height: number;}
}>`
  width: ${({size}) => size.width}px;
  height: ${({size}) => size.height}px;
`;

function calculateContainSize(parentRect: {
  width: number;
  height: number;
}, ratio: number){
  const parentWidth = parentRect.width;
  const parentHeight = parentRect.height;
  
  const heightBasedParentWidth = parentWidth / ratio;
  if(heightBasedParentWidth > parentHeight){
    return {
      width: parentHeight * ratio,
      height: parentHeight,
    }
  }
  return {
    width: parentWidth,
    height: heightBasedParentWidth,
  }
}

const StyledDivFitContain: React.FC<DivFitContainProps> = ({
  children,
  className,
  parentRef,
  ratio,
}) => {
  const [size, setSize] = useState<{
    width: number;
    height: number;
  } | null>(null)

  useEffect(() => {
    if(parentRef){
      if(!parentRef.current){
        throw new Error("No parentRef.current");
      }

      const parentRect = parentRef.current.getBoundingClientRect();
      setSize(calculateContainSize(parentRect, ratio));
      
      const resizeObserver = new ResizeObserver((entries) => {
        const parentRect = entries[0].contentRect
        const nextSize = calculateContainSize(parentRect, ratio);
        setSize(nextSize)
      });
  
      resizeObserver.observe(parentRef.current);
      return () => {
        resizeObserver.disconnect();
      }
    }
  }, [parentRef])

  if(!size){
    return null;
  }

  return <Self className={className}
    size={size}
  >{children}</Self>
};

export default StyledDivFitContain;