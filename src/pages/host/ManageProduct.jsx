import React, { useState } from "react";
import {
  Box,
  Grid,
  Text,
  Image,
  Button,
  VStack,
  Badge,
  HStack,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { EditIcon, AddIcon } from "@chakra-ui/icons";

import Pizza from "../../assets/images/Pizza.png";

const ManageProduct = () => {
  // Sample product data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Sushi",
      price: "40.000 VND",
      quantity: 15,
      event: "Mid Autumn Event",
      shop: "Sushi Bar",
    },
    {
      id: 2,
      name: "Ramen",
      price: "50.000 VND",
      quantity: 8,
      event: "New Year Festival",
      shop: "Ramen House",
    },
    {
      id: 3,
      name: "Sushi",
      price: "40.000 VND",
      quantity: 15,
      event: "Mid Autumn Event",
      shop: "Sushi Bar",
    },
    {
      id: 4,
      name: "Ramen",
      price: "50.000 VND",
      quantity: 8,
      event: "New Year Festival",
      shop: "Ramen House",
    },
    {
      id: 5,
      name: "Sushi",
      price: "40.000 VND",
      quantity: 15,
      event: "Mid Autumn Event",
      shop: "Sushi Bar",
    },
    {
      id: 6,
      name: "Ramen",
      price: "50.000 VND",
      quantity: 8,
      event: "New Year Festival",
      shop: "Ramen House",
    },
    {
      id: 7,
      name: "Sushi",
      price: "40.000 VND",
      quantity: 15,
      event: "Mid Autumn Event",
      shop: "Sushi Bar",
    },
    {
      id: 8,
      name: "Ramen",
      price: "50.000 VND",
      quantity: 8,
      event: "New Year Festival",
      shop: "Ramen House",
    },
  ]);

  const { isOpen, onOpen, onClose } = useDisclosure(); // Controls modal for both Create/Edit
  const [isEditMode, setIsEditMode] = useState(false); // To toggle between create/edit
  const [selectedProduct, setSelectedProduct] = useState(null); // Product to edit
  const [formState, setFormState] = useState({
    name: "",
    price: "",
    quantity: "",
    event: "",
    shop: "",
  });

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
      quantity: "",
      event: "",
      shop: "",
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
      // Edit existing product
      const updatedProducts = products.map((p) =>
        p.id === selectedProduct.id ? { ...formState } : p
      );
      setProducts(updatedProducts);
    } else {
      // Create new product
      const newProduct = { ...formState, id: products.length + 1 };
      setProducts([...products, newProduct]);
    }
    onClose();
  };

  return (
    <Box padding="20px" minH="100vh" bg="gray.50">
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="2xl" fontWeight="bold">
          Manage Products
        </Text>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="teal"
          size="md"
          onClick={openCreateModal}
          bg="#4096ff"
        >
          Create Product
        </Button>
      </Flex>

      <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={9}>
        {products.map((product) => (
          <Box
            key={product.id}
            bg="white"
            borderRadius="lg"
            boxShadow="lg"
            overflow="hidden"
            transition="all 0.2s"
            _hover={{ transform: "scale(1.03)", boxShadow: "xl" }}
          >
            <Image src={Pizza} alt={product.name} />

            <VStack align="start" p={4}>
              <Text fontWeight="bold" fontSize="xl">
                {product.name}
              </Text>
              <Text fontSize="lg" color="gray.600">
                {product.price}
              </Text>

              <HStack spacing={2}>
                <Badge colorScheme="blue">Event: {product.event}</Badge>
                <Badge colorScheme="purple">Shop: {product.shop}</Badge>
              </HStack>

              <Text fontSize="md" color="gray.500">
                Quantity: {product.quantity}
              </Text>

              <Button
                leftIcon={<EditIcon />}
                colorScheme="teal"
                variant="outline"
                size="sm"
                onClick={() => openEditModal(product)}
              >
                Edit
              </Button>
            </VStack>
          </Box>
        ))}
      </Grid>

      {/* Modal for Create/Edit */}
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
              <FormLabel>Quantity</FormLabel>
              <Input
                name="quantity"
                value={formState.quantity}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Event</FormLabel>
              <Input
                name="event"
                value={formState.event}
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
