import React from "react";
import { Box, SimpleGrid, Text, VStack, Icon } from "@chakra-ui/react";
import { MdEvent, MdPeople, MdLocationOn, MdGroup } from "react-icons/md";

const Services = () => {
  return (
    <Box id="about" bgGradient="linear(to-r, teal.600, blue.900)" color="white" p={10}>
      <VStack spacing={6}>
        <Text fontSize="2xl" fontWeight="bold">
          Backstage by the numbers
        </Text>
        <SimpleGrid columns={[1, 2, 4]} spacing={8}>
          <VStack>
            <Icon as={MdEvent} boxSize={12} />
            <Box fontSize="3xl" fontWeight="bold">
              200+
            </Box>
            <Text fontSize="lg">events</Text>
          </VStack>
          <VStack>
            <Icon as={MdPeople} boxSize={12} />
            <Box fontSize="3xl" fontWeight="bold">
              50+
            </Box>
            <Text fontSize="lg">event planners</Text>
          </VStack>
          <VStack>
            <Icon as={MdLocationOn} boxSize={12} />
            <Box fontSize="3xl" fontWeight="bold">
              100+
            </Box>
            <Text fontSize="lg">locations</Text>
          </VStack>
          <VStack>
            <Icon as={MdGroup} boxSize={12} />
            <Box fontSize="3xl" fontWeight="bold">
              200+
            </Box>
            <Text fontSize="lg">attendees</Text>
          </VStack>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default Services;
