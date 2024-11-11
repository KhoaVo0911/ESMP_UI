import React, { useState } from "react";
import { Box, Input } from "@chakra-ui/react";

const TextElement = ({ text, isSelected, onClick, onTextChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleContentChange = (e) => {
    if (onTextChange) {
      onTextChange({ ...text, content: e.target.value });
    }
  };

  return (
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
      onClick={(e) => {
        e.stopPropagation();
        onClick(text);
      }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      textAlign={text.textAlign}
      onDoubleClick={() => setIsEditing(true)}
    >
      {isEditing ? (
        <Input
          value={text.content}
          onChange={handleContentChange} // Đảm bảo gọi handleContentChange
          onBlur={() => setIsEditing(false)}
          autoFocus
        />
      ) : (
        text.content
      )}
    </Box>
  );
};

export default TextElement;
