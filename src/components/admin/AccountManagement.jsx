import React, { useState, useEffect } from "react";
import { 
  Table, Thead, Tbody, Tr, Th, Td, IconButton, Modal, 
  ModalOverlay, ModalContent, ModalHeader, ModalFooter, 
  ModalBody, ModalCloseButton, useDisclosure, FormControl, 
  FormLabel, Input, Stack , Button, Box
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";

const AdminAccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [newAccount, setNewAccount] = useState({ username: "", password: "", email: "" });
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Lấy danh sách tài khoản role "Host"
  useEffect(() => {
    axios.get("https://668e540abf9912d4c92dcd67.mockapi.io/login")
      .then((response) => {
        const hostAccounts = response.data.filter(account => account.role.toLowerCase() === "host");
        setAccounts(hostAccounts);
      })
      .catch((error) => console.error(error));
  }, []);

  // Thêm tài khoản mới
  const createAccount = () => {
    const newHostAccount = { ...newAccount, role: "Host" };
    axios.post("https://668e540abf9912d4c92dcd67.mockapi.io/login", newHostAccount)
      .then((response) => {
        setAccounts([...accounts, response.data]);
        onClose();
      })
      .catch((error) => console.error(error));
  };

  // Cập nhật tài khoản
  const updateAccount = (id) => {
    axios.put(`https://668e540abf9912d4c92dcd67.mockapi.io/login/${id}`, selectedAccount)
      .then((response) => {
        setAccounts(accounts.map(acc => acc.id === id ? response.data : acc));
        setSelectedAccount(null);
      })
      .catch((error) => console.error(error));
  };

  // Xóa tài khoản
  const deleteAccount = (id) => {
    axios.delete(`https://668e540abf9912d4c92dcd67.mockapi.io/login/${id}`)
      .then(() => {
        setAccounts(accounts.filter(acc => acc.id !== id));
      })
      .catch((error) => console.error(error));
  };

  return (
    <Stack spacing={4} p={4}>
      <Button onClick={onOpen} colorScheme="teal" size="sm" mb={4} alignSelf="flex-start">Create New Account</Button>

      <Box border="1px" borderColor="gray.200" borderRadius="md" boxShadow="lg" p={4}>
        <Table variant="striped" size="md" colorScheme="gray" borderRadius="md">
          <Thead>
            <Tr>
              <Th>Username</Th>
              <Th>Password</Th>
              <Th>Email</Th>
              <Th>Role</Th> {/* Cột hiển thị role */}
              <Th textAlign="center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {accounts.map((account) => (
              <Tr key={account.id}>
                <Td>{account.username}</Td>
                <Td>{account.password}</Td>
                <Td>{account.email || "N/A"}</Td>
                <Td>{account.role}</Td> {/* Hiển thị role */}
                <Td textAlign="center">
                  <IconButton
                    icon={<EditIcon />}
                    aria-label="Edit account"
                    onClick={() => setSelectedAccount(account)}
                    variant="ghost"
                    size="sm"
                    mx={1}
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    aria-label="Delete account"
                    onClick={() => deleteAccount(account.id)}
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

      {/* Modal để tạo hoặc chỉnh sửa tài khoản */}
      <Modal isOpen={isOpen || selectedAccount} onClose={() => { onClose(); setSelectedAccount(null); }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedAccount ? "Edit Account" : "Create New Account"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                value={selectedAccount ? selectedAccount.username : newAccount.username}
                onChange={(e) =>
                  selectedAccount
                    ? setSelectedAccount({ ...selectedAccount, username: e.target.value })
                    : setNewAccount({ ...newAccount, username: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={selectedAccount ? selectedAccount.password : newAccount.password}
                onChange={(e) =>
                  selectedAccount
                    ? setSelectedAccount({ ...selectedAccount, password: e.target.value })
                    : setNewAccount({ ...newAccount, password: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                value={selectedAccount ? selectedAccount.email : newAccount.email}
                onChange={(e) =>
                  selectedAccount
                    ? setSelectedAccount({ ...selectedAccount, email: e.target.value })
                    : setNewAccount({ ...newAccount, email: e.target.value })
                }
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => {
              if (selectedAccount) {
                updateAccount(selectedAccount.id);
              } else {
                createAccount();
              }
              onClose();
            }}>
              {selectedAccount ? "Save Changes" : "Create"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default AdminAccountManagement;
