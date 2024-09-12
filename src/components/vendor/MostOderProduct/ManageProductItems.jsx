import React, { useState } from "react";
import {
  Card,
  Button as AntdButton,
  Modal,
  Input,
  Form,
  Badge,
  message,
} from "antd";
import { Box, Grid, Text, HStack, Flex, IconButton } from "@chakra-ui/react";
import { Edit, Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import Gimbap from "../../../assets/images/gimbap.png";

const { Meta } = Card;

const ManageProductItems = () => {
  const [products, setProducts] = useState([
    {
      id: "1",
      name: "Sushi",
      price: "40.000 VND",
      quantity: 10,
      image: Gimbap,
    },
    { id: "2", name: "Sushi", price: "40.000 VND", quantity: 5, image: Gimbap },
    { id: "3", name: "Sushi", price: "40.000 VND", quantity: 7, image: Gimbap },
    { id: "4", name: "Sushi", price: "40.000 VND", quantity: 3, image: Gimbap },
    {
      id: "5",
      name: "Sushi",
      price: "40.000 VND",
      quantity: 15,
      image: Gimbap,
    },
    {
      id: "6",
      name: "Sushi",
      price: "40.000 VND",
      quantity: 20,
      image: Gimbap,
    },
    { id: "7", name: "Sushi", price: "40.000 VND", quantity: 8, image: Gimbap },
    { id: "8", name: "Sushi", price: "40.000 VND", quantity: 6, image: Gimbap },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // Mở modal để thêm/sửa sản phẩm
  const showModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Lưu sản phẩm mới hoặc cập nhật sản phẩm
  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingProduct) {
        // Cập nhật sản phẩm
        setProducts(
          products.map((item) =>
            item.id === editingProduct.id ? { ...item, ...values } : item
          )
        );
        message.success("Product updated successfully!");
      } else {
        // Thêm sản phẩm mới
        const newProduct = {
          ...values,
          id: Date.now().toString(),
          image: Gimbap, // Hoặc có thể cho phép người dùng tải ảnh lên
        };
        setProducts([...products, newProduct]);
        message.success("Product added successfully!");
      }
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  // Xóa sản phẩm
  const handleDelete = (id) => {
    setProducts(products.filter((item) => item.id !== id));
    message.success("Product deleted successfully!");
  };

  return (
    <Box padding={5}>
      <HStack justifyContent="space-between" marginBottom={4}>
        <Text fontSize="2xl" fontWeight="bold">
          List Product
        </Text>
        <AntdButton
          type="primary"
          icon={<AddIcon />}
          style={{ backgroundColor: "#3f51b5" }}
          onClick={() => showModal()}
        >
          Create
        </AntdButton>
      </HStack>

      <Grid templateColumns="repeat(4, 1fr)" gap={8}>
        {products.map((product) => (
          <Box position="relative" key={product.id}>
            <Badge
              count={product.quantity}
              style={{
                backgroundColor: "#f5222d",
                position: "absolute",
                right: -260, // Di chuyển badge sang bên phải
                top: 0, // Đặt badge lên phía trên
                zIndex: 1, // Đảm bảo badge nằm trên các thành phần khác
              }}
            />
            <Card
              hoverable
              style={{ width: 250, position: "relative" }}
              cover={
                <img
                  alt={product.name}
                  src={product.image}
                  style={{ height: 200, objectFit: "cover" }}
                />
              }
            >
              <Flex justify="space-between" align="center" padding={3}>
                <IconButton
                  icon={<Edit fontSize="small" />}
                  onClick={() => showModal(product)}
                  variant="ghost"
                  colorScheme="gray"
                />
                <Box textAlign="center">
                  <Text fontSize="lg" fontWeight="bold">
                    {product.name}
                  </Text>
                  <Text color="gray.600">{product.price}</Text>
                </Box>
                <IconButton
                  icon={<Delete fontSize="small" />}
                  onClick={() => handleDelete(product.id)}
                  variant="ghost"
                  colorScheme="gray"
                />
              </Flex>
            </Card>
          </Box>
        ))}
      </Grid>

      {/* Modal thêm/sửa sản phẩm */}
      <Modal
        title={editingProduct ? "Edit Product" : "Create Product"}
        visible={isModalOpen}
        onCancel={handleCancel}
        onOk={handleSave}
        okText={editingProduct ? "Update" : "Create"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Product Name"
            rules={[
              { required: true, message: "Please input the product name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price (VND)"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please input the quantity!" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </Box>
  );
};

export default ManageProductItems;
