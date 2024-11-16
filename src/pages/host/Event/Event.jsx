import React, { useEffect, useState, useCallback } from "react";
import "./Event.css";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Box,
  Flex,
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  FormControl,
  FormLabel,
  useDisclosure,
  useToast,
  Image,
} from "@chakra-ui/react";
import axios from "axios";
import { format } from "date-fns";
import { SearchIcon, AddIcon, CalendarIcon, InfoIcon } from "@chakra-ui/icons";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../shared/firebase/firebaseConfig";

const URL =
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/event";
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";
const hostId = "c12042fa-bd4d-4147-92b8-ad904e374f11"; // Đặt cố định hostId theo yêu cầu

const Event = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imageFile, setImageFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get(URL, {
        headers: { Authorization: getAccessToken() },
      });
      const fetchedEvents = response.data;
      const eventsWithImages = await Promise.all(
        fetchedEvents.map(async (event) => {
          const imageRef = ref(storage, `${hostId}/${event.eventId}/thumbnail`);
          try {
            event.imageURL = await getDownloadURL(imageRef);
          } catch (error) {
            event.imageURL = "https://via.placeholder.com/150"; // URL mặc định nếu không có hình ảnh
          }
          return event;
        })
      );
      setEvents(eventsWithImages);
    } catch (error) {
      console.error("There was an error fetching the events!", error);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    // Cập nhật filteredEvents dựa trên tab và search term hiện tại
    const filterEvents = () => {
      let filtered = events;

      // Lọc sự kiện dựa trên tab
      switch (activeTab) {
        case 0:
          filtered = events.filter(
            (event) => event.status?.toLowerCase() === "upcoming"
          );
          break;
        case 1:
          filtered = events.filter(
            (event) => event.status?.toLowerCase() === "running"
          );
          break;
        case 2:
          filtered = events.filter(
            (event) => event.status?.toLowerCase() === "cancelled"
          );
          break;
        default:
          filtered = events;
      }

      // Áp dụng bộ lọc tìm kiếm
      if (searchTerm) {
        filtered = filtered.filter((event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredEvents(filtered);
    };

    filterEvents();
  }, [events, activeTab, searchTerm]);

  const handleEventClick = (event) => {
    sessionStorage.setItem("selectedEvent", JSON.stringify(event));
    sessionStorage.setItem("eventId", event.eventId);
    navigate(`/event-detail/${event.eventId}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (eventId) => {
    if (!imageFile) return null;
    const imageRef = ref(storage, `${hostId}/${eventId}/thumbnail`);
    await uploadBytes(imageRef, imageFile);
    return await getDownloadURL(imageRef);
  };

  const resetForm = () => {
    setEventName("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setImageFile(null);
    setThumbnailPreview(null);
  };

  const handleCreate = async () => {
    if (!imageFile) {
      toast({
        title: "Please upload an image.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newEvent = {
      name: eventName,
      hostId: hostId,
      themeId: hostId,
      description: description,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      profit: 10.0,
      status: "upcoming",
    };

    try {
      // Tạo sự kiện mới trên server trước
      const response = await axios.post(URL, newEvent, {
        headers: { Authorization: getAccessToken() },
      });
      const createdEvent = response.data;
      const eventId = createdEvent.id;

      // Tải ảnh lên Firebase và lấy URL ảnh
      const imageURL = await uploadImage(eventId);
      createdEvent.imageURL = imageURL;

      // Đợi một chút trước khi fetch lại sự kiện để đảm bảo ảnh đã được lưu trữ đầy đủ trên Firebase
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Gọi lại fetchEvents để lấy danh sách sự kiện mới nhất
      await fetchEvents();

      toast({
        title: "Event created successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Đóng modal và reset form
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Unable to create event.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Flex justify="space-between" align="center" mb="16px">
        <Flex align="center">
          {selectedEvent && (
            <AiOutlineArrowLeft
              boxSize={6}
              onClick={() => setSelectedEvent(null)}
              cursor="pointer"
            />
          )}
          <Box as="h1" fontSize="2xl" fontWeight="bold" ml="4">
            Events
          </Box>
        </Flex>
        {!selectedEvent && (
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={onOpen}
            rounded="md"
          >
            Create Event
          </Button>
        )}
      </Flex>

      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search events"
          value={searchTerm}
          onChange={handleSearch}
          mb={4}
          variant="filled"
        />
      </InputGroup>

      <Tabs index={activeTab} onChange={handleTabChange}>
        <TabList>
          <Tab>Up Coming</Tab>
          <Tab>Running</Tab>
          <Tab>Cancelled</Tab>
          <Tab>All</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid
              templateColumns="repeat(3, 1fr)"
              gap={6}
              mt={4}
              className="event-list"
            >
              {filteredEvents.map((event) => (
                <GridItem
                  key={event.eventId}
                  onClick={() => handleEventClick(event)}
                  className="event-card"
                >
                  <Box className="event-card-content">
                    <Box className="event-card-cover">
                      <Image
                        src={
                          event.imageURL || "https://via.placeholder.com/150"
                        }
                        alt={event.name}
                        className="event-image"
                      />
                    </Box>
                    <Box className="event-info-container">
                      <Box className="event-title">{event.name}</Box>
                      <Box className="event-dates">
                        <Box>
                          <CalendarIcon /> <strong>Start Date:</strong>{" "}
                          {format(new Date(event.startDate), "yyyy-MM-dd")}
                        </Box>
                        <Box>
                          <CalendarIcon /> <strong>End Date:</strong>{" "}
                          {format(new Date(event.endDate), "yyyy-MM-dd")}
                        </Box>
                      </Box>
                      <Box className="event-description">
                        <InfoIcon /> <strong>Description:</strong>{" "}
                        {event.description}
                      </Box>
                    </Box>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Event Name</FormLabel>
              <Input
                placeholder="Enter event name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </FormControl>
            <Flex justify="space-between" mb={4}>
              <FormControl>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>End Date</FormLabel>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </FormControl>
            </Flex>
            <FormControl mb={4}>
              <FormLabel>Event Description</FormLabel>
              <Textarea
                placeholder="Enter event description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Event Thumbnail</FormLabel>
              <Input type="file" onChange={handleImageChange} />
              {thumbnailPreview && (
                <Box mt={2}>
                  <Image
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    width="100%"
                  />
                </Box>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleCreate}>
              Create
            </Button>
            <Button ml={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Event;
