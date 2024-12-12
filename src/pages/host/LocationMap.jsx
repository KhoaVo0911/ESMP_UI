// import React, { useEffect, useState } from "react";
// import { Button, Box, Flex, Text, Tooltip } from "@chakra-ui/react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import axios from "axios";

// const BASE_URL = "https://esmpbe.id.vn/api";

// const LocationMap = () => {
//   const location = useLocation();
//   const accessToken =
//     location.state?.accessToken || sessionStorage.getItem("accessToken") || "";
//   const hostId =
//     location.state?.hostId || sessionStorage.getItem("hostId") || "";
//   const { eventId } = useParams();
//   const [isMapExists, setIsMapExists] = useState(false);
//   const [booths, setBooths] = useState([]);
//   const [shapes, setShapes] = useState([]);
//   const [textElements, setTextElements] = useState([]);
//   const [imageElements, setImageElements] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           `${BASE_URL}/map/${hostId}/${eventId}`,
//           {
//             headers: {
//               Authorization: accessToken,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         const apiData = response.data;
//         if (apiData) {
//           setIsMapExists(true);
//           setBooths(apiData.booths || []);
//           setShapes(apiData.shapes || []);
//           setTextElements(apiData.textElements || []);
//           setImageElements(apiData.imageElements || []);
//         }
//       } catch (error) {
//         console.error("Error fetching data from API:", error);
//       }
//     };

//     fetchData();
//   }, [hostId, eventId, accessToken]);

//   const handleCreateMap = () => {
//     navigate(`/event/${eventId}/booth-plan/create`);
//   };

//   const handleEditMap = () => {
//     navigate(`/event/${eventId}/booth-plan/edit`);
//   };

//   const renderShape = (shape) => {
//     switch (shape.type) {
//       case "circle":
//         return (
//           <Box
//             key={shape.id}
//             position="absolute"
//             left={`${shape.x}px`}
//             top={`${shape.y}px`}
//             width={`${shape.width}px`}
//             height={`${shape.height}px`}
//             borderRadius="50%"
//             border="1px dashed #444"
//             bg="rgba(0, 0, 0, 0.1)"
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//           >
//             {shape.name}
//           </Box>
//         );
//       case "triangle":
//         return (
//           <Box
//             key={shape.id}
//             position="absolute"
//             left={`${shape.x}px`}
//             top={`${shape.y}px`}
//             width="0"
//             height="0"
//             borderLeft={`${shape.width / 2}px solid transparent`}
//             borderRight={`${shape.width / 2}px solid transparent`}
//             borderBottom={`${shape.height}px solid rgba(0, 0, 0, 0.1)`}
//           >
//             {shape.name}
//           </Box>
//         );
//       default:
//         return (
//           <Box
//             key={shape.id}
//             position="absolute"
//             left={`${shape.x}px`}
//             top={`${shape.y}px`}
//             width={`${shape.width}px`}
//             height={`${shape.height}px`}
//             border="1px dashed #444"
//             bg="rgba(0, 0, 0, 0.1)"
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//           >
//             {shape.name}
//           </Box>
//         );
//     }
//   };

//   return (
//     <Flex
//       direction="column"
//       align="center"
//       justify="center"
//       width="100%"
//       bg="#f5f7fa"
//       p={6}
//     >
//       <Flex
//         justify="space-between"
//         align="center"
//         width="80%"
//         mb={4}
//         pb={2}
//         borderBottom="1px solid #e2e8f0"
//       >
//         <Flex gap={6}>
//           <Flex align="center">
//             <Box
//               bg="green.200"
//               border="1px solid black"
//               borderRadius="50%"
//               width="10px"
//               height="10px"
//               mr={2}
//             />
//             <Text fontSize="sm">Available</Text>
//           </Flex>
//           <Flex align="center">
//             <Box
//               bg="red.300"
//               borderRadius="50%"
//               width="10px"
//               height="10px"
//               mr={2}
//             />
//             <Text fontSize="sm">Booked</Text>
//           </Flex>
//           <Flex align="center">
//             <Box
//               bg="gray.500"
//               borderRadius="50%"
//               width="10px"
//               height="10px"
//               mr={2}
//             />
//             <Text fontSize="sm">On Hold</Text>
//           </Flex>
//         </Flex>
//         {isMapExists ? (
//           <Flex gap={2}>
//             <Button onClick={handleEditMap} colorScheme="teal" size="sm">
//               Edit
//             </Button>
//             <Button
//               onClick={() => setIsMapExists(false)}
//               colorScheme="red"
//               size="sm"
//             >
//               Delete
//             </Button>
//           </Flex>
//         ) : (
//           <Button onClick={handleCreateMap} colorScheme="blue" size="sm">
//             Create Map
//           </Button>
//         )}
//       </Flex>
//       {isMapExists && (
//         <Box
//           border="1px solid #ddd"
//           width="1200px"
//           height="800px"
//           position="relative"
//           bg="#e7f3ff"
//           borderRadius="md"
//           overflow="hidden"
//           boxShadow="inner"
//         >
//           {booths.map((booth) => (
//             <Tooltip label={`Booth: ${booth.name}`} key={booth.id}>
//               <Box
//                 position="absolute"
//                 left={`${booth.x}px`}
//                 top={`${booth.y}px`}
//                 width={`${booth.width}px`}
//                 height={`${booth.height}px`}
//                 bg="blue.300"
//                 border="1px solid #333"
//                 display="flex"
//                 alignItems="center"
//                 justifyContent="center"
//                 borderRadius="md"
//                 boxShadow="md"
//                 fontSize="xs"
//                 color="white"
//                 fontWeight="bold"
//               >
//                 {booth.name}
//               </Box>
//             </Tooltip>
//           ))}
//           {shapes.map((shape) => renderShape(shape))}
//         </Box>
//       )}
//     </Flex>
//   );
// };

