import React from "react";
import { Box } from "@chakra-ui/react";
import { useDrop } from "react-dnd";

const Shape = ({ id, children, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "booth",
    drop: (item) => onDrop(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <Box
      ref={drop}
      bg={isOver ? "gray.200" : "gray.100"}
      border="1px solid gray"
      p={4}
      minH="200px"
      borderRadius="md"
      position="relative"
    >
      {children}
    </Box>
  );
};

export default Shape;
