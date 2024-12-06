// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   useDisclosure,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   FormControl,
//   FormLabel,
//   Input,
//   Select,
//   FormErrorMessage,
// } from "@chakra-ui/react";
// import axios from "axios";

// const API_BASE_URL = "https://esmpbe.id.vn/api/map";

// const LocationTypeManagement = ({ eventId, hostId }) => {
//   const [locationTypes, setLocationTypes] = useState([]);
//   const [editingType, setEditingType] = useState(null);
//   const [typeName, setTypeName] = useState("");
//   const [price, setPrice] = useState("");
//   const [status, setStatus] = useState("active");
//   const [errors, setErrors] = useState({
//     typeName: "",
//     price: "",
//   });

//   const { isOpen, onOpen, onClose } = useDisclosure();

//   // Fetch Location Types
//   const fetchLocationTypes = async () => {
//     if (eventId && hostId) {
//       try {
//         const response = await axios.get(
//           `${API_BASE_URL}/locationType/${hostId}/${eventId}`,
//           {
//             headers: {
//               Authorization: sessionStorage.getItem("accessToken"),
//             },
//           }
//         );
//         const locationTypesWithColor = response.data.map((type) => ({
//           ...type,
//           color: type.color || typeIdToColor[type.typeId] || "#FFFFFF", // Nếu không có màu sắc, gán màu mặc định
//         }));
//         setLocationTypes(locationTypesWithColor);
//       } catch (error) {
//         console.error("Error fetching location types:", error);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchLocationTypes();
//   }, [eventId, hostId]);

//   const typeIdToColor = {
//     1: "#FF5733", // Indoor - Màu cam
//     2: "#33FF57", // Outdoor - Màu xanh lá
//     3: "#FF33A1", // VIP - Màu hồng
//   };

//   // Handle form validation and save
//   const handleSave = async () => {
//     let formErrors = {};
//     if (!typeName) {
//       formErrors.typeName = "Type name is required.";
//     }

//     if (!price || isNaN(price) || parseFloat(price) < 0) {
//       formErrors.price = "Price must be a valid number and greater than 0.";
//     }

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return; // Stop saving if there are errors
//     }

//     try {
//       if (editingType) {
//         // Update Location Type
//         await axios.put(
//           `${API_BASE_URL}/locationType/${hostId}/${eventId}/${editingType.typeId}`,
//           { typeName, price: parseFloat(price), status },
//           {
//             headers: {
//               Authorization: sessionStorage.getItem("accessToken"),
//               "Content-Type": "application/json",
//             },
//           }
//         );
//       } else {
//         // Add Location Type
//         await axios.post(
//           `${API_BASE_URL}/locationType/${hostId}/${eventId}`,
//           { typeName, price: parseFloat(price), status },
//           {
//             headers: {
//               Authorization: sessionStorage.getItem("accessToken"),
//               "Content-Type": "application/json",
//             },
//           }
//         );
//       }
//       fetchLocationTypes();
//       onClose();
//       resetForm();
//     } catch (error) {
//       console.error("Error saving location type:", error);
//     }
//   };

//   const handleDelete = async (typeId) => {
//     try {
//       await axios.delete(
//         `${API_BASE_URL}/locationType/${hostId}/${eventId}/${typeId}`,
//         {
//           headers: {
//             Authorization: sessionStorage.getItem("accessToken"),
//           },
//         }
//       );
//       fetchLocationTypes();
//     } catch (error) {
//       console.error("Error deleting location type:", error);
//     }
//   };

//   const handleEdit = (type) => {
//     setEditingType(type);
//     setTypeName(type.typeName);
//     setPrice(type.price);
//     setStatus(type.status);
//     onOpen();
//   };

//   const resetForm = () => {
//     setEditingType(null);
//     setTypeName("");
//     setPrice("");
//     setStatus("active");
//     setErrors({
//       typeName: "",
//       price: "",
//     });
//   };

//   return (
//     <Box>
//       <Button colorScheme="blue" mb={4} onClick={onOpen}>
//         Create New Location Type
//       </Button>

//       <Table variant="simple">
//         <Thead>
//           <Tr>
//             <Th>Name</Th>
//             <Th>Price (VND)</Th>
//             <Th>Status</Th>
//             <Th>Action</Th>
//           </Tr>
//         </Thead>
//         <Tbody>
//           {locationTypes.map((type) => {
//             const color = typeIdToColor[type.typeId] || "#FFFFFF";
//             return (
//               <Tr key={type.typeId} style={{ backgroundColor: color }}>
//                 <Td>{type.typeName}</Td>
//                 <Td>{type.price?.toLocaleString("vi-VN")}</Td>
//                 <Td>{type.status}</Td>
//                 <Td>
//                   <Button
//                     size="sm"
//                     colorScheme="teal"
//                     mr={2}
//                     onClick={() => handleEdit(type)}
//                   >
//                     Edit
//                   </Button>
//                   <Button
//                     size="sm"
//                     colorScheme="red"
//                     onClick={() => handleDelete(type.typeId)}
//                   >
//                     Delete
//                   </Button>
//                 </Td>
//               </Tr>
//             );
//           })}
//         </Tbody>
//       </Table>

