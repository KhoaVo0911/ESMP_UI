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
  Progress, // Import Progress component
} from "@chakra-ui/react";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState({
    content: "",
    price: "",
    showQR: false,
    qrUrl: "",
  });
  const [remainingTime, setRemainingTime] = useState(120); // Countdown timer initialized to 120 seconds
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI hook for modal state
  const toast = useToast(); // Chakra UI hook for toast notifications
  const countdownIntervalRef = useRef(null); // Reference to store the countdown interval

  useEffect(() => {
    // Sample data for course items
    const courseData = [
      {
        courseID: "COURSE001",
        courseAvatar:
          "https://thumbs.dreamstime.com/b/businessman-using-tablet-laptop-ana",
        courseName: "Digital Marketing",
        coursePrice: 8000,
      },
      {
        courseID: "COURSE002",
        courseAvatar:
          "https://thumbs.dreamstime.com/b/businessman-using-tablet-laptop-ana",
        courseName: "Lập trình Javascript",
        coursePrice: 20000,
      },
      {
        courseID: "COURSE003",
        courseAvatar:
          "https://thumbs.dreamstime.com/b/businessman-using-tablet-laptop-ana",
        courseName: "Lập trình Ruby",
        coursePrice: 50000,
      },
    ];

    setCourses(courseData);
  }, []);

  const handleCourseClick = (course, index) => {
    const paidPrice = courses[index].coursePrice;
    const paidContent = courses[index].courseID;
    const qrUrl = `https://img.vietqr.io/image/ACB-18254271-compact2.png?amount=${paidPrice}&addInfo=${paidContent}&accountName=Dinh Quang Minh`;

    const newStartTime = new Date(); // Create a new Date object to use as the start time

    setSelectedCourse({
      content: paidContent,
      price: paidPrice,
      showQR: true,
      qrUrl: qrUrl,
    });

    setRemainingTime(120); // Reset the countdown timer to 120 seconds

    // Clear any existing countdown intervals before creating a new one
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    countdownIntervalRef.current = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdownIntervalRef.current); // Stop countdown when time runs out
          toast({
            title: "Thanh toán thất bại",
            description: "Hết thời gian chờ. Vui lòng thử lại.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          setSelectedCourse((prevState) => ({ ...prevState, showQR: false })); // Hide QR code
          onClose(); // Close the modal if the payment fails
          return 0;
        }
        return prevTime - 1; // Decrease the countdown by 1 second
      });
    }, 1000);

    const transactionCheckInterval = setInterval(() => {
      checkPaid(paidPrice, paidContent, transactionCheckInterval, newStartTime);
    }, 2000); // Check for payment every 2 seconds

    onOpen(); // Open the modal when a course is clicked
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
      const transactionTime = new Date(lastPaid["Ngày diễn ra"]).getTime(); // Convert to timestamp

      const startTimestamp = new Date(startTime).getTime();

      // Ensure the transaction occurred after the QR code was displayed
      if (
        lastPrice >= price &&
        lastContent.includes(content.toLowerCase()) &&
        transactionTime > startTimestamp // Ensure the transaction time is strictly greater than the start time
      ) {
        clearInterval(intervalId); // Stop checking once payment is confirmed
        clearInterval(countdownIntervalRef.current); // Stop the countdown timer on successful payment
        toast({
          title: "Thanh toán thành công",
          description: "Bạn đã thanh toán thành công cho khóa học.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setSelectedCourse((prevState) => ({ ...prevState, showQR: false })); // Hide QR code after success
        onClose(); // Close the modal after successful payment
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };
  return (
    <VStack spacing={8} align="center" padding={4} bg="#f5f5dc" minH="100vh">
      <Flex wrap="wrap" justify="center" gap={6}>
        {courses.map((item, index) => (
          <Box
            key={item.courseID}
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
            <Image
              src={item.courseAvatar}
              alt={item.courseName}
              borderRadius="md"
              boxShadow="lg"
              width="100%"
              height="180px"
              objectFit="cover"
              mb={4}
            />
            <Heading size="md" color="#6b4226" mb={2}>
              {item.courseName}
            </Heading>
            <Text fontSize="lg" fontWeight="bold" color="#8b4513" mb={4}>
              {item.coursePrice} VND
            </Text>
            <Button
              colorScheme="yellow"
              variant="outline"
              borderColor="#d4af37"
              color="#6b4226"
              _hover={{ bg: "#d4af37", color: "white" }}
              onClick={() => handleCourseClick(item, index)}
            >
              Mua
            </Button>
          </Box>
        ))}
      </Flex>

      {/* Modal for displaying the QR code */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent position="relative">
          <ModalHeader textAlign="center">Mã QR thanh toán tự động</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center">
            <Image
              src={selectedCourse.qrUrl}
              alt="QR Code"
              mx="auto"
              mb={4}
              boxShadow="md"
              width={["80%", "70%", "60%"]} // Responsive size for different screen sizes
            />
            <Text fontSize="lg" mb={2} color="yellow.400">
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
              <Text>Số tiền: {selectedCourse.price.toLocaleString()} VND</Text>
              <Text>Nội dung: {selectedCourse.content}</Text>
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
                value={(remainingTime / 120) * 100} // Calculate progress based on remaining time
                size="sm"
                colorScheme="yellow"
                mt={2}
                width="100%" // Make the progress bar span the full width of the modal
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
