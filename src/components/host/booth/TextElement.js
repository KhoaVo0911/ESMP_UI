import React, { useState } from "react";
import { Box, Input } from "@chakra-ui/react";

const TextElement = ({ text, isSelected, onClick, onTextChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleContentChange = (e) => {
    if (onTextChange) {
      onTextChange({ ...text, name: e.target.value });
    }
  };

  return (
    <Box
      position="absolute"
      zIndex={isSelected ? 10 : 1}
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
      onClick={(e) => {
        e.stopPropagation();
        onClick(text);
      }}
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
  );
};

export default TextElement;
