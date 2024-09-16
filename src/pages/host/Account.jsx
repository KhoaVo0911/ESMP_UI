import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Button,
  Box,
  Heading,
  Flex,
  Input,
  Select,
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
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

// Sample data for accounts
const accountData = [
  {
    id: 1,
    username: "user1",
    password: "*****",
    hostname: "host1",
    expireTime: "2024-12-31",
    status: "Active",
  },
  {
    id: 2,
    username: "user2",
    password: "*****",
    hostname: "host2",
    expireTime: "2025-01-15",
    status: "Inactive",
  },
  // Add more accounts as needed
];

const AccountManagement = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    hostname: "",
    expireTime: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateAccount = () => {
    console.log("Account created", formData);
    onClose();
  };

  return (
    <Box
      p={8}
      bg="gray.50"
      borderRadius="lg"
      shadow="lg"
      maxW="1920px"
      mx="auto"
    >
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" fontWeight="bold" color="blue.600">
          Account Management
        </Heading>
        <Button
          colorScheme="blue"
          leftIcon={<AddIcon />}
          size="md"
          px={6}
          onClick={onOpen}
        >
          Create Account
        </Button>
      </Flex>

      <TableContainer borderRadius="md" shadow="md" bg="white">
        <Table variant="striped" colorScheme="gray" size="lg">
          <Thead bg="gray.200">
            <Tr>
              <Th>Username</Th>
              <Th>Password</Th>
              <Th>Hostname</Th>
              <Th>Expire Time</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {accountData.map((account, index) => (
              <Tr key={account.id}>
                <Td fontWeight="medium">{account.username}</Td>
                <Td>{account.password}</Td>
                <Td>{account.hostname}</Td>
                <Td>{account.expireTime}</Td>
                <Td>
                  <Badge
                    colorScheme={account.status === "Active" ? "green" : "red"}
                    variant="solid"
                    px={4}
                    py={1}
                    borderRadius="md"
                  >
                    {account.status}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Create Account Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Password</FormLabel>
              <Input
                name="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Hostname</FormLabel>
              <Input
                name="hostname"
                placeholder="Enter hostname"
                value={formData.hostname}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Expire Time</FormLabel>
              <Input
                name="expireTime"
                type="date"
                placeholder="Enter expire time"
                value={formData.expireTime}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Status</FormLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateAccount}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AccountManagement;
