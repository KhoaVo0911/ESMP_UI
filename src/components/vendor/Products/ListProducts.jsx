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
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid'; // Import uuid
import { Option } from "antd/es/mentions";

const ProductList = ({ }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("name");
  const accessToken = location.state?.accessToken || ""; // Kiểm tra nếu accessToken tồn tại
  const vendorId = location.state?.vendorId || ""; 

  // Fetch data from API with Authorization token
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/product", // API endpoint đã cập nhật
        {
          headers: {
            Authorization: `${accessToken}`, // Thêm Authorization header
            "Content-Type": "application/json",
          },
        }
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

  // Function to format date
  const formatDate = (date) => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString("vi-VN");
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
  
      const payload = {
        ...values,
        categoryId: editingProduct ? editingProduct.categoryId : uuidv4(),
        status: true,
      };
  
      if (editingProduct) {
        // Cập nhật sản phẩm
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
      } else {
        // Tạo sản phẩm mới
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
      }
  
      // Sau khi lưu thành công, gọi lại API để đồng bộ hóa dữ liệu
      await fetchData();  // Gọi lại hàm fetchData để tải lại danh sách sản phẩm
  
      message.success("Sản phẩm đã được lưu!");
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Đã xảy ra lỗi!");
    }
  };
  
  
  // Delete product
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/product/${vendorId}/${id}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log('Delete response:', response.data);
  
      if (response.status === 200) {
        // Sau khi xóa thành công, gọi lại API để tải lại danh sách sản phẩm
        await fetchData();
        message.success("Sản phẩm đã được xóa!");
      } else {
        message.error("Không thể xóa sản phẩm!");
      }
    } catch (error) {
      console.error('Delete error:', error.response?.data || error.message);
      message.error("Đã xảy ra lỗi khi xóa sản phẩm!");
    }
  };
  
  
  // Search for products
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = data.filter((item) =>
      item.productName.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  // Sort products
  const handleSort = (value) => {
    setSortOrder(value);
    const sorted = [...filteredData].sort((a, b) => {
      if (value === "name") {
        return a.productName.localeCompare(b.productName);
      } else if (value === "quantity") {
        return a.quantity - b.quantity;
      } else {
        return a.count - b.count;
      }
    });
    setFilteredData(sorted);
  };

  // Table columns configuration
  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      render: (text) => (
        <HStack>
          <Text>{text}</Text>
        </HStack>
      ),
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
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "Create Date",
      dataIndex: "createAt",
      key: "createAt",
      render: (date) => <Text>{formatDate(date)}</Text>,
    },
    {
      title: "Update Date",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => <Text>{formatDate(date)}</Text>,
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
            onClick={() => handleDelete(record.productId)}
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
              <Option value="count">Sort by Count</Option>
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
          rowKey="productId"
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
            name="productName"
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
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="count"
            label="Count"
            rules={[{ required: true, message: "Please input the count!" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </Box>
  );
};

export default ProductList;
