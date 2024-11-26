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
      image: backgroundImage, // Replace with the path to the event image
      title: "Events Your Way",
      subtitle: "Professional Event Management Services",
      description:
        "We provide personalized event management services to help you create memorable experiences, from corporate events to product launches.",
    },
    {
      image: backgroundImage1, // Replace with the path to another event image
      title: "Boost Sales",
      subtitle: "Business & Marketing Solutions",
      description:
        "Optimize the success of your event with customized sales and marketing solutions to enhance engagement and revenue.",
    },
    {
      image: backgroundImage11, // Replace with the path to another event image
      title: "Seamless Online Experience",
      subtitle: "Simple Event Management",
      description:
        "Easily manage your events with our online platform. From ticket booking to scheduling, we provide all the tools you need.",
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
                  colorScheme="#003366"
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
                  colorScheme="#003366"
                  variant="solid"
                  onClick={nextSlide}
                />
              </HStack>
            </Box>
          </Box>
        ))} 
      </Flex>

      {/* Navigation buttons */}
    </Box>
  );
};

export default HeroSection;
