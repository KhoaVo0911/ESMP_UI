import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Modal,
  Input,
  Form,
  Button as AntdButton,
  Select,
  message,
} from "antd";
import { Box, HStack, Text, VStack, IconButton } from "@chakra-ui/react";
import { Delete, Edit } from "@mui/icons-material";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

const ProductList = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("name");

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://668e540abf9912d4c92dcd67.mockapi.io/products"
      );
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      message.error("Lỗi khi lấy dữ liệu từ API!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to format price as VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Show modal to create/edit product
  const showModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Close modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Save new or updated product
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      values.price = parseFloat(values.price.replace(/,/g, "")); // Ensure price is a number

      if (editingProduct) {
        // Update product
        await axios.put(
          `https://668e540abf9912d4c92dcd67.mockapi.io/products/${editingProduct.id}`,
          values
        );
        setData(
          data.map((item) =>
            item.id === editingProduct.id ? { ...item, ...values } : item
          )
        );
        setFilteredData(
          filteredData.map((item) =>
            item.id === editingProduct.id ? { ...item, ...values } : item
          )
        );
        message.success("Sản phẩm đã được cập nhật!");
      } else {
        // Create new product
        const response = await axios.post(
          "https://668e540abf9912d4c92dcd67.mockapi.io/products",
          values
        );
        setData([...data, response.data]);
        setFilteredData([...filteredData, response.data]);
        message.success("Sản phẩm mới đã được thêm!");
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Đã xảy ra lỗi!");
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://668e540abf9912d4c92dcd67.mockapi.io/products/${id}`
      );
      setData(data.filter((item) => item.id !== id));
      setFilteredData(filteredData.filter((item) => item.id !== id));
      message.success("Sản phẩm đã được xóa!");
    } catch (error) {
      message.error("Đã xảy ra lỗi khi xóa sản phẩm!");
    }
  };

  // Search for products
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  // Sort products
  const handleSort = (value) => {
    setSortOrder(value);
    const sorted = [...filteredData].sort((a, b) => {
      if (value === "name") {
        return a.name.localeCompare(b.name);
      } else if (value === "quantity") {
        return a.quantity - b.quantity;
      } else {
        return (
          parseFloat(a.price.replace(/\./g, "")) -
          parseFloat(b.price.replace(/\./g, ""))
        );
      }
    });
    setFilteredData(sorted);
  };

  // Table columns configuration
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
      render: (price) => <Text>{formatPrice(price)}</Text>, // Format price as VND
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <HStack spacing={2}>
          <IconButton
            aria-label="Edit"
            icon={<Edit />}
            colorScheme="blue"
            size="sm"
            onClick={() => showModal(record)}
          />
          <IconButton
            aria-label="Delete"
            icon={<Delete />}
            colorScheme="red"
            size="sm"
            onClick={() => handleDelete(record.id)}
          />
        </HStack>
      ),
    },
  ];

  return (
    <Box padding={5} display="flex" flexDirection="column" alignItems="center">
      <VStack width="80%" spacing={5}>
        <Text fontSize="2xl" fontWeight="bold">
          List of Products
        </Text>

        <Box display="flex" justifyContent="space-between" width="100%">
          <HStack>
            <Input
              placeholder="Search a product..."
              value={searchTerm}
              onChange={handleSearch}
              prefix={<SearchOutlined />}
              style={{ width: "300px" }}
            />
          </HStack>
          <HStack>
            <Select
              defaultValue="name"
              style={{ width: 120 }}
              onChange={handleSort}
            >
              <Option value="name">Sort by Name</Option>
              <Option value="quantity">Sort by Quantity</Option>
              <Option value="price">Sort by Price</Option>
            </Select>
            <AntdButton
              type="primary"
              style={{ backgroundColor: "#3f51b5" }}
              onClick={() => showModal()}
            >
              + Add new product
            </AntdButton>
          </HStack>
        </Box>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{
            pageSize: 10, // Show a maximum of 10 products per page
          }}
          bordered
          rowKey="id"
          style={{ textAlign: "center", marginTop: "20px", width: "100%" }}
          loading={loading}
        />
      </VStack>

      {/* Modal to create/edit product */}
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
            rules={[{ required: true, message: "Please input the quantity!" }]}
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
  );
};

export default ProductList;
