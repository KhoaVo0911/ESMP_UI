import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  SimpleGrid,
  Button,
  Box,
  Image,
  Text,
  VStack,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { storage } from "./../../../shared/firebase/firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";

const AddProductModal = ({ isOpen, onClose, vendorId, eventId, accessToken, onAdd }) => {
  const [products, setProducts] = useState([]);
  const [productNames, setProductNames] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const productItemsResponse = await axios.get(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/productitem/${vendorId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const productItemsWithImages = await Promise.all(
        productItemsResponse.data.map(async (product) => {
          const imageRef = ref(storage, `${vendorId}/${product.productItemId}`);
          const imageUrl = await getDownloadURL(imageRef).catch(() => "https://via.placeholder.com/150");
          return { ...product, imageUrl };
        })
      );
      setProducts(productItemsWithImages);

      const productsResponse = await axios.get(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/product/${vendorId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const productNameMap = {};
      productsResponse.data.forEach((product) => {
        productNameMap[product.productId] = product.productName;
      });
      setProductNames(productNameMap);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải sản phẩm.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProducts((prev) =>
      prev.includes(product) ? prev.filter((p) => p !== product) : [...prev, product]
    );
  };

  const handleAddSelectedProductsToMenu = async () => {
    if (!selectedProducts || selectedProducts.length === 0) {
      toast({
        title: "Chọn sản phẩm",
        description: "Vui lòng chọn ít nhất một sản phẩm để thêm.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    setIsSubmitting(true);
    try {
      const payload = {
        productItem: selectedProducts.map((product) => ({
          id: product.productItemId,
        })),
      };
  
      const response = await axios.post(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/menu/${vendorId}/${eventId}`,
        payload,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data && response.data.message === "Create menuItem success") {
        toast({
          title: "Thành công",
          description: "Sản phẩm đã được thêm vào menu.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
  
        // Gọi onAdd với thông tin sản phẩm để cập nhật UI
        onAdd(selectedProducts);
        setSelectedProducts([]);
        onClose();
      }
    } catch (error) {
      console.error("Error adding products to menu:", error);
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi thêm sản phẩm vào menu.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Thêm sản phẩm vào Menu</ModalHeader>
        <ModalBody>
          {loading ? (
            <Spinner size="xl" color="blue.500" />
          ) : (
            <Box maxHeight="500px" overflowY="auto">
              <SimpleGrid columns={4} spacing={5}>
                {products.map((product) => (
                  <Box
                    key={product.productItemId}
                    maxW="sm"
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    p="4"
                    textAlign="left"
                    background={selectedProducts.includes(product) ? "blue.100" : "white"}
                    onClick={() => handleSelectProduct(product)}
                    cursor="pointer"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <Image src={product.imageUrl} alt={product.name} boxSize="100px" mx="auto" />
                    <Text fontWeight="bold" fontSize="xl" mt={2}>
                      {productNames[product.productId] || product.name}
                    </Text>
                    <Text fontWeight="bold" fontSize="lg" color="gray.600">
                      {parseInt(product.price).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </Text>
                    <VStack align="start" spacing={1} mt={2}>
                      {product.details.map((detail, index) => (
                        <Text key={index} fontSize="sm" color="gray.500">
                          - {productNames[detail.productId] || detail.productId} x {detail.quantity}{" "}
                          {detail.unit}
                        </Text>
                      ))}
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Đóng
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleAddSelectedProductsToMenu}
            isDisabled={selectedProducts.length === 0 || isSubmitting}
            isLoading={isSubmitting}
          >
            Thêm sản phẩm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddProductModal;
