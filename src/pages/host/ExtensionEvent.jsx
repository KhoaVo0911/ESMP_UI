import React, { useState, useEffect } from "react";
import { Box, Heading, Divider, Grid, GridItem, Text } from "@chakra-ui/react";
import { useParams, useLocation } from "react-router-dom";
import LocationTypeManagement from "../../components/extensionEvent/LocationTypePage";
import ServiceManagement from "../../components/extensionEvent/ServiceSelection";
import ImageEventManagement from "../../components/extensionEvent/ImageEventManagement";

const BASE_URL = "https://esmpbe.id.vn/api/event";
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const ExtensionEvent = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const hostId =
    location.state?.hostId || sessionStorage.getItem("hostId") || "";

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

  return (
    <Box p={6} bg="gray.50" borderRadius="md" boxShadow="md">
      <Text fontSize="3xl" fontWeight="bold" mb={6}>
        Extension Event -{" "}
        <Text as="span" color="purple.900" fontWeight="bold">
          {eventName}
        </Text>
      </Text>

      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(2, 1fr)"
        gap={4} // Giảm khoảng cách giữa các phần tử
        minHeight="80vh"
        overflow="hidden"
      >
        {/* Image Event Management */}
        <GridItem colSpan={2} minHeight="300px">
          <Box p={4} bg="white" borderRadius="md" boxShadow="sm">
            <Heading size="md" mb={4}>
              Image Event Management
            </Heading>
            <Divider mb={4} />
            <ImageEventManagement eventId={eventId} hostId={hostId} />
          </Box>
        </GridItem>

        {/* Location Type Management */}
        <GridItem>
          <Box p={2} bg="white" borderRadius="md" boxShadow="sm">
            <Heading size="md" mb={4}>
              Location Type Management
            </Heading>
            <Divider mb={4} />
            <LocationTypeManagement eventId={eventId} hostId={hostId} />
          </Box>
        </GridItem>

        {/* Service Management */}
        <GridItem>
          <Box p={4} bg="white" borderRadius="md" boxShadow="sm">
            <Heading size="md" mb={4}>
              Service Support
            </Heading>
            <Divider mb={4} />
            <ServiceManagement eventId={eventId} />
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default ExtensionEvent;
