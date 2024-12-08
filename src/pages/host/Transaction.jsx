// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Text,
//   Badge,
//   Button,
//   Flex,
//   useDisclosure,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalCloseButton,
//   Spinner,
// } from "@chakra-ui/react";
// import { useParams } from "react-router-dom";
// import { getPaymentsByEventId } from "../../shared/host/transactionApi";
// import { format } from "date-fns";

// const TransactionList = () => {
//   const { eventId } = useParams(); // Get eventId from the URL
//   const [payments, setPayments] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const paymentsPerPage = 10; // Number of payments per page
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [selectedPayment, setSelectedPayment] = useState(null);
//   const [loading, setLoading] = useState(true); // Loading state

//   // Fetch payments data from the API
//   useEffect(() => {
//     const fetchPayments = async () => {
//       try {
//         setLoading(true); // Set loading to true before fetching data
//         const data = await getPaymentsByEventId(eventId);
//         if (Array.isArray(data)) {
//           setPayments(data);
//         } else {
//           console.error("API response is not an array:", data);
//         }
//       } catch (error) {
//         console.error("Error fetching payments:", error);
//       } finally {
//         setLoading(false); // Set loading to false after fetching is complete
//       }
//     };

//     fetchPayments();
//   }, [eventId]);

//   const indexOfLastPayment = currentPage * paymentsPerPage;
//   const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
//   const currentPayments = payments.slice(
//     indexOfFirstPayment,
//     indexOfLastPayment
//   );

//   const totalPages = Math.ceil(payments.length / paymentsPerPage);

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };

//   const handleViewDetails = (payment) => {
//     setSelectedPayment(payment);
//     onOpen();
//   };

//   return (
//     <Box p={8} bg="white" borderRadius="md" boxShadow="md">
//       <Text fontSize="3xl" fontWeight="bold" mb={6}>
//         Payment List
//       </Text>

//       {loading ? (
//         // Show loading spinner while data is being fetched
//         <Flex justify="center" align="center" height="200px">
//           <Spinner size="lg" />
//         </Flex>
//       ) : (
//         <>
//           <Table variant="simple">
//             <Thead>
//               <Tr>
//                 <Th textAlign="center">No</Th>
//                 <Th textAlign="center">Vendor Name</Th>
//                 <Th textAlign="center">LocationType Name</Th>
//                 <Th textAlign="center">Deposit</Th>
//                 <Th textAlign="center">Total</Th>
//                 <Th textAlign="center">Status</Th>
//                 <Th textAlign="center">Action</Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {currentPayments.map((payment, index) => (
//                 <Tr key={payment.id}>
//                   <Td textAlign="center">{indexOfFirstPayment + index + 1}</Td>
//                   <Td textAlign="center">{payment.name}</Td>
//                   <Td textAlign="center">{payment.locationtypename}</Td>
//                   <Td textAlign="center">{payment.deposit}</Td>
//                   <Td textAlign="center">{payment.totalprofit}</Td>
//                   <Td textAlign="center">
//                     <Badge
//                       colorScheme={
//                         payment.status === "Success Deposit"
//                           ? "green"
//                           : "yellow"
//                       }
//                     >
//                       {payment.status}
//                     </Badge>
//                   </Td>
//                   <Td textAlign="center">
//                     <Button
//                       colorScheme="blue"
//                       onClick={() => handleViewDetails(payment)}
//                     >
//                       View
//                     </Button>
//                   </Td>
//                 </Tr>
//               ))}
//             </Tbody>
//           </Table>

//           <Flex justify="center" mt={4}>
//             {Array.from({ length: totalPages }, (_, i) => (
//               <Button
//                 key={i}
//                 onClick={() => handlePageChange(i + 1)}
//                 colorScheme={currentPage === i + 1 ? "blue" : "gray"}
//                 mx={1}
//               >
//                 {i + 1}
//               </Button>
//             ))}
//           </Flex>
//         </>
//       )}

//       {selectedPayment && (
//         <Modal isOpen={isOpen} onClose={onClose}>
//           <ModalOverlay />
//           <ModalContent>
//             <ModalHeader>Payment Details</ModalHeader>
//             <ModalCloseButton />
//             <ModalBody>
//               <Table variant="simple" width="100%">
//                 <Tbody>
//                   <Tr>
//                     <Th>Vendor Name</Th>
//                     <Td>{selectedPayment.name}</Td>
//                   </Tr>
//                   <Tr>
//                     <Th>LocationType Name</Th>
//                     <Td>{selectedPayment.locationtypename}</Td>
//                   </Tr>
//                   <Tr>
//                     <Th>Deposit Payment Date</Th>
//                     <Td>
//                       {selectedPayment.depositpaymentdate
//                         ? format(
//                             new Date(selectedPayment.depositpaymentdate),
//                             "MM/dd/yyyy HH:mm:ss"
//                           )
//                         : "N/A"}
//                     </Td>
//                   </Tr>
//                   <Tr>
//                     <Th>Deposit</Th>
//                     <Td>{selectedPayment.deposit}</Td>
//                   </Tr>
//                   <Tr>
//                     <Th>Total Profit</Th>
//                     <Td>{selectedPayment.totalprofit}</Td>
//                   </Tr>
//                   <Tr>
//                     <Th>Profit Percent</Th>
//                     <Td>{selectedPayment.profitpercent} %</Td>
//                   </Tr>
//                   <Tr>
//                     <Th>Profit Payment Date</Th>
//                     <Td>
//                       {selectedPayment.profitpaymentdate
//                         ? format(
//                             new Date(selectedPayment.profitpaymentdate),
//                             "MM/dd/yyyy HH:mm:ss"
//                           )
//                         : "N/A"}
//                     </Td>
//                   </Tr>
//                   <Tr>
//                     <Th>Status</Th>
//                     <Td>
//                       <Badge
//                         colorScheme={
//                           selectedPayment.status === "Success Deposit"
//                             ? "green"
//                             : "yellow"
//                         }
//                       >
//                         {selectedPayment.status}
//                       </Badge>
//                     </Td>
//                   </Tr>
//                 </Tbody>
//               </Table>
//             </ModalBody>
//           </ModalContent>
//         </Modal>
//       )}
//     </Box>
//   );
// };

// export default TransactionList;

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
  ModalCloseButton,
  Spinner,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { getPaymentsByEventId } from "../../shared/host/transactionApi";
import { format } from "date-fns";

const BASE_URL = "https://esmpbe.id.vn/api/event";
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const TransactionList = () => {
  const { eventId } = useParams(); // Get eventId from the URL
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 10; // Number of payments per page
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [eventName, setEventName] = useState(""); // State for storing event name

  // Fetch event name data
  useEffect(() => {
    const fetchEventName = async () => {
      try {
        const response = await fetch(`${BASE_URL}/${eventId}`, {
          headers: {
            Authorization: `${getAccessToken()}`,
          },
        });
        const data = await response.json();
        setEventName(data.name || "Event Details");
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
        const data = await getPaymentsByEventId(eventId);
        if (Array.isArray(data)) {
          setPayments(data);
        } else {
          console.error("API response is not an array:", data);
        }
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

  return (
    <Box p={8} bg="white" borderRadius="md" boxShadow="md">
      <Text fontSize="3xl" fontWeight="bold" mb={6}>
        Payment List -{" "}
        <Text as="span" color="purple.900" fontWeight="bold">
          {eventName}
        </Text>
      </Text>
      {loading ? (
        // Show loading spinner while data is being fetched
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
                    >
                      View
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
        <Modal isOpen={isOpen} onClose={onClose}>
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
    </Box>
  );
};

export default TransactionList;
