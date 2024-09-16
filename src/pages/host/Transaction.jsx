import React, { useState } from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge,
  Button,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Transaction = () => {
  const navigate = useNavigate(); // Để điều hướng về trang event

  // Dữ liệu mẫu của giao dịch
  const transactions = [
    {
      id: 1,
      orderId: "#15267",
      date: "Mar 1, 2023",
      shop: "BBQ",
      quantity: 1,
      amount: 140000,
      status: "Success",
    },
    {
      id: 2,
      orderId: "#153587",
      date: "Jan 26, 2023",
      shop: "BBQ",
      quantity: 1,
      amount: 140000,
      status: "Success",
    },
    {
      id: 3,
      orderId: "#12436",
      date: "Feb 12, 2033",
      shop: "BBQ",
      quantity: 1,
      amount: 140000,
      status: "Success",
    },
    {
      id: 4,
      orderId: "#16879",
      date: "Feb 12, 2033",
      shop: "BBQ",
      quantity: 1,
      amount: 140000,
      status: "Success",
    },
    {
      id: 5,
      orderId: "#16378",
      date: "Feb 28, 2033",
      shop: "BBQ",
      quantity: 1,
      amount: 140000,
      status: "Rejected",
    },
    {
      id: 6,
      orderId: "#16609",
      date: "Mar 13, 2033",
      shop: "BBQ",
      quantity: 1,
      amount: 140000,
      status: "Success",
    },
    {
      id: 7,
      orderId: "#16907",
      date: "Mar 18, 2033",
      shop: "BBQ",
      quantity: 1,
      amount: 140000,
      status: "Pending",
    },
  ];

  // State để lưu trạng thái lọc giao dịch
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);

  // Hàm tính tổng doanh thu từ các giao dịch thành công
  const calculateTotalRevenue = () => {
    return transactions
      .filter((transaction) => transaction.status === "Success")
      .reduce((acc, transaction) => acc + transaction.amount, 0);
  };

  // Tính tổng doanh thu
  const totalRevenue = calculateTotalRevenue();

  // Tính tổng tiền bị từ chối
  const totalRejected = transactions
    .filter((transaction) => transaction.status === "Rejected")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  // Lọc giao dịch theo trạng thái (không phân biệt chữ hoa, chữ thường)
  const filterTransactions = (status) => {
    if (status === "All") {
      setFilteredTransactions(transactions); // Hiển thị tất cả các giao dịch
    } else {
      setFilteredTransactions(
        transactions.filter(
          (transaction) =>
            transaction.status.toLowerCase() === status.toLowerCase()
        )
      );
    }
  };

  // Đếm giao dịch dựa trên trạng thái
  const countTransactions = (status) => {
    if (status === "All") return transactions.length;
    return transactions.filter(
      (transaction) => transaction.status.toLowerCase() === status.toLowerCase()
    ).length;
  };

  return (
    <Box p={8} bg="white" borderRadius="md" boxShadow="md">
      <Flex justify="space-between" mb={6}>
        {/* Hiển thị Total Revenue */}
        <Stat bg="green.100" p={4} borderRadius="md">
          <StatLabel>Total Revenue</StatLabel>
          <StatNumber>{totalRevenue.toLocaleString()} ₫</StatNumber>
          <StatHelpText>as of {new Date().toLocaleDateString()}</StatHelpText>
        </Stat>

        {/* Hiển thị Rejected Payments */}
        <Stat bg="gray.100" p={4} borderRadius="md">
          <StatLabel>Rejected Payments</StatLabel>
          <StatNumber>{totalRejected.toLocaleString()} ₫</StatNumber>
          <StatHelpText>as of {new Date().toLocaleDateString()}</StatHelpText>
        </Stat>
      </Flex>

      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Payment History
      </Text>

      <Tabs
        variant="solid-rounded"
        colorScheme="blue"
        onChange={(index) => {
          const tabStatus = ["All", "Success", "Pending", "Rejected"];
          filterTransactions(tabStatus[index]);
        }}
      >
        <TabList>
          <Tab>
            All{" "}
            <Badge ml={2} colorScheme="blue">
              {countTransactions("All")}
            </Badge>
          </Tab>
          <Tab>
            Success{" "}
            <Badge ml={2} colorScheme="green">
              {countTransactions("Success")}
            </Badge>
          </Tab>
          <Tab>
            Pending{" "}
            <Badge ml={2} colorScheme="yellow">
              {countTransactions("Pending")}
            </Badge>
          </Tab>
          <Tab>
            Rejected{" "}
            <Badge ml={2} colorScheme="red">
              {countTransactions("Rejected")}
            </Badge>
          </Tab>
        </TabList>

        {/* Hiển thị giao dịch */}
        <TabPanels mt={4}>
          <TabPanel>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>No</Th>
                  <Th>Order ID</Th>
                  <Th>Date</Th>
                  <Th>Shop Name</Th>
                  <Th>Quantity</Th>
                  <Th>Total Amount</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredTransactions.map((transaction, index) => (
                  <Tr key={transaction.id}>
                    <Td>{index + 1}</Td>
                    <Td>{transaction.orderId}</Td>
                    <Td>{transaction.date}</Td>
                    <Td>{transaction.shop}</Td>
                    <Td>{transaction.quantity}</Td>
                    <Td>{transaction.amount.toLocaleString()} </Td>
                    <Td>
                      <Badge
                        colorScheme={
                          transaction.status === "Success"
                            ? "green"
                            : transaction.status === "Pending"
                            ? "yellow"
                            : "red"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TabPanel>
        </TabPanels>
      </Tabs>
      {/* Nút Back */}
      <Button
        mb={4}
        onClick={() => navigate("/events")}
        backgroundColor="#170F49"
        color="white"
        _hover={{ bg: "#1B2559" }}
      >
        Back to Events
      </Button>
    </Box>
  );
};

export default Transaction;
