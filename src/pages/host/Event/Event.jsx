// import React, { useEffect, useState, useCallback } from "react";
// import "./Event.css";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   Tabs,
//   Input,
//   Button,
//   Row,
//   Col,
//   Modal,
//   Form,
//   Upload,
//   message,
//   DatePicker,
//   Select,
//   Spin,
// } from "antd";
// import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
// import axios from "axios";
// import { format } from "date-fns";
// import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
// import { storage } from "../../../shared/firebase/firebaseConfig";
// import { Box, Grid, GridItem, Image } from "@chakra-ui/react";
// import { CalendarIcon, InfoIcon } from "@chakra-ui/icons";

// const { TabPane } = Tabs;
// const { TextArea } = Input;

// const BASE_URL = "https://esmpbe.id.vn/api/event";
// const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

// const Event = () => {
//   const loc = useLocation();
//   const navigate = useNavigate();
//   const hostId = loc.state?.hostId || sessionStorage.getItem("hostId") || "";

//   const [events, setEvents] = useState([]);
//   const [filteredEvents, setFilteredEvents] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState("0");
//   const [modalVisible, setModalVisible] = useState(false);
//   const [themes, setThemes] = useState([]);
//   const [loading, setLoading] = useState(false); // Thêm loading ở đây
//   const [form] = Form.useForm();

//   const fetchEvents = useCallback(async () => {
//     if (!hostId) {
//       console.error("Host ID is missing!");
//       return;
//     }

//     setLoading(true); // Bật loading khi bắt đầu fetch dữ liệu

//     try {
//       const response = await axios.get(`${BASE_URL}/host/${hostId}`, {
//         headers: { Authorization: getAccessToken() },
//       });
//       const fetchedEvents = response.data;

//       const eventsWithImages = await Promise.all(
//         fetchedEvents.map(async (event) => {
//           const imagesRef = ref(storage, `${hostId}/${event.eventId}`);

//           try {
//             const imagesList = await listAll(imagesRef);
//             if (imagesList.items.length > 0) {
//               const mainImageRef = imagesList.items[0];
//               event.imageURL = await getDownloadURL(mainImageRef);
//             } else {
//               event.imageURL = "https://via.placeholder.com/150";
//             }
//           } catch (error) {
//             event.imageURL = "https://via.placeholder.com/150";
//           }
//           return event;
//         })
//       );

//       setEvents(eventsWithImages);
//     } catch (error) {
//       console.error("Error fetching events:", error);
//       message.error("Error fetching events.");
//     } finally {
//       setLoading(false); // Tắt loading khi dữ liệu đã được fetch xong
//     }
//   }, [hostId]);

//   const filterEvents = useCallback(() => {
//     let filtered = events;

//     const now = new Date(); // Lấy thời gian hiện tại

//     switch (activeTab) {
//       case "0": // Up Coming
//         filtered = events.filter((event) => new Date(event.startDate) > now);
//         break;
//       case "1": // Running
//         filtered = events.filter(
//           (event) =>
//             new Date(event.startDate) <= now && new Date(event.endDate) >= now
//         );
//         break;
//       case "2": // Cancelled
//         filtered = events.filter((event) => event.status === "cancelled");
//         break;
//       case "3": // Finished
//         filtered = events.filter((event) => new Date(event.endDate) < now);
//         break;
//       default: // All
//         filtered = events;
//     }

//     if (searchTerm) {
//       filtered = filtered.filter((event) =>
//         event.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     setFilteredEvents(filtered);
//   }, [events, activeTab, searchTerm]);

//   useEffect(() => {
//     fetchEvents();
//   }, [fetchEvents]);

