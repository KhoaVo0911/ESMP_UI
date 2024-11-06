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

const LandingPage = () => {
  const [activeLink, setActiveLink] = useState("#about");

  // Hàm để cập nhật link đang chọn
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
        position="fixed" // Đảm bảo thanh điều hướng luôn cố định ở đầu trang
        top={0}
        left={0}
        right={0}
        zIndex={1000} // Đảm bảo nó luôn nằm trên các thành phần khác
        boxShadow="lg"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Heading fontSize="xl">EVENT SALES MANAGEMENT PLATFORM</Heading>
          <HStack spacing={8}>
            {/* Link 'Về Chúng Tôi' */}
            <Link
              href="#about"
              onClick={() => handleLinkClick("#about")}
              borderBottom={
                activeLink === "#about" ? "2px solid orange" : "none"
              } // Gạch chân nếu được chọn
            >
              Về Chúng Tôi
            </Link>

            {/* Link 'Hình ảnh' */}
            <Link
              href="#image"
              onClick={() => handleLinkClick("#image")}
              borderBottom={
                activeLink === "#image" ? "2px solid orange" : "none"
              } // Gạch chân nếu được chọn
            >
              Hình ảnh
            </Link>

            {/* Link 'Liên Hệ' */}
            {/* <Link
              href="#contact"
              onClick={() => handleLinkClick("#contact")}
              borderBottom={
                activeLink === "#contact" ? "2px solid orange" : "none"
              } // Gạch chân nếu được chọn
            >
              Liên Hệ
            </Link> */}

            {/* Link 'Đăng Nhập' */}
            <Link
              href="/login"
              onClick={() => handleLinkClick("/login")}
              borderBottom={
                activeLink === "/login" ? "2px solid orange" : "none"
              } // Gạch chân nếu được chọn
            >
              Đăng Nhập
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
        <Heading fontSize="2xl">Hình Ảnh Sự Kiện</Heading>
        <HStack spacing={8} justify="center" mt={8}>
          <VStack>
            <Image
              src="https://th.bing.com/th/id/OIP.1m9NOSWoXPKpgpL4e9VUTQAAAA?rs=1&pid=ImgDetMain"
              boxSize="200px"
            />
            <Text>Món Ăn Hấp Dẫn</Text>
          </VStack>
          <VStack>
            <Image
              src="https://www.wikidanang.com/tin-tuc/images/Wiki/nha-hang/truc-lam-vien-com-nieu/truc-lam-vien-8.jpg"
              boxSize="200px"
            />
            <Text>Gian Hàng Đa Dạng</Text>
          </VStack>
          <VStack>
            <Image
              src="https://static.salekit.com/image/shop/2/source/thanh-toan-qr-code-la-gi.jpg"
              boxSize="200px"
            />
            <Text>Thanh Toán Nhanh Chóng</Text>
          </VStack>
        </HStack>
      </Box>

      {/* Body - Fast Payment */}
      <EventGrid />

      {/* Footer */}
      <Box bg="brown" color="white" p={4} textAlign="center">
        <Text>© 2024 Event Sale Manager. Bản quyền thuộc về chúng tôi.</Text>
      </Box>
    </Box>
  );
};

export default LandingPage;
