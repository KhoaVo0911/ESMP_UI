import React from "react";
import { Box } from "@chakra-ui/react";
import { useDrop } from "react-dnd";

const BoothDropZone = ({ id, onDrop }) => {
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
      bg={isOver ? "green.200" : "gray.200"}
      w="100px"
      h="100px"
      borderRadius="md"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      Drop Here
    </Box>
  );
};

export default BoothDropZone;
