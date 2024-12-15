import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge,
  Button,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Spinner,
  useToast, // Importing useToast
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import axios from "axios";

const BASE_URL = "https://esmpbe.id.vn/api";
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const TransactionList = () => {
  const { eventId } = useParams(); // Get eventId from the URL
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 10; // Number of payments per page
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isQrModalOpen,
    onOpen: onQrOpen,
    onClose: onQrClose,
  } = useDisclosure();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [qrUrl, setQrUrl] = useState(""); // URL for QR Code
  const [vendorInEventId, setVendorInEventId] = useState(null); // VendorInEventId
  const [loading, setLoading] = useState(true); // Loading state
  const [eventName, setEventName] = useState(""); // State for storing event name
  const toast = useToast(); // Initialize toast

  // Fetch event name data
  useEffect(() => {
    const fetchEventName = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/event/${eventId}`, {
          headers: {
            Authorization: `${getAccessToken()}`,
          },
        });
        setEventName(response.data.name || "Event Details");
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventName();
  }, [eventId]);

  // Fetch payments data from the API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        const response = await axios.get(
          `${BASE_URL}/eventpayment/${eventId}`,
          {
            headers: {
              Authorization: `${getAccessToken()}`,
            },
          }
        );
        setPayments(response.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching is complete
      }
    };

    fetchPayments();
  }, [eventId]);

  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = payments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );

  const totalPages = Math.ceil(payments.length / paymentsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    onOpen();
  };

  const handleGenerateQr = async (payment) => {
    try {
      const { vendorId, deposit } = payment;
  
      // Fetch vendor details to get QR URL
      const vendorResponse = await axios.get(`${BASE_URL}/vendor/${vendorId}`, {
        headers: { Authorization: `${getAccessToken()}` },
      });
      const userid = vendorResponse.data.userid;
  
      const { urlQr } = vendorResponse.data;
      const newQrUrl = `https://img.vietqr.io/image/${urlQr}-compact2.png?amount=${deposit}`;
  
      setSelectedPayment({ ...payment, userid }); // Include `userid` in `selectedPayment`
      setQrUrl(newQrUrl);
      onQrOpen();
    } catch (error) {
      console.error("Error generating QR:", error);
    }
  };
  

  const handleConfirmPayment = async (userid, deposit) => {
    try {
      const response = await axios.get(`${BASE_URL}/eventpayment/${eventId}`, {
        headers: {
          Authorization: `${getAccessToken()}`,
        },
      });
  
      const paymentToUpdate = response.data.find(
        (payment) => payment.id === selectedPayment.id
      );
  
      if (paymentToUpdate) {
        // Update payment status
        await axios.put(
          `${BASE_URL}/eventpayment/refunding/${paymentToUpdate.id}`,
          { status: "Finished" },
          {
            headers: {
              Authorization: `${getAccessToken()}`,
            },
          }
        );
  
        // Send notification
        console.log("User ID:", userid); // Log safely
        console.log("Deposit:", deposit); // Log safely
        const notificationApiUrl = `https://esmpbe.id.vn/api/notification`;
        const notificationResponse = await axios.post(notificationApiUrl, {
          userid,
          source: `Host has refunded the deposit: ${deposit} VNĐ`,
        });
        console.log("Notification API Response:", notificationResponse.data);
  
        // Close QR Modal
        onQrClose();
        setQrUrl("");
        setVendorInEventId(null);
        setSelectedPayment(null);
  
        // Update local state
        setPayments((prevPayments) =>
          prevPayments.map((p) =>
            p.id === paymentToUpdate.id ? { ...p, status: "Finished" } : p
          )
        );
  
        // Show success toast
        toast({
          title: "Payment Confirmed",
          description: "The payment has been confirmed successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.error("Matching payment not found for confirmation.");
      }
    } catch (error) {
      console.error("Error confirming payment:", error.message || error);
    }
  };
  
  

  const handleCancelQr = () => {
    setQrUrl("");
    setVendorInEventId(null);
    setSelectedPayment(null);
    onQrClose();

    toast({
      title: "Action Cancelled",
      description: "You have cancelled the payment action.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={8} bg="white" borderRadius="md" boxShadow="md">
      <Text fontSize="3xl" fontWeight="bold" mb={6}>
        Payment List -{" "}
        <Text as="span" color="purple.900" fontWeight="bold">
          {eventName}
        </Text>
      </Text>
      {loading ? (
        <Flex justify="center" align="center" height="200px">
          <Spinner size="lg" />
        </Flex>
      ) : (
        <>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th textAlign="center">No</Th>
                <Th textAlign="center">Vendor Name</Th>
                <Th textAlign="center">LocationType Name</Th>
                <Th textAlign="center">Deposit</Th>
                <Th textAlign="center">Total</Th>
                <Th textAlign="center">Status</Th>
                <Th textAlign="center">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentPayments.map((payment, index) => (
                <Tr key={payment.id}>
                  <Td textAlign="center">{indexOfFirstPayment + index + 1}</Td>
                  <Td textAlign="center">{payment.name}</Td>
                  <Td textAlign="center">{payment.locationtypename}</Td>
                  <Td textAlign="center">{payment.deposit}</Td>
                  <Td textAlign="center">{payment.totalprofit}</Td>
                  <Td textAlign="center">
                    <Badge
                      colorScheme={
                        payment.status === "Success Deposit"
                          ? "green"
                          : "yellow"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </Td>
                  <Td textAlign="center">
                    <Button
                      colorScheme="blue"
                      onClick={() => handleViewDetails(payment)}
                      mr={2}
                    >
                      View
                    </Button>
                    <Button
                      colorScheme="green"
                      onClick={() => handleGenerateQr(payment)}
                    >
                      Generate QR
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Flex justifyContent="flex-end" mt={4}>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                colorScheme={currentPage === i + 1 ? "blue" : "gray"}
                mx={1}
              >
                {i + 1}
              </Button>
            ))}
          </Flex>
        </>
      )}

      {selectedPayment && (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Payment Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Table variant="simple" width="100%">
                <Tbody>
                  <Tr>
                    <Th>Vendor Name</Th>
                    <Td>{selectedPayment.name}</Td>
                  </Tr>
                  <Tr>
                    <Th>LocationType Name</Th>
                    <Td>{selectedPayment.locationtypename}</Td>
                  </Tr>
                  <Tr>
                    <Th>Deposit Payment Date</Th>
                    <Td>
                      {selectedPayment.depositpaymentdate
                        ? format(
                            new Date(selectedPayment.depositpaymentdate),
                            "MM/dd/yyyy HH:mm:ss"
                          )
                        : "N/A"}
                    </Td>
                  </Tr>
                  <Tr>
                    <Th>Deposit</Th>
                    <Td>{selectedPayment.deposit}</Td>
                  </Tr>
                  <Tr>
                    <Th>Total</Th>
                    <Td>{selectedPayment.totalprofit}</Td>
                  </Tr>
                  <Tr>
                    <Th>Status</Th>
                    <Td>
                      <Badge
                        colorScheme={
                          selectedPayment.status === "Success Deposit"
                            ? "green"
                            : "yellow"
                        }
                      >
                        {selectedPayment.status}
                      </Badge>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {qrUrl && (
        <Modal isOpen={isQrModalOpen} onClose={handleCancelQr} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Payment QR Code</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box textAlign="center">
                <img src={qrUrl} alt="QR Code" style={{ margin: "0 auto" }} />
                <Text mt={4} fontSize="md">
                  Amount: {selectedPayment?.deposit} VND
                </Text>
              </Box>
            </ModalBody>
            <ModalFooter>
            <Button
  colorScheme="blue"
  mr={3}
  onClick={() => handleConfirmPayment(selectedPayment.userid, selectedPayment.deposit)}
>
  Confirm
</Button>
              <Button variant="outline" onClick={handleCancelQr}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default TransactionList;
