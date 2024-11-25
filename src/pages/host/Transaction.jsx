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
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { getPaymentsByEventId } from "../../shared/host/transactionApi";
import { format } from "date-fns";

const TransactionList = () => {
  const { eventId } = useParams(); // Lấy eventId từ URL
  // const eventId = "f588ae9e-92cc-4f4b-8a6e-abec52e5f68a"; // Lấy eventId từ URL
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 10; // Số giao dịch trên mỗi trang
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Fetch danh sách payments từ API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getPaymentsByEventId(eventId);
        if (Array.isArray(data)) {
          setPayments(data);
        } else {
          console.error("API response is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
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
        Payment List
      </Text>

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
                    payment.status === "Success Deposit" ? "green" : "yellow"
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

      <Flex justify="center" mt={4}>
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
                    <Th>Total Profit</Th>
                    <Td>{selectedPayment.totalprofit}</Td>
                  </Tr>
                  <Tr>
                    <Th>Profit Percent</Th>
                    <Td>{selectedPayment.profitpercent} %</Td>
                  </Tr>
                  <Tr>
                    <Th>Profit Payment Date</Th>
                    <Td>
                      {selectedPayment.profitpaymentdate
                        ? format(
                            new Date(selectedPayment.profitpaymentdate),
                            "MM/dd/yyyy HH:mm:ss"
                          )
                        : "N/A"}
                    </Td>
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
// } from "@chakra-ui/react";
// import { useLocation, useParams } from "react-router-dom";

// const VendorList = () => {
//   const { eventId } = useParams(); // Lấy eventId từ URL
//   const location = useLocation(); // Lấy state từ navigation
//   const hostId = location.state?.hostId || sessionStorage.getItem("hostId") || ""; // Lấy hostId

//   const [currentPage, setCurrentPage] = useState(1);
//   const vendorsPerPage = 10; // Số vendor trên mỗi trang
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [selectedVendor, setSelectedVendor] = useState(null);
//   const [vendors, setVendors] = useState([]); // Dữ liệu vendor

//   // Fetch data từ API
//   useEffect(() => {
//     const fetchVendors = async () => {
//       try {
//         const response = await fetch(
//           `/api/vendors?hostId=${hostId}&eventId=${eventId}`
//         ); // API giả sử nhận hostId và eventId
//         const data = await response.json();
//         setVendors(data);
//       } catch (error) {
//         console.error("Error fetching vendors:", error);
//       }
//     };

//     if (hostId && eventId) {
//       fetchVendors();
//     }
//   }, [hostId, eventId]);

//   const indexOfLastVendor = currentPage * vendorsPerPage;
//   const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
//   const currentVendors = vendors.slice(indexOfFirstVendor, indexOfLastVendor);

//   const totalPages = Math.ceil(vendors.length / vendorsPerPage);

//   // Xử lý chuyển trang
//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };

//   // Hàm mở popup
//   const handleViewDetails = (vendor) => {
//     setSelectedVendor(vendor);
//     onOpen();
//   };

//   return (
//     <Box p={8} bg="white" borderRadius="md" boxShadow="md">
//       <Text fontSize="3xl" fontWeight="bold" mb={6}>
//         Transaction List
//       </Text>

//       {vendors.length === 0 ? (
//         <Text>No transactions found for this event.</Text>
//       ) : (
//         <>
//           <Table variant="simple">
//             <Thead>
//               <Tr>
//                 <Th>No</Th>
//                 <Th>Vendor Name</Th>
//                 <Th>Deposit</Th>
//                 <Th>Total</Th>
//                 <Th>Status</Th>
//                 <Th>Action</Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {currentVendors.map((vendor, index) => (
//                 <Tr key={vendor.id}>
//                   <Td>{indexOfFirstVendor + index + 1}</Td>
//                   <Td>{vendor.name}</Td>
//                   <Td>{vendor.deposit}</Td>
//                   <Td>{vendor.total}</Td>
//                   <Td>
//                     <Badge
//                       colorScheme={
//                         vendor.status === "Active" ? "green" : "red"
//                       }
//                     >
//                       {vendor.status}
//                     </Badge>
//                   </Td>
//                   <Td>
//                     <Button
//                       colorScheme="blue"
//                       onClick={() => handleViewDetails(vendor)}
//                     >
//                       View
//                     </Button>
//                   </Td>
//                 </Tr>
//               ))}
//             </Tbody>
//           </Table>

//           {/* Pagination */}
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

//       {/* Popup chi tiết */}
//       {selectedVendor && (
//         <Modal isOpen={isOpen} onClose={onClose}>
//           <ModalOverlay />
//           <ModalContent>
//             <ModalHeader>Transaction Details</ModalHeader>
//             <ModalCloseButton />
//             <ModalBody>
//               <Table variant="simple">
//                 <Tbody>
//                   <Tr>
//                     <Th>Vendor Name</Th>
//                     <Td>{selectedVendor.name}</Td>
//                   </Tr>
//                   <Tr>
//                     <Th>LocationType Name</Th>
//                     <Td>Sample Type</Td>
//                   </Tr>
//                   <Tr>
//                     <Th>Deposit Payment Date</Th>
//                     <Td>Sample Date</Td>
//                   </Tr>
//                   <Tr>
//                     <Th>Deposit</Th>
//                     <Td>{selectedVendor.deposit}</Td>
//                   </Tr>
//                   <Tr>
//                     <Th>Total Profit</Th>
//                     <Td>TBD</Td>
//                   </Tr>
//                   <Tr>
//                     <Th>% Profit</Th>
//                     <Td>TBD</Td>
//                   </Tr>
//                   <Tr>
//                     <Th>Profit Payment Date</Th>
//                     <Td>TBD</Td>
//                   </Tr>
//                   <Tr>
//                     <Th>Status</Th>
//                     <Td>{selectedVendor.status}</Td>
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

// export default VendorList;
