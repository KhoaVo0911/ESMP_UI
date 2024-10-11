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
  Grid,
} from "@chakra-ui/react";
import axios from "axios";

const Package = () => {
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
    // Update the course data structure to align with the Package component
    const courseData = [
      {
        courseID: "COURSE001",

        courseName: "Gold Plan - Buy 3 months get 1 month free",
        coursePrice: 400000,
      },
      {
        courseID: "COURSE002",

        courseName: "Premiere Plan - Buy 6 months get 2 months free",
        coursePrice: 750000,
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

    onOpen(); // Open the modal when a course is clicked
  };

  return (
    <VStack spacing={8} align="center" padding={4} bg="white" minH="80vh">
      <Text fontSize="2xl" fontWeight="bold" mb={8}>
        Compare Plans
      </Text>
      <Text fontSize="md" mb={8}>
        Choose your workspace plan according to Platform usage time.
      </Text>
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
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
            <Heading size="md" color="#6b4226" mb={2}>
              {item.courseName}
            </Heading>
            <Text fontSize="lg" fontWeight="bold" color="#8b4513" mb={4}>
              {item.coursePrice.toLocaleString()} VND
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
      </Grid>

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

export default Package;
