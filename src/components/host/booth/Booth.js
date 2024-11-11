// Booth.js
import React from "react";
import { Box, Text } from "@chakra-ui/react";

const Booth = ({ booth }) => {
  return (
    <Box
      className={booth.selected ? "selected" : ""}
      bg="blue.200"
      border="1px solid black"
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      pointerEvents="auto"
    >
      <Text textAlign="center">{booth.name}</Text>
    </Box>
  );
};

export default Booth;
