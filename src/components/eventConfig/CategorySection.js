// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Box,
//   Button,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Badge,
//   FormControl,
//   FormLabel,
//   Input,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   ModalCloseButton,
//   useDisclosure,
//   Flex,
//   Heading,
//   useToast,
// } from "@chakra-ui/react";
// import { AddIcon } from "@chakra-ui/icons";

// const CategorySection = () => {
//   const [categories, setCategories] = useState([]);
//   const [newCategory, setNewCategory] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const toast = useToast();

//   // Retrieve hostId and accessToken from session storage
//   const hostId = sessionStorage.getItem("hostId") || "";
//   const accessToken = sessionStorage.getItem("accessToken") || "";

//   // Fetch categories from API
//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get(
//         `https://esmpbe.id.vn/api/category/host/${hostId}`,
//         {
//           headers: {
//             Authorization: `${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setCategories(response.data);
//     } catch (error) {
//       toast({
//         title: "Error fetching categories",
//         description: "Could not load categories.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const handleOpenCreateCategory = () => {
//     setSelectedCategory(null);
//     setNewCategory("");
//     onOpen();
//   };

//   const handleOpenEditCategory = (category) => {
//     setSelectedCategory(category);
//     setNewCategory(category.categoryName);
//     onOpen();
//   };

//   const handleSaveCategory = async () => {
//     try {
//       if (selectedCategory) {
//         // Update existing category
//         console.log("Updating category with hostId:", hostId);
//         await axios.put(
//           `https://esmpbe.id.vn/api/category/${selectedCategory.categoryId}`,
//           { categoryName: newCategory, status: selectedCategory.status },
//           {
//             headers: {
//               Authorization: `${accessToken}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         toast({
//           title: "Category updated",
//           status: "success",
//           duration: 3000,
//           isClosable: true,
//         });
//       } else {
//         // Create new category
//         console.log("Creating category with hostId:", hostId);
//         await axios.post(
//           "https://esmpbe.id.vn/api/category",
//           { categoryName: newCategory, hostid: hostId, status: true }, // Ensure hostId is included here
//           {
//             headers: {
//               Authorization: `${accessToken}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         toast({
//           title: "New category created",
//           status: "success",
//           duration: 3000,
//           isClosable: true,
//         });
//       }

//       fetchCategories(); // Refresh categories list after creating/updating
//       onClose();
//     } catch (error) {
//       console.error("Error saving category:", error);
//       toast({
//         title: "Error saving category",
//         description: "Could not save the category.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   const handleDeleteCategory = async (categoryId) => {
//     try {
//       await axios.delete(`https://esmpbe.id.vn/api/category/${categoryId}`, {
//         headers: {
//           Authorization: `${accessToken}`,
//           "Content-Type": "application/json",
//         },
//       });
//       setCategories(categories.filter((cat) => cat.categoryId !== categoryId));
//       toast({
//         title: "Category deleted",
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });
//     } catch (error) {
//       console.error("Error deleting category:", error);
//       toast({
//         title: "Error deleting category",
//         description: "Could not delete the category.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   return (
//     <Box mb={10}>
//       <Flex justify="space-between" align="center" mb={6}>
//         <Heading size="lg" fontWeight="bold" color="blue.600">
//           Manage Categories
//         </Heading>
//         <Button
//           colorScheme="blue"
//           leftIcon={<AddIcon />}
//           onClick={handleOpenCreateCategory}
//         >
//           Create New Category
//         </Button>
//       </Flex>
//       <Table
//         variant="simple"
//         colorScheme="gray"
//         size="lg"
//         bg="white"
//         borderRadius="md"
//         shadow="md"
//       >
//         <Thead bg="gray.200">
//           <Tr>
//             <Th>No</Th>
//             <Th>Name</Th>
//             <Th>Status</Th>
//             <Th textAlign="center">Actions</Th>
//           </Tr>
//         </Thead>
//         <Tbody>
//           {categories.map((category, index) => (
//             <Tr key={category.categoryId}>
//               <Td>{index + 1}</Td>
//               <Td>{category.categoryName}</Td>
//               <Td>
//                 <Badge colorScheme={category.status ? "green" : "red"}>
//                   {category.status ? "ACTIVE" : "INACTIVE"}
//                 </Badge>
//               </Td>
//               <Td textAlign="center">
//                 <Button
//                   size="sm"
//                   colorScheme="blue"
//                   mr={2}
//                   onClick={() => handleOpenEditCategory(category)}
//                 >
//                   Edit
//                 </Button>
//                 <Button
//                   size="sm"
//                   colorScheme="red"
//                   onClick={() => handleDeleteCategory(category.categoryId)}
//                 >
//                   Delete
//                 </Button>
//               </Td>
//             </Tr>
//           ))}
//         </Tbody>
//       </Table>

