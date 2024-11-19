import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  Badge,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import axios from "axios";

const API_PACKAGE = "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/package";

const PackageAdmin = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    eventstoragetime: "",
    price: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const accessToken = sessionStorage.getItem("accessToken") || "";

  const fetchPackages = async () => {
    try {
      const response = await axios.get(API_PACKAGE, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreatePackage = async () => {
    try {
      const payload = {
        name: formData.name,
        price: formData.price,
        eventstoragetime: parseInt(formData.eventstoragetime, 10),
        description: formData.description,
      };

      await axios.post(API_PACKAGE, payload, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      onClose();
      fetchPackages();
      setFormData({
        name: "",
        eventstoragetime: "",
        price: "",
        description: "",
      });
    } catch (error) {
      console.error("Error creating package:", error);
      alert("Error creating package: " + error.response?.data?.message || error.message);
    }
  };

  const handleEditPackage = async () => {
    try {
      const payload = {
        name: formData.name,
        price: formData.price,
        eventstoragetime: parseInt(formData.eventstoragetime, 10),
        description: formData.description,
      };

      await axios.put(`${API_PACKAGE}/${editId}`, payload, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      onClose();
      fetchPackages();
      setFormData({
        name: "",
        eventstoragetime: "",
        price: "",
        description: "",
      });
      setIsEditing(false);
      setEditId(null);
    } catch (error) {
      console.error("Error updating package:", error);
      alert("Error updating package: " + error.response?.data?.message || error.message);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axios.put(
        `${API_PACKAGE}/${id}`,
        { status: !currentStatus },
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchPackages();
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const openEditModal = (pkg) => {
    setIsEditing(true);
    setEditId(pkg.id);
    setFormData({
      name: pkg.name,
      eventstoragetime: pkg.eventstoragetime,
      price: pkg.price,
      description: pkg.description || "",
    });
    onOpen();
  };

  useEffect(() => {
    if (accessToken) {
      fetchPackages();
    }
  }, [accessToken]);

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="3xl" fontWeight="bold" color="teal.600">
          Package Management
        </Text>
        <Button
          colorScheme="teal"
          leftIcon={<AddIcon />}
          onClick={() => {
            setIsEditing(false);
            setFormData({
              name: "",
              eventstoragetime: "",
              price: "",
              description: "",
            });
            onOpen();
          }}
        >
          Create Package
        </Button>
      </Flex>

      <Flex wrap="wrap" gap={6} justifyContent="center">
        {packages.map((pkg) => (
          <Box
            key={pkg.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            bg="white"
            p={6}
            w="300px"
            textAlign="center"
          >
            <VStack spacing={4}>
              <Text fontSize="2xl" fontWeight="bold" color="teal.700">
                {pkg.name}
              </Text>
              <Text>
                Storage Time:{" "}
                <strong>
                  {pkg.eventstoragetime} {pkg.eventstoragetime > 1 ? "Months" : "Month"}
                </strong>
              </Text>
              <Text>Description: {pkg.description || "No description provided."}</Text>
              <Text fontSize="lg" fontWeight="bold" color="teal.800">
                {pkg.price} VND
              </Text>
              <Badge
                colorScheme={pkg.status ? "green" : "red"}
                variant="solid"
                px={4}
                py={1}
              >
                {pkg.status ? "Active" : "Inactive"}
              </Badge>
              <HStack spacing={4}>
                <Button
                  size="sm"
                  colorScheme="yellow"
                  onClick={() => openEditModal(pkg)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  colorScheme={pkg.status ? "red" : "green"}
                  onClick={() => handleToggleStatus(pkg.id, pkg.status)}
                >
                  {pkg.status ? "Deactivate" : "Activate"}
                </Button>
              </HStack>
            </VStack>
          </Box>
        ))}
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? "Edit Package" : "Create New Package"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                placeholder="Enter package name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Storage Time (Months)</FormLabel>
              <Input
                name="eventstoragetime"
                type="number"
                placeholder="Enter storage time in months"
                value={formData.eventstoragetime}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Price</FormLabel>
              <Input
                name="price"
                type="number"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input
                name="description"
                placeholder="Enter package description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="teal"
              mr={3}
              onClick={isEditing ? handleEditPackage : handleCreatePackage}
            >
              {isEditing ? "Update" : "Create"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PackageAdmin;
