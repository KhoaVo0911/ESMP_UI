import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Box,
  InputGroup,
  InputLeftElement,
  FormErrorMessage,
  useToast,
  Select,
} from "@chakra-ui/react";
import {
  EditIcon,
  DeleteIcon,
  ViewIcon,
  SearchIcon,
  EmailIcon,
} from "@chakra-ui/icons";
import axios from "axios";

const AdminAccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [newAccount, setNewAccount] = useState({
    username: "",
    password: "",
    name: "",
    phone: "",
    email: "",
    expiretime: "",
  });
  const [error, setError] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const toast = useToast(); // Initialize toast

  // Modal disclosures
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();
  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const sendEmail = async (account) => {
    let subject = "";
    let body = "";

    // Chọn nội dung email dựa trên trạng thái
    switch (account.emailType) {
      case "activatedFirstTime":
        subject = "Your account has been activated";
        body = `
          <p>Dear ${account.account.name},</p>
          <p>Congratulations! Your account has been successfully activated for the first time.</p>
          <p>Please review our contract  <a href="https://docs.google.com/document/d/1a7-4GR1zZADkCw6CzCYRZ_guTl88MF4c/edit?usp=sharing&ouid=104522618690737883282&rtpof=true&sd=true" .</p>
          <p>Best regards,</p>
          <p>The Admin Team</p>
        `;
        break;

      case "reactivated":
        subject = "Your account has been reactivated";
        body = `
          <p>Dear ${account.account.name},</p>
          <p>Good news! Your account has been reactivated. Welcome back!</p>
          <p>Please check your account and review any updates.</p>
          <p>Best regards,</p>
          <p>The Admin Team</p>
        `;
        break;

      case "deactivated":
        subject = "Your account has been deactivated";
        body = `
          <p>Dear ${account.account.name},</p>
          <p>We regret to inform you that your account has been deactivated. If you believe this is a mistake, please contact our support team.</p>
          <p>Best regards,</p>
          <p>The Admin Team</p>
        `;
        break;

      default:
        console.error("Unknown email type");
        return;
    }

    try {
      const emailData = new FormData();
      emailData.append("toEmail", account.account.email);
      emailData.append("subject", subject);
      emailData.append("body", body);

      await axios.post("https://esmpbe.id.vn/api/mail/send-email", emailData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Email Sent.",
        description: `An email has been sent to ${account.account.email}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      // toast({
      //   title: "Email Error.",
      //   description: "There was an error sending the email. Please try again.",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      // });
    }
  };

  // Get list of accounts from API
  useEffect(() => {
    axios
      .get("https://esmpbe.id.vn/api/host")
      .then((response) => {
        const sortedAccounts = response.data.sort((a, b) => {
          // Sắp xếp theo trạng thái: Active (true) trước Inactive (false)
          if (a.account.status !== b.account.status) {
            return b.account.status - a.account.status;
          }
          // Nếu trạng thái giống nhau, sắp xếp theo thời gian tạo (mới nhất trước)
          return new Date(b.account.createdat) - new Date(a.account.createdat);
        });

        setAccounts(sortedAccounts); // Lưu lại dữ liệu đã sắp xếp
        setFilteredAccounts(sortedAccounts); // Lưu lại filtered accounts (nếu có)
      })
      .catch((error) => console.error(error));
  }, []);

  // Handle search filter
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const lowercasedSearchTerm = event.target.value.toLowerCase();
    const filteredData = accounts.filter(
      (account) =>
        account.account.username.toLowerCase().includes(lowercasedSearchTerm) ||
        account.account.name.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredAccounts(filteredData);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Get current page's accounts
  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = filteredAccounts.slice(
    indexOfFirstAccount,
    indexOfLastAccount
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Create a new account
  const createAccount = () => {
    if (validateForm()) {
      const updatedAccount = {
        ...newAccount,
        expiretime: new Date(
          new Date().setDate(new Date().getDate() + 7)
        ).toISOString(),
      };
      axios
        .post("https://esmpbe.id.vn/api/user/register", updatedAccount)
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
          axios
            .get("https://esmpbe.id.vn/api/host")
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
    if (
      newAccount.email &&
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(newAccount.email)
    ) {
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
      apibanking: selectedAccount.apibanking,
      status: selectedAccount.account.status, // Update status field
    };
    axios
      .put(
        `https://esmpbe.id.vn/api/host/${selectedAccount.hostid}`,
        updatedData
      )
      .then((response) => {
        toast({
          title: "Account Updated.",
          description: "The account has been updated successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Fetch the updated account list after the update
        axios
          .get("https://esmpbe.id.vn/api/host")
          .then((response) => {
            const sortedAccounts = response.data.sort((a, b) => {
              // Sắp xếp theo trạng thái: Active (true) trước Inactive (false)
              if (a.account.status !== b.account.status) {
                return b.account.status - a.account.status;
              }
              // Nếu trạng thái giống nhau, sắp xếp theo thời gian tạo (mới nhất trước)
              return (
                new Date(b.account.createdat) - new Date(a.account.createdat)
              );
            });

            setAccounts(sortedAccounts); // Update state with sorted accounts
            setFilteredAccounts(sortedAccounts); // Update filtered accounts
          })
          .catch((error) => {
            console.error("Error fetching updated accounts:", error);
            toast({
              title: "Error Fetching Accounts.",
              description:
                "There was an error fetching the latest account data.",
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
        toast({
          title: "Error Updating Account.",
          description:
            "There was an error updating the account. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
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
  const toggleStatus = (account) => {
    const updatedStatus = !account.account.status; // Toggle the status

    const updatedAccount = {
      ...account,
      account: { ...account.account, status: updatedStatus },
    };

    axios
      .put(`https://esmpbe.id.vn/api/host/${account.hostid}`, {
        ...updatedAccount.account,
      })
      .then((response) => {
        // Update the status in the accounts state
        const updatedAccounts = accounts.map((acc) =>
          acc.account.id === account.account.id ? updatedAccount : acc
        );

        // Sort the accounts by status and creation date
        const sortedAccounts = updatedAccounts.sort((a, b) => {
          if (a.account.status !== b.account.status) {
            return b.account.status - a.account.status; // Active first
          }
          return new Date(b.account.createdat) - new Date(a.account.createdat); // Latest first
        });

        setAccounts(sortedAccounts); // Update state with sorted accounts
        setFilteredAccounts(sortedAccounts); // Update filtered accounts

        toast({
          title: "Account Status Updated.",
          description: `The account status has been successfully updated to ${
            updatedStatus ? "Active" : "Inactive"
          }.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Check conditions for sending different emails
        if (updatedStatus) {
          if (account.account.createdat === account.account.updatedat) {
            // Case 1: Account activated for the first time
            sendEmail({
              ...updatedAccount,
              emailType: "activatedFirstTime",
            });
          } else {
            // Case 2: Account reactivated
            sendEmail({
              ...updatedAccount,
              emailType: "reactivated",
            });
          }
        } else {
          // Case 3: Account deactivated
          sendEmail({
            ...updatedAccount,
            emailType: "deactivated",
          });
        }
      })
      .catch((error) => {
        console.error("Error updating account status:", error);
        toast({
          title: "Error Updating Status.",
          description:
            "There was an error updating the status. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <Stack spacing={4} p={4}>
      {/* Search Bar */}
      <InputGroup mb={4} justifyContent="center" width="auto" maxWidth="400px">
        <InputLeftElement pointerEvents="none" />
        <Input
          type="text"
          placeholder="Search accounts..."
          value={searchTerm}
          onChange={handleSearch}
          size="xl"
          borderColor="black"
          focusBorderColor="teal.500"
          borderRadius="md"
          p={2}
        />
      </InputGroup>

      {/* Create Account Button */}
      {/* <Button colorScheme="teal" onClick={onCreateOpen} mb={4} size="sm">
        Create Account
      </Button> */}

      {/* Table displaying accounts */}
      <Box
        border="1px"
        borderColor="gray.200"
        borderRadius="md"
        boxShadow="lg"
        p={4}
      >
        <Table variant="striped" size="md" colorScheme="gray" borderRadius="md">
          <Thead>
            <Tr>
              <Th>Username</Th>
              <Th>Name</Th>
              <Th>Status</Th> {/* Make this clickable */}
              <Th textAlign="center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentAccounts.map((account) => (
              <Tr key={account.account.id}>
                <Td>{account.account.username}</Td>
                <Td>{account.account.name}</Td>
                <Td>
                  <Button
                    size="sm"
                    onClick={() => toggleStatus(account)}
                    colorScheme={account.account.status ? "green" : "red"}
                  >
                    {account.account.status ? "Active" : "Inactive"}
                  </Button>
                </Td>
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
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination */}
      <Box textAlign="center" mt={4}>
        <Button
          onClick={() => paginate(currentPage - 1)}
          isDisabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => paginate(currentPage + 1)}
          isDisabled={
            currentPage === Math.ceil(filteredAccounts.length / accountsPerPage)
          }
        >
          Next
        </Button>
      </Box>

      {/* Create Account Modal */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={error.username}>
              <FormLabel>Username</FormLabel>
              <Input
                value={newAccount.username}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, username: e.target.value })
                }
              />
              <FormErrorMessage>{error.username}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={error.password}>
              <FormLabel>Password</FormLabel>
              <Input
                value={newAccount.password}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, password: e.target.value })
                }
              />
              <FormErrorMessage>{error.password}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={error.name}>
              <FormLabel>Name</FormLabel>
              <Input
                value={newAccount.name}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, name: e.target.value })
                }
              />
              <FormErrorMessage>{error.name}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={error.phone}>
              <FormLabel>Phone</FormLabel>
              <Input
                value={newAccount.phone}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, phone: e.target.value })
                }
              />
              <FormErrorMessage>{error.phone}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={error.email}>
              <FormLabel>Email</FormLabel>
              <Input
                value={newAccount.email}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, email: e.target.value })
                }
              />
              <FormErrorMessage>{error.email}</FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={createAccount}>
              Create
            </Button>
            <Button variant="ghost" onClick={onCreateClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Account Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input value={selectedAccount?.account.username} readOnly />
            </FormControl>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                value={selectedAccount?.account.name}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    account: {
                      ...selectedAccount.account,
                      name: e.target.value,
                    },
                  })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                value={selectedAccount?.account.email}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    account: {
                      ...selectedAccount.account,
                      email: e.target.value,
                    },
                  })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input
                value={selectedAccount?.account.phone}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    account: {
                      ...selectedAccount.account,
                      phone: e.target.value,
                    },
                  })
                }
              />
            </FormControl>
            {/* <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                value={selectedAccount?.account.status ? "active" : "inactive"}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    account: {
                      ...selectedAccount.account,
                      status: e.target.value === "active",
                    },
                  })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </FormControl> */}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={updateAccount}>
              Update
            </Button>
            <Button variant="ghost" onClick={onEditClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Account Modal */}
      <Modal isOpen={isDetailOpen} onClose={onDetailClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Account Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Username: {selectedAccount?.account.username}</p>
            <p>Name: {selectedAccount?.account.name}</p>
            <p>Email: {selectedAccount?.account.email}</p>
            <p>Phone: {selectedAccount?.account.phone}</p>
            <p>
              Status: {selectedAccount?.account.status ? "Active" : "Inactive"}
            </p>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onDetailClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default AdminAccountManagement;
