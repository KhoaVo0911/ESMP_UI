import React, { useState } from "react";
import {
  Table, Thead, Tbody, Tr, Th, Td, Stack, ButtonGroup, Button, Select, Box, Text,
} from "@chakra-ui/react";

const AdminTransactionHistory = () => {
  const [filterStatus, setFilterStatus] = useState("All");

  // Dữ liệu cứng
  const transactions = [
    { id: 1, orderId: "#15267", date: "2023-03-01", email: "abc123@gmail.com", username: "user123", plan: "Gold Plan", amount: 400000, status: "Success" },
    { id: 2, orderId: "#153587", date: "2023-01-26", email: "vdk123@gmail.com", username: "user456", plan: "Gold Plan", amount: 400000, status: "Success" },
    { id: 3, orderId: "#12436", date: "2033-02-12", email: "maiminhxa@gmail.com", username: "user789", plan: "Gold Plan", amount: 400000, status: "Success" },
    { id: 4, orderId: "#16879", date: "2033-02-12", email: "FEV_Sales@gmail.com", username: "fevsales", plan: "Gold Plan", amount: 400000, status: "Success" },
    { id: 5, orderId: "#16378", date: "2033-02-28", email: "FEV_SHOP@gmail.com", username: "fevshop", plan: "Premiere Plan", amount: 750000, status: "Rejected" },
    { id: 6, orderId: "#16609", date: "2033-03-13", email: "FEV_SHOP@gmail.com", username: "fevshop", plan: "Premiere Plan", amount: 750000, status: "Success" },
    { id: 7, orderId: "#16907", date: "2033-03-18", email: "FEV_SHOP@gmail.com", username: "fevshop", plan: "Premiere Plan", amount: 750000, status: "Pending" },
  ];

  const filterTransactions = (status) => {
    setFilterStatus(status);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filterStatus === "All") return true;
    return transaction.status === filterStatus;
  });

  return (
    <Stack spacing={4} p={4}>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Box>
          <Text>Total Revenue: <Text as="span" color="green.500">2.350.000 ₫</Text></Text>
          <Text>Rejected Payments: <Text as="span" color="red.500">750.000 ₫</Text></Text>
        </Box>
      </Box>

      {/* Filter Buttons */}
      <ButtonGroup spacing={2}>
        <Button colorScheme="teal" onClick={() => filterTransactions("All")}>All</Button>
        <Button colorScheme="green" onClick={() => filterTransactions("Success")}>Success</Button>
        <Button colorScheme="yellow" onClick={() => filterTransactions("Pending")}>Pending</Button>
        <Button colorScheme="red" onClick={() => filterTransactions("Rejected")}>Rejected</Button>
      </ButtonGroup>

      {/* Transaction Table */}
      <Table variant="simple" size="md" mt={4}>
        <Thead>
          <Tr>
            <Th>No</Th>
            <Th>Order ID</Th>
            <Th>Date</Th>
            <Th>Email</Th>
            <Th>Username</Th>
            <Th>Type Plan</Th>
            <Th>Total Amount</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredTransactions.map((transaction, index) => (
            <Tr key={transaction.id}>
              <Td>{index + 1}</Td>
              <Td>{transaction.orderId}</Td>
              <Td>{new Date(transaction.date).toLocaleDateString()}</Td>
              <Td>{transaction.email}</Td>
              <Td>{transaction.username}</Td> {/* Username field */}
              <Td>{transaction.plan}</Td>
              <Td>{transaction.amount.toLocaleString()} ₫</Td>
              <Td color={transaction.status === "Success" ? "green.500" : transaction.status === "Rejected" ? "red.500" : "yellow.500"}>
                {transaction.status}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Pagination (Optional) */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
        <Select size="sm" width="auto">
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
        </Select>
        <Box>
          <Text as="span">1 of 1 pages</Text>
          <Button size="sm" ml={4}>&lt;</Button>
          <Button size="sm" ml={2}>&gt;</Button>
        </Box>
      </Box>
    </Stack>
  );
};

export default AdminTransactionHistory;
