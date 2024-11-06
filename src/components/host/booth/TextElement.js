import React, { useState } from "react";
import { Box, Input } from "@chakra-ui/react";
import { Rnd } from "react-rnd";

const TextElement = ({
  text,
  onDragEnd,
  onResizeEnd,
  onClick,
  isSelected,
  onTextChange,
}) => {
  const [dimensions, setDimensions] = useState({
    width: text.width,
    height: text.height,
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleResizeStop = (e, direction, ref, delta, position) => {
    setDimensions({
      width: ref.offsetWidth,
      height: ref.offsetHeight,
    });
    onResizeEnd({
      ...text,
      width: ref.offsetWidth,
      height: ref.offsetHeight,
      x: position.x,
      y: position.y,
    });
  };

  const handleContentChange = (e) => {
    onTextChange({ ...text, content: e.target.value });
  };

  return (
    <Rnd
      size={{ width: dimensions.width, height: dimensions.height }}
      position={{ x: text.x, y: text.y }}
      onDragStop={(e, d) => onDragEnd({ ...text, x: d.x, y: d.y })}
      onResizeStop={handleResizeStop}
      onClick={(e) => {
        e.stopPropagation();
        onClick(text);
      }}
      style={{
        border: isSelected ? "2px solid blue" : "1px dashed #ccc",
        backgroundColor: text.backgroundColor || "transparent",
        fontSize: `${text.fontSize}px`,
        color: text.color,
        fontWeight: text.bold ? "bold" : "normal",
        fontStyle: text.italic ? "italic" : "normal",
        textDecoration: text.underline ? "underline" : "none",
      }}
    >
      {isEditing ? (
        <Input
          value={text.content}
          onChange={handleContentChange}
          onBlur={() => setIsEditing(false)}
          autoFocus
        />
      ) : (
        <Box
          onDoubleClick={() => setIsEditing(true)}
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          textAlign={text.textAlign}
        >
          {text.content}
        </Box>
      )}
    </Rnd>
  );
};

export default TextElement;
