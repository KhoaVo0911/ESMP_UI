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

const URL = "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/event";
const vendorInEventURL = "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/vendorinevent";

const EventDetail = () => {
  const eventId = sessionStorage.getItem("eventId");
  const accessToken = sessionStorage.getItem("accessToken");
  const vendorId = sessionStorage.getItem("vendorId");
  const [eventDetail, setEventDetail] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra nếu vendor đã đăng ký trong sự kiện và điều hướng nếu có
    const checkVendorInEvent = async () => {
      try {
        const response = await axios.get(`${vendorInEventURL}/${vendorId}/${eventId}`, {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        // Nếu vendorId và eventId trùng khớp, điều hướng đến trang /eventenrolled
        if (response.data.eventId === eventId && response.data.vendorId === vendorId) {
          navigate("/eventenrolled", { state: { accessToken, eventId, vendorId } });
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái cửa hàng trong sự kiện:", error);
      }
    };

    checkVendorInEvent();

    // Lấy chi tiết sự kiện từ API nếu chưa điều hướng
    axios
      .get(`${URL}/${eventId}`, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setEventDetail(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy chi tiết sự kiện:", error);
      });
  }, [eventId, accessToken, vendorId, navigate]);

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
            Đăng ký ngay
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
        Chào mừng đến với <strong>{eventDetail.name}</strong>, nơi chúng ta cùng nhau kỷ niệm và 
        đắm mình trong một trải nghiệm độc đáo. Sự kiện này hứa hẹn sẽ mang đến cho bạn và gia đình 
        những trải nghiệm văn hóa phong phú và đầy ý nghĩa, tràn đầy sự phấn khích và ấm áp.
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
