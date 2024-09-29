import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Divider,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import ArrowBack from "@mui/icons-material/ArrowBack";

const EventDetails = () => {
  const location = useLocation();
  const { event } = location.state || {};
  const [selectedEvent] = useState(event);
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/events", { state: { selectedMenuItem: "2" } });
  };

  const handleViewWebsite = () => {
    navigate("/view-website", { state: { event: selectedEvent } });
  };

  return (
    <Box p={6} bg="white" borderRadius="md" boxShadow="md">
      {/* Header with back button and event name */}
      <Flex align="center" mb={6}>
        <ArrowBack
          onClick={handleBackClick}
          style={{ cursor: "pointer", fontSize: "24px", marginRight: "16px" }}
        />
        <Heading as="h2" size="lg" color="purple.900">
          {selectedEvent?.eventName}
        </Heading>

        {/* View Website Button */}
        <Button ml="auto" colorScheme="purple" onClick={handleViewWebsite}>
          View Website
        </Button>
      </Flex>

      <Divider mb={6} />

      {/* Sử dụng Grid để bố trí các cột ngày và giờ gần nhau hơn */}
      <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={6}>
        <GridItem>
          <Text fontWeight="bold" color="purple.900">
            Start Date:
          </Text>
          <Text>{selectedEvent?.startDate}</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold" color="purple.900">
            End Date:
          </Text>
          <Text>{selectedEvent?.endDate}</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold" color="purple.900">
            Start Time:
          </Text>
          <Text>{selectedEvent?.startTime || "N/A"}</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold" color="purple.900">
            End Time:
          </Text>
          <Text>{selectedEvent?.endTime || "N/A"}</Text>
        </GridItem>
      </Grid>

      {/* Event Description */}
      <Box mb={6}>
        <Text fontWeight="bold" color="purple.900">
          Event Description:
        </Text>
        <Text>{selectedEvent?.description}</Text>
      </Box>

      {/* Event Status */}
      <Box mb={6}>
        <Text fontWeight="bold" color="purple.900">
          Status:
        </Text>
        <Text>{selectedEvent?.status || "Unknown"}</Text>
      </Box>

      <Divider mb={6} />

      {selectedEvent?.image && (
        <Box textAlign="center" mb={6}>
          <Image
            src={selectedEvent.image}
            alt={selectedEvent.eventName}
            borderRadius="md"
            maxW="600px"
            mx="auto"
          />
        </Box>
      )}

      {/* Google Maps Location */}
      <Box mb={6}>
        <Text fontWeight="bold" color="purple.900">
          Location:
        </Text>
        <Box w="100%" h="400px">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps/embed/v1/place?q=FPT+University,+Ho+Chi+Minh+City,+Vietnam&key=YOUR_GOOGLE_MAPS_API_KEY`}
            allowFullScreen
            title="Event Location"
          />
        </Box>
      </Box>

      <Button onClick={handleBackClick} colorScheme="purple" mt={6}>
        Back to Events
      </Button>
    </Box>
  );
};

export default EventDetails;
