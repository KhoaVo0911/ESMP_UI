import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { Box, Image, Text, Flex, Button } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

const BASE_URL =
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/event";

const EventLocationSlider = () => {
  const [events, setEvents] = useState([]);
  const loc = useLocation();
  const hostId = loc.state?.hostId || sessionStorage.getItem("hostId") || "";
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/host/${hostId}`, {
          headers: { Authorization: sessionStorage.getItem("accessToken") },
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    // Redirect to Booth Plan if needed
    navigate(`/booth-plan/${event.eventId}`, { state: { event } });
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Box>
      <Slider {...settings}>
        {events.map((event) => (
          <Box
            key={event.eventId}
            onClick={() => handleEventClick(event)}
            cursor="pointer"
            p={4}
          >
            <Image
              src={event.imageURL || "https://via.placeholder.com/150"}
              alt={event.name}
              borderRadius="md"
              boxShadow="md"
            />
            <Text fontWeight="bold" mt={2}>
              {event.name}
            </Text>
          </Box>
        ))}
      </Slider>

      {selectedEvent && (
        <Box mt={6} p={4} borderWidth="1px" borderRadius="md" boxShadow="md">
          <Text fontSize="xl" fontWeight="bold">
            {selectedEvent.name}
          </Text>
          <Text mt={2}>Description: {selectedEvent.description}</Text>
          <Flex mt={4} justify="space-between">
            <Button
              colorScheme="blue"
              onClick={() => handleEventClick(selectedEvent)}
            >
              View Booth Plan
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default EventLocationSlider;
