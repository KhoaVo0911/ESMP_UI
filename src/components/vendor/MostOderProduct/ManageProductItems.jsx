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
import { storage } from "./../../../shared/firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const ManageProducts = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [products, setProducts] = useState([]);
  const [productItems, setProductItems] = useState([]);
  const [details, setDetails] = useState([]);
  const [editingProductItem, setEditingProductItem] = useState(null);
  const { register, handleSubmit, reset, setValue, formState: { errors }  } = useForm();
  const toast = useToast();
  const accessToken = sessionStorage.getItem("accessToken") || "";
  const vendorId = sessionStorage.getItem("vendorId") || "";
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(""); // Image preview
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0])); // Preview ảnh mới khi chọn
    }
  };

  const uploadImage = async (productItemId) => {
    if (!imageFile) return editingProductItem?.imageURL || null;
    const imageRef = ref(storage, `${vendorId}/${productItemId}`);

    // Xóa ảnh cũ nếu tồn tại
    try {
      await deleteObject(imageRef);
    } catch (error) {
      console.log("No existing image to delete or error deleting image:", error);
    }

    // Upload ảnh mới
    await uploadBytes(imageRef, imageFile);
    return await getDownloadURL(imageRef); // Trả về URL mới của ảnh
  };

  const fetchImageURL = async (productItemId) => {
    try {
      const imageRef = ref(storage, `${vendorId}/${productItemId}`);
      return await getDownloadURL(imageRef); // Lấy URL ảnh để hiển thị
    } catch (error) {
      console.error("Error fetching image URL:", error);
      return "https://via.placeholder.com/150";
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://esmpbe.id.vn/api/product/${vendorId}`,
        {
          headers: { Authorization: `${accessToken}`, "Content-Type": "application/json" },
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

  const fetchProductItems = async () => {
    try {
      const response = await axios.get(
        `https://esmpbe.id.vn/api/productitem/${vendorId}`,
        {
          headers: { Authorization: `${accessToken}`, "Content-Type": "application/json" },
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
        description: "Failed to fetch product items from API.",
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

  const addProductToDetails = (selectedProductId, selectedQuantity) => {
    const quantity = Math.max(1, selectedQuantity);
    const selectedProduct = products.find((p) => p.productId === selectedProductId);
    if (selectedProduct && !details.find((d) => d.productId === selectedProduct.productId)) {
      setDetails([...details, { productId: selectedProduct.productId, quantity, unit: "" }]);
      setValue("productName", selectedProduct.productName);
      setValue("productPrice", "");
    }
  };

  const removeProductFromDetails = (productId) => {
    const updatedDetails = details.filter((d) => d.productId !== productId);
    setDetails(updatedDetails);
    setValue("productName", updatedDetails[0]?.productName || "");
    setValue("productPrice", "");
  };

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

    const productItemData = {
      vendorId,
      name: data.productName,
      description: data.description || "Product item description",
      details,
      price: data.productPrice,
      status: true,
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
    };

    try {
      const newProductItemId = editingProductItem
        ? editingProductItem.productItemId
        : (await axios.post(
            `https://esmpbe.id.vn/api/productitem/${vendorId}`,
            productItemData,
            {
              headers: { Authorization: `${accessToken}`, "Content-Type": "application/json" },
            }
          )).data.id;

      const imageURL = await uploadImage(newProductItemId);
      const updatedProductItem = { ...productItemData, productItemId: newProductItemId, imageURL };

      if (editingProductItem) {
        await axios.put(
          `https://esmpbe.id.vn/api/productitem/${vendorId}/${newProductItemId}`,
          updatedProductItem,
          {
            headers: { Authorization: `${accessToken}`, "Content-Type": "application/json" },
          }
        );

        setProductItems((prevItems) =>
          prevItems.map((item) =>
            item.productItemId === editingProductItem.productItemId ? updatedProductItem : item
          )
        );
      } else {
        setProductItems((prevItems) => [...prevItems, updatedProductItem]);
      }

      toast({
        title: "Success",
        description: editingProductItem ? "Product item updated successfully!" : "Product item created successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      resetForm();
    } catch (error) {
      console.error("Error saving product item:", error);
      toast({
        title: "Error",
        description: "Failed to save product item!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const resetForm = () => {
    setDetails([]);
    reset();
    setImageFile(null);
    setImagePreview(""); // Clear image preview
    onClose();
    setEditingProductItem(null);
  };

  const handleEdit = (productItem) => {
    setEditingProductItem(productItem);
    setValue("productName", productItem.name);
    setValue("productPrice", productItem.price);
    setDetails(productItem.details);
    setImagePreview(productItem.imageURL); // Preview hiện tại khi edit
    onOpen();
  };

  return (
    <Box p={5}>
      <Button colorScheme="blue" onClick={onOpen}>
        Add New Product
      </Button>

      <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} mt={10}>
        {productItems.length > 0 ? (
          productItems.map((productItem) => (
            <GridItem
            key={productItem.productItemId}
            border="1px solid #e0e0e0"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            _hover={{ boxShadow: "2xl", transform: "scale(1.05)" }}
            transition="all 0.3s ease"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            height="350px"
            maxWidth="250px" // Giới hạn chiều ngang của card
          >
          
              <Image
                src={productItem.imageURL || "https://via.placeholder.com/150"}
                alt={productItem.name}
                objectFit="cover"
                width="100%"
                height="150px"
              />
              <Box p={4} flex="1" overflow="hidden">
                <Text fontWeight="bold" fontSize="lg" color="blue.600">
                  {productItem.name}
                </Text>
                <Text color="gray.500" mb={2}>{productItem.price} VND</Text>
                <Box overflowY="auto" maxHeight="60px">
                  {productItem.details.map((detail, index) => (
                    <Text key={index} fontSize="sm">
                      - {products.find((p) => p.productId === detail.productId)?.productName || "Unknown"} x {detail.quantity} {detail.unit}
                    </Text>
                  ))}
                </Box>
              </Box>
              <Box p={4} display="flex" justifyContent="center">
                <Button leftIcon={<FaEdit />} size="sm" colorScheme="teal" variant="outline" onClick={() => handleEdit(productItem)}>
                  Edit
                </Button>
              </Box>
            </GridItem>
          ))
        ) : (
          <Text>No products available</Text>
        )}
      </Grid>

    

<Modal isOpen={isOpen} onClose={onClose} isCentered>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>{editingProductItem ? "Edit Product" : "Add Product"}</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onReset={() => {
          // Reset form fields and other states on cancel
          reset();
          setImagePreview(null); // Clear image preview
          setDetails([]); // Clear details array
        }}
      >
        <FormControl mt={4}>
          <FormLabel>Product Name</FormLabel>
          <Input
            {...register("productName", { required: "Product name is required!" })}
            placeholder="Enter name"
          />
          {/* Display error message if validation fails */}
          {errors.productName && <Text color="red.500">{errors.productName.message}</Text>}
        </FormControl>

        <FormControl mt={4}>
          <FormLabel>Price</FormLabel>
          <Input
            {...register("productPrice", {
              required: "Price is required!",
              valueAsNumber: true,
              min: {
                value: 0.01,
                message: "Price must be greater than 0"
              }
            })}
            type="number"
            placeholder="Enter price"
          />
          {/* Display error message if validation fails */}
          {errors.productPrice && <Text color="red.500">{errors.productPrice.message}</Text>}
        </FormControl>

        <FormControl mt={4}>
          <FormLabel>Product Image</FormLabel>
          {imagePreview && <Text mb={2}>Image Name: {imagePreview.split('/').pop()}</Text>}
          <Input type="file" accept="image/*" onChange={handleImageChange} />
        </FormControl>

        <FormControl mt={4}>
          <FormLabel>Select Product and Quantity</FormLabel>
          <Select
            placeholder="Select a product"
            {...register("productId", { required: "Please select a product" })}
          >
            {products.map((product) => (
              <option key={product.productId} value={product.productId}>
                {product.productName}
              </option>
            ))}
          </Select>
          {errors.productId && <Text color="red.500">{errors.productId.message}</Text>}
          
          <FormControl mt={2}>
            <FormLabel>Quantity</FormLabel>
            <Input
              type="number"
              {...register("productQuantity", {
                required: "Quantity is required!",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "Quantity must be greater than 1"
                }
              })}
              defaultValue={1}
              min={1}
              placeholder="Enter quantity"
            />
            {/* Display error message if validation fails */}
            {errors.productQuantity && <Text color="red.500">{errors.productQuantity.message}</Text>}
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
          <Button onClick={onClose} type="reset">Cancel</Button>
        </ModalFooter>
      </form>
    </ModalBody>
  </ModalContent>
</Modal>

    </Box>
  );
};

export default ManageProducts;
