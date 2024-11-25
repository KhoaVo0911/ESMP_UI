// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Flex,
//   Heading,
//   Text,
//   Button,
//   Grid,
//   GridItem,
//   Divider,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
// } from "@chakra-ui/react";
// import { format } from "date-fns";
// import ArrowBack from "@mui/icons-material/ArrowBack";
// import MapboxComponent from "../../../components/MapBox/MapboxComponent";

// const EventDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Initialize state
//   const [event, setEvent] = useState(null);
//   const [services, setServices] = useState([]);

//   useEffect(() => {
//     const storedEvent = sessionStorage.getItem("selectedEvent");
//     const storedServices = sessionStorage.getItem("eventServices");

//     if (location.state?.event) {
//       // If data is in location.state
//       setEvent(location.state.event);
//       setServices(location.state.services || []);
//       // Store in sessionStorage for fallback
//       sessionStorage.setItem(
//         "selectedEvent",
//         JSON.stringify(location.state.event)
//       );
//       sessionStorage.setItem(
//         "eventServices",
//         JSON.stringify(location.state.services || [])
//       );
//     } else if (storedEvent && storedServices) {
//       // Fallback to sessionStorage
//       setEvent(JSON.parse(storedEvent));
//       setServices(JSON.parse(storedServices));
//     } else {
//       console.error("No event data found!");
//     }
//   }, [location.state]);

//   const handleBackClick = () => {
//     const hostId =
//       location.state?.hostId ||
//       sessionStorage.getItem("hostId") ||
//       "defaultHostId";
//     navigate(`/events/host/${hostId}`);
//   };

//   const eventId = event?.eventId || sessionStorage.getItem("eventId");
//   const hostId = location.state?.hostId || sessionStorage.getItem("hostId");

//   return (
//     <Box p={6} bg="white" borderRadius="md" boxShadow="md">
//       <Flex align="center" mb={6}>
//         <ArrowBack
//           onClick={handleBackClick}
//           style={{ cursor: "pointer", fontSize: "24px", marginRight: "16px" }}
//         />
//         <Heading as="h2" size="lg" color="purple.900">
//           {event?.eventName || "Event Details"}
//         </Heading>
//       </Flex>

//       <Divider mb={6} />

//       <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={6}>
//         <GridItem>
//           <Text fontWeight="bold" color="purple.900">
//             Start Date:
//           </Text>
//           {event?.startDate
//             ? format(new Date(event.startDate), "yyyy-MM-dd")
//             : "N/A"}
//         </GridItem>
//         <GridItem>
//           <Text fontWeight="bold" color="purple.900">
//             End Date:
//           </Text>
//           {event?.endDate
//             ? format(new Date(event.endDate), "yyyy-MM-dd")
//             : "N/A"}
//         </GridItem>
//       </Grid>

//       <Box mb={6}>
//         <Text fontWeight="bold" color="purple.900">
//           Event Description:
//         </Text>
//         <Text>{event?.description || "No description available."}</Text>
//       </Box>

//       <Box mb={6}>
//         <Text fontWeight="bold" color="purple.900">
//           Status:
//         </Text>
//         <Text>{event?.status || "Unknown"}</Text>
//       </Box>

//       <Box mb={6}>
//         <Text fontWeight="bold" color="purple.900">
//           Services:
//         </Text>
//         {services?.length > 0 ? (
//           <Table variant="simple">
//             <Thead>
//               <Tr>
//                 <Th>Service Name</Th>
//                 <Th>Price</Th>
//                 <Th>Quantity</Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {services.map((service, index) => (
//                 <Tr key={index}>
//                   <Td>{service.name}</Td>
//                   <Td>{service.price}</Td>
//                   <Td>{service.quantity}</Td>
//                 </Tr>
//               ))}
//             </Tbody>
//           </Table>
//         ) : (
//           <Text>No services available.</Text>
//         )}
//       </Box>

