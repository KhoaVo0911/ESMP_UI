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
  Spinner,
} from "@chakra-ui/react";
import { format } from "date-fns";
import ArrowBack from "@mui/icons-material/ArrowBack";
import MapboxComponent from "../../../components/MapBox/MapboxComponent";

const BASE_URL = "https://esmpbe.id.vn/api/event";
const SERVICE_URL = "https://esmpbe.id.vn/api/service"; // Cập nhật đường dẫn service mới
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const EventDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [services, setServices] = useState([]);
  const [theme, setTheme] = useState(null);

  const [loadingEvent, setLoadingEvent] = useState(true); // Loading state for event
  const [loadingServices, setLoadingServices] = useState(true); // Loading state for services
  const [loadingTheme, setLoadingTheme] = useState(true); // Loading state for theme
  const [updatingVisibility, setUpdatingVisibility] = useState(false); // Loading state for toggling visibility

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
      setLoadingEvent(false); // Done loading event
    } else if (storedEvent && storedServices) {
      setEvent(JSON.parse(storedEvent));
      setServices(JSON.parse(storedServices));
      setLoadingEvent(false); // Done loading event
    } else {
      console.error("No event data found!");
    }
  }, [location.state]);

  // Fetch services when event is set
  useEffect(() => {
    const fetchServices = async () => {
      if (event?.eventId) {
        try {
          setLoadingServices(true); // Set loading state for services
          const response = await fetch(`${SERVICE_URL}/${event.eventId}`, {
            headers: {
              Authorization: `${getAccessToken()}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setServices(data); // Save service data
          } else {
            console.error("Failed to fetch services:", await response.text());
            toast({
              title: "Error",
              description: "Failed to load event services.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        } catch (error) {
          console.error("Error fetching services:", error);
          toast({
            title: "Error",
            description: "An error occurred while fetching services.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setLoadingServices(false); // Done loading services
        }
      }
    };

    fetchServices();
  }, [event?.eventId]);

  // Fetch theme when event is set
  useEffect(() => {
    const fetchTheme = async () => {
      if (event?.themeId) {
        try {
          const response = await fetch(
            `https://esmpbe.id.vn/api/theme/${event.themeId}`,
            {
              headers: {
                Authorization: `${getAccessToken()}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setTheme(data); // Save theme data
          } else {
            console.error("Failed to fetch theme:", await response.text());
          }
        } catch (error) {
          console.error("Error fetching theme:", error);
        } finally {
          setLoadingTheme(false); // Done loading theme
        }
      } else {
        setLoadingTheme(false); // No themeId, set loading to false
      }
    };

    fetchTheme();
  }, [event?.themeId]);

  // Handle back button click
  const handleBackClick = () => {
    const hostId =
      location.state?.hostId ||
      sessionStorage.getItem("hostId") ||
      "defaultHostId";
    navigate(`/events/host/${hostId}`);
  };

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

    setUpdatingVisibility(true); // Start updating visibility
    const newVisibility = !event.onWeb; // Toggle the current visibility

    try {
      // Update event visibility
      const response = await fetch(`${BASE_URL}/${event.eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${getAccessToken()}`,
        },
        body: JSON.stringify({
          ...event,
          onWeb: newVisibility,
          deposit: event.deposit ? parseFloat(event.deposit) : 0,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update event visibility:", errorText);
        toast({
          title: "Error",
          description: "Failed to update the event visibility.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setUpdatingVisibility(false); // Stop updating visibility
        return;
      }

      // Show success toast
      toast({
        title: `Event ${newVisibility ? "Published" : "Privatized"}`,
        description: `The event is now ${
          newVisibility ? "public" : "private"
        }.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Update event state with new visibility
      setEvent((prevEvent) => ({
        ...prevEvent,
        onWeb: newVisibility,
      }));
    } catch (error) {
      console.error("Error updating event visibility:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the event visibility.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUpdatingVisibility(false); // Stop updating visibility
    }
  };

  const handleCancelEvent = async () => {
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

    try {
      // Gửi toàn bộ dữ liệu mẫu với status mới
      const updatedEvent = {
        name: event.name,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        deposit: parseFloat(event.deposit),
        status: "cancelled",
        stageValue: event.stageValue,
        coordinates: event.coordinates,
        onWed: event.onWed,
      };

      const response = await fetch(`${BASE_URL}/${event.eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${getAccessToken()}`,
        },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to cancel event:", errorText);
        toast({
          title: "Error",
          description: "Failed to cancel the event.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const data = await response.json();
      console.log("Update event response:", data);

      toast({
        title: "Event Cancelled",
        description: `The event "${event.name}" has been cancelled successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      const hostId =
        location.state?.hostId ||
        sessionStorage.getItem("hostId") ||
        "defaultHostId";
      navigate(`/events/host/${hostId}`);
    } catch (error) {
      console.error("Error cancelling event:", error);
      toast({
        title: "Error",
        description: "An error occurred while cancelling the event.",
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
        <Flex align="center" gap={4}>
          <Button
            colorScheme="red"
            onClick={handleCancelEvent}
            isDisabled={event?.status === "cancelled"}
          >
            Cancel Event
          </Button>
          <Flex align="center">
            <Text mr={4} fontWeight="bold" color="purple.900">
              {event?.onWeb ? "Public Event" : "Private Event"}
            </Text>
            {updatingVisibility ? (
              <Spinner size="sm" />
            ) : (
              <Switch
                isChecked={event?.onWeb}
                onChange={toggleEventVisibility}
                colorScheme="blue"
                isDisabled={updatingVisibility}
              />
            )}
          </Flex>
        </Flex>
      </Flex>

      <Divider mb={6} />

      {loadingEvent ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Spinner size="lg" />
        </Box>
      ) : (
        <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={6}>
          <GridItem>
            <Text fontWeight="bold" color="purple.900" fontSize="lg">
              Start Date:
            </Text>
            {event?.startDate
              ? format(new Date(event.startDate), "yyyy-MM-dd")
              : "N/A"}
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" color="purple.900" fontSize="lg">
              End Date:
            </Text>
            {event?.endDate
              ? format(new Date(event.endDate), "yyyy-MM-dd")
              : "N/A"}
          </GridItem>
        </Grid>
      )}

      <Box mb={6}>
        <Text fontWeight="bold" color="purple.900" fontSize="lg">
          Event Description:
        </Text>
        <Text>{event?.description || "No description available."}</Text>
      </Box>

      {/* <Box mb={6}>
        <Text fontWeight="bold" color="purple.900" fontSize="lg">
          Status:
        </Text>
        <Text
          color={
            event?.status === "upcoming"
              ? "blue.500"
              : event?.status === "running"
              ? "green.500"
              : event?.status === "finished"
              ? "gray.500"
              : "yellow.500"
          }
        >
          {event?.status || "Unknown"}
        </Text>
      </Box> */}

      <Box mb={6}>
        <Text fontWeight="bold" color="purple.900" fontSize="lg">
          Deposit:
        </Text>
        <Text>
          {event?.deposit ? `${event.deposit} VND` : "No deposit specified."}
        </Text>
      </Box>

      <Box mb={6}>
        <Text fontWeight="bold" color="purple.900" fontSize="lg">
          Theme Event:
        </Text>
        {loadingTheme ? (
          <Spinner size="sm" />
        ) : theme ? (
          <Box>
            <Text>{theme.name}</Text>
          </Box>
        ) : (
          <Text>Theme not found.</Text>
        )}
      </Box>

      <Box mb={6}>
        <Text fontWeight="bold" color="purple.900" fontSize="lg">
          Services:
        </Text>
        {loadingServices ? (
          <Spinner size="sm" />
        ) : services.length > 0 ? (
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
        <Text fontWeight="bold" color="purple.900" fontSize="lg">
          Location:
        </Text>
        <MapboxComponent
          eventId={event?.eventId}
          eventData={{
            name: event?.name || "Default Event Name",
            description: event?.description || "Default Event Description",
            startDate: event?.startDate || new Date().toISOString(),
            endDate: event?.endDate || new Date().toISOString(),
            deposit: parseFloat(event?.deposit) || 0, // Ensure deposit is a number
            status: event?.status,
            stageValue: null,
            coordinates: event?.coordinates || "10.8231,106.6297",
            onWeb: event?.onWeb || false,
          }}
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
