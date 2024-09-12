import React from "react";
import {
  Box,
  Grid,
  Text,
  Button,
  Image,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { ArrowBack } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

const EventPage = () => {
  const location = useLocation();
  const { event } = location.state || {};

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/eventsVendor", { state: { selectedMenuItem: "4" } });
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
      name: "Câu Lạc Bộ Truyền Thống Cócc Sài Gòn",
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
      bgGradient="linear(to-r, #d4f1f4, #d4f1f4, #f0e5d8)"
      minH="100vh"
    >
      <ArrowBack
        onClick={handleBackClick}
        style={{
          cursor: "pointer",
          fontSize: "24px",
          marginRight: "10px",
          marginBottom: "20px",
        }}
      />
      {/* Tiêu đề sự kiện */}
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

          <Button colorScheme="teal" size="lg">
            ENROLL
          </Button>
        </VStack>
        <Image
          src="https://th.bing.com/th/id/OIP.r4JVdCs4t-lvJ5FQt53giAHaEu?rs=1&pid=ImgDetMain"
          alt="Mid Autumn Event"
          borderRadius="lg"
          boxShadow="lg"
        />
      </Grid>

      {/* Nhóm sự kiện */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
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
              width={"100%"}
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
    </Box>
  );
};

export default EventPage;
