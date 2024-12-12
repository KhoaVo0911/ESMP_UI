import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  useToast,
  Progress,
  Image,
  Button,
  Stack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const BoothPayment = ({ boothTypeDetails, onBackToPolicy, eventId }) => {
  const [remainingTime, setRemainingTime] = useState(900); // Countdown timer: 15 minutes
  const [qrUrl, setQrUrl] = useState(""); // QR Code URL
  const countdownIntervalRef = useRef(null); // Countdown interval reference
  const transactionCheckIntervalRef = useRef(null); // Transaction check interval reference
  const isPaymentProcessed = useRef(false); // Tránh xử lý thanh toán nhiều lần
  const toast = useToast();
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    if (!boothTypeDetails || !eventId) {
      console.error("Missing boothTypeDetails or eventId!");
      return;
    }

    // Generate QR Code URL
    const qrUrl = `https://img.vietqr.io/image/ACB-18254271-compact2.png?amount=${boothTypeDetails.price}&addInfo=${boothTypeDetails.typeName}&accountName=Dinh Quang Minh`;
    setQrUrl(qrUrl);

    setRemainingTime(900); // Reset countdown timer to 15 minutes

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    // Start countdown timer
    countdownIntervalRef.current = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdownIntervalRef.current); // Stop timer when it runs out
          clearInterval(transactionCheckIntervalRef.current); // Stop transaction check
          toast({
            title: "Payment failed",
            description: "The payment time has expired. Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          return 0;
        }
        return prevTime - 1; // Decrease countdown by 1 second
      });
    }, 1000);

    // Start transaction check (every 5 seconds)
    const startTime = new Date();
    transactionCheckIntervalRef.current = setInterval(() => {
      console.log("Checking payment...");
      checkPaid(boothTypeDetails.price, boothTypeDetails.typeName, startTime);
    }, 5000); // Check every 5 seconds

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(countdownIntervalRef.current);
      clearInterval(transactionCheckIntervalRef.current);
    };
  }, [boothTypeDetails, toast, eventId]);

  const checkPaid = async (price, content, startTime) => {
    if (isPaymentProcessed.current) {
      console.log("Payment already processed. Skipping check.");
      return; // Nếu đã xử lý thanh toán, không kiểm tra nữa
    }

    try {
      const response = await fetch(
        "https://script.googleusercontent.com/macros/echo?user_content_key=ezaHN4Gj4g-_qKyEpIFtMZQPkwJ0BbYQk3LG5p8k9b31Q7-kvTSXe2ZhZFRNoR7KhGYLTKEhpEOtSOcEac_Ekkb6_uiOxp_qm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnKv_VMEXf_TlwaF4o_-JkqZsBeOE2g6GtB2F-g5rnh9Lg6IxlmlB0WqV6H5thtDBueCS5gbHSu7aRDOzV-kpgRZaH2A0H0nPU9z9Jw9Md8uu&lib=MbbErZamKd_6ahvdDuCk2MKVwqDhlS6o-"
      );
      const data = await response.json();
      const lastPaid = data.data[data.data.length - 1];

      const lastPrice =
        lastPaid && lastPaid["Giá trị"] ? parseFloat(lastPaid["Giá trị"]) : 0;
      const lastContent =
        lastPaid && lastPaid["Mô tả"]
          ? lastPaid["Mô tả"].trim().toLowerCase()
          : "";
      const transactionTime = new Date(lastPaid["Ngày diễn ra"]).getTime();
      const startTimestamp = new Date(startTime).getTime();

      if (
        lastPrice >= price &&
        lastContent.includes(content.toLowerCase()) &&
        transactionTime > startTimestamp
      ) {
        console.log("Payment success detected!");

        isPaymentProcessed.current = true; // Đánh dấu thanh toán đã xử lý
        clearInterval(transactionCheckIntervalRef.current); // Stop transaction check
        clearInterval(countdownIntervalRef.current); // Stop countdown timer

        toast({
          title: "Payment successful",
          description: "You have successfully paid for the booth.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        await finalizePayment(); // Gọi hàm xử lý sau khi thanh toán
      }
    } catch (error) {
      console.error("Error during payment check:", error);
    }
  };

  const finalizePayment = async () => {
    try {
      console.log("Finalizing payment...");
      const vendorId = sessionStorage.getItem("vendorId"); // Lấy vendorId từ sessionStorage
      const accessToken = sessionStorage.getItem("accessToken");
      if (!eventId || !vendorId) {
        throw new Error("Missing eventId or vendorId");
      }

      // Tạo VendorInEvent bằng POST
      await axios.post(
        `https://esmpbe.id.vn/api/vendorinevent/${vendorId}/${eventId}`,
        {},
        { headers: { Authorization: accessToken } }
      );

      // GET VendorInEvent để lấy `vendorInEventId`
      const vendorInEventResponse = await axios.get(
        `https://esmpbe.id.vn/api/vendorinevent/${vendorId}/${eventId}`,
        { headers: { Authorization: accessToken } }
      );
      const vendorInEventId = vendorInEventResponse.data.vendorinEventId;

      // Cập nhật trạng thái booth thành "Booked"
      await axios.put(
        `https://esmpbe.id.vn/api/map`,
        {
          locationId: boothTypeDetails.locationId,
          status: "Booked",
        },
        { headers: { Authorization: accessToken } }
      );

      // Gửi payment data
      await axios.post(
        `https://esmpbe.id.vn/api/eventpayment`,
        {
          deposit: parseFloat(boothTypeDetails.price),
          locationId: boothTypeDetails.locationId,
          vendorinEventId: vendorInEventId,
        },
        { headers: { Authorization: accessToken } }
      );

      console.log("Payment finalized successfully.");
      // Navigate to the next page
      navigate("/eventenrolled", {
        state: { accessToken, eventId, vendorId },
      });
    } catch (error) {
      console.error("Error during finalizing payment:", error);
      toast({
        title: "Error",
        description: "An error occurred while processing your payment.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      flex="2"
      bg="white"
      borderRadius="md"
      border="1px solid"
      borderColor="gray.200"
      p={6}
      height="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Heading size="lg" mb={6} textAlign="center" color="teal.600">
        Booth Payment
      </Heading>
      <Text fontSize="md" textAlign="center" color="gray.600" mb={4}>
        Scan the QR code below to complete your payment within 15 minutes.
      </Text>
      <Image
        src={qrUrl}
        alt="QR Code"
        mx="auto"
        mb={4}
        boxShadow="md"
        width="300px"
        border="1px solid gray"
        borderRadius="md"
      />
      <VStack align="start" spacing={3} width="100%" mb={4}>
        <Text fontSize="lg" fontWeight="bold" color="teal.500">
          Amount: {parseInt(boothTypeDetails.price).toLocaleString()} VND
        </Text>
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          Content: {boothTypeDetails.typeName}
        </Text>
      </VStack>
      <Box mt={4} p={2} width="100%">
        <Text textAlign="center" mb={2} color="gray.500">
          Time remaining:
        </Text>
        <Text fontSize="xl" fontWeight="bold" textAlign="center">
          {`${Math.floor(remainingTime / 60)}:${String(
            remainingTime % 60
          ).padStart(2, "0")}`}
        </Text>
        <Progress
          value={(remainingTime / 900) * 100}
          size="sm"
          colorScheme="blue"
          mt={2}
          width="100%"
        />
      </Box>
      <Stack direction="row" spacing={4} mt={6}>
        <Button colorScheme="gray" onClick={onBackToPolicy} variant="outline">
          Back
        </Button>
      </Stack>
    </Box>
  );
};

export default BoothPayment;
