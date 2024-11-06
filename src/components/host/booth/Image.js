import React from "react";
import { Rnd } from "react-rnd";
import { Box } from "@chakra-ui/react";

const ImageElement = ({
  image,
  onDragEnd,
  onResizeEnd,
  onClick,
  isSelected,
}) => {
  return (
    <Rnd
      default={{
        x: image.x,
        y: image.y,
        width: image.width,
        height: image.height,
      }}
      bounds="parent"
      onDragStop={(e, d) => {
        onDragEnd({ ...image, x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        onResizeEnd({
          ...image,
          width: ref.style.width.replace("px", ""),
          height: ref.style.height.replace("px", ""),
          x: position.x,
          y: position.y,
        });
      }}
      onClick={onClick}
      style={{
        border: isSelected ? "2px solid blue" : "1px solid transparent",
        zIndex: isSelected ? 10 : 1,
      }}
    >
      <Box width="100%" height="100%">
        <img
          src={image.src}
          alt="Uploaded"
          style={{ width: "100%", height: "100%", pointerEvents: "none" }}
        />
      </Box>
    </Rnd>
  );
};

export default ImageElement;
