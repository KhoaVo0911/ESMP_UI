
import React, { useEffect, useState, useCallback, useRef } from "react";
import "./Event.css";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Tabs,
  Input,
  Button,
  Row,
  Col,
  Modal,
  Form,
  Upload,
  message,
  DatePicker,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { format } from "date-fns";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../../shared/firebase/firebaseConfig";
import { Box, Grid, GridItem, Image } from "@chakra-ui/react";
import { CalendarIcon, InfoIcon } from "@chakra-ui/icons";

const { TabPane } = Tabs;
const { TextArea } = Input;

const BASE_URL =
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/event";
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const Event = () => {
  const loc = useLocation();
  const navigate = useNavigate();
  const hostId = loc.state?.hostId || sessionStorage.getItem("hostId") || "";

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("0");
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchEvents = useCallback(async () => {
    if (!hostId) {
      console.error("Host ID is missing!");
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

  const filterEvents = useCallback(() => {
    let filtered = events;

    switch (activeTab) {
      case "0":
        filtered = events.filter((event) => event.status === "Upcoming");
        break;
      case "1":
        filtered = events.filter((event) => event.status === "running");
        break;
      case "2":
        filtered = events.filter((event) => event.status === "cancelled");
        break;
      default:
        filtered = events;
    }

    if (searchTerm) {
      filtered = filtered.filter((event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    console.log(filtered, "filter");
    setFilteredEvents(filtered);
  }, [events, activeTab, searchTerm]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    filterEvents();
  }, [filterEvents]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleCreateEvent = async (values) => {
    const { name, description, startDate, endDate, file } = values;

    if (!name || !description || !startDate || !endDate || !file) {
      message.error("Please fill in all fields.");
      return;
    }

    try {
      const newEvent = {
        name,
        hostId,
        themeId: hostId,
        description,
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
        profit: 10.0,
        status: "upcoming",
      };

      const response = await axios.post(BASE_URL, newEvent, {
        headers: { Authorization: getAccessToken() },
      });
      const eventId = response.data.id;

      const imageFile = file[0].originFileObj;
      const imageRef = ref(storage, `${hostId}/${eventId}/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageURL = await getDownloadURL(imageRef);

      fetchEvents();

      message.success("Event created successfully!");
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error creating event:", error);
      message.error("Error creating event.");
    }
  };

  const handleEventClick = (event) => {
    navigate(`/event-detail/${event.eventId}`);
  };

  const uploadProps = {
    beforeUpload: () => false,
  };

  return (
    <div>
      <div className="header-container">
        <h1 className="headername">Events</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Create Event
        </Button>
      </div>

      <Input
        placeholder="Search events"
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={handleSearchChange}
        className="inputsearch"
      />

      <Tabs defaultActiveKey="0" onChange={handleTabChange}>
        <TabPane tab="Up Coming" key="0" />
        <TabPane tab="Running" key="1" />
        <TabPane tab="Cancelled" key="2" />
        <TabPane tab="All" key="3" />
      </Tabs>

      {/* <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Col span={8} key={event.eventId}>
              <div
                className="event-card"
                onClick={() => handleEventClick(event)}
              >
                <img
                  src={event.imageURL}
                  alt={event.name}
                  className="event-card-cover"
                />
                <div className="event-info-container">
                  <h3>{event.name}</h3>
                  <p>
                    Start: {format(new Date(event.startDate), "yyyy-MM-dd")}
                  </p>
                  <p>End: {format(new Date(event.endDate), "yyyy-MM-dd")}</p>
                </div>
              </div>
            </Col>
          ))
        ) : (
          <div>No events found.</div>
        )}
      </Row> */}

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
                      {format(new Date(event.startDate), "yyyy-MM-dd")}
                    </Box>
                    <Box style={{ marginLeft: "60px" }}>
                      <CalendarIcon /> <strong>End Date:</strong>{" "}
                      {format(new Date(event.endDate), "yyyy-MM-dd")}
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

      <Modal
        title="Create Event"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateEvent}>
          <Form.Item
            name="name"
            label="Event Name"
            rules={[
              { required: true, message: "Please enter the event name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: "Please enter the event description!",
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[
                  { required: true, message: "Please select the start date!" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="End Date"
                rules={[
                  { required: true, message: "Please select the end date!" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="file"
            label="Event Thumbnail"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[{ required: true, message: "Please upload a file!" }]}
          >
            <Upload {...uploadProps} listType="picture">
              <Button icon={<PlusOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create Event
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Event;
