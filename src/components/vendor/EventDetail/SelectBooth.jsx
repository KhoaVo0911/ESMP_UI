import React, { useState, useEffect } from "react";
import { Box, Flex, Heading, useColorModeValue } from "@chakra-ui/react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import BoothDetails from "./BoothDetails";
import Policy from "./Policy";
import BoothPayment from "./BoothPayment";

const BASE_URL =
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api";
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const SelectBooth = () => {
  const location = useLocation();
  const eventId = location.state?.eventId;
  const hostId = sessionStorage.getItem("hostId");

  const [booths, setBooths] = useState([]);
  const [mainTemplate, setMainTemplate] = useState(null);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [locationTypes, setLocationTypes] = useState([]);
  const [boothTypeDetails, setBoothTypeDetails] = useState(null);
  const [eventName, setEventName] = useState("");
  const [view, setView] = useState("details");
  const [isBooking, setIsBooking] = useState(false);

  // Fetch dữ liệu map và loại booth
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

  // Xử lý khi nhấn vào một booth
  const handleBoothClick = (booth) => {
    setSelectedBooth(booth);
  
    const typeDetails = locationTypes.find(
      (type) => type.typeId === booth.location.typeId
    );
  
    setBoothTypeDetails({
      ...typeDetails,
      locationId: booth.location.locationId, // Thiết lập locationId
    });
  
    console.log("Selected Booth:", booth);
    console.log("Booth Type Details:", {
      ...typeDetails,
      locationId: booth.location.locationId,
    });
  };
  

  // Đặt trạng thái booth là "On-hold" khi nhấn Book Booth
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

      setView("policy"); // Chuyển sang Policy
    } catch (error) {
      console.error("Error updating booth status:", error);
      setIsBooking(false);
    }
  };

  // Khi quay lại từ Policy, đặt trạng thái booth về Available
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

      setIsBooking(false); // Cho phép chọn booth khác
      setView("details");
    } catch (error) {
      console.error("Error resetting booth status:", error);
    }
  };

  // Khi thanh toán thành công, đổi trạng thái booth thành Booked
  const handleCompletePayment = async () => {
    try {
      // Cập nhật trạng thái booth thành "Booked"
      await axios.put(
        `${BASE_URL}/map`,
        {
          locationId: selectedBooth.location.locationId,
          status: "Booked",
        },
        { headers: { Authorization: getAccessToken() } }
      );

      // Tạo vendorInEvent
      const vendorInEventResponse = await axios.post(
        `${BASE_URL}/vendorinevent/${sessionStorage.getItem(
          "vendorId"
        )}/${eventId}`,
        {},
        { headers: { Authorization: getAccessToken() } }
      );
      const vendorInEventId = vendorInEventResponse.data.id;

      // Gửi payment data
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
      setView("details"); // Quay về trang chính
    } catch (error) {
      console.error("Error during payment process:", error);
    }
  };

  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <Flex
      direction="column"
      bg={useColorModeValue("gray.50", "gray.900")}
      minH="90vh"
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
        {/* Hiển thị map */}
        <Box flex="3" p={4}>
          <Heading textAlign="center" color="teal.600">
            {eventName} Map
          </Heading>
          <div id="map-container" style={{ position: "relative" }}>
            {mainTemplate && booths.length > 0 && (
              <div>
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
              </div>
            )}
          </div>
        </Box>
        {/* Hiển thị chi tiết */}
        {view === "details" && (
          <BoothDetails
            selectedBooth={selectedBooth}
            boothTypeDetails={boothTypeDetails}
            onBookBooth={handleBookBooth}
          />
        )}
        {view === "policy" && (
          <Policy
            onBack={handleBackToPolicy}
            onProceedToPayment={() => setView("payment")}
          />
        )}
        {view === "payment" && (
          <BoothPayment
            boothTypeDetails={boothTypeDetails}
            onBackToPolicy={handleBackToPolicy}
            onPaymentComplete={handleCompletePayment}
            eventId={eventId}
            
          />
          
        )}
       
      </Flex>
    </Flex>
  );
};

export default SelectBooth;
