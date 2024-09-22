import React from "react";
import { Box } from "@chakra-ui/react";
import { useDrag } from "react-dnd";

const Booth = ({ id, name, position, onClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "booth",
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <Box
      ref={drag}
      bg={isDragging ? "gray.400" : "blue.500"}
      w="100px"
      h="100px"
      borderRadius="md"
      display="flex"
      alignItems="center"
      justifyContent="center"
      cursor="move"
      onClick={() => onClick(name, position)}
    >
      <Box color="white" fontWeight="bold">
        {name}
      </Box>
    </Box>
  );
};

export default Booth;
