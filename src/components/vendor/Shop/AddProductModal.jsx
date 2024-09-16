import React from "react";
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
} from "@chakra-ui/react";

const AddProductModal = ({ isOpen, onClose, products, onAdd }) => {
  const [selectedProduct, setSelectedProduct] = React.useState(null);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      {" "}
      {/* Changed size to '5xl' for larger modal */}
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Product</ModalHeader>
        <ModalBody>
          <SimpleGrid columns={5} spacing={5}>
            {" "}
            {/* 5 products per row */}
            {products.map((product) => (
              <Box
                key={product.id}
                maxW="sm"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                p="4"
                textAlign="center"
                background={
                  selectedProduct && selectedProduct.id === product.id
                    ? "linear-gradient(135deg,#3B5284 1%, #5BA8A0 120%)"
                    : "white"
                }
                onClick={() => handleSelectProduct(product)}
                cursor="pointer"
                height="300px" // Increased height for the quantity display
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  boxSize="100px"
                  mx="auto"
                />
                <Text
                  fontWeight="bold"
                  fontSize="xl"
                  mt={2}
                  color={
                    selectedProduct && selectedProduct.id === product.id
                      ? "white"
                      : "black"
                  }
                >
                  {product.name}
                </Text>
                {/* Display quantity */}
                <Text
                  color={
                    selectedProduct && selectedProduct.id === product.id
                      ? "white"
                      : "black"
                  }
                >
                  Available: {product.quantity} units
                </Text>
                <Text
                  fontWeight="bold"
                  fontSize="lg"
                  color={
                    selectedProduct && selectedProduct.id === product.id
                      ? "white"
                      : "black"
                  }
                >
                  {product.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => {
              if (selectedProduct) {
                onAdd(selectedProduct);
              }
              onClose();
            }}
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
