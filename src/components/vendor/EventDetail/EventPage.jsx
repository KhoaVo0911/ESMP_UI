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
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../../shared/firebase/firebaseConfig";
import SelectBooth from "./SelectBooth";

const BASE_URL =
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/event";
const vendorInEventURL =
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/vendorinevent";

const EventDetail = () => {
  const { state } = useLocation(); // Lấy state từ điều hướng
  const eventId = state?.eventId; // eventId được truyền từ trang trước
  const accessToken = sessionStorage.getItem("accessToken");
  const vendorId = sessionStorage.getItem("vendorId");
  const hostId = sessionStorage.getItem("hostId") || "";

  const [eventDetail, setEventDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    if (!eventId) {
      console.error("Missing eventId");
      navigate("/"); // Nếu thiếu eventId, quay lại trang chính
      return;
    }

    // Kiểm tra vendor đã đăng ký sự kiện chưa
    const checkVendorInEvent = async () => {
      try {
        const response = await axios.get(
          `${vendorInEventURL}/${vendorId}/${eventId}`,
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (
          response.data.eventId === eventId &&
          response.data.vendorId === vendorId
        ) {
          navigate("/eventenrolled", {
            state: { accessToken, eventId, vendorId },
          });
        }
      } catch (error) {
        console.warn("Vendor is not registered in the event:", error);
      }
    };

    const fetchEventDetail = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/${eventId}`, {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const event = response.data;

        // Lấy hình ảnh từ Firebase
        try {
          const imagesRef = ref(storage, `${hostId}/${eventId}`);
          const imagesList = await listAll(imagesRef);
          if (imagesList.items.length > 0) {
            const mainImageRef = imagesList.items[0];
            event.logo = await getDownloadURL(mainImageRef);
          } else {
            event.logo = "https://via.placeholder.com/150";
          }
        } catch (error) {
          console.warn("Error fetching event image:", error);
          event.logo = "https://via.placeholder.com/150";
        }

        setEventDetail(event);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setLoading(false);
      }
    };

    checkVendorInEvent();
    fetchEventDetail();
  }, [eventId, accessToken, vendorId, hostId, navigate]);

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  if (!eventDetail) {
    return (
      <Box p={10} textAlign="center">
        <Text fontSize="xl" color="gray.500">
          No event details found
        </Text>
      </Box>
    );
  }

  return (
    <Box padding="40px" bgGradient="linear(to-r, #f0f4f8, #d4f1f4)" minH="100vh">
      {/* Chi tiết sự kiện */}
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
        {/* Thông tin sự kiện */}
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

        {/* Hình ảnh sự kiện */}
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

      {/* Mô tả sự kiện */}
      <Text
        fontSize="lg"
        color="gray.700"
        mb={8}
        maxW="900px"
        mx="auto"
        textAlign="center"
      >
        Welcome to <strong>{eventDetail.name}</strong>, where we come together
        to celebrate and immerse ourselves in a unique experience. This event
        promises to bring you and your family a culturally rich and meaningful
        experience, filled with excitement and warmth.
      </Text>

      {/* Component SelectBooth */}
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
