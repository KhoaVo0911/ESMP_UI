import React, { useState, useEffect } from "react";
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
import Cart from "./Cart";
import AddProductModal from "./AddProductModal";
import CreateProductModal from "./CreateProductModal";
import { Link } from "react-router-dom"; // Import the Link component
import axios from "axios";

const Shop = () => {
  const [cart, setCart] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
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

  // Fetch products from the mock API
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://668e540abf9912d4c92dcd67.mockapi.io/products"
      );
      setAllProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to add items to the cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (cartItem) => cartItem.id === product.id
      );

      if (existingProductIndex !== -1) {
        // If product is already in the cart, update its quantity
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += product.quantity;
        return updatedCart;
      } else {
        // If product is not in the cart, add it with the selected quantity
        return [...prevCart, product];
      }
    });
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
          <DrawerContent maxWidth="700px">
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

export default Shop;
