import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Flex,
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
  FormErrorMessage,
} from "@chakra-ui/react";
import axios from "axios";

const API_BASE_URL = "https://esmpbe.id.vn/api/service";

const ServiceManagement = ({ eventId }) => {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  // State to track errors
  const [serviceNameError, setServiceNameError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [quantityError, setQuantityError] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentPage, setCurrentPage] = useState(1);
  const typesPerPage = 3; // Show 5 items per page

  // Fetch services list
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
    }
  };

  useEffect(() => {
    fetchServices();
  }, [eventId]);

  const totalPages = Math.ceil(services.length / typesPerPage);
  const indexOfLastType = currentPage * typesPerPage;
  const indexOfFirstType = indexOfLastType - typesPerPage;
  const currentTypes = services.slice(indexOfFirstType, indexOfLastType);

  const handleSave = async () => {
    let valid = true;

    // Clear previous errors
    setServiceNameError("");
    setPriceError("");
    setQuantityError("");

    // Validation checks
    if (!serviceName) {
      setServiceNameError("Service name is required.");
      valid = false;
    }

    if (!price || parseFloat(price) < 0) {
      setPriceError("Price must be a positive number.");
      valid = false;
    }

    if (!quantity || parseInt(quantity) < 0) {
      setQuantityError("Quantity must be a positive number.");
      valid = false;
    }

    if (!valid) return;

    try {
      if (editingService) {
        // Update service
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
      } else {
        // Add new service
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
      }
      await fetchServices(); // Fetch the updated list of services

      // Save the latest service list to sessionStorage
      sessionStorage.setItem("eventServices", JSON.stringify(services));

      onClose();
      resetForm();
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const handleDelete = async (serviceId) => {
    try {
      await axios.delete(`${API_BASE_URL}/${serviceId}`, {
        headers: {
          Authorization: sessionStorage.getItem("accessToken"),
        },
      });
      alert("Service deleted successfully!");
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Box>
      <Button colorScheme="blue" mb={4} onClick={onOpen}>
        Create New Service
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
          {currentTypes.map(
            (
              service // Thay từ services.map thành currentTypes.map
            ) => (
              <Tr key={service.serviceId}>
                <Td>{service.name}</Td>
                <Td>{service.price}</Td>
                <Td>{service.quantity}</Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="teal"
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
            )
          )}
        </Tbody>
      </Table>

      <Flex justifyContent="flex-end" mt={4}>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            colorScheme={currentPage === i + 1 ? "blue" : "gray"}
            mx={1}
          >
            {i + 1}
          </Button>
        ))}
      </Flex>

      {/* Popup Form */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingService ? "Edit Service" : "Create New Service"}
          </ModalHeader>
          <ModalBody>
            <FormControl mb={4} isInvalid={!!serviceNameError}>
              <FormLabel>Service Name</FormLabel>
              <Input
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
              />
              {serviceNameError && (
                <FormErrorMessage>{serviceNameError}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl mb={4} isInvalid={!!priceError}>
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {priceError && <FormErrorMessage>{priceError}</FormErrorMessage>}
            </FormControl>

            <FormControl mb={4} isInvalid={!!quantityError}>
              <FormLabel>Quantity</FormLabel>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              {quantityError && (
                <FormErrorMessage>{quantityError}</FormErrorMessage>
              )}
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

export default ServiceManagement;
