import React, { useEffect, useState, useRef } from "react";
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
import axios from "axios";

const API_PACKAGE =
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/package";

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState({
    content: "",
    price: "",
    description: "",
    showQR: false,
    qrUrl: "",
  });
  const [remainingTime, setRemainingTime] = useState(120);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const countdownIntervalRef = useRef(null);

  const accessToken = sessionStorage.getItem("accessToken") || "";

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(API_PACKAGE, {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        // Lọc các gói có trạng thái active
        const activePackages = response.data.filter((pkg) => pkg.status);
        setPackages(activePackages);
      } catch (error) {
        console.error("Error fetching packages:", error);
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải danh sách gói.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchPackages();
  }, [accessToken]);

  const handlePackageClick = (pkg) => {
    const qrUrl = `https://img.vietqr.io/image/ACB-18254271-compact2.png?amount=${pkg.price}&addInfo=${pkg.description}&accountName=Dinh Quang Minh`;
    const newStartTime = new Date();

    setSelectedPackage({
      content: pkg.description,
      price: pkg.price,
      description: pkg.description,
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
      checkPaid(
        pkg.price,
        pkg.description,
        transactionCheckInterval,
        newStartTime
      );
    }, 2000);

    onOpen();
  };

  const checkPaid = async (price, description, intervalId, startTime) => {
    try {
      const response = await axios.get(
        "https://script.googleusercontent.com/macros/echo?user_content_key=sfoSNLx5GRCbDs5uKLVukjxXVCO-zoVh0YrGTSqqzjAZZLs_PRwvjkNIG1J8ROGnt9NOZvqcrXZH4sj3Ynzzs_Rg5L2rloSpm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnGzmiW6YfwUI-IFTkZPDW3Qhx49gvcLvmaxfvmNYILLzHEfRAI-GMs9URhNVjzo6vwQAdcoIo8r4bnDQ8wtSOeMl4ZsuUTDnRtz9Jw9Md8uu&lib=MbbErZamKd_6ahvdDuCk2MKVwqDhlS6o-"
      );
      const data = response.data.data;
      const lastPaid = data[data.length - 1];

      const lastPrice =
        lastPaid && lastPaid["Giá trị"] ? parseFloat(lastPaid["Giá trị"]) : 0;
      const lastContent =
        lastPaid && lastPaid["Mô tả"]
          ? lastPaid["Mô tả"].trim().toLowerCase()
          : "";
      const transactionTime = new Date(lastPaid["Ngày diễn ra"]).getTime();
      const startTimestamp = new Date(startTime).getTime();

      if (
        lastPrice === parseFloat(price) &&
        lastContent.includes(description.toLowerCase()) &&
        transactionTime > startTimestamp
      ) {
        clearInterval(intervalId);
        clearInterval(countdownIntervalRef.current);
        toast({
          title: "Thanh toán thành công",
          description: "Bạn đã thanh toán thành công cho gói.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setSelectedPackage((prevState) => ({ ...prevState, showQR: false }));
        onClose();
      }
    } catch (error) {
      console.error("Lỗi kiểm tra giao dịch:", error);
    }
  };
  // (#1A2D42, #2E4156, #AAB7B7, #C0C8CA, #D4D8DD).


  return (
    <VStack spacing={8} align="center" padding={4} bg="white" minH="100vh">
      <Heading
        as="h1"
        size="lg"
        textAlign="center"
        mb={6}
        color="#2E4156"
        bgGradient="linear(to-r, teal.400, teal.600)"
        bgClip="text"
      >
        Welcome to the Service Package Management Page{" "}
      </Heading>
      <Text textAlign="center" color="#2E4156" mb={8}>
      Here, you can view and purchase service packages. Choose the package that suits your needs!
      </Text>
      <Flex wrap="wrap" justify="center" gap={6}>
        {packages.map((pkg) => (
          <Box
            key={pkg.id}
            position="relative"
            maxW="280px"
            textAlign="center"
            bg="white"
            borderRadius="lg"
            boxShadow="xl"
            p={4}
            _hover={{ transform: "scale(1.05)" }}
            transition="0.3s ease-in-out"
            border="1px solid #2E4156"
            width="300px"
          >
            {/* <Image
              src="https://via.placeholder.com/300x180" // Placeholder image
              alt={pkg.name}
              borderRadius="md"
              boxShadow="lg"
              width="100%"
              height="180px"
              objectFit="cover"
              mb={4}
            /> */}
            <Heading size="md" color="#1A2D42" mb={2}>
              {pkg.name}
            </Heading>
            <Text fontSize="sm" mb={2}>
              {pkg.description}
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="#1A2D42" mb={4}>
              {parseInt(pkg.price).toLocaleString()} VND
            </Text>
            <Button
              colorScheme="#1A2D42"
              variant="outline"
              borderColor="#1A2D42"
              color="#1A2D42"
              _hover={{ bg: "#1A2D42", color: "white" }}
              onClick={() => handlePackageClick(pkg)}
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
            <Text fontSize="lg" mb={2} color="#1A2D42">
              Mã QR thanh toán tự động
            </Text>
            <Text fontSize="sm" color="gray.500" p={5}>
              (Xác nhận tự động - Thường không quá 3')
            </Text>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <Text>Số tiền: {selectedPackage.price.toLocaleString()} VND</Text>
              <Text>Nội dung: {selectedPackage.description}</Text>
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
                colorScheme="blue"
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

export default PackageList;
