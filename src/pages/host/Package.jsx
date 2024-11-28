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
import HostPackageInfo from "./HostPackageInfo";

const API_PACKAGE = "https://esmpbe.id.vn/api/package";
const API_TRANSACTION_PACKAGE = "https://esmpbe.id.vn/api/transactionpackage"; // URL api transaction package

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
  const [hostTransactions, setHostTransactions] = useState([]); // Add state to store host transactions


  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const accessToken = sessionStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("Access token không tồn tại");
        }
  
        const transactionResponse = await axios.get(API_TRANSACTION_PACKAGE, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        const hostid = sessionStorage.getItem("hostid");
        const filteredTransactions = transactionResponse.data.filter((transaction) => transaction.hostid === hostid);
        setHostTransactions(filteredTransactions); // Set the host transactions to state
  
        if (filteredTransactions.length > 0) {
          // You can handle showing host package info here, based on host transactions
          console.log("Host ID:", filteredTransactions.length);
        } else {
          // Hiển thị danh sách các gói dịch vụ
          const response = await axios.get(API_PACKAGE, {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          });
  
          const activePackages = response.data.filter((pkg) => pkg.status);
          setPackages(activePackages);
        }
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

    // Dọn dẹp interval đếm ngược nếu có
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

    // Thiết lập interval để kiểm tra thanh toán mỗi 10 giây
    const transactionCheckInterval = setInterval(() => {
      checkPaid(paidPrice, paidContent, pkg.id, transactionCheckInterval, newStartTime); // Truyền pkg.id vào function
    }, 10000); // Chỉnh tần suất kiểm tra mỗi 10 giây

    onOpen();
  };

  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const checkPaid = async (price, content, packageId, intervalId, startTime) => {
    try {
      const response = await fetch(
        "https://script.googleusercontent.com/macros/echo?user_content_key=ezaHN4Gj4g-_qKyEpIFtMZQPkwJ0BbYQk3LG5p8k9b31Q7-kvTSXe2ZhZFRNoR7KhGYLTKEhpEOtSOcEac_Ekkb6_uiOxp_qm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnKv_VMEXf_TlwaF4o_-JkqZsBeOE2g6GtB2F-g5rnh9Lg6IxlmlB0WqV6H5thtDBueCS5gbHSu7aRDOzV-kpgRZaH2A0H0nPU9z9Jw9Md8uu&lib=MbbErZamKd_6ahvdDuCk2MKVwqDhlS6o-"
      );
      const data = await response.json();
      const lastPaid = data.data[data.data.length - 1];

      const lastPrice = lastPaid && lastPaid["Giá trị"] ? parseFloat(lastPaid["Giá trị"]) : 0;
      const lastContent = lastPaid && lastPaid["Mô tả"] ? lastPaid["Mô tả"].trim().toLowerCase() : "";
      const transactionTime = lastPaid ? new Date(lastPaid["Ngày diễn ra"]).getTime() : 0;
      const startTimestamp = new Date(startTime).getTime();

      console.log("Kiểm tra thanh toán...");
      console.log("Giá trị thanh toán:", lastPrice);
      console.log("Nội dung thanh toán:", lastContent);
      console.log("Giá đã yêu cầu:", price);
      console.log("Nội dung đã yêu cầu:", content);
      console.log("Thời gian giao dịch:", transactionTime);
      console.log("Thời gian bắt đầu:", startTimestamp);

      if (
        lastPrice >= price &&
        lastContent.includes(content.toLowerCase()) &&
        transactionTime > startTimestamp &&
        !isPaymentSuccessful // Kiểm tra trạng thái thanh toán
      ) {
        console.log("Thanh toán thành công!");

        const hostid = sessionStorage.getItem("hostid"); // Lấy hostId từ sessionStorage
        const accessToken = sessionStorage.getItem("accessToken"); // Lấy accessToken từ sessionStorage

        if (hostid) {
          // Gọi API để lưu thông tin thanh toán
          await axios.post(API_TRANSACTION_PACKAGE, {
            hostid: hostid,
            packageid: packageId,
          }, {
            headers: {
              Authorization: `Bearer ${accessToken}` // Gửi accessToken vào header
            }
          });
          toast({
            title: "Ghi nhận giao dịch thành công",
            description: "Thông tin giao dịch đã được lưu.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
          console.error("hostId không tồn tại trong sessionStorage.");
        }

        setIsPaymentSuccessful(true); // Cập nhật trạng thái thanh toán
        clearInterval(intervalId); // Dừng kiểm tra thanh toán
        clearInterval(countdownIntervalRef.current); // Dừng countdown

        toast({
          title: "Thanh toán thành công",
          description: "Bạn đã thanh toán thành công cho gói dịch vụ.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setSelectedPackage((prevState) => ({ ...prevState, showQR: false }));
        onClose(); // Đóng modal
        window.location.reload();  // This line will refresh the page
      } else if (isPaymentSuccessful) {
        console.log("Thanh toán đã thành công, không kiểm tra lại.");
      } else {
        console.log("Điều kiện không khớp để thanh toán thành công.");
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra thanh toán:", error);
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={8} align="center" padding={4} bg="white" minH="90vh">
        {hostTransactions.length > 0 ? (
          // If there are host transactions, show HostPackageInfo component
          <HostPackageInfo hostid={sessionStorage.getItem("hostid")} />
        ) : (
          // If no host transactions, show the package list with heading
          <>
            <Box mb={6}>
              <Heading as="h1" size="xl" textAlign="center">
                List of Service Packages
              </Heading>
              <Text fontSize="lg" textAlign="center" color="gray.500">
                Select the plan you want to pay for
              </Text>
            </Box>
  
            <Flex wrap="wrap" justify="center" gap={6}>
              {packages.map((item) => (
                <Box
                  key={item.id}
                  position="relative"
                  maxW="400px"
                  width="250px"
                  height="250px"
                  textAlign="center"
                  bg="white"
                  borderRadius="lg"
                  boxShadow="xl"
                  p={4}
                  _hover={{ transform: "scale(1.05)" }}
                  transition="0.3s ease-in-out"
                  border="1px solid #d4af37"
                >
                  <Heading size="xl" color="#6b4226" mb={2}>
                    {item.name}
                  </Heading>
                  <Text fontSize="lg" fontWeight="bold" color="#8b4513" mb={4}>
                    {item.description}
                  </Text>
                  <Text fontSize="lg" color="#8b4513" mb={4}>
                    This package is valid for {item.eventstoragetime}
                  </Text>
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
          </>
        )}
  
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
                <Flex alignItems="center" justifyContent="space-between" width="100%">
                  <Text>Đang chờ thanh toán</Text>
                  <Text>
                    Thời gian còn lại:{" "}
                    {`${Math.floor(remainingTime / 60)}:${String(remainingTime % 60).padStart(2, "0")}`}
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
    </Box>
  );
  
};

export default CourseList;