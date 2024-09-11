import React from "react";
import {
  Box,
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

const StatisticsNumbers = () => {
  const statistics = [
    { label: "Vendors", count: 24, color: "#4caf50" },
    { label: "Events", count: 18, color: "#ff9800" },
    { label: "Orders", count: 120, color: "#f44336" },
    { label: "Products", count: 32, color: "#9c27b0" },
  ];

  return (
    <Box>
      <Text
        mb={4}
        fontSize="22px"
        fontWeight="700"
        color="var(--chakra-colors-secondaryGray-900)"
      >
        Statistics Numbers
      </Text>
      <Table variant="simple" color="gray.500" mb="24px" mt="12px">
        <Thead>
          <Tr>
            <Th color="gray.400" textAlign="left">
              Label
            </Th>
            <Th color="gray.400" textAlign="right">
              Count
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {statistics.map((stat, index) => (
            <Tr key={index}>
              <Td>
                <Flex alignItems="center">
                  <Box
                    width="12px"
                    height="12px"
                    bg={stat.color}
                    borderRadius="50%"
                    mr={4}
                  />
                  <Text fontSize="14px" fontWeight="700" color="#1B2559">
                    {stat.label}
                  </Text>
                </Flex>
              </Td>
              <Td textAlign="right">
                <Text fontSize="14px" fontWeight="700" color="#1B2559">
                  {stat.count}
                </Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default StatisticsNumbers;
