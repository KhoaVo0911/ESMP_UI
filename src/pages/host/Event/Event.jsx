import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Event.css";
import {
  Tabs,
  Input,
  Button,
  Card,
  Row,
  Col,
  Modal,
  Divider,
  Typography,
  Form,
  message,
  Upload,
  Space,
} from "antd"; // Import necessary Ant Design components
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { UploadOutlined } from "@ant-design/icons"; // Import icon

const { TextArea } = Input;

const URL = "https://668e540abf9912d4c92dcd67.mockapi.io/events";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [form] = Form.useForm(); // Sử dụng form của Ant Design
  const [thumbnail, setThumbnail] = useState(null); // State cho ảnh thumbnail
  const [fileName, setFileName] = useState(""); // State cho tên file thumbnail
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

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset form khi cancel
    setThumbnail(null); // Clear thumbnail
  };

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        const newEvent = {
          ...values,
          image: thumbnail, // Include thumbnail in the new event object
          id: events.length + 1, // Temporary id for frontend, you might get an id from backend
        };

        axios
          .post(URL, newEvent)
          .then((response) => {
            setEvents((prevEvents) => [...prevEvents, response.data]); // Update the event list
            message.success("Event created successfully!");
            setIsModalVisible(false);
            form.resetFields();
            setThumbnail(null); // Clear thumbnail after submit
          })
          .catch((error) => {
            console.error("Error creating event:", error);
            message.error("Failed to create event. Please try again.");
          });
      })
      .catch((errorInfo) => {
        console.error("Validation failed: ", errorInfo);
      });
  };

  const handleFileChange = (file) => {
    if (
      typeof window !== "undefined" &&
      typeof window.URL.createObjectURL === "function"
    ) {
      if (file.size / 1024 / 1024 < 5) {
        // Kiểm tra kích thước file
        setThumbnail(window.URL.createObjectURL(file)); // Create object URL for the selected file
        setFileName(file.name);
      } else {
        message.error("File size must be smaller than 5MB");
      }
    } else {
      console.error(
        "URL.createObjectURL is not available in this environment."
      );
    }
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
              onClick={() => setSelectedEvent(null)}
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
              onClick={() =>
                navigate(`/event-detail/${event.id}`, { state: { event } })
              }
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
        open={isModalVisible}
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
        <Form layout="vertical" form={form} className="modal-content">
          <Form.Item
            label="Event Name"
            name="eventName"
            rules={[{ required: true, message: "Please enter event name" }]}
          >
            <Input />
          </Form.Item>

          <Space.Compact>
            <Form.Item
              label="Start Date"
              name="startDate"
              rules={[{ required: true, message: "Please select start date" }]}
              style={{ width: "48%" }}
            >
              <Input type="date" />
            </Form.Item>

            <Form.Item
              label="End Date"
              name="endDate"
              rules={[{ required: true, message: "Please select end date" }]}
              style={{ width: "48%" }}
            >
              <Input type="date" />
            </Form.Item>
          </Space.Compact>

          <Space.Compact>
            <Form.Item
              label="Start Time"
              name="startTime"
              rules={[{ required: true, message: "Please select start time" }]}
              style={{ width: "48%" }}
            >
              <Input type="time" />
            </Form.Item>

            <Form.Item
              label="End Time"
              name="endTime"
              rules={[{ required: true, message: "Please select end time" }]}
              style={{ width: "48%" }}
            >
              <Input type="time" />
            </Form.Item>
          </Space.Compact>

          <Form.Item
            label="Event Description"
            name="description"
            rules={[
              { required: true, message: "Please enter event description" },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Event Thumbnail" className="upload-button">
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={(file) => {
                handleFileChange(file);
                return false;
              }}
            >
              {thumbnail ? (
                <div className="thumbnail-preview-container">
                  <img
                    src={thumbnail}
                    alt="thumbnail"
                    className="upload-thumbnail"
                  />
                </div>
              ) : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            <Typography.Text type="secondary">
              File size: Up to 5MB. Optimal dimensions: 600x280px.
            </Typography.Text>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Event;
