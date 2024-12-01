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
    <Box bg="neutralSilver" id="home">
      <Box px={{ base: 4, lg: 14 }} maxW="screen-2xl" mx="auto" minH="screen" h="screen" display="flex" justifyContent="center" alignItems="center">
        <Swiper
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Autoplay]}
          className="w-5/6 mx-auto"
        >
          <SwiperSlide>
            <Flex direction={{ base: "column", md: "row-reverse" }} align="center" justify="space-between" gap={12} py={{ base: 12, md: 8 }} my={{ base: 28, md: 8 }}>
              <Image src={banner} alt="Banner" />
              <Box ml={{ base: 0, md: 14 }} w={{ base: "full", md: "1/2" }}>
                <Text fontSize="5xl" mb={4} fontWeight="semibold" color="neutralDGrey" w="3/4" lineHeight="snug">
                  MANAGEMENT SYSTEM <Text as="span" color="brandPrimary">FOR SALES</Text> <Text as="span" color="neutralDGrey"> AT EVENTS</Text>
                </Text>
                <Text color="neutralGrey" fontSize="base" mb={2}>
                  ESMP offers sellers a fast, easy, and effective experience
                </Text>
                <Text fontWeight="bold" fontSize="2xl" color="black" mb={0}>
                  FAST, EASY, EFFECTIVE!
                </Text>
                <Button bg="brandPrimary" color="white" size="lg" rounded="md" mt={6} _hover={{ bg: "neutralDGrey" }}>
                  EXPERIENCE NOW
                </Button>
              </Box>
            </Flex>
          </SwiperSlide>

          <SwiperSlide>
            <Flex direction={{ base: "column", md: "row-reverse" }} align="center" justify="space-between" gap={12} py={{ base: 12, md: 8 }} my={{ base: 28, md: 8 }}>
              <Image src={banner2} alt="Banner 2" />
              <Box ml={{ base: 0, md: 14 }} w={{ base: "full", md: "1/2" }}>
                <Text fontSize="5xl" mb={4} fontWeight="semibold" color="neutralDGrey" w="3/4" lineHeight="snug">
                  ESMP - THE "KEY" TO ENHANCING <Text as="span" color="brandPrimary">BUSINESS PERFORMANCE</Text>
                </Text>
                <Text color="neutralGrey" fontSize="base" mb={2}>
                  A comprehensive solution for managing and selling at events with many useful features.
                </Text>
                <Button bg="brandPrimary" color="white" size="lg" rounded="md" mt={6} _hover={{ bg: "neutralDGrey" }}>
                  EXPERIENCE NOW
                </Button>
              </Box>
            </Flex>
          </SwiperSlide>

          <SwiperSlide>
            <Flex direction={{ base: "column", md: "row-reverse" }} align="center" justify="space-between" gap={12} py={{ base: 12, md: 8 }} my={{ base: 28, md: 8 }}>
              <Image src={banner3} alt="Banner 3" />
              <Box ml={{ base: 0, md: 14 }} w={{ base: "full", md: "1/2" }}>
                <Text fontSize="5xl" mb={4} fontWeight="semibold" color="neutralDGrey" w="3/4" lineHeight="snug">
                  WHAT ARE THE BENEFITS OF SALES MANAGEMENT?
                </Text>
                <Text color="neutralGrey" fontSize="base" mb={1.5}>
                  Efficient inventory management
                </Text>
                <Text color="neutralGrey" fontSize="base" mb={1.5}>
                  Fast and secure transactions
                </Text>
                <Text color="neutralGrey" fontSize="base" mb={1.5}>
                  Accurate revenue tracking
                </Text>
                <Text color="neutralGrey" fontSize="base" mb={1.5}>
                  Improved customer experience
                </Text>
                <Text color="neutralGrey" fontSize="base" mb={1.5}>
                  Optimized business performance
                </Text>
                <Button bg="brandPrimary" color="white" size="lg" rounded="md" mt={6} _hover={{ bg: "neutralDGrey" }}>
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
