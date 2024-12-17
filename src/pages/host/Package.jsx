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
const API_HOST = "https://esmpbe.id.vn/api/host";

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

  const expiretime = sessionStorage.getItem("expiretime");
  console.log("time", expiretime);
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const accessToken = sessionStorage.getItem("accessToken");
        const hostId = sessionStorage.getItem("hostId");
        const expiretime = sessionStorage.getItem("expiretime");

        if (!accessToken || !hostId || !expiretime) {
          throw new Error("Thiếu thông tin trong sessionStorage");
        }

        // Chuyển expiretime từ string sang Date object
        const expireDate = new Date(expiretime);
        const today = new Date(); // Lấy ngày hiện tại

        console.log("Expire Time:", expireDate);
        console.log("Today's Date:", today);

        // Kiểm tra nếu expiretime đã hết hạn
        if (expireDate < today) {
          console.log("Expire time đã hết hạn. Tải danh sách gói dịch vụ mới.");
          const response = await axios.get(API_PACKAGE, {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          });

          const activePackages = response.data.filter((pkg) => pkg.status); // Lọc các gói đang hoạt động
          setPackages(activePackages);
        } else {
          console.log(
            "Expire time còn hiệu lực. Hiển thị thông tin gói của host."
          );
          setHostTransactions([{ hostid: hostId }]); // Dùng state để hiển thị HostPackageInfo
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
        // toast({
        //   title: "Lỗi",
        //   description: "Can not load",
        //   status: "error",
        //   duration: 5000,
        //   isClosable: true,
        // });
      }
    };

    fetchPackages();
  }, [toast]);

  const handlePackageClick = async (pkg) => {
    const hostId = sessionStorage.getItem("hostId");
    const accessToken = sessionStorage.getItem("accessToken");
    const newStartTime = new Date();
    try {
      // Step 1: Create a new transaction
      const transactionResponse = await axios.post(
        API_TRANSACTION_PACKAGE,
        {
          hostid: hostId,
          packageid: pkg.id,
        },
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        }
      );

      const transaction = transactionResponse.data;

      const paidPrice = pkg.price;
      const paidContent = pkg.description;
      const qrUrl = `https://img.vietqr.io/image/ACB-18254271-compact2.png?amount=${paidPrice}&addInfo=${paidContent}&accountName=Dinh Quang Minh`;

      setSelectedPackage({
        content: paidContent,
        price: paidPrice,
        showQR: true,
        qrUrl: qrUrl,
        transactionId: transaction.id, // Save transaction ID for further processing
      });

      setRemainingTime(1200); // Reset timer
      onOpen(); // Open the modal

      // Step 2: Start countdown timer
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }

      countdownIntervalRef.current = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(countdownIntervalRef.current);

            // Cancel the transaction when time expires
            axios
              .put(
                `${API_TRANSACTION_PACKAGE}/${transaction.id}`,
                { status: "cancel" },
                {
                  headers: {
                    Authorization: `${accessToken}`,
                  },
                }
              )
              .then(() => {
                toast({
                  title: "Transaction Canceled",
                  description:
                    "The transaction has been canceled due to timeout.",
                  status: "info",
                  duration: 5000,
                  isClosable: true,
                });
              })
              .catch((error) => {
                console.error("Error cancelling transaction:", error);
                // toast({
                //   title: "Error",
                //   description:
                //     "Failed to cancel the transaction. Please try again.",
                //   status: "error",
                //   duration: 5000,
                //   isClosable: true,
                // });
              });

            setSelectedPackage((prevState) => ({
              ...prevState,
              showQR: false,
            }));
            onClose();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      // Step 3: Start periodic payment checks
      const transactionCheckInterval = setInterval(() => {
        checkPaid(
          paidPrice,
          paidContent,
          pkg.id,
          // Use transaction ID
          transactionCheckInterval,
          newStartTime // Start time
        );
      }, 10000);

      countdownIntervalRef.current = transactionCheckInterval;
    } catch (error) {
      console.error("Error creating transaction:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to create the transaction. Please try again.",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      // });
    }
  };

  const handleModalClose = async () => {
    const hostId = sessionStorage.getItem("hostId");
    const accessToken = sessionStorage.getItem("accessToken");

    try {
      // Gọi API GET để tìm giao dịch pending trong ngày hôm nay
      const response = await axios.get(API_TRANSACTION_PACKAGE, {
        headers: {
          Authorization: `${accessToken}`,
        },
      });

      const today = new Date();
      const transactions = response.data.filter((transaction) => {
        const transactionDate = new Date(transaction.createdat);
        return (
          transaction.hostid === hostId &&
          transaction.status === "pending" &&
          transactionDate.getDate() === today.getDate() &&
          transactionDate.getMonth() === today.getMonth() &&
          transactionDate.getFullYear() === today.getFullYear()
        );
      });

      if (transactions.length > 0) {
        const pendingTransaction = transactions[0]; // Lấy giao dịch đầu tiên
        // Gọi API PUT để cập nhật trạng thái thành "cancel"
        await axios.put(
          `${API_TRANSACTION_PACKAGE}/${pendingTransaction.id}`,
          {
            status: "cancel",
          },
          {
            headers: {
              Authorization: `${accessToken}`,
            },
          }
        );
        toast({
          title: "Transaction Canceled",
          description: "The transaction has been canceled.",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error while canceling the transaction:", error);
      // toast({
      //   title: "Error",
      //   description: "Unable to cancel the transaction. Please try again.",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      // });
    }

    // Dọn dẹp trạng thái và đóng modal
    setSelectedPackage((prevState) => ({ ...prevState, showQR: false }));
    setIsPaymentSuccessful(false);
    clearInterval(countdownIntervalRef.current);
    onClose();
  };

  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const checkPaid = async (
    price,
    content,
    packageId,
    intervalId,
    startTime
  ) => {
    try {
      const hostId = sessionStorage.getItem("hostId");
      const accessToken = sessionStorage.getItem("accessToken");

      // Gọi API GET để lấy danh sách giao dịch
      const response = await axios.get(API_TRANSACTION_PACKAGE, {
        headers: {
          Authorization: `${accessToken}`,
        },
      });

      const today = new Date();
      // Lọc giao dịch `pending` trong ngày hôm nay
      const transactions = response.data.filter((transaction) => {
        const transactionDate = new Date(transaction.createdat);
        return (
          transaction.hostid === hostId &&
          transaction.status === "pending" &&
          transactionDate.getDate() === today.getDate() &&
          transactionDate.getMonth() === today.getMonth() &&
          transactionDate.getFullYear() === today.getFullYear()
        );
      });

      if (transactions.length > 0) {
        const pendingTransaction = transactions[0]; // Lấy giao dịch đầu tiên

        const transactionId = pendingTransaction.id; // Lấy `id` của giao dịch `pending`

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
        const transactionTime = lastPaid
          ? new Date(lastPaid["Ngày diễn ra"]).getTime()
          : 0;
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

          const hostId = sessionStorage.getItem("hostId"); // Lấy hostId từ sessionStorage
          const accessToken = sessionStorage.getItem("accessToken"); // Lấy accessToken từ sessionStorage

          if (hostId) {
            // Gọi API để lưu thông tin thanh toán
            await axios.put(
              `${API_TRANSACTION_PACKAGE}/${transactionId}`, // Cập nhật giao dịch hiện tại
              {
                status: "success",
              },
              {
                headers: {
                  Authorization: `${accessToken}`, // Gửi accessToken vào header
                },
              }
            );

            // Gọi lại API_TRANSACTION_PACKAGE để lấy thông tin giao dịch
            try {
              const transactionResponse = await axios.get(
                API_TRANSACTION_PACKAGE,
                {
                  headers: {
                    Authorization: `${accessToken}`,
                  },
                }
              );

              const hostTransactions = transactionResponse.data.filter(
                (transaction) => transaction.hostid === hostId
              );

              // Lấy giao dịch có start day là ngày hôm nay
              const today = new Date();
              const todayTransactions = hostTransactions.filter(
                (transaction) => {
                  const transactionDate = new Date(transaction.createdat);
                  return (
                    transactionDate.getDate() === today.getDate() &&
                    transactionDate.getMonth() === today.getMonth() &&
                    transactionDate.getFullYear() === today.getFullYear()
                  );
                }
              );

              if (todayTransactions.length > 0) {
                const selectedTransaction = todayTransactions[0]; // Lấy giao dịch đầu tiên trong danh sách hôm nay
                const selectedPackageDetails = packages.find(
                  (pkg) => pkg.id === selectedTransaction.packageid
                );

                if (selectedPackageDetails) {
                  // Tính toán expireTime và eventStorageTime
                  const calculateExpirationDate = (createdAt, months) => {
                    const createdDate = new Date(createdAt);
                    createdDate.setMonth(createdDate.getMonth() + months);
                    return createdDate.toISOString();
                  };

                  const calculateStorageDate = (
                    expirationDate,
                    monthsToAdd
                  ) => {
                    const expDate = new Date(expirationDate);
                    expDate.setMonth(expDate.getMonth() + monthsToAdd);
                    return expDate.toISOString();
                  };

                  const expireTime = calculateExpirationDate(
                    selectedTransaction.createdat,
                    selectedPackageDetails.expiretime
                  );
                  const eventStorageTime = calculateStorageDate(
                    expireTime,
                    selectedPackageDetails.eventstoragetime
                  );

                  // Cập nhật thông tin host
                  const updateHostData = async (
                    hostId,
                    expireTime,
                    eventStorageTime
                  ) => {
                    try {
                      const getHostResponse = await axios.get(
                        `${API_HOST}/${hostId}`,
                        {
                          headers: {
                            Authorization: `${accessToken}`,
                          },
                        }
                      );

                      const currentHostData = getHostResponse.data;

                      const updatedHostData = {
                        name: currentHostData.account.name,
                        phone: currentHostData.account.phone,
                        email: currentHostData.account.email,
                        expiretime: expireTime,
                        eventstoragetime: eventStorageTime,
                        bankingaccount: currentHostData.bankingaccount,
                        status: currentHostData.account.status,
                      };

                      await axios.put(
                        `${API_HOST}/${hostId}`,
                        updatedHostData,
                        {
                          headers: {
                            Authorization: `${accessToken}`,
                          },
                        }
                      );
                      sessionStorage.setItem("expiretime", expireTime);
                      // toast({
                      //   title: "Information Updated Successfully",
                      //   description:
                      //     "Expiration date and storage time have been updated.",
                      //   status: "success",
                      //   duration: 5000,
                      //   isClosable: true,
                      // });
                    } catch (error) {
                      console.error(
                        "Error while updating host information:",
                        error
                      );
                      // toast({
                      //   title: "Update Failed",
                      //   description:
                      //     "Unable to update host information. Please try again.",
                      //   status: "error",
                      //   duration: 5000,
                      //   isClosable: true,
                      // });
                    }
                  };

                  // Gọi hàm cập nhật thông tin host
                  await updateHostData(hostId, expireTime, eventStorageTime);
                }
              } else {
                console.log("No transactions started from today.");
              }
            } catch (error) {
              console.error(
                "Error while fetching transaction information or updating host:",
                error
              );
              // toast({
              //   title: "Error",
              //   description:
              //     "Unable to process the transaction. Please try again.",
              //   status: "error",
              //   duration: 5000,
              //   isClosable: true,
              // });
            }

            // toast({
            //   title: "Transaction Recorded Successfully",
            //   description: "The transaction information has been saved.",
            //   status: "success",
            //   duration: 5000,
            //   isClosable: true,
            // });
          } else {
            console.error("hostId is not in sessionStorage.");
          }

          setIsPaymentSuccessful(true); // Cập nhật trạng thái thanh toán
          clearInterval(intervalId); // Dừng kiểm tra thanh toán
          clearInterval(countdownIntervalRef.current); // Dừng countdown

          toast({
            title: "Payment Successful",
            description:
              "You have successfully completed the payment for the package.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });

          setSelectedPackage((prevState) => ({ ...prevState, showQR: false }));
          onClose(); // Close the modal
          window.location.reload(); // This line will refresh the page
        } else if (isPaymentSuccessful) {
          console.log(
            "Payment already successful, no further checks required."
          );
        } else {
          console.log("Conditions do not match for a successful payment.");
        }
      } else {
        console.log("No pending transaction found.");
      }
    } catch (error) {
      console.error("Error while checking payment:", error);
      // toast({
      //   title: "Error",
      //   description: "Unable to check payment status. Please try again.",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      // });
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={8} align="center" padding={4} bg="white" minH="90vh">
        {expiretime && new Date(expiretime) >= new Date() ? (
          // Nếu expiretime còn hiệu lực, hiển thị HostPackageInfo
          <HostPackageInfo hostid={sessionStorage.getItem("hostId")} />
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
                  width="300px"
                  height="300px"
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
                    Expiry Time:{" "}
                    <strong>
                      {item.expiretime} Month{item.expiretime > 1 ? "s" : ""}
                    </strong>
                  </Text>
                  <Text fontSize="lg" color="#8b4513" mb={4}>
                    Storage Data:{" "}
                    <strong>
                      {item.eventstoragetime} Month
                      {item.eventstoragetime > 1 ? "s" : ""}
                    </strong>
                  </Text>

                  <Text
                    fontSize="x-large"
                    fontWeight="bold"
                    color="#8b4513"
                    mb={4}
                  >
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
                    Buy
                  </Button>
                </Box>
              ))}
            </Flex>
          </>
        )}

        <Modal
          isOpen={isOpen}
          onClose={handleModalClose}
          closeOnOverlayClick={false} // Ngăn đóng khi click ra ngoài
        >
          <ModalOverlay />
          <ModalContent position="relative">
            <ModalHeader textAlign="center">
              Automatic Payment QR Code
            </ModalHeader>
            <ModalCloseButton onClick={handleModalClose} />
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
                Automatic Payment QR Code
              </Text>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                <Text>
                  Amount: {selectedPackage.price.toLocaleString()} VND
                </Text>
                <Text>Content: {selectedPackage.content}</Text>
              </Flex>
              <Box mt={4} p={2} borderTop="1px solid gray">
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                >
                  <Text>Waiting for payment</Text>
                  <Text>
                    Time remaining:{" "}
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
              <Button colorScheme="blue" mr={3} onClick={handleModalClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default CourseList;
