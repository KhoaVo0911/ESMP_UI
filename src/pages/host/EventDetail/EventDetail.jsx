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
} from "@chakra-ui/react";
import { format } from "date-fns";
import ArrowBack from "@mui/icons-material/ArrowBack";

const EventDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [event, setEvent] = useState(location.state?.event || null);
  const [services, setServices] = useState(location.state?.services || []);
  const eventId =
    location.state?.event?.eventId || sessionStorage.getItem("eventId");

  useEffect(() => {
    if (!event) {
      const storedEvent = sessionStorage.getItem("selectedEvent");
      const storedServices = sessionStorage.getItem("eventServices");
      if (storedEvent) setEvent(JSON.parse(storedEvent));
      if (storedServices) setServices(JSON.parse(storedServices));
    }
  }, [event]);

  const handleBackClick = () => {
    const hostId =
      location.state?.hostId ||
      sessionStorage.getItem("hostId") ||
      "defaultHostId";
    navigate(`/events/host/${hostId}`);
  };

  return (
    <Box p={6} bg="white" borderRadius="md" boxShadow="md">
      <Flex align="center" mb={6}>
        <ArrowBack
          onClick={handleBackClick}
          style={{ cursor: "pointer", fontSize: "24px", marginRight: "16px" }}
        />
        <Heading as="h2" size="lg" color="purple.900">
          {event?.eventName || "Event Details"}
        </Heading>
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
        {/* <GridItem>
          <Text fontWeight="bold" color="purple.900">
            Start Time:
          </Text>
          <Text>{event?.startTime || "N/A"}</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold" color="purple.900">
            End Time:
          </Text>
          <Text>{event?.endTime || "N/A"}</Text>
        </GridItem> */}
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

      <Box mb={6}>
        <Text fontWeight="bold" color="purple.900">
          Services:
        </Text>
        {services?.length ? (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Service Name</Th>
                <Th>Price</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {services.map((service, index) => (
                <Tr key={index}>
                  <Td>{service.name}</Td>
                  <Td>{service.price}</Td>
                  <Td>{service.status ? "Active" : "Inactive"}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Text>No services available.</Text>
        )}
      </Box>

      <Button onClick={handleBackClick} colorScheme="purple" mt={6}>
        Back to Events
      </Button>
    </Box>
  );
};

export default EventDetails;
