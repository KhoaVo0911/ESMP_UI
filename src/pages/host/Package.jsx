import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Text,
  VStack,
  Image,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const Package = () => {
  const [selectedPlan, setSelectedPlan] = useState(null); // Plan đã chọn
  const [qrCode, setQrCode] = useState(""); // QR code tương ứng với gói chọn
  const toast = useToast();

  // Fake API Call để lấy QR code
  const getQrCode = async (plan) => {
    try {
      const response = await axios.get(`/api/qrcode?plan=${plan}`);
      setQrCode(response.data.qrCode);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get QR Code.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
    getQrCode(plan);
  };

  return (
    <Box p={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={8}>
        Compare Plans
      </Text>
      <Text fontSize="md" mb={8}>
        Choose your workspace plan according to Platform usage time.
      </Text>

      {/* Các lựa chọn Plan */}
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <Box
          p={6}
          border="1px"
          borderColor={selectedPlan === "400k" ? "blue.400" : "gray.200"}
          borderRadius="md"
          textAlign="center"
          onClick={() => handlePlanSelection("400k")}
          cursor="pointer"
          _hover={{ borderColor: "blue.500" }}
        >
          <Text fontSize="2xl" fontWeight="bold">
            400.000 đ
          </Text>
          <Button
            mt={4}
            variant={selectedPlan === "400k" ? "solid" : "outline"}
          >
            {selectedPlan === "400k" ? "Your Plan" : "Choose This Plan"}
          </Button>
          <Text mt={4} fontSize="sm" color="gray.500">
            Gold Plan - Buy 3 months get 1 month free
          </Text>
        </Box>

        <Box
          p={6}
          border="1px"
          borderColor={selectedPlan === "750k" ? "blue.400" : "gray.200"}
          borderRadius="md"
          textAlign="center"
          onClick={() => handlePlanSelection("750k")}
          cursor="pointer"
          _hover={{ borderColor: "blue.500" }}
        >
          <Text fontSize="2xl" fontWeight="bold">
            750.000 đ
          </Text>
          <Button
            mt={4}
            variant={selectedPlan === "750k" ? "solid" : "outline"}
          >
            {selectedPlan === "750k" ? "Your Plan" : "Choose This Plan"}
          </Button>
          <Text mt={4} fontSize="sm" color="gray.500">
            Premiere Plan - Buy 6 months get 2 months free
          </Text>
        </Box>
      </Grid>

      {/* QR Code và thông tin thanh toán */}
      {selectedPlan && (
        <VStack
          mt={12}
          spacing={4}
          border="1px"
          borderColor="gray.200"
          p={8}
          borderRadius="md"
        >
          <Text fontSize="xl" fontWeight="bold">
            Scan QR Code
          </Text>
          <Text fontSize="md" color="gray.500">
            Scan the QR code below using Internet Banking application to pay for{" "}
            {selectedPlan} Plan.
          </Text>
          {qrCode ? (
            <Image
              src={qrCode}
              alt="QR Code"
              boxSize="200px"
              objectFit="contain"
            />
          ) : (
            <Text>Loading QR Code...</Text>
          )}
          <Text fontSize="sm" color="gray.500">
            Note: This QR code will expire 30 minutes after creation.
          </Text>
          <Button colorScheme="red" size="lg">
            I HAVE COMPLETED THE PAYMENT ON THE APP
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default Package;
