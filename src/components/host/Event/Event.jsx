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
        );
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
        filtered = events.filter(
          (event) => event.details?.status?.toLowerCase() === "on-going"
        );
        break;
      case "2":
        filtered = events.filter(
          (event) => event.details?.status?.toLowerCase() === "running"
        );
        break;
      case "3":
        filtered = events.filter(
          (event) => event.details?.status?.toLowerCase() === "cancelled"
        );
        break;
      case "5":
        filtered = events.filter(
          (event) => event.details?.status?.toLowerCase() === "trash"
        );
        break;
      case "4":
      default:
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
          <h1
            className="headername"
            style={{ fontSize: "22px", fontWeight: "700", color: "#1B2559" }}
          >
            Events
          </h1>
        </div>
        {!selectedEvent && (
          <Button
            type="primary"
            className="create-event-button"
            style={{
              backgroundColor: "#3d7eff",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "14px",
              padding: "8px 16px",
            }}
            onClick={showModal}
          >
            + Create Event
          </Button>
        )}
      </div>

      {!selectedEvent && (
        <>
          <Tabs
            defaultActiveKey="1"
            items={items}
            onChange={handleTabChange}
            style={{
              marginBottom: "24px",
              fontWeight: "700",
              fontSize: "16px",
            }}
          />
          <Input
            placeholder="Search..."
            className="inputsearch"
            suffix={<SearchIcon />}
            value={searchTerm}
            onChange={handleSearch}
            style={{
              borderRadius: "10px",
              height: "32px",
              width: "40%",
              fontWeight: "500",
              fontSize: "14px",
            }}
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
                    <span
                      className="event-date-day"
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#4A90E2",
                      }}
                    >
                      {event.startDate.split(" ")[0]}
                    </span>
                    <span
                      className="event-date-month"
                      style={{ fontSize: "14px", color: "#4A90E2" }}
                    >
                      {event.startDate.split(" ")[1]}
                    </span>
                  </div>
                </div>
                <div className="event-details">
                  <h3
                    className="event-title"
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#002766",
                    }}
                  >
                    {event.eventName}
                  </h3>
                  <p
                    className="event-description"
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#1B2559",
                    }}
                  >
                    {event.description}
                  </p>
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
          <Button
            key="create"
            type="primary"
            onClick={handleCreate}
            style={{ fontWeight: "700", fontSize: "14px" }}
          >
            Create
          </Button>,
          <Button
            key="cancel"
            onClick={handleCancel}
            style={{ fontWeight: "700", fontSize: "14px" }}
          >
            Cancel
          </Button>,
        ]}
      >
        <Divider />
        <div>
          <div>
            <p style={{ fontWeight: "700", fontSize: "14px" }}>Event Name </p>
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
              <p style={{ fontWeight: "700", fontSize: "14px" }}>Start date</p>
              <Input type="date" required style={{ width: "150%" }} />
            </div>
            <div className="date-end">
              <p style={{ fontWeight: "700", fontSize: "14px" }}>End date</p>
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
              <p style={{ fontWeight: "700", fontSize: "14px" }}>Start time</p>
              <Input type="time" required style={{ width: "186%" }} />
            </div>
            <div className="date-time">
              <p style={{ fontWeight: "700", fontSize: "14px" }}>End time</p>
              <Input type="time" required style={{ width: "184%" }} />
            </div>
          </div>

          <div>
            <p style={{ fontWeight: "700", fontSize: "14px" }}>
              Event Description
            </p>
            <Input.TextArea placeholder="Please mention here" />
          </div>
          <div>
            <p style={{ fontWeight: "700", fontSize: "14px" }}>
              Event Thumbnail
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Event;
