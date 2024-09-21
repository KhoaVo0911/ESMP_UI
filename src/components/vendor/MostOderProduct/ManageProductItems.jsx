import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Text,
  Image,
  IconButton,
  VStack,
  HStack,
  Button,
  Input,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import axios from "axios";

const ManageProductItems = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [activeCard, setActiveCard] = useState(null); // Track card click
  const toast = useToast();

  // Hàm định dạng tiền theo VND
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Fetch dữ liệu từ API
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://668e540abf9912d4c92dcd67.mockapi.io/products"
      );
      setProducts(response.data);
    } catch (error) {
      toast({
        title: "Error loading products",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Hàm để xử lý tạo hoặc cập nhật sản phẩm
  const handleSave = async () => {
    const productData = { name, quantity, price, image };

    try {
      if (editingProduct) {
        await axios.put(
          `https://668e540abf9912d4c92dcd67.mockapi.io/products/${editingProduct.id}`,
          productData
        );
        setProducts(
          products.map((item) =>
            item.id === editingProduct.id ? { ...item, ...productData } : item
          )
        );
        toast({
          title: "Product updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const response = await axios.post(
          "https://668e540abf9912d4c92dcd67.mockapi.io/products",
          productData
        );
        setProducts([...products, response.data]);
        toast({
          title: "Product created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Failed to save product",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsModalOpen(false);
      clearForm();
    }
  };

  // Hàm để xóa sản phẩm
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://668e540abf9912d4c92dcd67.mockapi.io/products/${id}`
      );
      setProducts(products.filter((item) => item.id !== id));
      toast({
        title: "Product deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to delete product",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Xử lý mở modal cho chỉnh sửa hoặc tạo mới sản phẩm
  const showModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      setName(product.name);
      setQuantity(product.quantity);
      setPrice(product.price);
      setImage(product.image);
    } else {
      clearForm();
    }
    setIsModalOpen(true);
  };

  // Hàm để xóa dữ liệu form sau khi hoàn thành
  const clearForm = () => {
    setName("");
    setQuantity("");
    setPrice("");
    setImage("");
    setEditingProduct(null);
  };

  // Hàm để kiểm tra card hiện tại có đang được nhấn hay không
  const handleCardClick = (id) => {
    setActiveCard(activeCard === id ? null : id);
  };

  return (
    <Box padding={5}>
      {/* Nút tạo sản phẩm mới */}
      <HStack justifyContent="space-between" marginBottom={4}>
        <Text fontSize="2xl" fontWeight="bold">
          List of Products
        </Text>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={() => showModal()}
        >
          Create Product
        </Button>
      </HStack>

      {/* Danh sách sản phẩm */}
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        {products.map((product) => (
          <Box
            key={product.id}
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            position="relative"
            cursor="pointer"
            _hover={{ boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)" }}
            transition="all 0.3s ease" // Animation
            onClick={() => handleCardClick(product.id)}
            height="400px" // Đặt chiều cao cố định cho card
          >
            <Image
              src={product.image || "https://via.placeholder.com/300x200"}
              alt={product.name}
              width="100%"
              height="60%" // Đặt chiều cao cho hình ảnh
              objectFit="cover"
            />
            <VStack
              spacing={2}
              p={3}
              textAlign="center"
              height="40%" // Cố định chiều cao của phần nội dung
              justifyContent={
                activeCard === product.id ? "space-between" : "center"
              } // Đưa nội dung lên khi nhấn vào
              transform={
                activeCard === product.id
                  ? "translateY(-14px)"
                  : "translateY(0px)"
              } // Di chuyển nội dung lên khi nhấn
              transition="all 0.1s ease" // Thêm animation khi di chuyển
            >
              <Text fontWeight="bold" fontSize="lg">
                {product.name}
              </Text>
              <Text fontSize="sm" color="gray.600">
                Quantity: {product.quantity}
              </Text>
              <Text fontSize="md" color="gray.800">
                {formatCurrency(product.price)}
              </Text>

              {/* Thêm nút Edit và Delete với absolute position */}
              {activeCard === product.id && (
                <HStack spacing={4} justify="center" pt={2}>
                  <IconButton
                    aria-label="Edit Product"
                    icon={<EditIcon boxSize={5} />}
                    onClick={() => showModal(product)}
                    variant="ghost"
                    colorScheme="blue"
                    _hover={{ bg: "transparent" }} // Bỏ viền nền khi hover
                  />
                  <IconButton
                    aria-label="Delete Product"
                    icon={<DeleteIcon boxSize={5} />}
                    onClick={() => handleDelete(product.id)}
                    variant="ghost"
                    colorScheme="red"
                    _hover={{ bg: "transparent" }} // Bỏ viền nền khi hover
                  />
                </HStack>
              )}
            </VStack>
          </Box>
        ))}
      </Grid>

      {/* Modal tạo/sửa sản phẩm */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingProduct ? "Edit Product" : "Create Product"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Product Name</FormLabel>
                <Input
                  placeholder="Enter product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Quantity</FormLabel>
                <Input
                  placeholder="Enter quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Price (VND)</FormLabel>
                <Input
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Image URL</FormLabel>
                <Input
                  placeholder="Enter image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSave}>
              {editingProduct ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ManageProductItems;
