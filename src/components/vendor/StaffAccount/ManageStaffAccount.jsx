import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  Switch,
  useToast,
  HStack,
  Text,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import axios from "axios";

const BASE_URL = "https://esmpbe.id.vn/api";

const StaffAccountManager = () => {
  const [staffAccounts, setStaffAccounts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [newStaff, setNewStaff] = useState({
    username: "",
    password: "",
    name: "",
    phone: "",
    email: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  const vendorId = sessionStorage.getItem("vendorId") || "dummyVendorId";
  const accessToken =
    sessionStorage.getItem("accessToken") || "dummyAccessToken";

  // Fetch staff accounts
  const fetchStaffAccounts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/staff/${vendorId}`, {
        headers: { Authorization: `${accessToken}` },
      });
      setStaffAccounts(response.data);
    } catch (error) {
      console.error("Error fetching staff accounts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch staff accounts.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchStaffAccounts();
  }, []);

  // Edit modal click
  const handleEditClick = (staff) => {
    setSelectedStaff(staff);
    setShowPassword(false);
    setIsEditModalOpen(true);
  };

  // Update staff account
  const handleUpdateStaff = async () => {
    const { password, name, phone, email, status } = selectedStaff;

    // Validation for email
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      toast({
        title: "Invalid Email",
        description:
          "Please enter a valid Gmail address (e.g., example@gmail.com).",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validation for phone
    if (!/^\d{10,11}$/.test(phone)) {
      toast({
        title: "Invalid Phone",
        description: "Phone number must be 10-11 digits.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/staff/${selectedStaff.staffId}`,
        { password, name, phone, email, status },
        {
          headers: { Authorization: `${accessToken}` },
        }
      );
      toast({
        title: "Success",
        description: "Staff account updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsEditModalOpen(false);
      fetchStaffAccounts();
    } catch (error) {
      console.error(
        "Error updating staff account:",
        error.response || error.message
      );
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update staff account.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Toggle staff status
  const handleStatusToggle = async (staff) => {
    try {
      const { password, name, phone, email } = staff;
      const updatedStaff = {
        password,
        name,
        phone,
        email,
        status: !staff.status,
      };
      await axios.put(`${BASE_URL}/staff/${staff.staffId}`, updatedStaff, {
        headers: { Authorization: `${accessToken}` },
      });
      fetchStaffAccounts();
      toast({
        title: "Success",
        description: "Staff status updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(
        "Error toggling staff status:",
        error.response || error.message
      );
      toast({
        title: "Error",
        description: "Failed to update staff status.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Create new staff account
  const handleCreateStaff = async () => {
    try {
      const { username, password, name, phone, email } = newStaff;

      // Validation for email
      if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
        toast({
          title: "Invalid Email",
          description:
            "Please enter a valid Gmail address (e.g., example@gmail.com).",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Validation for phone
      if (!/^\d{10,11}$/.test(phone)) {
        toast({
          title: "Invalid Phone",
          description: "Phone number must be 10-11 digits.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      await axios.post(
        `${BASE_URL}/staff/${vendorId}`,
        { username, password, name, phone, email },
        {
          headers: { Authorization: `${accessToken}` },
        }
      );
      toast({
        title: "Success",
        description: "Staff account created successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsCreateModalOpen(false);
      fetchStaffAccounts();
    } catch (error) {
      console.error(
        "Error creating staff account:",
        error.response || error.message
      );
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create staff account.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5}>
      <Button
        colorScheme="blue"
        mb={4}
        onClick={() => setIsCreateModalOpen(true)}
      >
        + Create Staff Account
      </Button>
      <Table variant="simple" bg="white" boxShadow="lg" borderRadius="md">
        <Thead bg="gray.100">
          <Tr>
            <Th>Username</Th>
            <Th>Password</Th>
            <Th>Name</Th>
            <Th>Phone</Th>
            <Th>Email</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {staffAccounts.map((staff) => (
            <Tr key={staff.staffId}>
              <Td>{staff.username}</Td>
              <Td>
                {showPassword && selectedStaff?.staffId === staff.staffId
                  ? staff.password
                  : "****"}
              </Td>
              <Td>{staff.name}</Td>
              <Td>{staff.phone}</Td>
              <Td>{staff.email}</Td>
              <Td>
                <Switch
                  isChecked={staff.status}
                  onChange={() => handleStatusToggle(staff)}
                  colorScheme="green"
                />
              </Td>
              <Td>
                <HStack spacing={2}>
                  <IconButton
                    icon={<EditIcon />}
                    colorScheme="blue"
                    onClick={() => handleEditClick(staff)}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedStaff(staff);
                      setShowPassword(!showPassword);
                    }}
                  >
                    {showPassword && selectedStaff?.staffId === staff.staffId
                      ? "Hide"
                      : "Show"}
                  </Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>{" "}
      {/* Edit Staff Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Staff Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Enter name"
                value={selectedStaff?.name || ""}
                onChange={(e) =>
                  setSelectedStaff((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Password</FormLabel>
              <Input
                placeholder="Enter password"
                type="password"
                value={selectedStaff?.password || ""}
                onChange={(e) =>
                  setSelectedStaff((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Phone</FormLabel>
              <Input
                placeholder="Enter phone number"
                value={selectedStaff?.phone || ""}
                onChange={(e) =>
                  setSelectedStaff((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormControl
              mb={3}
              isInvalid={
                !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(selectedStaff?.email) &&
                selectedStaff?.email !== ""
              }
            >
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Enter email"
                value={selectedStaff?.email || ""}
                onChange={(e) =>
                  setSelectedStaff((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdateStaff}>
              Save
            </Button>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Create Staff Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false); // Close the modal
          setNewStaff({ // Reset the form fields
            username: "",
            password: "",
            name: "",
            phone: "",
            email: "",
          });
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Staff Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Username</FormLabel>
              <Input
                placeholder="Enter username"
                value={newStaff.username}
                onChange={(e) =>
                  setNewStaff((prev) => ({ ...prev, username: e.target.value }))
                }
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Password</FormLabel>
              <Input
                placeholder="Enter password"
                type="password"
                value={newStaff.password}
                onChange={(e) =>
                  setNewStaff((prev) => ({ ...prev, password: e.target.value }))
                }
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Enter name"
                value={newStaff.name}
                onChange={(e) =>
                  setNewStaff((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Phone</FormLabel>
              <Input
                placeholder="Enter phone number"
                value={newStaff.phone}
                onChange={(e) =>
                  setNewStaff((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Enter email"
                value={newStaff.email}
                onChange={(e) =>
                  setNewStaff((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateStaff}>
              Create
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default StaffAccountManager;
