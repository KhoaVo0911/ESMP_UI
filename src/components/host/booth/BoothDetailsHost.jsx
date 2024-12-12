import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

const BoothDetailsHost = ({ locationId, onClose }) => {
  const [boothDetails, setBoothDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoothDetails = async () => {
      try {
        const response = await axios.get(
          `https://esmpbe.id.vn/api/eventpayment/location/${locationId}`,
          {
            headers: {
              Authorization: sessionStorage.getItem("accessToken") || "",
            },
          }
        );
        setBoothDetails(response.data);
      } catch (err) {
        console.error("Error fetching booth details:", err);
        const errorMessage =
          err.response?.data?.message || "Failed to load booth details.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (locationId) {
      fetchBoothDetails();
    }
  }, [locationId]);

  return (
    <Modal isOpen={true} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" color="teal.500">
          Booth Details
        </ModalHeader>
        <ModalBody>
          {loading ? (
            <VStack spacing={4}>
              <Spinner size="lg" />
              <Text>Loading booth details...</Text>
            </VStack>
          ) : error ? (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          ) : boothDetails ? (
            <VStack align="start" spacing={4}>
              <Text fontSize="lg">
                <strong>Name:</strong> {boothDetails.name || "N/A"}
              </Text>
              <Text fontSize="lg">
                <strong>Status:</strong> {boothDetails.status || "N/A"}
              </Text>
              <Text fontSize="lg">
                <strong>Vendor:</strong> {boothDetails.vendor || "N/A"}
              </Text>
              <Text fontSize="lg">
                <strong>Price:</strong>{" "}
                {parseInt(boothDetails.price || 0).toLocaleString()} VND
              </Text>
            </VStack>
          ) : (
            <Text>No details available for this booth.</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BoothDetailsHost;
