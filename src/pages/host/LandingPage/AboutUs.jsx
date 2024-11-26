import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
} from "@chakra-ui/react";
import { FaPizzaSlice, FaHamburger, FaHeadset } from "react-icons/fa";

const AboutUs = () => {
  return (
    <Box id="about" bg="#f0f4ff" py={12}>
      <Flex
        maxW="1200px"
        mx="auto"
        direction={["column", "row"]}
        align="center"
      >
        {/* Text Section */}
        <VStack align="flex-start" spacing={6} w={["100%", "60%"]} px={6}>
          <Text fontSize="xl" fontWeight="bold" color="orange.500">
            About Us
          </Text>
          <Heading as="h2" size="xl" fontFamily="serif">
            Welcome to ESMP
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Lorem ipsum dolor sit amet elit, consectetur adipiscing, sed eiusmod
            tempor sit amet elit dolor sit amet elit. Lorem ipsum dolor sit amet
            elit, consectetur adipiscing, sed eiusmod tempor sit amet elit sit
            amet elit. Lorem ipsum dolor sit amet elit, consectetur adipiscing,
            sed eiusmod tempor sit amet elit.
          </Text>

          {/* Info Blocks */}
          <HStack spacing={6} mt={6} align="stretch">
            <VStack
              p={4}
              bg="white"
              shadow="md"
              borderRadius="md"
              align="center"
              justify="center" // Ensure vertical centering
              w="full"
              minHeight="150px" // Set a minimum height for equal-sized blocks
              flex="1"
            >
              <FaPizzaSlice size="40px" color="orange" />
              <Text fontWeight="bold" fontSize="20" textAlign="center">
                Standard Ratings
              </Text>
            </VStack>
            <VStack
              p={4}
              bg="white"
              shadow="md"
              borderRadius="md"
              align="center"
              justify="center" // Ensure vertical centering
              w="full"
              minHeight="150px" // Set a minimum height for equal-sized blocks
              flex="1"
            >
              <FaHamburger size="50px" color="orange" />
              <Text fontWeight="bold" fontSize="20" textAlign="center">
                Delicious Food
              </Text>
            </VStack>
            <VStack
              p={4}
              bg="white"
              shadow="md"
              borderRadius="md"
              align="center"
              justify="center" // Ensure vertical centering
              w="full"
              minHeight="150px" // Set a minimum height for equal-sized blocks
              flex="1"
            >
              <FaHeadset size="50px" color="orange" />
              <Text fontWeight="bold" fontSize="20" textAlign="center">
                Continuous Support
              </Text>
            </VStack>
          </HStack>
        </VStack>

        {/* Image Section */}
        <Box w={["120%", "45%"]} mt={[8, 0]} px={6}>
          <Image
            src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/fefe8899722199.5ef9694612dcc.jpg" // Replace with actual image path
            borderRadius="md"
            shadow="lg"
            alt="Delivery Man"
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default AboutUs;
