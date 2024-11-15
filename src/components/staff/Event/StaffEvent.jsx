import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Input, Button, Card, Row, Col, Modal } from "antd";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../shared/firebase/firebaseConfig";
import { Divider } from "@mui/material";

const API_EVENTS = "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/event";
const API_VENDOR_IN_EVENT = "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/vendorinevent";

const EventStaff = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem("accessToken") || ""; // Lấy accessToken từ sessionStorage
  const vendorId = sessionStorage.getItem("vendorId") || ""; // Lấy vendorId từ sessionStorage
  const hostId = sessionStorage.getItem("hostId") || ""; // Lấy hostId từ sessionStorage

  // Hàm fetch dữ liệu sự kiện và lọc theo vendorId và eventId
  const fetchEvents = async () => {
    try {
      console.log("Fetching all events from API...");
      const response = await axios.get(API_EVENTS, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const allEvents = response.data;
      console.log("All events fetched:", allEvents);

      // Kiểm tra từng sự kiện qua API /api/vendorinevent/:vendorId/:eventId
      const eventsWithVendor = await Promise.all(
        allEvents.map(async (event) => {
          const checkUrl = `${API_VENDOR_IN_EVENT}/${vendorId}/${event.eventId}`;
          console.log("Calling API to check vendor in event:", checkUrl);

          try {
            const checkResponse = await axios.get(checkUrl, {
              headers: { Authorization: `${accessToken}` },
            });

            // Kiểm tra phản hồi từ API
            if (checkResponse.data.status === "accept") {
              console.log(`Vendor ${vendorId} accepted in event:`, event.eventId);

              // Tải hình ảnh từ Firebase cho sự kiện
              const imageRef = ref(storage, `${hostId}/${event.eventId}/thumbnail`);
              try {
                event.logo = await getDownloadURL(imageRef);
                console.log("Fetched image for event:", event.eventId, event.logo);
              } catch (error) {
                console.error("Error fetching image for event:", event.eventId, error);
                event.logo = "https://via.placeholder.com/150"; // URL mặc định nếu không có ảnh
              }

              return event; // Trả về sự kiện nếu vendor được chấp nhận
            } else {
              console.log(`Vendor ${vendorId} not accepted in event:`, event.eventId);
              return null;
            }
          } catch (error) {
            console.error(`Error checking vendor in event ${event.eventId}:`, error);
            return null;
          }
        })
      );

      // Lọc ra các sự kiện hợp lệ
      const validEvents = eventsWithVendor.filter((event) => event !== null);
      console.log("Valid events after filtering by vendor:", validEvents);

      setEvents(validEvents);
      setFilteredEvents(validEvents.filter((event) => event.status?.toLowerCase() === "on-going"));
      console.log("Filtered events (on-going):", filteredEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [accessToken]);

  // Tìm kiếm sự kiện
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = events.filter((event) => event.name.toLowerCase().includes(term));
    setFilteredEvents(filtered);
  };

  // Lọc sự kiện theo trạng thái
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
                navigate(`/eventStaff/${event.eventId}`, {
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
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="create" type="primary" onClick={() => setIsModalVisible(false)}>
            Create
          </Button>,
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
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

export default EventStaff;
