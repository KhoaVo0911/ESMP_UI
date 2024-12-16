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
  Select,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { format } from "date-fns";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../../shared/firebase/firebaseConfig";
import { Box, Grid, GridItem, Image } from "@chakra-ui/react";
import { CalendarIcon, InfoIcon } from "@chakra-ui/icons";
import { sendNotification } from "../../../shared/notificationService";
import { Tooltip } from "antd";
import moment from "moment";

const { TabPane } = Tabs;
const { TextArea } = Input;

const BASE_URL = "https://esmpbe.id.vn/api/event";
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
  const [themes, setThemes] = useState([]);
  const [form] = Form.useForm();
  const [canCreateEvent, setCanCreateEvent] = useState(false);

  const [startDate, setStartDate] = useState(null);

  const fetchHostExpireTime = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://esmpbe.id.vn/api/host/${hostId}`,
        {
          headers: { Authorization: getAccessToken() },
        }
      );

      const { expiretime } = response.data;

      const currentTime = new Date();
      const expireDate = new Date(expiretime);
      const isEventCreationAllowed = expireDate > currentTime;
      setCanCreateEvent(isEventCreationAllowed);

      console.log("Host ID:", hostId);
      console.log("Current Time:", currentTime.toISOString());
      console.log("Expire Time:", expireDate.toISOString());
      console.log(`Can create event: ${isEventCreationAllowed ? "YES" : "NO"}`);
    } catch (error) {
      console.error("Error fetching host expiretime:", error);
      message.error("Error fetching host data.");
      setCanCreateEvent(false);
    }
  }, [hostId]);

  useEffect(() => {
    fetchHostExpireTime();
  }, [fetchHostExpireTime]);

  const fetchEvents = useCallback(async () => {
    const cacheBuster = new Date().getTime(); // Tham số ngẫu nhiên để tránh cache
    if (!hostId) {
      console.error("Host ID is missing!");
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/host/${hostId}`, {
        headers: { Authorization: getAccessToken() },
      });
      const fetchedEvents = response.data;

      console.log("Fetched events:", fetchedEvents); // Debug: kiểm tra dữ liệu trả về từ API

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

      console.log("Events with images:", eventsWithImages); // Debug: kiểm tra dữ liệu cuối cùng
      setEvents(eventsWithImages);
    } catch (error) {
      console.error("Error fetching events:", error);
      message.error("Error fetching events.");
    }
  }, [hostId]);

  const filterEvents = useCallback(() => {
    console.log("Current events:", events); // Debug: kiểm tra danh sách events hiện tại

    let filtered = events;

    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    switch (activeTab) {
      case "0": // Upcoming
        filtered = events.filter(
          (event) =>
            new Date(event.startDate) > startOfDay &&
            event.status !== "cancelled"
        );
        break;
      case "1": // Running
        filtered = events.filter(
          (event) =>
            new Date(event.startDate) <= endOfDay &&
            new Date(event.endDate) >= startOfDay &&
            event.status !== "cancelled"
        );
        break;
      case "2": // Cancelled
        filtered = events.filter((event) => event.status === "cancelled");
        break;
      case "3": // Finished
        filtered = events.filter(
          (event) =>
            new Date(event.endDate) < startOfDay && event.status !== "cancelled"
        );
        break;
      default: // All
        filtered = events;
    }

    console.log("Filtered events:", filtered); // Debug: kiểm tra danh sách sau khi lọc
    setFilteredEvents(filtered);
  }, [events, activeTab, searchTerm]);

  useEffect(() => {
    fetchEvents(); // Fetch events initially
  }, [fetchEvents]);

  useEffect(() => {
    filterEvents(); // Re-run filtering whenever events or filters change
  }, [events, activeTab, searchTerm, filterEvents]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleCreateEvent = async (values) => {
    const { name, description, startDate, endDate, file, deposit, themeId } =
      values;

    if (
      !name ||
      !description ||
      !startDate ||
      !endDate ||
      !file ||
      !deposit ||
      !themeId
    ) {
      message.error("Please fill in all fields.");
      return;
    }

    try {
      const startDateUTC = new Date(startDate);
      // startDateUTC.setHours(0, 0, 0, 0);
      startDateUTC.setDate(startDateUTC.getDate() + 1);
      const endDateUTC = new Date(endDate);
      // endDateUTC.setHours(23, 59, 59, 999);
      endDateUTC.setDate(endDateUTC.getDate() + 1);
      const newEvent = {
        name,
        hostId,
        themeId,
        description,
        startDate: startDateUTC.toISOString(),
        endDate: endDateUTC.toISOString(),
        deposit: parseFloat(deposit),
        // status: "upcoming",
      };

      console.log("Payload being sent:", newEvent);

      const response = await axios.post(BASE_URL, newEvent, {
        headers: { Authorization: getAccessToken() },
      });

      const eventId = response.data.id;

      if (!eventId) {
        throw new Error("Event ID is missing in the response");
      }

      const imageFile = file[0].originFileObj;
      const imageRef = ref(storage, `${hostId}/${eventId}/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageURL = await getDownloadURL(imageRef);

      const updatedEvent = {
        ...newEvent,
        eventId,
        imageURL,
      };
      setEvents((prevEvents) => [updatedEvent, ...prevEvents]);

      await fetchEvents();

      message.success("Event created successfully!");

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error creating event:", error);
      message.error(
        `Error: ${error.response?.data?.message || "Something went wrong"}`
      );
    }
  };

  // const handleEventClick = (event, services) => {
  //   sessionStorage.setItem("selectedEvent", JSON.stringify(event));
  //   sessionStorage.setItem("eventServices", JSON.stringify(services || []));
  //   navigate(`/event-detail/${event.eventId}`, { state: { event, services } });
  // };

  const handleEventClick = async (event, services) => {
    // Fetch event details from the server to get the latest status
    try {
      const response = await axios.get(`${BASE_URL}/${event.eventId}`, {
        headers: { Authorization: getAccessToken() },
      });
      const updatedEvent = response.data;

      // Update the events state with the new data
      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev.eventId === updatedEvent.eventId ? updatedEvent : ev
        )
      );

      // Navigate to the event detail page
      sessionStorage.setItem("selectedEvent", JSON.stringify(updatedEvent));
      sessionStorage.setItem("eventServices", JSON.stringify(services || []));
      navigate(`/event-detail/${event.eventId}`, {
        state: { event: updatedEvent, services },
      });
    } catch (error) {
      console.error("Error fetching event details:", error);
      message.error("Unable to fetch the latest event details.");
    }
  };

  const handleEventStatusChange = async (eventId, newStatus) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/${eventId}`,
        { status: newStatus },
        {
          headers: { Authorization: getAccessToken() },
        }
      );

      if (response.status === 200) {
        console.log("Updated event status response:", response.data); // Debug: kiểm tra phản hồi từ API
        message.success("Event status updated successfully!");
        // Refresh the events list after status update
        await fetchEvents();
      } else {
        message.error("Failed to update event status.");
      }
    } catch (error) {
      console.error("Error updating event status:", error);
      message.error("Unable to update event status.");
    }
  };

  const uploadProps = {
    beforeUpload: () => false,
  };

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await axios.get(
          `https://esmpbe.id.vn/api/theme/hostId/${hostId}`,
          {
            headers: { Authorization: getAccessToken() },
          }
        );

        console.log("All Themes:", response.data);

        const activeThemes = response.data.filter((theme) => theme.status);
        console.log("Active Themes:", activeThemes);
        setThemes(activeThemes);
      } catch (error) {
        console.error("Error fetching themes:", error);
        message.error("Error fetching themes.");
      }
    };

    fetchThemes();
  }, [hostId]);

  return (
    <div>
      <div className="header-container">
        <h1 className="headername">Events Management</h1>
        <Tooltip
          title={
            canCreateEvent
              ? ""
              : "Your package has expired, please renew to create an event."
          }
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => canCreateEvent && setModalVisible(true)}
            disabled={!canCreateEvent}
          >
            Create Event
          </Button>
        </Tooltip>
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
        <TabPane tab="Finished" key="3" />
        <TabPane tab="All" key="4" />
      </Tabs>
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
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
          <Box></Box>
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
                <DatePicker
                  style={{ width: "100%" }}
                  disabledDate={(current) => {
                    return current && current < moment().startOf("day");
                  }}
                  onChange={(date) => setStartDate(date)}
                />
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
                <DatePicker
                  style={{ width: "100%" }}
                  disabledDate={(current) => {
                    return (
                      current &&
                      (current < moment().startOf("day") ||
                        (startDate && current < moment(startDate).endOf("day")))
                    );
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="deposit"
            label="Deposit (VND)"
            rules={[
              { required: true, message: "Please enter the deposit amount!" },
            ]}
          >
            <Input type="number" placeholder="Enter deposit amount" />
          </Form.Item>
          <Form.Item
            name="themeId"
            label="Theme of Event"
            rules={[
              {
                required: true,
                message: "Please select a theme for the event!",
              },
            ]}
          >
            <Select placeholder="Select Theme" disabled={themes.length === 0}>
              {themes.length > 0 ? (
                themes.map((theme) => (
                  <Select.Option key={theme.themeId} value={theme.themeId}>
                    {theme.name}
                  </Select.Option>
                ))
              ) : (
                <Select.Option value="none" disabled>
                  No active themes available
                </Select.Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item
            name="file"
            label="Event Thumbnail"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[{ required: true, message: "Please upload a file!" }]}
          >
            <Upload beforeUpload={() => false} listType="picture">
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
