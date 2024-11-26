import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Spin, Empty } from "antd";
import axios from "axios";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../../shared/firebase/firebaseConfig";

const API_EVENTS = "https://esmpbe.id.vn/api/event";
const API_VENDOR_IN_EVENT = "https://esmpbe.id.vn/api/vendorinevent";

const EventStaff = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem("accessToken") || "";
  const vendorId = sessionStorage.getItem("vendorId") || "";
  const hostId = sessionStorage.getItem("hostId") || "";

  // Fetch events and check vendor participation
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch events for the host
      const response = await axios.get(`${API_EVENTS}/host/${hostId}`, {
        headers: { Authorization: accessToken },
      });
      const allEvents = response.data;

      // Filter events to only include those with `onWeb: true`
      const eventsWithImages = await Promise.all(
        allEvents
          .filter(event => event.onWeb) // Filter events with onWeb: true
          .map(async (event) => {
            try {
              const checkUrl = `${API_VENDOR_IN_EVENT}/${vendorId}/${event.eventId}`;
              const checkResponse = await axios.get(checkUrl, {
                headers: { Authorization: accessToken },
              });

              if (checkResponse.data.status === "accept") {
                // Fetch image from Firebase
                const imagesRef = ref(storage, `${hostId}/${event.eventId}`);
                try {
                  const imagesList = await listAll(imagesRef);
                  if (imagesList.items.length > 0) {
                    const mainImageRef = imagesList.items[0]; // Lấy hình ảnh đầu tiên
                    event.logo = await getDownloadURL(mainImageRef);
                  } else {
                    event.logo = "https://via.placeholder.com/150"; // URL mặc định nếu không có ảnh
                  }
                } catch {
                  event.logo = "https://via.placeholder.com/150"; // URL mặc định nếu không có ảnh
                }
                return event; // Return valid event if vendor has accepted the event
              }
              return null; // Exclude events where vendor has not accepted
            } catch (error) {
              console.error("Error checking vendor status:", error);
              return null; // Exclude events on error
            }
          })
      );

      const validEvents = eventsWithImages.filter((event) => event !== null);
      setEvents(validEvents); // Set valid events
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, hostId, vendorId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleEventClick = (event) => {
    navigate(`/eventStaff/${event.eventId}`, {
      state: { eventId: event.eventId, accessToken },
    });
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        Your Events
      </h1>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "auto", padding: "20px" }} />
      ) : error ? (
        <Empty description={error} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : events.length === 0 ? (
        <Empty description="No events found for your vendor." image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <Row gutter={[40, 20]}>
          {events.map((event) => (
            <Col key={event.eventId} xs={24} sm={12} md={8} lg={8}>
              <Card
                hoverable
                cover={
                  <img
                    alt={event.name}
                    src={event.logo}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                }
                onClick={() => handleEventClick(event)}
                style={{ borderRadius: "8px", overflow: "hidden" }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>{event.name}</h3>
                <p style={{ margin: "8px 0" }}>
                  {new Date(event.startDate).toLocaleDateString()} -{" "}
                  {new Date(event.endDate).toLocaleDateString()}
                </p>
                <p style={{ color: "#666" }}>{event.description}</p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default EventStaff;
