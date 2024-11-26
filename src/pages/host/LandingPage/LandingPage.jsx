import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  VStack,
  HStack,
  Image,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import backgroundImage from "../../../assets/images/download.jfif";
import HeroSection from "./HeroSection";
import AboutUs from "./AboutUs";
import EventGrid from "./EventGrid";
import RegisterForm from "./RegisterForm"; // Import RegisterForm

const LandingPage = () => {
  const [activeLink, setActiveLink] = useState("#about");

  // Function to update the selected link
  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <Box bg="#f5f1e0" color="brown" fontFamily="serif">
      {/* Header */}
      <Box
        bg="brown"
        color="white"
        p={4}
        position="fixed" // Ensure the navigation bar stays fixed at the top
        top={0}
        left={0}
        right={0}
        zIndex={1000} // Ensure it stays on top of other elements
        boxShadow="lg"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Heading fontSize="xl">EVENT SALES MANAGEMENT PLATFORM</Heading>
          <HStack spacing={8}>
            {/* 'About Us' Link */}
            <Link
              href="#about"
              onClick={() => handleLinkClick("#about")}
              borderBottom={activeLink === "#about" ? "2px solid orange" : "none"} // Underline if selected
            >
              About Us
            </Link>

            {/* 'Images' Link */}
            <Link
              href="#image"
              onClick={() => handleLinkClick("#image")}
              borderBottom={activeLink === "#image" ? "2px solid orange" : "none"} // Underline if selected
            >
              Images
            </Link>

            {/* 'Login' Link */}
            <Link
              href="/login"
              onClick={() => handleLinkClick("/login")}
              borderBottom={activeLink === "/login" ? "2px solid orange" : "none"} // Underline if selected
            >
              Login
            </Link>
          </HStack>
        </Flex>
      </Box>

      {/* Hero Section */}
      <HeroSection />

      {/* Body - About Us */}
      <AboutUs id="about" />

      {/* Body - Event Images */}
      <Box id="image" p={8} bg="gray.200" textAlign="center">
        <Heading fontSize="2xl">Event Images</Heading>
        <HStack spacing={8} justify="center" mt={8}>
          <VStack>
            <Image
              src="https://th.bing.com/th/id/OIP.1m9NOSWoXPKpgpL4e9VUTQAAAA?rs=1&pid=ImgDetMain"
              boxSize="200px"
            />
            <Text>Delicious Food</Text>
          </VStack>
          <VStack>
            <Image
              src="https://www.wikidanang.com/tin-tuc/images/Wiki/nha-hang/truc-lam-vien-com-nieu/truc-lam-vien-8.jpg"
              boxSize="200px"
            />
            <Text>Diverse Stalls</Text>
          </VStack>
          <VStack>
            <Image
              src="https://static.salekit.com/image/shop/2/source/thanh-toan-qr-code-la-gi.jpg"
              boxSize="200px"
            />
            <Text>Fast Payment</Text>
          </VStack>
        </HStack>
      </Box>

      {/* Body - Register Form */}
      

      {/* Body - Fast Payment */}
      <EventGrid />
      <Box p={8} bg="#f0f4ff" id="register">
        <Heading as="h2" size="xl" textAlign="center" mb={8}>
          Register Your Account
        </Heading>
        <RegisterForm /> {/* Add the RegisterForm component here */}
      </Box>
      {/* Footer */}
      <Box bg="brown" color="white" p={4} textAlign="center">
        <Text>© 2024 Event Sale Manager. All rights reserved.</Text>
      </Box>
    </Box>
  );
};

export default LandingPage;
