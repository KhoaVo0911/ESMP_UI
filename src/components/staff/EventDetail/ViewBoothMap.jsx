import React, { useState, useEffect } from "react";
import { Box, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://esmpbe.id.vn/api";
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const ViewBooth = () => {
  const location = useLocation();
  const eventId = location.state?.eventId;
  const hostId = sessionStorage.getItem("hostId");

  const [booths, setBooths] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [textElements, setTextElements] = useState([]);
  const [imageElements, setImageElements] = useState([]);
  const [mainTemplate, setMainTemplate] = useState(null);
  const [locationTypes, setLocationTypes] = useState([]);
  const [eventName, setEventName] = useState("");

  // Hàm lấy dữ liệu mới
  const fetchData = async () => {
    try {
      if (!eventId || !hostId) return;
      const eventResponse = await axios.get(`${BASE_URL}/event/${eventId}`, {
        headers: { Authorization: getAccessToken() },
      });
      setEventName(eventResponse.data.name);
      const mapResponse = await axios.get(
        `${BASE_URL}/map/${hostId}/${eventId}`,
        { headers: { Authorization: getAccessToken() } }
      );
      const mapData = mapResponse.data;
      setBooths(mapData.booths || []);
      setShapes(mapData.shapes || []);
      setTextElements(mapData.textElements || []);
      setImageElements(mapData.imageElements || []);
      setMainTemplate(mapData.mainTemplate || null);

      const typesResponse = await axios.get(
        `${BASE_URL}/map/locationType/${hostId}/${eventId}`,
        { headers: { Authorization: getAccessToken() } }
      );
      setLocationTypes(typesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [eventId, hostId]);

  const getBoothColor = (typeId) => {
    const type = locationTypes.find((type) => type.typeId === typeId);
    return type ? type.color : "gray"; // Mặc định màu xám nếu không tìm thấy
  };

  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <Flex
      direction="column"
      bg={useColorModeValue("gray.50", "gray.900")}
      minH="120vh"
      p={6}
    >
     

      <Flex
        flex="1"
        bg={bgColor}
        borderRadius="md"
        border="1px solid"
        borderColor="gray.200"
        boxShadow="lg"
        overflow="hidden"
        p={4}
      >
        <Box flex="3" p={4}>
          <Heading textAlign="center" color="teal.600">
            {eventName} Map
          </Heading>
          <div id="map-container" style={{ position: "relative" }}>
            <Flex justify="space-between" align="center" width="80%" mt={4} pb={2} ml={10}>
              <Flex gap={6}>
                <Flex align="center">
                  <Box bg="orange" borderRadius="50%" width="10px" height="10px" mr={2} />
                  <Text fontSize="sm">Booked</Text>
                </Flex>
                <Flex align="center">
                  <Box bg="gray.500" borderRadius="50%" width="10px" height="10px" mr={2} />
                  <Text fontSize="sm">On Hold</Text>
                </Flex>
              </Flex>
            </Flex>

            {mainTemplate && (
              <div
                style={{
                  width: `${mainTemplate.width}px`,
                  height: `${mainTemplate.height}px`,
                  position: "absolute",
                  left: `${mainTemplate.x}px`,
                  top: `${mainTemplate.y}px`,
                  backgroundColor: mainTemplate.fillColor || "transparent",
                  border: "1px solid black",
                  transform: `rotate(${mainTemplate.rotation || 0}deg)`,
                }}
              ></div>
            )}

            {booths.map((booth) => (
              <div
                key={booth.location.locationId}
                style={{
                  width: `${booth.location.width}px`,
                  height: `${booth.location.height}px`,
                  position: "absolute",
                  left: `${booth.location.x}px`,
                  top: `${booth.location.y}px`,
                  backgroundColor:
                    booth.location.status === "Booked"
                      ? "gray" // Màu xám cho "Booked"
                      : booth.location.status === "On-hold"
                      ? "orange" // Màu cam cho "On-hold"
                      : getBoothColor(booth.location.typeId), // Lấy màu từ API
                  color: "black",
                  textAlign: "center",
                  lineHeight: `${booth.location.height}px`,
                  border: "1px solid black",
                }}
              >
                {booth.name}
              </div>
            ))}

{shapes.map((shape) => {
            const location = shape.location;
            if (
              !location ||
              location.x === undefined ||
              location.y === undefined
            ) {
              console.warn("Invalid shape data:", shape); // Log cảnh báo nếu dữ liệu shape không hợp lệ
              return null;
            }

            const renderShape = () => {
              switch (shape.name) {
                case "rectangle":
                  return (
                    <rect
                      x={location.x}
                      y={location.y}
                      width={location.width}
                      height={location.height}
                      fill="lightgray"
                      stroke="black"
                    />
                  );
                case "circle":
                  return (
                    <circle
                      cx={location.x + location.width / 2}
                      cy={location.y + location.height / 2}
                      r={Math.min(location.width, location.height) / 2}
                      fill="lightgray"
                      stroke="black"
                    />
                  );
                case "triangle":
                  return (
                    <polygon
                      points={`${location.x},${location.y + location.height} ${
                        location.x + location.width / 2
                      },${location.y} ${location.x + location.width},${
                        location.y + location.height
                      }`}
                      fill="lightgray"
                      stroke="black"
                    />
                  );
                case "pentagon":
                  return (
                    <polygon
                      points={`${location.x + location.width / 2},${location.y} 
              ${location.x + location.width},${
                        location.y + location.height * 0.38
                      } 
              ${location.x + location.width * 0.82},${
                        location.y + location.height
                      } 
              ${location.x + location.width * 0.18},${
                        location.y + location.height
                      } 
              ${location.x},${location.y + location.height * 0.38}`}
                      fill="lightgray"
                      stroke="black"
                    />
                  );
                case "hexagon":
                  return (
                    <polygon
                      points={`${location.x + location.width * 0.5},${
                        location.y
                      } 
              ${location.x + location.width},${
                        location.y + location.height * 0.25
                      } 
              ${location.x + location.width},${
                        location.y + location.height * 0.75
                      } 
              ${location.x + location.width * 0.5},${
                        location.y + location.height
                      } 
              ${location.x},${location.y + location.height * 0.75} 
              ${location.x},${location.y + location.height * 0.25}`}
                      fill="lightgray"
                      stroke="black"
                    />
                  );
                case "star":
                  return (
                    <polygon
                      points={`${location.x + location.width * 0.5},${
                        location.y
                      } 
              ${location.x + location.width * 0.61},${
                        location.y + location.height * 0.35
                      } 
              ${location.x + location.width * 0.98},${
                        location.y + location.height * 0.35
                      } 
              ${location.x + location.width * 0.68},${
                        location.y + location.height * 0.57
                      } 
              ${location.x + location.width * 0.79},${
                        location.y + location.height * 0.91
                      } 
              ${location.x + location.width * 0.5},${
                        location.y + location.height * 0.7
                      } 
              ${location.x + location.width * 0.21},${
                        location.y + location.height * 0.91
                      } 
              ${location.x + location.width * 0.32},${
                        location.y + location.height * 0.57
                      } 
              ${location.x + location.width * 0.02},${
                        location.y + location.height * 0.35
                      } 
              ${location.x + location.width * 0.39},${
                        location.y + location.height * 0.35
                      }`}
                      fill="lightgray"
                      stroke="black"
                    />
                  );
                case "arrow":
                  return (
                    <polygon
                      points={`${location.x + location.width * 0.1},${
                        location.y + location.height * 0.4
                      } 
              ${location.x + location.width * 0.7},${
                        location.y + location.height * 0.4
                      } 
              ${location.x + location.width * 0.7},${
                        location.y + location.height * 0.2
                      } 
              ${location.x + location.width},${
                        location.y + location.height * 0.5
                      } 
              ${location.x + location.width * 0.7},${
                        location.y + location.height * 0.8
                      } 
              ${location.x + location.width * 0.7},${
                        location.y + location.height * 0.6
                      } 
              ${location.x + location.width * 0.1},${
                        location.y + location.height * 0.6
                      }`}
                      fill="lightgray"
                      stroke="black"
                    />
                  );
                default:
                  console.warn("Unsupported shape:", shape.name);
                  return null;
              }
            };

            return (
              <svg
                key={location.locationId}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  overflow: "visible",
                }}
              >
                {renderShape()}
              </svg>
            );
          })}

            {textElements.map((text) => (
              <div
                key={text.location.locationId}
                style={{
                  position: "absolute",
                  left: `${text.location.x}px`,
                  top: `${text.location.y}px`,
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "black",
                  transform: `rotate(${text.location.rotation || 0}deg)`,
                }}
              >
                {text.name}
              </div>
            ))}

            {imageElements.map((image) => (
              <img
                key={image.location.locationId}
                src={image.url}
                alt={image.name}
                style={{
                  position: "absolute",
                  left: `${image.location.x}px`,
                  top: `${image.location.y}px`,
                  width: `${image.location.width}px`,
                  height: `${image.location.height}px`,
                  transform: `rotate(${image.location.rotation || 0}deg)`,
                }}
              />
            ))}
          </div>
        </Box>
      </Flex>
    </Flex>
  );
};

export default ViewBooth;
