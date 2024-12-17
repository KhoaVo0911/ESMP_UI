import React, { useState, useEffect, useRef } from "react";
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
import { Box, HStack, Text, VStack, IconButton, Flex } from "@chakra-ui/react";
import {
  DeleteOutline,
  EditOutlined,
  CloudUploadOutlined,
} from "@mui/icons-material";
import { SearchOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import * as XLSX from "xlsx";

const { Option } = Select;

const ProductList = () => {
  const [data, setData] = useState([]); // Toàn bộ dữ liệu
  const [filteredData, setFilteredData] = useState([]); // Dữ liệu sau khi search hoặc sort
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("name");
  const fileInputRef = useRef(null);

  const accessToken = sessionStorage.getItem("accessToken") || "";
  const vendorId = sessionStorage.getItem("vendorId") || "";
  const hostId = sessionStorage.getItem("hostId") || "";

  // Fetch toàn bộ dữ liệu từ API
  const fetchData = async () => {
    setLoading(true);
    try {
      const productResponse = await axios.get(
        `https://esmpbe.id.vn/api/product/${vendorId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setData(productResponse.data);
      setFilteredData(productResponse.data);

      // Fetch categories and filter by status = true
      const categoryResponse = await axios.get(
        `https://esmpbe.id.vn/api/category/host/${hostId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Filter categories where status is true
      const filteredCategories = categoryResponse.data.filter(
        (category) => category.status === true
      );
      setCategories(filteredCategories);
    } catch (error) {
      // message.error("Error fetching data from API!");
    } finally {
      setLoading(false);
    }
  };

  // Đọc file Excel và xử lý dữ liệu
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const validProducts = [];
      const invalidProducts = [];

      jsonData.forEach((product) => {
        // So khớp categoryname từ Excel với categories từ API
        const matchedCategory = categories.find(
          (cat) =>
            cat.categoryName.toLowerCase().trim() ===
            product.categoryname?.toLowerCase().trim()
        );

        if (matchedCategory) {
          validProducts.push({
            ...product,
            categoryId: matchedCategory.categoryId, // Gán categoryId hợp lệ
          });
        } else {
          invalidProducts.push(product); // Thêm vào danh sách không hợp lệ
        }
      });

      // Hiển thị các sản phẩm không hợp lệ
      if (invalidProducts.length > 0) {
        message.warning(
          `${invalidProducts.length} product has an invalid categoryName and has been ignored.`
        );
        console.table(invalidProducts);
      }

      // Chỉ upload các sản phẩm hợp lệ
      if (validProducts.length > 0) {
        uploadProducts(validProducts);
      } else {
        message.error("No valid products to upload!");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Gửi dữ liệu lên API import Excel
  const uploadProducts = async (products) => {
    try {
      for (const product of products) {
        await axios.post(
          `https://esmpbe.id.vn/api/product/excel/${vendorId}/${hostId}`,
          product,
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(`Product uploaded: ${product.productName}`);
      }
      message.success("All products imported successfully!");
      fetchData(); // Reload dữ liệu sau khi hoàn thành
    } catch (error) {
      console.error("Error importing products:", error);
      message.error("Failed to import some products!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Kiểm tra trước khi upload
  const checkCategoriesBeforeUpload = () => {
    if (categories.length === 0) {
      message.error("Categories not loaded yet. Please try again later.");
      return false;
    }
    return true;
  };

  const triggerFileInput = () => {
    if (checkCategoriesBeforeUpload()) {
      fileInputRef.current.click();
    }
  };

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

      // Chuẩn bị payload
      const payload = {
        ...values,
        categoryId: values.categoryId,
        status: true,
        quantity: Number(values.quantity), // Ensure quantity is a number
      };

      // Nếu là tạo mới, thêm count = 0
      if (!editingProduct) {
        payload.count = 0; // count mặc định là 0 khi POST
      } else {
        // Nếu là cập nhật, lấy count từ DB và thêm vào payload
        payload.count = editingProduct.count; // Đặt count từ editingProduct vào payload
      }

      if (editingProduct) {
        // Cập nhật sản phẩm (PUT)
        await axios.put(
          `https://esmpbe.id.vn/api/product/${vendorId}/${editingProduct.productId}`,
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
        // Tạo mới sản phẩm (POST)
        await axios.post(
          `https://esmpbe.id.vn/api/product/${vendorId}`,
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

      fetchData(); // Lấy lại dữ liệu sau khi thêm/sửa
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Error saving product:", error);
      message.error("An error occurred!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://esmpbe.id.vn/api/product/${vendorId}/${id}`, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      fetchData();
      message.success("Product deleted successfully!");
    } catch (error) {
      message.error(
        "The product has been added to the product item and cannot be deleted!"
      );
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

  // const handleSort = (value) => {
  //   setSortOrder(value);
  //   const sorted = [...filteredData].sort((a, b) => {
  //     if (value === "quantity") {
  //       return a.quantity - b.quantity;
  //     } else {
  //       return a.count - b.count;
  //     }
  //   });
  //   setFilteredData(sorted);
  // };

  const handleSort = (value) => {
    setSortOrder(value);

    const sorted = [...filteredData].sort((a, b) => {
      if (value === "quantity") {
        return a.quantity - b.quantity;
      } else if (value === "count") {
        return a.count - b.count;
      } else if (value === "category") {
        // Sắp xếp theo tên category
        const categoryA =
          categories.find((cat) => cat.categoryId === a.categoryId)
            ?.categoryName || "";
        const categoryB =
          categories.find((cat) => cat.categoryId === b.categoryId)
            ?.categoryName || "";

        return categoryA.localeCompare(categoryB);
      } else {
        return 0;
      }
    });

    setFilteredData(sorted);
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      render: (text) => (
        <Text color="blue.700" fontWeight="bold">
          {text}
        </Text>
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
        const category = categories.find(
          (cat) => cat.categoryId === categoryId
        );
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
      <VStack width="100%" spacing={5}>
        {/* Title */}
        <Text fontSize="3xl" fontWeight="bold" color="purple.700">
          Product Management
        </Text>

        {/* Toolbar: Search, Sort, Import, Add */}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          padding={3}
          border="1px solid #e0e0e0"
          borderRadius="md"
          boxShadow="sm"
          bg="white"
        >
          {/* Search and Sort */}
          <HStack spacing={4}>
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              prefix={<SearchOutlined />}
              style={{ width: "250px" }}
            />
            <Select
              defaultValue="quantity"
              style={{ width: "200px" }}
              onChange={handleSort}
            >
              <Option value="quantity">Sort by Quantity</Option>
              <Option value="count">Sort by Count</Option>
              <Option value="category">Sort by Category</Option>
            </Select>
          </HStack>

          {/* Actions */}
          <HStack spacing={3}>
            <AntdButton
              type="default"
              icon={<CloudUploadOutlined />}
              onClick={triggerFileInput}
            >
              Import Excel
            </AntdButton>
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx, .xls"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
            <AntdButton
              type="primary"
              style={{ backgroundColor: "#6a1b9a", borderColor: "#6a1b9a" }}
              onClick={() => showModal()}
            >
              + Add New Product
            </AntdButton>
          </HStack>
        </Flex>

        {/* Allowed Categories */}
        <Box
          width="100%"
          padding={4}
          borderRadius="md"
          boxShadow="sm"
          bg="gray.50"
          border="1px solid #e0e0e0"
        >
          <Text fontWeight="bold" fontSize="lg" marginBottom={3}>
            Allowed Categories:
          </Text>
          <HStack wrap="wrap" spacing={3}>
            {categories.map((category) => (
              <Box
                key={category.categoryId}
                padding="5px 10px"
                borderRadius="full"
                backgroundColor="purple.100"
                color="purple.800"
                fontWeight="medium"
                boxShadow="sm"
              >
                {category.categoryName}
              </Box>
            ))}
          </HStack>
        </Box>

        {/* Product Table */}
        <Box
          width="100%"
          border="1px solid #e0e0e0"
          borderRadius="md"
          boxShadow="lg"
          bg="white"
        >
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 10 }}
            rowKey="productId"
            loading={loading}
            scroll={{ y: 400 }}
          />
        </Box>
      </VStack>

      {/* Modal */}
      <Modal
        title={editingProduct ? "Edit Product" : "Create New Product"}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleSave}
        okText={editingProduct ? "Update" : "Create"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="productName"
            label="Product Name"
            rules={[
              { required: true, message: "Please enter the product name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[
              { required: true, message: "Please enter the quantity!" },
              {
                validator: (_, value) =>
                  value >= 1
                    ? Promise.resolve()
                    : Promise.reject("Quantity must be >= 1"),
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter the description!" },
            ]}
          >
            <Input />
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
