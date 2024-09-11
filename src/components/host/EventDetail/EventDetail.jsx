import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBack from "@mui/icons-material/ArrowBack";

const EventDetails = () => {
  const location = useLocation();
  const { event } = location.state || {};
  const [selectedEvent] = useState(event);
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/events", { state: { selectedMenuItem: "2" } });
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <ArrowBack
          onClick={handleBackClick}
          style={{ cursor: "pointer", fontSize: "24px", marginRight: "10px" }}
        />
        <h2 style={{ margin: 0 }}>{selectedEvent?.eventName}</h2>
      </div>
      <p>
        <strong>Date:</strong> {selectedEvent?.startDate}
      </p>
      <p>
        <strong>Description:</strong> {selectedEvent?.description}
      </p>
      {selectedEvent?.image && (
        <img src={selectedEvent.image} alt={selectedEvent.eventName} />
      )}
    </div>
  );
};

export default EventDetails;
