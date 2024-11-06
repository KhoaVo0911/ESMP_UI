import React, { useState } from "react";
import { Box } from "@chakra-ui/react";

const ShapeContainer = ({ shape, onUpdate, children }) => {
  const [resizing, setResizing] = useState(false);
  const [initialMousePosition, setInitialMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [shapeStartSize, setShapeStartSize] = useState({
    width: shape.width,
    height: shape.height,
  });

  const handleMouseDown = (e) => {
    setResizing(true);
    setInitialMousePosition({ x: e.clientX, y: e.clientY });
    setShapeStartSize({ width: shape.width, height: shape.height });
  };

  const handleMouseMove = (e) => {
    if (!resizing) return;

    const deltaX = e.clientX - initialMousePosition.x;
    const deltaY = e.clientY - initialMousePosition.y;

    onUpdate({
      ...shape,
      width: Math.max(100, shapeStartSize.width + deltaX),
      height: Math.max(100, shapeStartSize.height + deltaY),
    });
  };

  const handleMouseUp = () => {
    setResizing(false);
  };

  return (
    <Box
      position="absolute"
      left={shape.x}
      top={shape.y}
      width={`${shape.width}px`}
      height={`${shape.height}px`}
      border="2px solid black" // Changed to solid border
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {children}

      {/* Resize handle */}
      <Box
        position="absolute"
        right="-5px"
        bottom="-5px"
        width="10px"
        height="10px"
        bg="white"
        border="1px solid black"
        cursor="se-resize"
        onMouseDown={handleMouseDown}
      />
    </Box>
  );
};

export default ShapeContainer;
