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
import { useLocation, useNavigate } from "react-router-dom";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../../../shared/firebase/firebaseConfig";
import { Spinner, Text, VStack } from "@chakra-ui/react";
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
  const navigate = useNavigate(); // Sử dụng useNavigate
  const hostId =
    location.state?.hostId || sessionStorage.getItem("hostId") || "";

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [services, setServices] = useState([]);
  const [loadingEvent, setLoadingEvent] = useState(true);

  const [events, setEvents] = useState([]);

  // Fetch sự kiện từ sessionStorage và set vào state
  useEffect(() => {
    const storedEvent = sessionStorage.getItem("selectedEvent");
    const storedServices = sessionStorage.getItem("eventServices");

    console.log("Stored Event:", storedEvent); // Kiểm tra dữ liệu trong sessionStorage
    console.log("Stored Services:", storedServices);

    if (storedEvent && storedServices) {
      setEvent(JSON.parse(storedEvent));
      setServices(JSON.parse(storedServices));
      setLoadingEvent(false);
    } else {
      setLoadingEvent(false);
      console.error("No event data found in sessionStorage.");
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!hostId) {
        console.error("Host ID is missing!");
        setLoading(false); // Make sure to stop loading if hostId is missing
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
        setLoading(false); // Set loading to false once events are fetched
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false); // Make sure to stop loading on error
      }
    };

    fetchEvents();
  }, [hostId]);

  // Hàm điều hướng khi click vào sự kiện
  // const handleEventClick = (event, services) => {
  //   // Lưu dữ liệu vào sessionStorage
  //   sessionStorage.setItem("selectedEvent", JSON.stringify(event));
  //   sessionStorage.setItem("eventServices", JSON.stringify(services || []));

  //   // Điều hướng đến trang chi tiết sự kiện với state chứa event và services
  //   navigate(`/event-detail/${event.eventId}`, { state: { event, services } });
  // };

  // if (loading || loadingEvent) {
  //   return (
  //     <VStack spacing={4} align="center" p={6}>
  //       <Spinner size="xl" color="blue.500" />
  //       <Text>Loading...</Text>
  //     </VStack>
  //   );
  // }

  const handleEventClick = (info) => {
    const eventId = info.event.extendedProps.eventId;

    if (!eventId) {
      console.error("Event ID is missing in clicked data:", info);
      return; // Không tiếp tục nếu không có `eventId`
    }

    // Fetch chi tiết sự kiện bằng `eventId`
    axios
      .get(`${BASE_URL}/${eventId}`, {
        headers: { Authorization: getAccessToken() },
      })
      .then((response) => {
        const event = response.data;

        // Lưu dữ liệu vào `sessionStorage`
        sessionStorage.setItem("selectedEvent", JSON.stringify(event));

        // Điều hướng đến trang chi tiết sự kiện
        navigate(`/event-detail/${event.eventId}`, { state: { event } });
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
      });
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
        eventClick={handleEventClick} // Cập nhật logic xử lý click
      />
    </div>
  );
};

export default CalendarChart;
