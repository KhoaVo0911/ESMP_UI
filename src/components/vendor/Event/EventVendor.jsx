import React, { useEffect, useState, useCallback } from "react";
import {
  Tabs,
  Input,
  Row,
  Col,
  Card,
  message,
} from "antd";
import { SearchOutlined, CalendarOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../../shared/firebase/firebaseConfig";
import { Box, Grid, GridItem, Image } from "@chakra-ui/react";
import { CalendarIcon, InfoIcon } from "@chakra-ui/icons";
import "./Event.css";

const { TabPane } = Tabs;

const BASE_URL =
  "https://esmpbe.id.vn/api/event";
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const EventVendor = () => {
  const navigate = useNavigate();
  const hostId = sessionStorage.getItem("hostId") || "";
  const vendorId = sessionStorage.getItem("vendorId") || "";

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("0");

  const fetchEvents = useCallback(async () => {
    if (!hostId) {
      message.error("Host ID is missing!");
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/host/${hostId}`, {
        headers: { Authorization: getAccessToken() },
      });
      const fetchedEvents = response.data.filter((event) => event.onWeb); // Chỉ giữ lại sự kiện onWeb = true

      const eventsWithImages = await Promise.all(
        fetchedEvents.map(async (event) => {
          const imagesRef = ref(storage, `${hostId}/${event.eventId}`);
          try {
            const imagesList = await listAll(imagesRef);
            if (imagesList.items.length > 0) {
              const mainImageRef = imagesList.items[0];
              event.imageURL = await getDownloadURL(mainImageRef);
            } else {
              event.imageURL = "https://via.placeholder.com/150";
            }
          } catch (error) {
            event.imageURL = "https://via.placeholder.com/150";
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

      switch (activeTab) {
        case "0":
          filtered = events.filter(
            (event) => event.status?.toLowerCase() === "upcoming"
          );
          break;
        case "1":
          filtered = events.filter(
            (event) => event.status?.toLowerCase() === "running"
          );
          break;
        case "2":
          filtered = events.filter(
            (event) => event.status?.toLowerCase() === "cancelled"
          );
          break;
        default:
          filtered = events;
      }

      if (searchTerm) {
        filtered = filtered.filter((event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredEvents(filtered);
    };

    filterEvents();
  }, [events, activeTab, searchTerm]);

  const handleTabChange = (key) => setActiveTab(key);

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const handleEventClick = (event) => {
    navigate(`/events/${vendorId}/${event.eventId}`, {
      state: { eventId: event.eventId, vendorId, status: event.status},
    });
  };

  return (
    <div className="event-vendor-container">
      <Input
        placeholder="Search events"
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: 16 }}
      />

      <Tabs defaultActiveKey="0" onChange={handleTabChange}>
        <TabPane tab="Up Coming" key="0" />
        <TabPane tab="Running" key="1" />
        <TabPane tab="Cancelled" key="2" />
        <TabPane tab="All" key="3" />
      </Tabs>

      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)", // 1 cột trên màn hình nhỏ
          md: "repeat(2, 1fr)", // 2 cột trên màn hình trung bình
          lg: "repeat(3, 1fr)", // 3 cột trên màn hình lớn
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
            >
              <Box className="event-card-content">
                <Box className="event-card-cover">
                  <Image
                    src={event.imageURL || "https://via.placeholder.com/150"}
                    alt={event.name}
                    className="event-card-image"
                  />
                </Box>
                <Box className="event-info-container">
                  <Box className="event-title">{event.name}</Box>
                  <Box className="event-dates">
                    <Box>
                      <CalendarIcon /> <strong>Start Date:</strong>{" "}
                      {new Date(event.startDate).toLocaleDateString()}
                    </Box>
                    <Box>
                      <CalendarIcon /> <strong>End Date:</strong>{" "}
                      {new Date(event.endDate).toLocaleDateString()}
                    </Box>
                  </Box>
                  <Box className="event-description">
                    <InfoIcon /> <strong>Description:</strong>{" "}
                    {event.description || "No description provided."}
                  </Box>
                </Box>
              </Box>
            </GridItem>
          ))
        ) : (
          <Box>No events found.</Box>
        )}
      </Grid>
    </div>
  );
};

export default EventVendor;
