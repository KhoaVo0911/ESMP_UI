import React from "react";
import { Rnd } from "react-rnd";
import { Box, Text } from "@chakra-ui/react";

const Booth = ({ booth, onBoothUpdate }) => {
  const handleDragStop = (e, d) => {
    onBoothUpdate({
      ...booth,
      x: d.x,
      y: d.y,
    });
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    onBoothUpdate({
      ...booth,
      width: parseInt(ref.style.width, 10),
      height: parseInt(ref.style.height, 10),
      x: position.x,
      y: position.y,
    });
  };

  return (
    <Rnd
      size={{ width: booth.width, height: booth.height }}
      position={{ x: booth.x, y: booth.y }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      minWidth={50}
      minHeight={50}
      bounds="parent"
      enableResizing={true}
      disableDragging={false}
      style={{ zIndex: 10 }}
    >
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
    </Rnd>
  );
};

export default Booth;
