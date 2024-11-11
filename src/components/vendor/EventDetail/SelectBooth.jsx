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
import { useNavigate } from "react-router-dom";
import axios from "axios";

const vendorInEventURL = "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/vendorinevent";

const SelectBooth = ({ isPopup, isOpen, onClose, accessToken, eventId, vendorId }) => {
  const [boothData, setBoothData] = useState([]);
  const [selectedBoothId, setSelectedBoothId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoothData = async () => {
      try {
        const response = await axios.get(
          "https://668e540abf9912d4c92dcd67.mockapi.io/booth",
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setBoothData(response.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu booth:", err);
        setError("Không thể lấy dữ liệu booth.");
      } finally {
        setLoading(false);
      }
    };

    fetchBoothData();
  }, [accessToken]);

  const handleBoothClick = (boothId) => {
    const booth = boothData.find((booth) => booth.id === boothId);
    if (booth.status === "available") {
      setSelectedBoothId(boothId);
    }
  };

  const handleConfirm = async () => {
    if (selectedBoothId) {
      try {
        // Gửi yêu cầu POST để đăng ký booth
        await axios.post(
          `${vendorInEventURL}/${vendorId}/${eventId}`,
          { vendorId, eventId },
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Cập nhật trạng thái booth và chuyển hướng
        setBoothData((prevData) =>
          prevData.map((booth) =>
            booth.id === selectedBoothId ? { ...booth, status: "unavailable" } : booth
          )
        );
        setSelectedBoothId(null);
        onClose();
        navigate("/eventenrolled", {
          state: { accessToken, eventId, vendorId },
        });
      } catch (error) {
        console.error("Lỗi khi đăng ký cửa hàng trong sự kiện:", error);
        setError("Đã xảy ra lỗi khi đăng ký.");
      }
    }
  };

  // Render booth columns
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
                ? "green.500" // Highlight selected booth
                : "green.300"
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

  // Split the data into columns for the booth layout
  const columns = [
    boothData.slice(0, 5), // Column 1
    boothData.slice(5, 10), // Column 2
    boothData.slice(10, 15), // Column 3
    boothData.slice(15, 20), // Column 4
  ];

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error" mb={4}>
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chọn một Booth</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Hướng dẫn trạng thái booth */}
          <Flex justify="center" mb={4}>
            <Box bg="green.300" w={4} h={4} mr={2} />
            <Text mr={4}>Còn trống</Text>
            <Box bg="gray.300" w={4} h={4} mr={2} />
            <Text mr={4}>Không khả dụng</Text>
            <Box bg="green.500" w={4} h={4} mr={2} />
            <Text>Đã chọn</Text>
          </Flex>

          {/* Bố cục booth dưới dạng lưới */}
          <Grid templateColumns="repeat(2, 1fr)" gap={6} justifyItems="center">
            {columns.map((col, index) => (
              <Grid templateColumns="repeat(1, 1fr)" gap={3} key={index}>
                {renderBoothColumn(col)}
              </Grid>
            ))}
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleConfirm}
            isDisabled={!selectedBoothId} // Vô hiệu hóa nút nếu chưa chọn booth
          >
            Xác nhận
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Hủy bỏ
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SelectBooth;
