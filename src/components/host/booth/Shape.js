import React from "react";
import { Box } from "@chakra-ui/react";

const Shape = ({ shape, onShapeUpdate, isMainTemplate }) => {
  const renderShape = () => {
    const fillColor = isMainTemplate ? "transparent" : "none";
    const strokeColor = "black";
    const strokeWidth = isMainTemplate ? 4 : 2;

    return (
      <g>
        {shape.name === "rectangle" && (
          <rect
            width="100%"
            height="100%"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        )}
        {shape.name === "circle" && (
          <circle
            cx="50%"
            cy="50%"
            r="50%"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        )}
        {shape.name === "triangle" && (
          <polygon
            points="50,0 100,100 0,100"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        )}
        {shape.name === "pentagon" && (
          <polygon
            points="50,0 100,38 82,100 18,100 0,38"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        )}
        {shape.name === "hexagon" && (
          <polygon
            points="50,0 90,25 90,75 50,100 10,75 10,25"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        )}
        {shape.name === "star" && (
          <polygon
            points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        )}
        {shape.name === "arrow" && (
          <polygon
            points="10,40 70,40 70,20 100,50 70,80 70,60 10,60"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        )}
      </g>
    );
  };

  return (
    <Box
      border={isMainTemplate ? "2px solid black" : "none"}
      width="100%"
      height="100%"
      position="relative"
      pointerEvents="all"
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        {renderShape()}
      </svg>
    </Box>
  );
};

export default Shape;
