import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  IconButton,
  VStack,
  HStack,
  Image,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import backgroundImage from "../../../assets/images/hinhtom.jpg";
import backgroundImage1 from "../../../assets/images/money.jpg";
import backgroundImage11 from "../../../assets/images/1111111.jpg";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const slides = [
    {
      image: backgroundImage, // Thay thế bằng đường dẫn hình ảnh sự kiện phù hợp
      title: "Sự Kiện Theo Cách Của Bạn",
      subtitle: "Dịch Vụ Tổ Chức Sự Kiện Chuyên Nghiệp",
      description:
        "Chúng tôi cung cấp dịch vụ tổ chức sự kiện cá nhân hóa giúp bạn tạo nên những trải nghiệm đáng nhớ, từ sự kiện doanh nghiệp đến ra mắt sản phẩm.",
    },
    {
      image: backgroundImage1, // Thay thế bằng đường dẫn hình ảnh sự kiện khác
      title: "Tăng Doanh Số Bán Hàng",
      subtitle: "Giải Pháp Kinh Doanh & Marketing",
      description:
        "Tối ưu hóa sự thành công của sự kiện với các giải pháp bán hàng và tiếp thị tùy chỉnh, giúp tăng cường sự tương tác và doanh thu.",
    },
    {
      image: backgroundImage11, // Thay thế bằng đường dẫn hình ảnh sự kiện khác
      title: "Trải Nghiệm Trực Tuyến Mượt Mà",
      subtitle: "Quản Lý Sự Kiện Đơn Giản",
      description:
        "Quản lý sự kiện của bạn dễ dàng với nền tảng trực tuyến của chúng tôi. Từ đặt vé đến lịch trình, chúng tôi cung cấp mọi công cụ cần thiết.",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesCount = slides.length;

  const prevSlide = () => {
    setCurrentSlide((s) => (s === 0 ? slidesCount - 1 : s - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((s) => (s === slidesCount - 1 ? 0 : s + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval); // Clear the interval on unmount
  }, [currentSlide]);

  const carouselStyle = {
    transition: "all 0.5s",
    ml: `-${currentSlide * 100}%`,
  };

  return (
    <Box position="relative" overflow="hidden" bg="gray.100" p={0}>
      <Flex w="full" h="full" {...carouselStyle}>
        {slides.map((slide, index) => (
          <Box
            key={index}
            w="full"
            flex="none"
            bgImage={`url(${slide.image})`}
            bgSize="cover"
            bgPos="center"
            position="relative"
            color="white"
            textAlign="center"
            marginTop="100px"
          >
            {/* Black Overlay */}
            <Box
              position="absolute"
              top="0"
              left="0"
              width="100%"
              height="100%"
              bg="rgba(0, 0, 0, 0.5)" // Black color with 50% opacity
              zIndex={1}
            />
            {/* Content */}
            <Box position="relative" zIndex={2} p={16}>
              <Heading fontSize="4xl" fontWeight="bold">
                {slide.title}
              </Heading>
              <Text fontSize="2xl" mt={2}>
                {slide.subtitle}
              </Text>
              <Text fontSize="lg" mt={4} mb={8}>
                {slide.description}
              </Text>
              <HStack justify="center" spacing={4}>
                <IconButton
                  aria-label="Previous Slide"
                  icon={<ChevronLeftIcon />}
                  position="absolute"
                  left="5%"
                  top="50%"
                  transform="translateY(-50%)"
                  colorScheme="orange"
                  variant="solid"
                  onClick={prevSlide}
                />
                <IconButton
                  aria-label="Next Slide"
                  icon={<ChevronRightIcon />}
                  position="absolute"
                  right="5%"
                  top="50%"
                  transform="translateY(-50%)"
                  colorScheme="orange"
                  variant="solid"
                  onClick={nextSlide}
                />
              </HStack>
            </Box>
          </Box>
        ))}{" "}
      </Flex>

      {/* Navigation buttons */}
    </Box>
  );
};

export default HeroSection;
