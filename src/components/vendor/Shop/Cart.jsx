import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Image,
  Button,
  IconButton,
  HStack,
  VStack,
  Input,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "./../../../shared/firebase/firebaseConfig";

const Cart = ({ cartItems, updateQuantity, removeItem }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const accessToken = location.state?.accessToken || sessionStorage.getItem("accessToken") || "";
  const vendorId = location.state?.vendorId || sessionStorage.getItem("vendorId") || "";
  const eventId = location.state?.eventId || sessionStorage.getItem("eventId") || "";

  const [itemsWithImages, setItemsWithImages] = useState([]);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const fetchImageUrls = async () => {
    const updatedCartItems = await Promise.all(
      cartItems.map(async (item) => {
        const imageRef = ref(storage, `${vendorId}/${item.productItemId}`);
        try {
          const imageUrl = await getDownloadURL(imageRef);
          return { ...item, image: imageUrl };
        } catch (error) {
          console.error("Error fetching image URL:", error);
          return { ...item, image: "https://via.placeholder.com/150" }; // Placeholder image
        }
      })
    );
    setItemsWithImages(updatedCartItems);
  };

  useEffect(() => {
    fetchImageUrls();
  }, [cartItems]);

  const handleConfirm = () => {
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
    sessionStorage.setItem("totalPrice", totalPrice);

    navigate("/payment", {
      state: { accessToken, vendorId, eventId },
    });
  };

  return (
    <Box p={5} borderRadius="md" boxShadow="lg" bg="white" width="100%">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Giỏ Hàng
      </Text>

      <VStack spacing={4} align="stretch">
        {itemsWithImages.length === 0 ? (
          <Text>Không có sản phẩm nào trong giỏ hàng</Text>
        ) : (
          itemsWithImages.map((item, index) => (
            <HStack
              key={index}
              justify="space-between"
              p={4}
              borderWidth="1px"
              borderRadius="md"
              boxShadow="sm"
              bg="white"
              width="100%"
            >
              <HStack spacing={3} alignItems="center" width="70%">
                <Image src={item.image} alt={item.name} boxSize="50px" />
                <Box maxWidth="200px" isTruncated>
                  <Text fontWeight="bold">{item.name}</Text>
                </Box>
              </HStack>

              <HStack>
                <Button
                  onClick={() => updateQuantity(index, item.quantity - 1)}
                  isDisabled={item.quantity <= 1}
                >
                  -
                </Button>
                <Input
                  width="50px"
                  textAlign="center"
                  value={item.quantity}
                  readOnly
                />
                <Button onClick={() => updateQuantity(index, item.quantity + 1)}>
                  +
                </Button>
              </HStack>

              <Text width="100px" textAlign="right">
                {item.price.toLocaleString()} VND
              </Text>
              <IconButton
                icon={<DeleteIcon />}
                colorScheme="red"
                onClick={() => removeItem(index)}
                aria-label="Xóa sản phẩm"
              />
            </HStack>
          ))
        )}
      </VStack>

      <Box mt={8} textAlign="right" fontWeight="bold" fontSize="lg">
        Tổng: {totalPrice.toLocaleString()} VND
      </Box>

      <HStack justify="center" mt={8}>
        <Button colorScheme="blue" onClick={handleConfirm}>
          Xác nhận
        </Button>
        <Button colorScheme="red" onClick={() => removeItem()}>
          Xóa tất cả
        </Button>
      </HStack>
    </Box>
  );
};

export default Cart;
