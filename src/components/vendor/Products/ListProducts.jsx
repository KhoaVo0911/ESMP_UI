import React, { useState } from "react";
import { Table, Modal, Input, Form, Button as AntdButton, message } from "antd";
import { Button, Box, HStack, Text } from "@chakra-ui/react";
import { Delete, Edit } from "@mui/icons-material";

const ProductList = () => {
  const [data, setData] = useState([
    { key: "1", name: "Sushi", quantity: 111, price: "10.000 VND" },
    { key: "2", name: "Pizza", quantity: 222, price: "20.000 VND" },
    { key: "3", name: "Burger", quantity: 333, price: "30.000 VND" },
    { key: "4", name: "Bánh mì", quantity: 123, price: "15.000 VND" },
    { key: "5", name: "Cơm tấm", quantity: 100, price: "25.000 VND" },
    { key: "6", name: "Phở", quantity: 50, price: "35.000 VND" },
    { key: "7", name: "Bún bò Huế", quantity: 20, price: "45.000 VND" },
    { key: "8", name: "Bún đậu mắm tôm", quantity: 11, price: "40.000 VND" },
    { key: "9", name: "Bún riêu", quantity: 10, price: "50.000 VND" },
    { key: "10", name: "Gà rán", quantity: 100, price: "60.000 VND" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // Mở modal để tạo/sửa sản phẩm
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
    form
      .validateFields()
      .then((values) => {
        if (editingProduct) {
          // Sửa sản phẩm
          setData(
            data.map((item) =>
              item.key === editingProduct.key ? { ...item, ...values } : item
            )
          );
          message.success("Sản phẩm đã được cập nhật!");
        } else {
          // Tạo sản phẩm mới
          const newProduct = {
            ...values,
            key: Date.now().toString(),
            price: `${values.price} VND`,
          };
          setData([...data, newProduct]);
          message.success("Sản phẩm mới đã được thêm!");
        }
        setIsModalOpen(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  // Xóa sản phẩm
  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
    message.success("Sản phẩm đã được xóa!");
  };

  // Cấu hình cột của bảng
  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <HStack>
          <Text>{text}</Text>
        </HStack>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <HStack spacing={2}>
          <Button
            colorScheme="blue"
            size="sm"
            leftIcon={<Edit />}
            onClick={() => showModal(record)}
          >
            Edit
          </Button>
          <Button
            colorScheme="red"
            size="sm"
            leftIcon={<Delete />}
            onClick={() => handleDelete(record.key)}
          >
            Delete
          </Button>
        </HStack>
      ),
    },
  ];

  return (
    <Box padding={5} display="flex" justifyContent="center">
      <Box width="80%">
        <HStack justifyContent="space-between" marginBottom={4}>
          <Text fontSize="2xl" fontWeight="bold">
            Products
          </Text>
          <AntdButton
            type="primary"
            style={{ backgroundColor: "#3f51b5" }}
            onClick={() => showModal()}
          >
            + CREATE PRODUCTS
          </AntdButton>
        </HStack>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
          rowKey="key"
          style={{ textAlign: "center" }}
        />

        {/* Modal tạo/sửa sản phẩm */}
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
              name="quantity"
              label="Quantity"
              rules={[
                { required: true, message: "Please input the quantity!" },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="price"
              label="Price (VND)"
              rules={[{ required: true, message: "Please input the price!" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Box>
    </Box>
  );
};

export default ProductList;
