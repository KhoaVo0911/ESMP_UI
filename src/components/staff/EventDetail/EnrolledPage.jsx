import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Text,
  Image,
  VStack,
  Button,
  Spinner,
  Flex,
  Divider,
} from "@chakra-ui/react";
import SelectBooth from "./SelectBooth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../shared/firebase/firebaseConfig";

const URL = "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/event";

const EventEnrolled = () => {
  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem("accessToken") || "";
  const vendorId = sessionStorage.getItem("vendorId") || "";
  const eventId = sessionStorage.getItem("eventId");
  const hostId = sessionStorage.getItem("hostId") || ""; // Lấy hostId từ sessionStorage

  const [eventDetail, setEventDetail] = useState(null);
  const [boothData, setBoothData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = await axios.get(`${URL}/${eventId}`, {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const event = response.data;

        // Lấy URL ảnh từ Firebase
        const imageRef = ref(storage, `${hostId}/${eventId}/thumbnail`);
        try {
          event.logo = await getDownloadURL(imageRef);
        } catch (error) {
          console.error("Error fetching event image:", error);
          event.logo = "https://via.placeholder.com/150"; // URL mặc định nếu không có ảnh
        }

        setEventDetail(event);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event detail:", error);
        setError("Failed to fetch event details");
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [eventId, accessToken, hostId]);

  const handleShopClick = () => {
    navigate("/shop", {
      state: {
        accessToken,
        vendorId,
        eventId,
      },
    });
  };

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box p={10} textAlign="center">
        <Text fontSize="xl" color="red.500">{error}</Text>
      </Box>
    );
  }

  if (!eventDetail) {
    return (
      <Box p={10} textAlign="center">
        <Text fontSize="xl" color="gray.500">No event details available</Text>
      </Box>
    );
  }

  return (
    <Box padding="20px" bgGradient="linear(to-r, #d4f1f4, #f0e5d8)" minH="100vh">
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={10} mb={10}>
        <VStack align="flex-start" spacing={10}>
          <Text fontSize="4xl" fontWeight="bold" color="black">
            {eventDetail.name}
          </Text>
          <div style={{ width: "45%", display: "flex", justifyContent: "space-between" }}>
            <Text fontSize="lg" fontWeight="bold" color="gray.600">
              {new Date(eventDetail.startDate).toLocaleDateString()} - {new Date(eventDetail.endDate).toLocaleDateString()}
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="gray.600">
              {eventDetail.time}
            </Text>
          </div>
          <Button colorScheme="teal" size="lg" onClick={handleShopClick}>
            Shop
          </Button>
        </VStack>
        <Image
          src={eventDetail.logo} // Sử dụng URL đã tải từ Firebase
          alt={eventDetail.name}
          borderRadius="lg"
          boxShadow="lg"
        />
      </Grid>

      <Divider borderColor="gray.300" borderWidth="1px" mb={10} />

      <Text fontSize="md" color="gray.600" mb={10}>
        Welcome to the <strong>{eventDetail.name}</strong>, where we come together to celebrate the full moon and immerse ourselves in the warm, vibrant atmosphere of autumn. This year's event promises to bring you and your family a culturally rich and meaningful experience.
      </Text>

      <Divider borderColor="gray.300" borderWidth="1px" mb={10} />

      <Text fontSize="2xl" fontWeight="bold" color="black" mb={4}>
        Select Booth
      </Text>
      <Box>
        <SelectBooth
          boothData={boothData}
          setBoothData={setBoothData}
        />
      </Box>

      <Divider borderColor="gray.300" borderWidth="1px" mb={10} />

      <Text fontSize="2xl" fontWeight="bold" color="black" mb={4}>
        Location
      </Text>
      <div style={{ width: "100%", height: "300px", marginBottom: "20px" }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6100105370224!2d106.8073080746704!3d10.84112758931162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2sFPT%20University%20HCMC!5e0!3m2!1sen!2s!4v1726308048313!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="FPT University HCMC Map"
        ></iframe>
      </div>
    </Box>
  );
};

export default EventEnrolled;
