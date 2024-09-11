import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Event.css";
import { Tabs, Input, Button, Card, Row, Col, Modal } from "antd";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Divider } from "@mui/material";

const URL = "https://668e540abf9912d4c92dcd67.mockapi.io/events";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    axios
      .get(URL)
      .then((response) => {
        setEvents(response.data);
        setFilteredEvents(
          response.data.filter(
            (event) => event.details?.status?.toLowerCase() === "on-going"
          )
        ); // Apply filter for 'On-going' when component loads
      })
      .catch((error) => {
        console.error("There was an error fetching the events!", error);
      });
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = events.filter((event) =>
      event.eventName.toLowerCase().includes(term)
    );
    setFilteredEvents(filtered);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);

    let filtered;

    switch (key) {
      case "1":
        // Filter for 'On-going' events
        filtered = events.filter(
          (event) => event.details?.status?.toLowerCase() === "on-going"
        );
        break;
      case "2":
        // Filter for 'Running' events
        filtered = events.filter(
          (event) => event.details?.status?.toLowerCase() === "running"
        );
        break;
      case "3":
        // Filter for 'Cancelled' events
        filtered = events.filter(
          (event) => event.details?.status?.toLowerCase() === "cancelled"
        );
        break;
      case "5":
        // Filter for 'Trash' events
        filtered = events.filter(
          (event) => event.details?.status?.toLowerCase() === "trash"
        );
        break;
      case "4":
      default:
        // Show all events
        filtered = events;
        break;
    }

    setFilteredEvents(filtered);
  };

  const handleBackClick = () => {
    setSelectedEvent(null);
  };

  const handleBackClickTab = (event) => {
    navigate(`/event-detail/${event.id}`, { state: { event } });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreate = () => {
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
      <div className="header-container">
        <div className="header-left">
          {selectedEvent && (
            <ArrowBackIcon
              onClick={handleBackClick}
              className="header-container-button"
              style={{ cursor: "pointer", fontSize: "20px" }}
            />
          )}

          <h1 className="headername">
            <b>Events</b>
          </h1>
        </div>
        {!selectedEvent && (
          <Button
            type="primary"
            className="create-event-button"
            onClick={showModal}
          >
            + Create Event
          </Button>
        )}
      </div>

      {!selectedEvent && (
        <>
          <Tabs defaultActiveKey="1" items={items} onChange={handleTabChange} />
          <Input
            placeholder="Search..."
            className="inputsearch"
            suffix={<SearchIcon />}
            value={searchTerm}
            onChange={handleSearch}
          />
        </>
      )}

      <Row gutter={[40, 20]} style={{ marginTop: "20px" }}>
        {filteredEvents.map((event) => (
          <Col key={event.id} xs={24} sm={12} md={8} lg={8}>
            <Card
              className="event-card"
              hoverable
              onClick={() => handleBackClickTab(event)}
              cover={
                <div className="event-card-cover">
                  <img alt={event.eventName} src={event.image} />
                </div>
              }
            >
              <div className="event-info-container">
                <div className="event-date">
                  <div className="event-date-box">
                    <span className="event-date-day">
                      {event.startDate.split(" ")[0]}
                    </span>
                    <span className="event-date-month">
                      {event.startDate.split(" ")[1]}
                    </span>
                  </div>
                </div>
                <div className="event-details">
                  <h3 className="event-title">{event.eventName}</h3>
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
          <Button key="create" type="primary" onClick={handleCreate}>
            Create
          </Button>,
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
      >
        <Divider />
        <div>
          <div>
            <p>Event Name </p>
            <Input required />
          </div>

          <div
            className="date"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p>Start date</p>
              <Input type="date" required style={{ width: "150%" }} />
            </div>
            <div className="date-end">
              <p>End date</p>
              <Input type="date" required style={{ width: "150%" }} />
            </div>
          </div>

          <div
            className="time"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
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

export default Event;
