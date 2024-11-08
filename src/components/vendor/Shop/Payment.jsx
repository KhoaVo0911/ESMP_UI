import React, { useState, useEffect } from "react";
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
  const toast = useToast();

  // Retrieve cart data from session storage
  const cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
  const totalPrice = sessionStorage.getItem("totalPrice") || 0;

  // Retrieve accessToken, vendorId, eventId from location.state or sessionStorage
  const location = useLocation();
  const accessToken = location.state?.accessToken || sessionStorage.getItem("accessToken");
  const vendorId = location.state?.vendorId || sessionStorage.getItem("vendorId");
  const eventId = location.state?.eventId || sessionStorage.getItem("eventId");

  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Fetch images from Firebase based on productItemId
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

    fetchImages();
  }, [cartItems]);

  const handleCashOut = () => {
    const paidPrice = totalPrice;
    const paidContent = "Thanh toán giỏ hàng";
    const qrCodeUrl = `https://img.vietqr.io/image/ACB-18254271-compact2.png?amount=${paidPrice}&addInfo=Event Tech&accountName=Quang Minh`;

    setQrUrl(qrCodeUrl);
    onOpen();
  };

  const handleConfirmPayment = async () => {
    try {
      const orderData = {
        eventId: eventId,
        vendorId: vendorId,
        name: userName,
        totalAmount: totalQuantity,
        totalPrice: Number(totalPrice),
        details: cartItems.map((item) => ({
          productitemId: item.productItemId,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        transactionType: "Online",
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

      toast({
        title: "Thanh toán thành công",
        description: "Bạn đã thanh toán thành công cho giỏ hàng.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

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
      <HStack alignItems="center" mb={5} cursor="pointer" onClick={() => navigate(-1)}>
        <IconButton icon={<ArrowBackIcon />} size="lg" variant="ghost" aria-label="Go Back" />
        <Text fontSize="md" fontWeight="bold">Tiếp tục mua sắm</Text>
      </HStack>

      <Text fontSize="2xl" mb={5} fontWeight="bold" color="blue.700" textAlign="center">
        Giỏ hàng của bạn
      </Text>

      <HStack align="start" spacing={8} justify="center">
      <VStack
  p={5}
  borderWidth="1px"
  borderRadius="md"
  boxShadow="lg"
  bg="white"
  width="60%"
  spacing={5}
  align="stretch"
>
  {cartItems.map((item, index) => (
    <HStack
      key={index}
      justify="space-between"
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="sm"
      bg="gray.50"
      width="100%"
    >
      <HStack spacing={4} width="70%">
        <Image
          src={images[item.productItemId] || "https://via.placeholder.com/150"}
          alt={item.name}
          boxSize="60px"
          borderRadius="full"
        />
        <VStack align="start" spacing={0} width="100%">
          <Text fontWeight="medium" isTruncated maxWidth="180px">
            {item.name}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Số lượng: {item.quantity}
          </Text>
        </VStack>
      </HStack>
      <Text fontWeight="bold" color="blue.600" minWidth="80px" textAlign="right">
        {(item.price * item.quantity).toLocaleString()} VND
      </Text>
      <IconButton
        icon={<DeleteIcon />}
        colorScheme="red"
        onClick={() => removeItem(index)}
        aria-label="Remove Item"
      />
    </HStack>
  ))}
</VStack>



        <Box p={6} borderWidth="1px" borderRadius="md" boxShadow="lg" bg="white" width="30%">
          <Text fontSize="2xl" fontWeight="bold" mb={4} color="blue.700">
            Thanh toán
          </Text>
          <VStack spacing={4} align="stretch">
            <Input 
              placeholder="Tên người nhận" 
              focusBorderColor="blue.500" 
              borderColor="gray.300" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </VStack>

          <HStack justify="space-between" mt={6}>
            <Text color="red.500" fontWeight="bold">{totalQuantity} sản phẩm</Text>
            <Text fontSize="lg" fontWeight="bold" color="blue.600">{Number(totalPrice).toLocaleString()} VND</Text>
          </HStack>

          <Button
            colorScheme="blue"
            width="100%"
            mt={6}
            size="lg"
            fontWeight="bold"
            onClick={handleCashOut}
          >
            Thanh toán
          </Button>
        </Box>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Quét mã QR để thanh toán</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center">
            <Image src={qrUrl} alt="QR Code" mx="auto" mb={4} boxShadow="md" borderRadius="md" width="80%" />
            <Text fontSize="lg" mb={2} color="green.500">Xác nhận thanh toán tự động</Text>
            <Text fontSize="sm" color="gray.500">(Hoàn thành trong vòng 3 phút)</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={handleConfirmPayment} mr={3}>
              Xác nhận thanh toán
            </Button>
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Payment;
