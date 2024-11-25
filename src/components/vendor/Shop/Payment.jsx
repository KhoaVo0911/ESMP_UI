import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  VStack,
  HStack,
  Image,
  Text,
  Button,
  Input,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Radio,
  RadioGroup,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { storage } from "./../../../shared/firebase/firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";

const Payment = ({ removeItem }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [qrUrl, setQrUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [images, setImages] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("QR");
  const [cashAmount, setCashAmount] = useState(0);
  const [change, setChange] = useState(0);
  const toast = useToast();

  const cartItems = useMemo(() => JSON.parse(sessionStorage.getItem("cartItems")) || [], []);
  const totalPrice = useMemo(() => Number(sessionStorage.getItem("totalPrice")) || 0, []);

  const location = useLocation();
  const accessToken = location.state?.accessToken || sessionStorage.getItem("accessToken");
  const vendorId = location.state?.vendorId || sessionStorage.getItem("vendorId");
  const eventId = location.state?.eventId || sessionStorage.getItem("eventId");

  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const latestQrUrl = sessionStorage.getItem("urlQr") || "defaultBank-defaultAccount";
    const newQrUrl = `https://img.vietqr.io/image/${latestQrUrl}-compact2.png?amount=${totalPrice}&addInfo=Event Tech&accountName=Quang Minh`;
    setQrUrl(newQrUrl);
  }, [totalPrice]);

  useEffect(() => {
    const fetchImages = async () => {
      const newImages = {};
      for (const item of cartItems) {
        if (item.productItemId && !images[item.productItemId]) {
          try {
            const imageRef = ref(storage, `${vendorId}/${item.productItemId}`);
            const url = await getDownloadURL(imageRef);
            newImages[item.productItemId] = url;
          } catch (error) {
            console.error("Error fetching image URL:", error);
            newImages[item.productItemId] = "https://via.placeholder.com/150";
          }
        }
      }
      setImages((prevImages) => ({ ...prevImages, ...newImages }));
    };

    if (cartItems.length > 0 && vendorId) {
      fetchImages();
    }
  }, [cartItems, vendorId]);

  const handleConfirmPayment = async () => {
    if (paymentMethod === "Cash" && cashAmount < totalPrice) {
      toast({
        title: "Insufficient funds",
        description: "Please enter an amount greater than or equal to the total amount.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    try {
      // Create an order
      const orderData = {
        eventId,
        vendorId,
        name: userName,
        totalAmount: totalQuantity,
        totalPrice,
        details: cartItems.map((item) => ({
          productitemId: item.productItemId,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
      };
  
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
  
      const orderId = response.data.orderId; // Use this orderId for any subsequent transaction actions
  
      toast({
        title: "Order Created Successfully",
        description: "Your order has been created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
      // Confirm payment after order creation
      toast({
        title: "Payment successful",
        description:
          paymentMethod === "QR"
            ? "You have successfully paid using QR Code."
            : `Change: ${change.toLocaleString()} VND.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
      // Navigate back to the shop
      navigate("/shop", {
        state: { accessToken, vendorId, eventId },
      });
    } catch (error) {
      console.error("Error creating order or processing payment:", error);
      toast({
        title: "Error",
        description: "An error occurred while processing your payment or creating the order. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const handleCashPayment = (amount) => {
    setCashAmount(amount);
    setChange(amount - totalPrice);
  };

  return (
    <Box p={5} bgGradient="linear(to-r, blue.100, pink.100)" minH="100vh">
      <HStack alignItems="center" mb={5} cursor="pointer" onClick={() => navigate(-1)}>
        <IconButton icon={<ArrowBackIcon />} size="lg" variant="ghost" aria-label="Go Back" />
        <Text fontSize="md" fontWeight="bold">Continue Shopping</Text>
      </HStack>

      <Text fontSize="2xl" mb={5} fontWeight="bold" color="blue.700" textAlign="center">
        Your Shopping Cart
      </Text>

      <HStack align="start" spacing={8} justify="center">
        <VStack p={5} borderWidth="1px" borderRadius="md" boxShadow="lg" bg="white" width="60%" spacing={5} align="stretch">
          {cartItems.map((item, index) => (
            <HStack key={index} justify="space-between" p={4} borderWidth="1px" borderRadius="lg" boxShadow="sm" bg="gray.50" width="100%">
              <HStack spacing={4} width="70%">
                <Image src={images[item.productItemId] || "https://via.placeholder.com/150"} alt={item.name} boxSize="60px" borderRadius="full" />
                <VStack align="start" spacing={1} width="100%">
                  <Text fontWeight="medium" noOfLines={2} maxWidth="180px">{item.name}</Text>
                  <HStack>
                    <Text fontSize="md" fontWeight="bold" color="gray.700">Quantity:</Text>
                    <Text fontSize="md" fontWeight="bold" color="blue.600">{item.quantity}</Text>
                  </HStack>
                </VStack>
              </HStack>
              <Text fontWeight="bold" color="blue.600" minWidth="80px" textAlign="right">
                {(item.price * item.quantity).toLocaleString()} VND
              </Text>
              <IconButton icon={<DeleteIcon />} colorScheme="red" onClick={() => removeItem(index)} aria-label="Remove Item" />
            </HStack>
          ))}
        </VStack>

        <Box p={6} borderWidth="1px" borderRadius="md" boxShadow="lg" bg="white" width="30%">
          <Text fontSize="2xl" fontWeight="bold" mb={4} color="blue.700">Payment</Text>
          <VStack spacing={4} align="stretch">
            <Input
              placeholder="Recipient's Name"
              focusBorderColor="blue.500"
              borderColor="gray.300"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
              <Stack direction="row">
                <Radio value="QR">QR Code</Radio>
                <Radio value="Cash">Cash</Radio>
              </Stack>
            </RadioGroup>
          </VStack>

          <HStack justify="space-between" mt={6}>
            <Text color="red.500" fontWeight="bold">{totalQuantity} items</Text>
            <Text fontSize="lg" fontWeight="bold" color="blue.600">{totalPrice.toLocaleString()} VND</Text>
          </HStack>

          <Button colorScheme="blue" width="100%" mt={6} size="lg" fontWeight="bold" onClick={onOpen}>
            Pay Now
          </Button>
        </Box>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">{paymentMethod === "QR" ? "Scan QR Code to Pay" : "Pay with Cash"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center">
            {paymentMethod === "QR" ? (
              <>
                <Image src={qrUrl} alt="QR Code" mx="auto" mb={4} boxShadow="md" borderRadius="md" width="80%" />
                <Text fontSize="lg" color="green.500">Scan to Pay</Text>
              </>
            ) : (
              <>
                <Text fontSize="lg" mb={4}>
                  Total Amount: <strong>{totalPrice.toLocaleString()} VND</strong>
                </Text>
                <Input
                  placeholder="Enter cash amount"
                  type="number"
                  value={cashAmount}
                  onChange={(e) => handleCashPayment(Number(e.target.value))}
                  mb={6}
                  border="2px solid"
                  borderColor="blue.300"
                  borderRadius="md"
                  fontSize="xl"
                  textAlign="center"
                  width="80%"
                  padding="12px"
                />
                <HStack spacing={6} justifyContent="center" mb={4}>
                  {[50000, 100000, 200000, 500000].map((amount) => (
                    <Button
                      key={amount}
                      onClick={() => handleCashPayment(amount)}
                      color="white"
                      fontWeight="bold"
                      width="120px"
                      height="60px"
                      borderRadius="md"
                      boxShadow="md"
                      fontSize="small"
                      bg={
                        amount === 50000 ? "red.200" :
                        amount === 100000 ? "green.200" :
                        amount === 200000 ? "orange.200" : "blue.200"
                      }
                    >
                      {amount.toLocaleString()} VND
                    </Button>
                  ))}
                </HStack>
                {cashAmount >= totalPrice && (
                  <Text fontSize="2xl" color="blue.600" mt={4} fontWeight="bold">
                    Change: {(cashAmount - totalPrice).toLocaleString()} VND
                  </Text>
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              onClick={handleConfirmPayment}
              isDisabled={paymentMethod === "Cash" && cashAmount < totalPrice}
            >
              Confirm Payment
            </Button>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Payment;
