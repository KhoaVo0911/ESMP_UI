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
} from "@chakra-ui/react";
import ProductCard from "./ProductCard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Cart from "./Cart";
import AddProductModal from "./AddProductModal";
import CreateProductModal from "./CreateProductModal";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const accessToken = location.state?.accessToken || sessionStorage.getItem("accessToken") || "";
  const vendorId = location.state?.vendorId || sessionStorage.getItem("vendorId") || "";
  const eventId = location.state?.eventId || sessionStorage.getItem("eventId") || "";

  const [cart, setCart] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [productItems, setProductItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [menuName, setMenuName] = useState("");
  const [showCreateMenuModal, setShowCreateMenuModal] = useState(false);
  const { isOpen: isCartOpen, onOpen: onOpenCart, onClose: onCloseCart } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure();

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
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu sản phẩm", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/product/${vendorId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu sản phẩm", error);
    }
  };

  const fetchMenuItems = async () => {
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
      const productItemIds = response.data.productItemIds.map((item) => item.productItemId);

      const enrichedProductItems = productItems
        .filter((item) => productItemIds.includes(item.productItemId))
        .map((item) => {
          return {
            ...item,
            details: item.details.map((detail) => {
              const productDetails = products.find((product) => product.productId === detail.productId);
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
        console.error("Lỗi khi lấy menu sản phẩm", error);
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
        return [...prevCart, { ...product }];
      }
    });
  };

  const onOpenCartWithSessionData = () => {
    sessionStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("vendorId", vendorId);
    sessionStorage.setItem("eventId", eventId);
    onOpenCart();
  };

  const handleGoToOrderedList = () => {
    navigate("/ordered-list", {
      state: { accessToken, vendorId, eventId },
    });
  };

  const handleCreateMenu = async () => {
    try {
      await axios.post(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/menu/${vendorId}/${eventId}`,
        { menuName },
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setShowCreateMenuModal(false);
      fetchMenuItems(); // Refresh menu items after creation
    } catch (error) {
      console.error("Lỗi khi tạo menu mới", error);
    }
  };

  return (
    <Box p={5} bgGradient="linear(to-r, blue.100, pink.100)" minH="100vh" textAlign="center">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
        <Text fontSize="3xl" fontWeight="bold">Danh Sách Sản Phẩm</Text>

        <Box display="flex" alignItems="center">
          <Button mr={4} colorScheme="blue" onClick={handleGoToOrderedList}>Lịch sử đơn hàng</Button>
          <Button mr={4} onClick={onOpenAdd}>Thêm sản phẩm</Button>
          <IconButton
            icon={<ShoppingCartIcon />}
            onClick={onOpenCartWithSessionData}
            aria-label="Xem giỏ hàng"
          />
        </Box>
      </Box>

      {allProducts.length > 0 ? (
        <Box maxHeight="600px" overflowY="auto">
          <SimpleGrid columns={[2, null, 5]} spacing="20px">
            {allProducts.map((product) => (
              <ProductCard key={product.productItemId} product={product} addToCart={addToCart} />
            ))}
          </SimpleGrid>
        </Box>
      ) : (
        <Text>Không có sản phẩm nào để hiển thị</Text>
      )}

      <Drawer isOpen={isCartOpen} placement="right" onClose={onCloseCart}>
        <DrawerOverlay>
          <DrawerContent maxWidth="700px">
            <DrawerHeader>Giỏ Hàng</DrawerHeader>
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
              <Button colorScheme="teal" onClick={onCloseCart}>Đóng Giỏ Hàng</Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

      <AddProductModal
        isOpen={isAddOpen}
        onClose={onCloseAdd}
        vendorId={vendorId}
        eventId={eventId}
        accessToken={accessToken}
        onAdd={fetchMenuItems}
      />
      <CreateProductModal isOpen={isCreateOpen} onClose={onCloseCreate} />

      {/* Modal to create menu */}
      <Modal isOpen={showCreateMenuModal} onClose={() => setShowCreateMenuModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tạo Menu Mới</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Nhập tên cho menu của bạn:</Text>
            <Input
              placeholder="Tên menu"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              mt={3}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateMenu}>
              Tạo Menu
            </Button>
            <Button variant="ghost" onClick={() => setShowCreateMenuModal(false)}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Shop;
