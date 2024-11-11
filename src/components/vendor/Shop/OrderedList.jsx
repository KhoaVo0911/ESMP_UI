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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/order/event/${eventId}/${vendorId}`,
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProductItems = async () => {
      try {
        const response = await axios.get(
          `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/productitem/${vendorId}`,
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setProductItems(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách product items:", error);
      }
    };

    fetchOrders();
    fetchProductItems();
  }, [accessToken, vendorId, eventId]);

  // Fetch transactions for all orders
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactionData = {};
        await Promise.all(
          orders.map(async (order) => {
            const response = await axios.get(
              `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/transaction/order/${order.orderId}`,
              {
                headers: {
                  Authorization: `${accessToken}`,
                },
              }
            );
            transactionData[order.orderId] = response.data[0]; // Lấy giao dịch đầu tiên cho mỗi order
          })
        );
        setTransactions(transactionData);
      } catch (error) {
        console.error("Lỗi khi tải danh sách giao dịch:", error);
      }
    };

    if (orders.length > 0) {
      fetchTransactions();
    }
  }, [orders, accessToken]);

  const handleBack = () => {
    navigate("/shop", { state: { accessToken, vendorId, eventId } });
  };

  const handleViewDetails = async (orderId) => {
    if (orderDetails[orderId]) {
      openDetail(orderId);
      return;
    }

    setLoadingDetails((prev) => ({ ...prev, [orderId]: true }));

    try {
      const response = await axios.get(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/order/orderDetail/${orderId}`,
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
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy thông tin chi tiết đơn hàng.",
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

  return (
    <Box minH="100vh" p={5} bgGradient="linear(to-r, blue.100, pink.100)">
      <Button colorScheme="blue" mb={5} onClick={handleBack}>
        Quay lại
      </Button>
      <Text fontSize="2xl" mb={5} fontWeight="bold" textAlign="center">
        Lịch Sử Giao Dịch
      </Text>

      {loading ? (
        <Spinner size="xl" />
      ) : orders.length > 0 ? (
        <Box bg="white" p={5} borderRadius="lg" boxShadow="lg" overflowX="auto">
          <Table variant="simple" size="md">
            <Thead bg="gray.100">
              <Tr>
                <Th textAlign="center">Mã ĐH</Th>
                <Th textAlign="center">Tên khách hàng</Th>
                <Th textAlign="center">Ngày tạo</Th>
                <Th textAlign="center">Số lượng</Th>
                <Th textAlign="center">Trạng thái</Th>
                <Th textAlign="center">Thanh toán</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.map((order) => (
                <Tr key={order.orderId}>
                  <Td textAlign="center">
                    <Tooltip label="Click để xem chi tiết" hasArrow placement="top">
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
                    {new Date(order.createAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
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
                          ? "Đang chuẩn bị"
                          : order.status === "Success"
                          ? "Thành công"
                          : "Thất bại"}
                      </Text>
                    </HStack>
                  </Td>
                  <Td textAlign="center">
                    {transactions[order.orderId]
                      ? transactions[order.orderId].transactionType
                      : "Chưa thanh toán"}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Text>Không có đơn hàng nào.</Text>
      )}

      {/* Modal chi tiết đơn hàng */}
      <Modal isOpen={isDetailOpen} onClose={closeDetail} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chi tiết đơn hàng</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedOrder && orderDetails[selectedOrder] ? (
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
                      <Text fontWeight="bold">Sản phẩm:</Text>
                      <Text>{detail.productItemName}</Text>
                      <Text>Số lượng: {detail.quantity}</Text>
                      <Text>Đơn giá: {formatCurrency(detail.unitPrice)}</Text>
                      <Text>Tổng giá: {formatCurrency(detail.totalPrice)}</Text>
                    </VStack>
                  </GridItem>
                ))}
              </Grid>
            ) : (
              <Text>Đang tải chi tiết...</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={closeDetail}>
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default OrderedList;
