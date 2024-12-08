import React, { useEffect, useState, useCallback } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../shared/firebase/firebaseConfig";
import { Box, Grid, GridItem, Image, Text } from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";

const BASE_URL = "https://esmpbe.id.vn/api/event";
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const UpcomingEvents = () => {
  const navigate = useNavigate();
  const hostId = sessionStorage.getItem("hostId") || "";
  const vendorId = sessionStorage.getItem("vendorId") || "";


  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEvents = useCallback(async () => {
    if (!hostId) {
      message.error("Host ID is missing!");
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/host/${hostId}`, {
        headers: { Authorization: getAccessToken() },
      });
      const fetchedEvents = response.data.filter(
        (event) => event.onWeb && event.status?.toLowerCase() === "upcoming"
      ); // Filter to only "upcoming" events that are on the web

      const eventsWithImages = await Promise.all(
        fetchedEvents.map(async (event) => {
          const imagesRef = ref(storage, `${hostId}/${event.eventId}`);
          try {
            const imagesList = await listAll(imagesRef);
            if (imagesList.items.length > 0) {
              const mainImageRef = imagesList.items[0];
              event.imageURL = await getDownloadURL(mainImageRef);
            } else {
              event.imageURL = "https://via.placeholder.com/150"; // Placeholder if no image
            }
          } catch (error) {
            event.imageURL = "https://via.placeholder.com/150"; // Placeholder if error fetching image
          }
          return event;
        })
      );

      setEvents(eventsWithImages);
    } catch (error) {
      console.error("Error fetching events:", error);
      message.error("Error fetching events.");
    }
  }, [hostId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const filterEvents = () => {
      let filtered = events;

      if (searchTerm) {
        filtered = filtered.filter((event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredEvents(filtered);
    };

    filterEvents();
  }, [events, searchTerm]);

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const handleEventClick = (event) => {
    navigate(`/events/${vendorId}/${event.eventId}`, {
      state: { vendorId: vendorId, eventId: event.eventId },
    });
  };

  return (
    <div className="upcoming-events-container" style={{ width: "110%" }}>
      {/* Search bar */}
     
      <Text
        fontSize="22px"
        fontWeight="700"
        mb={4}
        color="var(--chakra-colors-secondaryGray-900)"
      >
        UPCOMING EVENTS
      </Text>
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)", // 1 column on small screens
          md: "repeat(2, 1fr)", // 2 columns on medium screens
          lg: "repeat(3, 1fr)", // 3 columns on large screens
        }}
        gap={6}
        mt={4}
      >
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <GridItem
              key={event.eventId}
              onClick={() => handleEventClick(event)}
              className="event-card"
              style={{
                maxWidth: "400px", // Increased max width of the card
           
              }}
            >
             
                <Box className="event-card-cover">
                  <Image
                    src={event.imageURL || "https://via.placeholder.com/150"}
                    alt={event.name}
                    className="event-card-image"
                    style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                  />
                </Box>
                <Box className="event-info-container" style={{ marginTop: "16px" }}>
                  <Box className="event-title" style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "8px" }}>
                    {event.name}
                  </Box>
                  <Box className="event-dates" style={{ color: "#555", fontSize: "14px", gap:"10px" }}>
                    <Box>
                      <CalendarIcon /> <strong>Start Date:</strong>{" "}
                      {new Date(event.startDate).toLocaleDateString()}
                    </Box>
                    <Box>
                      <CalendarIcon /> <strong>End Date:</strong>{" "}
                      {new Date(event.endDate).toLocaleDateString()}
                    </Box>
                  </Box>
                </Box>

            </GridItem>
          ))
        ) : (
          <Box>No upcoming events found.</Box>
        )}
      </Grid>
    </div>
  );
};

export default UpcomingEvents;
