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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Tooltip,
  useToast,
  Badge,
} from "@chakra-ui/react";
import ProductCard from "./ProductCard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Cart from "./Cart";
// import AddProductModal from "./AddProductModal";
// import CreateProductModal from "./CreateProductModal";
// import EndEvent from "./EndEvent";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const StaffShop = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const totalRevenue = location.state?.totalRevenue || 0;

  const accessToken =
    location.state?.accessToken || sessionStorage.getItem("accessToken") || "";
  const vendorId =
    location.state?.vendorId || sessionStorage.getItem("vendorId") || "";
  const eventId =
    location.state?.eventId || sessionStorage.getItem("eventId") || "";
  const hostId = sessionStorage.getItem("hostId") || "defaultHostId";
  const staffId =
    location.state?.staffId || sessionStorage.getItem("staffId") || "";

  const [cart, setCart] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [productItems, setProductItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [menuName, setMenuName] = useState("");
  const [productItem, setProductItem] = useState([]);
  const [vendorInEventStatus, setVendorInEventStatus] = useState(null);
  const [showCreateMenuModal, setShowCreateMenuModal] = useState(false);
  const toast = useToast(); // Toast instance for notifications

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

  const fetchVendorInEventStatus = async () => {
    try {
      const response = await axios.get(
        `https://esmpbe.id.vn/api/vendorinevent/${vendorId}/${eventId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setVendorInEventStatus(response.data.status);
    } catch (error) {
      console.error("Error fetching vendorInEvent status:", error);
    }
  };

  useEffect(() => {
    if (vendorId && eventId && accessToken) {
      fetchVendorInEventStatus();
    }
  }, [vendorId, eventId, accessToken]);

  const fetchProductItems = async () => {
    try {
      const response = await axios.get(
        `https://esmpbe.id.vn/api/productitem/${vendorId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setProductItems(response.data);
    } catch (error) {
      console.error("Error fetching product items", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `https://esmpbe.id.vn/api/product/${vendorId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };
  const clearCart = () => {
    setCart([]); // Xóa tất cả các sản phẩm trong giỏ hàng
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from the cart.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(
        `https://esmpbe.id.vn/api/menu/${vendorId}/${eventId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const productItemIds = response.data.productItemIds.map(
        (item) => item.productItemId
      );

      const enrichedProductItems = productItems
        .filter((item) => productItemIds.includes(item.productItemId))
        .map((item) => {
          return {
            ...item,
            details: item.details.map((detail) => {
              const productDetails = products.find(
                (product) => product.productId === detail.productId
              );
              return {
                ...detail,
                name: productDetails ? productDetails.productName : "Unknown",
              };
            }),
          };
        });
      setAllProducts(enrichedProductItems);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setShowCreateMenuModal(true);
      } else {
        console.error("Error fetching menu items", error);
      }
    }
  };

  useEffect(() => {
    if (vendorId && accessToken) {
      fetchProductItems();
      fetchProducts();
    }
  }, [vendorId, accessToken]);

  useEffect(() => {
    if (productItems.length > 0 && products.length > 0 && eventId) {
      fetchMenuItems();
    }
  }, [productItems, products, vendorId, eventId, accessToken]);

  const handleStatusUpdate = async () => {
    await fetchVendorInEventStatus();
  };

  const addToCart = (product, productItemIds) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (cartItem) => cartItem.productItemId === product.productItemId
      );

      if (existingProductIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += product.quantity;
        toast({
          title: "Product Updated",
          description: `Increased quantity of ${product.name} by ${product.quantity}.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        return updatedCart;
      } else {
        toast({
          title: "Product Added",
          description: `Added ${product.quantity} x ${product.name} to the cart.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        return [...prevCart, { ...product }];
      }
    });
  };

  const onOpenCartWithSessionData = () => {
    if (vendorInEventStatus !== "finished") {
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("vendorId", vendorId);
      sessionStorage.setItem("eventId", eventId);
      onOpenCart();
    }
  };

  const handleGoToOrderedList = () => {
    navigate(`/staff-ordered-list/${vendorId}/${staffId}/${eventId}`, {
      state: { accessToken, vendorId, eventId },
    });
  };

  const handleCreateMenu = async () => {
    try {
      await axios.post(
        `https://esmpbe.id.vn/api/menu/${vendorId}/${eventId}`,
        { menuName, productItem },
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setShowCreateMenuModal(false); // Close modal after success
      toast({
        title: "Menu Created!",
        description: "Your new menu has been created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchMenuItems(); // Fetch updated menu items
    } catch (error) {
      console.error("Error creating new menu", error);
      // toast({
      //   title: "Error",
      //   description: "There was an issue creating the menu. Please try again.",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      // });
    }
  };

  const handleFetchMenuName = async () => {
    try {
      const response = await axios.get(
        `https://esmpbe.id.vn/api/menu/${vendorId}/${eventId}`, // Endpoint để lấy menu
        {
          headers: {
            Authorization: `${accessToken}`, // Thêm token xác thực nếu cần
          },
        }
      );

      const menuName = response.data.menuEvent.menuName; // Giả sử menuName nằm trong response.data
      console.log("Menu Name:", menuName); // Hiển thị menuName

      // Nếu cần sử dụng menuName sau đó, bạn có thể set vào state
      setMenuName(menuName); // Ví dụ: lưu menuName vào state nếu cần
    } catch (error) {
      console.error("Error fetching menu:", error);
      // toast({
      //   title: "Error",
      //   description: "There was an issue fetching the menu name.",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      // });
    }
  };

  useEffect(() => {
    if (vendorId && eventId && accessToken) {
      handleFetchMenuName(); // Gọi khi cần thiết để lấy menuName
    }
  }, [vendorId, eventId, accessToken]);
  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
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
          {menuName}
        </Text>
        <Box display="flex" alignItems="center" gap={4}>
          <Button colorScheme="blue" onClick={handleGoToOrderedList}>
            Order History
          </Button>

          <Tooltip
            label={
              vendorInEventStatus === "finished"
                ? "Cannot open cart. Event is finished."
                : `View your cart. Total items: ${getTotalQuantity()}`
            }
          >
            <Box position="relative" display="inline-block">
              <IconButton
                icon={<ShoppingCartIcon />}
                onClick={onOpenCartWithSessionData}
                aria-label="View Cart"
                disabled={vendorInEventStatus === "finished"}
                cursor={
                  vendorInEventStatus === "finished" ? "not-allowed" : "pointer"
                }
              />
              {getTotalQuantity() > 0 && (
                <Badge
                  position="absolute"
                  top="-2px"
                  right="-2px"
                  colorScheme="red"
                  borderRadius="full"
                  px={2}
                  py={0.5}
                  fontSize="xs"
                >
                  {getTotalQuantity()}
                </Badge>
              )}
            </Box>
          </Tooltip>
        </Box>
      </Box>

      {allProducts.length > 0 ? (
        <Box maxHeight="600px" overflowY="auto">
          <SimpleGrid columns={[2, null, 5]} spacing="20px">
            {allProducts.map((product) => (
              <ProductCard
                key={product.productItemId}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </SimpleGrid>
        </Box>
      ) : (
        <Text>No products to display</Text>
      )}

      <Drawer isOpen={isCartOpen} placement="right" onClose={onCloseCart}>
        <DrawerOverlay>
          <DrawerContent maxWidth="700px">
            <DrawerHeader>Cart</DrawerHeader>
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
                clearCart={clearCart} // Gọi hàm clearCart
              />
            </DrawerBody>
            <DrawerFooter>
              <Button colorScheme="teal" onClick={onCloseCart}>
                Close Cart
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
};

export default StaffShop;
