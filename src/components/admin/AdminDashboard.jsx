import React from "react";
import { Box, Grid, Text } from "@chakra-ui/react";
import AdminLayout from "./Layout/AdminLayout";
import BarChart from "./Top5Host";
import PackageSales from "./PackageSales";

const DashboardAdmin = () => {
  return (
    <>
      <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8} mb={8}>
        <Box
          bg="white"
          borderRadius="20px"
          p={6}
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.05)"
        >
          <BarChart />
        </Box>
        <Box
          bg="white"
          borderRadius="20px"
          p={6}
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.05)"
        >
          <Text fontSize="lg" fontWeight="bold">
            Package Sales
          </Text>
          {/* <Text mt={4}>Placeholder for stats or additional content.</Text> */}
          <PackageSales />
        </Box>
      </Grid>

      {/* <Grid templateColumns={{ base: "1fr", md: "1fr" }} gap={8}>
        <Box
          bg="white"
          borderRadius="20px"
          p={6}
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.05)"
        >
          <Text fontSize="lg" fontWeight="bold">
            Recent Activity
          </Text>
          <Text mt={4}>
            Placeholder for recent activity or additional content.
          </Text>
        </Box>
      </Grid> */}
    </>
  );
};

export default DashboardAdmin;
