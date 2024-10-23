import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Image,
  Text,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  List,
  ListItem,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useForm } from "react-hook-form";

const ManageProducts = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [comboProducts, setComboProducts] = useState([]); // For storing selected products in a combo
  const { register, handleSubmit, reset, setValue } = useForm();
  const toast = useToast();

  // Fetch Products from the MockAPI
  useEffect(() => {
    axios.get("https://668e540abf9912d4c92dcd67.mockapi.io/products").then((res) => setProducts(res.data));
    axios.get("https://668e540abf9912d4c92dcd67.mockapi.io/combo").then((res) => setCombos(res.data));
  }, []);

  // Add product to comboProducts list with selected quantity
  const addProductToCombo = (selectedProductId, selectedQuantity) => {
    const quantity = Math.max(1, selectedQuantity); // Ensure quantity is at least 1
    const selectedProduct = products.find((p) => p.id === selectedProductId);
    if (selectedProduct && !comboProducts.find((p) => p.id === selectedProduct.id)) {
      setComboProducts([...comboProducts, { ...selectedProduct, quantity }]);
    }
  };

  // Remove a product from the comboProducts list
  const removeProductFromCombo = (productId) => {
    setComboProducts(comboProducts.filter((p) => p.id !== productId));
  };

  // Handle form submit for adding products or combos
  const onSubmit = (data) => {
    if (comboProducts.length === 0) {
      toast({
        title: "Error",
        description: "You must add at least one product.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (comboProducts.length > 1 && (!data.comboName || !data.comboPrice)) {
      toast({
        title: "Error",
        description: "You must provide a name and price for the combo.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    let name = data.comboName;
    let price = data.comboPrice;

    if (comboProducts.length === 1) {
      // If only one product is added, automatically use its name and price
      name = comboProducts[0].name;
      price = comboProducts[0].price;
    }

    const comboData = {
      name,
      price,
      image: comboProducts[0]?.image || "https://via.placeholder.com/150", // Default image
      products: comboProducts.map((p) => ({ name: p.name, quantity: p.quantity })),
    };

    axios.post("https://668e540abf9912d4c92dcd67.mockapi.io/combo", comboData).then(() => {
      setCombos([...combos, comboData]);
      alert(comboProducts.length === 1 ? "Single product created!" : "Combo created!");
      setComboProducts([]); // Reset combo products after saving
      reset();
      onClose();
    });
  };

  return (
    <Box p={5}>
      {/* Button to trigger adding products */}
      <Button colorScheme="blue" onClick={onOpen}>
        Add Products
      </Button>

      {/* Product/Combo Display Section */}
      <Grid templateColumns="repeat(4, 1fr)" gap={6} mt={10}>
        {combos.map((combo) => (
          <GridItem
            key={combo.id}
            border="1px solid #e0e0e0"
            borderRadius="md"
            overflow="hidden"
            boxShadow="md"
            _hover={{ boxShadow: "lg" }}
          >
            <Image
              src={combo.image}
              alt={combo.name}
              objectFit="cover"
              width="100%"
              height="150px"
            />
            <Box p={4}>
              <Text fontWeight="bold" fontSize="lg">
                {combo.name}
              </Text>
              <Text>{combo.price} VND</Text>
              <Text fontSize="sm" mt={2} color="gray.500">
                Includes:
              </Text>
              <Flex direction="column">
                {combo.products.map((product, index) => (
                  <Text key={index} fontSize="sm">
                    - {product.name} x {product.quantity}
                  </Text>
                ))}
              </Flex>
            </Box>
            <Flex justifyContent="flex-end" p={4}>
              <Button
                leftIcon={<FaEdit />}
                size="sm"
                colorScheme="teal"
                variant="outline"
              >
                Edit
              </Button>
            </Flex>
          </GridItem>
        ))}
      </Grid>

      {/* Modal for Adding Product/Combo */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              {comboProducts.length > 1 ? (
                <>
                  {/* Name and Price fields required for combo */}
                  <FormControl mt={4} isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      {...register("comboName")}
                      placeholder="Enter name"
                    />
                  </FormControl>
                  <FormControl mt={4} isRequired>
                    <FormLabel>Price</FormLabel>
                    <Input
                      {...register("comboPrice")}
                      placeholder="Enter price"
                    />
                  </FormControl>
                </>
              ) : null}

              <FormControl mt={4}>
                <FormLabel>Select Product and Quantity</FormLabel>
                <Select
                  placeholder="Select a product"
                  {...register("comboProductId")}
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </Select>
                <FormControl mt={2}>
                  <FormLabel>Quantity</FormLabel>
                  <Input
                    type="number"
                    defaultValue={1}
                    min={1}
                    {...register("comboProductQuantity")}
                    placeholder="Enter quantity"
                  />
                </FormControl>
                <Button
                  mt={2}
                  colorScheme="teal"
                  onClick={() =>
                    addProductToCombo(
                      document.querySelector("select[name=comboProductId]").value,
                      document.querySelector("input[name=comboProductQuantity]").value
                    )
                  }
                >
                  Add Product
                </Button>
              </FormControl>

              {/* Display selected products */}
              {comboProducts.length > 0 && (
                <Box mt={4}>
                  <Text>Selected Products:</Text>
                  <List>
                    {comboProducts.map((product) => (
                      <ListItem key={product.id}>
                        <Flex justifyContent="space-between" alignItems="center">
                          <Text>
                            {product.name} x {product.quantity}
                          </Text>
                          <IconButton
                            icon={<FaTrash />}
                            size="sm"
                            colorScheme="red"
                            onClick={() => removeProductFromCombo(product.id)}
                          />
                        </Flex>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              <ModalFooter>
                <Button colorScheme="blue" mr={3} type="submit">
                  Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ManageProducts;