// export default LocationMap;

// import React, { useEffect, useState } from "react";
// import { Box, Flex, Text, Button, useColorModeValue } from "@chakra-ui/react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import SelectBooth from "../../components/vendor/EventDetail/SelectBooth"; // Assuming SelectBooth is a separate component

// const BASE_URL = "https://esmpbe.id.vn/api";

// const LocationMap = () => {
//   const location = useLocation();
//   const accessToken =
//     location.state?.accessToken || sessionStorage.getItem("accessToken") || "";
//   const hostId =
//     location.state?.hostId || sessionStorage.getItem("hostId") || "";
//   const { eventId } = useParams();
//   const [isMapExists, setIsMapExists] = useState(false);
//   const [boothData, setBoothData] = useState([]);
//   const [shapes, setShapes] = useState([]);
//   const [textElements, setTextElements] = useState([]);
//   const [imageElements, setImageElements] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           `${BASE_URL}/map/${hostId}/${eventId}`,
//           {
//             headers: {
//               Authorization: accessToken,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         const apiData = response.data;
//         if (apiData) {
//           setIsMapExists(true);
//           setBoothData(apiData.booths || []);
//           setShapes(apiData.shapes || []);
//           setTextElements(apiData.textElements || []);
//           setImageElements(apiData.imageElements || []);
//         }
//       } catch (error) {
//         console.error("Error fetching data from API:", error);
//       }
//     };

//     fetchData();
//   }, [hostId, eventId, accessToken]);

//   const handleCreateMap = () => {
//     navigate(`/event/${eventId}/booth-plan/create`);
//   };

//   const handleEditMap = () => {
//     navigate(`/event/${eventId}/booth-plan/edit`);
//   };

//   const bgColor = useColorModeValue("white", "gray.800");

//   return (
//     <Flex
//       direction="column"
//       align="center"
//       justify="center"
//       width="100%"
//       bg="#f5f7fa"
//       p={6}
//     >
//       <Flex
//         justify="space-between"
//         align="center"
//         width="80%"
//         mb={4}
//         pb={2}
//         borderBottom="1px solid #e2e8f0"
//       >
//         <Flex gap={6}>
//           <Flex align="center">
//             <Box
//               bg="green.200"
//               border="1px solid black"
//               borderRadius="50%"
//               width="10px"
//               height="10px"
//               mr={2}
//             />
//             <Text fontSize="sm">Available</Text>
//           </Flex>
//           <Flex align="center">
//             <Box
//               bg="red.300"
//               borderRadius="50%"
//               width="10px"
//               height="10px"
//               mr={2}
//             />
//             <Text fontSize="sm">Booked</Text>
//           </Flex>
//           <Flex align="center">
//             <Box
//               bg="gray.500"
//               borderRadius="50%"
//               width="10px"
//               height="10px"
//               mr={2}
//             />
//             <Text fontSize="sm">On Hold</Text>
//           </Flex>
//         </Flex>
//         {isMapExists ? (
//           <Flex gap={2}>
//             <Button onClick={handleEditMap} colorScheme="teal" size="sm">
//               Edit
//             </Button>
//             <Button
//               onClick={() => setIsMapExists(false)}
//               colorScheme="red"
//               size="sm"
//             >
//               Delete
//             </Button>
//           </Flex>
//         ) : (
//           <Button onClick={handleCreateMap} colorScheme="blue" size="sm">
//             Create Map
//           </Button>
//         )}
//       </Flex>

