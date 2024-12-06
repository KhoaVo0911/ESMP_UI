// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Flex,
//   Text,
//   Image,
//   VStack,
//   HStack,
//   Button,
//   Divider,
//   useDisclosure,
//   Spinner,
// } from "@chakra-ui/react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { ref, getDownloadURL, listAll } from "firebase/storage";
// import { storage } from "../../../shared/firebase/firebaseConfig";
// import SelectBooth from "./SelectBooth";

// const BASE_URL = "https://esmpbe.id.vn/api/event";
// const vendorInEventURL = "https://esmpbe.id.vn/api/vendorinevent";

// const EventDetail = () => {
//   const { state } = useLocation(); // Lấy state từ điều hướng
//   const eventId = state?.eventId; // eventId được truyền từ trang trước
//   const accessToken = sessionStorage.getItem("accessToken");
//   const vendorId = sessionStorage.getItem("vendorId");
//   const hostId = sessionStorage.getItem("hostId") || "";

//   const [eventDetail, setEventDetail] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!eventId) {
//       console.error("Missing eventId");
//       navigate("/"); // Nếu thiếu eventId, quay lại trang chính
//       return;
//     }

//     // Kiểm tra vendor đã đăng ký sự kiện chưa
//     const checkVendorInEvent = async () => {
//       try {
//         const response = await axios.get(
//           `${vendorInEventURL}/${vendorId}/${eventId}`,
//           {
//             headers: {
//               Authorization: `${accessToken}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (
//           response.data.eventId === eventId &&
//           response.data.vendorId === vendorId
//         ) {
//           navigate("/eventenrolled", {
//             state: { accessToken, eventId, vendorId },
//           });
//         }
//       } catch (error) {
//         console.warn("Vendor is not registered in the event:", error);
//       }
//     };

//     const fetchEventDetail = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/${eventId}`, {
//           headers: {
//             Authorization: `${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         });
//         const event = response.data;

//         // Lấy hình ảnh từ Firebase
//         try {
//           const imagesRef = ref(storage, `${hostId}/${eventId}`);
//           const imagesList = await listAll(imagesRef);
//           if (imagesList.items.length > 0) {
//             const mainImageRef = imagesList.items[0];
//             event.logo = await getDownloadURL(mainImageRef);
//           } else {
//             event.logo = "https://via.placeholder.com/150";
//           }
//         } catch (error) {
//           console.warn("Error fetching event image:", error);
//           event.logo = "https://via.placeholder.com/150";
//         }

//         setEventDetail(event);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching event details:", error);
//         setLoading(false);
//       }
//     };

//     checkVendorInEvent();
//     fetchEventDetail();
//   }, [eventId, accessToken, vendorId, hostId, navigate]);

//   if (loading) {
//     return (
//       <Flex justifyContent="center" alignItems="center" height="100vh">
//         <Spinner size="xl" color="teal.500" />
//       </Flex>
//     );
//   }

//   if (!eventDetail) {
//     return (
//       <Box p={10} textAlign="center">
//         <Text fontSize="xl" color="gray.500">
//           No event details found
//         </Text>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       padding="40px"
//       bgGradient="linear(to-r, #f0f4f8, #d4f1f4)"
//       minH="100vh"
//     >
//       {/* Chi tiết sự kiện */}
//       <Flex
//         direction={{ base: "column", lg: "row" }}
//         justify="space-between"
//         align="center"
//         bg="white"
//         borderRadius="xl"
//         boxShadow="xl"
//         p="30px"
//         mb="40px"
//         maxW="1200px"
//         mx="auto"
//       >
//         {/* Thông tin sự kiện */}
//         <VStack align="flex-start" spacing={6} maxW="500px">
//           <Text fontSize="3xl" fontWeight="bold" color="teal.700">
//             {eventDetail.name}
//           </Text>
//           <HStack spacing={6}>
//             <Text fontSize="lg" fontWeight="medium" color="gray.600">
//               {new Date(eventDetail.startDate).toLocaleDateString()} -{" "}
//               {new Date(eventDetail.endDate).toLocaleDateString()}
//             </Text>
//           </HStack>
//           <Button
//             colorScheme="teal"
//             size="md"
//             onClick={() =>
//               navigate("/selectbooth", {
//                 state: { eventId, vendorId, accessToken },
//               })
//             }
//           >
//             Register Now
//           </Button>
//         </VStack>

//         {/* Hình ảnh sự kiện */}
//         <Image
//           src={eventDetail.logo}
//           alt={eventDetail.name}
//           borderRadius="lg"
//           boxShadow="md"
//           objectFit="cover"
//           height={{ base: "250px", lg: "300px" }}
//           width={{ base: "100%", lg: "400px" }}
//           mt={{ base: "20px", lg: "0" }}
//         />
//       </Flex>

