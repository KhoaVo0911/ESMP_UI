import { Box, Text, Button, Spinner, Image } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const EventDetail = () => {
  const { eventId } = useParams(); // Get eventId from route parameters
  const navigate = useNavigate();
  const [event, setEvent] = useState(null); // State to store event data
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    // Fetch event details from the correct mockAPI endpoint
    axios
      .get(
        `https://667be23e3c30891b865a6c89.mockapi.io/events/${eventId}/eventDetails`
      )
      .then((response) => {
        const eventData = response.data; // Log the response
        console.log(eventData); // Check the data format

        // If the response is an array, extract the first event
        if (Array.isArray(eventData) && eventData.length > 0) {
          setEvent(eventData[0]); // Set the first event from the array
        } else {
          setEvent(eventData); // If it's not an array, set it directly
        }

        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
        setLoading(false); // Handle error and stop loading
      });
  }, [eventId]);

  // Display spinner while loading
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  // Display message if no event is found
  if (!event) {
    return (
      <Box p={5}>
        <Text fontSize="lg">No event found</Text>
        <Button mt={4} onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>
    );
  }

  return (
    <Box p={5} borderWidth="1px" borderRadius="md" maxW="md" mx="auto">
      {/* Display event details */}
      <Text fontSize="2xl" fontWeight="bold">
        {event.title}
      </Text>
      <Image mt={3} src={event.imageURL} alt={event.title} borderRadius="md" />
      <Text mt={3}>Start Date: {event.startDate}</Text>
      <Text mt={3}>End Date: {event.endDate}</Text>
      <Text mt={3}>Time: {event.time}</Text>

      {/* Back button to navigate to the previous page */}
      <Button mt={4} colorScheme="teal" onClick={() => navigate(-1)}>
        Back
      </Button>
    </Box>
  );
};

export default EventDetail;
