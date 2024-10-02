import React, { useState } from "react";
import { Box, Image, Text, IconButton } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const ProductCard = ({ product, addToCart }) => {
  const [selectedQuantity, setSelectedQuantity] = useState(1); // Số lượng đã chọn cho giỏ hàng
  const [selected, setSelected] = useState(false); // Trạng thái chọn

  const handleAdd = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan ra toàn bộ thẻ
    setSelectedQuantity((prevQuantity) => prevQuantity + 1); // Tăng số lượng
  };

  const handleRemove = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan ra toàn bộ thẻ
    if (selectedQuantity > 1) {
      setSelectedQuantity((prevQuantity) => prevQuantity - 1); // Giảm số lượng
    }
  };

  const toggleSelected = () => setSelected(!selected); // Đổi trạng thái chọn

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan ra toàn bộ thẻ
    addToCart({ ...product, quantity: selectedQuantity }); // Thêm vào giỏ hàng với số lượng đã chọn
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
      } // Hiệu ứng gradient khi được chọn
      onClick={toggleSelected} // Bật/tắt trạng thái chọn khi nhấp
      cursor="pointer"
      height="350px" // Chiều cao cố định cho tất cả các thẻ
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

      <Text color={selected ? "white" : "black"}>
        Available: {product.availableQuantity} units
      </Text>

      <Text
        fontWeight="bold"
        fontSize="lg"
        color={selected ? "white" : "black"}
      >
        {formatPrice(product.price)}
      </Text>

      {selected ? (
        <Box mt={3} display="flex" justifyContent="center" alignItems="center">
          <IconButton
            icon={<MinusIcon boxSize={4} />}
            size="sm"
            onClick={handleRemove}
            aria-label="Decrease quantity"
            background="none" // Loại bỏ background
            color="white" // Màu trắng khi được chọn
          />
          <Text mx={2} fontSize="lg" color="white">
            {selectedQuantity}
          </Text>
          <IconButton
            icon={<AddIcon boxSize={4} />}
            size="sm"
            onClick={handleAdd}
            aria-label="Increase quantity"
            background="none" // Loại bỏ background
            color="white" // Màu trắng khi được chọn
          />
          <IconButton
            icon={<ShoppingCartIcon style={{ fontSize: "20px" }} />}
            size="sm"
            onClick={handleAddToCart}
            ml={10}
            aria-label="Add to Cart"
            background="none" // Loại bỏ background
            color="white" // Màu trắng khi được chọn
          />
        </Box>
      ) : (
        <Box height="40px" /> // Placeholder để giữ layout đồng nhất
      )}
    </Box>
  );
};

export default ProductCard;
