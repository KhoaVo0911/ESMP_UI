import React, { useState, useEffect } from "react";
import { Box, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

import axios from "axios";
import { useLocation } from "react-router-dom";
import BoothDetails from "./BoothDetails";
import Policy from "./Policy";
import BoothPayment from "./BoothPayment";

const BASE_URL = "https://esmpbe.id.vn/api";
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const SelectBooth = () => {
  const location = useLocation();
  const eventId = location.state?.eventId;
  const hostId = sessionStorage.getItem("hostId");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [booths, setBooths] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [textElements, setTextElements] = useState([]);
  const [imageElements, setImageElements] = useState([]);
  const [mainTemplate, setMainTemplate] = useState(null);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [locationTypes, setLocationTypes] = useState([]);
  const [boothTypeDetails, setBoothTypeDetails] = useState(null);
  const [eventName, setEventName] = useState("");
  const [view, setView] = useState("details");
  const [isBooking, setIsBooking] = useState(false);

  // Hàm lấy dữ liệu mới sau khi thay đổi trạng thái booth
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

  const handleBoothClick = (booth) => {
    if (booth.location.status === "Booked" || booth.location.status === "On-hold") {
      return; // Không cho phép click nếu booth đã được "Booked" hoặc "On-hold"
    }

    setSelectedBooth(booth);
    const typeDetails = locationTypes.find(
      (type) => type.typeId === booth.location.typeId
    );
    setBoothTypeDetails({
      ...typeDetails,
      locationId: booth.location.locationId,
    });

    onOpen();
  };

  const getBoothColor = (typeId) => {
    const type = locationTypes.find((type) => type.typeId === typeId);
    return type ? type.color : "gray"; // Mặc định màu xám nếu không tìm thấy
  };

  const handleBookBooth = async () => {
    if (!selectedBooth) return;

    setIsBooking(true);
    try {
      await axios.put(
        `${BASE_URL}/map`,
        {
          locationId: selectedBooth.location.locationId,
          status: "On-hold",
        },
        { headers: { Authorization: getAccessToken() } }
      );

      // Gọi lại fetchData để cập nhật trạng thái của booth
      await fetchData();

      setView("policy");
    } catch (error) {
      console.error("Error updating booth status:", error);
      setIsBooking(false);
    }
  };

  const handleBackToPolicy = async () => {
    if (!selectedBooth) return;

    try {
      await axios.put(
        `${BASE_URL}/map`,
        {
          locationId: selectedBooth.location.locationId,
          status: "Available",
        },
        { headers: { Authorization: getAccessToken() } }
      );

      // Gọi lại fetchData để cập nhật lại trạng thái
      await fetchData();

      setIsBooking(false);
      setView("details");
    } catch (error) {
      console.error("Error resetting booth status:", error);
    }
  };

  const handleCompletePayment = async () => {
    try {
      await axios.put(
        `${BASE_URL}/map`,
        {
          locationId: selectedBooth.location.locationId,
          status: "Booked",
        },
        { headers: { Authorization: getAccessToken() } }
      );

      const vendorInEventResponse = await axios.post(
        `${BASE_URL}/vendorinevent/${sessionStorage.getItem(
          "vendorId"
        )}/${eventId}`,
        {},
        { headers: { Authorization: getAccessToken() } }
      );
      const vendorInEventId = vendorInEventResponse.data.id;

      await axios.post(
        `${BASE_URL}/eventpayment`,
        {
          deposit: boothTypeDetails.price,
          locationId: selectedBooth.location.locationId,
          vendorinEventId: vendorInEventId,
        },
        { headers: { Authorization: getAccessToken() } }
      );

      // Gọi lại fetchData để cập nhật trạng thái booth sau khi thanh toán
      await fetchData();

      setIsBooking(false);
      alert("Payment successful!");
      setView("details");
    } catch (error) {
      console.error("Error during payment process:", error);
    }
   
  };

  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <Flex
      direction="column"
      bg={useColorModeValue("gray.50", "gray.900")}
      minH="120vh"
      p={6}
    >
      <Heading textAlign="center" mb={4}>
        Select Your Booth
      </Heading>

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
          <Flex
          justify="space-between"
          align="center"
          width="80%"
          mt={4}
          pb={2}
          ml={10}
       
        >
          <Flex gap={6}>
            <Flex align="center">
              <Box
                bg="orange"
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
                   ? "gray" // Nếu booth đã được "Booked", màu xám
                   : booth.location.status === "On-hold"
                   ? "orange" // Nếu booth đang "On-hold", màu cam
                   : getBoothColor(booth.location.typeId), // Nếu không phải "Booked" hay "On-hold", sử dụng màu theo `typeId`
               color: "black",
               textAlign: "center",
               lineHeight: `${booth.location.height}px`,
               border: "1px solid black",
               cursor:
                 booth.location.status === "Booked" || booth.location.status === "On-hold" || isBooking
                   ? "not-allowed"
                   : "pointer",
             }}
             onClick={() => handleBoothClick(booth)}
           >
             {booth.name}
           </div>
           
            ))}
            {shapes.map((shape) => (
              <div
                key={shape.location.locationId}
                style={{
                  width: `${shape.location.width}px`,
                  height: `${shape.location.height}px`,
                  position: "absolute",
                  left: `${shape.location.x}px`,
                  top: `${shape.location.y}px`,
                  backgroundColor: "lightgray",
                  border: "1px solid black",
                  transform: `rotate(${shape.location.rotation || 0}deg)`,
                }}
              >
                {shape.name}
              </div>
            ))}
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

      {/* Modal for booth details, policy, payment */}
      <Modal
        isOpen={isOpen}
        onClose={async () => {
          if (selectedBooth) {
            try {
              await axios.put(
                `${BASE_URL}/map`,
                {
                  locationId: selectedBooth.location.locationId,
                  status: "Available",
                },
                { headers: { Authorization: getAccessToken() } }
              );
              console.log("Status updated to Available");
            } catch (error) {
              console.error("Error updating status to Available:", error);
            }
          }
          setView("details");
          onClose();
        }}
        size="xl"
        isCentered
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {view === "policy" && "Policy"}
            {view === "payment" && "Payment"}
            {view === "details" && "Booth Details"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {view === "details" && (
              <BoothDetails
                selectedBooth={selectedBooth}
                boothTypeDetails={boothTypeDetails}
                onBookBooth={() => {
                  setView("policy");
                }}
              />
            )}
            {view === "policy" && (
              <Policy
                onBack={() => setView("details")}
                onProceedToPayment={async () => {
                  if (selectedBooth) {
                    try {
                      await axios.put(
                        `${BASE_URL}/map`,
                        {
                          locationId: selectedBooth.location.locationId,
                          status: "On-hold",
                        },
                        { headers: { Authorization: getAccessToken() } }
                      );
                    } catch (error) {
                      console.error("Error updating status to On-hold:", error);
                    }
                  }
                  setView("payment");
                }}
              />
            )}
            {view === "payment" && (
              <BoothPayment
                boothTypeDetails={boothTypeDetails}
                onBackToPolicy={() => setView("policy")}
                onPaymentComplete={async () => {
                  await handleCompletePayment();
                  setView("details");
                  onClose();
                }}
                eventId={eventId}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={async () => {
                if (selectedBooth) {
                  try {
                    await axios.put(
                      `${BASE_URL}/map`,
                      {
                        locationId: selectedBooth.location.locationId,
                        status: "Available",
                      },
                      { headers: { Authorization: getAccessToken() } }
                    );
                    console.log("Status updated to Available");
                  } catch (error) {
                    console.error("Error updating status to Available:", error);
                  }
                }
                setView("details");
                onClose();
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default SelectBooth;
