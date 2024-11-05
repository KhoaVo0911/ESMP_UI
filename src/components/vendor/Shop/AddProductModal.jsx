import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  SimpleGrid,
  Button,
  Box,
  Image,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const AddProductModal = ({ isOpen, onClose, vendorId, eventId, accessToken, onAdd }) => {
  const [products, setProducts] = useState([]);
  const [productNames, setProductNames] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Fetch product items
      axios
        .get(`http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/productitem/${vendorId}`, {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setProducts(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching product items:", error);
          setLoading(false);
        });

      // Fetch product data to get product names
      axios
        .get(`http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/product/${vendorId}`, {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const productNameMap = {};
          response.data.forEach((product) => {
            productNameMap[product.productId] = product.productName;
          });
          setProductNames(productNameMap);
        })
        .catch((error) => {
          console.error("Error fetching product data:", error);
        });
    }
  }, [isOpen, vendorId, accessToken]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleAddProductToMenu = () => {
    if (selectedProduct) {
      const payload = {
        productItem: [
          {
            id: selectedProduct.productItemId,
          },
        ],
      };

      axios
        .post(
          `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/menu/${vendorId}/${eventId}`,
          payload,
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          toast({
            title: "Product added successfully",
            description: `Product ${selectedProduct.name} has been added to the menu.`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          onAdd(selectedProduct);
          onClose();
        })
        .catch((error) => {
          console.error("Error adding product to menu:", error);
          toast({
            title: "Error",
            description: "Failed to add product to the menu.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Product</ModalHeader>
          <ModalBody>
            <Text>Loading products...</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Product</ModalHeader>
        <ModalBody>
  <Box maxHeight="500px" overflowY="auto">
    <SimpleGrid columns={4} spacing={5}>
      {products.map((product) => (
        <Box
          key={product.productItemId}
          maxW="sm"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p="4"
          textAlign="left"
          background={
            selectedProduct && selectedProduct.productItemId === product.productItemId
              ? "linear-gradient(135deg,#3B5284 1%, #5BA8A0 120%)"
              : "white"
          }
          onClick={() => handleSelectProduct(product)}
          cursor="pointer"
          height="350px"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Image
            src={product.image || "https://via.placeholder.com/150"}
            alt={product.name}
            boxSize="100px"
            mx="auto"
          />
          <Text
            fontWeight="bold"
            fontSize="xl"
            mt={2}
            color={
              selectedProduct && selectedProduct.productItemId === product.productItemId
                ? "white"
                : "black"
            }
          >
            {productNames[product.productId] || product.name}
          </Text>
          <Text
            fontWeight="bold"
            fontSize="lg"
            color={
              selectedProduct && selectedProduct.productItemId === product.productItemId
                ? "white"
                : "black"
            }
          >
            {parseInt(product.price).toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
          <VStack align="start" spacing={1} mt={2}>
            {product.details.map((detail, index) => (
              <Text
                key={index}
                fontSize="sm"
                color={
                  selectedProduct && selectedProduct.productItemId === product.productItemId
                    ? "white"
                    : "gray.800"
                }
              >
                - {productNames[detail.productId] || detail.productId} x {detail.quantity} {detail.unit}
              </Text>
            ))}
          </VStack>
        </Box>
      ))}
    </SimpleGrid>
  </Box>
</ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleAddProductToMenu}
            isDisabled={!selectedProduct}
          >
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddProductModal;
