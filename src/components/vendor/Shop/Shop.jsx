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
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Shop = () => {
  const location = useLocation();
  const accessToken = location.state?.accessToken || "";
  const vendorId = location.state?.vendorId || "";
  const eventId = location.state?.eventId || "";

  const [cart, setCart] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [productItems, setProductItems] = useState([]);
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

  // Fetch product items for the vendor
  const fetchProductItems = async () => {
    try {
      const response = await axios.get(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/productitem/${vendorId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setProductItems(response.data);
      console.log("Product items fetched:", response.data); // Debugging
    } catch (error) {
      console.error("Error fetching product items", error);
    }
  };

  // Fetch products from the menu API and filter product items
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/menu/${vendorId}/${eventId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const productItemIds = response.data.productItemIds || [];
      console.log("ProductItemIds from menu:", productItemIds); // Debugging

      const filteredProducts = productItems.filter((item) =>
        productItemIds.includes(item.productItemId)
      );

      console.log("Filtered products to display:", filteredProducts); // Debugging
      setAllProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };
  const addProductItemToMenu = async (productItemId) => {
    try {
      // Fetch the current menu to get existing productItemIds
      const response = await axios.get(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/menu/${vendorId}/${eventId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      const existingMenu = response.data;
      const updatedProductItemIds = [...new Set([...existingMenu.productItemIds, productItemId])]; // Ensure no duplicates
  
      // Update the menu with the new productItemIds
      await axios.put(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/menu/${vendorId}/${eventId}`,
        {
          ...existingMenu,
          productItemIds: updatedProductItemIds,
        },
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Product item added successfully:", productItemId);
      // Optionally, refresh the product list
      fetchProducts();
    } catch (error) {
      console.error("Error adding product item to menu:", error);
    }
  };
  

  useEffect(() => {
    fetchProductItems();
  }, [vendorId, accessToken]);

  useEffect(() => {
    if (productItems.length > 0) {
      fetchProducts();
    }
  }, [productItems, vendorId, eventId, accessToken]);

  // Function to add items to the cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (cartItem) => cartItem.productItemId === product.productItemId
      );

      if (existingProductIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += product.quantity;
        return updatedCart;
      } else {
        return [...prevCart, product];
      }
    });
  };

  return (
    <Box
      p={5}
      bgGradient="linear(to-r, blue.100, pink.100)"
      minH="100vh"
      textAlign="center"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
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

      {allProducts.length > 0 ? (
        <SimpleGrid columns={[2, null, 5]} spacing="20px" mt={10}>
          {allProducts.map((product) => (
            <ProductCard key={product.productItemId} product={product} addToCart={addToCart} />
          ))}
        </SimpleGrid>
      ) : (
        <Text>No products available to display</Text>
      )}

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
  vendorId={vendorId}
  accessToken={accessToken}
  onAdd={(productId) => {
    console.log("Adding product ID:", productId); // Debugging
    addProductItemToMenu(productId); // Call the function to add the product item ID
  }}
/>



      {/* Create New Product Modal */}
      <CreateProductModal
        isOpen={isCreateOpen}
        onClose={onCloseCreate}
        onCreateProduct={(newProduct) =>
          setAllProducts((prevProducts) => [
            ...prevProducts,
            { id: prevProducts.length + 1, ...newProduct },
          ])
        }
      />
    </Box>
  );
};

export default Shop;