//       <Box mb={6}>
//         <Text fontWeight="bold" color="purple.900">
//           Location:
//         </Text>
//         <MapboxComponent
//           eventId={event?.eventId}
//           onSaveCoordinates={(updatedCoordinates) =>
//             setEvent({ ...event, coordinates: updatedCoordinates })
//           }
//         />
//       </Box>

//       <Button onClick={handleBackClick} colorScheme="purple" mt={6}>
//         Back to Events
//       </Button>
//     </Box>
//   );
// };

// export default EventDetails;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Grid,
  GridItem,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Switch,
} from "@chakra-ui/react";
import { format } from "date-fns";
import ArrowBack from "@mui/icons-material/ArrowBack";
import MapboxComponent from "../../../components/MapBox/MapboxComponent";

const BASE_URL =
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/event";
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const EventDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [services, setServices] = useState([]);

  // Load event data from location state or sessionStorage
  useEffect(() => {
    const storedEvent = sessionStorage.getItem("selectedEvent");
    const storedServices = sessionStorage.getItem("eventServices");

    if (location.state?.event) {
      setEvent(location.state.event);
      setServices(location.state.services || []);
      sessionStorage.setItem(
        "selectedEvent",
        JSON.stringify(location.state.event)
      );
      sessionStorage.setItem(
        "eventServices",
        JSON.stringify(location.state.services || [])
      );
    } else if (storedEvent && storedServices) {
      setEvent(JSON.parse(storedEvent));
      setServices(JSON.parse(storedServices));
    } else {
      console.error("No event data found!");
    }
  }, [location.state]);

  // Handle back button click
  const handleBackClick = () => {
    const hostId =
      location.state?.hostId ||
      sessionStorage.getItem("hostId") ||
      "defaultHostId";
    navigate(`/events/host/${hostId}`);
  };

  // Toggle event visibility between public and private
  const toggleEventVisibility = async () => {
    if (!event || !event.eventId) {
      toast({
        title: "Error",
        description: "Event details are missing.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const newVisibility = !event.onWeb; // Đảo ngược trạng thái hiện tại của onWeb
    const profit = event.profit ? parseFloat(event.profit) : 0;

    try {
      const response = await fetch(`${BASE_URL}/${event.eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${getAccessToken()}`,
        },
        // Gửi toàn bộ dữ liệu của sự kiện kèm cập nhật onWeb và profit
        body: JSON.stringify({
          ...event, // Gửi tất cả các trường từ event
          onWeb: !event.onWeb, // Chỉ thay đổi trạng thái onWeb
          profit: event.profit ? parseFloat(event.profit) : 0, // Đảm bảo profit là số
        }),
      });

      if (response.ok) {
        toast({
          title: `Event ${!event.onWeb ? "Published" : "Privatized"}`,
          description: `The event is now ${
            !event.onWeb ? "public" : "private"
          }.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Update event state
        setEvent((prevEvent) => ({
          ...prevEvent,
          onWeb: !prevEvent.onWeb,
        }));
      } else {
        const errorText = await response.text();
        console.error("Failed to update event visibility:", errorText);
        toast({
          title: "Error",
          description: "Failed to update the event visibility.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating event visibility:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the event visibility.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6} bg="white" borderRadius="md" boxShadow="md">
      <Flex align="center" justify="space-between" mb={6}>
        <Flex align="center">
          <ArrowBack
            onClick={handleBackClick}
            style={{ cursor: "pointer", fontSize: "24px", marginRight: "16px" }}
          />
          <Heading as="h2" size="lg" color="purple.900">
            {event?.name || "Event Details"}
          </Heading>
        </Flex>
        <Flex align="center">
          <Text mr={4} fontWeight="bold" color="purple.900">
            {event?.onWeb ? "Public Event" : "Private Event"}
          </Text>
          <Switch
            isChecked={event?.onWeb}
            onChange={toggleEventVisibility}
            colorScheme="blue"
          />
        </Flex>
      </Flex>

      <Divider mb={6} />

      <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={6}>
        <GridItem>
          <Text fontWeight="bold" color="purple.900">
            Start Date:
          </Text>
          {event?.startDate
            ? format(new Date(event.startDate), "yyyy-MM-dd")
            : "N/A"}
        </GridItem>
        <GridItem>
          <Text fontWeight="bold" color="purple.900">
            End Date:
          </Text>
          {event?.endDate
            ? format(new Date(event.endDate), "yyyy-MM-dd")
            : "N/A"}
        </GridItem>
      </Grid>

      <Box mb={6}>
        <Text fontWeight="bold" color="purple.900">
          Event Description:
        </Text>
        <Text>{event?.description || "No description available."}</Text>
      </Box>

      <Box mb={6}>
        <Text fontWeight="bold" color="purple.900">
          Status:
        </Text>
        <Text>{event?.status || "Unknown"}</Text>
      </Box>

      {/* Hiển thị Profit */}
      <Box mb={6}>
        <Text fontWeight="bold" color="purple.900">
          Profit:
        </Text>
        <Text>
          {event?.profit ? `${event.profit}%` : "No profit specified."}
        </Text>
      </Box>

      <Box mb={6}>
        <Text fontWeight="bold" color="purple.900">
          Services:
        </Text>
        {services?.length > 0 ? (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Service Name</Th>
                <Th>Price</Th>
                <Th>Quantity</Th>
              </Tr>
            </Thead>
            <Tbody>
              {services.map((service, index) => (
                <Tr key={index}>
                  <Td>{service.name}</Td>
                  <Td>{service.price}</Td>
                  <Td>{service.quantity}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Text>No services available.</Text>
        )}
      </Box>

      <Box mb={6}>
        <Text fontWeight="bold" color="purple.900" mb={2}>
          Location:
        </Text>
        <MapboxComponent
          eventId={event?.eventId}
          onSaveCoordinates={(updatedCoordinates) =>
            setEvent({ ...event, coordinates: updatedCoordinates })
          }
        />
      </Box>

      <Button onClick={handleBackClick} colorScheme="purple" mt={6}>
        Back to Events
      </Button>
    </Box>
  );
};

export default EventDetails;

// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Flex,
//   Heading,
//   Text,
//   Grid,
//   GridItem,
//   Divider,
//   Button,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   useToast,
//   Switch,
// } from "@chakra-ui/react";
// import { format } from "date-fns";
// import ArrowBack from "@mui/icons-material/ArrowBack";
// import MapboxComponent from "../../../components/MapBox/MapboxComponent";

// const BASE_URL =
//   "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/event";
// const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

// const EventDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const toast = useToast();

//   // State initialization
//   const [event, setEvent] = useState(null);
//   const [services, setServices] = useState([]);

//   // Load data from location state or sessionStorage
//   useEffect(() => {
//     const storedEvent = sessionStorage.getItem("selectedEvent");
//     const storedServices = sessionStorage.getItem("eventServices");

//     if (location.state?.event) {
//       setEvent(location.state.event);
//       setServices(location.state.services || []);
//       sessionStorage.setItem(
//         "selectedEvent",
//         JSON.stringify(location.state.event)
//       );
//       sessionStorage.setItem(
//         "eventServices",
//         JSON.stringify(location.state.services || [])
//       );
//     } else if (storedEvent && storedServices) {
//       setEvent(JSON.parse(storedEvent));
//       setServices(JSON.parse(storedServices));
//     } else {
//       console.error("No event data found!");
//     }
//   }, [location.state]);

//   // Handle back button click
//   const handleBackClick = () => {
//     const hostId =
//       location.state?.hostId ||
//       sessionStorage.getItem("hostId") ||
//       "defaultHostId";
//     navigate(`/events/host/${hostId}`);
//   };

//   // Toggle event visibility (public/private)
//   const toggleEventVisibility = async () => {
//     if (!event || !event.eventId) {
//       toast({
//         title: "Error",
//         description: "Event details are missing.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }

//     const updatedVisibility = !event.onWeb;

//     try {
//       const response = await fetch(`${BASE_URL}/${event.eventId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `${getAccessToken()}`,
//         },
//         body: JSON.stringify({ onWeb: updatedVisibility }),
//       });

//       if (response.ok) {
//         toast({
//           title: `Event ${updatedVisibility ? "Published" : "Unpublished"}`,
//           description: `The event is now ${
//             updatedVisibility ? "Public" : "Private"
//           }.`,
//           status: "success",
//           duration: 3000,
//           isClosable: true,
//         });

//         // Update state with new visibility
//         setEvent({ ...event, onWeb: updatedVisibility });
//       } else {
//         const errorText = await response.text();
//         console.error("Failed to update event visibility:", errorText);
//         toast({
//           title: "Error",
//           description: "Failed to update the event visibility.",
//           status: "error",
//           duration: 3000,
//           isClosable: true,
//         });
//       }
//     } catch (error) {
//       console.error("Error updating event visibility:", error);
//       toast({
//         title: "Error",
//         description: "An error occurred while updating the event visibility.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   return (
//     <Box p={6} bg="white" borderRadius="md" boxShadow="md">
//       <Flex align="center" justify="space-between" mb={6}>
//         <Flex align="center">
//           <ArrowBack
//             onClick={handleBackClick}
//             style={{ cursor: "pointer", fontSize: "24px", marginRight: "16px" }}
//           />
//           <Heading as="h2" size="lg" color="purple.900">
//             {event?.name || "Event Details"}
//           </Heading>
//         </Flex>
// <Flex align="center">
//   <Text mr={4} fontWeight="bold" color="purple.900">
//     {event?.onWeb ? "Public" : "Private"}
//   </Text>
//   <Switch
//     isChecked={event?.onWeb}
//     onChange={toggleEventVisibility}
//     colorScheme="blue"
//   />
// </Flex>
//       </Flex>

//       <Divider mb={6} />

//       <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={6}>
//         <GridItem>
//           <Text fontWeight="bold" color="purple.900">
//             Start Date:
//           </Text>
//           {event?.startDate
//             ? format(new Date(event.startDate), "yyyy-MM-dd")
//             : "N/A"}
//         </GridItem>
//         <GridItem>
//           <Text fontWeight="bold" color="purple.900">
//             End Date:
//           </Text>
//           {event?.endDate
//             ? format(new Date(event.endDate), "yyyy-MM-dd")
//             : "N/A"}
//         </GridItem>
//       </Grid>

//       <Box mb={6}>
//         <Text fontWeight="bold" color="purple.900">
//           Event Description:
//         </Text>
//         <Text>{event?.description || "No description available."}</Text>
//       </Box>

//       <Box mb={6}>
//         <Text fontWeight="bold" color="purple.900">
//           Status:
//         </Text>
//         <Text>{event?.status || "Unknown"}</Text>
//       </Box>

//       <Box mb={6}>
//         <Text fontWeight="bold" color="purple.900">
//           Services:
//         </Text>
//         {services?.length > 0 ? (
//           <Table variant="simple">
//             <Thead>
//               <Tr>
//                 <Th>Service Name</Th>
//                 <Th>Price</Th>
//                 <Th>Quantity</Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {services.map((service, index) => (
//                 <Tr key={index}>
//                   <Td>{service.name}</Td>
//                   <Td>{service.price}</Td>
//                   <Td>{service.quantity}</Td>
//                 </Tr>
//               ))}
//             </Tbody>
//           </Table>
//         ) : (
//           <Text>No services available.</Text>
//         )}
//       </Box>

//       <Box mb={6}>
//         <Text fontWeight="bold" color="purple.900" mb={2}>
//           Location:
//         </Text>
//         <MapboxComponent
//           eventId={event?.eventId}
//           onSaveCoordinates={(updatedCoordinates) =>
//             setEvent({ ...event, coordinates: updatedCoordinates })
//           }
//         />
//       </Box>

//       <Button onClick={handleBackClick} colorScheme="purple" mt={6}>
//         Back to Events
//       </Button>
//     </Box>
//   );
// };

// export default EventDetails;