//   useEffect(() => {
//     filterEvents();
//   }, [filterEvents]);

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleTabChange = (key) => {
//     setActiveTab(key);
//   };

//   const handleCreateEvent = async (values) => {
//     setLoading(true); // Bật loading khi tạo sự kiện
//     const { name, description, startDate, endDate, file, profit, themeId } =
//       values;

//     if (
//       !name ||
//       !description ||
//       !startDate ||
//       !endDate ||
//       !file ||
//       !profit ||
//       !themeId
//     ) {
//       message.error("Please fill in all fields.");
//       setLoading(false); // Tắt loading nếu không đủ dữ liệu
//       return;
//     }

//     try {
//       // Chuẩn bị dữ liệu sự kiện
//       const newEvent = {
//         name,
//         hostId,
//         themeId,
//         description,
//         startDate: startDate.toISOString(),
//         endDate: endDate.toISOString(),
//         profit: parseFloat(profit),
//         status: "upcoming",
//       };

//       // Gửi request tạo sự kiện
//       const response = await axios.post(BASE_URL, newEvent, {
//         headers: { Authorization: getAccessToken() },
//       });

//       const eventId = response.data.id;

//       if (!eventId) {
//         throw new Error("Event ID is missing in the response");
//       }

//       // Upload ảnh lên Firebase
//       const imageFile = file[0].originFileObj;
//       const imageRef = ref(storage, `${hostId}/${eventId}/${imageFile.name}`);
//       await uploadBytes(imageRef, imageFile);
//       const imageURL = await getDownloadURL(imageRef);

//       // Fetch lại danh sách sự kiện
//       fetchEvents();

//       // Cập nhật thông tin sự kiện trong state
//       const updatedEvent = {
//         ...newEvent,
//         eventId,
//         imageURL,
//       };
//       setEvents((prevEvents) => [updatedEvent, ...prevEvents]);

//       // Hiển thị thông báo thành công cho sự kiện
//       message.success("Event created successfully!");

//       // Đóng modal và reset form sau khi mọi thứ hoàn thành
//       setModalVisible(false);
//       form.resetFields();
//     } catch (error) {
//       // Xử lý lỗi
//       console.error("Error creating event:", error);
//       message.error(
//         `Error: ${error.response?.data?.message || "Something went wrong"}`
//       );
//     } finally {
//       setLoading(false); // Tắt loading sau khi hoàn tất
//     }
//   };

//   const handleEventClick = (event, services) => {
//     // Lưu dữ liệu vào sessionStorage
//     sessionStorage.setItem("selectedEvent", JSON.stringify(event));
//     sessionStorage.setItem("eventServices", JSON.stringify(services || []));
//     navigate(`/event-detail/${event.eventId}`, { state: { event, services } });
//   };

//   const uploadProps = {
//     beforeUpload: () => false,
//   };

//   useEffect(() => {
//     const fetchThemes = async () => {
//       try {
//         const response = await axios.get(
//           `https://esmpbe.id.vn/api/theme/hostId/${hostId}`,
//           {
//             headers: { Authorization: getAccessToken() },
//           }
//         );
//         setThemes(response.data); // Cập nhật themes từ API
//       } catch (error) {
//         console.error("Error fetching themes:", error);
//         message.error("Error fetching themes.");
//       }
//     };

//     fetchThemes(); // Gọi API themes khi component load
//   }, [hostId]);

//   return (
//     <div>
//       <div className="header-container">
//         <h1 className="headername">Events</h1>
//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={() => setModalVisible(true)}
//         >
//           Create Event
//         </Button>
//       </div>

//       <Input
//         placeholder="Search events"
//         prefix={<SearchOutlined />}
//         value={searchTerm}
//         onChange={handleSearchChange}
//         className="inputsearch"
//       />

//       <Tabs defaultActiveKey="0" onChange={handleTabChange}>
//         <TabPane tab="Up Coming" key="0" />
//         <TabPane tab="Running" key="1" />
//         <TabPane tab="Cancelled" key="2" />
//         <TabPane tab="Finished" key="3" />
//         <TabPane tab="All" key="4" />
//       </Tabs>

//       <Spin spinning={loading} tip="Loading events...">
//         <Grid
//           templateColumns={{
//             base: "repeat(1, 1fr)", // 1 cột trên màn hình nhỏ
//             md: "repeat(2, 1fr)", // 2 cột trên màn hình trung bình
//             lg: "repeat(3, 1fr)", // 3 cột trên màn hình lớn
//           }}
//           gap={6}
//           mt={4}
//         >
//           {filteredEvents.length > 0 ? (
//             filteredEvents.map((event) => (
//               <GridItem
//                 key={event.eventId}
//                 onClick={() => handleEventClick(event)}
//                 className="event-card"
//               >
//                 <Box className="event-card-content">
//                   <Box className="event-card-cover">
//                     <Image
//                       src={event.imageURL || "https://via.placeholder.com/150"}
//                       alt={event.name}
//                       className="event-card-image"
//                     />
//                   </Box>
//                   <Box className="event-info-container">
//                     <Box className="event-title">{event.name}</Box>
//                     <Box className="event-dates">
//                       <Box>
//                         <CalendarIcon /> <strong>Start Date:</strong>{" "}
//                         {format(new Date(event.startDate), "yyyy-MM-dd")}
//                       </Box>
//                       <Box style={{ marginLeft: "60px" }}>
//                         <CalendarIcon /> <strong>End Date:</strong>{" "}
//                         {format(new Date(event.endDate), "yyyy-MM-dd")}
//                       </Box>
//                     </Box>
//                     <Box className="event-description">
//                       <InfoIcon /> <strong>Description:</strong>{" "}
//                       {event.description || "No description provided."}
//                     </Box>
//                   </Box>
//                 </Box>
//               </GridItem>
//             ))
//           ) : (
//             <Box>No events found.</Box>
//           )}
//         </Grid>
//       </Spin>

//       {/* Modal tạo sự kiện */}
//       <Modal
//         title="Create Event"
//         visible={modalVisible}
//         onCancel={() => setModalVisible(false)}
//         footer={null}
//       >
//         <Form form={form} layout="vertical" onFinish={handleCreateEvent}>
//           <Form.Item
//             label="Event Name"
//             name="name"
//             rules={[{ required: true, message: "Please input the event name!" }]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item
//             label="Description"
//             name="description"
//             rules={[{ required: true, message: "Please input the description!" }]}
//           >
//             <TextArea rows={4} />
//           </Form.Item>

//           <Form.Item
//             label="Start Date"
//             name="startDate"
//             rules={[{ required: true, message: "Please select the start date!" }]}
//           >
//             <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
//           </Form.Item>

//           <Form.Item
//             label="End Date"
//             name="endDate"
//             rules={[{ required: true, message: "Please select the end date!" }]}
//           >
//             <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
//           </Form.Item>

//           <Form.Item
//             label="Event Theme"
//             name="themeId"
//             rules={[{ required: true, message: "Please select the theme!" }]}
//           >
//             <Select>
//               {themes.map((theme) => (
//                 <Select.Option key={theme.id} value={theme.id}>
//                   {theme.name}
//                 </Select.Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item
//             label="Upload Image"
//             name="file"
//             rules={[{ required: true, message: "Please upload an image!" }]}
//           >
//             <Upload {...uploadProps}>
//               <Button>Click to Upload</Button>
//             </Upload>
//           </Form.Item>

//           <Form.Item
//             label="Profit"
//             name="profit"
//             rules={[{ required: true, message: "Please input the profit!" }]}
//           >
//             <Input type="number" />
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" block loading={loading}>
//               Create Event
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default Event;

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
  const [canCreateEvent, setCanCreateEvent] = useState(false); // Kiểm tra quyền tạo event

  const fetchHostExpireTime = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://esmpbe.id.vn/api/host/${hostId}`,
        {
          headers: { Authorization: getAccessToken() },
        }
      );

      const { expiretime } = response.data;

      // Kiểm tra nếu expiretime còn hạn
      const currentTime = new Date();
      const expireDate = new Date(expiretime);
      const isEventCreationAllowed = expireDate > currentTime;
      setCanCreateEvent(isEventCreationAllowed);

      // Console log để kiểm tra trạng thái
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
    fetchHostExpireTime(); // Kiểm tra expiretime khi component load
  }, [fetchHostExpireTime]);

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

    const now = new Date(); // Lấy thời gian hiện tại
    const startOfDay = new Date(now.setHours(0, 0, 0, 0)); // Bắt đầu ngày hôm nay (00:00:00)
    const endOfDay = new Date(now.setHours(23, 59, 59, 999)); // Kết thúc ngày hôm nay (23:59:59)

    switch (activeTab) {
      case "0": // Up Coming
        filtered = events.filter(
          (event) => new Date(event.startDate) > startOfDay
        );
        break;
      case "1": // Running
        filtered = events.filter(
          (event) =>
            new Date(event.startDate) <= endOfDay &&
            new Date(event.endDate) >= startOfDay
        );
        break;
      case "2": // Cancelled
        filtered = events.filter((event) => event.status === "cancelled");
        break;
      case "3": // Finished
        filtered = events.filter(
          (event) => new Date(event.endDate) < startOfDay
        );
        break;
      default: // All
        filtered = events;
    }

    if (searchTerm) {
      filtered = filtered.filter((event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    console.log(filtered, "filtered");
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

  // const handleCreateEvent = async (values) => {
  //   const { name, description, startDate, endDate, file, profit } = values;

  //   if (!name || !description || !startDate || !endDate || !file || !profit) {
  //     message.error("Please fill in all fields.");
  //     return;
  //   }

  //   try {
  //     const newEvent = {
  //       name,
  //       hostId,
  //       themeId: hostId,
  //       description,
  //       startDate: startDate.toISOString(), // Chuyển đổi sang định dạng ISO
  //       endDate: endDate.toISOString(),
  //       profit: parseFloat(profit),
  //       status: "upcoming",
  //     };

  //     console.log("Payload being sent:", newEvent);

  //     // Gửi request tạo sự kiện
  //     const response = await axios.post(BASE_URL, newEvent, {
  //       headers: { Authorization: getAccessToken() },
  //     });

  //     const eventId = response.data.id;

  //     if (!eventId) {
  //       throw new Error("Event ID is missing in the response");
  //     }

  //     // Upload ảnh lên Firebase
  //     const imageFile = file[0].originFileObj;
  //     const imageRef = ref(storage, `${hostId}/${eventId}/${imageFile.name}`);
  //     await uploadBytes(imageRef, imageFile);
  //     const imageURL = await getDownloadURL(imageRef);

  //     // Fetch lại danh sách sự kiện
  //     fetchEvents();

  //     // Cập nhật thông tin sự kiện trong state
  //     const updatedEvent = {
  //       ...newEvent,
  //       eventId,
  //       imageURL,
  //     };
  //     setEvents((prevEvents) => [updatedEvent, ...prevEvents]);

  //     message.success("Event created successfully!");
  //     setModalVisible(false);
  //     form.resetFields();

  //     // Lấy danh sách Vendor của Host
  //     const vendorResponse = await axios.get(
  //       `${BASE_URL}/vendor/host/${hostId}`,
  //       {
  //         headers: { Authorization: getAccessToken() },
  //       }
  //     );

  //     const vendors = vendorResponse.data;

  //     // Gửi thông báo đến tất cả Vendor
  //     await Promise.all(
  //       vendors.map((vendor) =>
  //         axios.post(
  //           `${BASE_URL}/notification`,
  //           {
  //             userid: vendor.userid,
  //             source: `Sự kiện "${name}" đã được khởi động.`,
  //           },
  //           { headers: { Authorization: getAccessToken() } }
  //         )
  //       )
  //     );

  //     message.success("Event created and notifications sent to vendors!");
  //   } catch (error) {
  //     console.error("Error creating event or sending notifications:", error);
  //     message.error("Error creating event or sending notifications.");
  //   }
  // };
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
      // Manually set startDate and endDate to midnight UTC to avoid timezone issues
      const startDateUTC = new Date(startDate);
      startDateUTC.setHours(0, 0, 0, 0); // Set to midnight UTC

      const endDateUTC = new Date(endDate);
      endDateUTC.setHours(23, 59, 59, 999); // Set to end of day UTC

      // Prepare event data
      const newEvent = {
        name,
        hostId,
        themeId,
        description,
        startDate: startDateUTC.toISOString(), // Ensure it's in ISO format
        endDate: endDateUTC.toISOString(), // Ensure it's in ISO format
        deposit: parseFloat(deposit), // Use deposit instead of profit
        status: "upcoming",
      };

      console.log("Payload being sent:", newEvent);

      // Send request to create event
      const response = await axios.post(BASE_URL, newEvent, {
        headers: { Authorization: getAccessToken() },
      });

      const eventId = response.data.id;

      if (!eventId) {
        throw new Error("Event ID is missing in the response");
      }

      // Upload image to Firebase
      const imageFile = file[0].originFileObj;
      const imageRef = ref(storage, `${hostId}/${eventId}/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageURL = await getDownloadURL(imageRef);

      // Refetch events list
      fetchEvents();

      // Update event info in state
      const updatedEvent = {
        ...newEvent,
        eventId,
        imageURL,
      };
      setEvents((prevEvents) => [updatedEvent, ...prevEvents]);

      message.success("Event created successfully!");

      // Close modal and reset form
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error creating event:", error);
      message.error(
        `Error: ${error.response?.data?.message || "Something went wrong"}`
      );
    }
  };

  const handleEventClick = (event, services) => {
    // Lưu dữ liệu vào sessionStorage
    sessionStorage.setItem("selectedEvent", JSON.stringify(event));
    sessionStorage.setItem("eventServices", JSON.stringify(services || []));
    navigate(`/event-detail/${event.eventId}`, { state: { event, services } });
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
        setThemes(response.data); // Cập nhật themes từ API
      } catch (error) {
        console.error("Error fetching themes:", error);
        message.error("Error fetching themes.");
      }
    };

    fetchThemes(); // Gọi API themes khi component load
  }, [hostId]);

  return (
    <div>
      {/* <div className="header-container">
        <h1 className="headername">Events Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Create Event
        </Button>
      </div> */}
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
            onClick={() => canCreateEvent && setModalVisible(true)} // Chỉ mở modal khi được phép
            disabled={!canCreateEvent} // Vô hiệu hóa nút khi không được phép
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
            <Select placeholder="Select Theme">
              {themes.map((theme) => (
                <Select.Option key={theme.themeId} value={theme.themeId}>
                  {theme.name}
                </Select.Option>
              ))}
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
