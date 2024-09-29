import React, { useState } from "react";
import {
  Box,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormControl,
  FormLabel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Select,
  Flex,
  Image,
} from "@chakra-ui/react";
import { EditIcon, AddIcon, DeleteIcon } from "@chakra-ui/icons";
import Pizza from "../../assets/images/Pizza.png";

const ManageProduct = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Sushi",
      price: "40.000",
      shop: "Sushi Bar",
      image: Pizza,
    },
    {
      id: 2,
      name: "Ramen",
      price: "50.000",
      shop: "Ramen House",
      image: Pizza,
    },
    {
      id: 3,
      name: "Kimbap",
      price: "40.000",
      shop: "Korean Food",
      image: Pizza,
    },
    {
      id: 4,
      name: "Tobokki",
      price: "50.000",
      shop: "Korean Food",
      image: Pizza,
    },
    {
      id: 5,
      name: "Sushi",
      price: "40.000",
      shop: "Sushi Bar",
      image: Pizza,
    },
    {
      id: 6,
      name: "Chicken Nuggest",
      price: "60.000",
      shop: "Korean Food",
      image: Pizza,
    },
    {
      id: 7,
      name: "Coca",
      price: "15.000",
      shop: "Ramen House",
      image: Pizza,
    },
    {
      id: 8,
      name: "Cheese",
      price: "20.000",
      shop: "Korean Food",
      image: Pizza,
    },
  ]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formState, setFormState] = useState({
    name: "",
    price: "",
    shop: "",
    image: "",
  });

  const [selectedShop, setSelectedShop] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const openEditModal = (product) => {
    setIsEditMode(true);
    setSelectedProduct(product);
    setFormState(product);
    onOpen();
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setFormState({
      name: "",
      price: "",
      shop: "",
      image: "",
    });
    onOpen();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (isEditMode) {
      const updatedProducts = products.map((p) =>
        p.id === selectedProduct.id ? { ...formState } : p
      );
      setProducts(updatedProducts);
    } else {
      const newProduct = { ...formState, id: products.length + 1 };
      setProducts([...products, newProduct]);
    }
    onClose();
  };

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  // Lọc sản phẩm theo shop, tìm kiếm theo tên và sắp xếp theo giá
  const filteredProducts = products
    .filter((product) => {
      const matchesShop = selectedShop ? product.shop === selectedShop : true;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesShop && matchesSearch;
    })
    .sort((a, b) => {
      const priceA = parseInt(a.price.replace(".", ""));
      const priceB = parseInt(b.price.replace(".", ""));
      if (sortOrder === "asc") {
        return priceA - priceB;
      } else {
        return priceB - priceA;
      }
    });

  return (
    <Box padding="20px" minH="100vh" bg="gray.50">
      <Box
        mb={6}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize="2xl" fontWeight="bold">
          Manage Products
        </Text>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="teal"
          onClick={openCreateModal}
          bg="#4096ff"
        >
          Create Product
        </Button>
      </Box>

      {/* Flex để sắp xếp Search và Filter theo hàng ngang */}
      <Flex mb={4} gap={4}>
        {/* Tìm kiếm theo tên sản phẩm */}
        <FormControl maxWidth="300px">
          <FormLabel>Search by Name</FormLabel>
          <Input
            placeholder="Enter product name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FormControl>

        {/* Lọc theo shop */}
        <FormControl maxWidth="300px">
          <FormLabel>Filter by Shop</FormLabel>
          <Select
            placeholder="Select shop"
            value={selectedShop}
            onChange={(e) => setSelectedShop(e.target.value)}
          >
            <option value="Sushi Bar">Sushi Bar</option>
            <option value="Ramen House">Ramen House</option>
            <option value="Korean Food">Korean Food</option>
          </Select>
        </FormControl>
      </Flex>

      {/* Bảng sản phẩm */}
      <Table variant="simple" bg="white" borderRadius="lg" boxShadow="md">
        <Thead bg="gray.200">
          <Tr>
            <Th>Name</Th>
            <Th>Image</Th>
            <Th>
              Price{" "}
              <Button size="xs" onClick={handleSort}>
                {sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </Th>
            <Th>Shop</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredProducts.map((product) => (
            <Tr key={product.id}>
              <Td>{product.name}</Td>
              <Td>
                <Image src={product.image} alt={product.name} boxSize="50px" />
              </Td>
              <Td>{product.price} VND</Td>
              <Td>{product.shop}</Td>
              <Td>
                <Flex gap={2}>
                  <IconButton
                    aria-label="Edit"
                    icon={<EditIcon />}
                    size="sm"
                    onClick={() => openEditModal(product)}
                  />
                  <IconButton
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  />
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditMode ? "Edit Product" : "Create Product"}
          </ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Product Name</FormLabel>
              <Input
                name="name"
                value={formState.name}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Price</FormLabel>
              <Input
                name="price"
                value={formState.price}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Shop</FormLabel>
              <Input
                name="shop"
                value={formState.shop}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Image URL</FormLabel>
              <Input
                name="image"
                value={formState.image}
                onChange={handleInputChange}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" onClick={handleSave} bg="#4096ff">
              {isEditMode ? "Save Changes" : "Create Product"}
            </Button>
            <Button variant="ghost" ml={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ManageProduct;
