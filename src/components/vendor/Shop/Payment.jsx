import React from "react";
import {
  Box,
  Text,
  HStack,
  VStack,
  Input,
  Button,
  Image,
  IconButton,
} from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowBackIcon, DeleteIcon } from "@chakra-ui/icons";

const Payment = ({ updateQuantity, removeItem }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve cart data from location state or session storage
  const cartItems =
    location.state?.cartItems ||
    JSON.parse(sessionStorage.getItem("cartItems"));
  const totalPrice =
    location.state?.totalPrice || sessionStorage.getItem("totalPrice");

  React.useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate("/", { replace: true });
    }
  }, [cartItems, navigate]);

  return (
    <Box p={5} bgGradient="linear(to-r, blue.100, pink.100)" minH="100vh">
      {/* Back button with icon */}
      <HStack
        alignItems="center"
        mb={5}
        cursor="pointer"
        onClick={() => navigate(-1)}
      >
        <IconButton
          icon={<ArrowBackIcon />}
          size="lg"
          variant="ghost"
          aria-label="Go Back"
        />
        <Text fontSize="md" fontWeight="bold">
          Shopping Continue
        </Text>
      </HStack>

      <Text fontSize="xl" mb={5} fontWeight="bold">
        There are{" "}
        <Text as="span" color="red">
          {cartItems.length}
        </Text>{" "}
        products in your cart
      </Text>

      <HStack align="start" spacing={10}>
        {/* Cart Section */}
        <VStack
          p={5}
          borderWidth="1px"
          borderRadius="md"
          boxShadow="lg"
          bg="white"
          width="60%"
          spacing={5} // Add some spacing between items
        >
          {cartItems.map((item, index) => (
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
              <HStack>
                <Image src={item.image} alt={item.name} boxSize="50px" />
                <Text>{item.name}</Text>
              </HStack>

              <HStack>
                {/* Quantity Controller */}
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

              <IconButton
                icon={<DeleteIcon />}
                colorScheme="red"
                onClick={() => removeItem(index)}
                aria-label="Remove Item"
              />
            </HStack>
          ))}
        </VStack>

        {/* Payment Form Section */}
        <Box
          p={5}
          borderWidth="1px"
          borderRadius="md"
          boxShadow="lg"
          bg="white"
          width="40%"
        >
          <Text fontSize="2xl" mb={5} fontWeight="bold">
            Payment
          </Text>
          <VStack spacing={4} align="stretch">
            <Input
              placeholder="Name"
              focusBorderColor="blue.500"
              borderColor="gray.300"
            />
            <Input
              placeholder="Phone number"
              focusBorderColor="blue.500"
              borderColor="gray.300"
            />
            <Input
              placeholder="Email"
              focusBorderColor="blue.500"
              borderColor="gray.300"
            />
          </VStack>

          {/* Items count and total price */}
          <HStack justify="space-between" mt={8}>
            <Text color="red.500" fontWeight="bold">
              {cartItems.length} Items
            </Text>
            <Text fontWeight="bold">
              {Number(totalPrice).toLocaleString()} VND
            </Text>
          </HStack>

          {/* Cash Out Button */}
          <Button colorScheme="blue" width="100%" mt={4}>
            CASH OUT
          </Button>
        </Box>
      </HStack>
    </Box>
  );
};

export default Payment;
