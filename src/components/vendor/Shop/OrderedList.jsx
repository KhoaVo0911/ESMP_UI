import React from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Button,
  Select,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const orders = [
  {
    id: 1,
    name: "Minh",
    date: "Mar 1, 2023",
    email: "abc123@gmail.com",
    phone: "123",
    total: "400,000 ₫",
    status: "Success",
  },
  {
    id: 2,
    name: "Khoa",
    date: "Jan 26, 2023",
    email: "vdk123@gmail.com",
    phone: "456",
    total: "400,000 ₫",
    status: "Success",
  },
  {
    id: 3,
    name: "Truong",
    date: "Feb 12, 2023",
    email: "maiminhxa@gmail.com",
    phone: "789",
    total: "400,000 ₫",
    status: "Success",
  },
  {
    id: 4,
    name: "Tung",
    date: "Feb 12, 2033",
    email: "fev_sales@gmail.com",
    phone: "91011",
    total: "400,000 ₫",
    status: "Success",
  },
  {
    id: 5,
    name: "Nhat",
    date: "Feb 28, 2033",
    email: "fev_shop@gmail.com",
    phone: "111213",
    total: "750,000 ₫",
    status: "Rejected",
  },
  {
    id: 6,
    name: "Cuong",
    date: "March 13, 2033",
    email: "fev_shop@gmail.com",
    phone: "1415146",
    total: "750,000 ₫",
    status: "Success",
  },
  {
    id: 7,
    name: "Vinh",
    date: "March 18, 2033",
    email: "fev_shop@gmail.com",
    phone: "171819",
    total: "750,000 ₫",
    status: "Pending",
  },
];

const OrderedList = () => {
  return (
    <Box
      minH="100vh"
      p={5}
      bgGradient="linear(to-r, blue.100, pink.100)" // Page background gradient
    >
      <Link to="/Shop">
        <Button colorScheme="blue" mb={5}>
          Back
        </Button>
      </Link>
      <Text fontSize="2xl" mb={5} fontWeight="bold">
        List Ordered
      </Text>

      <Box
        bg="white" // Table background color
        p={5}
        borderRadius="lg"
        boxShadow="lg" // Add shadow to the table box
        overflowX="auto"
      >
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>Name</Th>
              <Th>Date</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Total Amount</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order, index) => (
              <Tr key={order.id}>
                <Td>{index + 1}</Td>
                <Td>{order.name}</Td>
                <Td>{order.date}</Td>
                <Td>{order.email}</Td>
                <Td>{order.phone}</Td>
                <Td>{order.total}</Td>
                <Td
                  color={
                    order.status === "Success"
                      ? "green"
                      : order.status === "Rejected"
                      ? "red"
                      : "orange"
                  }
                >
                  {order.status}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {/* Pagination Controls */}
        <HStack mt={4} justify="space-between">
          <Select width="100px" defaultValue="10">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </Select>
          <Text>1 of 1 pages</Text>
          <HStack spacing={4}>
            <Button disabled>&lt;</Button>
            <Button>&gt;</Button>
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
};

export default OrderedList;
