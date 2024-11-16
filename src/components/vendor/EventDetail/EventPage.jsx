import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SelectBooth from "./SelectBooth";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../shared/firebase/firebaseConfig";

const URL = "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/event";
const vendorInEventURL = "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/vendorinevent";

const EventDetail = () => {
  const eventId = sessionStorage.getItem("eventId");
  const accessToken = sessionStorage.getItem("accessToken");
  const vendorId = sessionStorage.getItem("vendorId");
  const hostId = sessionStorage.getItem("hostId") || ""; // Get hostId from sessionStorage
  const [eventDetail, setEventDetail] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if vendor is registered in the event and navigate if true
    const checkVendorInEvent = async () => {
      try {
        const response = await axios.get(`${vendorInEventURL}/${vendorId}/${eventId}`, {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        // If vendorId and eventId match, navigate to /eventenrolled
        if (response.data.eventId === eventId && response.data.vendorId === vendorId) {
          navigate("/eventenrolled", { state: { accessToken, eventId, vendorId } });
        }
      } catch (error) {
        console.error("Error checking vendor status in event:", error);
      }
    };

    checkVendorInEvent();

    // Fetch event details from API
    const fetchEventDetail = async () => {
      try {
        const response = await axios.get(`${URL}/${eventId}`, {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const event = response.data;

        // Get image URL from Firebase
        const imageRef = ref(storage, `${hostId}/${eventId}/thumbnail`);
        try {
          event.logo = await getDownloadURL(imageRef);
        } catch (error) {
          console.error("Error fetching event image:", error);
          event.logo = "https://via.placeholder.com/150"; // Default URL if image is not available
        }

        setEventDetail(event);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetail();
  }, [eventId, accessToken, vendorId, hostId, navigate]);

  if (!eventDetail) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  return (
    <Box padding="40px" bgGradient="linear(to-r, #f0f4f8, #d4f1f4)" minH="100vh">
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
            Register Now
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
        Welcome to <strong>{eventDetail.name}</strong>, where we come together to celebrate and immerse ourselves in a unique experience. This event promises to bring you and your family a culturally rich and meaningful experience, filled with excitement and warmth.
      </Text>

      {/* Render SelectBooth component as a modal */}
      <Box>
        <SelectBooth
          isPopup={true}
          isOpen={isOpen}
          onClose={onClose}
          accessToken={accessToken}
          eventId={eventId}
          vendorId={vendorId}
        />
      </Box>
    </Box>
  );
};

export default EventDetail;
