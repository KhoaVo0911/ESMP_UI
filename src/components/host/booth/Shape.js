import React from "react";
import { Rnd } from "react-rnd";
import { Box } from "@chakra-ui/react";

const Shape = ({ shape, onShapeUpdate, isMainTemplate }) => {
  const renderShape = () => {
    const fillColor = isMainTemplate ? "transparent" : "none";
    const strokeColor = "black";
    const strokeWidth = isMainTemplate ? 4 : 2;

    return (
      <g>
        {shape.type === "rectangle" && (
          <rect
            width="100%"
            height="100%"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        )}
        {shape.type === "circle" && (
          <circle
            cx="50%"
            cy="50%"
            r="50%"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        )}
        {shape.type === "triangle" && (
          <polygon
            points="50,0 100,100 0,100"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        )}
        {shape.type === "pentagon" && (
          <polygon
            points="50,0 100,38 82,100 18,100 0,38"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        )}
        {shape.type === "hexagon" && (
          <polygon
            points="50,0 90,25 90,75 50,100 10,75 10,25"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        )}
        {shape.type === "star" && (
          <polygon
            points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        )}
        {shape.type === "arrow" && (
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

  const handleDragStop = (e, d) => {
    onShapeUpdate({
      ...shape,
      x: d.x,
      y: d.y,
    });
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    onShapeUpdate({
      ...shape,
      width: parseInt(ref.style.width, 10),
      height: parseInt(ref.style.height, 10),
      x: position.x,
      y: position.y,
    });
  };

  return (
    <Rnd
      size={{ width: shape.width, height: shape.height }}
      position={{ x: shape.x, y: shape.y }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      minWidth={50}
      minHeight={50}
      bounds="parent"
      enableResizing={true}
      disableDragging={isMainTemplate}
      style={{
        zIndex: isMainTemplate ? 1 : 10,
        pointerEvents: "all",
      }}
    >
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
    </Rnd>
  );
};

export default Shape;
