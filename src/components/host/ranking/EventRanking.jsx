import React, { useMemo } from "react";
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
import logoevent from "../../../assets/images/shop1.png";

const EventRanking = () => {
  const events = [
    { name: "ABC Event", revenue: 7502000 },
    { name: "DEF Event", revenue: 9205000 },
    { name: "GHI Event", revenue: 8403000 },
    { name: "JKL Event", revenue: 6004000 },
    { name: "MNO Event", revenue: 10500000 },
  ];

  // Sử dụng useMemo để tính toán sự kiện có doanh thu cao nhất
  const highestRevenueEvent = useMemo(() => {
    return events.reduce((prev, current) =>
      prev.revenue > current.revenue ? prev : current
    );
  }, [events]);

  return (
    <Box>
      <Text
        mb={4}
        fontSize="22px"
        fontWeight="700"
        color="var(--chakra-colors-secondaryGray-900)"
      >
        Event Ranking
      </Text>
      <Table variant="simple" color="gray.500" mb="24px" mt="12px">
        <Thead>
          <Tr>
            <Th color="gray.400" textAlign="left">
              Event
            </Th>
            <Th color="gray.400" textAlign="right">
              Revenue (VND)
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {events.map((event, index) => (
            <Tr key={index}>
              <Td>
                <Flex align="center">
                  <Image
                    src={logoevent}
                    alt={event.name}
                    boxSize="40px"
                    mr={4}
                  />
                  <Text fontSize="14px" fontWeight="700" color="#1B2559">
                    {event.name}
                  </Text>
                </Flex>
              </Td>
              <Td textAlign="right">
                <Text fontSize="14px" fontWeight="700" color="#1B2559">
                  {event.revenue.toLocaleString("vi-VN")} VND
                </Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Box mt={6} bg="gray.100" p={4} borderRadius="12px"></Box>
    </Box>
  );
};

export default EventRanking;
