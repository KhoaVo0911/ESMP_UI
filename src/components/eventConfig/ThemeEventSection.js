// src/components/ThemeEventSection.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  FormControl,
  FormLabel,
  Input,
  Select,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

const ThemeEventSection = () => {
  const [themes, setThemes] = useState([]);
  const [newTheme, setNewTheme] = useState("");
  const [status, setStatus] = useState("true"); // Default to active status (boolean true)
  const [editingTheme, setEditingTheme] = useState(null); // Holds the theme to edit
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Retrieve hostId and accessToken from session storage
  const hostId = sessionStorage.getItem("hostId") || "";
  const accessToken = sessionStorage.getItem("accessToken") || "";

  // Fetch themes from API
  const fetchThemes = async () => {
    try {
      const response = await axios.get(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/theme/hostId/${hostId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setThemes(response.data);
    } catch (error) {
      toast({
        title: "Error fetching themes",
        description: "Could not load themes.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  // Open the modal to add or edit a theme
  const openModal = (theme = null) => {
    if (theme) {
      setEditingTheme(theme); // Set the theme to be edited
      setNewTheme(theme.name);
      setStatus(theme.status.toString());
    } else {
      setEditingTheme(null);
      setNewTheme("");
      setStatus("true");
    }
    onOpen();
  };

  // Add or Edit Theme
  const handleSaveTheme = async () => {
    if (newTheme.trim()) {
      try {
        if (editingTheme) {
          // Update existing theme
          await axios.put(
            `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/theme/${editingTheme.themeId}`,
            {
              name: newTheme,
              status: status === "true",
              hostid: hostId,
            },
            {
              headers: {
                Authorization: `${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          toast({
            title: "Theme updated",
            description: "The theme has been updated successfully.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          // Create a new theme
          await axios.post(
            "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/theme",
            {
              name: newTheme,
              status: status === "true", // Convert status to boolean
              hostid: hostId,
            },
            {
              headers: {
                Authorization: `${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          toast({
            title: "Theme added",
            description: "New theme has been added successfully.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }

        fetchThemes(); // Refresh the themes list
        onClose(); // Close the modal
        setNewTheme("");
        setStatus("true");
        setEditingTheme(null);
      } catch (error) {
        toast({
          title: "Error saving theme",
          description: "Could not save the theme.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleDeleteTheme = async (themeId) => {
    try {
      await axios.delete(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/theme/${themeId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setThemes(themes.filter((theme) => theme.themeId !== themeId));

      toast({
        title: "Theme deleted",
        description: "Theme has been deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting theme",
        description: "Could not delete theme.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box mb={10}>
      <Heading size="lg" fontWeight="bold" color="blue.600" mb={6}>
        Theme Event
      </Heading>
      <Box mb={8} bg="white" p={6} borderRadius="md" shadow="md">
        <FormControl mb={4}>
          <FormLabel>Theme Name</FormLabel>
          <Input
            placeholder="Enter theme name"
            value={newTheme}
            onChange={(e) => setNewTheme(e.target.value)}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Status</FormLabel>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="true">Available</option>
            <option value="false">Inactive</option>
          </Select>
        </FormControl>
        <Button colorScheme="teal" onClick={() => openModal()}>
          Add Theme
        </Button>
      </Box>

      <Table
        variant="simple"
        colorScheme="gray"
        size="lg"
        bg="white"
        borderRadius="md"
        shadow="md"
      >
        <Thead bg="gray.200">
          <Tr>
            <Th>No</Th>
            <Th>Name</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {themes.map((theme, index) => (
            <Tr key={theme.themeId}>
              <Td>{index + 1}</Td>
              <Td>{theme.name}</Td>
              <Td>
                <Badge colorScheme={theme.status ? "green" : "red"}>
                  {theme.status ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </Td>
              <Td>
                <Button
                  colorScheme="blue"
                  size="sm"
                  mr={2}
                  onClick={() => openModal(theme)}
                >
                  Edit
                </Button>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeleteTheme(theme.themeId)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal for Add/Edit */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingTheme ? "Edit Theme" : "Add Theme"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Theme Name</FormLabel>
              <Input
                placeholder="Enter theme name"
                value={newTheme}
                onChange={(e) => setNewTheme(e.target.value)}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Status</FormLabel>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="true">Available</option>
                <option value="false">Inactive</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSaveTheme}>
              {editingTheme ? "Update" : "Create"}
            </Button>
            <Button onClick={onClose} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ThemeEventSection;
