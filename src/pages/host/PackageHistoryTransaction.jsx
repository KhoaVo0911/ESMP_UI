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
const API_PACKAGE = "https://esmpbe.id.vn/api/package";
const API_TRANSACTION_PACKAGE = "https://esmpbe.id.vn/api/transactionpackage";
const API_HOST = "https://esmpbe.id.vn/api/host";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const hostid = sessionStorage.getItem("hostId");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const accessToken = sessionStorage.getItem("accessToken");

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
        const packageIds = hostTransactions.map(
          (transaction) => transaction.packageid
        );
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

        const fetchedPackages = packageResponses.map(
          (response) => response.data
        );
        setPackages(fetchedPackages);
        setLoading(false);

        // Update host data with expiretime and eventstoragetime
        if (hostTransactions.length > 0 && fetchedPackages.length > 0) {
          await updateHostData(
            hostid,
            calculateExpirationDate(
              hostTransactions[0].createdat,
              fetchedPackages[0].expiretime
            ),
            calculateStorageDate(
              calculateExpirationDate(
                hostTransactions[0].createdat,
                fetchedPackages[0].expiretime
              ),
              fetchedPackages[0].eventstoragetime
            )
          );
        }
      } catch (error) {
        console.error("Error fetching transactions or packages:", error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [toast]);

  const calculateExpirationDate = (createdAt, months) => {
    const createdDate = new Date(createdAt);
    createdDate.setMonth(createdDate.getMonth() + months);
    return createdDate.toISOString();
  };

  const calculateStorageDate = (expirationDate, monthsToAdd) => {
    const expDate = new Date(expirationDate);
    expDate.setMonth(expDate.getMonth() + monthsToAdd);
    return expDate.toISOString();
  };

  const updateHostData = async (hostId, expireTime, eventStorageTime) => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");

      // Get current host data
      const { data: currentHostData } = await axios.get(`${API_HOST}/${hostId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Update host data with new expiretime and eventstoragetime
      const updatedData = {
        name: currentHostData.account.name,
        phone: currentHostData.account.phone,
        email: currentHostData.account.email,
        expiretime: expireTime,
        eventstoragetime: eventStorageTime,
        bankingaccount: currentHostData.bankingaccount,
        status: currentHostData.account.status,
      };

      await axios.put(`${API_HOST}/${hostId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // toast({
      //   title: "Host updated successfully",
      //   description: "Expire time and storage time have been updated.",
      //   status: "success",
      //   duration: 5000,
      //   isClosable: true,
      // });
    } catch (error) {
      console.error("Error updating host data:", error);
      toast({
        title: "Update failed",
        description: "Unable to update host data. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box
        p={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="90vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={4} bg="gray.50" minH="70vh">
      <VStack
        spacing={6}
        align="center"
        padding={4}
        bg="white"
        borderRadius="lg"
        boxShadow="md"
        height="60vh"
        w="full"
      >
        <Heading as="h1" size="xl" textAlign="center" color="black" mb={4}>
          Transaction History
        </Heading>

        {transactions.length > 0 ? (
          <Table
            variant="striped"
            width="100%"
            border="1px"
            borderColor="gray.200"
            borderRadius="lg"
            overflow="hidden"
          >
            <Thead bg="blue.50" color="white">
              <Tr>
                <Th>Service Package</Th>
                <Th>Description</Th>
                <Th>Purchase Date</Th>
                <Th>Expiration Date</Th>
                <Th>Storage Date</Th>
                <Th>Price</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactions.map((transaction) => {
                const packageDetails = packages.find(
                  (pkg) => pkg.id === transaction.packageid
                );

                return packageDetails ? (
                  <Tr key={transaction.id}>
                    <Td>{packageDetails.name}</Td>
                    <Td>{packageDetails.description}</Td>
                    <Td><Box
                        color="blue" // Green color for purchase date text
                        fontWeight="bold"
                      >
                      {new Date(transaction.createdat).toLocaleDateString()}
                      </Box>
                    </Td>
                    <Td>
                    <Box
                        color="red.600" // Red color for expiration date text
                        fontWeight="bold"
                      >
                      {new Date(
                        calculateExpirationDate(
                          transaction.createdat,
                          packageDetails.expiretime
                        )
                      ).toLocaleDateString()}
                    </Box></Td>
                    <Td>
                    <Box
                        color="blue.600" // Red color for expiration date text
                        fontWeight="bold"
                      >
                      {new Date(
                        calculateStorageDate(
                          calculateExpirationDate(
                            transaction.createdat,
                            packageDetails.expiretime
                          ),
                          packageDetails.eventstoragetime
                        )
                      ).toLocaleDateString()}
                    </Box> </Td>
                    <Td>{packageDetails.price} VND</Td>
                  </Tr>
                ) : (
                  <Tr key={transaction.id}>
                    <Td colSpan={6}>Package information not found</Td>
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
