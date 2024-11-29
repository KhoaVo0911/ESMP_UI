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
import SelectBooth from "../../components/vendor/EventDetail/SelectBooth"; // Assuming SelectBooth is a separate component
import BoothDetails from "../../components/vendor/EventDetail/BoothDetails"; // Import BoothDetails

const BASE_URL = "https://esmpbe.id.vn/api";

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
          setBoothData(apiData.booths || []);
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

  const handleBoothClick = (booth) => {
    setSelectedBooth(booth);

    // Fetch booth type details based on selected booth
    const boothDetails = boothData.find(
      (b) => b.location.typeId === booth.location.typeId
    );
    setBoothTypeDetails(boothDetails ? boothDetails.location : null);

    setIsModalOpen(true); // Open the modal to show booth details
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
                    : "blue",
                color: "white",
                textAlign: "center",
                lineHeight: `${booth.location.height}px`,
                border: "1px solid black",
                cursor:
                  booth.location.status === "Booked"
                    ? "not-allowed"
                    : "pointer",
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
      {selectedBooth && boothTypeDetails && isModalOpen && (
        <BoothDetails
          selectedBooth={selectedBooth}
          boothTypeDetails={boothTypeDetails}
          onBookBooth={() => {}}
        />
      )}
    </Flex>
  );
};

export default LocationMap;
