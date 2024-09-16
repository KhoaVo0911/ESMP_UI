import React, { useState } from "react";
import {
  Box,
  Grid,
  Text,
  Image,
  VStack,
  HStack,
  Divider,
  Button,
} from "@chakra-ui/react";
import SelectBooth from "./SelectBooth"; // Assuming you already have this component
import { useNavigate } from "react-router-dom"; // For navigation

const EventEnrolled = () => {
  const navigate = useNavigate();
  const [boothData, setBoothData] = useState([
    { id: 1, status: "available" },
    { id: 2, status: "available" },
    { id: 3, status: "unavailable" },
    { id: 4, status: "available" },
  ]); // Example booth data

  const handleShopClick = () => {
    navigate("/shop");
  };

  const groups = [
    {
      id: 1,
      name: "FPTU Event Club – The Way We Went",
      floor: "2",
      image:
        "https://scontent.fsgn5-5.fna.fbcdn.net/v/t39.30808-6/457027829_1044539684338182_921737304847956243_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=sv_9k7XmVPwQ7kNvgG-ryEY&_nc_ht=scontent.fsgn5-5.fna&_nc_gid=AEsYgbQcq6e9704two0pWhy&oh=00_AYD5Lkef9YwUpybIjgf5Fmd8L3jfObqW2Xj6LFywdleQ7g&oe=66E87960",
    },
    {
      id: 2,
      name: "Câu Lạc Bộ Truyền Thống Cóc Sài Gòn",
      floor: "2",
      image:
        "https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-6/432447864_743677024565608_7538420170834029906_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=NWKqqhr3J2AQ7kNvgGI-WRW&_nc_ht=scontent.fsgn5-10.fna&oh=00_AYBMJEex-S8qsZaF6bf8jU4Z3nIooVfj2k7mLzIGwYVGbQ&oe=66E84CFE",
    },
    {
      id: 3,
      name: "Cộng Đồng Sinh Viên Tỉnh Nguyễn SITIGROUP",
      floor: "2",
      image:
        "https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-6/345904341_693634572567727_3208368438343116722_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=gEdBz4uMlj4Q7kNvgE6srcI&_nc_ht=scontent.fsgn5-14.fna&_nc_gid=AAeJWbkMECE93cxKsIe_ZoT&oh=00_AYAUMQLPh2XvNqnw8x5mLhlSW1Ymxmi21SijJ3hmEZ83aQ&oe=66E86AA5",
    },
  ];

  return (
    <Box
      padding="20px"
      bgGradient="linear(to-r, #d4f1f4, #f0e5d8)"
      minH="100vh"
    >
      {/* Event Introduction */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={10} mb={10}>
        <VStack align="flex-start" spacing={10}>
          <Text fontSize="4xl" fontWeight="bold" color="black">
            Mid Autumn Event
          </Text>
          <div
            style={{
              width: "45%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Text fontSize="lg" fontWeight="bold" color="gray.600">
              Sep 20 - 24, 2024
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="gray.600">
              08:00 AM
            </Text>
          </div>

          <Button colorScheme="teal" size="lg" onClick={handleShopClick}>
            Shop
          </Button>
        </VStack>
        <Image
          src="https://th.bing.com/th/id/OIP.r4JVdCs4t-lvJ5FQt53giAHaEu?rs=1&pid=ImgDetMain"
          alt="Mid Autumn Event"
          borderRadius="lg"
          boxShadow="lg"
        />
      </Grid>

      <Divider borderColor="gray.300" borderWidth="1px" mb={10} />

      {/* Introduction Text */}
      <Text fontSize="md" color="gray.600" mb={10}>
        Welcome to the Mid-Autumn Festival 2024, where we come together to
        celebrate the full moon and immerse ourselves in the warm, vibrant
        atmosphere of autumn. With the theme "Harmony Under the Moonlight," this
        year's event promises to bring you and your family a culturally rich and
        meaningful experience.
      </Text>

      <Divider borderColor="gray.300" borderWidth="1px" mb={10} />

      {/* Existing Shops */}
      <Text fontSize="2xl" fontWeight="bold" color="black" mb={4}>
        Existing Shop
      </Text>
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={6}
        mb={10}
      >
        {groups.map((group) => (
          <Box
            key={group.id}
            bg="white"
            borderRadius="lg"
            boxShadow="md"
            overflow="hidden"
            _hover={{
              boxShadow: "lg",
              transform: "scale(1.02)",
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Image
              src={group.image}
              alt={group.name}
              height="200px"
              width="100%"
              objectFit="cover"
            />
            <Box p={4}>
              <Text fontWeight="bold" mb={2} fontSize="xl">
                {group.name}
              </Text>
              <HStack spacing={2}>
                <Text color="gray.500" fontSize="sm" fontWeight="bold">
                  FLOOR {group.floor}
                </Text>
              </HStack>
            </Box>
          </Box>
        ))}
      </Grid>

      <Divider borderColor="gray.300" borderWidth="1px" mb={10} />

      {/* Select Booth Section */}
      <Text fontSize="2xl" fontWeight="bold" color="black" mb={4}>
        Select Booth
      </Text>
      {/* Render the SelectBooth component directly in the page */}
      <Box>
        <SelectBooth boothData={boothData} setBoothData={setBoothData} />
      </Box>

      <Divider borderColor="gray.300" borderWidth="1px" mb={10} />

      {/* Location Section */}
      <Text fontSize="2xl" fontWeight="bold" color="black" mb={4}>
        Location
      </Text>
      <div style={{ width: "100%", height: "300px", marginBottom: "20px" }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6100105370224!2d106.8073080746704!3d10.84112758931162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2sFPT%20University%20HCMC!5e0!3m2!1sen!2s!4v1726308048313!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="FPT University HCMC Map"
        ></iframe>
      </div>
    </Box>
  );
};

export default EventEnrolled;
