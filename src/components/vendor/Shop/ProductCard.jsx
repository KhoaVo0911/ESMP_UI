import React, { useState, useEffect } from "react";
import { Box, Image, Text, IconButton, VStack, HStack } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { storage } from "./../../../shared/firebase/firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";

const ProductCard = ({ product, addToCart }) => {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selected, setSelected] = useState(false);
  const [imageUrl, setImageUrl] = useState(product.imageUrl || "https://via.placeholder.com/150");

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (!product.imageUrl && product.productItemId) {
        try {
          const imageRef = ref(storage, `${product.vendorId}/${product.productItemId}`);
          const url = await getDownloadURL(imageRef);
          setImageUrl(url);
        } catch (error) {
          console.error("Error fetching image URL:", error);
          setImageUrl("https://via.placeholder.com/150");
        }
      }
    };
    fetchImageUrl();
  }, [product.imageUrl, product.productItemId, product.vendorId]);

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
      boxShadow="md"
      transition="all 0.3s ease"
      onClick={toggleSelected}
      cursor="pointer"
      maxHeight="400px" // Đặt chiều cao tối đa cho các thẻ
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      position="relative"
    >
      <Image
        src={imageUrl}
        alt={product.name}
        boxSize="120px"
        borderRadius="full"
        mx="auto"
        my={2}
      />
      <Text fontWeight="bold" fontSize="xl" color={selected ? "white" : "black"} mt={3}>
        {product.name}
      </Text>
      <Text fontWeight="bold" fontSize="lg" color={selected ? "white" : "gray.600"}>
        {formatPrice(product.price)}
      </Text>

      {/* Phần chi tiết có overflowY để cuộn nếu quá dài */}
      <VStack align="start" spacing={1} mt={2} maxHeight="100px" overflowY="auto">
        <Text fontWeight="bold" color={selected ? "white" : "gray.700"}>Details:</Text>
        {product.details.map((detail, index) => (
          <Text key={index} fontSize="sm" color={selected ? "white" : "gray.600"}>
            - {detail.name} x {detail.quantity} {detail.unit}
          </Text>
        ))}
      </VStack>

      {selected ? (
        <HStack spacing={2} justifyContent="center" mt={4}>
          <IconButton
            icon={<MinusIcon boxSize={4} />}
            size="sm"
            onClick={handleRemove}
            aria-label="Decrease quantity"
            background="none"
            color="white"
            _hover={{ bg: "whiteAlpha.300" }}
          />
          <Text fontSize="lg" color="white">{selectedQuantity}</Text>
          <IconButton
            icon={<AddIcon boxSize={4} />}
            size="sm"
            onClick={handleAdd}
            aria-label="Increase quantity"
            background="none"
            color="white"
            _hover={{ bg: "whiteAlpha.300" }}
          />
          <IconButton
            icon={<ShoppingCartIcon style={{ fontSize: "20px" }} />}
            size="sm"
            onClick={handleAddToCart}
            aria-label="Add to Cart"
            background="none"
            color="white"
            _hover={{ bg: "whiteAlpha.300" }}
          />
        </HStack>
      ) : (
        <Box height="40px" />
      )}
    </Box>
  );
};

export default ProductCard;
