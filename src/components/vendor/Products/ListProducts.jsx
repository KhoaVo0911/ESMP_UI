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
import { Delete, Edit } from "@mui/icons-material";
import { SearchOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";

const { Option } = Select;

const ProductList = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]); // Danh sách Category
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

  // Fetch data từ API Product và Category
  const fetchData = async () => {
    setLoading(true);
    try {
      const productResponse = await axios.get(
        "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/product",
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

  // Show modal để tạo hoặc chỉnh sửa sản phẩm
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

  // Save sản phẩm mới hoặc cập nhật sản phẩm
 // Save sản phẩm mới hoặc cập nhật sản phẩm
const handleSave = async () => {
  try {
    const values = await form.validateFields();
    const payload = {
      ...values,
      categoryId: values.categoryId, // Đảm bảo categoryId được lấy từ form
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
      message.success("Sản phẩm đã được cập nhật!");
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
      message.success("Sản phẩm mới đã được thêm!");
    }

    // Gọi lại fetchData để làm mới danh sách sản phẩm
    fetchData();
    setIsModalOpen(false);
    form.resetFields();
  } catch (error) {
    message.error("Đã xảy ra lỗi!");
  }
};

  
  // Delete sản phẩm
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
      item.productName.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  // Sort products
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

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Đếm",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createAt",
      key: "createAt",
      render: (date) => <Text>{formatDate(date)}</Text>,
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => <Text>{formatDate(date)}</Text>,
    },
    {
      title: "Danh mục",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (categoryId) => {
        const category = categories.find((cat) => cat.categoryId === categoryId);
        return category ? category.categoryName : "Không xác định";
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (record) => (
        <HStack spacing={2}>
          <IconButton
            aria-label="Sửa"
            icon={<Edit />}
            colorScheme="blue"
            size="sm"
            onClick={() => showModal(record)}
          />
          <IconButton
            aria-label="Xóa"
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
          Danh Sách Sản Phẩm
        </Text>

        <Box display="flex" justifyContent="space-between" width="100%">
          <HStack>
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={handleSearch}
              prefix={<SearchOutlined />}
              style={{ width: "300px" }}
            />
          </HStack>
          <HStack>
            <Select
              defaultValue="quantity"
              style={{ width: 150 }}
              onChange={handleSort}
            >
              <Option value="quantity">Sắp xếp theo Số lượng</Option>
              <Option value="count">Sắp xếp theo Đếm</Option>
            </Select>
            <AntdButton
              type="primary"
              style={{ backgroundColor: "#3f51b5" }}
              onClick={() => showModal()}
            >
              + Thêm sản phẩm mới
            </AntdButton>
          </HStack>
        </Box>

        {/* Container cho bảng với chiều cao cố định và cuộn */}
        <Box
          width="100%"
          maxHeight="400px"
          overflowY="auto"
          border="1px solid #e0e0e0"
          borderRadius="md"
        >
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={false}
            bordered
            rowKey="productId"
            loading={loading}
          />
        </Box>
      </VStack>

      {/* Modal để tạo/chỉnh sửa sản phẩm */}
      <Modal
        title={editingProduct ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm mới"}
        visible={isModalOpen}
        onCancel={handleCancel}
        onOk={handleSave}
        okText={editingProduct ? "Cập nhật" : "Tạo mới"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="productName"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="count"
            label="Đếm"
            rules={[{ required: true, message: "Vui lòng nhập số đếm!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="Danh mục"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
          >
            <Select placeholder="Chọn danh mục">
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
