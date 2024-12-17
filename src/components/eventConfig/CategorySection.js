import React, { useState, useEffect } from "react";
import axios from "axios";
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
  useToast,
  Tooltip,
  Select,
  Checkbox,
  VStack,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [checkedSuggestions, setCheckedSuggestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryStatus, setCategoryStatus] = useState(true);
  const [canCreateCategory, setCanCreateCategory] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const hostId = sessionStorage.getItem("hostId") || "";
  const accessToken = sessionStorage.getItem("accessToken") || "";

  // Static suggestion list
  const staticSuggestions = [
    "Fashion",
    "Technology",
    "Functional foods and beverages",
    "Books and Education",
    "Health and Beauty",
    "Home Appliances and Furniture",
    "Entertainment and Sports",
    "Cars and Motorcycles",
    "Travel and Hotels",
    "Electronics and Digital",
  ];

  const staticThemes = [
    "Music",
    "Sports",
    "Conferences and conferences",
    "Exhibitions and fairs",
    "Education",
    "Charity and fundraising",
    "Entertainment",
    "Culture and festivals",
    "Community and society",
    "Technology and startups",
  ];

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `https://esmpbe.id.vn/api/category/host/${hostId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCategories(response.data);
    } catch (error) {
      console.log("Could not load categories", error);
      // toast({
      //   title: "Error fetching categories",
      //   description: "Could not load categories.",
      //   status: "error",
      //   duration: 3000,
      //   isClosable: true,
      // });
    }
  };
  const fetchHostExpireTime = async () => {
    try {
      const response = await axios.get(
        `https://esmpbe.id.vn/api/host/${hostId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { expiretime } = response.data;
      const currentTime = new Date();
      const expireDate = new Date(expiretime);
      setCanCreateCategory(expireDate > currentTime);
    } catch (error) {
      console.error("Error fetching host expiretime:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchHostExpireTime();
  }, []);

  const handleOpenCreateCategory = () => {
    if (!canCreateCategory) return;
    setSelectedCategory(null);
    setNewCategory("");
    setCheckedSuggestions([]);
    setCategoryStatus(true); // Default to ACTIVE
    onOpen();
  };

  const handleOpenEditCategory = (category) => {
    setSelectedCategory(category);
    setNewCategory(category.categoryName);
    setCategoryStatus(category.status);
    setCheckedSuggestions([]); // Clear previous checks
    onOpen();
  };

  const handleCheckboxChange = (value) => {
    setCheckedSuggestions((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleSaveCategory = async () => {
    try {
      const combinedCategories = [...checkedSuggestions];
      if (newCategory.trim() !== "") {
        combinedCategories.push(newCategory);
      }

      if (selectedCategory) {
        // Update category
        await axios.put(
          `https://esmpbe.id.vn/api/category/${selectedCategory.categoryId}`,
          { categoryName: newCategory, status: categoryStatus },
          {
            headers: { Authorization: `${accessToken}` },
          }
        );
        toast({ title: "Category updated", status: "success" });
      } else {
        // Create new categories
        for (const categoryName of combinedCategories) {
          await axios.post(
            "https://esmpbe.id.vn/api/category",
            { categoryName, hostid: hostId, status: categoryStatus },
            {
              headers: { Authorization: `${accessToken}` },
            }
          );
        }
        toast({ title: "Categories created", status: "success" });
      }

      fetchCategories();
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
      // toast({
      //   title: "Error saving category",
      //   description: "Could not save the category.",
      //   status: "error",
      //   duration: 3000,
      //   isClosable: true,
      // });
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(`https://esmpbe.id.vn/api/category/${categoryId}`, {
        headers: { Authorization: `${accessToken}` },
      });
      setCategories(categories.filter((cat) => cat.categoryId !== categoryId));
      toast({ title: "Category deleted", status: "success" });
    } catch (error) {
      console.log(error, "delete");
      // toast({
      //   title: "Cannot delete category",
      //   description: "This category may be in use.",
      //   status: "error",
      // });
    }
  };

  return (
    <Box mb={10}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" fontWeight="bold" color="blue.600">
          Manage Categories
        </Heading>
        <Tooltip
          label={
            canCreateCategory
              ? ""
              : "Your package has expired, please renew to create a category."
          }
          shouldWrapChildren
        >
          <Button
            colorScheme="blue"
            leftIcon={<AddIcon />}
            onClick={handleOpenCreateCategory}
            disabled={!canCreateCategory}
            style={{
              cursor: canCreateCategory ? "pointer" : "not-allowed",
              opacity: canCreateCategory ? 1 : 0.6,
            }}
          >
            Create New Category
          </Button>
        </Tooltip>
      </Flex>

      {/* Table */}
      <Table variant="simple" size="lg" bg="white" shadow="md">
        <Thead bg="gray.200">
          <Tr>
            <Th>No</Th>
            <Th>Name</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {categories.map((category, index) => (
            <Tr key={category.categoryId}>
              <Td>{index + 1}</Td>
              <Td>{category.categoryName}</Td>
              <Td>
                <Badge colorScheme={category.status ? "green" : "red"}>
                  {category.status ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </Td>
              <Td>
                <Flex gap={2}>
                  <Tooltip
                    label={
                      canCreateCategory
                        ? ""
                        : "Your package has expired, you cannot edit this category."
                    }
                    shouldWrapChildren
                  >
                    <Button
                      size="sm"
                      colorScheme="blue"
                      isDisabled={!canCreateCategory}
                      onClick={() => handleOpenEditCategory(category)}
                    >
                      Edit
                    </Button>
                  </Tooltip>

                  <Tooltip
                    label={
                      canCreateCategory
                        ? ""
                        : "Your package has expired, you cannot delete this category."
                    }
                    shouldWrapChildren
                  >
                    <Button
                      size="sm"
                      colorScheme="red"
                      isDisabled={!canCreateCategory}
                      onClick={() => handleDeleteCategory(category.categoryId)}
                    >
                      Delete
                    </Button>
                  </Tooltip>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedCategory ? "Edit Category" : "Create Category"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Custom Category Name</FormLabel>
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter a category name"
              />
            </FormControl>
            {!selectedCategory && (
              <FormControl>
                <FormLabel>Suggestions</FormLabel>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(2, 1fr)"
                  gap={2}
                >
                  {staticSuggestions.map((suggestion) => (
                    <Checkbox
                      key={suggestion}
                      isChecked={checkedSuggestions.includes(suggestion)}
                      onChange={() => handleCheckboxChange(suggestion)}
                    >
                      {suggestion}
                    </Checkbox>
                  ))}
                </Box>
              </FormControl>
            )}

            <FormControl mt={4}>
              <FormLabel>Status</FormLabel>
              <Select
                value={categoryStatus}
                onChange={(e) => setCategoryStatus(e.target.value === "true")}
              >
                <option value="true">ACTIVE</option>
                <option value="false">INACTIVE</option>
              </Select>
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
