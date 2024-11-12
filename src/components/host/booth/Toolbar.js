import React from "react";
import {
  Box,
  IconButton,
  HStack,
  Button,
  Flex,
  useToast,
} from "@chakra-ui/react";
import {
  MdUndo,
  MdRedo,
  MdGridOn,
  MdZoomOut,
  MdZoomIn,
  MdDelete,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams to get eventId from URL

const Toolbar = ({
  handleUndo,
  handleRedo,
  handleSave,
  handleGridToggle,
  handleZoomIn,
  handleZoomOut,
  handleDelete,
  isDeleteDisabled,
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { eventId } = useParams(); // Get eventId from URL

  const handleCancel = () => {
    navigate(`/event/${eventId}/booth-plan`); // Navigate back to Event Details with eventId
  };

  const handleSaveWithNotification = () => {
    handleSave(); // Call the original save function
    toast({
      title: "Booth Plan Saved.",
      description: "Your booth plan has been successfully saved.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex
      bg="gray.100"
      p={2}
      borderBottom="1px solid"
      borderColor="gray.200"
      justifyContent="space-between"
      alignItems="center"
    >
      <HStack spacing={4}>
        <IconButton aria-label="Undo" icon={<MdUndo />} onClick={handleUndo} />
        <IconButton aria-label="Redo" icon={<MdRedo />} onClick={handleRedo} />
        <IconButton
          aria-label="Grid Toggle"
          icon={<MdGridOn />}
          onClick={handleGridToggle}
        />
        <IconButton
          aria-label="Zoom Out"
          icon={<MdZoomOut />}
          onClick={handleZoomOut}
        />
        <IconButton
          aria-label="Zoom In"
          icon={<MdZoomIn />}
          onClick={handleZoomIn}
        />
        <IconButton
          aria-label="Delete"
          icon={<MdDelete />}
          onClick={handleDelete}
          isDisabled={isDeleteDisabled}
        />
      </HStack>

      <HStack spacing={4}>
        <Button
          onClick={handleSaveWithNotification}
          bg="blue.400"
          color="white"
          size="md"
          _hover={{ bg: "blue.500" }}
        >
          Save
        </Button>
        <Button onClick={handleCancel} bg="red.300" color="white" size="md">
          Cancel
        </Button>
      </HStack>
    </Flex>
  );
};

export default Toolbar;