//       {isMapExists && (
//         <Box
//           border="1px solid #ddd"
//           width="1200px"
//           height="800px"
//           position="relative"
//           bg="#e7f3ff"
//           borderRadius="md"
//           overflow="hidden"
//           boxShadow="inner"
//         >
//           {boothData.map((booth) => (
//             <div
//               key={booth.location.locationId}
//               style={{
//                 position: "absolute",
//                 left: `${booth.location.x}px`,
//                 top: `${booth.location.y}px`,
//                 width: `${booth.location.width}px`,
//                 height: `${booth.location.height}px`,
//                 backgroundColor:
//                   booth.location.status === "Booked"
//                     ? "gray"
//                     : booth.location.status === "On-hold"
//                     ? "orange"
//                     : "blue",
//                 color: "white",
//                 textAlign: "center",
//                 lineHeight: `${booth.location.height}px`,
//                 border: "1px solid black",
//                 cursor:
//                   booth.location.status === "Booked"
//                     ? "not-allowed"
//                     : "pointer",
//               }}
//               onClick={() => setBoothData([booth])} // Here, we'll set the selected booth in boothData
//             >
//               {booth.name}
//             </div>
//           ))}
//           {shapes.map((shape) => (
//             <div
//               key={shape.location.locationId}
//               style={{
//                 width: `${shape.location.width}px`,
//                 height: `${shape.location.height}px`,
//                 position: "absolute",
//                 left: `${shape.location.x}px`,
//                 top: `${shape.location.y}px`,
//                 backgroundColor: "lightgray",
//                 border: "1px solid black",
//                 transform: `rotate(${shape.location.rotation || 0}deg)`,
//               }}
//             >
//               {shape.name}
//             </div>
//           ))}
//           {textElements.map((text) => (
//             <div
//               key={text.location.locationId}
//               style={{
//                 position: "absolute",
//                 left: `${text.location.x}px`,
//                 top: `${text.location.y}px`,
//                 fontSize: "14px",
//                 fontWeight: "bold",
//                 color: "black",
//                 transform: `rotate(${text.location.rotation || 0}deg)`,
//               }}
//             >
//               {text.name}
//             </div>
//           ))}
//           {imageElements.map((image) => (
//             <img
//               key={image.location.locationId}
//               src={image.url}
//               alt={image.name}
//               style={{
//                 position: "absolute",
//                 left: `${image.location.x}px`,
//                 top: `${image.location.y}px`,
//                 width: `${image.location.width}px`,
//                 height: `${image.location.height}px`,
//                 transform: `rotate(${image.location.rotation || 0}deg)`,
//               }}
//             />
//           ))}
//         </Box>
//       )}

//       {/* Render SelectBooth Component if there is a booth selected */}
//       {boothData.length > 0 && (
//         <SelectBooth boothData={boothData} setBoothData={setBoothData} />
//       )}
//     </Flex>
//   );
// };

// export default LocationMap;

import React, { useEffect, useState } from "react";
import { Box, Flex, Text, Button, useColorModeValue } from "@chakra-ui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BoothDetailsHost from "../../components/host/booth/BoothDetailsHost";

