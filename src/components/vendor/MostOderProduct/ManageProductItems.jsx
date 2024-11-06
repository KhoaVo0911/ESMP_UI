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
import { storage } from "./../../../shared/firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ManageProducts = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [products, setProducts] = useState([]);
  const [productItems, setProductItems] = useState([]);
  const [details, setDetails] = useState([]);
  const [editingProductItem, setEditingProductItem] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();
  const toast = useToast();
  const location = useLocation();
  const accessToken = location.state?.accessToken || "";
  const vendorId = location.state?.vendorId || "";
  const [imageFile, setImageFile] = useState(null);

  // Xử lý chọn ảnh
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Upload ảnh lên Firebase Storage
  const uploadImage = async (productItemId) => {
    if (!imageFile) return null;
    const imageRef = ref(storage, `${vendorId}/${productItemId}`);
    await uploadBytes(imageRef, imageFile);
    return await getDownloadURL(imageRef);
  };

  // Lấy URL ảnh từ Firebase Storage
  const fetchImageURL = async (productItemId) => {
    try {
      const imageRef = ref(storage, `${vendorId}/${productItemId}`);
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error("Error fetching image URL:", error);
      return "https://via.placeholder.com/150";
    }
  };

  // Fetch products từ API
  const fetchData = async () => {
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
      toast({
        title: "Error",
        description: "Failed to fetch products from API.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Fetch Product Items từ API và lấy URL ảnh
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

      const itemsWithImages = await Promise.all(
        response.data.map(async (item) => {
          const imageURL = await fetchImageURL(item.productItemId);
          return { ...item, imageURL };
        })
      );

      setProductItems(itemsWithImages);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch product items from API.`,
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

  // Add product to details list with selected quantity and unit
  const addProductToDetails = (selectedProductId, selectedQuantity) => {
    const quantity = Math.max(1, selectedQuantity);
    const selectedProduct = products.find((p) => p.productId === selectedProductId);
    if (selectedProduct && !details.find((d) => d.productId === selectedProduct.productId)) {
      setDetails([...details, { productId: selectedProduct.productId, quantity, unit: "kg" }]);
      if (details.length === 0) {
        setValue("productName", selectedProduct.productName);
        setValue("productPrice", "");
      } else {
        setValue("productName", "");
        setValue("productPrice", "");
      }
    }
  };

  // Remove a product from the details list
  const removeProductFromDetails = (productId) => {
    const updatedDetails = details.filter((d) => d.productId !== productId);
    setDetails(updatedDetails);
    if (updatedDetails.length === 1) {
      setValue("productName", updatedDetails[0].productName);
      setValue("productPrice", "");
    } else {
      setValue("productName", "");
      setValue("productPrice", "");
    }
  };

  // Handle form submission for adding or editing product items
  const onSubmit = async (data) => {
    if (details.length === 0) {
      toast({
        title: "Error",
        description: "You must add at least one product.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (details.length > 1 && (!data.productName || !data.productPrice)) {
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

    if (details.length === 1) {
      name = products.find((p) => p.productId === details[0].productId).productName;
    }

    const productItemData = {
      vendorId,
      name,
      description: data.description || "This is a sample product item description.",
      details,
      price: data.productPrice,
      status: true,
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
    };

    if (editingProductItem) {
      axios
        .put(
          `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/productitem/${editingProductItem.productItemId}`,
          productItemData,
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(async () => {
          const updatedProductItems = await Promise.all(
            productItems.map(async (item) =>
              item.productItemId === editingProductItem.productItemId
                ? { ...productItemData, imageURL: await fetchImageURL(editingProductItem.productItemId) }
                : item
            )
          );
          setProductItems(updatedProductItems);
          toast({
            title: "Success",
            description: "Product item updated successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setDetails([]);
          reset();
          onClose();
          setEditingProductItem(null);
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
      axios
        .post(
          `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/productitem/${vendorId}`,
          productItemData,
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(async (response) => {
          const newProductItemId = response.data.id;
          const imageURL = await uploadImage(newProductItemId);
          const updatedProductItem = { ...productItemData, productItemId: newProductItemId, imageURL };
          setProductItems([...productItems, updatedProductItem]);
        
          toast({
            title: "Success",
            description: "Product item created successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setDetails([]);
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

  return (
    <Box p={5}>
      <Button colorScheme="blue" onClick={onOpen}>
        Add Product Item
      </Button>

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
              <Image src={productItem.imageURL || "https://via.placeholder.com/150"} alt={productItem.name} objectFit="cover" width="100%" height="150px" />
              <Box p={4}>
                <Text fontWeight="bold" fontSize="lg">
                  {productItem.name}
                </Text>
                <Text>{productItem.price} VND</Text>
                <Flex direction="column">
                  {productItem.details.map((detail, index) => {
                    const foundProduct = products.find((p) => p.productId === detail.productId);
                    return (
                      <Text key={index} fontSize="sm">
                        - {foundProduct ? foundProduct.productName : "Unknown Product"} x {detail.quantity} {detail.unit}
                      </Text>
                    );
                  })}
                </Flex>
              </Box>
              <Flex justifyContent="flex-end" p={4}>
                {/* <Button leftIcon={<FaEdit />} size="sm" colorScheme="teal" variant="outline" onClick={() => handleEdit(productItem)}>
                  Edit
                </Button>
                <Button leftIcon={<FaTrash />} size="sm" colorScheme="red" variant="outline" onClick={() => handleDelete(productItem.productItemId)}>
                  Delete
                </Button> */}
              </Flex>
            </GridItem>
          ))
        ) : (
          <Text>No products available</Text>
        )}
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingProductItem ? "Edit Product Item" : "Add Product Item"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl mt={4}>
                <FormLabel>Name</FormLabel>
                <Input {...register("productName")} placeholder="Enter name" isDisabled={details.length === 1} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Price</FormLabel>
                <Input {...register("productPrice")} placeholder="Enter price" />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Product Image</FormLabel>
                <Input type="file" accept="image/*" onChange={handleImageChange} />
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
                <Button
                  mt={2}
                  colorScheme="teal"
                  onClick={() =>
                    addProductToDetails(
                      document.querySelector("select[name=productId]").value,
                      document.querySelector("input[name=productQuantity]").value
                    )
                  }
                >
                  Add Product
                </Button>
              </FormControl>

              {details.length > 0 && (
                <Box mt={4}>
                  <Text>Selected Products:</Text>
                  <List>
                    {details.map((detail, index) => (
                      <ListItem key={index}>
                        <Flex justifyContent="space-between" alignItems="center">
                          <Text>
                            {products.find((p) => p.productId === detail.productId)?.productName} x {detail.quantity} {detail.unit}
                          </Text>
                          <IconButton icon={<FaTrash />} size="sm" colorScheme="red" onClick={() => removeProductFromDetails(detail.productId)} />
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
