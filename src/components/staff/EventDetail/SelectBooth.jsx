import React, { useState, useEffect } from "react";
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
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios"; // Import axios for API requests

const SelectBooth = ({ isPopup, isOpen, onClose }) => {
  const [boothData, setBoothData] = useState([]);
  const [selectedBoothId, setSelectedBoothId] = useState(null); // Track the selected booth ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook to navigate to a different route

  // Fetch booth data from the API
  useEffect(() => {
    const fetchBoothData = async () => {
      try {
        const response = await axios.get(
          "https://668e540abf9912d4c92dcd67.mockapi.io/booth"
        );
        setBoothData(response.data);
      } catch (err) {
        setError("Failed to fetch booth data");
      } finally {
        setLoading(false);
      }
    };

    fetchBoothData();
  }, []);

  // Handle booth click
  const handleBoothClick = (boothId) => {
    const booth = boothData.find((booth) => booth.id === boothId);
    if (booth.status === "available") {
      setSelectedBoothId(boothId); // Only allow selecting one booth
    }
  };

  // Handle confirm button click
  const handleConfirm = () => {
    if (selectedBoothId) {
      setBoothData((prevData) =>
        prevData.map((booth) =>
          booth.id === selectedBoothId
            ? { ...booth, status: "unavailable" }
            : booth
        )
      );
      setSelectedBoothId(null); // Reset selection after confirmation
      onClose(); // Close the modal
      navigate("/eventenrolled"); // Navigate to the EventEnrolled page
    }
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
              ? booth.id === selectedBoothId
                ? "red.700" // Highlight selected booth
                : "red.300"
              : "gray.300"
          }
          onClick={() =>
            booth.status !== "unavailable" && handleBoothClick(booth.id)
          }
          opacity={booth.status === "unavailable" ? 0.6 : 1}
        />
      ))}
    </VStack>
  );

  // Split the data into columns
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

  // If loading, show spinner
  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  // If error, show alert
  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

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
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleConfirm}
              isDisabled={!selectedBoothId} // Disable confirm button if no booth is selected
            >
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
