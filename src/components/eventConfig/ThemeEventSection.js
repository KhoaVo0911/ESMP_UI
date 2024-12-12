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
  Flex,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const ThemeEventSection = () => {
  const [themes, setThemes] = useState([]);
  const [newTheme, setNewTheme] = useState("");
  const [status, setStatus] = useState("true");
  const [editingTheme, setEditingTheme] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [canCreateTheme, setCanCreateTheme] = useState(false);

  const hostId = sessionStorage.getItem("hostId") || "";
  const accessToken = sessionStorage.getItem("accessToken") || "";

  const fetchThemes = async () => {
    try {
      const response = await axios.get(
        `https://esmpbe.id.vn/api/theme/hostId/${hostId}`,
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
  }, [themes]);

  // Fetch Host Expire Time
  const fetchHostExpireTime = async () => {
    try {
      const response = await axios.get(
        `https://esmpbe.id.vn/api/host/${hostId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { expiretime } = response.data;
      const currentTime = new Date();
      const expireDate = new Date(expiretime);
      setCanCreateTheme(expireDate > currentTime); // Update canCreateTheme based on expiretime
    } catch (error) {
      console.error("Error fetching host expiretime:", error);
    }
  };

  useEffect(() => {
    fetchThemes();
    fetchHostExpireTime();
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

  const handleSaveTheme = async () => {
    if (newTheme.trim()) {
      try {
        if (editingTheme) {
          // Update existing theme
          await axios.put(
            `https://esmpbe.id.vn/api/theme/${editingTheme.themeId}`,
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
            "https://esmpbe.id.vn/api/theme",
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
      await axios.delete(`https://esmpbe.id.vn/api/theme/${themeId}`, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      });
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
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" fontWeight="bold" color="blue.600">
          Theme Event
        </Heading>
        <Tooltip
          label={
            canCreateTheme
              ? ""
              : "Your package has expired, please renew to create a theme."
          }
          shouldWrapChildren
        >
          <Button
            colorScheme="blue"
            onClick={() => openModal()}
            size="md"
            leftIcon={<AddIcon />}
            disabled={!canCreateTheme} // Disable button if package expired
            style={{
              cursor: canCreateTheme ? "pointer" : "not-allowed",
              opacity: canCreateTheme ? 1 : 0.6,
            }}
          >
            Create New Theme
          </Button>
        </Tooltip>
      </Flex>

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
                <Tooltip
                  label={
                    canCreateTheme
                      ? ""
                      : "Your package has expired, you cannot edit this theme."
                  }
                  shouldWrapChildren
                >
                  <Button
                    colorScheme="blue"
                    size="sm"
                    mr={2}
                    onClick={() => openModal(theme)}
                    isDisabled={!canCreateTheme} // Disable if package expired
                  >
                    Edit
                  </Button>
                </Tooltip>
                <Tooltip
                  label={
                    canCreateTheme
                      ? ""
                      : "Your package has expired, you cannot delete this theme."
                  }
                  shouldWrapChildren
                >
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDeleteTheme(theme.themeId)}
                    isDisabled={!canCreateTheme} // Disable if package expired
                  >
                    Delete
                  </Button>
                </Tooltip>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal for Add/Edit */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingTheme ? "Edit Theme" : "Add Theme"}</ModalHeader>
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
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
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
