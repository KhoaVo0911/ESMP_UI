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
import "./Event.css";

const { TabPane } = Tabs;

const BASE_URL =
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/event";
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const EventVendor = () => {
  const navigate = useNavigate();
  const hostId = sessionStorage.getItem("hostId") || "";

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
      const fetchedEvents = response.data;

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
    navigate(`/events/${event.eventId}`, {
      state: { eventId: event.eventId },
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

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {filteredEvents.map((event) => (
          <Col span={8} key={event.eventId}>
            <Card
              hoverable
              cover={
                <img
                  alt={event.name}
                  src={event.imageURL}
                  style={{ height: 150, objectFit: "cover" }}
                />
              }
              onClick={() => handleEventClick(event)}
            >
              <Card.Meta
                title={event.name}
                description={
                  <div>
                    <p>
                      <CalendarOutlined />{" "}
                      {`${new Date(event.startDate).toLocaleDateString()} - ${new Date(
                        event.endDate
                      ).toLocaleDateString()}`}
                    </p>
                    <p>
                      <InfoCircleOutlined />{" "}
                      {event.description || "No description provided."}
                    </p>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default EventVendor;
