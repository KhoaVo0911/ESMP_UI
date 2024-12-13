import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Page404 = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading as="h1" size="2xl" color="red.500">
        404
      </Heading>
      <Text fontSize="xl" mt={3} mb={6}>
        Page Not Found: The page you’re looking for doesn’t exist.
      </Text>
      <Button colorScheme="blue" onClick={() => navigate("/login")}>
        Go to Home
      </Button>
    </Box>
  );
};

export default Page404;
