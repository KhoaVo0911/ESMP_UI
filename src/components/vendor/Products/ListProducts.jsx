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
import {
  Box,
  HStack,
  Text,
  VStack,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { SearchOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";

const { Option } = Select;

const ProductList = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("name");
  const accessToken = sessionStorage.getItem("accessToken") || "";
  const vendorId = sessionStorage.getItem("vendorId") || "";
  const hostId = sessionStorage.getItem("hostId") || "";

  const fetchData = async () => {
    setLoading(true);
    try {
      const productResponse = await axios.get(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/product/${vendorId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setData(productResponse.data);
      setFilteredData(productResponse.data);

      const categoryResponse = await axios.get(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/category/hostId/${hostId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCategories(categoryResponse.data);
    } catch (error) {
      message.error("Error fetching data from API!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (date) => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString("en-US");
  };

  const showModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        categoryId: values.categoryId,
        status: true,
      };

      if (editingProduct) {
        await axios.put(
          `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/product/${vendorId}/${editingProduct.productId}`,
          payload,
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        message.success("Product updated successfully!");
      } else {
        await axios.post(
          `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/product/${vendorId}`,
          payload,
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        message.success("New product added successfully!");
      }

      fetchData();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("An error occurred!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/product/${vendorId}/${id}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setData(data.filter((item) => item.productId !== id));
      setFilteredData(filteredData.filter((item) => item.productId !== id));
      message.success("Product deleted successfully!");
    } catch (error) {
      message.error("Error occurred while deleting product!");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = data.filter((item) =>
      item.productName.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const handleSort = (value) => {
    setSortOrder(value);
    const sorted = [...filteredData].sort((a, b) => {
      if (value === "quantity") {
        return a.quantity - b.quantity;
      } else {
        return a.count - b.count;
      }
    });
    setFilteredData(sorted);
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      render: (text) => <Text color="blue.700" fontWeight="bold">{text}</Text>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text) => <Text fontWeight="medium">{text}</Text>,
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
      render: (text) => <Text fontWeight="medium">{text}</Text>,
    },
    {
      title: "Created At",
      dataIndex: "createAt",
      key: "createAt",
      render: (date) => <Text>{formatDate(date)}</Text>,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => <Text>{formatDate(date)}</Text>,
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (categoryId) => {
        const category = categories.find((cat) => cat.categoryId === categoryId);
        return category ? category.categoryName : "Undefined";
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <HStack spacing={2}>
          <IconButton
            aria-label="Edit"
            icon={<EditOutlined />}
            colorScheme="teal"
            size="sm"
            onClick={() => showModal(record)}
          />
          <IconButton
            aria-label="Delete"
            icon={<DeleteOutline />}
            colorScheme="red"
            size="sm"
            onClick={() => handleDelete(record.productId)}
          />
        </HStack>
      ),
    },
  ];

  return (
    <Box padding={5} display="flex" flexDirection="column" alignItems="center">
      <VStack width="90%" spacing={5}>
        <Text fontSize="2xl" fontWeight="bold" color="purple.600">
          Product List
        </Text>

        <Box display="flex" justifyContent="space-between" width="100%">
          <HStack>
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              prefix={<SearchOutlined />}
              style={{ width: "300px" }}
            />
          </HStack>
          <HStack>
            <Select
              defaultValue="quantity"
              style={{ width: 180 }}
              onChange={handleSort}
            >
              <Option value="quantity">Sort by Quantity</Option>
              <Option value="count">Sort by Count</Option>
            </Select>
            <AntdButton
              type="primary"
              style={{ backgroundColor: "#6a1b9a", borderColor: "#6a1b9a" }}
              onClick={() => showModal()}
            >
              + Add New Product
            </AntdButton>
          </HStack>
        </Box>

        <Box
          width="100%"
          maxHeight="500px"
          overflowY="auto"
          border="1px solid #e0e0e0"
          borderRadius="md"
          boxShadow="md"
        >
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={false}
            bordered
            rowKey="productId"
            loading={loading}
            style={{ padding: "10px" }}
          />
        </Box>
      </VStack>

      <Modal
        title={editingProduct ? "Edit Product" : "Create New Product"}
        visible={isModalOpen}
        onCancel={handleCancel}
        onOk={handleSave}
        okText={editingProduct ? "Update" : "Create"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="productName"
            label="Product Name"
            rules={[{ required: true, message: "Please enter the product name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please enter the quantity!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter the description!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="count"
            label="Count"
            rules={[{ required: true, message: "Please enter the count!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select placeholder="Select category">
              {categories.map((category) => (
                <Option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Box>
  );
};

export default ProductList;
