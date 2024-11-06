import React, { useState } from "react";
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
  Input,
  HStack,
  VStack,
  Image,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowBackIcon, DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";

const Payment = ({ removeItem }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [qrUrl, setQrUrl] = useState("");
  const [userName, setUserName] = useState(""); // State to hold the user name
  const toast = useToast();

  // Retrieve cart data from session storage
  const cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
  const totalPrice = sessionStorage.getItem("totalPrice") || 0;

  // Retrieve accessToken, vendorId, eventId from location.state or sessionStorage
  const location = useLocation();
  const accessToken = location.state?.accessToken || sessionStorage.getItem("accessToken");
  const vendorId = location.state?.vendorId || sessionStorage.getItem("vendorId");
  const eventId = location.state?.eventId || sessionStorage.getItem("eventId");

  // Function to calculate total quantity
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Function to handle cash out and show QR modal
  const handleCashOut = () => {
    const paidPrice = totalPrice;
    const paidContent = "Thanh toán giỏ hàng";
    const qrCodeUrl = `https://img.vietqr.io/image/ACB-18254271-compact2.png?amount=${paidPrice}&addInfo=${paidContent}&accountName=${userName}`; // Use the userName here

    setQrUrl(qrCodeUrl);
    onOpen(); // Open the QR modal
  };

  // Function to handle confirm button and send data to API
  const handleConfirmPayment = async () => {
    try {
      // Create order data
      const orderData = {
        eventId: eventId,
        vendorId: vendorId,
        name: userName, // Include the user name in the order data
        totalAmount: totalQuantity,
        totalPrice: Number(totalPrice),
        details: cartItems.map((item) => ({
          productitemId: item.productItemId,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        transactionType: "Online",
      };

      // Send POST request to /api/order
      const response = await axios.post(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/order`,
        orderData,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Order created successfully:", response.data);

      toast({
        title: "Thanh toán thành công",
        description: "Bạn đã thanh toán thành công cho giỏ hàng.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Navigate back to the /shop page with state
      setTimeout(() => {
        navigate("/shop", {
          state: { accessToken, vendorId, eventId },
        });
      }, 3000);
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Lỗi khi tạo đơn hàng",
        description: "Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5} bgGradient="linear(to-r, blue.100, pink.100)" minH="100vh">
      {/* Back button with icon */}
      <HStack alignItems="center" mb={5} cursor="pointer" onClick={() => navigate(-1)}>
        <IconButton icon={<ArrowBackIcon />} size="lg" variant="ghost" aria-label="Go Back" />
        <Text fontSize="md" fontWeight="bold">Shopping Continue</Text>
      </HStack>

      <Text fontSize="xl" mb={5} fontWeight="bold">
        There are{" "}
        <Text as="span" color="red">{totalQuantity}</Text>{" "}
        products in your cart
      </Text>

      <HStack align="start" spacing={10}>
        {/* Cart Section */}
        <VStack p={5} borderWidth="1px" borderRadius="md" boxShadow="lg" bg="white" width="60%" spacing={5}>
          {cartItems.map((item, index) => (
            <HStack key={index} justify="space-between" p={4} borderWidth="1px" borderRadius="md" boxShadow="sm" bg="white" width="100%">
              <HStack>
                <Image src={item.image} alt={item.name} boxSize="50px" />
                <VStack align="start" spacing={0}>
                  <Text>{item.name}</Text>
                  <Text fontSize="sm" color="gray.500">Số lượng: {item.quantity}</Text>
                </VStack>
              </HStack>
              <Text>{item.price.toLocaleString()} VND</Text>
              <IconButton
                icon={<DeleteIcon />}
                colorScheme="red"
                onClick={() => removeItem(index)}
                aria-label="Remove Item"
              />
            </HStack>
          ))}
        </VStack>

        {/* Payment Form Section */}
        <Box p={5} borderWidth="1px" borderRadius="md" boxShadow="lg" bg="white" width="40%">
          <Text fontSize="2xl" mb={5} fontWeight="bold">Payment</Text>
          <VStack spacing={4} align="stretch">
            <Input 
              placeholder="Name" 
              focusBorderColor="blue.500" 
              borderColor="gray.300" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)} // Cập nhật tên người dùng
            />
          
          </VStack>

          {/* Items count and total price */}
          <HStack justify="space-between" mt={8}>
            <Text color="red.500" fontWeight="bold">{totalQuantity} Items</Text>
            <Text fontWeight="bold">{Number(totalPrice).toLocaleString()} VND</Text>
          </HStack>

          {/* Cash Out Button */}
          <Button colorScheme="blue" width="100%" mt={4} onClick={handleCashOut}>
            CASH OUT
          </Button>
        </Box>
      </HStack>

      {/* Modal for QR Code */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Mã QR thanh toán</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center">
            <Image src={qrUrl} alt="QR Code" mx="auto" mb={4} boxShadow="md" width="80%" />
            <Text fontSize="lg" mb={2} color="yellow.400">Mã QR thanh toán tự động</Text>
            <Text fontSize="sm" color="gray.500">(Xác nhận tự động - Thường không quá 3')</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={handleConfirmPayment} mr={3}>
              Xác nhận
            </Button>
            <Button colorScheme="blue" onClick={onClose}>
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Payment;