const BASE_URL = "https://esmpbe.id.vn/api";
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const LocationMap = () => {
  const location = useLocation();
  const accessToken =
    location.state?.accessToken || sessionStorage.getItem("accessToken") || "";
  const hostId =
    location.state?.hostId || sessionStorage.getItem("hostId") || "";
  const { eventId } = useParams();
  const [isMapExists, setIsMapExists] = useState(false);
  const [boothData, setBoothData] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [textElements, setTextElements] = useState([]);
  const [imageElements, setImageElements] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState(null); // State to hold selected booth
  const [boothTypeDetails, setBoothTypeDetails] = useState(null); // State to hold booth type details
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const navigate = useNavigate();
  const [eventName, setEventName] = useState("");
  const [locationTypes, setLocationTypes] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${BASE_URL}/map/${hostId}/${eventId}`,
  //         {
  //           headers: {
  //             Authorization: accessToken,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       const apiData = response.data;
  //       if (apiData) {
  //         setIsMapExists(true);
  //         setBoothData(apiData.booths || []);
  //         setShapes(apiData.shapes || []);
  //         setTextElements(apiData.textElements || []);
  //         setImageElements(apiData.imageElements || []);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data from API:", error);
  //     }
  //   };

  //   fetchData();
  // }, [hostId, eventId, accessToken]);
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // Gửi yêu cầu đến API để lấy thông tin chi tiết sự kiện (bao gồm cả tên sự kiện)
        const eventResponse = await axios.get(`${BASE_URL}/event/${eventId}`, {
          headers: {
            Authorization: accessToken,
            "Content-Type": "application/json",
          },
        });

        if (eventResponse.data) {
          setEventName(eventResponse.data.name || "Event Name"); // Lưu tên sự kiện vào state
        }

        // Tiếp tục với các yêu cầu API khác nếu cần
        const mapResponse = await axios.get(
          `${BASE_URL}/map/${hostId}/${eventId}`,
          {
            headers: {
              Authorization: accessToken,
              "Content-Type": "application/json",
            },
          }
        );

        const apiData = mapResponse.data;
        if (apiData) {
          setIsMapExists(true);
          setBoothData(apiData.booths || []);
          setShapes(apiData.shapes || []);
          setTextElements(apiData.textElements || []);
          setImageElements(apiData.imageElements || []);
        }
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
    };

    if (eventId) {
      fetchEventData(); // Chỉ thực hiện khi eventId có giá trị
    }
  }, [eventId, hostId, accessToken]);

  useEffect(() => {
    const fetchLocationTypes = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/map/locationType/${hostId}/${eventId}`,
          {
            headers: { Authorization: accessToken },
          }
        );
        setLocationTypes(response.data);
      } catch (error) {
        console.error("Error fetching location types:", error);
      }
    };

    fetchLocationTypes();
  }, [hostId, eventId, accessToken]);

  const handleCreateMap = () => {
    navigate(`/event/${eventId}/booth-plan/create`);
  };

  const handleEditMap = () => {
    navigate(`/event/${eventId}/booth-plan/edit`);
  };

  const handleBoothClick = async (booth) => {
    console.log("Clicked booth:", booth); // Log thông tin booth khi click

    if (booth.location.status === "Booked") {
      try {
        console.log("Fetching details for booked booth..."); // Log khi đang fetch dữ liệu
        // Gọi API để lấy thông tin chi tiết booth đã Booked
        const response = await axios.get(
          `${BASE_URL}/eventpayment/location/${booth.location.locationId}`,
          {
            headers: {
              Authorization: getAccessToken(),
            },
          }
        );
        const boothDetails = response.data;

        console.log("Booth details fetched:", boothDetails); // Log chi tiết booth nhận được

        // Cập nhật thông tin của booth được click
        setSelectedBooth({
          ...booth,
          vendor: boothDetails.vendor || "N/A",
          name: boothDetails.name || booth.name || "N/A",
          status: boothDetails.status || booth.location.status || "N/A",
          price: boothDetails.price || "0",
        });

        setIsModalOpen(true); // Hiển thị modal
      } catch (error) {
        console.error("Error fetching booth details:", error); // Log lỗi khi fetch dữ liệu thất bại
      }
    } else {
      console.log("Booth is not booked. No details to show."); // Log nếu booth không phải trạng thái "Booked"
    }
  };

  const bgColor = useColorModeValue("white", "gray.800");

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
          {/* Hiển thị tên sự kiện bên trái nút Edit */}
          <Text fontSize="xl" fontWeight="bold" color="purple.900">
            {eventName}
          </Text>

          <Flex align="center">
            <Box
              bg="orange"
              borderRadius="50%"
              width="10px"
              height="10px"
              mr={2}
            />
            <Text fontSize="sm">On Hold</Text>
          </Flex>
          <Flex align="center">
            <Box
              bg="gray.500"
              borderRadius="50%"
              width="10px"
              height="10px"
              mr={2}
            />
            <Text fontSize="sm">Booked</Text>
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
          {boothData.map((booth) => (
            <div
              key={booth.location.locationId}
              style={{
                position: "absolute",
                left: `${booth.location.x}px`,
                top: `${booth.location.y}px`,
                width: `${booth.location.width}px`,
                height: `${booth.location.height}px`,
                backgroundColor:
                  booth.location.status === "Booked"
                    ? "gray"
                    : booth.location.status === "On-hold"
                    ? "orange"
                    : `${booth.color}`,
                color: "black",
                textAlign: "center",
                lineHeight: `${booth.location.height}px`,
                border: "1px solid black",
                cursor: "pointer",
              }}
              onClick={() => handleBoothClick(booth)} // Call the function on booth click
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
        </Box>
      )}

      {/* Render SelectBooth Component if there is a booth selected */}
      {/* {selectedBooth && isModalOpen && (
        <BoothDetailsHost
          locationId={selectedBooth.location.locationId}
          onClose={() => setIsModalOpen(false)}
        />
      )} */}
      {selectedBooth && isModalOpen && (
        <>
          <BoothDetailsHost
            locationId={selectedBooth.location.locationId}
            onClose={() => setIsModalOpen(false)}
          />
          {console.log("Selected Booth for modal:", selectedBooth)}
        </>
      )}
    </Flex>
  );
};

export default LocationMap;
