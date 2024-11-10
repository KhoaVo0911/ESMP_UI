import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ProductSample = ({}) => {
  const [products, setProductItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const accessToken = sessionStorage.getItem("accessToken") || ""; // Lấy accessToken từ sessionStorage
const vendorId = sessionStorage.getItem("vendorId") || ""; // Lấy vendorId từ sessionStorage
  const [error, setError] = useState("");
  const [newProduct, setNewProduct] = useState({
    productId: "",
    name: "",
    imageUrl: "",
    description: "",
    productOrigin: "",
    price: "",
    unit: "",
    outofstock: false,
    status: false,
  });
  const [editProduct, setEditProduct] = useState(null); // Lưu sản phẩm đang chỉnh sửa
  const { isOpen, onOpen, onClose } = useDisclosure(); // Hook cho popup modal
  const toast = useToast();



  // Lấy danh sách sản phẩm
  const fetchProducts = () => {
    setLoading(true);
    axios
      .get(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/productitem/${vendorId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const filteredItems = response.data.filter(
          (item) => item.vendorid === vendorId
        );
        setProductItems(filteredItems);
      })
      .catch(() => {
        setError("Failed to fetch product items.");
        toast({
          title: "Error",
          description: "Failed to fetch product items.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts(); // Fetch sản phẩm sau khi component mount
  }, []);

  // Tạo sản phẩm mới
  const handleCreateProduct = () => {
    const apiUrl = `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/productitem`;

    const productData = {
      productId: newProduct.productId,
      vendorid: vendorId,
      name: newProduct.name,
      imageUrl: newProduct.imageUrl,
      description: newProduct.description,
      productOrigin: newProduct.productOrigin,
      outofstock: newProduct.outofstock,
      price: newProduct.price,
      unit: newProduct.unit,
      createAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: newProduct.status || false,
    };

    axios
      .post(apiUrl, productData, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        fetchProducts(); // Lấy lại danh sách sản phẩm sau khi tạo mới
        toast({
          title: "Success",
          description: "Product created successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        setNewProduct({
          productId: "",
          name: "",
          description: "",
          price: "",
          unit: "",
          imageUrl: "",
          productOrigin: "",
          outofstock: false,
          status: false,
        });
      })
      .catch((err) => {
        console.error("Error creating product:", err);
        toast({
          title: "Error",
          description: "Failed to create product.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  // Cập nhật sản phẩm hiện tại
  const handleUpdateProduct = () => {
    if (!editProduct) return;

    const apiUrl = `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/productitem`;

    axios
      .put(apiUrl, { ...editProduct, vendorid: vendorId }, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        fetchProducts();
        toast({
          title: "Success",
          description: "Product updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        setEditProduct(null);
      })
      .catch((err) => {
        console.error("Error updating product:", err);
        toast({
          title: "Error",
          description: "Failed to update product.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  // Xóa sản phẩm
  const handleDelete = (productId) => {
    axios
      .delete(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/productitem/${productId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        fetchProducts();
        toast({
          title: "Success",
          description: "Product deleted successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.log("Delete error details:", err);
        setError("Failed to delete product.");
        toast({
          title: "Error",
          description: "Failed to delete product.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editProduct) {
      setEditProduct((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const openModal = (product = null) => {
    setEditProduct(product);
    onOpen();
  };

  if (loading) {
    return <Text>Loading products...</Text>;
  }

  if (error) {
    return <Text color="red.500">Error: {error}</Text>;
  }

  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Product List
      </Text>
      <Button colorScheme="blue" mb={4} onClick={() => openModal()}>
        Create New Product
      </Button>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Price</Th>
            <Th>Unit</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => (
            <Tr key={product.productItemId}>
              <Td>{product.name}</Td>
              <Td>{product.description}</Td>
              <Td>{product.price}</Td>
              <Td>{product.unit}</Td>
              <Td>
                <IconButton
                  icon={<EditIcon />}
                  colorScheme="yellow"
                  mr={2}
                  onClick={() => openModal(product)}
                />
                <IconButton
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  onClick={() => handleDelete(product.productItemId)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal để tạo mới/sửa sản phẩm */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editProduct ? "Edit Product" : "Create New Product"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="flex-start">
              <Input
                placeholder="Name"
                name="name"
                value={editProduct ? editProduct.name : newProduct.name}
                onChange={handleInputChange}
              />
              <Input
                placeholder="Image URL"
                name="imageUrl"
                value={editProduct ? editProduct.imageUrl : newProduct.imageUrl}
                onChange={handleInputChange}
              />
              <Input
                placeholder="Description"
                name="description"
                value={editProduct ? editProduct.description : newProduct.description}
                onChange={handleInputChange}
              />
              <Input
                placeholder="Price"
                type="number"
                name="price"
                value={editProduct ? editProduct.price : newProduct.price}
                onChange={handleInputChange}
              />
              <Input
                placeholder="Unit"
                name="unit"
                value={editProduct ? editProduct.unit : newProduct.unit}
                onChange={handleInputChange}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={editProduct ? handleUpdateProduct : handleCreateProduct}
            >
              {editProduct ? "Save Changes" : "Create Product"}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProductSample;
