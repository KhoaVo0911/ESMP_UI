import React, { useState } from "react";
import {
  SimpleGrid,
  Box,
  Button,
  IconButton,
  Text,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
} from "@chakra-ui/react";
import ProductCard from "./ProductCard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Sushi from "./../../../assets/images/Pizza.png";
import Cart from "./Cart";
import AddProductModal from "./AddProductModal";
import CreateProductModal from "./CreateProductModal";
import { Link } from "react-router-dom"; // Import the Link component

const products = [
  { id: 1, name: "Margherita Pizza", price: 49000, quantity: 10, image: Sushi },
  { id: 2, name: "Pepperoni Pizza", price: 52000, quantity: 8, image: Sushi },
  { id: 3, name: "Hawaiian Pizza", price: 51000, quantity: 15, image: Sushi },
  { id: 4, name: "BBQ Chicken Pizza", price: 53000, quantity: 5, image: Sushi },
  { id: 5, name: "Veggie Pizza", price: 47000, quantity: 12, image: Sushi },
  { id: 6, name: "Buffalo Pizza", price: 55000, quantity: 9, image: Sushi },
  { id: 7, name: "Four Cheese Pizza", price: 60000, quantity: 6, image: Sushi },
  {
    id: 8,
    name: "Meat Lover's Pizza",
    price: 65000,
    quantity: 7,
    image: Sushi,
  },
  {
    id: 9,
    name: "Spinach and Feta Pizza",
    price: 54000,
    quantity: 4,
    image: Sushi,
  },
  {
    id: 10,
    name: "Garlic Chicken Pizza",
    price: 58000,
    quantity: 11,
    image: Sushi,
  },
];

const StaffShop = () => {
  const [cart, setCart] = useState([]);
  const [allProducts, setAllProducts] = useState(products);
  const {
    isOpen: isCartOpen,
    onOpen: onOpenCart,
    onClose: onCloseCart,
  } = useDisclosure();

  const {
    isOpen: isAddOpen,
    onOpen: onOpenAdd,
    onClose: onCloseAdd,
  } = useDisclosure();

  const {
    isOpen: isCreateOpen,
    onOpen: onOpenCreate,
    onClose: onCloseCreate,
  } = useDisclosure();

  // Function to add items to the cart
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
  };

  // Function to create new product
  const handleCreateProduct = (newProduct) => {
    setAllProducts((prevProducts) => [
      ...prevProducts,
      { id: prevProducts.length + 1, ...newProduct },
    ]);
  };

  return (
    <Box
      p={5}
      bgGradient="linear(to-r, blue.100, pink.100)"
      minH="100vh"
      textAlign="center"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={5}
      >
        <Text fontSize="3xl" fontWeight="bold">
          Manage Products
        </Text>

        {/* Cart, Add, Create, and Ordered Buttons */}
        <Box display="flex" alignItems="center">
          <Link to="/ordered-list">
            <Button mr={4} colorScheme="blue">
              Ordered List
            </Button>
          </Link>
          <Button mr={4} onClick={onOpenAdd}>
            Add
          </Button>
          <Button mr={4} colorScheme="teal" onClick={onOpenCreate}>
            Create
          </Button>
          <IconButton
            icon={<ShoppingCartIcon />}
            onClick={onOpenCart}
            aria-label="View Cart"
          />
        </Box>
      </Box>

      <SimpleGrid columns={[2, null, 5]} spacing="20px" mt={10}>
        {allProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </SimpleGrid>

      {/* Cart Drawer */}
      <Drawer isOpen={isCartOpen} placement="right" onClose={onCloseCart}>
        <DrawerOverlay>
          <DrawerContent maxWidth="600px">
            <DrawerHeader>Your Cart</DrawerHeader>
            <DrawerBody>
              <Cart
                cartItems={cart}
                updateQuantity={(index, newQuantity) =>
                  setCart((prevCart) => {
                    const updatedCart = [...prevCart];
                    updatedCart[index].quantity = newQuantity;
                    return updatedCart;
                  })
                }
                removeItem={(index) =>
                  setCart((prevCart) => prevCart.filter((_, i) => i !== index))
                }
              />
            </DrawerBody>
            <DrawerFooter>
              <Button colorScheme="teal" onClick={onCloseCart}>
                Close
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

      {/* Add Products Modal */}
      <AddProductModal
        isOpen={isAddOpen}
        onClose={onCloseAdd}
        products={allProducts}
        addToCart={addToCart}
      />

      {/* Create New Product Modal */}
      <CreateProductModal
        isOpen={isCreateOpen}
        onClose={onCloseCreate}
        onCreateProduct={handleCreateProduct}
      />
    </Box>
  );
};

export default StaffShop;
