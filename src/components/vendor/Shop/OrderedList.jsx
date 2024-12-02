import React, { useState, useEffect } from "react";
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
  Spinner,
  Tooltip,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Icon,
  VStack,
  HStack,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaShippingFast } from "react-icons/fa";
import axios from "axios";

const OrderedList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { accessToken, vendorId, eventId } = location.state || {};

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState({});
  const [productItems, setProductItems] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [transactions, setTransactions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRevenue, setTotalRevenue] = useState(0); // Tổng doanh thu
  const itemsPerPage = 10; // Số đơn hàng trên mỗi trang

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `https://esmpbe.id.vn/api/order/event/${eventId}/${vendorId}`,
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProductItems = async () => {
      try {
        const response = await axios.get(
          `https://esmpbe.id.vn/api/productitem/${vendorId}`,
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setProductItems(response.data);
      } catch (error) {
        console.error("Error fetching product items:", error);
      }
    };

    fetchOrders();
    fetchProductItems();
  }, [accessToken, vendorId, eventId]);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      const transactionMap = {};
      try {
        for (const order of orders) {
          const response = await axios.get(
            `https://esmpbe.id.vn/api/transaction/order/${order.orderId}`,
            {
              headers: {
                Authorization: `${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data && response.data.length > 0) {
            const lastTransaction = response.data[response.data.length - 1];
            transactionMap[order.orderId] = lastTransaction;
          }
        }
        setTransactions(transactionMap);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast({
          title: "Error",
          description: "Unable to fetch transactions.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    if (orders.length > 0) {
      fetchTransactions();
    }
  }, [orders, accessToken]);

  // Tính tổng doanh thu
  useEffect(() => {
    const calculateTotalRevenue = async () => {
      let total = 0;
      try {
        for (const order of orders) {
          const response = await axios.get(
            `https://esmpbe.id.vn/api/order/orderDetail/${order.orderId}`,
            {
              headers: {
                Authorization: `${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          const details = response.data;
          const orderTotal = details.reduce(
            (sum, item) => sum + parseFloat(item.totalPrice || 0),
            0
          );
          total += orderTotal;
        }
        setTotalRevenue(total);
      } catch (error) {
        console.error("Error calculating total revenue:", error);
      }
    };

    if (orders.length > 0) {
      calculateTotalRevenue();
    }
  }, [orders, accessToken]);

  const handleBack = () => {
    navigate(`/shop/${vendorId}/${eventId}`, { state: { accessToken, vendorId, eventId, totalRevenue } });
  };

  const handleViewDetails = async (orderId) => {
    if (orderDetails[orderId]) {
      openDetail(orderId);
      return;
    }

    setLoadingDetails((prev) => ({ ...prev, [orderId]: true }));

    try {
      const response = await axios.get(
        `https://esmpbe.id.vn/api/order/orderDetail/${orderId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const enrichedDetails = response.data.map((detail) => {
        const productItem = productItems.find(
          (item) => item.productItemId === detail.productitemId
        );
        return { ...detail, productItemName: productItem?.name || "Unknown Product Item" };
      });

      setOrderDetails((prevDetails) => ({
        ...prevDetails,
        [orderId]: enrichedDetails,
      }));
      openDetail(orderId);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast({
        title: "Error",
        description: "Unable to fetch order details.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingDetails((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const openDetail = (orderId) => {
    setSelectedOrder(orderId);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setSelectedOrder(null);
    setIsDetailOpen(false);
  };

  const formatCurrency = (value) => {
    return parseInt(value).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  const calculateDetailTotal = (details) => {
    return details.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0);
  };

  return (
    <Box minH="100vh" p={5} bgGradient="linear(to-r, blue.100, pink.100)">
      <Button colorScheme="blue" mb={5} onClick={handleBack}>
        Back
      </Button>
      <Text fontSize="2xl" mb={5} fontWeight="bold" textAlign="center">
        Order History
      </Text>

      <Text fontSize="lg" mb={5} fontWeight="bold" textAlign="center">
        Total Revenue: {formatCurrency(totalRevenue)}
      </Text>

      {loading ? (
        <Spinner size="xl" />
      ) : orders.length > 0 ? (
        <>
          <Box bg="white" p={5} borderRadius="lg" boxShadow="lg" overflowX="auto">
            <Table variant="simple" size="md">
              <Thead bg="gray.100">
                <Tr>
                  <Th textAlign="center">Order ID</Th>
                  <Th textAlign="center">Customer Name</Th>
                  <Th textAlign="center">Created Date</Th>
                  <Th textAlign="center">Quantity</Th>
                  <Th textAlign="center">Status</Th>
                  <Th textAlign="center">Payment</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentOrders.map((order) => (
                  <Tr key={order.orderId}>
                    <Td textAlign="center">
                      <Tooltip label="Click to view details" hasArrow placement="top">
                        <Text
                          as="span"
                          color="blue.500"
                          cursor="pointer"
                          _hover={{ textDecoration: "underline" }}
                          onClick={() => handleViewDetails(order.orderId)}
                        >
                          {order.orderId.slice(0, 6)}
                        </Text>
                      </Tooltip>
                    </Td>
                    <Td textAlign="center">{order.name}</Td>
                    <Td textAlign="center">
                      {new Date(order.createAt).toLocaleDateString("vi-VN")}
                    </Td>
                    <Td textAlign="center">{order.totalAmount}</Td>
                    <Td textAlign="center">
                      <HStack justify="center">
                        <Icon
                          as={
                            order.status === "Prepared"
                              ? FaShippingFast
                              : order.status === "Success"
                              ? FaCheckCircle
                              : FaTimesCircle
                          }
                          color={
                            order.status === "Prepared"
                              ? "orange.500"
                              : order.status === "Success"
                              ? "green.500"
                              : "red.500"
                          }
                        />
                        <Text>
                          {order.status === "Prepared"
                            ? "Preparing"
                            : order.status === "Success"
                            ? "Successful"
                            : "Failed"}
                        </Text>
                      </HStack>
                    </Td>
                    <Td textAlign="center">
                      {transactions[order.orderId] ? (
                        <HStack justify="center">
                          <Icon
                            as={FaCheckCircle}
                            color="green.500"
                            boxSize={4}
                            mr={2}
                          />
                          <Text>
                            {transactions[order.orderId].transactionType ===
                            "Bank Transfer"
                              ? "QR Payment"
                              : "Cash Payment"}
                          </Text>
                        </HStack>
                      ) : (
                        <HStack justify="center">
                          <Icon
                            as={FaTimesCircle}
                            color="red.500"
                            boxSize={4}
                            mr={2}
                          />
                          <Text>Unpaid</Text>
                        </HStack>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          <HStack mt={5} justify="center">
            {Array.from({ length: Math.ceil(orders.length / itemsPerPage) }).map((_, index) => (
              <Button
                key={index}
                size="sm"
                variant={currentPage === index + 1 ? "solid" : "outline"}
                colorScheme="blue"
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
          </HStack>
        </>
      ) : (
        <Text>No orders available.</Text>
      )}

      {/* Order Details Modal */}
      <Modal isOpen={isDetailOpen} onClose={closeDetail} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Order Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedOrder && orderDetails[selectedOrder] ? (
              <>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  {orderDetails[selectedOrder].map((detail, index) => (
                    <GridItem
                      key={index}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      boxShadow="md"
                      bg="gray.50"
                    >
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">Product:</Text>
                        <Text>{detail.productItemName}</Text>
                        <Text>Quantity: {detail.quantity}</Text>
                        <Text>Unit Price: {formatCurrency(detail.unitPrice)}</Text>
                        <Text>Total Price: {formatCurrency(detail.totalPrice)}</Text>
                      </VStack>
                    </GridItem>
                  ))}
                </Grid>
                <Text fontWeight="bold" mt={4}>
                  Total Order Amount:{" "}
                  {formatCurrency(calculateDetailTotal(orderDetails[selectedOrder]))}
                </Text>
              </>
            ) : (
              <Text>Loading details...</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={closeDetail}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default OrderedList;
