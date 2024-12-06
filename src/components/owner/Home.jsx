import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { Box, Flex, Text, Button, Image } from "@chakra-ui/react";
import banner from "../../assets/images/banner.png";
import banner2 from "../../assets/images/banner2.png";
import banner3 from "../../assets/images/banner3.png";

const Home = () => {
  return (
    <Box bgGradient="linear(to-r, #6EE7B7, #3B82F6)" id="home">
      <Box px={{ base: 4, lg: 14 }} maxW="screen-2xl" mx="auto"   minH="screen" display="flex" justifyContent="center" alignItems="center">
        <Swiper
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Autoplay]}
          className="w-5/6 mx-auto"
        >
          {/* Slide 1 */}
          <SwiperSlide>
            <Flex direction={{ base: "column", md: "row-reverse" }} align="center" justify="space-between" gap={6} py={{ base: 12, md: 8 }} my={{ base: 24, md: 8 }} minH="500px">
              <Image src={banner} alt="Banner"  />
              <Box ml={{ base: 0, md: 14 }} w={{ base: "full", md: "1/2" }}>
                <Text fontSize={{ base: "3xl", md: "5xl" }} mb={4} fontWeight="bold" color="#1E3A8A" lineHeight="1.4">
                  MANAGEMENT SYSTEM <Text as="span" color="#FF9F1C">FOR SALES</Text> <Text as="span" color="#4B5563"> AT EVENTS</Text>
                </Text>
                <Text color="#4B5563" fontSize="lg" mb={3}>
                  ESMP offers sellers a fast, easy, and effective experience.
                </Text>
                <Text fontWeight="bold" fontSize="2xl" color="black" mb={6}>
                  FAST, EASY, EFFECTIVE!
                </Text>
                <Button bg="#1E3A8A" color="white" size="lg" rounded="md" _hover={{ bg: "#2563EB" }} transition="all 0.3s ease">
                  EXPERIENCE NOW
                </Button>
              </Box>
            </Flex>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <Flex direction={{ base: "column", md: "row-reverse" }} align="center" justify="space-between" gap={6} py={{ base: 12, md: 8 }} my={{ base: 24, md: 8 }} minH="500px">
              <Image src={banner2} alt="Banner 2"  />
              <Box ml={{ base: 0, md: 14 }} w={{ base: "full", md: "1/2" }}>
                <Text fontSize={{ base: "3xl", md: "5xl" }} mb={4} fontWeight="bold" color="#1E3A8A" lineHeight="1.4">
                  ESMP - THE "KEY" TO ENHANCING <Text as="span" color="#FF9F1C">BUSINESS PERFORMANCE</Text>
                </Text>
                <Text color="#4B5563" fontSize="lg" mb={3}>
                  A comprehensive solution for managing and selling at events with many useful features.
                </Text>
                <Button bg="#1E3A8A" color="white" size="lg" rounded="md" _hover={{ bg: "#2563EB" }} transition="all 0.3s ease">
                  EXPERIENCE NOW
                </Button>
              </Box>
            </Flex>
          </SwiperSlide>

          {/* Slide 3 */}
          <SwiperSlide>
            <Flex direction={{ base: "column", md: "row-reverse" }} align="center" justify="space-between" gap={6} py={{ base: 12, md: 8 }} my={{ base: 24, md: 8 }} minH="500px">
              <Image src={banner3} alt="Banner 3"  />
              <Box ml={{ base: 0, md: 14 }} w={{ base: "full", md: "1/2" }}>
                <Text fontSize={{ base: "3xl", md: "5xl" }} mb={4} fontWeight="bold" color="#1E3A8A" lineHeight="1.4">
                  WHAT ARE THE BENEFITS OF SALES PLATFORM?
                </Text>
                <Text color="#4B5563" fontSize="lg" mb={1.5}>Efficient inventory management</Text>
                <Text color="#4B5563" fontSize="lg" mb={1.5}>Fast and secure transactions</Text>
                <Text color="#4B5563" fontSize="lg" mb={1.5}>Accurate revenue tracking</Text>
                <Text color="#4B5563" fontSize="lg" mb={1.5}>Improved customer experience</Text>
                <Text color="#4B5563" fontSize="lg" mb={1.5}>Optimized business performance</Text>
                <Button bg="#1E3A8A" color="white" size="lg" rounded="md" mt={6} _hover={{ bg: "#2563EB" }} transition="all 0.3s ease">
                  EXPERIENCE NOW
                </Button>
              </Box>
            </Flex>
          </SwiperSlide>

          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </Swiper>
      </Box>
    </Box>
  );
};

export default Home;
