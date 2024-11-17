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
} from "@chakra-ui/react";
import axios from "axios";

const API_BASE_URL =
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/map";

const LocationTypeManagement = ({ eventId, hostId }) => {
  const [locationTypes, setLocationTypes] = useState([]);
  const [editingType, setEditingType] = useState(null);
  const [typeName, setTypeName] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("Available");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchLocationTypes = async () => {
    if (eventId && hostId) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/locationTyple/${hostId}/${eventId}`,
          {
            headers: {
              Authorization: sessionStorage.getItem("accessToken"),
            },
          }
        );
        setLocationTypes(response.data);
      } catch (error) {
        console.error("Error fetching location types:", error);
        alert("Lỗi khi tải dữ liệu loại vị trí.");
      }
    }
  };

  useEffect(() => {
    fetchLocationTypes();
  }, [eventId, hostId]);

  const handleSave = async () => {
    try {
      if (editingType) {
        // Cập nhật loại vị trí
        await axios.put(
          `${API_BASE_URL}/locationTyple/${hostId}/${eventId}/${editingType.typeId}`,
          { typeName, price: parseFloat(price), status },
          {
            headers: {
              Authorization: sessionStorage.getItem("accessToken"),
              "Content-Type": "application/json",
            },
          }
        );
        alert("Cập nhật loại vị trí thành công!");
      } else {
        // Thêm loại vị trí mới
        await axios.post(
          `${API_BASE_URL}/locationTyple/${hostId}/${eventId}`,
          { typeName, price: parseFloat(price), status },
          {
            headers: {
              Authorization: sessionStorage.getItem("accessToken"),
              "Content-Type": "application/json",
            },
          }
        );
        alert("Thêm loại vị trí mới thành công!");
      }
      fetchLocationTypes();
      onClose();
      setEditingType(null);
      setTypeName("");
      setPrice("");
      setStatus("Available");
    } catch (error) {
      console.error("Error saving location type:", error);
      alert("Lỗi khi lưu loại vị trí.");
    }
  };

  const handleDelete = async (typeId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/locationTyple/${hostId}/${eventId}/${typeId}`,
        {
          headers: {
            Authorization: sessionStorage.getItem("accessToken"),
          },
        }
      );
      alert("Xóa loại vị trí thành công!");
      fetchLocationTypes();
    } catch (error) {
      console.error("Error deleting location type:", error);
      alert("Lỗi khi xóa loại vị trí.");
    }
  };

  const handleEdit = (type) => {
    setEditingType(type);
    setTypeName(type.typeName);
    setPrice(type.price);
    setStatus(type.status);
    onOpen();
  };

  return (
    <Box>
      <Button colorScheme="teal" mb={4} onClick={onOpen}>
        Add Location Type
      </Button>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Price (VND)</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {locationTypes.map((type) => (
            <Tr key={type.typeId}>
              <Td>{type.typeName}</Td>
              <Td>{type.price.toLocaleString("vi-VN")}</Td>
              <Td>{type.status}</Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="blue"
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
            {editingType ? "Edit Location Type" : "Add Location Type"}
          </ModalHeader>
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Type Name</FormLabel>
              <Input
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Price</FormLabel>
              <Input value={price} onChange={(e) => setPrice(e.target.value)} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Status</FormLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="On Hold">On Hold</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleSave}>
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
