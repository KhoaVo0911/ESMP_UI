import React, { useState } from "react";
import { Box, Image, Text, IconButton, VStack } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const ProductCard = ({ product, addToCart }) => {
  const [selectedQuantity, setSelectedQuantity] = useState(1); // Selected quantity for the cart
  const [selected, setSelected] = useState(false); // Selection state

  const handleAdd = (e) => {
    e.stopPropagation(); // Prevent event propagation
    setSelectedQuantity((prevQuantity) => prevQuantity + 1); // Increase quantity
  };

  const handleRemove = (e) => {
    e.stopPropagation(); // Prevent event propagation
    if (selectedQuantity > 1) {
      setSelectedQuantity((prevQuantity) => prevQuantity - 1); // Decrease quantity
    }
  };

  const toggleSelected = () => setSelected(!selected); // Toggle selection state

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent event propagation
    addToCart({ ...product, quantity: selectedQuantity }); // Add to cart with the selected quantity
  };

  // Function to format price to VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p="4"
      textAlign="center"
      background={
        selected ? "linear-gradient(135deg,#3B5284 1%, #5BA8A0 120%)" : "white"
      } // Gradient effect when selected
      onClick={toggleSelected} // Toggle selection on click
      cursor="pointer"
      height="400px" // Adjust height as needed
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Image src={product.image} alt={product.name} boxSize="150px" mx="auto" />

      <Text
        fontWeight="bold"
        fontSize="xl"
        mt={2}
        color={selected ? "white" : "black"}
      >
        {product.name}
      </Text>

      <Text
        fontWeight="bold"
        fontSize="lg"
        color={selected ? "white" : "black"}
      >
        {formatPrice(product.price)}
      </Text>

      <VStack align="start" mt={2}>
        <Text fontWeight="bold" color={selected ? "white" : "black"}>
          Details:
        </Text>
        {product.details.map((detail, index) => (
          <Text
            key={index}
            fontSize="sm"
            color={selected ? "white" : "black"}
          >
            - {detail.productId} x {detail.quantity} {detail.unit}
          </Text>
        ))}
      </VStack>

      {selected ? (
        <Box mt={3} display="flex" justifyContent="center" alignItems="center">
          <IconButton
            icon={<MinusIcon boxSize={4} />}
            size="sm"
            onClick={handleRemove}
            aria-label="Decrease quantity"
            background="none" // Remove background
            color="white" // White color when selected
          />
          <Text mx={2} fontSize="lg" color="white">
            {selectedQuantity}
          </Text>
          <IconButton
            icon={<AddIcon boxSize={4} />}
            size="sm"
            onClick={handleAdd}
            aria-label="Increase quantity"
            background="none" // Remove background
            color="white" // White color when selected
          />
          <IconButton
            icon={<ShoppingCartIcon style={{ fontSize: "20px" }} />}
            size="sm"
            onClick={handleAddToCart}
            ml={10}
            aria-label="Add to Cart"
            background="none" // Remove background
            color="white" // White color when selected
          />
        </Box>
      ) : (
        <Box height="40px" /> // Placeholder to maintain layout consistency
      )}
    </Box>
  );
};

export default ProductCard;
