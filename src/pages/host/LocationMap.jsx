import React, { useEffect, useState } from "react";
import { Button, Box, Flex, Text, Tooltip } from "@chakra-ui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BASE_URL =
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api";

const LocationMap = () => {
  const location = useLocation();
  const accessToken =
    location.state?.accessToken || sessionStorage.getItem("accessToken") || "";
  const hostId =
    location.state?.hostId || sessionStorage.getItem("hostId") || "";
  const { eventId } = useParams();
  const [isMapExists, setIsMapExists] = useState(false);
  const [booths, setBooths] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [textElements, setTextElements] = useState([]);
  const [imageElements, setImageElements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/map/${hostId}/${eventId}`,
          {
            headers: {
              Authorization: accessToken,
              "Content-Type": "application/json",
            },
          }
        );
        const apiData = response.data;
        if (apiData) {
          setIsMapExists(true);
          setBooths(apiData.booths || []);
          setShapes(apiData.shapes || []);
          setTextElements(apiData.textElements || []);
          setImageElements(apiData.imageElements || []);
        }
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
    };

    fetchData();
  }, [hostId, eventId, accessToken]);

  const handleCreateMap = () => {
    navigate(`/event/${eventId}/booth-plan/create`);
  };

  const handleEditMap = () => {
    navigate(`/event/${eventId}/booth-plan/edit`);
  };

  const renderShape = (shape) => {
    switch (shape.type) {
      case "circle":
        return (
          <Box
            key={shape.id}
            position="absolute"
            left={`${shape.x}px`}
            top={`${shape.y}px`}
            width={`${shape.width}px`}
            height={`${shape.height}px`}
            borderRadius="50%"
            border="1px dashed #444"
            bg="rgba(0, 0, 0, 0.1)"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {shape.name}
          </Box>
        );
      case "triangle":
        return (
          <Box
            key={shape.id}
            position="absolute"
            left={`${shape.x}px`}
            top={`${shape.y}px`}
            width="0"
            height="0"
            borderLeft={`${shape.width / 2}px solid transparent`}
            borderRight={`${shape.width / 2}px solid transparent`}
            borderBottom={`${shape.height}px solid rgba(0, 0, 0, 0.1)`}
          >
            {shape.name}
          </Box>
        );
      default:
        return (
          <Box
            key={shape.id}
            position="absolute"
            left={`${shape.x}px`}
            top={`${shape.y}px`}
            width={`${shape.width}px`}
            height={`${shape.height}px`}
            border="1px dashed #444"
            bg="rgba(0, 0, 0, 0.1)"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {shape.name}
          </Box>
        );
    }
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      width="100%"
      bg="#f5f7fa"
      p={6}
    >
      <Flex
        justify="space-between"
        align="center"
        width="80%"
        mb={4}
        pb={2}
        borderBottom="1px solid #e2e8f0"
      >
        <Flex gap={6}>
          <Flex align="center">
            <Box
              bg="green.200"
              border="1px solid black"
              borderRadius="50%"
              width="10px"
              height="10px"
              mr={2}
            />
            <Text fontSize="sm">Available</Text>
          </Flex>
          <Flex align="center">
            <Box
              bg="red.300"
              borderRadius="50%"
              width="10px"
              height="10px"
              mr={2}
            />
            <Text fontSize="sm">Booked</Text>
          </Flex>
          <Flex align="center">
            <Box
              bg="gray.500"
              borderRadius="50%"
              width="10px"
              height="10px"
              mr={2}
            />
            <Text fontSize="sm">On Hold</Text>
          </Flex>
        </Flex>
        {isMapExists ? (
          <Flex gap={2}>
            <Button onClick={handleEditMap} colorScheme="teal" size="sm">
              Edit
            </Button>
            <Button
              onClick={() => setIsMapExists(false)}
              colorScheme="red"
              size="sm"
            >
              Delete
            </Button>
          </Flex>
        ) : (
          <Button onClick={handleCreateMap} colorScheme="blue" size="sm">
            Create Map
          </Button>
        )}
      </Flex>
      {isMapExists && (
        <Box
          border="1px solid #ddd"
          width="1200px"
          height="800px"
          position="relative"
          bg="#e7f3ff"
          borderRadius="md"
          overflow="hidden"
          boxShadow="inner"
        >
          {booths.map((booth) => (
            <Tooltip label={`Booth: ${booth.name}`} key={booth.id}>
              <Box
                position="absolute"
                left={`${booth.x}px`}
                top={`${booth.y}px`}
                width={`${booth.width}px`}
                height={`${booth.height}px`}
                bg="blue.300"
                border="1px solid #333"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="md"
                boxShadow="md"
                fontSize="xs"
                color="white"
                fontWeight="bold"
              >
                {booth.name}
              </Box>
            </Tooltip>
          ))}
          {shapes.map((shape) => renderShape(shape))}
        </Box>
      )}
    </Flex>
  );
};

export default LocationMap;
