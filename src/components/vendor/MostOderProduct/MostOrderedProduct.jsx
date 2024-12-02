import React, { useState, useEffect } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react"; // Import thêm các component liên quan đến table
import Pizza from "../../../assets/images/Pizza.png";
import axios from "axios";

const MostOrderedProduct = () => {
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]); // For top 5 products

  const vendorId = sessionStorage.getItem("vendorId");

  // Fetch the products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`https://esmpbe.id.vn/api/product/${vendorId}`);
        const productData = response.data;

        // Sort products by the 'count' field in descending order
        const sortedProducts = productData.sort((a, b) => b.count - a.count);

        // Get the top 5 products
        const top5Products = sortedProducts.slice(0, 5);

        // Set the top 5 products
        setTopProducts(top5Products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (vendorId) {
      fetchProducts();
    }
  }, [vendorId]);

  return (
    <Box>
      <Text
        fontSize="22px"
        fontWeight="700"
        mb={4}
        color="var(--chakra-colors-secondaryGray-900)"
      >
        Most Ordered Products
      </Text>

      {/* Display the top 5 most ordered products */}
      <Table variant="simple" color="gray.500" mb="24px" mt="12px">
        <Thead>
          <Tr>
            <Th color="gray.400" textAlign="left">
              Product
            </Th>
            <Th color="gray.400" textAlign="right">
              Orders
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {topProducts.map((product, index) => (
            <Tr key={index}>
              <Td>
                <Flex align="center">
                  {/* <Image
                    src={Pizza}
                    alt={product.productName}
                    boxSize="40px"
                    mr={4}
                  /> */}
                  <Text fontSize="14px" fontWeight="700" color="#1B2559">
                    {product.productName}
                  </Text>
                </Flex>
              </Td>
              <Td textAlign="right">
                <Text fontSize="14px" fontWeight="700" color="#1B2559">
                  {product.count} times
                </Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default MostOrderedProduct;
