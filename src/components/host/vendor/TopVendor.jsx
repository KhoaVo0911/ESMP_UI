import React from "react";
import {
  Box,
  Flex,
  Image,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import Vendor from "../../../assets/images/vendor.png";

const TopVendor = () => {
  const vendors = [
    { name: "Vendor 1", revenue: "10.000.000 VND" },
    { name: "Vendor 2", revenue: "9.500.000 VND" },
    { name: "Vendor 3", revenue: "9.000.000 VND" },
    { name: "Vendor 4", revenue: "8.500.000 VND" },
    { name: "Vendor 5", revenue: "8.000.000 VND" },
  ];

  return (
    <Box>
      <Text
        mb={4}
        fontSize="22px"
        fontWeight="700"
        color="var(--chakra-colors-secondaryGray-900)"
      >
        Top Vendors
      </Text>
      <Table variant="simple" color="gray.500" mb="24px" mt="12px">
        <Thead>
          <Tr>
            <Th color="gray.400" textAlign="left">
              Vendor
            </Th>
            <Th color="gray.400" textAlign="right">
              Revenue
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {vendors.map((vendor, index) => (
            <Tr key={index}>
              <Td>
                <Flex align="center">
                  <Image src={Vendor} alt={vendor.name} boxSize="40px" mr={4} />
                  <Text fontSize="14px" fontWeight="700" color="#1B2559">
                    {vendor.name}
                  </Text>
                </Flex>
              </Td>
              <Td textAlign="right">
                <Text fontSize="14px" fontWeight="700" color="#1B2559">
                  {vendor.revenue}
                </Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TopVendor;
