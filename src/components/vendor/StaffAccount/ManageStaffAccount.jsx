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
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { EditIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
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
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const toast = useToast();
  const [errors, setErrors] = useState({});
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
    setSelectedStaff({
      ...staff, // Copy existing staff data into selectedStaff
      name: staff.name || "",
      password: staff.password || "", // Default empty values if missing
      phone: staff.phone || "",
      email: staff.email || "",
    });
    setShowPassword(false);
    setErrors({}); // Reset errors
    setIsEditModalOpen(true);
  };
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
  // Validate email and phone
  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  const validatePhone = (phone) => /^\d{10,11}$/.test(phone);

  // Handle Update Staff
  const handleUpdateStaff = async () => {
    const { password, name, phone, email } = selectedStaff;
  
    let newErrors = {};
  
    // Validation logic
    if (!name) newErrors.name = "Name is required";
    if (!password) newErrors.password = "Password is required";
    if (!phone) newErrors.phone = "Phone number is required";
    if (!validatePhone(phone)) newErrors.phone = "Phone number must be 10-11 digits";
    if (!email) newErrors.email = "Email is required";
    if (!validateEmail(email)) newErrors.email = "Please enter a valid Gmail address (e.g., example@gmail.com)";
  
    setErrors(newErrors);
  
    // If errors exist, do not proceed
    if (Object.keys(newErrors).length > 0) {
      return;
    }
  
    try {
      await axios.put(
        `${BASE_URL}/staff/${selectedStaff.staffId}`,
        { password, name, phone, email, status: selectedStaff.status },
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
      console.error("Error updating staff account:", error);
  
      const responseCode = error.response?.data?.code;
      const message = error.response?.data?.message;
  
      if (responseCode === "P2002" && message.includes("email")) {
        setErrors((prev) => ({ ...prev, email: "This email is already registered." }));
      } else if (responseCode === "UNKNOWN" && message.includes("Username already exists")) {
        setErrors((prev) => ({ ...prev, username: "This username already exists." }));
      } else {
        toast({
          title: "Error",
          description: "Unexpected error occurred while updating the account.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  

  // Handle Create Staff
  const handleCreateStaff = async () => {
    const { username, password, name, phone, email } = newStaff;
  
    let newErrors = {};
  
    // Validation logic
    if (!username) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";
    if (!name) newErrors.name = "Name is required";
    if (!phone) newErrors.phone = "Phone number is required";
    if (!validatePhone(phone)) newErrors.phone = "Phone number must be 10-11 digits";
    if (!email) newErrors.email = "Email is required";
    if (!validateEmail(email)) newErrors.email = "Please enter a valid Gmail address (e.g., example@gmail.com)";
  
    setErrors(newErrors);
  
    // If errors exist, do not proceed
    if (Object.keys(newErrors).length > 0) {
      return;
    }
  
    try {
      await axios.post(
        `${BASE_URL}/staff/${vendorId}`,
        { username, password, name, phone, email },
        { headers: { Authorization: `${accessToken}` } }
      );
  
      toast({
        title: "Success",
        description: "Staff account created successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
      setIsCreateModalOpen(false);
      setNewStaff({ username: "", password: "", name: "", phone: "", email: "" });
      fetchStaffAccounts();
    } catch (error) {
      console.error("Error creating staff account:", error);
  
      // Handle known backend errors
      const responseCode = error.response?.data?.code;
      const message = error.response?.data?.message;
     
      
      if (responseCode === "P2002" && message.includes("email")) {
        setErrors((prev) => ({ ...prev, email: "This email is already registered." }));
      } else if (responseCode === "UNKNOWN" && message.includes("Username already exists")) {
        setErrors((prev) => ({ ...prev, username: "This username already exists." }));
      } else {
        toast({
          title: "Error",
          description: "Unexpected error occurred while creating the account.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  const togglePasswordVisibility = (staffId) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [staffId]: !prev[staffId], // Toggle visibility for the specific staffId
    }));
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
  <HStack>
    <Box>
      {visiblePasswords[staff.staffId]
        ? staff.password // Show password in plain text
        : "****" // Masked password
      }
    </Box>
    <IconButton
      icon={
        visiblePasswords[staff.staffId] ? <ViewOffIcon /> : <ViewIcon />
      }
      size="sm"
      onClick={() => togglePasswordVisibility(staff.staffId)}
      variant="ghost"
      aria-label="Toggle Password Visibility"
    />
  </HStack>
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
            <FormControl isInvalid={errors.name} mb={3}>
  <FormLabel>Name</FormLabel>
  <Input
    placeholder="Enter name"
    value={selectedStaff?.name || ""}
    onChange={(e) =>
      setSelectedStaff((prev) => ({ ...prev, name: e.target.value }))
    }
  />
  <FormErrorMessage>{errors.name}</FormErrorMessage>
</FormControl>

<FormControl isInvalid={errors.password} mb={3}>
  <FormLabel>Password</FormLabel>
  <Input
    type="password"
    placeholder="Enter password"
    value={selectedStaff?.password || ""}
    onChange={(e) =>
      setSelectedStaff((prev) => ({ ...prev, password: e.target.value }))
    }
  />
  <FormErrorMessage>{errors.password}</FormErrorMessage>
</FormControl>

<FormControl isInvalid={errors.phone} mb={3}>
  <FormLabel>Phone</FormLabel>
  <Input
    placeholder="Enter phone number"
    value={selectedStaff?.phone || ""}
    onChange={(e) =>
      setSelectedStaff((prev) => ({ ...prev, phone: e.target.value }))
    }
  />
  <FormErrorMessage>{errors.phone}</FormErrorMessage>
</FormControl>

<FormControl isInvalid={errors.email} mb={3}>
  <FormLabel>Email</FormLabel>
  <Input
    placeholder="Enter email"
    value={selectedStaff?.email || ""}
    onChange={(e) =>
      setSelectedStaff((prev) => ({ ...prev, email: e.target.value }))
    }
  />
  <FormErrorMessage>{errors.email}</FormErrorMessage>
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
          setNewStaff({
            // Reset the form fields
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
          <FormControl isInvalid={errors.username} mb={3}>
              <FormLabel>Username</FormLabel>
              <Input
                placeholder="Enter username"
                value={newStaff.username}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, username: e.target.value })
                }
              />
              <FormErrorMessage>{errors.username}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.password} mb={3}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter password"
                value={newStaff.password}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, password: e.target.value })
                }
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.name} mb={3}>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Enter name"
                value={newStaff.name}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, name: e.target.value })
                }
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.phone} mb={3}>
              <FormLabel>Phone</FormLabel>
              <Input
                placeholder="Enter phone number"
                value={newStaff.phone}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, phone: e.target.value })
                }
              />
              <FormErrorMessage>{errors.phone}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.email} mb={3}>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Enter email"
                value={newStaff.email}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, email: e.target.value })
                }
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
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
