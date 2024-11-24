import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
  Progress,
} from "@chakra-ui/react";

const API_PACKAGE = "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/package";

const CourseList = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState({
    content: "",
    price: "",
    showQR: false,
    qrUrl: "",
  });
  const [remainingTime, setRemainingTime] = useState(120);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const countdownIntervalRef = useRef(null);

  useEffect(() => {
    // Lấy danh sách gói từ API
    const fetchPackages = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Lấy accessToken từ localStorage
        if (!accessToken) {
          throw new Error("Access token không tồn tại");
        }

        const response = await axios.get(API_PACKAGE, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Truyền accessToken vào header
            "Content-Type": "application/json",
          },
        });

        const activePackages = response.data.filter((pkg) => pkg.status); // Lọc gói có status là true
        setPackages(activePackages);
      } catch (error) {
        console.error("Error fetching packages:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách gói. Vui lòng thử lại.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchPackages();
  }, [toast]);

  const handlePackageClick = (pkg) => {
    const paidPrice = pkg.price;
    const paidContent = pkg.description; // Sử dụng description làm nội dung chuyển khoản
    const qrUrl = `https://img.vietqr.io/image/ACB-18254271-compact2.png?amount=${paidPrice}&addInfo=${paidContent}&accountName=Dinh Quang Minh`;

    const newStartTime = new Date();

    setSelectedPackage({
      content: paidContent,
      price: paidPrice,
      showQR: true,
      qrUrl: qrUrl,
    });

    setRemainingTime(120);

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    countdownIntervalRef.current = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdownIntervalRef.current);
          toast({
            title: "Thanh toán thất bại",
            description: "Hết thời gian chờ. Vui lòng thử lại.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          setSelectedPackage((prevState) => ({ ...prevState, showQR: false }));
          onClose();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    const transactionCheckInterval = setInterval(() => {
      checkPaid(paidPrice, paidContent, transactionCheckInterval, newStartTime);
    }, 2000);

    onOpen();
  };

  const checkPaid = async (price, content, intervalId, startTime) => {
    try {
      const response = await fetch(
        "https://script.googleusercontent.com/macros/echo?user_content_key=ezaHN4Gj4g-_qKyEpIFtMZQPkwJ0BbYQk3LG5p8k9b31Q7-kvTSXe2ZhZFRNoR7KhGYLTKEhpEOtSOcEac_Ekkb6_uiOxp_qm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnKv_VMEXf_TlwaF4o_-JkqZsBeOE2g6GtB2F-g5rnh9Lg6IxlmlB0WqV6H5thtDBueCS5gbHSu7aRDOzV-kpgRZaH2A0H0nPU9z9Jw9Md8uu&lib=MbbErZamKd_6ahvdDuCk2MKVwqDhlS6o-"
      );
      const data = await response.json();
      const lastPaid = data.data[data.data.length - 1];

      const lastPrice =
        lastPaid && lastPaid["Giá trị"] ? parseFloat(lastPaid["Giá trị"]) : 0;
      const lastContent =
        lastPaid && lastPaid["Mô tả"]
          ? lastPaid["Mô tả"].trim().toLowerCase()
          : "";
      const transactionTime = new Date(lastPaid["Ngày diễn ra"]).getTime();

      const startTimestamp = new Date(startTime).getTime();

      if (
        lastPrice >= price &&
        lastContent.includes(content.toLowerCase()) &&
        transactionTime > startTimestamp
      ) {
        clearInterval(intervalId);
        clearInterval(countdownIntervalRef.current);
        toast({
          title: "Thanh toán thành công",
          description: "Bạn đã thanh toán thành công cho gói dịch vụ.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setSelectedPackage((prevState) => ({ ...prevState, showQR: false }));
        onClose();
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  return (
    <VStack spacing={8} align="center" padding={4} bg="#f5f5dc" minH="100vh">
      <Flex wrap="wrap" justify="center" gap={6}>
        {packages.map((item) => (
          <Box
            key={item.id}
            position="relative"
            maxW="280px"
            textAlign="center"
            bg="white"
            borderRadius="lg"
            boxShadow="xl"
            p={4}
            _hover={{ transform: "scale(1.05)" }}
            transition="0.3s ease-in-out"
            border="1px solid #d4af37"
          >
            {/* <Image
              src="https://via.placeholder.com/180"
              alt={item.name}
              borderRadius="md"
              boxShadow="lg"
              width="100%"
              height="180px"
              objectFit="cover"
              mb={4}
            /> */}
            <Heading size="md" color="#6b4226" mb={2}>
              {item.name}
            </Heading>
            <Text fontSize="lg" fontWeight="bold" color="#8b4513" mb={4}>
              {parseInt(item.price).toLocaleString()} VND
            </Text>
            <Button
              colorScheme="yellow"
              variant="outline"
              borderColor="#d4af37"
              color="#6b4226"
              _hover={{ bg: "#d4af37", color: "white" }}
              onClick={() => handlePackageClick(item)}
            >
              Mua
            </Button>
          </Box>
        ))}
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent position="relative">
          <ModalHeader textAlign="center">Mã QR thanh toán tự động</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center">
            <Image
              src={selectedPackage.qrUrl}
              alt="QR Code"
              mx="auto"
              mb={4}
              boxShadow="md"
              width={["80%", "70%", "60%"]}
            />
            <Text fontSize="lg" mb={2} color="yellow.400">
              Mã QR thanh toán tự động
            </Text>
            <Flex alignItems="center" justifyContent="space-between" width="100%">
              <Text>Số tiền: {selectedPackage.price.toLocaleString()} VND</Text>
              <Text>Nội dung: {selectedPackage.content}</Text>
            </Flex>
            <Box mt={4} p={2} borderTop="1px solid gray">
              <Flex
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                <Text>Đang chờ thanh toán</Text>
                <Text>
                  Thời gian còn lại:{" "}
                  {`${Math.floor(remainingTime / 60)}:${String(
                    remainingTime % 60
                  ).padStart(2, "0")}`}
                </Text>
              </Flex>
              <Progress
                value={(remainingTime / 120) * 100}
                size="sm"
                colorScheme="yellow"
                mt={2}
                width="100%"
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default CourseList;
