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
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
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
        if (Array.isArray(response.data) && response.data.length > 0) {
          setOrders(response.data);
        } else {
          setOrders([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đơn hàng:", error);
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

  const handleBack = () => {
    navigate("/shop", {
      state: { accessToken, vendorId, eventId },
    });
  };

  const handleViewDetails = async (orderId) => {
    console.log("Đang xem chi tiết cho ID đơn hàng:", orderId);

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
        console.log("Chi tiết Product Item tìm thấy:", productItem);

        return {
          ...detail,
          productItemName: productItem ? productItem.name : "Unknown Product Item",
        };
      });

      console.log("Chi tiết đơn hàng sau khi làm giàu dữ liệu:", enrichedDetails);

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
        Back
      </Button>
      <Text fontSize="2xl" mb={5} fontWeight="bold">
        List Ordered
      </Text>

      {loading ? (
        <Spinner size="xl" />
      ) : orders.length > 0 ? (
        <Box bg="white" p={5} borderRadius="lg" boxShadow="lg" overflowX="auto">
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th textAlign="center">No</Th>
                <Th textAlign="center">Name</Th>
                <Th textAlign="center">Date</Th>
                <Th textAlign="center">Total Amount</Th>
                <Th textAlign="center">Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.map((order, index) => (
                <Tr key={order.orderId}>
                  <Td textAlign="center">
                    <Tooltip
                      label="Click to view details"
                      hasArrow
                      placement="top"
                      onMouseEnter={() => handleViewDetails(order.orderId)}
                    >
                      <Text
                        as="span"
                        color="blue.500"
                        cursor="pointer"
                        _hover={{ textDecoration: "underline" }}
                        onClick={() => handleViewDetails(order.orderId)}
                      >
                        {order.orderId.slice(0, 4)}
                      </Text>
                    </Tooltip>
                  </Td>
                  <Td textAlign="center">{order.name}</Td>
                  <Td textAlign="center">
                    {new Date(order.createAt).toLocaleString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}
                  </Td>
                  <Td textAlign="center">{order.totalAmount}</Td>
                  <Td textAlign="center">
                    <Text
                      color={
                        order.status === "Prepared"
                          ? "orange"
                          : order.status === "Success"
                          ? "green"
                          : "red"
                      }
                    >
                      {order.status}
                    </Text>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Text>No orders found.</Text>
      )}

      <Modal isOpen={isDetailOpen} onClose={closeDetail}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Chi tiết đơn hàng:{" "}
            {selectedOrder && orders.find((order) => order.orderId === selectedOrder)?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedOrder && orderDetails[selectedOrder] ? (
              orderDetails[selectedOrder].map((detail, index) => (
                <Box key={index} mb={3}>
                  <Text>
                    <strong>Product Item Name:</strong> {detail.productItemName}
                  </Text>
                  <Text>
                    <strong>Quantity:</strong> {detail.quantity}
                  </Text>
                  <Text>
                    <strong>Unit Price:</strong> {formatCurrency(detail.unitPrice)}
                  </Text>
                  <Text>
                    <strong>Total Price:</strong> {formatCurrency(detail.totalPrice)}
                  </Text>
                </Box>
              ))
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
