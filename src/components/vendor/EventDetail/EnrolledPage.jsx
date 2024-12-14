import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Text,
  Image,
  VStack,
  Button,
  Spinner,
  Heading,
  Flex,
  Divider,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../../shared/firebase/firebaseConfig";
import SelectBooth from "./SelectBooth";
import { Pagination } from "antd";
import ViewBoothMap from "./ViewBoothMap";
import CancelEventButton from "./CancelEventButton";
import MapboxComponent from "../../../components/MapBox/MapboxComponent";
import Slider from "react-slick"; // Import react-slick
import "slick-carousel/slick/slick.css"; // Import CSS cho slider
import "slick-carousel/slick/slick-theme.css";

const BASE_URL = "https://esmpbe.id.vn/api/event";
const LOCATION_TYPE_URL = "https://esmpbe.id.vn/api/map/locationType";
const SERVICE_URL = "https://esmpbe.id.vn/api/service";

const EventEnrolled = () => {
  const { state } = useLocation();
  const eventId = state?.eventId;
  const accessToken = sessionStorage.getItem("accessToken") || "";
  const vendorId = sessionStorage.getItem("vendorId") || "";
  const hostId = sessionStorage.getItem("hostId") || "";
  const [eventImages, setEventImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [eventDetail, setEventDetail] = useState(null);
  const [boothData, setBoothData] = useState([]);
  const [serviceData, setServiceData] = useState([]); // Service data state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationTypeColors, setLocationTypeColors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // Number of items per page
  const navigate = useNavigate();
  const vendorinEventId = state?.vendorInEventId;
  console.log("gi ki vay", vendorinEventId);

  useEffect(() => {
    if (!eventId) {
      console.error("Missing eventId");
      navigate("/");
      return;
    }

    // const fetchEventDetail = async () => {
    //   try {
    //     const response = await axios.get(`${BASE_URL}/${eventId}`, {
    //       headers: {
    //         Authorization: `${accessToken}`,
    //         "Content-Type": "application/json",
    //       },
    //     });
    //     const event = response.data;

    //     try {
    //       const imagesRef = ref(storage, `${hostId}/${eventId}`);
    //       const imagesList = await listAll(imagesRef);
    //       if (imagesList.items.length > 0) {
    //         const mainImageRef = imagesList.items[0];
    //         event.logo = await getDownloadURL(mainImageRef);
    //       } else {
    //         event.logo = "https://via.placeholder.com/150";
    //       }
    //     } catch (error) {
    //       console.warn("Error fetching event image:", error);
    //       event.logo = "https://via.placeholder.com/150";
    //     }
    //     setEventDetail(event);
    //     setLoading(false);
    //   } catch (error) {
    //     console.error("Error fetching event detail:", error);
    //     setError("Failed to fetch event details");
    //     setLoading(false);
    //   }
    // };

    const fetchEventDetail = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/${eventId}`, {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const event = response.data;
        setEventDetail(event);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event detail:", error);
        setError("Failed to fetch event details");
        setLoading(false);
      }
    };

    const fetchEventImages = async () => {
      try {
        const imagesRef = ref(storage, `${hostId}/${eventId}`);
        const imagesList = await listAll(imagesRef);

        const imageUrls = imagesList.items.length
          ? await Promise.all(
              imagesList.items.map((item) => getDownloadURL(item))
            )
          : ["https://via.placeholder.com/300"]; // Fallback nếu không có ảnh
        setEventImages(imageUrls);
      } catch (error) {
        console.error("Error fetching event images:", error);
        setEventImages(["https://via.placeholder.com/300"]); // Fallback
      } finally {
        setLoadingImages(false);
      }
    };

    const fetchBoothData = async () => {
      try {
        const response = await axios.get(
          `${LOCATION_TYPE_URL}/${hostId}/${eventId}`,
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setBoothData(response.data);
      } catch (error) {
        console.error("Error fetching booth data:", error);
      }
    };

    const fetchServiceData = async () => {
      try {
        const response = await axios.get(`${SERVICE_URL}/${eventId}`, {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setServiceData(response.data);
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };
    const fetchLocationTypeColors = async () => {
      try {
        const response = await axios.get(
          `${LOCATION_TYPE_URL}/${hostId}/${eventId}`,
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        // Assuming each location type has a color property
        const colors = response.data.reduce((acc, item) => {
          acc[item.typeId] = item.color; // Store color by typeId
          return acc;
        }, {});
        setLocationTypeColors(colors);
      } catch (error) {
        console.error("Error fetching location type colors:", error);
      }
    };

    fetchEventDetail();
    fetchBoothData();
    fetchEventImages();
    fetchServiceData();
    fetchLocationTypeColors();
  }, [eventId, accessToken, hostId, navigate]);

  const handleShopClick = () => {
    navigate(`/shop/${vendorId}/${eventId}`, {
      state: {
        accessToken,
        vendorId,
        eventId,
      },
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedBoothData = boothData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const paginatedServiceData = serviceData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box p={10} textAlign="center">
        <Text fontSize="xl" color="red.500">
          {error}
        </Text>
      </Box>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
  };

  return (
    <Box
      padding="20px"
      bg="white"
      borderRadius="md"
      boxShadow="md"
      minH="100vh"
    >
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={10} mb={10}>
        <VStack align="flex-start" spacing={10}>
          <Heading as="h2" size="lg" color="purple.900">
            {eventDetail.name}
          </Heading>
          <HStack paddingBottom={8}>
            <Text fontSize="lg" fontWeight="bold" color="purple.900">
              {new Date(eventDetail.startDate).toLocaleDateString()} -{" "}
              {new Date(eventDetail.endDate).toLocaleDateString()}
            </Text>
          </HStack>
          <HStack paddingBottom={8}>
            <Button colorScheme="blue" size="lg" onClick={handleShopClick}>
              Shop
            </Button>
            <CancelEventButton
              vendorinEventId={vendorinEventId}
              eventId={eventId}
            />
          </HStack>
        </VStack>
        <Box
          borderRadius="lg"
          boxShadow="lg"
          overflow="hidden"
          width="100%"
          height="300px"
        >
          {loadingImages ? (
            <Flex justifyContent="center" alignItems="center" height="100%">
              <Spinner size="lg" color="teal.500" />
            </Flex>
          ) : (
            <Slider {...sliderSettings}>
              {eventImages.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt={`Event Image ${index + 1}`}
                  objectFit="cover"
                  width="100%"
                  height="100%"
                />
              ))}
            </Slider>
          )}
        </Box>
      </Grid>

      <Divider borderColor="gray.300" borderWidth="1px" mb={10} />

      <Text fontSize="2xl" fontWeight="bold" color="black" mb={4}>
        Event Information
      </Text>
      <Text fontSize="large" color="gray.600" mb={10}>
        {eventDetail.description}
      </Text>

      <Divider borderColor="gray.300" borderWidth="1px" mb={10} />

      <Text fontSize="2xl" fontWeight="bold" color="black" mb={4}>
        Booth Map
      </Text>
      <Box>
        <ViewBoothMap />
      </Box>

      <Divider borderColor="gray.300" borderWidth="1px" mb={10} />

      <Text fontSize="2xl" fontWeight="bold" color="black" mb={4}>
        Booth List
      </Text>
      <Box overflowX="auto" mb={10}>
        <Table variant="simple" size="lg" color="black">
          <Thead bg="gray.100">
            <Tr>
              <Th textAlign="center">No</Th>
              <Th textAlign="center">Location Type Name</Th>
              <Th textAlign="center">Price</Th>
              <Th textAlign="center">Color</Th>
              <Th textAlign="center">Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedBoothData.map((booth, index) => (
              <Tr key={index}>
                <Td textAlign="center">
                  {(currentPage - 1) * pageSize + index + 1}
                </Td>
                <Td textAlign="center">{booth.typeName}</Td>
                <Td textAlign="center">{booth.price}</Td>
                <Td textAlign="center">
                  <Box
                    bg={locationTypeColors[booth.typeId] || "white"}
                    width="20px"
                    height="20px"
                    borderRadius="50%"
                    border="1px solid #000"
                    margin="0 auto"
                  />
                </Td>
                <Td textAlign="center">{booth.status}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Flex justifyContent="flex-end" mb={10}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={boothData.length}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </Flex>

      <Divider borderColor="gray.300" borderWidth="1px" mb={10} />

      <Text fontSize="2xl" fontWeight="bold" color="black" mb={4}>
        Service List
      </Text>
      <Box overflowX="auto">
        <Table variant="simple" size="lg" color="black" mb={5}>
          <Thead bg="gray.100">
            <Tr>
              <Th textAlign="center">No</Th>
              {/* <Th textAlign="center">Service ID</Th> */}
              <Th textAlign="center">Service Name</Th>
              <Th textAlign="center">Price</Th>
              <Th textAlign="center">Quantity</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedServiceData.map((service, index) => (
              <Tr key={index}>
                <Td textAlign="center">
                  {(currentPage - 1) * pageSize + index + 1}
                </Td>
                {/* <Td textAlign="center">{service.serviceId}</Td> */}
                <Td textAlign="center">{service.name}</Td>
                <Td textAlign="center">{service.price}</Td>
                <Td textAlign="center">{service.quantity}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Flex justifyContent="flex-end" mb={10}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={serviceData.length}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </Flex>

      <Divider borderColor="gray.300" borderWidth="1px" mb={10} />

      <Text fontSize="2xl" fontWeight="bold" color="black" mb={4}>
        Location
      </Text>
      <Box mb={10}>
        <MapboxComponent
          eventId={eventId}
          eventData={eventDetail}
          onSaveCoordinates={(updatedCoordinates) =>
            setEventDetail({ ...eventDetail, coordinates: updatedCoordinates })
          }
        />
        {eventDetail.coordinates && (
          <Text mt={4} color="gray.600">
            Current Coordinates: {eventDetail.coordinates}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default EventEnrolled;
