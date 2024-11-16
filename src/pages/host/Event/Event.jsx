import React, { useEffect, useState, useCallback } from "react";
import "./Event.css";
import { useNavigate, useLocation } from "react-router-dom";
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
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../../shared/firebase/firebaseConfig";

const BASE_URL =
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/event";
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const Event = () => {
  const loc = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const hostId = loc.state?.hostId || sessionStorage.getItem("hostId") || "";
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

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
      console.log("Fetched events from API:", fetchedEvents);

      const eventsWithImages = await Promise.all(
        fetchedEvents.map(async (event) => {
          const imagesRef = ref(storage, `${hostId}/${event.eventId}`);

          try {
            const imagesList = await listAll(imagesRef);
            if (imagesList.items.length > 0) {
              const mainImageRef = imagesList.items[0]; // Lấy ảnh đầu tiên làm ảnh chính
              event.imageURL = await getDownloadURL(mainImageRef);
            } else {
              event.imageURL = "https://via.placeholder.com/150";
            }
          } catch (error) {
            console.warn(
              `Error fetching images for event ID: ${event.eventId}:`,
              error
            );
            event.imageURL = "https://via.placeholder.com/150";
          }
          return event;
        })
      );

      setEvents(eventsWithImages);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error fetching events.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [hostId, toast]);

  const handleEventClick = (event) => {
    navigate(`/event-detail/${event.eventId}`);
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const filterEvents = () => {
      let filtered = events;

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

      if (searchTerm) {
        filtered = filtered.filter((event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredEvents(filtered);
    };

    filterEvents();
  }, [events, activeTab, searchTerm]);

  const handleCreate = async () => {
    if (!eventName || !startDate || !endDate || !description || !imageFile) {
      toast({
        title: "Please fill in all fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const newEvent = {
        name: eventName,
        hostId,
        themeId: hostId,
        description,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        profit: 10.0,
        status: "upcoming",
      };

      // Gửi request tạo sự kiện
      const response = await axios.post(BASE_URL, newEvent, {
        headers: { Authorization: getAccessToken() },
      });
      const eventId = response.data.id;
      console.log("Created Event ID:", eventId);

      if (!eventId) {
        throw new Error("Event ID is missing in the response");
      }

      // Tải ảnh lên Firebase
      const imageRef = ref(storage, `${hostId}/${eventId}/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageURL = await getDownloadURL(imageRef);

      fetchEvents();
      // Cập nhật thông tin sự kiện với URL ảnh
      const updatedEvent = {
        ...newEvent,
        eventId, // Thêm eventId vào sự kiện
        imageURL,
      };
      setEvents((prevEvents) => [updatedEvent, ...prevEvents]);

      toast({
        title: "Event created successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      resetForm();
      onClose();
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error creating event.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdate = async (eventId, updatedData) => {
    try {
      await axios.put(`${BASE_URL}/${eventId}`, updatedData, {
        headers: { Authorization: getAccessToken() },
      });
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.eventId === eventId ? { ...event, ...updatedData } : event
        )
      );

      toast({
        title: "Event updated successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Error updating event.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`${BASE_URL}/${eventId}`, {
        headers: { Authorization: getAccessToken() },
      });

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.eventId !== eventId)
      );

      toast({
        title: "Event deleted successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error deleting event.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const resetForm = () => {
    setEventName("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setImageFile(null);
    setThumbnailPreview(null);
  };

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const handleTabChange = (index) => setActiveTab(index);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Flex justify="space-between" align="center" mb="16px">
        <Box as="h1" fontSize="2xl" fontWeight="bold">
          Events
        </Box>
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>
          Create Event
        </Button>
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
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Enter event description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Event Thumbnail</FormLabel>
              <Input type="file" onChange={handleImageChange} />
              {thumbnailPreview && <Image src={thumbnailPreview} />}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleCreate}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Event;
