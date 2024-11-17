import React, { useState } from "react";
import { Box, Input } from "@chakra-ui/react";
import { Rnd } from "react-rnd";

const TextElement = ({
  text,
  isSelected,
  onClick,
  onTextChange,
  onDragEnd,
  onResizeEnd,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleContentChange = (e) => {
    if (onTextChange) {
      onTextChange({ ...text, name: e.target.value });
    }
  };

  return (
    <Rnd
      size={{ width: text.width, height: text.height }}
      position={{ x: text.x, y: text.y }}
      bounds="parent"
      onDragStop={(e, d) => {
        if (onDragEnd) {
          onDragEnd({ ...text, x: d.x, y: d.y });
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (onResizeEnd) {
          onResizeEnd({
            ...text,
            width: parseInt(ref.style.width, 10),
            height: parseInt(ref.style.height, 10),
            x: position.x,
            y: position.y,
          });
        }
      }}
      style={{
        zIndex: isSelected ? 10 : 1,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(text);
      }}
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
    >
      <Box
        width="100%"
        height="100%"
        border={isSelected ? "2px solid blue" : "1px dashed #ccc"}
        backgroundColor={text.backgroundColor || "transparent"}
        fontSize={`${text.fontSize}px`}
        color={text.color}
        fontWeight={text.bold ? "bold" : "normal"}
        fontStyle={text.italic ? "italic" : "normal"}
        textDecoration={text.underline ? "underline" : "none"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign={text.textAlign}
        onDoubleClick={() => setIsEditing(true)}
      >
        {isEditing ? (
          <Input
            value={text.name}
            onChange={handleContentChange}
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          text.name
        )}
      </Box>
    </Rnd>
  );
};

export default TextElement;
