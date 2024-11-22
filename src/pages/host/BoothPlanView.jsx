import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import { Rnd } from "react-rnd";

const BASE_URL = "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api";
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const BoothPlanView = () => {
  // Lấy hostId từ sessionStorage
  const hostId = sessionStorage.getItem("hostId");
  const eventId = "f588ae9e-92cc-4f4b-8a6e-abec52e5f68a";

  const [booths, setBooths] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [imageElements, setImageElements] = useState([]);
  const [textElements, setTextElements] = useState([]);
  const [mainTemplate, setMainTemplate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Kiểm tra nếu hostId không tồn tại
        if (!hostId) {
          console.error("hostId not found in sessionStorage");
          return;
        }

        // Gọi API lấy dữ liệu
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
          }}
          disableDragging
          enableResizing={false}
        >
          <div>{booth.name}</div>
        </Rnd>
      ))}
    </Box>
  );
};

export default BoothPlanView;
