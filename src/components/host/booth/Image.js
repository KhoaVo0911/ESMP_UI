import React from "react";
import { Box } from "@chakra-ui/react";

const ImageElement = ({ image, onClick, isSelected }) => {
  return (
    <Box
      width={image.width}
      height={image.height}
      position="absolute"
      top={image.y}
      left={image.x}
      onClick={onClick}
      style={{
        border: isSelected ? "2px solid blue" : "1px solid transparent",
        transform: `rotate(${image.rotation || 0}deg)`,
        zIndex: isSelected ? 10 : 1,
      }}
    >
      <img
        src={image.src}
        alt="Uploaded"
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
      />
    </Box>
  );
};

export default ImageElement;
