import React from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { Box, Flex, Text, Button, Image } from "@chakra-ui/react";
import banner from "../../assets/images/banner.png";
import banner2 from "../../assets/images/banner2.png";
import banner3 from "../../assets/images/banner3.png";

const Home = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to handle button click
  const handleExperienceNowClick = () => {
    navigate("/login"); // Navigate to /login page
  };

  return (
    <Box bgGradient="linear(to-r, teal.600, blue.900)" id="home">
      <Box
        px={{ base: 4, lg: 14 }}
        maxW="screen-2xl"
        mx="auto"
        minH="screen"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
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
          className="w-full mx-auto"
        >
          {/* Slide 1 */}
          <SwiperSlide>
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="space-between"
              gap={8}
              py={{ base: 8, md: 12 }}
              my={{ base: 16, md: 8 }}
              minH="500px"
            >
              <Image
                src={banner}
                alt="Banner"
                objectFit="cover"
                maxW={{ base: "100%", md: "50%" }}
              />
              <Box
                ml={{ base: 0, md: 14 }}
                w={{ base: "full", md: "1/2" }}
                textAlign={{ base: "center", md: "left" }}
              >
                <Text
                  fontSize={{ base: "3xl", md: "5xl" }}
                  mb={4}
                  fontWeight="bold"
                  color="white"
                  lineHeight="1.4"
                >
                  MANAGEMENT SYSTEM{" "}
                  <Text as="span" color="#FF9F1C">
                    FOR SALES
                  </Text>{" "}
                  <Text as="span" color="#D1D5DB">
                    AT EVENTS
                  </Text>
                </Text>
                <Text color="gray.200" fontSize="lg" mb={3}>
                  ESMP offers sellers a fast, easy, and effective experience.
                </Text>
                <Text fontWeight="bold" fontSize="2xl" color="white" mb={6}>
                  FAST, EASY, EFFECTIVE!
                </Text>
                <Button
                  bg="#FF9F1C"
                  color="white"
                  size="lg"
                  rounded="md"
                  _hover={{ bg: "#FF7A00" }}
                  transition="all 0.3s ease"
                  onClick={handleExperienceNowClick} // Trigger navigation on click
                >
                  EXPERIENCE NOW
                </Button>
              </Box>
            </Flex>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="space-between"
              gap={8}
              py={{ base: 8, md: 12 }}
              my={{ base: 16, md: 8 }}
              minH="500px"
            >
              <Image
                src={banner2}
                alt="Banner 2"
                objectFit="cover"
                maxW={{ base: "100%", md: "50%" }}
              />
              <Box
                ml={{ base: 0, md: 14 }}
                w={{ base: "full", md: "1/2" }}
                textAlign={{ base: "center", md: "left" }}
              >
                <Text
                  fontSize={{ base: "3xl", md: "5xl" }}
                  mb={4}
                  fontWeight="bold"
                  color="white"
                  lineHeight="1.4"
                >
                  ESMP - THE "KEY" TO ENHANCING{" "}
                  <Text as="span" color="#FF9F1C">
                    BUSINESS PERFORMANCE
                  </Text>
                </Text>
                <Text color="gray.200" fontSize="lg" mb={3}>
                  A comprehensive solution for managing and selling at events
                  with many useful features.
                </Text>
                <Button
                  bg="#FF9F1C"
                  color="white"
                  size="lg"
                  rounded="md"
                  _hover={{ bg: "#FF7A00" }}
                  transition="all 0.3s ease"
                  onClick={handleExperienceNowClick} // Trigger navigation on click
                >
                  EXPERIENCE NOW
                </Button>
              </Box>
            </Flex>
          </SwiperSlide>

          {/* Slide 3 */}
          <SwiperSlide>
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="space-between"
              gap={8}
              py={{ base: 8, md: 12 }}
              my={{ base: 16, md: 8 }}
              minH="500px"
            >
              <Image
                src={banner3}
                alt="Banner 3"
                objectFit="cover"
                maxW={{ base: "100%", md: "50%" }}
              />
              <Box
                ml={{ base: 0, md: 14 }}
                w={{ base: "full", md: "1/2" }}
                textAlign={{ base: "center", md: "left" }}
              >
                <Text
                  fontSize={{ base: "3xl", md: "5xl" }}
                  mb={4}
                  fontWeight="bold"
                  color="white"
                  lineHeight="1.4"
                >
                  WHAT ARE THE BENEFITS OF SALES PLATFORM?
                </Text>
                <Text color="gray.200" fontSize="lg" mb={1.5}>
                  Efficient inventory management
                </Text>
                <Text color="gray.200" fontSize="lg" mb={1.5}>
                  Fast and secure transactions
                </Text>
                <Text color="gray.200" fontSize="lg" mb={1.5}>
                  Accurate revenue tracking
                </Text>
                <Text color="gray.200" fontSize="lg" mb={1.5}>
                  Improved customer experience
                </Text>
                <Text color="gray.200" fontSize="lg" mb={1.5}>
                  Optimized business performance
                </Text>
                <Button
                  bg="#FF9F1C"
                  color="white"
                  size="lg"
                  rounded="md"
                  mt={6}
                  _hover={{ bg: "#FF7A00" }}
                  transition="all 0.3s ease"
                  onClick={handleExperienceNowClick} // Trigger navigation on click
                >
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
