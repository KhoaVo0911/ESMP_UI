import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Text } from "@chakra-ui/react";
import { Rnd } from "react-rnd";

const BASE_URL = "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api";
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const BoothPlanView = () => {
  const hostId = sessionStorage.getItem("hostId");
  const eventId = "f588ae9e-92cc-4f4b-8a6e-abec52e5f68a";

  const [booths, setBooths] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [imageElements, setImageElements] = useState([]);
  const [textElements, setTextElements] = useState([]);
  const [mainTemplate, setMainTemplate] = useState(null);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!hostId) {
          console.error("hostId not found in sessionStorage");
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/map/${hostId}/${eventId}`,
          {
            headers: { Authorization: getAccessToken() },
          }
        );
        const data = response.data;

        if (data) {
          setBooths(data.booths || []);
          setShapes(data.shapes || []);
          setImageElements(data.imageElements || []);
          setTextElements(data.textElements || []);
          setMainTemplate(data.mainTemplate || null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [hostId, eventId]);

  const handleBoothClick = (booth) => {
    setSelectedBooth(booth);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooth(null);
  };

  return (
    <Box position="relative" bg="white" p={4} height="100vh">
      {/* Hiển thị Main Template */}
      {mainTemplate && (
        <Rnd
          size={{ width: mainTemplate.width, height: mainTemplate.height }}
          position={{ x: mainTemplate.x, y: mainTemplate.y }}
          style={{
            transform: `rotate(${mainTemplate.rotation || 0}deg)`,
            border: "1px solid #000",
            backgroundColor: mainTemplate.fillColor || "transparent",
          }}
          disableDragging
          enableResizing={false}
        />
      )}
      {/* Hiển thị Booths */}
      {booths.map((booth) => (
        <Rnd
          key={booth.location.locationId}
          size={{ width: booth.location.width, height: booth.location.height }}
          position={{ x: booth.location.x || 0, y: booth.location.y || 0 }}
          style={{
            transform: `rotate(${booth.location.rotation || 0}deg)`,
            backgroundColor: "#00f",
            border: "1px solid #000",
            color: "#fff",
            textAlign: "center",
            cursor: "pointer",
          }}
          disableDragging
          enableResizing={false}
          onClick={() => handleBoothClick(booth)}
        >
          <div>{booth.name}</div>
        </Rnd>
      ))}

      {/* Popup Chi tiết Booth */}
      {selectedBooth && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Booth Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontWeight="bold">Name:</Text>
              <Text>{selectedBooth.name}</Text>
              <Text fontWeight="bold" mt={2}>
                Location ID:
              </Text>
              <Text>{selectedBooth.location.locationId}</Text>
              <Text fontWeight="bold" mt={2}>
                Dimensions:
              </Text>
              <Text>
                Width: {selectedBooth.location.width}px, Height:{" "}
                {selectedBooth.location.height}px
              </Text>
              <Text fontWeight="bold" mt={2}>
                Position:
              </Text>
              <Text>
                X: {selectedBooth.location.x}, Y: {selectedBooth.location.y}
              </Text>
              <Text fontWeight="bold" mt={2}>
                Status:
              </Text>
              <Text>{selectedBooth.location.status}</Text>
              <Text fontWeight="bold" mt={2}>
                Rotation:
              </Text>
              <Text>{selectedBooth.location.rotation}°</Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={closeModal}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default BoothPlanView;
