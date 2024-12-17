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
  Checkbox,
  VStack,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Select } from "antd";

const ThemeEventSection = () => {
  const [themes, setThemes] = useState([]);
  const [newTheme, setNewTheme] = useState("");
  const [checkedThemes, setCheckedThemes] = useState([]);
  const [status, setStatus] = useState("true");
  const [editingTheme, setEditingTheme] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [canCreateTheme, setCanCreateTheme] = useState(false);

  const hostId = sessionStorage.getItem("hostId") || "";
  const accessToken = sessionStorage.getItem("accessToken") || "";

  // Static theme options
  const staticThemes = [
    "Music",
    "Sports",
    "Conferences and conferences",
    "Exhibitions and fairs",
    "Education",
    "Charity and fundraising",
    "Entertainment",
    "Culture and festivals",
    "Community and society",
    "Technology and startups"
  ];

  const fetchThemes = async () => {
    try {
      const response = await axios.get(
        `https://esmpbe.id.vn/api/theme/hostId/${hostId}`,
        {
          headers: { Authorization: accessToken },
        }
      );
      setThemes(response.data);
    } catch (error) {
      toast({
        title: "Error fetching themes",
        status: "error",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);
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
      setCanCreateTheme(expireDate > currentTime);
    } catch (error) {
      console.error("Error fetching host expiretime:", error);
    }
  };

  useEffect(() => {
    fetchThemes();
    fetchHostExpireTime();
  }, []);

  const openModal = (theme = null) => {
    if (theme) {
      setEditingTheme(theme);
      setNewTheme(theme.name);
      setStatus(theme.status.toString());
    } else {
      setEditingTheme(null);
      setNewTheme("");
      setStatus("true");
    }
    onOpen();
  };

  const handleCheckboxChange = (theme) => {
    setCheckedThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]
    );
  };

  const handleSaveTheme = async () => {
    try {
      const combinedThemes = [...checkedThemes];
      if (newTheme.trim()) {
        combinedThemes.push(newTheme);
      }

      if (editingTheme) {
        // Update theme
        await axios.put(
          `https://esmpbe.id.vn/api/theme/${editingTheme.themeId}`,
          { name: newTheme, status: status === "true", hostid: hostId },
          { headers: { Authorization: accessToken } }
        );
        toast({ title: "Theme updated", status: "success" });
      } else {
        // Create multiple themes
        for (const theme of combinedThemes) {
          await axios.post(
            "https://esmpbe.id.vn/api/theme",
            { name: theme, status: status === "true", hostid: hostId },
            { headers: { Authorization: accessToken } }
          );
        }
        toast({ title: "Themes created", status: "success" });
      }
      fetchThemes();
      onClose();
    } catch (error) {
      toast({ title: "Error saving themes", status: "error" });
    }
  };
  const handleDeleteTheme = async (themeId) => {
    try {
      await axios.delete(`https://esmpbe.id.vn/api/theme/${themeId}`, {
        headers: { Authorization: accessToken },
      });
      setThemes(themes.filter((theme) => theme.themeId !== themeId));
      toast({ title: "Theme deleted", status: "success" });
    } catch (error) {
      toast({
        title: "Cannot delete theme",
        description: "This theme may be in use.",
        status: "error",
      });
    }
  };
  return (
    <Box mb={10}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color="blue.600">
          Theme Event
        </Heading>
        <Tooltip
          label={
            canCreateTheme
              ? ""
              : "Your package has expired, please renew to create a theme."
          }
        >
          <Button
            colorScheme="blue"
            onClick={() => openModal()}
            leftIcon={<AddIcon />}
            isDisabled={!canCreateTheme}
          >
            Create New Theme
          </Button>
        </Tooltip>
      </Flex>

      {/* Table */}
      <Table colorScheme="gray" bg="white" shadow="md">
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
                {" "}
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
                    isDisabled={!canCreateTheme}
                    onClick={() => openModal(theme)}
                  >
                    Edit
                  </Button>{" "}
                </Tooltip>{" "}
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
                    isDisabled={!canCreateTheme}
                    onClick={() => handleDeleteTheme(theme.themeId)}
                  >
                    Delete
                  </Button>{" "}
                </Tooltip>
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
            {editingTheme ? "Edit Theme" : "Create Theme"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Custome Theme Name</FormLabel>
              <Input
                mt={2}
                placeholder="Custome a Theme Name"
                value={newTheme}
                onChange={(e) => setNewTheme(e.target.value)}
              />
              <FormLabel>Theme Name</FormLabel>
              <VStack align="start" spacing={2}>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(2, 1fr)"
                  gap={2}
                >
                  {" "}
                  {staticThemes.map((theme) => (
                    <Checkbox
                      key={theme}
                      isChecked={checkedThemes.includes(theme)}
                      onChange={() => handleCheckboxChange(theme)}
                    >
                      {theme}
                    </Checkbox>
                  ))}
                </Box>
              </VStack>
            </FormControl>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="true">ACTIVE</option>
                <option value="false">INACTIVE</option>
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
