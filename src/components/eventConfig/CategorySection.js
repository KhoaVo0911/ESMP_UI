// src/components/CategorySection.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const CategorySection = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Food", status: "ACTIVE" },
    { id: 2, name: "Drink", status: "INACTIVE" },
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpenCreateCategory = () => {
    setSelectedCategory(null);
    setNewCategory("");
    onOpen();
  };

  const handleOpenEditCategory = (category) => {
    setSelectedCategory(category);
    setNewCategory(category.name);
    onOpen();
  };

  const handleSaveCategory = () => {
    if (selectedCategory) {
      setCategories(
        categories.map((cat) =>
          cat.id === selectedCategory.id ? { ...cat, name: newCategory } : cat
        )
      );
    } else {
      setCategories([
        ...categories,
        { id: categories.length + 1, name: newCategory, status: "ACTIVE" },
      ]);
    }
    onClose();
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  return (
    <Box mb={10}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" fontWeight="bold" color="blue.600">
          Manage Categories
        </Heading>
        <Button
          colorScheme="blue"
          leftIcon={<AddIcon />}
          onClick={handleOpenCreateCategory}
        >
          Create New Category
        </Button>
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
            <Th>Name</Th>
            <Th>Status</Th>
            <Th textAlign="center">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {categories.map((category, index) => (
            <Tr key={category.id}>
              <Td>{index + 1}</Td>
              <Td>{category.name}</Td>
              <Td>
                <Badge
                  colorScheme={category.status === "ACTIVE" ? "green" : "red"}
                >
                  {category.status}
                </Badge>
              </Td>
              <Td textAlign="center">
                <Button
                  size="sm"
                  colorScheme="blue"
                  mr={2}
                  onClick={() => handleOpenEditCategory(category)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedCategory ? "Edit Category" : "Create Category"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Category Name</FormLabel>
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSaveCategory}>
              {selectedCategory ? "Update" : "Create"}
            </Button>
            <Button onClick={onClose} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CategorySection;
