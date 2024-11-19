import React, { useEffect, useState, useCallback } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  InputGroup,
  InputLeftElement,
  Input,
  Box,
  Grid,
  GridItem,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { SearchIcon, CalendarIcon, InfoIcon } from "@chakra-ui/icons";
import axios from "axios";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../../shared/firebase/firebaseConfig";

const BASE_URL =
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/event";
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const EventVendor = () => {
  const navigate = useNavigate();
  const hostId = sessionStorage.getItem("hostId") || "";

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);

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
            console.error("Error fetching event images:", error);
            event.imageURL = "https://via.placeholder.com/150";
          }
          return event;
        })
      );

      setEvents(eventsWithImages);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }, [hostId]);

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

  const handleTabChange = (index) => setActiveTab(index);

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const handleEventClick = (event) => {
    navigate(`/events/${event.eventId}`, {
      state: { eventId: event.eventId },
    });
  };

  return (
    <>
      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search events"
          value={searchTerm}
          onChange={handleSearch}
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
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
              {filteredEvents.map((event) => (
                <GridItem
                  key={event.eventId}
                  onClick={() => handleEventClick(event)}
                  cursor="pointer"
                  border="1px solid #e2e8f0"
                  borderRadius="md"
                  overflow="hidden"
                >
                  <Image
                    src={event.imageURL}
                    alt={event.name}
                    objectFit="cover"
                    w="100%"
                    h="150px"
                  />
                  <Box p={4}>
                    <Box fontWeight="bold" fontSize="lg" mb={2}>
                      {event.name}
                    </Box>
                    <Box fontSize="sm" mb={2}>
                      <CalendarIcon />{" "}
                      {`${new Date(event.startDate).toLocaleDateString()} - ${new Date(
                        event.endDate
                      ).toLocaleDateString()}`}
                    </Box>
                    <Box fontSize="sm" color="gray.600">
                      <InfoIcon /> {event.description}
                    </Box>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default EventVendor;
