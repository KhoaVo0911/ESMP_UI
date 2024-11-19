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
  Radio,
  RadioGroup,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { storage } from "./../../../../shared/firebase/firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";

const StaffPayment = ({ removeItem }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [qrUrl, setQrUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [images, setImages] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("QR");
  const [cashAmount, setCashAmount] = useState(0);
  const [change, setChange] = useState(0);
  const toast = useToast();

  const cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
  const totalPrice = sessionStorage.getItem("totalPrice") || 0;

  const location = useLocation();
  const accessToken = location.state?.accessToken || sessionStorage.getItem("accessToken");
  const vendorId = location.state?.vendorId || sessionStorage.getItem("vendorId");
  const eventId = location.state?.eventId || sessionStorage.getItem("eventId");

  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

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
  }, [cartItems, vendorId]);

  useEffect(() => {
    const latestQrUrl = sessionStorage.getItem("urlQr") || "defaultBank-defaultAccount";
    const newQrUrl = `https://img.vietqr.io/image/${latestQrUrl}-compact2.png?amount=${totalPrice}&addInfo=Event Tech&accountName=Quang Minh`;
    setQrUrl(newQrUrl);
  }, [totalPrice]);

  const handleCashOut = () => {
    setChange(0);
    setCashAmount(0);
    onOpen();
  };

  const handleCashPayment = (amount) => {
    setCashAmount(amount);
    setChange(amount - totalPrice);
  };

  const saveOrder = async () => {
    try {
      // Bước 1: Tạo order bằng POST
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
      };
  
      await axios.post(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/order`,
        orderData,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      // Bước 2: Lấy order mới nhất của vendor bằng GET
      const response = await axios.get(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/order/vendor/${vendorId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        }
      );
  
      // Giả định rằng response trả về danh sách và lấy phần tử đầu tiên là order mới nhất
      const latestOrder = response.data[response.data.length - 1];
const orderId = latestOrder?.orderId;
return orderId;
    } catch (error) {
      console.error("Error creating or fetching order:", error);
      toast({
        title: "Lỗi khi tạo đơn hàng",
        description: "Đã xảy ra lỗi khi tạo hoặc lấy ID của đơn hàng. Vui lòng thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return null;
    }
  };
  

  const createTransaction = async (orderId) => {
    try {
      await axios.post(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/transaction`,
        {
          orderId: orderId,
          transactionType: paymentMethod === "QR" ? "Chuyển khoản" : "Tiền mặt",
          price: totalPrice,
        },
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast({
        title: "Tạo giao dịch thành công",
        description: "Giao dịch của bạn đã được ghi nhận thành công.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast({
        title: "Lỗi khi tạo giao dịch",
        description: "Đã xảy ra lỗi khi tạo giao dịch. Vui lòng thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleConfirmCashPayment = async () => {
    if (cashAmount < totalPrice) {
      toast({
        title: "Số tiền không đủ",
        description: "Vui lòng nhập số tiền lớn hơn hoặc bằng tổng tiền cần thanh toán.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      const orderId = await saveOrder();
      if (orderId) {
        await createTransaction(orderId);
        toast({
          title: "Thanh toán thành công",
          description: `Số tiền thừa: ${change.toLocaleString()} VND.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => {
          navigate("/staffshop", {
            state: { accessToken, vendorId, eventId },
          });
        }, 3000);
      }
    }
  };

  const handleConfirmQrPayment = async () => {
    const orderId = await saveOrder();
    if (orderId) {
      await createTransaction(orderId);
      toast({
        title: "Thanh toán QR thành công",
        description: "Bạn đã thanh toán thành công qua QR Code.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setTimeout(() => {
        navigate("/staffshop", {
          state: { accessToken, vendorId, eventId },
        });
      }, 3000);
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
      <VStack p={5} borderWidth="1px" borderRadius="md" boxShadow="lg" bg="white" width="60%" spacing={5} align="stretch">
        {cartItems.map((item, index) => (
          <HStack key={index} justify="space-between" p={4} borderWidth="1px" borderRadius="lg" boxShadow="sm" bg="gray.50" width="100%">
            <HStack spacing={4} width="70%">
              <Image src={images[item.productItemId] || "https://via.placeholder.com/150"} alt={item.name} boxSize="60px" borderRadius="full" />
              <VStack align="start" spacing={1} width="100%">
                <Text fontWeight="medium" noOfLines={2} maxWidth="180px">{item.name}</Text>
                <HStack>
                  <Text fontSize="md" fontWeight="bold" color="gray.700">Số lượng:</Text>
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
          <Text fontSize="2xl" fontWeight="bold" mb={4} color="blue.700">Thanh toán</Text>
          <VStack spacing={4} align="stretch">
            <Input
              placeholder="Tên người nhận"
              focusBorderColor="blue.500"
              borderColor="gray.300"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
              <Stack direction="row">
                <Radio value="QR">QR Code</Radio>
                <Radio value="Cash">Tiền mặt</Radio>
              </Stack>
            </RadioGroup>
          </VStack>

          <HStack justify="space-between" mt={6}>
            <Text color="red.500" fontWeight="bold">{totalQuantity} sản phẩm</Text>
            <Text fontSize="lg" fontWeight="bold" color="blue.600">{Number(totalPrice).toLocaleString()} VND</Text>
          </HStack>

          <Button colorScheme="blue" width="100%" mt={6} size="lg" fontWeight="bold" onClick={handleCashOut}>
            Thanh toán
          </Button>
        </Box>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent width="600px" maxW="90%">
          <ModalHeader textAlign="center">
            {paymentMethod === "QR" ? "Quét mã QR để thanh toán" : "Thanh toán tiền mặt"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center">
            {paymentMethod === "QR" ? (
              <>
                <Image src={qrUrl} alt="QR Code" mx="auto" mb={4} boxShadow="md" borderRadius="md" width="80%" />
                <Text fontSize="lg" color="green.500">Quét mã để thanh toán</Text>
              </>
            ) : (
              <>
                <Text fontSize="lg" mb={4}>Số tiền cần thanh toán: {Number(totalPrice).toLocaleString()} VND</Text>
                <Input
                  placeholder="Nhập số tiền khách đưa"
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
                    <Button key={amount} onClick={() => handleCashPayment(amount)} color="white" fontWeight="bold" width="120px" height="60px" borderRadius="md" boxShadow="md" fontSize="md" _hover={{ bg: "blue.300" }} bg={amount === 50000 ? "red.200" : amount === 100000 ? "green.200" : amount === 200000 ? "orange.200" : "blue.200"}>{amount.toLocaleString()} VND</Button>
                  ))}
                </HStack>
                {cashAmount >= totalPrice && (
                  <Text fontSize="2xl" color="blue.600" mt={4} fontWeight="bold">
                    Tiền thừa: {(cashAmount - totalPrice).toLocaleString()} VND
                  </Text>
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            {paymentMethod === "QR" ? (
              <Button colorScheme="green" onClick={handleConfirmQrPayment} mr={3}>Xác nhận thanh toán</Button>
            ) : (
              <Button colorScheme="green" onClick={handleConfirmCashPayment} mr={3}>Xác nhận thanh toán</Button>
            )}
            <Button variant="outline" onClick={onClose}>Đóng</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default StaffPayment;
