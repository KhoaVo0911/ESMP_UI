import React from "react";

import VendorLayout from "./Layout/VendorLayout";
import { Box, Grid, Text } from "@chakra-ui/react";
import RevenueChart from "./chart/RevenueChart";
import MostOrderedProduct from "./MostOderProduct/MostOrderedProduct";
import PieChart from "./chart/PieChart";

const DashboardVendor = () => {
  return (
    <VendorLayout>
      <Grid templateColumns="2fr 1fr" gap={8} mb={8}>
        <Box
          bg="white"
          borderRadius="20px"
          p={6}
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.05)"
        >
          <PieChart />
        </Box>
        <Box
          bg="white"
          borderRadius="20px"
          p={6}
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.05)"
        >
          <MostOrderedProduct />
        </Box>
      </Grid>

      {/* Phần các bảng xếp hạng */}
      <Grid templateColumns="1fr" gap={8}>
        <Box
          bg="white"
          borderRadius="20px"
          p={6}
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.05)"
        >
          <RevenueChart />
        </Box>
      </Grid>
    </VendorLayout>
  );
};

export default DashboardVendor;
