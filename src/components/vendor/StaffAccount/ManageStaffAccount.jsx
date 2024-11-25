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
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import axios from "axios";

const StaffAccountManager = () => {
  const [staffAccounts, setStaffAccounts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [newStaff, setNewStaff] = useState({ username: "", password: "", name: "" });
  const toast = useToast();

  const vendorId = sessionStorage.getItem("vendorId") || "dummyVendorId"; // Replace with actual vendorId
  const accessToken = sessionStorage.getItem("accessToken") || "dummyAccessToken"; // Replace with actual accessToken

  // Fetch staff accounts
  const fetchStaffAccounts = async () => {
    try {
      const response = await axios.get(`/staff/${vendorId}`, {
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
    setIsEditModalOpen(true);
  };

  // Update staff account
  const handleUpdateStaff = async () => {
    try {
      const { password, name, status } = selectedStaff; // Only send these fields
      await axios.put(`/staff/${selectedStaff.staffId}`, { password, name, status }, {
        headers: { Authorization: `${accessToken}` },
      });
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
      console.error("Error updating staff account:", error.response || error.message);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update staff account.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Toggle staff status
  const handleStatusToggle = async (staff) => {
    try {
      const { password, name } = staff; // Only send these fields with updated status
      const updatedStaff = {
        password,
        name,
        status: !staff.status, // Toggle status
      };
      await axios.put(`/staff/${staff.staffId}`, updatedStaff, {
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
      console.error("Error toggling staff status:", error.response || error.message);
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
      const { username, password, name } = newStaff; // Only send these fields
      await axios.post(`/staff/${vendorId}`, { username, password, name }, {
        headers: { Authorization: `${accessToken}` },
      });
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
      console.error("Error creating staff account:", error.response || error.message);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create staff account.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5}>
      {/* Create Staff Button */}
      <Button
        colorScheme="blue"
        mb={4}
        onClick={() => setIsCreateModalOpen(true)}
      >
        + Create Staff Account
      </Button>

      {/* Staff Table */}
      <Table variant="simple" bg="white" boxShadow="lg" borderRadius="md" overflow="hidden">
        <Thead bg="gray.100">
          <Tr>
            <Th>Username</Th>
            <Th>Password</Th>
            <Th>Name</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {staffAccounts.map((staff) => (
            <Tr key={staff.staffId}>
              <Td>{staff.username}</Td>
              <Td>{staff.password}</Td>
              <Td>{staff.name}</Td>
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
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Edit Staff Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Staff Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Name"
              value={selectedStaff?.name || ""}
              onChange={(e) =>
                setSelectedStaff((prev) => ({ ...prev, name: e.target.value }))
              }
              mb={3}
            />
            <Input
              placeholder="Password"
              type="password"
              value={selectedStaff?.password || ""}
              onChange={(e) =>
                setSelectedStaff((prev) => ({ ...prev, password: e.target.value }))
              }
              mb={3}
            />
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
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Staff Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Username"
              value={newStaff.username}
              onChange={(e) =>
                setNewStaff((prev) => ({ ...prev, username: e.target.value }))
              }
              mb={3}
            />
            <Input
              placeholder="Password"
              type="password"
              value={newStaff.password}
              onChange={(e) =>
                setNewStaff((prev) => ({ ...prev, password: e.target.value }))
              }
              mb={3}
            />
            <Input
              placeholder="Name"
              value={newStaff.name}
              onChange={(e) =>
                setNewStaff((prev) => ({ ...prev, name: e.target.value }))
              }
              mb={3}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateStaff}>
              Create
            </Button>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default StaffAccountManager;
