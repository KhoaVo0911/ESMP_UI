import React, { useEffect, useState, useRef } from "react";
import { Button, Box, Flex, Text, Tooltip } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getLocationMapByEventId,
  deleteLocationMap,
  createLocationMap,
  updateLocationMap,
} from "../../shared/locationMapApi";

const LocationMap = () => {
  const [isMapExists, setIsMapExists] = useState(false);
  const [booths, setBooths] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [textElements, setTextElements] = useState([]);
  const [imageElements, setImageElements] = useState([]);
  const [locationMapId, setLocationMapId] = useState(null);
  const navigate = useNavigate();
  const { eventId } = useParams();
  const mapContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiData = await getLocationMapByEventId(eventId);
        if (apiData && apiData.length > 0) {
          setIsMapExists(true);
          setBooths(apiData[0].booths || []);
          setShapes(apiData[0].shapes || []);
          setTextElements(apiData[0].textElements || []);
          setImageElements(apiData[0].imageElements || []);
          setLocationMapId(apiData[0].locationId || null);
        }
      } catch (error) {
        console.error("Error fetching data from API or localStorage:", error);
      }
    };

    fetchData();
  }, [eventId]);

  const handleCreateMap = () => {
    navigate(`/event/${eventId}/booth-plan/create`);
  };

  const handleEditMap = () => {
    navigate(`/event/${eventId}/booth-plan/edit`);
  };

  const handleDeleteMap = async () => {
    if (window.confirm("Are you sure you want to delete this map?")) {
      try {
        if (eventId && locationMapId) {
          // Xóa dữ liệu từ API
          await deleteLocationMap(locationMapId);
          // Xóa dữ liệu từ localStorage
          localStorage.removeItem(`boothPlanData_${eventId}`);

          // Cập nhật state để hiển thị Create Map và xóa dữ liệu hiện có
          setIsMapExists(false);
          setBooths([]);
          setShapes([]);
          setTextElements([]);
          setImageElements([]);
          setLocationMapId(null);

          alert("Map đã xóa thành công!");
        } else {
          console.error("Missing Event ID or Location Map ID.");
        }
      } catch (error) {
        console.error("Error deleting data:", error);
        alert("Đã xảy ra lỗi khi xóa map. Vui lòng thử lại sau.");
      }
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPosition({ x: e.clientX, y: e.clientY });
    if (mapContainerRef.current) {
      mapContainerRef.current.style.cursor = "grabbing";
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startPosition.x;
    const dy = e.clientY - startPosition.y;
    if (mapContainerRef.current) {
      mapContainerRef.current.scrollLeft -= dx;
      mapContainerRef.current.scrollTop -= dy;
    }
    setStartPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (mapContainerRef.current) {
      mapContainerRef.current.style.cursor = "grab";
    }
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
            <Button onClick={handleDeleteMap} colorScheme="red" size="sm">
              Delete
            </Button>
          </Flex>
        ) : (
          <Button onClick={handleCreateMap} colorScheme="blue" size="sm">
            Create Map
          </Button>
        )}
      </Flex>
      <Box
        border="1px solid #ddd"
        width="1200px"
        height="800px"
        position="relative"
        bg="#e7f3ff"
        borderRadius="md"
        overflow="hidden"
        boxShadow="inner"
        ref={mapContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
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
    </Flex>
  );
};

export default LocationMap;