//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>
//             {selectedCategory ? "Edit Category" : "Create Category"}
//           </ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             <FormControl>
//               <FormLabel>Category Name</FormLabel>
//               <Input
//                 value={newCategory}
//                 onChange={(e) => setNewCategory(e.target.value)}
//                 placeholder="Enter category name"
//               />
//             </FormControl>
//           </ModalBody>
//           <ModalFooter>
//             <Button colorScheme="blue" onClick={handleSaveCategory}>
//               {selectedCategory ? "Update" : "Create"}
//             </Button>
//             <Button onClick={onClose} ml={3}>
//               Cancel
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </Box>
//   );
// };

// export default CategorySection;

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
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryStatus, setCategoryStatus] = useState(true);
  const [canCreateCategory, setCanCreateCategory] = useState(false); // Check package status
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const hostId = sessionStorage.getItem("hostId") || "";
  const accessToken = sessionStorage.getItem("accessToken") || "";

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
      toast({
        title: "Error fetching categories",
        description: "Could not load categories.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
    setCategoryStatus(true);
    onOpen();
  };

  const handleOpenEditCategory = (category) => {
    setSelectedCategory(category);
    setNewCategory(category.categoryName);
    setCategoryStatus(category.status);
    onOpen();
  };

  // const handleSaveCategory = async () => {
  //   try {
  //     if (selectedCategory) {
  //       await axios.put(
  //         `https://esmpbe.id.vn/api/category/${selectedCategory.categoryId}`,
  //         { categoryName: newCategory, status: categoryStatus },
  //         {
  //           headers: {
  //             Authorization: `${accessToken}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       toast({
  //         title: "Category updated",
  //         status: "success",
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //     } else {
  //       await axios.post(
  //         "https://esmpbe.id.vn/api/category",
  //         { categoryName: newCategory, hostid: hostId, status: categoryStatus },
  //         {
  //           headers: {
  //             Authorization: `${accessToken}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       toast({
  //         title: "New category created",
  //         status: "success",
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //     }

  //     fetchCategories();
  //     onClose();
  //   } catch (error) {
  //     console.error("Error saving category:", error);
  //     toast({
  //       title: "Error saving category",
  //       description: "Could not save the category.",
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   }
  // };

  const handleSaveCategory = async () => {
    try {
      if (selectedCategory) {
        // Cập nhật category nếu đang sửa
        await axios.put(
          `https://esmpbe.id.vn/api/category/${selectedCategory.categoryId}`,
          { categoryName: newCategory, status: categoryStatus },
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast({
          title: "Category updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Tạo mới category nếu không có category đang chọn
        await axios.post(
          "https://esmpbe.id.vn/api/category",
          { categoryName: newCategory, hostid: hostId, status: categoryStatus }, // Đảm bảo truyền đúng categoryStatus
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast({
          title: "New category created",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      // Cập nhật lại danh sách categories
      fetchCategories();
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Error saving category",
        description: "Could not save the category.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(`https://esmpbe.id.vn/api/category/${categoryId}`, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      setCategories(categories.filter((cat) => cat.categoryId !== categoryId));
      toast({
        title: "Category deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast({
          title: "Error deleting category",
          description: "Could not delete the category.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Cannot delete category",
          description: "This category has been used and cannot be deleted.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
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
            <Tr key={category.categoryId}>
              <Td>{index + 1}</Td>
              <Td>{category.categoryName}</Td>
              <Td>
                <Badge colorScheme={category.status ? "green" : "red"}>
                  {category.status ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </Td>
              <Td textAlign="center">
                <Tooltip
                  label={
                    canCreateCategory
                      ? ""
                      : "Your package has expired, you cannot edit this category."
                  }
                >
                  <Button
                    size="sm"
                    colorScheme="blue"
                    mr={2}
                    onClick={() => handleOpenEditCategory(category)}
                    isDisabled={!canCreateCategory}
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
                >
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDeleteCategory(category.categoryId)}
                    isDisabled={!canCreateCategory}
                  >
                    Delete
                  </Button>
                </Tooltip>
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
            <FormControl mb={4}>
              <FormLabel>Category Name</FormLabel>
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
              />
            </FormControl>
            <FormControl>
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
