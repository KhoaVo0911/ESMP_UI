import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Spinner,
} from "@chakra-ui/react";

// Define API URLs
const API_PACKAGE = "https://esmpbe.id.vn/api/package"; // URL to fetch package data
const API_TRANSACTION_PACKAGE = "https://esmpbe.id.vn/api/transactionpackage"; // URL to fetch transaction package data

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const accessToken = sessionStorage.getItem("accessToken");
        const hostid = sessionStorage.getItem("hostid");

        if (!accessToken || !hostid) {
          throw new Error("Access token or host ID not found");
        }

        // Fetch transaction data
        const response = await axios.get(API_TRANSACTION_PACKAGE, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Filter transactions for the current host
        const hostTransactions = response.data.filter(
          (transaction) => transaction.hostid === hostid
        );
        setTransactions(hostTransactions);

        // Fetch package details for the corresponding transactions
        const packageIds = hostTransactions.map((transaction) => transaction.packageid);
        const uniquePackageIds = [...new Set(packageIds)];

        const packageResponses = await Promise.all(
          uniquePackageIds.map((packageId) =>
            axios.get(`${API_PACKAGE}/${packageId}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            })
          )
        );

        const fetchedPackages = packageResponses.map((response) => response.data);
        setPackages(fetchedPackages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transactions or packages:", error);
        toast({
          title: "Error",
          description: "Unable to load transaction history. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [toast]);

  // Function to calculate expiration date
  const calculateExpirationDate = (createdAt, months) => {
    const createdDate = new Date(createdAt);
    createdDate.setMonth(createdDate.getMonth() + months); // Add months to the created date
    return createdDate.toLocaleDateString(); // Format the date
  };

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center" alignItems="center" minH="90vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={4} bg="gray.50" minH="70vh">
      <VStack spacing={6} align="center" padding={4} bg="white" borderRadius="lg" boxShadow="md" height="60vh" w="full">
        <Heading as="h1" size="xl" textAlign="center" color="teal.600" mb={4}>
          Transaction History
        </Heading>

        {transactions.length > 0 ? (
          <Table variant="striped" width="100%" border="1px" borderColor="gray.200" borderRadius="lg" overflow="hidden">
            <Thead bg="blue.50" color="white">
              <Tr>
                <Th>Service Package</Th>
                <Th>Description</Th>
                <Th>Purchase Date</Th>
                <Th>Expiration Date</Th>
                <Th>Storage Date</Th>
                <Th>Price</Th> {/* Changed status to price */}
              </Tr>
            </Thead>
            <Tbody>
              {transactions.map((transaction) => {
                // Find corresponding package for each transaction
                const packageDetails = packages.find(
                  (pkg) => pkg.id === transaction.packageid
                );

                return packageDetails ? (
                  <Tr key={transaction.id}>
                    <Td border="1px" borderColor="gray.200">{packageDetails.name}</Td>
                    <Td border="1px" borderColor="gray.200">{packageDetails.description}</Td>
                    <Td border="1px" borderColor="gray.200">
                      <Box
                        color="green.600"  // Green color for purchase date text
                        fontWeight="bold"
                      >
                        {new Date(transaction.createdat).toLocaleDateString()}
                      </Box>
                    </Td>
                    <Td border="1px" borderColor="gray.200">
                      <Box
                        color="red.600"  // Red color for expiration date text
                        fontWeight="bold"
                      >
                        {calculateExpirationDate(transaction.createdat, packageDetails.expiretime)}
                      </Box>
                    </Td>
                    <Td border="1px" borderColor="gray.200">
                      <Box
                        color="blue.600"  // Red color for expiration date text
                        fontWeight="bold"
                      >
                       
                       {packageDetails.eventstoragetime} {packageDetails.eventstoragetime > 1 ? "Months" : "Month"}
                      </Box>
                    </Td>
                    <Td border="1px" borderColor="gray.200">
                      <Text fontWeight="bold" color="yellow.600">
                        {packageDetails.price} VND
                      </Text>
                    </Td>
                  </Tr>
                ) : (
                  <Tr key={transaction.id}>
                    <Td colSpan={5} border="1px" borderColor="gray.200">
                      Package information not found
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        ) : (
          <Text fontSize="lg" color="gray.500">
            No transactions found for this host.
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default TransactionHistory;
