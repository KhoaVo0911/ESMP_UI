import React, { useState } from "react";
import { Box, Image, Text, IconButton } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const ProductCard = ({ product, addToCart }) => {
  const [selectedQuantity, setSelectedQuantity] = useState(1); // Quantity for the cart
  const [selected, setSelected] = useState(false);

  const handleAdd = () => setSelectedQuantity(selectedQuantity + 1);
  const handleRemove = () =>
    setSelectedQuantity(selectedQuantity > 1 ? selectedQuantity - 1 : 1);
  const toggleSelected = () => setSelected(!selected);

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
      } // Radiant effect when selected
      onClick={toggleSelected}
      cursor="pointer"
      height="350px" // Set a fixed height for all cards
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Image src={product.image} alt={product.name} boxSize="100px" mx="auto" />

      {/* Increased font size and white color when selected */}
      <Text
        fontWeight="bold"
        fontSize="xl"
        mt={2}
        color={selected ? "white" : "black"}
      >
        {product.name}
      </Text>
      {/* Show available quantity */}
      <Text color={selected ? "white" : "black"}>
        Available: {product.quantity} units
      </Text>
      <Text
        fontWeight="bold"
        fontSize="lg"
        color={selected ? "white" : "black"}
      >
        {/* Format price in VND */}
        {product.price.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}
      </Text>

      {selected ? (
        <Box mt={3} display="flex" justifyContent="center" alignItems="center">
          {/* Smaller icons and no background */}
          <IconButton
            icon={<MinusIcon boxSize={4} />}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
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
            onClick={(e) => {
              e.stopPropagation();
              handleAdd();
            }}
            aria-label="Increase quantity"
            background="none" // Remove background
            color="white" // White color when selected
          />
          <IconButton
            icon={<ShoppingCartIcon style={{ fontSize: "20px" }} />}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              addToCart({ ...product, selectedQuantity }); // Add product to cart with selected quantity
            }}
            ml={10}
            aria-label="Add to Cart"
            background="none" // Remove background
            color="white" // White color when selected
          />
        </Box>
      ) : (
        <Box height="40px" /> // Space placeholder when not selected
      )}
    </Box>
  );
};

export default ProductCard;
