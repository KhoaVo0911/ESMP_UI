import React, { useState } from "react";
import {
  Box,
  Text,
  Grid,
  VStack,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const boothDataInitial = [
  { id: 1, status: "available" },
  { id: 2, status: "available" },
  { id: 3, status: "unavailable" },
  { id: 4, status: "available" },
  { id: 5, status: "unavailable" },
  { id: 6, status: "available" },
  { id: 7, status: "available" },
  { id: 8, status: "available" },
  { id: 9, status: "available" },
  { id: 10, status: "available" },
  { id: 11, status: "available" },
  { id: 12, status: "unavailable" },
  { id: 13, status: "available" },
  { id: 14, status: "available" },
  { id: 15, status: "unavailable" },
  { id: 16, status: "available" },
  { id: 17, status: "available" },
  { id: 18, status: "available" },
  { id: 19, status: "available" },
  { id: 20, status: "available" },
  { id: 21, status: "available" },
  { id: 22, status: "available" },
  { id: 23, status: "available" },
  { id: 24, status: "unavailable" },
  { id: 25, status: "available" },
  { id: 26, status: "available" },
  { id: 27, status: "available" },
  { id: 28, status: "unavailable" },
  { id: 29, status: "available" },
  { id: 30, status: "available" },
];

const SelectBooth = ({ isPopup, isOpen, onClose }) => {
  const [boothData, setBoothData] = useState(boothDataInitial);
  const navigate = useNavigate(); // Hook to navigate to a different route

  const handleBoothClick = (boothId) => {
    setBoothData((prevData) =>
      prevData.map(
        (booth) =>
          booth.id === boothId && booth.status === "available"
            ? { ...booth, status: "selected" }
            : booth.id === boothId && booth.status === "selected"
            ? { ...booth, status: "available" } // Deselect if clicked again
            : booth // Otherwise, no change
      )
    );
  };

  const handleConfirm = () => {
    onClose(); // Close the modal
    navigate("/eventenrolled"); // Navigate to the EventEnrolled page
  };

  const renderBoothColumn = (booths) => (
    <VStack spacing={3}>
      {booths.map((booth) => (
        <Box
          key={booth.id}
          w={12}
          h={12}
          borderRadius="md"
          cursor={booth.status === "available" ? "pointer" : "not-allowed"}
          bg={
            booth.status === "available"
              ? "red.300"
              : booth.status === "unavailable"
              ? "gray.300"
              : "red.700"
          }
          onClick={() =>
            booth.status !== "unavailable" && handleBoothClick(booth.id)
          }
          opacity={booth.status === "unavailable" ? 0.6 : 1}
        />
      ))}
    </VStack>
  );

  const columns = [
    boothData.slice(0, 5), // Column 1
    boothData.slice(5, 10), // Column 2
    boothData.slice(10, 15), // Column 3
    boothData.slice(15, 20), // Column 4
    boothData.slice(20, 25), // Column 5
    boothData.slice(25, 30), // Column 6
  ];

  const boothGrid = (
    <>
      <Flex justify="center" mb={4}>
        <Box bg="red.500" w={4} h={4} mr={2} />
        <Text mr={4}>Available</Text>
        <Box bg="gray.300" w={4} h={4} mr={2} />
        <Text mr={4}>Unavailable</Text>
        <Box bg="red.700" w={4} h={4} mr={2} />
        <Text>Selected</Text>
      </Flex>
      {/* Booth grid layout */}
      <Grid templateColumns="repeat(3, 1fr)" gap={6} justifyItems="center">
        <Grid templateColumns="repeat(2, 1fr)" gap={3}>
          {renderBoothColumn(columns[0])}
          {renderBoothColumn(columns[1])}
        </Grid>
        <Grid templateColumns="repeat(2, 1fr)" gap={3}>
          {renderBoothColumn(columns[2])}
          {renderBoothColumn(columns[3])}
        </Grid>
        <Grid templateColumns="repeat(2, 1fr)" gap={3}>
          {renderBoothColumn(columns[4])}
          {renderBoothColumn(columns[5])}
        </Grid>
      </Grid>
    </>
  );

  // If isPopup is true, render as a modal
  if (isPopup) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Booth</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{boothGrid}</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleConfirm}>
              Confirm
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  // If not a popup, wrap in a box with a white background
  return (
    <Box bg="white" p={6} borderRadius="md" boxShadow="md">
      {boothGrid}
    </Box>
  );
};

export default SelectBooth;
