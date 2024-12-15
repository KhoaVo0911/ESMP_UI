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
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const toast = useToast();
  const accessToken = sessionStorage.getItem("accessToken") || "";
  const vendorId = sessionStorage.getItem("vendorId") || "";
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Reset modal and state
  const resetForm = () => {
    setDetails([]);
    reset();
    setImageFile(null);
    setImagePreview("");
    setEditingProductItem(null);
    onClose();
  };

  // Handle opening for adding a new product
  const handleAddNewProduct = () => {
    resetForm();
    setValue("productName", "");
    setValue("productPrice", "");
    onOpen();
  };

  // Handle opening for editing a product
  const handleEdit = (productItem) => {
    setEditingProductItem(productItem);
    setValue("productName", productItem.name);
    setValue("productPrice", productItem.price);
    setDetails(productItem.details);
    setImagePreview(productItem.imageURL);
    onOpen();
  };

  // Fetch data for products and product items
  const fetchData = async () => {
    try {
      const response = await axios.get(`https://esmpbe.id.vn/api/product/${vendorId}`, {
        headers: { Authorization: `${accessToken}`, "Content-Type": "application/json" },
      });
      setProducts(response.data);
    } catch (error) {
      
    }
  };

  const fetchProductItems = async () => {
    try {
        const response = await axios.get(`https://esmpbe.id.vn/api/productitem/${vendorId}`, {
            headers: { Authorization: `${accessToken}`, "Content-Type": "application/json" },
        });

        const itemsWithImages = await Promise.all(
            response.data
                .filter((item) => item.status === true) // Only items with status: true
                .map(async (item) => {
                    const imageURL = await fetchImageURL(item.productItemId);
                    return { ...item, imageURL };
                })
        );

        setProductItems(itemsWithImages);
    } catch (error) {
       
    }
};
const handleDelete = async (productItemId) => {
  try {
      await axios.delete(`https://esmpbe.id.vn/api/productitem/${productItemId}`, {
          headers: { Authorization: `${accessToken}`, "Content-Type": "application/json" },
      });
      setProductItems((prevItems) => prevItems.filter((item) => item.productItemId !== productItemId));
      toast({
          title: "Success",
          description: "Product deleted successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
      });
  } catch (error) {
      toast({
          title: "Error",
          description: "Failed to delete product.",
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

  const fetchImageURL = async (productItemId) => {
    try {
      const imageRef = ref(storage, `${vendorId}/${productItemId}`);
      return await getDownloadURL(imageRef);
    } catch (error) {
      return "https://via.placeholder.com/150";
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const addProductToDetails = (selectedProductId, selectedQuantity) => {
    const quantity = Math.max(1, selectedQuantity);
    const selectedProduct = products.find((p) => p.productId === selectedProductId);
  
    if (selectedProduct) {
      const existingDetail = details.find((d) => d.productId === selectedProduct.productId);
  
      // Reset tên sản phẩm một lần duy nhất nếu danh sách hiện tại trống
      if (details.length === 0) {
        setValue("productName", selectedProduct.productName);
      } else if (details.length === 1) {
        // Nếu đã có một sản phẩm, xóa trường Product Name
        setValue("productName", "");
      }
  
      if (!existingDetail) {
        setDetails([...details, { productId: selectedProduct.productId, quantity, unit: "" }]);
      } else {
        setDetails((prevDetails) =>
          prevDetails.map((d) =>
            d.productId === selectedProduct.productId
              ? { ...d, quantity: d.quantity + quantity }
              : d
          )
        );
      }
    }
  };
  

  const removeProductFromDetails = (productId) => {
    setDetails(details.filter((d) => d.productId !== productId));
  };

  const uploadImage = async (productItemId) => {
    if (!imageFile) return editingProductItem?.imageURL || null;
    const imageRef = ref(storage, `${vendorId}/${productItemId}`);
  
    try {
      await deleteObject(imageRef); // Xóa ảnh cũ nếu tồn tại
    } catch (error) {
      console.error("Error deleting previous image:", error);
    }
  
    await uploadBytes(imageRef, imageFile);
    const newImageURL = await getDownloadURL(imageRef); // URL ảnh mới
    setImagePreview(newImageURL); // Cập nhật preview ngay sau khi tải lên
    return newImageURL;
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
      name: data.productName,
      description: data.description || "Product item description",
      details,
      price: data.productPrice,
    };
  
    try {
      const newProductItemId = editingProductItem
        ? editingProductItem.productItemId
        : (
            await axios.post(`https://esmpbe.id.vn/api/productitem/${vendorId}`, productItemData, {
              headers: { Authorization: `${accessToken}`, "Content-Type": "application/json" },
            })
          ).data.id;
  
      // Xử lý imageURL nhưng không thêm vào updatedProductItem
      const imageURL = imageFile
        ? await uploadImage(newProductItemId)
        : editingProductItem?.imageURL || "https://via.placeholder.com/150";
  
      if (editingProductItem) {
        await axios.put(
          `https://esmpbe.id.vn/api/productitem/${vendorId}/${newProductItemId}`,
          productItemData, // Không bao gồm imageURL
          {
            headers: { Authorization: `${accessToken}`, "Content-Type": "application/json" },
          }
        );
        setProductItems((prevItems) =>
          prevItems.map((item) =>
            item.productItemId === editingProductItem.productItemId
              ? { ...item, ...productItemData, imageURL } // Thêm imageURL trực tiếp vào state
              : item
          )
        );
      } else {
        setProductItems((prevItems) => [
          ...prevItems,
          { ...productItemData, imageURL }, // Thêm imageURL khi tạo mới
        ]);
      }
  
      toast({
        title: "Success",
        description: editingProductItem ? "Product updated successfully!" : "Product added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  

  return (
    <Box p={5}>
      <Button colorScheme="blue" onClick={handleAddNewProduct}>
        Add New Product
      </Button>

      <Grid
  templateColumns="repeat(auto-fit, minmax(250px,250px))" // Compact card width
  gap={4} // Small gaps for compactness
  mt={6} // Adjust margin for better spacing
>
  {productItems.map((productItem) => (
    <GridItem
      key={productItem.productItemId}
      border="1px solid #e0e0e0"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="sm"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="350px" // Compact card height
      _hover={{ boxShadow: "md", transform: "scale(1.05)" }}
      transition="all 0.2s ease-in-out"
    >
      {/* Product Image */}
      <Image
        src={productItem.imageURL || "https://via.placeholder.com/150"}
        alt={productItem.name}
        objectFit="cover"
        width="100%"
        height="120px" // Smaller image for compact design
      />

      {/* Product Details */}
      <Box p={3} flex="1">
        <Text fontWeight="semibold" fontSize="md" color="blue.600">
          {productItem.name}
        </Text>
        <Text color="gray.500" fontSize="sm" mb={2}>
          {productItem.price} VND
        </Text>
        <Box>
          <Text color="gray.400" fontSize="sm">Details:</Text>
          {productItem.details.map((detail, index) => (
            <Text key={index} fontSize="xs">
              - {products.find((p) => p.productId === detail.productId)?.productName || "Unknown"} x{" "}
              {detail.quantity}
            </Text>
          ))}
        </Box>
      </Box>

      {/* Action Buttons */}
      <Flex p={3} justifyContent="space-between">
        <Button
          leftIcon={<FaEdit />}
          size="sm" // Compact button size
          colorScheme="teal"
          variant="outline"
          onClick={() => handleEdit(productItem)}
        >
          Edit
        </Button>
        <Button
          leftIcon={<FaTrash />}
          size="sm" // Compact button size
          colorScheme="red"
          variant="outline"
          onClick={() => handleDelete(productItem.productItemId)}
        >
          Delete
        </Button>
      </Flex>
    </GridItem>
  ))}
</Grid>


      <Modal isOpen={isOpen} onClose={resetForm} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingProductItem ? "Edit Product" : "Add Product"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl mt={4}>
                <FormLabel>Product Name</FormLabel>
                <Input
                  {...register("productName", { required: "Product name is required!" })}
                  placeholder="Enter product name"
                />
                {errors.productName && <Text color="red.500">{errors.productName.message}</Text>}
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Price</FormLabel>
                <Input
                  {...register("productPrice", {
                    required: "Price is required!",
                    valueAsNumber: true,
                    min: { value: 0.01, message: "Price must be greater than 0" },
                  })}
                  type="number"
                  placeholder="Enter price"
                />
                {errors.productPrice && <Text color="red.500">{errors.productPrice.message}</Text>}
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Product Image</FormLabel>
                {imagePreview && (
                 <Box mb={2} display="flex" justifyContent="center" alignItems="center">
                 <Image
                   src={imagePreview}
                   alt="Product Image Preview"
                   boxSize="150px"
                   objectFit="cover"
                   borderRadius="md"
                   margin="10px"
                 />
               </Box>
               
                )}
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
                  <Input
                    type="number"
                    {...register("productQuantity", {
                      valueAsNumber: true,
                      min: { value: 1, message: "Quantity must be at least 1" },
                    })}
                    defaultValue={1}
                    placeholder="Enter quantity"
                  />
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
                            {products.find((p) => p.productId === detail.productId)?.productName || "Unknown"} x {detail.quantity}
                          </Text>
                          <IconButton
                            icon={<FaTrash />}
                            size="sm"
                            colorScheme="red"
                            onClick={() => removeProductFromDetails(detail.productId)}
                          />
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
                <Button onClick={resetForm} type="button">
                  Cancel
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ManageProducts;