//       <Divider borderColor="gray.300" borderWidth="1px" mb={10} />

//       {/* Mô tả sự kiện */}
//       <Text
//         fontSize="lg"
//         color="gray.700"
//         mb={8}
//         maxW="900px"
//         mx="auto"
//         textAlign="center"
//       >
//         Welcome to <strong>{eventDetail.name}</strong>, where we come together
//         to celebrate and immerse ourselves in a unique experience. This event
//         promises to bring you and your family a culturally rich and meaningful
//         experience, filled with excitement and warmth.
//       </Text>

//       {/* Component SelectBooth */}
//       <Box></Box>
//     </Box>
//   );
// };

// export default EventDetail;

import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Image,
  VStack,
  HStack,
  Button,
  Divider,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../../shared/firebase/firebaseConfig";
import { Pagination } from "antd";

const BASE_URL = "https://esmpbe.id.vn/api/event";
const LOCATION_TYPE_URL = "https://esmpbe.id.vn/api/map/locationType";
const SERVICE_URL = "https://esmpbe.id.vn/api/service";
const vendorInEventURL = "https://esmpbe.id.vn/api/vendorinevent";

const EventDetail = () => {
  const { state } = useLocation();
  const eventId = state?.eventId;
  const accessToken = sessionStorage.getItem("accessToken");
  const vendorId = sessionStorage.getItem("vendorId");
  const hostId = sessionStorage.getItem("hostId") || "";

  const [eventDetail, setEventDetail] = useState(null);
  const [boothData, setBoothData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationTypeColors, setLocationTypeColors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // Number of items per page
  const navigate = useNavigate();

  useEffect(() => {
    if (!eventId) {
      console.error("Missing eventId");
      navigate("/");
      return;
    }
    const checkVendorInEvent = async () => {
      try {
        const response = await axios.get(
          `${vendorInEventURL}/${vendorId}/${eventId}`,
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const vendorinEventId = response.data.vendorinEventId;
        console.log(vendorinEventId);
    
        if (
          response.data.eventId === eventId &&
          response.data.vendorId === vendorId &&
          (response.data.status === "accept" || response.data.status === "finished")
        ) {
          // Lấy vendorInEventId từ response
          
          console.log("Cax", vendorinEventId )
    
          // Thực hiện điều hướng và truyền vendorInEventId vào state
          navigate(`/eventenrolled/${vendorId}/${eventId}`, {
            state: { 
              accessToken, 
              eventId, 
              vendorId, 
              vendorinEventId  // Thêm vendorInEventId vào state
            },
          });
        }
      } catch (error) {
        console.warn("Vendor is not registered in the event:", error);
      }
    };
    
    

    const fetchEventDetail = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/${eventId}`, {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const event = response.data;

        try {
          const imagesRef = ref(storage, `${hostId}/${eventId}`);
          const imagesList = await listAll(imagesRef);
          if (imagesList.items.length > 0) {
            const mainImageRef = imagesList.items[0];
            event.logo = await getDownloadURL(mainImageRef);
          } else {
            event.logo = "https://via.placeholder.com/150";
          }
        } catch (error) {
          console.warn("Error fetching event image:", error);
          event.logo = "https://via.placeholder.com/150";
        }

        setEventDetail(event);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setLoading(false);
      }
    };

    const fetchBoothData = async () => {
      try {
        const response = await axios.get(
          `${LOCATION_TYPE_URL}/${hostId}/${eventId}`,
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setBoothData(response.data);
      } catch (error) {
        console.error("Error fetching booth data:", error);
      }
    };

    const fetchLocationTypeColors = async () => {
      try {
        const response = await axios.get(
          `${LOCATION_TYPE_URL}/${hostId}/${eventId}`,
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        // Assuming each location type has a color property
        const colors = response.data.reduce((acc, item) => {
          acc[item.typeId] = item.color; // Store color by typeId
          return acc;
        }, {});
        setLocationTypeColors(colors);
      } catch (error) {
        console.error("Error fetching location type colors:", error);
      }
    };

    const fetchServiceData = async () => {
      try {
        const response = await axios.get(`${SERVICE_URL}/${eventId}`, {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setServiceData(response.data);
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };

    checkVendorInEvent();
    fetchEventDetail();
    fetchBoothData();
    fetchServiceData();
    fetchLocationTypeColors();
  }, [eventId, accessToken, vendorId, hostId, navigate]);

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  if (!eventDetail) {
    return (
      <Box p={10} textAlign="center">
        <Text fontSize="xl" color="gray.500">
          No event details found
        </Text>
      </Box>
    );
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedBoothData = boothData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const paginatedServiceData = serviceData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Box
      padding="20px"
      bg="white"
      borderRadius="md"
      boxShadow="md"
      minH="100vh"
    >
      <Flex
        direction={{ base: "column", lg: "row" }}
        justify="space-between"
        align="center"
        bg="white"
        borderRadius="xl"
        boxShadow="xl"
        p="30px"
        mb="40px"
        maxW="1200px"
        mx="auto"
      >
        <VStack align="flex-start" spacing={6} maxW="500px">
          <Text fontSize="3xl" fontWeight="bold" color="purple.900">
            {eventDetail.name}
          </Text>
          <HStack spacing={6}>
            <Text fontSize="lg" fontWeight="medium" color="purple.900">
              {new Date(eventDetail.startDate).toLocaleDateString()} -{" "}
              {new Date(eventDetail.endDate).toLocaleDateString()}
            </Text>
          </HStack>
          <Button
            colorScheme="blue"
            size="md"
            onClick={() =>
              navigate(`/selectbooth/${vendorId}`, {
                state: { eventId, vendorId, accessToken},
              })
            }
          >
            Register Now
          </Button>
        </VStack>
        <Image
          src={eventDetail.logo}
          alt={eventDetail.name}
          borderRadius="lg"
          boxShadow="md"
          objectFit="cover"
          height={{ base: "250px", lg: "300px" }}
          width={{ base: "100%", lg: "400px" }}
          mt={{ base: "20px", lg: "0" }}
        />
      </Flex>

      <Divider borderColor="gray.300" borderWidth="1px" mb={10} />
      <Text fontSize="2xl" fontWeight="bold" color="black" mb={4}>
        Event Information
      </Text>
      <Text fontSize="large" color="gray.600" mb={10}>
        {eventDetail.description}
      </Text>
      <Divider borderColor="gray.300" borderWidth="1px" mb={10} />

      <Text fontSize="2xl" fontWeight="bold" color="black" mb={4}>
        Booth List
      </Text>
      <Box overflowX="auto" mb={10}>
        <Table variant="simple" size="lg" color="black">
          <Thead bg="gray.100">
            <Tr>
              <Th textAlign="center">No</Th>
              <Th textAlign="center">Location Type Name</Th>
              <Th textAlign="center">Price</Th>
              <Th textAlign="center">Color</Th>
              <Th textAlign="center">Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedBoothData.map((booth, index) => (
              <Tr key={index}>
                <Td textAlign="center">
                  {(currentPage - 1) * pageSize + index + 1}
                </Td>
                <Td textAlign="center">{booth.typeName}</Td>
                <Td textAlign="center">{booth.price}</Td>
                <Td textAlign="center">
                  <Box
                    bg={locationTypeColors[booth.typeId] || "white"}
                    width="20px"
                    height="20px"
                    borderRadius="50%"
                    border="1px solid #000"
                    margin="0 auto"
                  />
                </Td>
                <Td textAlign="center">{booth.status}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Flex justifyContent="flex-end" mb={10}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={boothData.length}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </Flex>

      <Divider borderColor="gray.300" borderWidth="1px" mb={10} />

      <Text fontSize="2xl" fontWeight="bold" color="black" mb={4}>
        Service List
      </Text>
      <Box overflowX="auto">
        <Table variant="simple" size="lg" color="black" mb={5}>
          <Thead bg="gray.100">
            <Tr>
              <Th textAlign="center">No</Th>
              <Th textAlign="center">Service ID</Th>
              <Th textAlign="center">Service Name</Th>
              <Th textAlign="center">Price</Th>
              <Th textAlign="center">Quantity</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedServiceData.map((service, index) => (
              <Tr key={index}>
                <Td textAlign="center">
                  {(currentPage - 1) * pageSize + index + 1}
                </Td>
                <Td textAlign="center">{service.serviceId}</Td>
                <Td textAlign="center">{service.name}</Td>
                <Td textAlign="center">{service.price}</Td>
                <Td textAlign="center">{service.quantity}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Flex justifyContent="flex-end" mb={10}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={serviceData.length}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </Flex>
      <Divider borderColor="gray.300" borderWidth="1px" mb={10} />

      <Text fontSize="2xl" fontWeight="bold" color="black" mb={4}>
        Location
      </Text>
      <Box width="100%" height="300px" mb={10}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6100105370224!2d106.8073080746704!3d10.84112758931162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2sFPT%20University%20HCMC!5e0!3m2!1sen!2s!4v1726308048313!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="FPT University HCMC Map"
        />
      </Box>
    </Box>
  );
};

export default EventDetail;
