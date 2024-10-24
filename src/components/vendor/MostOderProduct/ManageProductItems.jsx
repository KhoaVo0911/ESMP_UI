import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Image,
  Text,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  List,
  ListItem,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";

const ManageProducts = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [products, setProducts] = useState([]);
  const [productItems, setProductItems] = useState([]); // Dữ liệu API trả về
  const [productOriginBy, setProductOriginBy] = useState([]); // Lưu danh sách sản phẩm trong productItem
  const [editingProductItem, setEditingProductItem] = useState(null); // Lưu thông tin sản phẩm đang chỉnh sửa
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const accessToken = location.state?.accessToken || "";
  const vendorId = location.state?.vendorId || "";

  // Fetch Products from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/product",
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setProducts(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Lỗi khi lấy dữ liệu từ API!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch Product Items from API
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
      setProductItems(Array.isArray(response.data.productItems) ? response.data.productItems : Object.values(response.data.productItems));
    } catch (error) {
      toast({
        title: "Error",
        description: "Lỗi khi lấy dữ liệu từ API!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchData();
    fetchProductItems();
  }, []);

  // Add product to productOriginBy list with selected quantity
  const addProductToItem = (selectedProductId, selectedQuantity) => {
    const quantity = Math.max(1, selectedQuantity);
    const selectedProduct = products.find((p) => p.productId === selectedProductId);
    if (selectedProduct && !productOriginBy.find((p) => p.productId === selectedProduct.productId)) {
      setProductOriginBy([...productOriginBy, { productId: selectedProduct.productId, quantity }]);
      if (productOriginBy.length === 0) {
        setValue("productName", selectedProduct.productName); // Auto-fill name
        setValue("productPrice", ""); // Keep price empty and editable
      } else {
        setValue("productName", "");
        setValue("productPrice", "");
      }
    }
  };

  // Remove a product from the productOriginBy list
  const removeProductFromItem = (productId) => {
    const updatedProductOriginBy = productOriginBy.filter((p) => p.productId !== productId);
    setProductOriginBy(updatedProductOriginBy);
    if (updatedProductOriginBy.length === 1) {
      setValue("productName", updatedProductOriginBy[0].productName);
      setValue("productPrice", "");
    } else {
      setValue("productName", "");
      setValue("productPrice", "");
    }
  };

  // Handle form submit for adding or editing product items
  const onSubmit = (data) => {
    if (productOriginBy.length === 0) {
      toast({
        title: "Error",
        description: "You must add at least one product.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (productOriginBy.length > 1 && (!data.productName || !data.productPrice)) {
      toast({
        title: "Error",
        description: "You must provide a name and price for the product item.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    let name = data.productName;
    let price = data.productPrice;

    if (productOriginBy.length === 1) {
      name = products.find((p) => p.productId === productOriginBy[0].productId).productName;
    }

    const productItemData = {
      productId: productOriginBy[0]?.productId || "",
      name,
      description: data.description || "This is a sample product item description.",
      productOriginBy: productOriginBy.map((p) => `${p.productId} : ${p.quantity}`).join(", "),
      price: data.productPrice,
      unit: data.unit || "kg",
      status: false,
    };

    // Nếu đang chỉnh sửa sản phẩm, cập nhật sản phẩm
    if (editingProductItem) {
      axios
        .put(`http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/productitem/${editingProductItem.productItemId}`, productItemData, {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          const updatedProductItems = productItems.map((item) =>
            item.productItemId === editingProductItem.productItemId ? productItemData : item
          );
          setProductItems(updatedProductItems);
          toast({
            title: "Success",
            description: "Product item updated successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setProductOriginBy([]);
          reset();
          onClose();
          setEditingProductItem(null); // Clear editing state
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: "Failed to update product item!",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          console.error("Error updating product item:", error);
        });
    } else {
      // Thực hiện thêm sản phẩm mới
      axios
        .post(`http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/productitem`, productItemData, {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          setProductItems([...productItems, productItemData]);
          toast({
            title: "Success",
            description: "Product item created successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setProductOriginBy([]);
          reset();
          onClose();
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: "Failed to create product item!",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          console.error("Error creating product item:", error);
        });
    }
  };

  // Handle Edit
  const handleEdit = (productItem) => {
    setEditingProductItem(productItem);
    setValue("productName", productItem.name);
    setValue("productPrice", productItem.price);
    setProductOriginBy(productItem.productOriginBy.split(",").map((p) => {
      const [productId, quantity] = p.split(":").map((item) => item.trim());
      return { productId, quantity };
    }));
    onOpen();
  };

  // Handle Delete
  const handleDelete = async (productItemId) => {
    try {
      await axios.delete(`http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/productitem/${productItemId}`, {
        headers: {
          Authorization: `${accessToken}`,
        },
      });
      setProductItems(productItems.filter((item) => item.productItemId !== productItemId));
      toast({
        title: "Success",
        description: "Product item deleted successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product item!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Error deleting product item:", error);
    }
  };

  return (
    <Box p={5}>
      {/* Button to trigger adding products */}
      <Button colorScheme="blue" onClick={onOpen}>
        Add Product Item
      </Button>

      {/* Product Item Display Section */}
      <Grid templateColumns="repeat(4, 1fr)" gap={6} mt={10}>
        {productItems.length > 0 ? (
          productItems.map((productItem) => (
            <GridItem
              key={productItem.productItemId}
              border="1px solid #e0e0e0"
              borderRadius="md"
              overflow="hidden"
              boxShadow="md"
              _hover={{ boxShadow: "lg" }}
            >
              <Image src="https://via.placeholder.com/150" alt={productItem.name} objectFit="cover" width="100%" height="150px" />
              <Box p={4}>
                <Text fontWeight="bold" fontSize="lg">
                  {productItem.name}
                </Text>
                <Text>{productItem.price} VND</Text>
                <Text fontSize="sm" mt={2} color="gray.500">
                  Products in item:
                </Text>
                <Flex direction="column">
                  {productItem.productOriginBy.split(",").map((productData, index) => {
                    const [productId, quantity] = productData.split(":").map((item) => item.trim());
                    const foundProduct = products.find((p) => p.productId === productId);
                    return (
                      <Text key={index} fontSize="sm">
                        - {foundProduct ? foundProduct.productName : "Unknown Product"} x {quantity}
                      </Text>
                    );
                  })}
                </Flex>
              </Box>
              <Flex justifyContent="flex-end" p={4}>
                <Button leftIcon={<FaEdit />} size="sm" colorScheme="teal" variant="outline" onClick={() => handleEdit(productItem)}>
                  Edit
                </Button>
                <Button leftIcon={<FaTrash />} size="sm" colorScheme="red" variant="outline" onClick={() => handleDelete(productItem.productItemId)}>
                  Delete
                </Button>
              </Flex>
            </GridItem>
          ))
        ) : (
          <Text>No products available</Text>
        )}
      </Grid>

      {/* Modal for Adding/Editing Product Item */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingProductItem ? "Edit Product Item" : "Add Product Item"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl mt={4}>
                <FormLabel>Name</FormLabel>
                <Input {...register("productName")} placeholder="Enter name" isDisabled={productOriginBy.length === 1} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Price</FormLabel>
                <Input {...register("productPrice")} placeholder="Enter price" />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Select Product and Quantity</FormLabel>
                <Select placeholder="Select a product" {...register("productId")}>
                  {products.map((product) => (
                    <option key={product.productId} value={product.productId}>
                      {product.productName}
                    </option>
                  ))}
                </Select>
                <FormControl mt={2}>
                  <FormLabel>Quantity</FormLabel>
                  <Input type="number" defaultValue={1} min={1} {...register("productQuantity")} placeholder="Enter quantity" />
                </FormControl>
                <Button mt={2} colorScheme="teal" onClick={() => addProductToItem(document.querySelector("select[name=productId]").value, document.querySelector("input[name=productQuantity]").value)}>
                  Add Product
                </Button>
              </FormControl>

              {/* Display selected products */}
              {productOriginBy.length > 0 && (
                <Box mt={4}>
                  <Text>Selected Products:</Text>
                  <List>
                    {productOriginBy.map((product, index) => (
                      <ListItem key={index}>
                        <Flex justifyContent="space-between" alignItems="center">
                          <Text>
                            {products.find((p) => p.productId === product.productId)?.productName} x {product.quantity}
                          </Text>
                          <IconButton icon={<FaTrash />} size="sm" colorScheme="red" onClick={() => removeProductFromItem(product.productId)} />
                        </Flex>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              <ModalFooter>
                <Button colorScheme="blue" mr={3} type="submit">
                  Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ManageProducts;
