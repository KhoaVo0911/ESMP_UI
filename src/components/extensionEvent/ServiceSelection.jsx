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
} from "@chakra-ui/react";
import axios from "axios";

const API_BASE_URL =
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/service";

const ServiceManagement = ({ eventId }) => {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch danh sách dịch vụ
  const fetchServices = async () => {
    if (!eventId) {
      alert("Event ID is required.");
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/${eventId}`, {
        headers: {
          Authorization: sessionStorage.getItem("accessToken"),
        },
      });
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      // alert("Lỗi khi tải danh sách dịch vụ.");
    }
  };

  useEffect(() => {
    fetchServices();
  }, [eventId]);

  const handleSave = async () => {
    if (!serviceName || !price || !quantity) {
      alert("Please fill all fields.");
      return;
    }

    try {
      if (editingService) {
        // Cập nhật dịch vụ
        await axios.put(
          `${API_BASE_URL}/${editingService.serviceId}`,
          {
            name: serviceName,
            price: parseFloat(price),
            quantity: parseInt(quantity),
          },
          {
            headers: {
              Authorization: sessionStorage.getItem("accessToken"),
              "Content-Type": "application/json",
            },
          }
        );
        // alert("Cập nhật dịch vụ thành công!");
      } else {
        // Thêm dịch vụ mới
        await axios.post(
          `${API_BASE_URL}/${eventId}`,
          {
            name: serviceName,
            price: parseFloat(price),
            quantity: parseInt(quantity),
          },
          {
            headers: {
              Authorization: sessionStorage.getItem("accessToken"),
              "Content-Type": "application/json",
            },
          }
        );
        // alert("Thêm dịch vụ mới thành công!");
      }
      fetchServices();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error saving service:", error);
      // alert("Lỗi khi lưu dịch vụ.");
    }
  };

  const handleDelete = async (serviceId) => {
    try {
      await axios.delete(`${API_BASE_URL}/${serviceId}`, {
        headers: {
          Authorization: sessionStorage.getItem("accessToken"),
        },
      });
      alert("Xóa dịch vụ thành công!");
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      // alert("Lỗi khi xóa dịch vụ.");
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setServiceName(service.name);
    setPrice(service.price);
    setQuantity(service.quantity);
    onOpen();
  };

  const resetForm = () => {
    setEditingService(null);
    setServiceName("");
    setPrice("");
    setQuantity("");
  };

  return (
    <Box>
      <Button colorScheme="teal" mb={4} onClick={onOpen}>
        Add Service
      </Button>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Price</Th>
            <Th>Quantity</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {services.map((service) => (
            <Tr key={service.serviceId}>
              <Td>{service.name}</Td>
              <Td>{service.price}</Td>
              <Td>{service.quantity}</Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="blue"
                  mr={2}
                  onClick={() => handleEdit(service)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(service.serviceId)}
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
            {editingService ? "Edit Service" : "Add Service"}
          </ModalHeader>
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Service Name</FormLabel>
              <Input
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Quantity</FormLabel>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
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

export default ServiceManagement;
