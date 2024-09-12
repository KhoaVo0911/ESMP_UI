import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react"; // Import thêm các component liên quan đến table
import Pizza from "../../../assets/images/Pizza.png";
const MostOrderedProduct = () => {
  const products = [
    { name: "Fresh Salad Bowl", orders: 53 },
    { name: "Chicken Noodles", orders: 44 },
    { name: "Smoothie Fruits", orders: 43 },
    { name: "Hot Chicken Wings", orders: 13 },
  ];

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
          {products.map((product, index) => (
            <Tr key={index}>
              <Td>
                <Flex align="center">
                  <Image src={Pizza} alt={product.name} boxSize="40px" mr={4} />
                  <Text fontSize="14px" fontWeight="700" color="#1B2559">
                    {product.name}
                  </Text>
                </Flex>
              </Td>
              <Td textAlign="right">
                <Text fontSize="14px" fontWeight="700" color="#1B2559">
                  {product.orders} times
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
