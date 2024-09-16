import React from "react";
import { Box, Grid, Text } from "@chakra-ui/react";
import RevenueChart from "../../components/host/chart/RevenueChart";
import MostOrderedProduct from "../../components/host/product/MostOrderedProduct";
import EventRanking from "../../components/host/ranking/EventRanking";
import StatisticsNumbers from "../../components/host/stats/StatisticsNumbers";
import TopVendor from "../../components/host/vendor/TopVendor";
import HostLayout from "../../layouts/host/HostLayout";

const Dashboard = () => {
  return (
    <HostLayout>
      {/* Title của Dashboard */}
      {/* <Text fontSize="3xl" fontWeight="bold" color="#1A202C" mb={6}>
        Dashboard
      </Text> */}

      {/* Grid với tỷ lệ 2/3 và 1/3 cho RevenueChart và StatisticsNumbers */}
      <Grid templateColumns="2fr 1fr" gap={8} mb={8}>
        <Box
          bg="white"
          borderRadius="20px"
          p={6}
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.05)"
        >
          <RevenueChart />
        </Box>
        <Box
          bg="white"
          borderRadius="20px"
          p={6}
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.05)"
        >
          <StatisticsNumbers />
        </Box>
      </Grid>

      {/* Phần các bảng xếp hạng */}
      <Grid templateColumns="repeat(3, 1fr)" gap={8}>
        <Box
          bg="white"
          borderRadius="20px"
          p={6}
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.05)"
        >
          <EventRanking />
        </Box>
        <Box
          bg="white"
          borderRadius="20px"
          p={6}
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.05)"
        >
          <MostOrderedProduct />
        </Box>
        <Box
          bg="white"
          borderRadius="20px"
          p={6}
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.05)"
        >
          <TopVendor />
        </Box>
      </Grid>
    </HostLayout>
  );
};

export default Dashboard;
