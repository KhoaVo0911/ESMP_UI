import React from "react";
import { Box } from "@chakra-ui/react";

// Component để render các hình dạng tương ứng
const ShapeToolBar = ({ shape, onShapeUpdate, onClick }) => {
  // Hàm render hình dạng dựa vào loại hình (type)
  const renderShape = () => {
    switch (shape.type) {
      case "rectangle":
        return (
          <rect
            width={shape.width}
            height={shape.height}
            fill="rgba(0, 0, 255, 0.1)"
            stroke="#000000"
          />
        );
      case "circle":
        return (
          <circle
            cx={shape.width / 2}
            cy={shape.height / 2}
            r={Math.min(shape.width, shape.height) / 2}
            fill="rgba(0, 0, 255, 0.1)"
            stroke="#000000"
          />
        );
      case "pentagon":
        return (
          <polygon
            points="50,15 90,35 75,75 25,75 10,35"
            fill="rgba(0, 0, 255, 0.1)"
            stroke="#000000"
          />
        );
      case "hexagon":
        return (
          <polygon
            points="50,10 90,30 90,70 50,90 10,70 10,30"
            fill="rgba(0, 0, 255, 0.1)"
            stroke="#000000"
          />
        );
      case "triangle":
        return (
          <polygon
            points="50,15 90,85 10,85"
            fill="rgba(0, 0, 255, 0.1)"
            stroke="#000000"
          />
        );
      case "star":
        return (
          <polygon
            points="50,15 61,35 85,35 66,50 73,75 50,60 27,75 34,50 15,35 39,35"
            fill="rgba(0, 0, 255, 0.1)"
            stroke="#000000"
          />
        );
      case "arrow":
        return (
          <polygon
            points="50,15 70,35 55,35 55,85 45,85 45,35 30,35"
            fill="rgba(0, 0, 255, 0.1)"
            stroke="#000000"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      as="svg"
      position="absolute"
      left={shape.x}
      top={shape.y}
      width={`${shape.width}px`}
      height={`${shape.height}px`}
      onClick={onClick}
      cursor="pointer"
    >
      {renderShape()}
    </Box>
  );
};

export default ShapeToolBar;
