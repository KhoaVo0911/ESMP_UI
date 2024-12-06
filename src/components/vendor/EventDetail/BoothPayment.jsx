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
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BoothPayment = ({
  boothTypeDetails,
  onBackToPolicy,
  eventId,
  deposit,
}) => {
  const [remainingTime, setRemainingTime] = useState(900); // Countdown timer: 15 minutes
  const [qrUrl, setQrUrl] = useState(""); // QR Code URL
  const countdownIntervalRef = useRef(null); // Countdown interval reference
  const transactionCheckIntervalRef = useRef(null); // Transaction check interval reference
  const isPaymentProcessed = useRef(false); // Tránh xử lý thanh toán nhiều lần
  const toast = useToast();
  const navigate = useNavigate(); // Initialize navigate
  const amount = Number(boothTypeDetails.price) + Number(deposit);
  
  
  useEffect(() => {
    const fetchHostData = async () => {
      try {
        const hostId = sessionStorage.getItem("hostId");
        if (!hostId) {
          console.error("Host ID is missing!");
          return;
        }
    
        // Fetch host data from API based on hostId
        const hostResponse = await axios.get(`/host/${hostId}`);
        const hostData = hostResponse.data;
    
        if (hostData) {
          const { apibanking, bankingaccount } = hostData;
    
          if (apibanking && bankingaccount) {
            // 1. Create QR code with banking account
            console.log(deposit);
            
console.log("tiền", amount);
            const qrUrl = `https://img.vietqr.io/image/${bankingaccount}-compact2.png?amount=${amount}&addInfo=${boothTypeDetails.typeName}`;
            setQrUrl(qrUrl);
    
            // 2. Post apibanking to API to get id
            const apiBankingResponse = await axios.post("/host/apibanking", { apibanking });
            const apiBankingId = apiBankingResponse.data.id;
            console.log("API Bank ID", apiBankingId);
    
            if (apiBankingId) {
              // 3. Update URL in fetch with id from apibanking
              const fetchUrl = `${apiBankingId}`; // Update with actual endpoint
              console.log("API Bank ID 2 lun nè", fetchUrl);
              
              // Save the fetchUrl to sessionStorage
              sessionStorage.setItem("fetchUrl", fetchUrl);  // Ensure it's stored properly
    
              const startTime = new Date(); // capture start time
              checkPaid(boothTypeDetails.price, boothTypeDetails.typeName, startTime);  // Proceed with payment check
            } else {
              console.error("Couldn't get apibanking ID.");
            }
          } else {
            console.error("Missing banking information in host data.");
          }
        } else {
          console.error("Host data not found.");
        }
      } catch (error) {
        console.error("Error fetching host data:", error);
      }
    };
    

    fetchHostData();
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
    const startTime = new Date(); // Capture start time once at the beginning
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

  const checkPaid = async (price, content , startTime) => {
    if (isPaymentProcessed.current) {
      console.log("Payment already processed. Skipping check.");
      return; // If payment already processed, don't check again
    }
  
    try {
      // Get fetchUrl from sessionStorage after it was set
      const fetchUrlhehe = sessionStorage.getItem("fetchUrl");
  
      if (!fetchUrlhehe) {
        console.error("fetchUrl is not available in sessionStorage.");
        return; // If no fetch URL, exit the function
      }
  
      console.log("Using fetchUrl:", fetchUrlhehe);
      const response = await fetch(fetchUrlhehe);
  
      // Check if the response is OK (2xx)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Check if the response is JSON
      const contentType = response.headers.get("Content-Type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }
  
      // Parse JSON response
      const data = await response.json();
  
      if (data && data.data && data.data.length > 0) {
        const lastPaid = data.data[data.data.length - 1];
  
        const lastPrice = lastPaid && lastPaid["Giá trị"] ? parseFloat(lastPaid["Giá trị"]) : 0;
        const lastContent = lastPaid && lastPaid["Mô tả"] ? lastPaid["Mô tả"].trim().toLowerCase() : "";
        const transactionTime = new Date(lastPaid["Ngày diễn ra"]).getTime();
        const startTimestamp = new Date(startTime).getTime();
  
        if (
          lastPrice >= price &&
          lastContent.includes(content.toLowerCase()) &&
          transactionTime > startTimestamp
        ) {
          console.log("Payment success detected!");
  
          isPaymentProcessed.current = true;
          clearInterval(transactionCheckIntervalRef.current);
          clearInterval(countdownIntervalRef.current);
  
          toast({
            title: "Payment successful",
            description: "You have successfully paid for the booth.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
  
          await finalizePayment(); // Finalize the payment process
        }
      } else {
        throw new Error("Invalid response data structure");
      }
    } catch (error) {
      console.error("Error during payment check:", error);
      toast({
        title: "Error",
        description: "An error occurred while checking the payment.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  

  const finalizePayment = async () => {
    try {
      console.log("Finalizing payment...");
      const vendorId = sessionStorage.getItem("vendorId");
      const accessToken = sessionStorage.getItem("accessToken");
      if (!eventId || !vendorId) {
        throw new Error("Missing eventId or vendorId");
      }
  
      // Check if vendorInEvent already exists
      const vendorInEventResponse = await axios.get(
        `https://esmpbe.id.vn/api/vendorinevent/${vendorId}/${eventId}`,
        { headers: { Authorization: accessToken } }
      );
  
      let vendorInEventId;
  
      if (vendorInEventResponse.data && vendorInEventResponse.data.vendorinEventId) {
        // If vendorInEvent exists, update the status to "accept"
        vendorInEventId = vendorInEventResponse.data.vendorinEventId;
  
        await axios.put(
          `https://esmpbe.id.vn/api/vendorinevent/${vendorInEventId}`,
          {
            status: "accept", // Update status to "accept"
          },
          { headers: { Authorization: accessToken } }
        );
        console.log("VendorInEvent status updated to 'accept'.");
      } else {
        // If vendorInEvent does not exist, create a new VendorInEvent
        await axios.post(
          `https://esmpbe.id.vn/api/vendorinevent/${vendorId}/${eventId}`,
          {},
          { headers: { Authorization: accessToken } }
        );
  
        // Now retrieve the vendorInEventId after creating the VendorInEvent
        const vendorInEventAfterCreationResponse = await axios.get(
          `https://esmpbe.id.vn/api/vendorinevent/${vendorId}/${eventId}`,
          { headers: { Authorization: accessToken } }
        );
        vendorInEventId = vendorInEventAfterCreationResponse.data.vendorinEventId;
        console.log("New VendorInEvent created and retrieved.", vendorInEventId);
      }
  
      // Update booth status to "Booked"
      await axios.put(
        `https://esmpbe.id.vn/api/map`,
        {
          locationId: boothTypeDetails.locationId,
          status: "Booked",
        },
        { headers: { Authorization: accessToken } }
      );
  
      // Send payment data
      await axios.post(
        `https://esmpbe.id.vn/api/eventpayment`,
        {
          total: parseFloat(amount),
          locationId: boothTypeDetails.locationId,
          vendorinEventId: vendorInEventId,
        },
        { headers: { Authorization: accessToken } }
      );
  
      console.log("Payment finalized successfully.", vendorInEventId);
  
      // Navigate to the next page
      navigate(`/eventenrolled/${vendorId}/${eventId}`, {
        state: { accessToken, eventId, vendorId, vendorInEventId },
      });
    } catch (error) {
      console.error("Error during finalizing payment:", error);
      toast({
        title: "Error",
        description: "There was an error finalizing your payment.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  

  return (
    <VStack align="center" spacing={6} w="full" pb={10}>
    
      <Text>
        Please scan the QR code below to complete your payment.
      </Text>
      <Text>Booth Price: {boothTypeDetails.price}VNĐ</Text>
      <Text>Deposit: {deposit}VNĐ</Text>
      <Text>Total: {amount}VNĐ</Text>
      <Box mt={4}>
  {qrUrl ? (
    <Image src={qrUrl} alt="QR Code" style={{  height: '400px' }} />
  ) : (
    <Text>Loading QR code...</Text>
  )}
</Box>

<Stack align="center" spacing={3} width="50%">
  <Text>Your payment is processing</Text>
  <Progress value={remainingTime} max={900} colorScheme="teal" size="lg" width="100%" />
  <Text>
    Time remaining: {Math.floor(remainingTime / 60)}:{remainingTime % 60}
  </Text>
</Stack>


      <Button onClick={onBackToPolicy} colorScheme="teal">
        Back to Policy
      </Button>
    </VStack>
  );
};

export default BoothPayment;
