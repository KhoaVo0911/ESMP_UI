import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Page403 = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading as="h1" size="2xl" color="red.500">
        403
      </Heading>
      <Text fontSize="xl" mt={3} mb={6}>
        Forbidden: You don’t have permission to access this page.
      </Text>
      <Button colorScheme="blue" onClick={() => navigate("/login")}>
        Go to Login
      </Button>
    </Box>
  );
};

export default Page403;
