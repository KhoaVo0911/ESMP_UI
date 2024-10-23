import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { Card, Row, Col } from "antd";

const URL = "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/event";

const EventDetail = () => {
  const { eventId } = useParams(); // Lấy eventId từ URL
  const location = useLocation();
  const accessToken = location.state?.accessToken || ""; // Lấy accessToken từ state
  const [eventDetail, setEventDetail] = useState(null);

  useEffect(() => {
    // Fetch dữ liệu chi tiết sự kiện từ API
    axios
      .get(`${URL}/${eventId}`, {
        headers: {
          Authorization: `${accessToken}`, // Thêm accessToken vào headers
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setEventDetail(response.data);
      })
      .catch((error) => {
        console.error("Error fetching event detail:", error);
      });
  }, [eventId, accessToken]);

  if (!eventDetail) {
    return <p>Loading...</p>; // Hiển thị loading trong khi chờ dữ liệu
  }

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[40, 20]}>
        <Col span={24}>
          <Card
            title={eventDetail.name}
            cover={<img alt={eventDetail.name} src={eventDetail.logo} />}
          >
            <p><strong>Description:</strong> {eventDetail.description}</p>
            <p><strong>Start Date:</strong> {new Date(eventDetail.startDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {new Date(eventDetail.endDate).toLocaleDateString()}</p>
            <p><strong>Profit:</strong> {eventDetail.profit}</p>
            <p><strong>Status:</strong> {eventDetail.status}</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EventDetail;
