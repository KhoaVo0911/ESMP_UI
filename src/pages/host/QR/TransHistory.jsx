import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

const TransactionHistory = () => {
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbxvupVHW1x2csY3bPgXTX0RRRTctBjltz67TyI-3Tumm993IRqEgMypskfgveo2rz4Bpw/exec"
        );
        const data = await response.json();

        // Process the transaction data to match the required format
        const processedTransactions = data.data.map((transaction, index) => ({
          id: index + 1, // Unique identifier for each transaction
          courseName: transaction["Mô tả"] || "Unknown Course",
          amount: parseFloat(transaction["Giá trị"]) || 0,
          date: transaction["Ngày diễn ra"] || "N/A",
        }));

        setTransactionHistory(processedTransactions);
      } catch (error) {
        setError(
          "Failed to fetch transaction history. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionHistory();
  }, []);

  return (
    <VStack spacing={6} align="center" padding={4} bg="#f5f5dc" minH="100vh">
      <Heading as="h2" size="lg" mb={4}>
        Transaction History
      </Heading>

      {isLoading ? (
        <Spinner size="xl" color="blue.500" />
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      ) : (
        <Box
          width={["90%", "80%", "60%"]}
          boxShadow="lg"
          bg="white"
          borderRadius="lg"
          overflow="hidden"
        >
          <Table variant="striped" colorScheme="teal" width="100%">
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Course Name</Th>
                <Th>Amount (VND)</Th>
                <Th>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactionHistory.map((transaction) => (
                <Tr key={transaction.id} _hover={{ bg: "gray.100" }}>
                  <Td>{transaction.id}</Td>
                  <Td>{transaction.courseName}</Td>
                  <Td>{transaction.amount.toLocaleString()}</Td>
                  <Td>{transaction.date}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </VStack>
  );
};

export default TransactionHistory;