//       {/* Popup Form */}
//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>
//             {editingType ? "Edit Location Type" : "Create Location Type"}
//           </ModalHeader>
//           <ModalBody>
//             <FormControl isInvalid={errors.typeName} mb={4}>
//               <FormLabel>Type Name</FormLabel>
//               <Input
//                 value={typeName}
//                 onChange={(e) => setTypeName(e.target.value)}
//               />
//               <FormErrorMessage>{errors.typeName}</FormErrorMessage>
//             </FormControl>
//             <FormControl isInvalid={errors.price} mb={4}>
//               <FormLabel>Price</FormLabel>
//               <Input
//                 type="number"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//               />
//               <FormErrorMessage>{errors.price}</FormErrorMessage>
//             </FormControl>
//             <FormControl mb={4}>
//               <FormLabel>Status</FormLabel>
//               <Select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//               >
//                 <option value="active">Active</option>
//                 <option value="blocked">Blocked</option>
//               </Select>
//             </FormControl>
//           </ModalBody>
//           <ModalFooter>
//             <Button colorScheme="blue" onClick={handleSave}>
//               Save
//             </Button>
//             <Button variant="ghost" onClick={onClose}>
//               Cancel
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </Box>
//   );
// };

// export default LocationTypeManagement;

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
  Flex,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { ChromePicker } from "react-color"; // Import react-color library

const API_BASE_URL = "https://esmpbe.id.vn/api/map";

const LocationTypeManagement = ({ eventId, hostId }) => {
  const [locationTypes, setLocationTypes] = useState([]);
  const [editingType, setEditingType] = useState(null);
  const [typeName, setTypeName] = useState("");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("#ffffff"); // Default to white color
  const [status, setStatus] = useState("active");
  const [errors, setErrors] = useState({
    typeName: "",
    price: "",
    color: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch Location Types
  const fetchLocationTypes = async () => {
    if (eventId && hostId) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/locationType/${hostId}/${eventId}`,
          {
            headers: {
              Authorization: sessionStorage.getItem("accessToken"),
            },
          }
        );
        setLocationTypes(response.data);
      } catch (error) {
        console.error("Error fetching location types:", error);
      }
    }
  };

  useEffect(() => {
    fetchLocationTypes();
  }, [eventId, hostId]);

  // Check if the color already exists in the location types
  const isColorDuplicate = (color) => {
    return locationTypes.some((type) => type.color === color);
  };

  // Handle form validation and save
  const handleSave = async () => {
    let formErrors = {};
    if (!typeName) {
      formErrors.typeName = "Type name is required.";
    }

    if (!price || isNaN(price) || parseFloat(price) < 0) {
      formErrors.price = "Price must be a valid number and greater than 0.";
    }

    if (isColorDuplicate(color)) {
      formErrors.color = "This color is already taken. Please choose another.";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return; // Stop saving if there are errors
    }

    try {
      if (editingType) {
        // Edit Location Type (PUT)
        await axios.put(
          `${API_BASE_URL}/locationType/${editingType.typeId}`, // Update URL with typeId
          { typeName, price: parseFloat(price), color, status },
          {
            headers: {
              Authorization: sessionStorage.getItem("accessToken"),
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Create New Location Type (POST)
        await axios.post(
          `${API_BASE_URL}/locationType/${hostId}/${eventId}`,
          { typeName, price: parseFloat(price), color, status },
          {
            headers: {
              Authorization: sessionStorage.getItem("accessToken"),
              "Content-Type": "application/json",
            },
          }
        );
      }
      fetchLocationTypes();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error saving location type:", error);
    }
  };

  const handleDelete = async (typeId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/locationType/${hostId}/${eventId}/${typeId}`,
        {
          headers: {
            Authorization: sessionStorage.getItem("accessToken"),
          },
        }
      );
      fetchLocationTypes();
    } catch (error) {
      console.error("Error deleting location type:", error);
    }
  };

  const handleEdit = (type) => {
    setEditingType(type);
    setTypeName(type.typeName);
    setPrice(type.price);
    setColor(type.color); // Set current color when editing
    setStatus(type.status);
    onOpen();
  };

  const resetForm = () => {
    setEditingType(null);
    setTypeName("");
    setPrice("");
    setColor("#ffffff"); // Reset to default color (white)
    setStatus("active");
    setErrors({
      typeName: "",
      price: "",
      color: "",
    });
  };

  return (
    <Box>
      <Button colorScheme="blue" mb={4} onClick={onOpen}>
        Create New Location Type
      </Button>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Price (VND)</Th>
            <Th>Color</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {locationTypes.map((type) => (
            <Tr key={type.typeId}>
              <Td>{type.typeName}</Td>
              <Td>{type.price?.toLocaleString("vi-VN")}</Td>
              <Td>
                <Box
                  bg={type.color}
                  width="20px"
                  height="20px"
                  borderRadius="50%"
                  border="1px solid #000"
                />
              </Td>
              <Td>{type.status}</Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="teal"
                  mr={2}
                  onClick={() => handleEdit(type)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(type.typeId)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Popup Form */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingType ? "Edit Location Type" : "Create Location Type"}
          </ModalHeader>
          <ModalBody>
            <FormControl isInvalid={errors.typeName} mb={4}>
              <FormLabel>Type Name</FormLabel>
              <Input
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
              />
              <FormErrorMessage>{errors.typeName}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.price} mb={4}>
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <FormErrorMessage>{errors.price}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.color} mb={4}>
              <FormLabel>Color</FormLabel>
              <Flex align="center">
                <Box
                  bg={color}
                  width="30px"
                  height="30px"
                  borderRadius="50%"
                  border="1px solid #000"
                  mr={4}
                />
                <ChromePicker
                  color={color}
                  onChangeComplete={(color) => setColor(color.hex)}
                />
              </Flex>
              <FormErrorMessage>{errors.color}</FormErrorMessage>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Status</FormLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSave}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default LocationTypeManagement;
