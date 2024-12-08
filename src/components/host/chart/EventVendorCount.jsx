// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import ReactECharts from "echarts-for-react";
// import { useNavigate } from "react-router-dom";

// const EventVendorCount = ({ hostId }) => {
//   const [eventData, setEventData] = useState([]); // Lưu trữ dữ liệu sự kiện
//   const [vendorUsernames, setVendorUsernames] = useState({}); // Lưu trữ thông tin username của các vendor
//   const [eventNames, setEventNames] = useState({}); // Lưu trữ tên sự kiện theo eventId
//   const navigate = useNavigate(); // Dùng useNavigate để điều hướng

//   useEffect(() => {
//     // Fetch dữ liệu từ API về số lượng vendor trong sự kiện
//     axios
//       .get(`https://esmpbe.id.vn/api/vendorinevent/countevents/${hostId}`)
//       .then((response) => {
//         const vendorEvents = response.data.eventCount;

//         // Group dữ liệu theo eventId và đếm số vendor cho mỗi sự kiện
//         const eventCounts = vendorEvents.reduce((acc, event) => {
//           const { eventId, vendorId } = event;
//           if (!acc[eventId]) {
//             acc[eventId] = { vendorIds: new Set() }; // Dùng Set để đảm bảo các vendor là duy nhất
//           }

//           // Thêm vendorId vào Set
//           acc[eventId].vendorIds.add(vendorId);

//           return acc;
//         }, {});

//         // Chuyển đổi dữ liệu thành định dạng phù hợp cho chart
//         const formattedEventData = Object.keys(eventCounts).map((eventId) => ({
//           eventId, // Lưu eventId để tìm tên sự kiện sau
//           vendorCount: eventCounts[eventId].vendorIds.size, // Số lượng vendor
//           vendorIds: Array.from(eventCounts[eventId].vendorIds),
//         }));

//         setEventData(formattedEventData);

//         // Lấy danh sách tất cả các eventId duy nhất
//         const eventIds = Object.keys(eventCounts);

//         // Fetch tên các sự kiện
//         const eventRequests = eventIds.map((eventId) =>
//           axios.get(`https://esmpbe.id.vn/api/event/${eventId}`)
//         );

//         // Fetch tất cả tên sự kiện một lần
//         Promise.all(eventRequests)
//           .then((responses) => {
//             const newEventNames = responses.reduce((acc, response) => {
//               const event = response.data;
//               acc[event.eventId] = event.name; // Lưu tên sự kiện theo eventId
//               return acc;
//             }, {});

//             setEventNames(newEventNames); // Cập nhật tên các sự kiện
//           })
//           .catch((error) => {
//             console.error("Error fetching event names:", error);
//           });
//       })
//       .catch((error) => {
//         console.error("Error fetching vendor events:", error);
//       });
//   }, [hostId]);

//   // Prepare chart options
//   const getChartOptions = () => {
//     return {
//       title: {
//         text: "Events with Most Vendors",
//         left: "center",
//         top: "20",
//         textStyle: {
//           fontSize: 18,
//           color: "#1B2559",
//           fontWeight: "bold",
//         },
//       },
//       tooltip: {
//         trigger: "axis",
//         axisPointer: {
//           type: "shadow",
//         },
//         formatter: (params) => {
//           const event = params[0];
//           const eventId = event.eventId; // Lấy eventId chính xác
//           const vendorCount = event.value; // Số lượng vendor từ giá trị cột

//           const eventName = eventNames[eventId] || "Unknown Event"; // Lấy tên sự kiện từ eventNames

//           const eventDataItem = eventData.find(
//             (data) => data.eventId === eventId
//           );
//           const vendorList = eventDataItem
//             ? eventDataItem.vendorIds // Trả về mảng vendorIds thay vì join
//             : ["No Vendors Available"]; // Nếu không có vendor thì hiển thị mảng "No Vendors Available"

//           return `

//             Number of Vendors: ${vendorCount}<br />

//           `;
//         },
//       },
//       grid: {
//         left: "3%",
//         right: "4%",
//         bottom: "3%",
//         containLabel: true,
//       },
//       xAxis: {
//         type: "category",
//         data: eventData.map(
//           (data) => eventNames[data.eventId] || "Unknown Event"
//         ), // Sử dụng tên sự kiện từ eventNames
//         axisLabel: {
//           interval: 0,
//           rotate: 45, // Xoay label để dễ đọc
//         },
//       },
//       yAxis: {
//         type: "value",
//       },
//       series: [
//         {
//           name: "Number of Vendors",
//           type: "bar",
//           data: eventData.map((data) => data.vendorCount),
//           itemStyle: {
//             color: "#8884d8",
//           },
//         },
//       ],
//     };
//   };

//   // Xử lý khi người dùng click vào event
//   const handleEventClick = (eventId) => {
//     // Lưu eventId vào sessionStorage
//     sessionStorage.setItem("selectedEventId", eventId);

//     // Điều hướng tới trang chi tiết sự kiện
//     navigate(`/event-details/${eventId}`);
//   };

//   return (
//     <div style={{ width: "100%", height: "400px", marginTop: "20px" }}>
//       <h2>Events with the Most Vendors</h2>
//       <ReactECharts
//         option={getChartOptions()}
//         style={{ height: "100%", width: "100%" }}
//         // Lắng nghe sự kiện click trên biểu đồ
//         onEvents={{
//           click: (e) => handleEventClick(e.data.eventId), // Lấy eventId khi người dùng click
//         }}
//       />
//     </div>
//   );
// };

