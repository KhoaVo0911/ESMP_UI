import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Event.css";
import { Tabs, Input, Button, Card, Row, Col, Modal } from "antd";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../shared/firebase/firebaseConfig";
import { Divider } from "@mui/material";

const URL = "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/event";

const EventVendor = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem("accessToken") || ""; // Lấy accessToken từ sessionStorage
  const hostId = sessionStorage.getItem("hostId") || ""; // Lấy hostId từ sessionStorage

  const fetchEvents = async () => {
    try {
      const response = await axios.get(URL, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const eventsWithImages = await Promise.all(
        response.data.map(async (event) => {
          const imageRef = ref(storage, `${hostId}/${event.eventId}/thumbnail`);
          try {
            event.logo = await getDownloadURL(imageRef);
          } catch (error) {
            console.error("Error fetching event image:", error);
            event.logo = "https://via.placeholder.com/150"; // URL mặc định nếu không có ảnh
          }
          return event;
        })
      );

      setEvents(eventsWithImages);
      setFilteredEvents(eventsWithImages.filter((event) => event.status?.toLowerCase() === "on-going"));
    } catch (error) {
      console.error("There was an error fetching the events!", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [accessToken]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = events.filter((event) => event.name.toLowerCase().includes(term));
    setFilteredEvents(filtered);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    let filtered;
    switch (key) {
      case "1":
        filtered = events.filter((event) => event.status?.toLowerCase() === "on-going");
        break;
      case "2":
        filtered = events.filter((event) => event.status?.toLowerCase() === "running");
        break;
      case "3":
        filtered = events.filter((event) => event.status?.toLowerCase() === "cancelled");
        break;
      case "5":
        filtered = events.filter((event) => event.status?.toLowerCase() === "trash");
        break;
      case "4":
      default:
        filtered = events;
        break;
    }
    setFilteredEvents(filtered);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const items = [
    { key: "1", label: "On-going" },
    { key: "2", label: "Running" },
    { key: "3", label: "Cancelled" },
    { key: "4", label: "All" },
    { key: "5", label: "Trash" },
  ];

  return (
    <>
      <Tabs defaultActiveKey="1" items={items} onChange={handleTabChange} />
      <Input
        placeholder="Search..."
        className="inputsearch"
        suffix={<SearchIcon />}
        value={searchTerm}
        onChange={handleSearch}
      />

      <Row gutter={[40, 20]} style={{ marginTop: "20px" }}>
        {filteredEvents.map((event) => (
          <Col key={event.eventId} xs={24} sm={12} md={8} lg={8}>
            <Card
              className="event-card"
              hoverable
              onClick={() => {
                sessionStorage.setItem("eventId", event.eventId);
                navigate(`/events/${event.eventId}`, {
                  state: { accessToken, hostId },
                });
              }}
              cover={
                <div className="event-card-cover">
                  <img alt={event.name} src={event.logo} />
                </div>
              }
            >
              <div className="event-info-container">
                <div className="event-date">
                  <div className="event-date-box">
                    <span className="event-date-day">{new Date(event.startDate).getDate()}</span>
                    <span className="event-date-month">
                      {new Date(event.startDate).toLocaleString("en", { month: "short" })}
                    </span>
                  </div>
                </div>
                <div className="event-details">
                  <h3 className="event-title">{event.name}</h3>
                  <p className="event-description">{event.description}</p>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="Create Event"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="create" type="primary" onClick={() => setIsModalVisible(false)}>
            Create
          </Button>,
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
      >
        <Divider />
        <div>
          <p>Event Name </p>
          <Input required />

          <div className="date" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p>Start date</p>
              <Input type="date" required style={{ width: "150%" }} />
            </div>
            <div className="date-end">
              <p>End date</p>
              <Input type="date" required style={{ width: "150%" }} />
            </div>
          </div>

          <div className="time" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p>Start time</p>
              <Input type="time" required style={{ width: "186%" }} />
            </div>
            <div className="date-time">
              <p>End time</p>
              <Input type="time" required style={{ width: "184%" }} />
            </div>
          </div>

          <div>
            <p>Event Description</p>
            <Input.TextArea placeholder="Please mention here" />
          </div>
          <div>
            <p>Event Thumbnail</p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EventVendor;
