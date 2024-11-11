import React from "react";
import { Box, VStack } from "@chakra-ui/react";
import CategorySection from "../../components/eventConfig/CategorySection";
import ThemeEventSection from "../../components/eventConfig/ThemeEventSection";

const EventConfigPage = () => {
  return (
    <VStack spacing={8} align="stretch">
      <Box bg="white" p={6} borderRadius="md" shadow="md">
        <CategorySection />
      </Box>
      <Box bg="white" p={6} borderRadius="md" shadow="md">
        <ThemeEventSection />
      </Box>
    </VStack>
  );
};

export default EventConfigPage;
