import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { Box, Text, Flex } from "@chakra-ui/react";

const BASE_URL =
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api";

const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const EventLocationSlider = () => {
  const [events, setEvents] = useState([]);
  const hostId = sessionStorage.getItem("hostId") || "";

  useEffect(() => {
    const fetchEventsWithMaps = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/event/host/${hostId}`, {
          headers: { Authorization: getAccessToken() },
        });

        const fetchedEvents = response.data;

        const eventsWithMaps = await Promise.all(
          fetchedEvents.map(async (event) => {
            try {
              const mapResponse = await axios.get(
                `${BASE_URL}/map/${hostId}/${event.eventId}`,
                {
                  headers: { Authorization: getAccessToken() },
                }
              );
              event.map = mapResponse.data.mainTemplate; // Gắn bản đồ vào event
            } catch (error) {
              console.error(
                `Error fetching map for event ${event.eventId}:`,
                error
              );
              event.map = null;
            }
            return event;
          })
        );

        setEvents(eventsWithMaps);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEventsWithMaps();
  }, [hostId]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Hiển thị 3 bản đồ mỗi lần
    slidesToScroll: 1, // Cuộn 1 sự kiện mỗi lần
    arrows: true, // Hiển thị nút qua lại
  };

  return (
    <Box
      maxW="50%" // Đặt giới hạn chiều rộng
      overflow="hidden" // Ngăn tràn viền
      p={4} // Padding xung quanh
      bg="white"
      borderRadius="md"
      boxShadow="md"
    >
      <Slider {...settings}>
        {events.map((event) => (
          <Box
            key={event.eventId}
            p={2}
            border="1px solid"
            borderRadius="md"
            boxShadow="md"
            textAlign="center"
            m={2}
          >
            <Text fontWeight="bold" mb={2}>
              {event.name}
            </Text>
            {event.map ? (
              <Flex
                justify="center"
                align="center"
                style={{
                  width: "150px", // Kích thước cố định nhỏ hơn
                  height: "150px",
                  backgroundColor: event.map.fillColor || "gray",
                  border: "1px solid black",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: `${event.map.width / 10}px`,
                    height: `${event.map.height / 10}px`,
                    position: "absolute",
                    left: `${event.map.x / 10}px`,
                    top: `${event.map.y / 10}px`,
                    backgroundColor: event.map.fillColor || "blue",
                  }}
                ></div>
              </Flex>
            ) : (
              <Text color="red">Map not available</Text>
            )}
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default EventLocationSlider;
