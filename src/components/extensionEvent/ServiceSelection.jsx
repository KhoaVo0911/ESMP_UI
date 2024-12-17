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
  useToast,
  List,
  ListItem,
} from "@chakra-ui/react";
import axios from "axios";

const API_BASE_URL = "https://esmpbe.id.vn/api/service";

const ServiceManagement = ({ eventId }) => {
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [priceError, setPriceError] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [serviceNameError, setServiceNameError] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [editingService, setEditingService] = useState(null);

  const serviceSuggestions = [
    "Booth installation and decoration services",
    "Electrical and lighting equipment supply services",
    "Technical support services",
    "Goods transportation and installation services",
    "Cleaning and sanitation services",
    "Wifi and internet connection services",
    "Customer care and information support services",
  ];

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${eventId}`, {
        headers: { Authorization: sessionStorage.getItem("accessToken") },
      });
      setServices(response.data);
    } catch (error) {
      console.log("Error fetching services", error);
      // toast({
      //   title: "Error fetching services",
      //   description: "Could not load services.",
      //   status: "error",
      //   duration: 3000,
      //   isClosable: true,
      // });
    }
  };

  useEffect(() => {
    if (eventId) fetchServices();
  }, [eventId]);

  const handleSave = async () => {
    setServiceNameError("");
    setPriceError("");
    setQuantityError("");

    if (!serviceName) {
      setServiceNameError("Service name is required.");
      return;
    }
    if (!price || parseFloat(price) < 0) {
      setPriceError("Price must be positive.");
      return;
    }
    if (!quantity || parseInt(quantity) < 0) {
      setQuantityError("Quantity must be positive.");
      return;
    }

    try {
      const payload = {
        name: serviceName,
        price: parseFloat(price),
        quantity: parseInt(quantity),
      };

      if (editingService) {
        await axios.put(
          `${API_BASE_URL}/${editingService.serviceId}`,
          payload,
          { headers: { Authorization: sessionStorage.getItem("accessToken") } }
        );
        toast({ title: "Service updated", status: "success" });
      } else {
        await axios.post(`${API_BASE_URL}/${eventId}`, payload, {
          headers: { Authorization: sessionStorage.getItem("accessToken") },
        });
        toast({ title: "Service created", status: "success" });
      }

      fetchServices();
      onClose();
      resetForm();
    } catch (error) {
      console.log(
        "Error saving service",
        error.response?.data?.message || "Could not save the service."
      );
      // toast({
      //   title: "Error saving service",
      //   description:
      //     error.response?.data?.message || "Could not save the service.",
      //   status: "error",
      //   duration: 3000,
      //   isClosable: true,
      // });
    }
  };

  const handleDelete = async (serviceId) => {
    try {
      await axios.delete(`${API_BASE_URL}/${serviceId}`, {
        headers: {
          Authorization: sessionStorage.getItem("accessToken"),
        },
      });
      fetchServices();
      toast({
        title: "Service deleted",
        description: "The service has been deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(
        "Error deleting service",
        error.response?.data?.message || "Could not delete the service."
      );
      // toast({
      //   title: "Error deleting service",
      //   description:
      //     error.response?.data?.message || "Could not delete the service.",
      //   status: "error",
      //   duration: 3000,
      //   isClosable: true,
      // });
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
    setServiceName("");
    setPrice("");
    setQuantity("");
    setFilteredSuggestions([]);
    setEditingService(null);
  };

  const handleInputChange = (value) => {
    setServiceName(value);

    // Filter suggestions dynamically
    if (value) {
      const filtered = serviceSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setServiceName(suggestion);
    setFilteredSuggestions([]);
  };

  return (
    <Box>
      <Button
        colorScheme="blue"
        mb={4}
        onClick={() => {
          resetForm();
          onOpen();
        }}
      >
        Create New Service Support
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
                  colorScheme="teal"
                  mr={2}
                  onClick={() => {
                    setEditingService(service);
                    setServiceName(service.name);
                    setPrice(service.price);
                    setQuantity(service.quantity);
                    onOpen();
                  }}
                >
                  Edit
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingService
              ? "Edit Service Support"
              : "Create New Service Support"}
          </ModalHeader>
          <ModalBody>
            <FormControl mb={4} isInvalid={!!serviceNameError}>
              <FormLabel>Service Name</FormLabel>
              <Input
                value={serviceName}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Enter or select a service name"
              />
              {filteredSuggestions.length > 0 && (
                <List
                  border="1px solid #ccc"
                  borderRadius="md"
                  mt={1}
                  maxH="150px"
                  overflowY="auto"
                >
                  {filteredSuggestions.map((suggestion) => (
                    <ListItem
                      key={suggestion}
                      p={2}
                      _hover={{ bg: "gray.200", cursor: "pointer" }}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </ListItem>
                  ))}
                </List>
              )}
              <FormErrorMessage>{serviceNameError}</FormErrorMessage>
            </FormControl>

            <FormControl mb={4} isInvalid={!!priceError}>
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <FormErrorMessage>{priceError}</FormErrorMessage>
            </FormControl>

            <FormControl mb={4} isInvalid={!!quantityError}>
              <FormLabel>Quantity</FormLabel>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <FormErrorMessage>{quantityError}</FormErrorMessage>
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
