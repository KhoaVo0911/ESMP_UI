import React from "react";
import { Box, Flex, Heading, Text, Icon, SimpleGrid, useBreakpointValue } from "@chakra-ui/react";
import { CheckCircleIcon, SearchIcon, InfoIcon } from "@chakra-ui/icons"; // Use available icons

// Using custom icons with Chakra UI if needed
import { createIcon } from "@chakra-ui/react";

// Example of creating custom icons
const InventoryIcon = createIcon({
  displayName: "InventoryIcon",
  path: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.89 2 1.99 2h14c1.1 0 1.99-.9 1.99-2V5c0-1.1-.89-2-1.99-2zM12 15h-1v-2h1v2zm0-3h-1V7h1v5z" />
    </svg>
  ),
});

const PaidIcon = createIcon({
  displayName: "PaidIcon",
  path: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15-5-5h3V8h4v4h3l-5 5z" />
    </svg>
  ),
});

const QrCodeIcon = createIcon({
  displayName: "QrCodeIcon",
  path: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M4 4h16v16H4V4zm8 12h-2v-2h2v2zm0-4h-2V7h2v5z" />
    </svg>
  ),
});

const SupportIcon = createIcon({
  displayName: "SupportIcon",
  path: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M12 0C5.38 0 0 5.38 0 12s5.38 12 12 12 12-5.38 12-12S18.62 0 12 0zm0 2c5.52 0 10 4.48 10 10S17.52 22 12 22 2 17.52 2 12 6.48 2 12 2zm1 7h-2V7h2v2zm0 4h-2v-2h2v2z" />
    </svg>
  ),
});

const testimonialData = [
  {
    id: 1,
    name: "EFFECTIVE PRODUCT MANAGEMENT",
    post: "MARKETING MANAGER",
    desc: "ESMP software helps you manage all products effectively, from inventory management to product information updates.",
    icon: <InventoryIcon boxSize={8} color="green.500" />,
  },
  {
    id: 2,
    name: "FAST AND CONVENIENT PAYMENT",
    post: "MARKETING MANAGER",
    desc: "ESMP integrates multiple modern payment methods, making transactions fast and convenient.",
    icon: <PaidIcon boxSize={8} color="teal.500" />,
  },
  {
    id: 3,
    name: "QR CODE FOR EACH ORDER",
    post: "MARKETING MANAGER",
    desc: "With a unique QR code for each order, ESMP helps you manage and access order information quickly and accurately.",
    icon: <QrCodeIcon boxSize={8} color="blue.500" />,
  },
  {
    id: 4,
    name: "CENTRALIZED ORDER MANAGEMENT",
    post: "MARKETING MANAGER",
    desc: "Real-time notifications help you control and process orders on time.",
    icon: <SearchIcon boxSize={8} color="orange.500" />,
  },
  {
    id: 5,
    name: "PROFESSIONAL CUSTOMER MANAGEMENT",
    post: "MARKETING MANAGER",
    desc: "Easily manage customer contact information, purchase history, and feedback.",
    icon: <SupportIcon boxSize={8} color="purple.500" />,
  },
  {
    id: 6,
    name: "EASY TO USE",
    post: "MARKETING MANAGER",
    desc: "ESMP is designed with a user-friendly interface, suitable for all user groups.",
    icon: <CheckCircleIcon boxSize={8} color="yellow.500" />,
  },
];

const Testimonial = () => {
  return (
    <Box py={12} id="service" bg="#f4f7fe"
>
      <Box textAlign="center" mb={10}>
        <Heading size="lg" color="blue.700">ABOUT US</Heading>
        <Heading size="xl" color="brandPrimary" fontWeight="bold">ESMP - EVENT SALES AND MANAGEMENT PLATFORM</Heading>
      </Box>
      <SimpleGrid  
            cursor="pointer" columns={{ base: 1, md: 3 }} spacing={6} px={{ base: 4, lg: 14 }} mx="auto">
        {testimonialData.map((val) => (
          <Box
            key={val.id}
            bg="gray.50"
            p={8}
            boxShadow="lg"
            borderRadius="lg"
            transition="all 0.3s"
            _hover={{
              bg: "#457b9d",
              color: "white",
            }}
           
          >
            <Flex justify="center" mb={6}>
              {/* <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="full"
                bg="gray.200"
                p={4}
                mb={4}
              >
                {val.icon}
              </Box> */}
            </Flex>
            <Heading size="md"  mb={2}>
              {val.name}
            </Heading>
            <Text color="brandPrimary">{val.desc}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Testimonial;
