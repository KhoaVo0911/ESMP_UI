import React, { useState, useEffect } from "react";
import {
  Table, Thead, Tbody, Tr, Th, Td, IconButton, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, useDisclosure, FormControl,
  FormLabel, Input, Stack, Button, Box
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import axios from "axios";

const AdminAccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [newAccount, setNewAccount] = useState({
    userid: "", password: "", email: "", expiretime: ""
  });

  // Modal for creating new account
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  // Modal for viewing account details
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  // Modal for editing account
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  // Get list of accounts from API
  useEffect(() => {
    axios.get("https://esmpbe.id.vn/api/host")
      .then((response) => {
        setAccounts(response.data); // Assuming the API returns account data
      })
      .catch((error) => console.error(error));
  }, []);

  // Create a new account
  const createAccount = () => {
    const newHostAccount = { ...newAccount, role: "Host" };
    axios.post("https://esmpbe.id.vn/api/host", newHostAccount)
      .then((response) => {
        setAccounts([...accounts, response.data]);
        onCreateClose(); // Close modal after creation
      })
      .catch((error) => console.error(error));
  };

  // Update account details
  const updateAccount = () => {
    if (!selectedAccount) return;
    // Chỉ gửi các thay đổi ngoài trường account
    const updatedData = {
      phone: selectedAccount.phone,
      email: selectedAccount.email,
      expiretime: selectedAccount.expiretime,
      eventstoragetime: selectedAccount.eventstoragetime,
      bankingaccount: selectedAccount.bankingaccount
    };

    axios.put(`https://esmpbe.id.vn/api/host/${selectedAccount.account.id}`, updatedData)
      .then((response) => {
        setAccounts(accounts.map(acc => acc.account.id === selectedAccount.account.id ? response.data : acc));
        setSelectedAccount(null); // Reset selected account
        onEditClose(); // Close the edit modal
      })
      .catch((error) => console.error(error));
  };

  // Delete account
  const deleteAccount = (id) => {
    axios.delete(`https://esmpbe.id.vn/api/host/${id}`)
      .then(() => {
        setAccounts(accounts.filter(acc => acc.account.id !== id));
      })
      .catch((error) => console.error(error));
  };

  // View account details and open the modal
  const viewDetails = (account) => {
    setSelectedAccount(account);
    onDetailOpen(); // Open view modal
  };

  // Open edit modal
  const openEditModal = (account) => {
    setSelectedAccount(account);
    onEditOpen(); // Open edit modal
  };

  return (
    <Stack spacing={4} p={4}>
      {/* Button to create new account */}
      <Button onClick={onCreateOpen} colorScheme="teal" size="sm" mb={4} alignSelf="flex-start">
        Create New Account
      </Button>

      {/* Table displaying accounts */}
      <Box border="1px" borderColor="gray.200" borderRadius="md" boxShadow="lg" p={4}>
        <Table variant="striped" size="md" colorScheme="gray" borderRadius="md">
          <Thead>
            <Tr>
              <Th>Username</Th>
              <Th>Password</Th>
              <Th>Name</Th>
              <Th>Role</Th>
              <Th textAlign="center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {accounts.map((account) => (
              <Tr key={account.account.id}>
                <Td>{account.account.username}</Td>
                <Td>{account.account.password}</Td>
                <Td>{account.account.name}</Td>
                <Td>{account.account.role}</Td>
                <Td textAlign="center">
                  {/* View details button */}
                  <IconButton
                    icon={<ViewIcon />}
                    aria-label="View account details"
                    onClick={() => viewDetails(account)} // Open modal to view account details
                    variant="ghost"
                    size="sm"
                    mx={1}
                  />
                  {/* Edit account button */}
                  <IconButton
                    icon={<EditIcon />}
                    aria-label="Edit account"
                    onClick={() => openEditModal(account)} // Open modal to edit
                    variant="ghost"
                    size="sm"
                    mx={1}
                  />
                  {/* Delete account button */}
                  <IconButton
                    icon={<DeleteIcon />}
                    aria-label="Delete account"
                    onClick={() => deleteAccount(account.account.id)} // Delete the account
                    variant="ghost"
                    size="sm"
                    mx={1}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Modal for viewing account details */}
      <Modal isOpen={isDetailOpen} onClose={onDetailClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Account Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>User ID</FormLabel>
              <Input value={selectedAccount?.account?.username} isReadOnly />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Phone</FormLabel>
              <Input value={selectedAccount?.phone} isReadOnly />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input value={selectedAccount?.email} isReadOnly />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Expire Time</FormLabel>
              <Input value={selectedAccount?.expiretime} isReadOnly />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Event Storage Time</FormLabel>
              <Input value={selectedAccount?.eventstoragetime} isReadOnly />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Banking Account</FormLabel>
              <Input value={selectedAccount?.bankingaccount} isReadOnly />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onDetailClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for editing account */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input
                value={selectedAccount?.phone}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, phone: e.target.value })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                value={selectedAccount?.email}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, email: e.target.value })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Expire Time</FormLabel>
              <Input
                value={selectedAccount?.expiretime}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, expiretime: e.target.value })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Event Storage Time</FormLabel>
              <Input
                value={selectedAccount?.eventstoragetime}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, eventstoragetime: e.target.value })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Banking Account</FormLabel>
              <Input
                value={selectedAccount?.bankingaccount}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, bankingaccount: e.target.value })}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onEditClose}>Cancel</Button>
            <Button colorScheme="teal" onClick={updateAccount}>Save Changes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default AdminAccountManagement;
