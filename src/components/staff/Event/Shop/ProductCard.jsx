import React, { useState, useEffect } from "react";
import { Box, Image, Text, IconButton, VStack, HStack, Input } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { storage } from "./../../../../shared/firebase/firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";

const ProductCard = ({ product, addToCart }) => {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
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
      maxW="250px"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p="4"
      textAlign="center"
      bg="white"
      boxShadow="lg"
      transition="transform 0.3s ease, box-shadow 0.3s ease"
    
      cursor="pointer"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
    >
      <Image
        src={imageUrl}
        alt={product.name}
        boxSize="150px"
        borderRadius="md"
        objectFit="cover"
        mb={4}
      />
      <VStack spacing={2} alignItems="center">
        <Text fontWeight="bold" fontSize="lg" color="gray.700">
          {product.name}
        </Text>
        <Text fontWeight="semibold" fontSize="md" color="gray.500">
          {formatPrice(product.price)}
        </Text>
      </VStack>

      <VStack align="start" spacing={1} mt={4} maxHeight="80px" overflowY="auto" width="100%">
        <Text fontWeight="bold" fontSize="sm" color="gray.600">
          Details:
        </Text>
        {product.details.map((detail, index) => (
          <Text key={index} fontSize="sm" color="gray.600">
            - {detail.name} x {detail.quantity} {detail.unit}
          </Text>
        ))}
      </VStack>

      <HStack spacing={2} justifyContent="center" mt={4} width="100%">
        <IconButton
          icon={<MinusIcon boxSize={4} />}
          size="sm"
          onClick={handleRemove}
          aria-label="Decrease quantity"
          background="gray.200"
        
        />
        <Input
          type="number"
          value={selectedQuantity}
          onChange={(e) => setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          width="60px"
          textAlign="center"
          borderColor="gray.300"
        />
        <IconButton
          icon={<AddIcon boxSize={4} />}
          size="sm"
          onClick={handleAdd}
          aria-label="Increase quantity"
     
        />
        <IconButton
          icon={<ShoppingCartIcon style={{ fontSize: "20px" }} />}
          size="sm"
          onClick={handleAddToCart}
          aria-label="Add to Cart"
          background="teal.500"
          color="white"
         
        />
      </HStack>
    </Box>
  );
};

export default ProductCard;