// export default EventVendorCount;

import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactECharts from "echarts-for-react";
import { useNavigate } from "react-router-dom";

const EventVendorCount = ({ hostId }) => {
  const [eventData, setEventData] = useState([]); // Lưu trữ dữ liệu sự kiện
  const [vendorUsernames, setVendorUsernames] = useState({}); // Lưu trữ thông tin username của các vendor
  const [eventNames, setEventNames] = useState({}); // Lưu trữ tên sự kiện theo eventId
  const navigate = useNavigate(); // Dùng useNavigate để điều hướng

  useEffect(() => {
    // Fetch dữ liệu từ API về số lượng vendor trong sự kiện
    axios
      .get(`https://esmpbe.id.vn/api/vendorinevent/countevents/${hostId}`)
      .then((response) => {
        const vendorEvents = response.data.eventCount;

        // Group dữ liệu theo eventId và đếm số vendor cho mỗi sự kiện
        const eventCounts = vendorEvents.reduce((acc, event) => {
          const { eventId, vendorId } = event;
          if (!acc[eventId]) {
            acc[eventId] = { vendorIds: new Set() }; // Dùng Set để đảm bảo các vendor là duy nhất
          }

          // Thêm vendorId vào Set
          acc[eventId].vendorIds.add(vendorId);

          return acc;
        }, {});

        // Chuyển đổi dữ liệu thành định dạng phù hợp cho chart
        const formattedEventData = Object.keys(eventCounts).map((eventId) => ({
          eventId, // Lưu eventId để tìm tên sự kiện sau
          vendorCount: eventCounts[eventId].vendorIds.size, // Số lượng vendor
          vendorIds: Array.from(eventCounts[eventId].vendorIds),
        }));

        setEventData(formattedEventData);

        // Lấy danh sách tất cả các eventId duy nhất
        const eventIds = Object.keys(eventCounts);

        // Fetch tên các sự kiện từ API
        const eventRequests = eventIds.map((eventId) =>
          axios.get(`https://esmpbe.id.vn/api/event/${eventId}`)
        );

        // Fetch tất cả tên sự kiện một lần
        Promise.all(eventRequests)
          .then((responses) => {
            const newEventNames = responses.reduce((acc, response) => {
              const event = response.data;
              acc[event.eventId] = event.name; // Lưu tên sự kiện theo eventId
              return acc;
            }, {});

            setEventNames(newEventNames); // Cập nhật tên các sự kiện
          })
          .catch((error) => {
            console.error("Error fetching event names:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching vendor events:", error);
      });
  }, [hostId]);

  // Prepare chart options
  const getChartOptions = () => {
    return {
      title: {
        text: "Events with Most Vendors",
        left: "center",
        top: "20",
        textStyle: {
          fontSize: 18,
          color: "#1B2559",
          fontWeight: "bold",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (params) => {
          const event = params[0];
          const eventId = event.eventId; // Lấy eventId chính xác
          const vendorCount = event.value; // Số lượng vendor từ giá trị cột

          const eventName = eventNames[eventId] || "Unknown Event"; // Lấy tên sự kiện từ eventNames

          const eventDataItem = eventData.find(
            (data) => data.eventId === eventId
          );
          const vendorList = eventDataItem
            ? eventDataItem.vendorIds // Trả về mảng vendorIds thay vì join
            : ["No Vendors Available"]; // Nếu không có vendor thì hiển thị mảng "No Vendors Available"

          return `
            Number of Vendors: ${vendorCount}<br />
          `;
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: eventData.map(
          (data) => eventNames[data.eventId] || "Unknown Event"
        ), // Sử dụng tên sự kiện từ eventNames
        axisLabel: {
          interval: 0,
          rotate: 45, // Xoay label để dễ đọc
        },
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Number of Vendors",
          type: "bar",
          data: eventData.map((data) => data.vendorCount),
          itemStyle: {
            color: "#8884d8",
          },
        },
      ],
    };
  };

  // Xử lý khi người dùng click vào event
  const handleEventClick = (e) => {
    const eventName = e?.name; // Lấy tên sự kiện từ e.data
    const eventId = Object.keys(eventNames).find(
      (key) => eventNames[key] === eventName
    );

    if (!eventId) {
      console.error("Event ID is missing or could not be found:", e);
      return; // Tránh gọi API nếu không có eventId
    }

    // Nếu có eventId, tiến hành fetch chi tiết sự kiện
    axios
      .get(`https://esmpbe.id.vn/api/event/${eventId}`)
      .then((response) => {
        const event = response.data;

        // Lưu dữ liệu vào sessionStorage
        sessionStorage.setItem("selectedEvent", JSON.stringify(event));

        // Điều hướng đến trang chi tiết sự kiện
        navigate(`/event-detail/${event.eventId}`, { state: { event } });
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
      });
  };

  return (
    <div style={{ width: "100%", height: "400px", marginTop: "20px" }}>
      
      <ReactECharts
        option={getChartOptions()}
        style={{ height: "100%", width: "100%" }}
        onEvents={{
          click: (e) => {
            // Lấy tên sự kiện từ e và tìm eventId
            const eventName = e?.name;
            const eventId = Object.keys(eventNames).find(
              (key) => eventNames[key] === eventName
            );

            if (eventId) {
              handleEventClick(e); // Nếu có eventId, gọi handleEventClick
            } else {
              console.error("Event ID is missing in clicked data:", e);
            }
          },
        }}
      />
    </div>
  );
};

export default EventVendorCount;
