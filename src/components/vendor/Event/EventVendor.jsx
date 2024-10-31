import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Event.css";
import { Tabs, Input, Button, Card, Row, Col, Modal } from "antd";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Divider } from "@mui/material";
import { useLocation } from "react-router-dom";

// Cập nhật API URL và có thể sử dụng accessToken từ props
const URL = "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/event";

const EventVendor = ({}) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = location.state?.accessToken || ""; // Kiểm tra nếu accessToken tồn tại
  const vendorId = location.state?.vendorId || ""; 

  const showModal = () => {
    setIsModalVisible(true);
  };

  // Fetch dữ liệu sự kiện từ API với accessToken
  useEffect(() => {
    axios
      .get(URL, {
        headers: {
          Authorization: `${accessToken}`, // Thêm accessToken vào headers
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setEvents(response.data);
        setFilteredEvents(
          response.data.filter(
            (event) => event.status?.toLowerCase() === "on-going"
          )
        );
      })
      .catch((error) => {
        console.error("There was an error fetching the events!", error);
      });
  }, [accessToken]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = events.filter((event) =>
      event.name.toLowerCase().includes(term)
    );
    setFilteredEvents(filtered);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);

    let filtered;

    switch (key) {
      case "1":
        filtered = events.filter(
          (event) => event.status?.toLowerCase() === "on-going"
        );
        break;
      case "2":
        filtered = events.filter(
          (event) => event.status?.toLowerCase() === "running"
        );
        break;
      case "3":
        filtered = events.filter(
          (event) => event.status?.toLowerCase() === "cancelled"
        );
        break;
      case "5":
        filtered = events.filter(
          (event) => event.status?.toLowerCase() === "trash"
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
    navigate("/eventpage");
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
          <Col key={event.eventId} xs={24} sm={12} md={8} lg={8}>
           <Card
  className="event-card"
  hoverable
  onClick={() =>
    navigate(`/events/${event.eventId}`, {
      state: {
        accessToken, vendorId  // Truyền accessToken từ component cha
      },
    })
  }
  cover={
    <div className="event-card-cover">
      <img alt={event.name} src={event.logo} />
    </div>
  }
>
              <div className="event-info-container">
                <div className="event-date">
                  <div className="event-date-box">
                    <span className="event-date-day">
                      {new Date(event.startDate).getDate()}
                    </span>
                    <span className="event-date-month">
                      {new Date(event.startDate).toLocaleString("en", {
                        month: "short",
                      })}
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

export default EventVendor;
