import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Text, Progress, VStack, Heading, Spinner } from '@chakra-ui/react';

// API Endpoints
const API_PACKAGE = "https://esmpbe.id.vn/api/package";
const API_TRANSACTION_PACKAGE = "https://esmpbe.id.vn/api/transactionpackage";

const HostPackageInfo = () => {
  const [transaction, setTransaction] = useState(null);
  const [packageInfo, setPackageInfo] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [expirationTime, setExpirationTime] = useState(null);
  const [isPaymentExpired, setIsPaymentExpired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Transaction and Package Information
  useEffect(() => {
    const hostid = sessionStorage.getItem('hostid');
    if (!hostid) {
      setError("Host ID is required");
      setLoading(false);
      return;
    }

    const fetchTransaction = async () => {
      try {
        const response = await axios.get(API_TRANSACTION_PACKAGE);
        console.log("Transactions:", response.data);  // Kiểm tra tất cả các giao dịch

        // Lọc giao dịch có hostid trùng với hostid từ sessionStorage và status là "pending"
        const filteredTransaction = response.data.find(
          (transaction) => transaction.hostid === hostid && transaction.status === "pending"
        );

        if (!filteredTransaction) {
          setError("No pending transaction found for this host.");
          setLoading(false);
          return;
        }

        setTransaction(filteredTransaction);
        fetchPackageInfo(filteredTransaction.packageid);
      } catch (err) {
        console.error("Error fetching transaction:", err);
        setError("Error fetching transaction");
        setLoading(false);
      }
    };

    const fetchPackageInfo = async (packageId) => {
        console.log("Fetching package info..."); // Check if the function is being called
        try {
          const response = await axios.get(API_PACKAGE);
          console.log("Package Data:", response.data);
      
          const packageData = response.data.find((pkg) => pkg.id === packageId);
      
          if (!packageData) {
            setError("Package not found.");
            setLoading(false);
            return;
          }
      
          setPackageInfo(packageData);
          console.log("hgahfdfdfda", packageInfo.name);
        } catch (err) {
          console.error("Error fetching package:", err);
          setError("Error fetching package");
          setLoading(false);
        }
      };
      

    fetchTransaction();
  }, []);

  // Calculate remaining time
  useEffect(() => {
    if (transaction && packageInfo) {
      const createdAt = new Date(transaction.createdat);
      const calculatedExpirationTime = new Date(createdAt);
      calculatedExpirationTime.setMonth(calculatedExpirationTime.getMonth() + packageInfo.expiretime);

      setExpirationTime(calculatedExpirationTime);

      const now = new Date();
      const remaining = calculatedExpirationTime - now;

      if (remaining <= 0) {
        setIsPaymentExpired(true);
        setRemainingTime(0);
      } else {
        setRemainingTime(remaining);
        const countdownInterval = setInterval(() => {
          setRemainingTime((prevTime) => {
            const newTime = prevTime - 1000;
            if (newTime <= 0) {
              clearInterval(countdownInterval);
              setIsPaymentExpired(true);
              return 0;
            }
            return newTime;
          });
        }, 1000);
        console.log("hgahfdfdfda", packageInfo.eventstoragetime);
        return () => clearInterval(countdownInterval);
      }
    }
  }, [transaction, packageInfo]);

  // Format remaining time in days, hours, minutes
  const formatTime = (timeInMs) => {
    const days = Math.floor(timeInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeInMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  };

  // Handle loading and error states
  if (loading) {
    return (
      <VStack spacing={4} align="center" p={6}>
        <Spinner size="xl" color="blue.500" />
        <Text>Loading...</Text>
      </VStack>
    );
  }

//   if (error) {
//     return (
//       <VStack spacing={4} align="center" p={6}>
//         <Text color="red.500">{error}</Text>
//       </VStack>
//     );
//   }

//   if (!transaction || !packageInfo) {
//     return (
//       <VStack spacing={4} align="center" p={6}>
//         <Text>No transaction or package data found.</Text>
//       </VStack>
//     );
//   }

return (
    <VStack spacing={8} align="center" p={6} bg="white" minH="90vh">
      <Box w="100%" textAlign="center">
        <Heading as="h1" size="xl">Host Package Information</Heading>
        <Text fontSize="lg" color="gray.500" mt={4}>Package Details and Countdown</Text>
      </Box>
  
      {/* Only render this section if packageInfo is loaded */}
      {packageInfo && (
        <Box textAlign="center" p={4} borderRadius="lg" boxShadow="xl" w="full">
          <Heading size="lg">{packageInfo.name}</Heading>
          <Text fontSize="md" color="gray.600" mt={2}>{packageInfo.description}</Text>
          <Text fontSize="lg" fontWeight="bold" color="orange.500" mt={4}>
            {parseInt(packageInfo.price).toLocaleString()} VND
          </Text>
  
          {/* Countdown Timer */}
          <Box mt={6}>
            {isPaymentExpired ? (
              <Text fontSize="lg" color="red.500">Your package has expired.</Text>
            ) : (
              <>
                <Text fontSize="lg">Remaining Time:</Text>
                <Text fontSize="2xl" fontWeight="bold" color="yellow.400">
                  {formatTime(remainingTime)}
                </Text>
                {/* <Progress 
                  value={(remainingTime / (expirationTime - new Date())) * 100} 
                  size="sm" 
                  colorScheme="yellow" 
                  mt={4} 
                /> */}
              </>
            )}
          </Box>
        </Box>
      )}
  
     
    </VStack>
  );
  
};

export default HostPackageInfo;
