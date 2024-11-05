import React, { useState } from "react";
import { Box, Image, Text, IconButton, VStack } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const ProductCard = ({ product, addToCart }) => {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selected, setSelected] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    setSelectedQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (selectedQuantity > 1) {
      setSelectedQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const toggleSelected = () => setSelected(!selected);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({ ...product, quantity: selectedQuantity });
  };

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
      background={selected ? "linear-gradient(135deg,#3B5284 1%, #5BA8A0 120%)" : "white"}
      onClick={toggleSelected}
      cursor="pointer"
      height="300px"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      overflowY="auto" 
      
    >
      <Image src={product.image} alt={product.name} boxSize="150px" mx="auto" />
      <Text fontWeight="bold" fontSize="xl" mt={2} color={selected ? "white" : "black"}>
        {product.name}
      </Text>
      <Text fontWeight="bold" fontSize="lg" color={selected ? "white" : "black"}>
        {formatPrice(product.price)}
      </Text>
      <VStack align="start" mt={2}>
        <Text fontWeight="bold" color={selected ? "white" : "black"}>Details:</Text>
        {product.details.map((detail, index) => (
          <Text key={index} fontSize="sm" color={selected ? "white" : "black"}>
            - {detail.name} x {detail.quantity} {detail.unit}
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
            background="none"
            color="white"
          />
          <Text mx={2} fontSize="lg" color="white">{selectedQuantity}</Text>
          <IconButton
            icon={<AddIcon boxSize={4} />}
            size="sm"
            onClick={handleAdd}
            aria-label="Increase quantity"
            background="none"
            color="white"
          />
          <IconButton
            icon={<ShoppingCartIcon style={{ fontSize: "20px" }} />}
            size="sm"
            onClick={handleAddToCart}
            ml={10}
            aria-label="Add to Cart"
            background="none"
            color="white"
          />
        </Box>
      ) : (
        <Box height="40px" />
      )}
    </Box>
  );
};

export default ProductCard;
