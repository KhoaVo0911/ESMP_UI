import React, { useState, useEffect } from "react";
import {
  Table, Thead, Tbody, Tr, Th, Td, IconButton, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, useDisclosure, FormControl,
  FormLabel, Input, Stack, Button, Box, InputGroup, InputLeftElement
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, ViewIcon, SearchIcon } from "@chakra-ui/icons";
import axios from "axios";

const AdminAccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [newAccount, setNewAccount] = useState({
    userid: "", password: "", email: "", expiretime: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal disclosures
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  // Get list of accounts from API
  useEffect(() => {
    axios.get("https://esmpbe.id.vn/api/host")
      .then((response) => {
        setAccounts(response.data); // Assuming the API returns account data
        setFilteredAccounts(response.data); // Set initial filtered accounts
      })
      .catch((error) => console.error(error));
  }, []);

  // Handle search filter
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const lowercasedSearchTerm = event.target.value.toLowerCase();
    const filteredData = accounts.filter(account =>
      account.account.username.toLowerCase().includes(lowercasedSearchTerm) ||
      account.account.name.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredAccounts(filteredData);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Get current page's accounts
  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = filteredAccounts.slice(indexOfFirstAccount, indexOfLastAccount);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Create a new account
  const createAccount = () => {
    const newHostAccount = { ...newAccount, role: "Host" };
    axios.post("https://esmpbe.id.vn/api/host", newHostAccount)
      .then((response) => {
        setAccounts([...accounts, response.data]);
        setFilteredAccounts([...filteredAccounts, response.data]);
        onCreateClose();
      })
      .catch((error) => console.error(error));
  };

  // Update account details
  const updateAccount = () => {
    if (!selectedAccount) return;
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
        setSelectedAccount(null);
        onEditClose();
      })
      .catch((error) => console.error(error));
  };

  // Delete account
  const deleteAccount = (id) => {
    axios.delete(`https://esmpbe.id.vn/api/host/${id}`)
      .then(() => {
        setAccounts(accounts.filter(acc => acc.account.id !== id));
        setFilteredAccounts(filteredAccounts.filter(acc => acc.account.id !== id));
      })
      .catch((error) => console.error(error));
  };

  // View account details and open the modal
  const viewDetails = (account) => {
    setSelectedAccount(account);
    onDetailOpen();
  };

  // Open edit modal
  const openEditModal = (account) => {
    setSelectedAccount(account);
    onEditOpen();
  };

  return (
    <Stack spacing={4} p={4}>
      {/* Search Bar */}
      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />} />
        <Input
          type="text"
          placeholder="Search accounts..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </InputGroup>

      {/* Table displaying accounts */}
      <Box border="1px" borderColor="gray.200" borderRadius="md" boxShadow="lg" p={4}>
        <Table variant="striped" size="md" colorScheme="gray" borderRadius="md">
          <Thead>
            <Tr>
              <Th>Username</Th>
              <Th>Password</Th>
              <Th>Name</Th>
              <Th>Status</Th>
              <Th textAlign="center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentAccounts.map((account) => (
              <Tr key={account.account.id}>
                <Td>{account.account.username}</Td>
                <Td>*******</Td>
                <Td>{account.account.name}</Td>
                <Td>{account.account.status ? 'Active' : 'Inactive'}</Td>
                <Td textAlign="center">
                  {/* View details button */}
                  <IconButton
                    icon={<ViewIcon />}
                    aria-label="View account details"
                    onClick={() => viewDetails(account)}
                    variant="ghost"
                    size="sm"
                    mx={1}
                  />
                  {/* Edit account button */}
                  <IconButton
                    icon={<EditIcon />}
                    aria-label="Edit account"
                    onClick={() => openEditModal(account)}
                    variant="ghost"
                    size="sm"
                    mx={1}
                  />
                  {/* Delete account button */}
                  <IconButton
                    icon={<DeleteIcon />}
                    aria-label="Delete account"
                    onClick={() => deleteAccount(account.account.id)}
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

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Button
          onClick={() => paginate(currentPage - 1)}
          isDisabled={currentPage === 1}
          mr={2}
        >
          Prev
        </Button>
        {[...Array(Math.ceil(filteredAccounts.length / accountsPerPage))].map((_, index) => (
          <Button
            key={index}
            onClick={() => paginate(index + 1)}
            variant={index + 1 === currentPage ? "solid" : "outline"}
            colorScheme="teal"
            mx={1}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          onClick={() => paginate(currentPage + 1)}
          isDisabled={currentPage === Math.ceil(filteredAccounts.length / accountsPerPage)}
          ml={2}
        >
          Next
        </Button>
      </Box>

      {/* Modal for viewing account details */}
      <Modal isOpen={isDetailOpen} onClose={onDetailClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Account Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input value={selectedAccount?.account?.name} isReadOnly />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Phone</FormLabel>
              <Input value={selectedAccount?.account.phone} isReadOnly />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input value={selectedAccount?.account.email} isReadOnly />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Expire Time</FormLabel>
              <Input value={selectedAccount?.expiretime ? new Date(selectedAccount.expiretime).toLocaleDateString() : ''} isReadOnly />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Event Storage Time</FormLabel>
              <Input value={selectedAccount?.eventstoragetime ? new Date(selectedAccount.eventstoragetime).toLocaleDateString() : ''} isReadOnly />
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
              <FormLabel>Name</FormLabel>
              <Input
                value={selectedAccount?.account?.name}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, account: { ...selectedAccount.account, name: e.target.value } })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Phone</FormLabel>
              <Input
                value={selectedAccount?.account?.phone}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, account: { ...selectedAccount.account, phone: e.target.value } })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                value={selectedAccount?.account?.email}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, account: { ...selectedAccount.account, email: e.target.value } })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Expire Time</FormLabel>
              <Input value={selectedAccount?.expiretime ? new Date(selectedAccount.expiretime).toLocaleDateString() : ''} isReadOnly />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Event Storage Time</FormLabel>
              <Input value={selectedAccount?.eventstoragetime ? new Date(selectedAccount.eventstoragetime).toLocaleDateString() : ''} isReadOnly />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Banking Account</FormLabel>
              <Input
                value={selectedAccount?.bankingaccount}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, account: { ...selectedAccount.account, bankingaccount: e.target.value } })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>API BANKING</FormLabel>
              <Input
                value={selectedAccount?.apibanking}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, account: { ...selectedAccount.account, apibanking: e.target.value } })}
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
