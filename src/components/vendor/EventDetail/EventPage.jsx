import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Text,
  Button,
  Image,
  VStack,
  HStack,
  useDisclosure,
  Divider,
} from "@chakra-ui/react";
import { ArrowBack } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom"; // Use useParams for route params
import axios from "axios"; // Import axios for API calls
import SelectBooth from "./SelectBooth"; // Import component SelectBooth

const EventPage = () => {
  const { eventId } = useParams(); // Get eventId from route parameters
  const navigate = useNavigate();
  const [event, setEvent] = useState(null); // State to store event data
  const [shops, setShops] = useState([]); // State to store shops data
  const [loading, setLoading] = useState(true); // State for loading
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal control

  useEffect(() => {
    // Fetch event details and shops from the correct mock API endpoint
    const fetchEventDetails = async () => {
      try {
        const eventResponse = await axios.get(
          `https://668e540abf9912d4c92dcd67.mockapi.io/events/${eventId}/eventDetails`
        );
        const eventData = eventResponse.data;

        if (Array.isArray(eventData) && eventData.length > 0) {
          setEvent(eventData[0]);
        } else {
          setEvent(eventData);
        }

        const shopResponse = await axios.get(
          `https://668e540abf9912d4c92dcd67.mockapi.io/events/${eventId}/shops`
        );
        setShops(shopResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event or shop details:", error);
        setLoading(false); // Handle error and stop loading
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleBackClick = () => {
    navigate("/eventsVendor", { state: { selectedMenuItem: "4" } });
  };

  const handleConfirmBoothSelection = () => {
    onClose(); // Close the modal after confirming booth selection
    navigate("/eventenrolled"); // Navigate to the event enrolled page
  };

  if (loading) {
    return <Text>Loading event details...</Text>;
  }

  return (
    <Box
      padding="20px"
      bgGradient="linear(to-r, #d4f1f4, #d4f1f4, #f0e5d8)"
      minH="100vh"
    >
      {/* Back Button */}
      <ArrowBack
        onClick={handleBackClick}
        style={{
          cursor: "pointer",
          fontSize: "24px",
          marginRight: "10px",
          marginBottom: "20px",
        }}
      />

      {/* Event Title Section */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={10} mb={10}>
        <VStack align="flex-start" spacing={10}>
          <Text fontSize="4xl" fontWeight="bold" color="black">
            {event?.title}
          </Text>
          <div
            style={{
              width: "45%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Text fontSize="lg" fontWeight="bold" color="gray.600">
              {event?.startDate}
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="gray.600">
              {event?.endDate}
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="gray.600">
              {event?.time}
            </Text>
          </div>

          <Button colorScheme="teal" size="lg" onClick={onOpen}>
            ENROLL
          </Button>
        </VStack>
        <Image
          src={event?.imageURL}
          alt={event?.title}
          borderRadius="lg"
          boxShadow="lg"
        />
      </Grid>

      {/* Divider between Event Title and Shops */}
      <Divider mb={10} />

      {/* Existing Shops Section */}
      <Text fontSize="2xl" fontWeight="bold" color="black" mb={4}>
        Existing Shops
      </Text>
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={6}
        mb={10}
      >
        {shops.map((shop) => (
          <Box
            key={shop.id}
            bg="white"
            borderRadius="lg"
            boxShadow="md"
            overflow="hidden"
            _hover={{
              boxShadow: "lg",
              transform: "scale(1.02)",
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Image
              src={shop.imageURL}
              alt={shop.name}
              height="200px"
              width={"100%"}
              objectFit="cover"
            />
            <Box p={4}>
              <Text fontWeight="bold" mb={2} fontSize="xl">
                {shop.name}
              </Text>
              <HStack spacing={2}>
                <Text color="gray.500" fontSize="sm" fontWeight="bold">
                  FLOOR {shop.floor}
                </Text>
              </HStack>
            </Box>
          </Box>
        ))}
      </Grid>

      {/* Divider between Shops and Select Booth */}
      <Divider mb={10} />

      {/* Popup Select Booth */}
      <SelectBooth isPopup={true} isOpen={isOpen} onClose={onClose} />

      {/* Divider between Select Booth and any other future content */}
      <Divider mb={10} />
    </Box>
  );
};

export default EventPage;
