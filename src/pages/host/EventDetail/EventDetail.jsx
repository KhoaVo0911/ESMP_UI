import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Button, Typography, Divider, Card } from "antd"; // Use Ant Design components
import ArrowBack from "@mui/icons-material/ArrowBack"; // For back button

const { Title, Text, Paragraph } = Typography;

const EventDetails = () => {
  const location = useLocation();
  const { event } = location.state || {};
  const [selectedEvent] = useState(event);
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/events", { state: { selectedMenuItem: "2" } });
  };

  return (
    <div
      className="event-details-container"
      style={{ padding: "24px", backgroundColor: "#fff", borderRadius: "8px" }}
    >
      {/* Header with back button and event name */}
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}
      >
        <ArrowBack
          onClick={handleBackClick}
          style={{ cursor: "pointer", fontSize: "24px", marginRight: "16px" }}
        />
        <Title
          level={2}
          style={{
            margin: 0,
            color: "#170F49",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {selectedEvent?.eventName}
        </Title>
      </div>

      <Divider />

      {/* Event details section */}
      <Row gutter={[16, 24]} style={{ marginBottom: "24px" }}>
        <Col span={12}>
          <Text
            style={{ fontWeight: "bold", color: "#170F49", fontSize: "16px" }}
          >
            Start Date:
          </Text>
          <Paragraph>{selectedEvent?.startDate}</Paragraph>
        </Col>
        <Col span={12}>
          <Text
            style={{ fontWeight: "bold", color: "#170F49", fontSize: "16px" }}
          >
            End Date:
          </Text>
          <Paragraph>{selectedEvent?.endDate}</Paragraph>
        </Col>
      </Row>

      <Row gutter={[16, 24]} style={{ marginBottom: "24px" }}>
        <Col span={12}>
          <Text
            style={{ fontWeight: "bold", color: "#170F49", fontSize: "16px" }}
          >
            Start Time:
          </Text>
          <Paragraph>{selectedEvent?.startTime || "N/A"}</Paragraph>
        </Col>
        <Col span={12}>
          <Text
            style={{ fontWeight: "bold", color: "#170F49", fontSize: "16px" }}
          >
            End Time:
          </Text>
          <Paragraph>{selectedEvent?.endTime || "N/A"}</Paragraph>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Text
            style={{ fontWeight: "bold", color: "#170F49", fontSize: "16px" }}
          >
            Event Description:
          </Text>
          <Paragraph>{selectedEvent?.description}</Paragraph>
        </Col>
      </Row>

      <Divider />

      {selectedEvent?.image && (
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Card
            hoverable
            cover={
              <img
                src={selectedEvent.image}
                alt={selectedEvent.eventName}
                style={{ maxWidth: "100%", borderRadius: "8px" }}
              />
            }
            style={{
              display: "inline-block",
              width: "100%",
              maxWidth: "600px",
            }}
          />
        </div>
      )}

      <Button
        onClick={handleBackClick}
        style={{
          marginTop: "24px",
          backgroundColor: "#170F49",
          color: "#fff",
          borderRadius: "8px",
        }}
      >
        Back to Events
      </Button>
    </div>
  );
};

export default EventDetails;
