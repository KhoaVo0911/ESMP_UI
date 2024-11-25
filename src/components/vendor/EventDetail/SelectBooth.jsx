import React, { useState, useEffect } from "react";
import { Box, Flex, Heading, useColorModeValue } from "@chakra-ui/react";
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

const BASE_URL =
  "https://esmpbe.id.vn/api";
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const SelectBooth = () => {
  const location = useLocation();
  const eventId = location.state?.eventId;
  const hostId = sessionStorage.getItem("hostId");

  const { isOpen, onOpen, onClose } = useDisclosure(); // Quản lý trạng thái Modal
  const [booths, setBooths] = useState([]);
  const [shapes, setShapes] = useState([]); // State cho shapes
  const [textElements, setTextElements] = useState([]); // State cho text elements
  const [imageElements, setImageElements] = useState([]); // State cho image elements
  const [mainTemplate, setMainTemplate] = useState(null);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [locationTypes, setLocationTypes] = useState([]);
  const [boothTypeDetails, setBoothTypeDetails] = useState(null);
  const [eventName, setEventName] = useState("");
  const [view, setView] = useState("details");
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
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
        setShapes(mapData.shapes || []); // Lấy shapes
        setTextElements(mapData.textElements || []); // Lấy text elements
        setImageElements(mapData.imageElements || []); // Lấy image elements
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

    fetchData();
  }, [eventId, hostId]);

  const handleBoothClick = (booth) => {
    setSelectedBooth(booth);

    const typeDetails = locationTypes.find(
      (type) => type.typeId === booth.location.typeId
    );

    setBoothTypeDetails({
      ...typeDetails,
      locationId: booth.location.locationId,
    });

    console.log("Selected Booth:", booth);
    console.log("Booth Type Details:", {
      ...typeDetails,
      locationId: booth.location.locationId,
    });
    onOpen(); // Hiển thị Modal khi nhấn vào Booth
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
                      ? "gray"
                      : booth.location.status === "On-hold"
                      ? "orange"
                      : "blue",
                  color: "white",
                  textAlign: "center",
                  lineHeight: `${booth.location.height}px`,
                  border: "1px solid black",
                  cursor:
                    booth.location.status === "Booked" || isBooking
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

      {/* Popup */}
      <Modal
  isOpen={isOpen}
  onClose={async () => {
    if (selectedBooth) {
      try {
        // Cập nhật trạng thái booth thành Available khi tắt popup
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
    setView("details"); // Reset view về details
    onClose(); // Đóng popup
  }}
  size="xl"
  isCentered
  closeOnOverlayClick={false} // Không cho tắt khi click ra ngoài
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
            setView("policy"); // Chuyển sang view policy
          }}
        />
      )}
      {view === "policy" && (
        <Policy
          onBack={() => setView("details")} // Trở về details khi nhấn Back
          onProceedToPayment={async () => {
            // Trước khi chuyển sang Payment, đặt trạng thái thành On-hold
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
                console.log("Status updated to On-hold");
              } catch (error) {
                console.error("Error updating status to On-hold:", error);
              }
            }
            setView("payment"); // Chuyển sang view payment
          }}
        />
      )}
      {view === "payment" && (
        <BoothPayment
          boothTypeDetails={boothTypeDetails}
          onBackToPolicy={() => setView("policy")} // Trở về policy khi nhấn Back
          onPaymentComplete={async () => {
            await handleCompletePayment(); // Thanh toán thành công
            setView("details"); // Quay về details
            onClose(); // Đóng popup
          }}
          eventId={eventId}
        />
      )}
    </ModalBody>
    <ModalFooter>
      <Button
        colorScheme="blue"
        onClick={async () => {
          // Khi nhấn Close, cập nhật status thành Available
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
          setView("details"); // Reset view về details
          onClose(); // Đóng popup
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
