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
  Button
} from "@chakra-ui/react";
import { AddIcon, EditIcon, EmailIcon, DeleteIcon, InfoIcon } from "@chakra-ui/icons";
import axios from "axios";

const API_GET_VENDORS = "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/vendor/host";
const API_VENDOR = "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/vendor";
const API_SEND_EMAIL = "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/mail/send-email";

const AccountManagement = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDetailOpen, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure();
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    urlQr: "",
    status: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editVendorId, setEditVendorId] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const hostId = sessionStorage.getItem("hostId") || "";
  const accessToken = sessionStorage.getItem("accessToken") || "";

  const fetchVendors = async () => {
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
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateAccount = async () => {
    try {
      await axios.post(`${API_VENDOR}/${hostId}`, formData, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      onClose();
      fetchVendors();
      resetForm();
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  const handleEditAccount = async () => {
    try {
      await axios.put(`${API_VENDOR}/${editVendorId}`, formData, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      onClose();
      fetchVendors();
      resetForm();
      setIsEditing(false);
      setEditVendorId(null);
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  const handleDeleteAccount = async (vendorId) => {
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
    }
  };

  const handleSendEmail = async (account) => {
    try {
      const emailBody = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                color: #333;
                margin: 0;
                padding: 0;
              }
              .container {
                width: 100%;
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                background-color: #4caf50;
                color: white;
                padding: 10px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                padding: 20px;
              }
              .content p {
                font-size: 16px;
                line-height: 1.6;
              }
              .table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              .table th, .table td {
                padding: 12px;
                border: 1px solid #ddd;
                text-align: left;
              }
              .table th {
                background-color: #f4f4f9;
                font-weight: bold;
              }
              .footer {
                text-align: center;
                font-size: 12px;
                color: #888;
                margin-top: 20px;
              }
              .footer a {
                color: #4caf50;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Your Account Details</h1>
              </div>
              <div class="content">
                <p>Dear <strong>${account.name}</strong>,</p>
                <p>Your account has been successfully created! Below are your account details:</p>
                <table class="table">
                  <tr>
                    <th>Username</th>
                    <td>${account.username}</td>
                  </tr>
                  <tr>
                    <th>Password</th>
                    <td>${account.password}</td>
                  </tr>
                  <tr>
                    <th>Name</th>
                    <td>${account.name}</td>
                  </tr>
                  <tr>
                    <th>Phone</th>
                    <td>${account.phone}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>${account.email}</td>
                  </tr>
                  <tr>
                    <th>Address</th>
                    <td>${account.address}</td>
                  </tr>
                  <tr>
                    <th>QR URL</th>
                    <td>${account.urlQr}</td>
                  </tr>
                </table>
                <p>Thank you for being with us!</p>
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
      alert("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email.");
    }
  };
  

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      name: "",
      phone: "",
      email: "",
      address: "",
      urlQr: "",
      status: true,
    });
  };

  const openEditModal = (account) => {
    setIsEditing(true);
    setEditVendorId(account.vendorid);
    setFormData({
      username: account.username,
      password: account.password,
      name: account.name,
      phone: account.phone,
      email: account.email,
      address: account.address,
      urlQr: account.urlQr,
      status: account.status,
    });
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
    <Box p={8} bg="gray.100" borderRadius="lg" shadow="lg" maxW="1200px" mx="auto">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" fontWeight="bold" color="teal.600">
          Account Management
        </Heading>
        <IconButton
          colorScheme="teal"
          icon={<AddIcon />}
          onClick={() => {
            setIsEditing(false);
            resetForm();
            onOpen();
          }}
          aria-label="Add Account"
        />
      </Flex>

      <TableContainer borderRadius="md" shadow="md" bg="white">
        <Table variant="simple" colorScheme="teal">
          <Thead bg="teal.500">
            <Tr>
              <Th color="white">No</Th>
              <Th color="white">Username</Th>
              {/* <Th color="white">Password</Th> */}
              <Th color="white">Name</Th>
              {/* <Th color="white">Phone</Th> */}
              <Th color="white">Email</Th>
              {/* <Th color="white">Address</Th> */}
              <Th color="white">QR URL</Th>
              <Th color="white">Status</Th>
              <Th color="white">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {accounts.map((account, index) => (
              <Tr key={account.vendorid}>
                <Td>{index + 1}</Td>
                <Td>{account.username}</Td>
                {/* <Td>****</Td> */}
                <Td>{account.name}</Td>
                {/* <Td>{account.phone}</Td> */}
                <Td>{account.email}</Td>
                {/* <Td>{account.address}</Td> */}
                <Td>{account.urlQr}</Td>
                <Td>
                  <Badge
                    colorScheme={account.status ? "green" : "red"}
                    variant="solid"
                    onClick={() => handleToggleStatus(account.vendorid, account.status)}
                    style={{ cursor: "pointer" }}
                  >
                    {account.status ? "Active" : "Inactive"}
                  </Badge>
                </Td>
                <Td>
                  <Tooltip label="Details">
                    <IconButton
                      size="sm"
                      colorScheme="blue"
                      icon={<InfoIcon />}
                      onClick={() => openDetailModal(account)}
                      mr={2}
                      aria-label="View Details"
                    />
                  </Tooltip>
                  <Tooltip label="Edit">
                    <IconButton
                      size="sm"
                      colorScheme="yellow"
                      icon={<EditIcon />}
                      onClick={() => openEditModal(account)}
                      mr={2}
                      aria-label="Edit Account"
                    />
                  </Tooltip>
                  <Tooltip label="Send Email">
                    <IconButton
                      size="sm"
                      colorScheme="teal"
                      icon={<EmailIcon />}
                      onClick={() =>
                        handleSendEmail(account)
                      }
                      mr={2}
                      aria-label="Send Email"
                    />
                  </Tooltip>
                  <Tooltip label="Delete">
                    <IconButton
                      size="sm"
                      colorScheme="red"
                      icon={<DeleteIcon />}
                      onClick={() => handleDeleteAccount(account.vendorid)}
                      aria-label="Delete Account"
                    />
                  </Tooltip>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? "Edit Account" : "Create New Account"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Password</FormLabel>
              <Input
                name="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Phone</FormLabel>
              <Input
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Address</FormLabel>
              <Input
                name="address"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>QR URL</FormLabel>
              <Input
                name="urlQr"
                placeholder="Enter QR code URL"
                value={formData.urlQr}
                onChange={handleInputChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              mr={3}
              onClick={isEditing ? handleEditAccount : handleCreateAccount}
            >
              {isEditing ? "Update" : "Create"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDetailOpen} onClose={onCloseDetail}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Account Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p><strong>Username:</strong> {selectedAccount?.username}</p>
            <p><strong>Password:</strong> {selectedAccount?.password}</p>
            <p><strong>Name:</strong> {selectedAccount?.name}</p>
            <p><strong>Phone:</strong> {selectedAccount?.phone}</p>
            <p><strong>Email:</strong> {selectedAccount?.email}</p>
            <p><strong>Address:</strong> {selectedAccount?.address}</p>
            <p><strong>QR URL:</strong> {selectedAccount?.urlQr}</p>
            <p><strong>Status:</strong> {selectedAccount?.status ? "Active" : "Inactive"}</p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={onCloseDetail}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AccountManagement;
