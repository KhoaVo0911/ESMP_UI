import React from "react";
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
import { Link } from "react-router-dom";

const Cart = ({ cartItems, updateQuantity, removeItem }) => {
  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Save cart data to sessionStorage when confirming
  const handleConfirm = () => {
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
    sessionStorage.setItem("totalPrice", totalPrice);
  };

  return (
    <Box p={5} borderRadius="md" boxShadow="lg" bg="white" width="100%">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Cart
      </Text>

      <VStack spacing={4} align="stretch">
        {cartItems.length === 0 ? (
          <Text>No items in the cart</Text>
        ) : (
          cartItems.map((item, index) => (
            <HStack
              key={index}
              justify="space-between"
              p={4}
              borderWidth="1px"
              borderRadius="md"
              boxShadow="sm"
              bg="white"
              width="100%" // Ensure full width for items
            >
              <HStack>
                <Image src={item.image} alt={item.name} boxSize="50px" />
                <Text>{item.name}</Text>
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
                <Button
                  onClick={() => updateQuantity(index, item.quantity + 1)}
                >
                  +
                </Button>
              </HStack>

              <Text>{item.price.toLocaleString()} VND</Text>
              <HStack>
                <IconButton
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  onClick={() => removeItem(index)}
                  aria-label="Remove Item"
                />
              </HStack>
            </HStack>
          ))
        )}
      </VStack>

      {/* Total Price */}
      <Box mt={8} textAlign="right" fontWeight="bold" fontSize="lg">
        Total: {totalPrice.toLocaleString()} VND
      </Box>

      {/* Confirm Button */}
      <HStack justify="center" mt={8}>
        <Link to="/payment">
          <Button colorScheme="blue" onClick={handleConfirm}>
            Confirm
          </Button>
        </Link>
        <Button colorScheme="red" onClick={() => removeItem()}>
          Delete
        </Button>
      </HStack>
    </Box>
  );
};

export default Cart;
