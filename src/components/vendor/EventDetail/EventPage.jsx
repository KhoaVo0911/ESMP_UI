import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Image,
  VStack,
  HStack,
  Button,
  Divider,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import SelectBooth from "./SelectBooth"; // Import the SelectBooth component

const URL = "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/event";

const EventDetail = () => {
  const { eventId } = useParams(); // Get eventId from URL
  const location = useLocation();
  const vendorId = location.state?.vendorId || "";
  const accessToken = location.state?.accessToken || ""; // Get accessToken from state
  const [eventDetail, setEventDetail] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal open/close management

  useEffect(() => {
    // Fetch event details from the API
    axios
      .get(`${URL}/${eventId}`, {
        headers: {
          Authorization: `${accessToken}`, // Add accessToken to headers
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setEventDetail(response.data);
      })
      .catch((error) => {
        console.error("Error fetching event detail:", error);
      });
  }, [eventId, accessToken]);

  if (!eventDetail) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    ); // Show a centered loading spinner while waiting for data
  }

  return (
    <Box
      padding="40px"
      bgGradient="linear(to-r, #f0f4f8, #d4f1f4)"
      minH="100vh"
    >
      {/* Event Details Card */}
      <Flex
        direction={{ base: "column", lg: "row" }}
        justify="space-between"
        align="center"
        bg="white"
        borderRadius="xl"
        boxShadow="xl"
        p="30px"
        mb="40px"
        maxW="1200px"
        mx="auto"
      >
        {/* Event Info */}
        <VStack align="flex-start" spacing={6} maxW="500px">
          <Text fontSize="3xl" fontWeight="bold" color="teal.700">
            {eventDetail.name}
          </Text>
          <HStack spacing={6}>
            <Text fontSize="lg" fontWeight="medium" color="gray.600">
              {new Date(eventDetail.startDate).toLocaleDateString()} -{" "}
              {new Date(eventDetail.endDate).toLocaleDateString()}
            </Text>
          </HStack>
          <Button colorScheme="teal" size="md" onClick={onOpen}>
            ENROLL NOW
          </Button>
        </VStack>

        {/* Event Image */}
        <Image
          src={eventDetail.logo}
          alt={eventDetail.name}
          borderRadius="lg"
          boxShadow="md"
          objectFit="cover"
          height={{ base: "250px", lg: "300px" }}
          width={{ base: "100%", lg: "400px" }}
          mt={{ base: "20px", lg: "0" }}
        />
      </Flex>

      <Divider borderColor="gray.300" borderWidth="1px" mb={10} />

      {/* Event Description */}
      <Text fontSize="lg" color="gray.700" mb={8} maxW="900px" mx="auto" textAlign="center">
        Welcome to the <strong>{eventDetail.name}</strong>, where we come together to celebrate
        and immerse ourselves in a unique experience. This event promises to bring 
        you and your family a culturally rich and meaningful experience filled with excitement and warmth.
      </Text>

      {/* Render the SelectBooth component as a modal */}
      <Box>

      <SelectBooth
        isPopup={true}
        isOpen={isOpen}
        onClose={onClose}
        accessToken={accessToken}
        eventId={eventId}
        vendorId={vendorId} // Pass vendorId to SelectBooth
      />
    </Box>
    </Box>
  );
};

export default EventDetail;
