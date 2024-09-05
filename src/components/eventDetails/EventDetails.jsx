// import React from "react";
// import { useParams, useLocation } from "react-router-dom";
// import sk1 from "../../assets/images/sk1.png";
// import sk2 from "../../assets/images/sk2.png";
// import sk3 from "../../assets/images/sk3.png";
// import sk4 from "../../assets/images/sk4.png";
// import sk5 from "../../assets/images/sk5.png";
// import sk6 from "../../assets/images/sk6.png";
// import "./EventDetails.scss";

// const imageMap = { sk1, sk2, sk3, sk4, sk5, sk6 };

// const EventDetails = () => {
//   const { id } = useParams();
//   const { state } = useLocation();
//   const event = state?.event;

//   if (!event) {
//     return <div className="flex-center">Event not found</div>;
//   }

//   return (
//     <div className="center-container">
//       <div className="event-details-container">
//         <div className="event-details-content">
//           <div className="event-image-container">
//             <img src={event.image} alt={event.title} className="event-image" />
//           </div>
//           <div className="event-info-container">
//             <h1 className="event-title">{event.title}</h1>
//             <div className="event-dates">
//               <p>
//                 Ngày bắt đầu: <span>{event.startdate}</span>
//               </p>
//               <p>
//                 Ngày kết thúc: <span>{event.enddate || "N/A"}</span>
//               </p>
//             </div>
//             <div className="event-description">
//               <h2>Thông tin sự kiện</h2>
//               <p>{event.description}</p>
//             </div>
//             <button className="create-order-button">TẠO ĐƠN HÀNG</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventDetails;

import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import sk1 from "../../assets/images/sk1.png";
import sk2 from "../../assets/images/sk2.png";
import sk3 from "../../assets/images/sk3.png";
import sk4 from "../../assets/images/sk4.png";
import sk5 from "../../assets/images/sk5.png";
import sk6 from "../../assets/images/sk6.png";
import "./EventDetails.scss";

const imageMap = { sk1, sk2, sk3, sk4, sk5, sk6 };

const EventDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [activeTab, setActiveTab] = useState("details");
  const [isRegistered, setIsRegistered] = useState(false);
  const event = state?.event;

  if (!event) {
    return <div className="flex-center">Event not found</div>;
  }

  const handleRegister = () => {
    setIsRegistered(true);
  };

  return (
    <div className="event-details-page">
      <div className="tab-content">
        {activeTab === "details" && (
          <div className="details-tab">
            <div className="event-image-container">
              <img
                src={event.image}
                alt={event.title}
                className="event-image"
              />
            </div>
            <div className="event-details-container">
              <h1 className="event-title">{event.title}</h1>
              <div className="event-dates">
                <p>
                  Ngày bắt đầu: <span>{event.startdate}</span>
                </p>
                <p>
                  Ngày kết thúc: <span>{event.enddate || "N/A"}</span>
                </p>
              </div>
              <div className="event-description">
                <h2>Thông tin sự kiện</h2>
                <p>{event.description}</p>
              </div>
            </div>
          </div>
        )}
        {activeTab === "register" && (
          <div className="register-tab">
            <h2>Thông tin đăng ký</h2>
            {!isRegistered ? (
              <button className="register-button" onClick={handleRegister}>
                Đăng ký
              </button>
            ) : (
              <button className="create-order-button">TẠO ĐƠN HÀNG</button>
            )}
          </div>
        )}
      </div>
      <div className="tabs-section">
        <div className="tab-bar">
          <button
            className={`tab ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Thông tin chi tiết
          </button>
          <button
            className={`tab ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Thông tin đăng ký
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
