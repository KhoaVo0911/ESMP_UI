import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  IconButton,
  Box,
  Heading,
  Flex,
  Input,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tooltip,
  Button,
  Spinner,
  FormErrorMessage,
} from "@chakra-ui/react";
import {
  AddIcon,
  EditIcon,
  EmailIcon,
  DeleteIcon,
  InfoIcon,
} from "@chakra-ui/icons";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useToast } from "@chakra-ui/react";

const API_GET_VENDORS = "https://esmpbe.id.vn/api/vendor/host";
const API_VENDOR = "https://esmpbe.id.vn/api/vendor";
const API_SEND_EMAIL = "https://esmpbe.id.vn/api/mail/send-email";
const API_HOST = "https://esmpbe.id.vn/api/host";

const AccountManagement = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDetailOpen,
    onOpen: onOpenDetail,
    onClose: onCloseDetail,
  } = useDisclosure();

  const [accounts, setAccounts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editVendorId, setEditVendorId] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [loading, setLoading] = useState(false); // For loading vendors
  const [formSubmitting, setFormSubmitting] = useState(false); // For form submission
  const [deleting, setDeleting] = useState(false); // For deleting accounts
  const [sendingEmail, setSendingEmail] = useState(false); // For sending email
  const [canCreateAccount, setCanCreateAccount] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const hostId = sessionStorage.getItem("hostId") || "";
  const accessToken = sessionStorage.getItem("accessToken") || "";

  // useForm hook
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_GET_VENDORS}/${hostId}`, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (data) => {
    setFormSubmitting(true);
    try {
      await axios.post(`${API_VENDOR}/${hostId}`, data, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      toast({
        title: "Account created successfully.",
        description: "The new account has been created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
      fetchVendors();
      reset();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Error creating account:", errorMessage);

      // Hiển thị thông báo lỗi cụ thể
      if (error.response?.data?.code === "UNKNOWN") {
        toast({
          title: "Error: Username already exists.",
          description: "The username is already in use. Please choose another.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else if (error.response?.data?.code === "P2002") {
        toast({
          title: "Error: Email already exists.",
          description:
            "The email is already registered. Please use a different email.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Unexpected Error",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEditAccount = async (data) => {
    setFormSubmitting(true);
    try {
      await axios.put(`${API_VENDOR}/${editVendorId}`, data, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      toast({
        title: "Account updated successfully.",
        description: "The account has been updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
      fetchVendors();
      reset();
      setIsEditing(false);
      setEditVendorId(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Error updating account:", errorMessage);

      if (error.response?.data?.code === "UNKNOWN") {
        toast({
          title: "Error: Username already exists.",
          description: "The username is already in use. Please choose another.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else if (error.response?.data?.code === "P2002") {
        toast({
          title: "Error: Email already exists.",
          description:
            "The email is already registered. Please use a different email.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Unexpected Error",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteAccount = async (vendorId) => {
    setDeleting(true);
    try {
      await axios.delete(`${API_VENDOR}/${vendorId}`, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      fetchVendors();
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleSendEmail = async (account) => {
    setSendingEmail(true);
    try {
      const emailBody = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; }
              .container { width: 100%; max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 10px; }
              .header { background-color: #4caf50; color: white; padding: 10px; text-align: center; }
              .content { padding: 20px; }
              .footer { text-align: center; font-size: 12px; color: #888; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header"><h1>Your Account Details</h1></div>
              <div class="content">
                <p>Dear <strong>${account.name}</strong>,</p>
                <p>Your account has been successfully created! Below are your account details:</p>
                <table>
                  <tr><th>Username</th><td>${account.username}</td></tr>
                  <tr><th>Password</th><td>${account.password}</td></tr>
                  <tr><th>Name</th><td>${account.name}</td></tr>
                  <tr><th>Phone</th><td>${account.phone}</td></tr>
                  <tr><th>Email</th><td>${account.email}</td></tr>
                  <tr><th>Address</th><td>${account.address}</td></tr>
                  <tr><th>QR URL</th><td>${account.urlQr}</td></tr>
                </table>
              </div>
              <div class="footer">
                <p>If you have any issues, feel free to contact our support team.</p>
                <p>Best regards,<br>Your Company</p>
              </div>
            </div>
          </body>
        </html>
      `;

      await axios.post(
        API_SEND_EMAIL,
        {
          toEmail: account.email,
          subject: "Your Account Details",
          body: emailBody,
        },
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast({
        title: "Email sent successfully.",
        description: `An email has been sent to ${account.email}.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error sending email:", error);

      // Show error toast
      toast({
        title: "Failed to send email.",
        description:
          "There was an error while sending the email. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSendingEmail(false);
    }
  };
  // Fetch Host Expire Time
  const fetchHostExpireTime = async () => {
    try {
      const response = await axios.get(`${API_HOST}/${hostId}`, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const { expiretime } = response.data;

      // Check if expiretime is valid
      const currentTime = new Date();
      const expireDate = new Date(expiretime);
      const isAccountCreationAllowed = expireDate > currentTime;
      setCanCreateAccount(isAccountCreationAllowed);

      // Debugging via console log
      console.log("Host ID:", hostId);
      console.log("Current Time:", currentTime.toISOString());
      console.log("Expire Time:", expireDate.toISOString());
      console.log(
        `Can create account: ${isAccountCreationAllowed ? "YES" : "NO"}`
      );
    } catch (error) {
      console.error("Error fetching host expiretime:", error);
    }
  };

  useEffect(() => {
    if (hostId && accessToken) {
      fetchVendors();
      fetchHostExpireTime();
    }
  }, [hostId, accessToken]);

  const resetForm = () => {
    reset({
      username: "",
      password: "",
      name: "",
      phone: "",
      email: "",
      // address: "",
      urlQr: "",
      // status: true,
    });
  };

  const openEditModal = (account) => {
    setIsEditing(true);
    setEditVendorId(account.vendorId);
    setValue("username", account.username);
    setValue("password", account.password);
    setValue("name", account.name);
    setValue("phone", account.phone);
    setValue("email", account.email);
    setValue("address", account.address);
    setValue("urlQr", account.urlQr);
    // setValue("status", account.status);
    onOpen();
  };

  const openDetailModal = (account) => {
    setSelectedAccount(account);
    onOpenDetail();
  };

  const handleToggleStatus = async (vendorId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await axios.put(
        `${API_VENDOR}/${vendorId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchVendors();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    if (hostId && accessToken) {
      fetchVendors();
    }
  }, [hostId, accessToken]);

  return (
    <Box bg="white" p={6} borderRadius="md" shadow="md">
      <Box mb={10}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg" fontWeight="bold" color="blue.600">
            Vendor Management
          </Heading>
          <Tooltip
            label={
              canCreateAccount
                ? ""
                : "Your package has expired, please renew to create an account."
            }
            shouldWrapChildren
          >
            <Button
              colorScheme="blue"
              leftIcon={<AddIcon />}
              onClick={() => {
                resetForm();
                onOpen();
              }}
              disabled={!canCreateAccount} // Disable the button when package is expired
              style={{
                cursor: canCreateAccount ? "pointer" : "not-allowed", // Change cursor style
                opacity: canCreateAccount ? 1 : 0.6, // Adjust opacity to indicate disabled state
              }}
            >
              Create New Account
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
              <Th>Username</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Account Banking</Th>
              <Th>Status</Th>
              <Th textAlign="center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
  {loading ? (
    <Tr>
      <Td colSpan={7} textAlign="center">
        <Spinner color="teal" />
      </Td>
    </Tr>
  ) : (
    accounts.map((account, index) => (
      <Tr key={account.vendorId}>
        <Td>{index + 1}</Td>
        <Td>{account.username}</Td>
        <Td>{account.name}</Td>
        <Td>{account.email}</Td>
        <Td>{account.urlQr}</Td>
        <Td>
          <Badge colorScheme={account.status ? "green" : "red"}>
            {account.status ? "ACTIVE" : "INACTIVE"}
          </Badge>
        </Td>
        <Td textAlign="center">
          <Tooltip label="View Details" shouldWrapChildren>
            <IconButton
              icon={<InfoIcon />}
              size="sm"
              colorScheme="blue"
              mr={2}
              onClick={() => openDetailModal(account)}
              isDisabled={!canCreateAccount}
              aria-label="View Details"
            />
          </Tooltip>
          <Tooltip label="Edit Account" shouldWrapChildren>
            <IconButton
              icon={<EditIcon />}
              size="sm"
              colorScheme="yellow"
              mr={2}
              onClick={() => openEditModal(account)}
              isDisabled={!canCreateAccount}
              aria-label="Edit Account"
            />
          </Tooltip>
          <Tooltip label="Send Email" shouldWrapChildren>
            <IconButton
              icon={<EmailIcon />}
              size="sm"
              colorScheme="teal"
              mr={2}
              onClick={() => handleSendEmail(account)}
              isDisabled={!canCreateAccount}
              aria-label="Send Email"
            />
          </Tooltip>
          <Tooltip label="Delete Account" shouldWrapChildren>
            <IconButton
              icon={<DeleteIcon />}
              size="sm"
              colorScheme="red"
              onClick={() => handleDeleteAccount(account.vendorId)}
              isDisabled={!canCreateAccount}
              aria-label="Delete Account"
            />
          </Tooltip>
        </Td>
      </Tr>
    ))
  )}
</Tbody>

        </Table>

        {/* Modal for Create/Edit Account */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {isEditing ? "Edit Account" : "Create New Account"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form
                onSubmit={handleSubmit(
                  isEditing ? handleEditAccount : handleCreateAccount
                )}
              >
                <FormControl isInvalid={errors.username}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...register("username", {
                      required: "Username is required",
                    })}
                    placeholder="Enter username"
                  />
                  <FormErrorMessage>
                    {errors.username?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl mt={4} isInvalid={errors.password}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    {...register("password", {
                      required: "Password is required",
                    })}
                    type="password"
                    placeholder="Enter password"
                  />
                  <FormErrorMessage>
                    {errors.password?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl mt={4} isInvalid={errors.name}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    {...register("name", { required: "Name is required" })}
                    placeholder="Enter name"
                  />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>

                <FormControl mt={4} isInvalid={errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format",
                      },
                    })}
                    placeholder="Enter email"
                  />
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>
                <FormControl mt={4} isInvalid={errors.phone}>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10,15}$/,
                        message: "Invalid phone number format",
                      },
                    })}
                    placeholder="Enter phone number"
                  />
                  <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
                </FormControl>
                <FormControl mt={4}>
  <FormLabel>Account Banking</FormLabel>
  <Input
    {...register("urlQr")}
    placeholder="Enter QR code URL"
  />
</FormControl>


                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    type="submit"
                    isLoading={formSubmitting}
                    loadingText={isEditing ? "Updating" : "Creating"}
                  >
                    {isEditing ? "Update" : "Create"}
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Modal for Account Details */}
        <Modal isOpen={isDetailOpen} onClose={onCloseDetail}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Account Details</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <p>
        <strong>Username:</strong> {selectedAccount?.username}
      </p>
      <p>
        <strong>Password:</strong>{" "}
        {showPassword ? selectedAccount?.password : "*********"}{" "}
        <Button
          size="sm"
          variant="link"
          onClick={() => setShowPassword(!showPassword)}
          colorScheme="blue"
        >
          {showPassword ? "Hide" : "Show"}
        </Button>
      </p>
      <p>
        <strong>Name:</strong> {selectedAccount?.name}
      </p>
      <p>
        <strong>Email:</strong> {selectedAccount?.email}
      </p>
      <p>
        <strong>Account Banking:</strong> {selectedAccount?.urlQr}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        {selectedAccount?.status ? "Active" : "Inactive"}
      </p>
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="teal" onClick={onCloseDetail}>
        Close
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
      </Box>
    </Box>
  );
};

export default AccountManagement;
