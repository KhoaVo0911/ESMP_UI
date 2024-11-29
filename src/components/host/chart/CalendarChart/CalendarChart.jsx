// import React, { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import axios from "axios";
// import "./CalendarChart.css"; // File CSS cho lịch
// import { Tooltip } from "antd"; // Tooltip hiển thị tên sự kiện
// import { useLocation } from "react-router-dom";
// import { ref, getDownloadURL, listAll } from "firebase/storage";
// import { storage } from "../../../../shared/firebase/firebaseConfig";
// import { Text } from "@chakra-ui/react";

// const BASE_URL = "https://esmpbe.id.vn/api/event";
// const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

// const fetchEventImage = async (hostId, eventId) => {
//   const imagesRef = ref(storage, `${hostId}/${eventId}`);
//   try {
//     const imagesList = await listAll(imagesRef);
//     if (imagesList.items.length > 0) {
//       const mainImageRef = imagesList.items[0];
//       const imageURL = await getDownloadURL(mainImageRef);
//       return imageURL;
//     } else {
//       return "https://via.placeholder.com/150"; // Placeholder nếu không có hình ảnh
//     }
//   } catch (error) {
//     console.error(`Error fetching image for event ID: ${eventId}`, error);
//     return "https://via.placeholder.com/150";
//   }
// };

// const CalendarChart = () => {
//   const location = useLocation();
//   const hostId =
//     location.state?.hostId || sessionStorage.getItem("hostId") || "";
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       if (!hostId) {
//         console.error("Host ID is missing!");
//         return;
//       }

//       try {
//         const response = await axios.get(`${BASE_URL}/host/${hostId}`, {
//           headers: { Authorization: getAccessToken() },
//         });

//         // Lấy hình ảnh từ Firebase và chuẩn hóa dữ liệu sự kiện
//         const fetchedEvents = await Promise.all(
//           response.data.map(async (event) => {
//             const imageURL = await fetchEventImage(hostId, event.eventId);
//             return {
//               title: event.name,
//               start: event.startDate,
//               end: event.endDate,
//               extendedProps: {
//                 imageURL: imageURL, // URL của hình ảnh sự kiện
//               },
//             };
//           })
//         );

//         setEvents(fetchedEvents);
//       } catch (error) {
//         console.error("Error fetching events:", error);
//       }
//     };

//     fetchEvents();
//   }, [hostId]);

//   return (
//     <div style={{ margin: "20px" }}>
//       <Text
//         mb={4}
//         fontSize="22px"
//         fontWeight="700"
//         color="var(--chakra-colors-secondaryGray-900)"
//       >
//         Calendar Event
//       </Text>
//       <FullCalendar
//         plugins={[dayGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         events={events}
//         eventContent={(eventInfo) => {
//           const { imageURL, title } = eventInfo.event.extendedProps;
//           return (
//             <Tooltip title={title} placement="top">
//               <div className="event-content">
//                 {imageURL && (
//                   <img
//                     src={imageURL}
//                     alt="Event"
//                     style={{
//                       width: "50px",
//                       height: "50px",
//                       margin: "auto",
//                       borderRadius: "50%",
//                     }}
//                   />
//                 )}
//               </div>
//             </Tooltip>
//           );
//         }}
//       />
//     </div>
//   );
// };

// export default CalendarChart;

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { Tooltip } from "antd";
import { useLocation, useNavigate } from "react-router-dom"; // Thêm useHistory để điều hướng
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../../../shared/firebase/firebaseConfig";
import { Text } from "@chakra-ui/react";
import "./CalendarChart.css"; // File CSS cho lịch

const BASE_URL = "https://esmpbe.id.vn/api/event";
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const fetchEventImage = async (hostId, eventId) => {
  const imagesRef = ref(storage, `${hostId}/${eventId}`);
  try {
    const imagesList = await listAll(imagesRef);
    if (imagesList.items.length > 0) {
      const mainImageRef = imagesList.items[0];
      const imageURL = await getDownloadURL(mainImageRef);
      return imageURL;
    } else {
      return "https://via.placeholder.com/150"; // Placeholder nếu không có hình ảnh
    }
  } catch (error) {
    console.error(`Error fetching image for event ID: ${eventId}`, error);
    return "https://via.placeholder.com/150";
  }
};

const CalendarChart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hostId =
    location.state?.hostId || sessionStorage.getItem("hostId") || "";
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!hostId) {
        console.error("Host ID is missing!");
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/host/${hostId}`, {
          headers: { Authorization: getAccessToken() },
        });

        // Lấy hình ảnh từ Firebase và chuẩn hóa dữ liệu sự kiện
        const fetchedEvents = await Promise.all(
          response.data.map(async (event) => {
            const imageURL = await fetchEventImage(hostId, event.eventId);
            return {
              title: event.name,
              start: event.startDate,
              end: event.endDate,
              eventId: event.eventId, // Thêm eventId vào dữ liệu sự kiện
              extendedProps: {
                imageURL: imageURL, // URL của hình ảnh sự kiện
              },
            };
          })
        );

        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [hostId]);

  // Hàm điều hướng khi click vào sự kiện
  const handleEventClick = (event) => {
    // Lưu dữ liệu vào sessionStorage
    sessionStorage.setItem("selectedEvent", JSON.stringify(event));
    navigate(`/event-detail/${event.eventId}`, { state: { event } });
  };
  return (
    <div className="calendar-container">
      <Text
        mb={4}
        fontSize="22px"
        fontWeight="700"
        color="var(--chakra-colors-secondaryGray-900)"
      >
        Calendar Event
      </Text>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventContent={(eventInfo) => {
          const { imageURL, title } = eventInfo.event.extendedProps;
          return (
            <Tooltip title={title} placement="top">
              <div className="event-content">
                {imageURL && (
                  <img src={imageURL} alt="Event" className="event-image" />
                )}
                <Text className="event-title">{title}</Text>
              </div>
            </Tooltip>
          );
        }}
        eventClick={handleEventClick} // Sự kiện khi click vào một sự kiện
      />
    </div>
  );
};

export default CalendarChart;
