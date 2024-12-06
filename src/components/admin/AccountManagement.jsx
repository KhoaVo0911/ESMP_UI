import React, { useState, useEffect } from "react";
import {
  Table, Thead, Tbody, Tr, Th, Td, IconButton, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, useDisclosure, FormControl,
  FormLabel, Input, Stack, Button, Box, InputGroup, InputLeftElement, FormErrorMessage, useToast
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, ViewIcon, SearchIcon } from "@chakra-ui/icons";
import axios from "axios";

const AdminAccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [newAccount, setNewAccount] = useState({
    username: "", password: "", name: "", phone: "", email: "", expiretime: ""
  });
  const [error, setError] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const toast = useToast(); // Initialize toast

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
    if (validateForm()) {
      const updatedAccount = { ...newAccount, expiretime: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString() };
      axios.post("https://esmpbe.id.vn/api/user/register", updatedAccount)
        .then((response) => {
          setAccounts([...accounts, response.data]);
          setFilteredAccounts([...filteredAccounts, response.data]);
          onCreateClose();

          // Show success toast
          toast({
            title: "Account Created.",
            description: "The account has been created successfully.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });

          // Refetch the data to make sure it's updated
          axios.get("https://esmpbe.id.vn/api/host")
            .then((response) => {
              setAccounts(response.data);
              setFilteredAccounts(response.data);
            })
            .catch((error) => console.error(error));
        })
        .catch((error) => console.error(error));
    }
  };

  // Validation function
  const validateForm = () => {
    const newError = {};

    // Check for empty fields
    if (!newAccount.username) newError.username = "Username is required";
    if (!newAccount.password) newError.password = "Password is required";
    if (!newAccount.name) newError.name = "Name is required";
    if (!newAccount.phone) newError.phone = "Phone number is required";
    if (!newAccount.email) newError.email = "Email is required";

    // Password should only be numbers
    if (newAccount.password && !/^\d+$/.test(newAccount.password)) {
      newError.password = "Password must be numeric";
    }

    // Email format validation
    if (newAccount.email && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(newAccount.email)) {
      newError.email = "Email format is invalid";
    }

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  // Update account details
  const updateAccount = () => {
    if (!selectedAccount) return;
  
    const updatedData = {
      name: selectedAccount.account.name,
      phone: selectedAccount.account.phone,
      email: selectedAccount.account.email,
      expiretime: selectedAccount.expiretime,
      eventstoragetime: selectedAccount.eventstoragetime,
      bankingaccount: selectedAccount.bankingaccount,
      apibanking: selectedAccount.apibanking
    };
  
    axios.put(`https://esmpbe.id.vn/api/host/${selectedAccount.hostid}`, updatedData)
      .then((response) => {
        // Show success toast
        toast({
          title: "Account Updated.",
          description: "The account has been updated successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
  
        // Fetch the updated account list after the update
        axios.get("https://esmpbe.id.vn/api/host")
          .then((response) => {
            setAccounts(response.data);  // Update the accounts state with the latest data
            setFilteredAccounts(response.data);  // Update the filtered accounts as well
          })
          .catch((error) => {
            console.error("Error fetching updated accounts:", error);
            toast({
              title: "Error Fetching Accounts.",
              description: "There was an error fetching the latest account data.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          });
  
        // Close the modal and reset the selected account
        setSelectedAccount(null);
        onEditClose();
      })
      .catch((error) => {
        console.error(error);
  
        // Show error toast
        toast({
          title: "Error Updating Account.",
          description: "There was an error updating the account. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };
  
  // Delete account
  // const deleteAccount = (hostid) => {
  //   axios.delete(`https://esmpbe.id.vn/api/host/${hostid}`)
  //     .then(() => {
  //       setAccounts(accounts.filter(acc => acc.account.hostid !== hostid));
  //       setFilteredAccounts(filteredAccounts.filter(acc => acc.account.hostid !== hostid));
  //     })
  //     .catch((error) => console.error(error));
  // };

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

      {/* Create Account Button */}
     

      {/* Table displaying accounts */}
      <Box border="1px" borderColor="gray.200" borderRadius="md" boxShadow="lg" p={4}>
      <Button colorScheme="teal" onClick={onCreateOpen} mb={4} size="sm">
        Create Account
      </Button>
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
                  {/* <IconButton
                    icon={<DeleteIcon />}
                    aria-label="Delete account"
                    onClick={() => deleteAccount(account.account.hostid)}
                    variant="ghost"
                    size="sm"
                    mx={1}
                  /> */}
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
              <Input value={selectedAccount?.account?.phone} isReadOnly />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input value={selectedAccount?.account?.email} isReadOnly />
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
      {/* Create Account Modal */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={error.username}>
              <FormLabel>Username</FormLabel>
              <Input
                value={newAccount.username}
                onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
              />
              <FormErrorMessage>{error.username}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={error.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={newAccount.password}
                onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
              />
              <FormErrorMessage>{error.password}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={error.name}>
              <FormLabel>Name</FormLabel>
              <Input
                value={newAccount.name}
                onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
              />
              <FormErrorMessage>{error.name}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={error.phone}>
              <FormLabel>Phone</FormLabel>
              <Input
                value={newAccount.phone}
                onChange={(e) => setNewAccount({ ...newAccount, phone: e.target.value })}
              />
              <FormErrorMessage>{error.phone}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={error.email}>
              <FormLabel>Email</FormLabel>
              <Input
                value={newAccount.email}
                onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
              />
              <FormErrorMessage>{error.email}</FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onCreateClose}>Cancel</Button>
            <Button colorScheme="teal" onClick={createAccount}>Create Account</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
                onChange={(e) => setSelectedAccount({ ...selectedAccount, account: { ...selectedAccount, bankingaccount: e.target.value } })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>API BANKING</FormLabel>
              <Input
                value={selectedAccount?.apibanking}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, account: { ...selectedAccount, apibanking: e.target.value } })}
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
