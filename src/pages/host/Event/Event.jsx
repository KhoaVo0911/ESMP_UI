import React, { useEffect, useState } from "react";
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
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../shared/firebase/firebaseConfig";

const URL =
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/event";

const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [thumbnail, setThumbnail] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    axios
      .get(URL, {
        headers: {
          Authorization: `${getAccessToken()}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setEvents(response.data);
        setFilteredEvents(
          response.data.filter(
            (event) => event.status?.toLowerCase() === "on-going"
          )
        );
      })
      .catch((error) => {
        console.error("There was an error fetching the events!", error);
      });
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = events.filter((event) =>
      event.name.toLowerCase().includes(term)
    );
    setFilteredEvents(filtered);
  };

  const handleTabChange = (index) => {
    setActiveTab(index);

    let filtered;

    switch (index) {
      case 0:
        filtered = events.filter(
          (event) => event.status?.toLowerCase() === "on-going"
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
      case 3:
      default:
        filtered = events;
        break;
    }

    setFilteredEvents(filtered);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file.size / 1024 / 1024 < 5) {
      const storageRef = ref(storage, `images/${file.name}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Error uploading file:", error);
          toast({
            title: "Error uploading image",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setThumbnail(downloadURL);
            console.log("File available at", downloadURL);
          });
        }
      );
    } else {
      toast({
        title: "File size must be smaller than 5MB",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEventClick = (event, services) => {
    sessionStorage.setItem("selectedEvent", JSON.stringify(event));
    sessionStorage.setItem("eventId", event.eventId);
    sessionStorage.setItem("eventServices", JSON.stringify(services));
    navigate(`/event-detail/${event.eventId}`);
  };

  const handleCreate = () => {
    if (!thumbnail) {
      toast({
        title: "Please upload an image.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newEvent = {
      eventId: Date.now().toString(),
      hostId: "c12042fa-bd4d-4147-92b8-ad904e374f11",
      themeId: "c12042fa-bd4d-4147-92b8-ad904e374f11",
      name: eventName,
      description: description,
      thumbnail: thumbnail,
      stageValue: "Main Stage",
      startDate: startDate,
      endDate: endDate,
      venue: "Event Venue",
      createAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      height: 500,
      width: 800,
      x: 100,
      y: 200,
      onWeb: true,
      profit: "5000",
      status: "on-going",
    };

    axios
      .post(URL, newEvent, {
        headers: {
          Authorization: `${getAccessToken()}`, // No Bearer prefix
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const updatedEvents = [...events, response.data];
        setEvents(updatedEvents);

        handleTabChange(activeTab);

        toast({
          title: "Event created successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();

        setShowServiceModal(true);
      })
      .catch((error) => {
        toast({
          title: "Failed to create event.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleSaveServices = (selectedServices) => {
    setServices(selectedServices);
    setShowServiceModal(false);
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
          <Tab>On-going</Tab>
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
                  onClick={() => handleEventClick(event, services)}
                  className="event-card"
                >
                  <Box className="event-card-content">
                    <Box className="event-card-cover">
                      <Image
                        src={event.thumbnail || thumbnail}
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
              <Input type="file" onChange={handleFileChange} />
              {thumbnail && (
                <Box mt={2}>
                  <Image src={thumbnail} alt="Thumbnail Preview" width="100%" />
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
