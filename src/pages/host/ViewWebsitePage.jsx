import React, { useState } from "react";
import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  Heading,
  Grid,
  GridItem,
  Divider,
} from "@chakra-ui/react";
import { useDrag, useDrop } from "react-dnd"; // Thêm thư viện drag and drop

import shop1 from "../../assets/images/shop1.png";
import shop2 from "../../assets/images/shop2.png";
import shop3 from "../../assets/images/shop3.png";
import sk1 from "../../assets/images/sk1.png";

// Item type for DnD
const ItemTypes = {
  BOOTH: "booth",
};

const Booth = ({ id, name, onClick, position }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOOTH,
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <Box
      ref={drag}
      bg={isDragging ? "gray.400" : "red.400"}
      w="100%"
      h="100px"
      borderRadius="lg"
      cursor="move"
      onClick={() => onClick(name, position)}
    />
  );
};

const BoothDropZone = ({ id, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.BOOTH,
    drop: (item) => onDrop(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <Box
      ref={drop}
      bg={isOver ? "gray.200" : "gray.300"}
      w="100%"
      h="100px"
      borderRadius="lg"
    />
  );
};

const ViewWebsite = () => {
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [boothInfo, setBoothInfo] = useState("");

  const handleBoothClick = (name, position) => {
    setSelectedBooth(name);
    setBoothInfo(`Booth ${name} at position ${position}`);
  };

  const handleDrop = (boothId) => {
    console.log(`Booth ${boothId} dropped in position`);
  };

  return (
    <Box bg="#F8FAFF" p={8} minH="100vh">
      {/* Phần tiêu đề và hình ảnh */}
      <Flex justifyContent="space-between" alignItems="center" mb={8}>
        <Box>
          <Heading as="h1" size="xl" mb={4} color="purple.900">
            Mid Autumn Event
          </Heading>
          <Flex>
            <Text mr={4} fontSize="lg" color="gray.600">
              Sep 20 - 24, 2024
            </Text>
            <Text fontSize="lg" color="gray.600">
              08:00 AM
            </Text>
          </Flex>
        </Box>
        <Box>
          <Image
            src={sk1}
            alt="Mid Autumn Event"
            boxSize="200px"
            objectFit="cover"
            borderRadius="md"
          />
        </Box>
      </Flex>

      <Divider my={6} borderColor="gray.300" />

      {/* Nút SHOP */}
      <Box textAlign="center" mb={8}>
        <Button bg="#F2F3F7" color="black" size="lg">
          SHOP
        </Button>
      </Box>

      <Divider my={6} borderColor="gray.300" />

      {/* Mô tả sự kiện */}
      <Box textAlign="center" maxW="800px" mx="auto" mb={8}>
        <Text fontSize="lg" color="gray.700" fontWeight="medium">
          Welcome to the Mid-Autumn Festival 2024, where we come together to
          celebrate the full moon and immerse ourselves in the warm, vibrant
          atmosphere of autumn. With the theme "Harmony Under the Moonlight,"
          this year’s event promises to bring you and your family a culturally
          rich and meaningful experience.
        </Text>
      </Box>

      <Divider my={6} borderColor="gray.300" />

      <Box mb={8}>
        <Heading as="h3" size="lg" mb={4} color="purple.900">
          Existing Shop
        </Heading>
        {/* Lưới shop hiện tại */}
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          <GridItem>
            <Box bg="white" p={4} borderRadius="lg" textAlign="center">
              <Image src={shop1} alt="Shop 1" mb={2} />
              <Text fontSize="md" fontWeight="bold" color="gray.800">
                FPTU Event Club - The Way We Went
              </Text>
              <Text fontSize="sm" color="gray.600">
                Floor: 2
              </Text>
            </Box>
          </GridItem>
          <GridItem>
            <Box bg="white" p={4} borderRadius="lg" textAlign="center">
              <Image src={shop2} alt="Shop 2" mb={2} />
              <Text fontSize="md" fontWeight="bold" color="gray.800">
                Câu Lạc Bộ Truyền Thông Cốc Sài Gòn
              </Text>
              <Text fontSize="sm" color="gray.600">
                Floor: 2
              </Text>
            </Box>
          </GridItem>
          <GridItem>
            <Box bg="white" p={4} borderRadius="lg" textAlign="center">
              <Image src={shop3} alt="Shop 3" mb={2} />
              <Text fontSize="md" fontWeight="bold" color="gray.800">
                Cộng Đồng Sinh Viên Tình Nguyện SitiGroup
              </Text>
              <Text fontSize="sm" color="gray.600">
                Floor: 2
              </Text>
            </Box>
          </GridItem>
        </Grid>
      </Box>

      <Divider my={6} borderColor="gray.300" />

      {/* Phần chọn Booth */}
      <Box mb={8}>
        <Heading as="h3" size="lg" mb={4} color="purple.900">
          Select Booth
        </Heading>
        <Flex justifyContent="center" mb={4}>
          <Flex alignItems="center" mr={8}>
            <Box bg="red.400" w={4} h={4} borderRadius="50%" mr={2}></Box>
            <Text fontSize="md" color="gray.800">
              Available
            </Text>
          </Flex>
          <Flex alignItems="center" mr={8}>
            <Box bg="gray.300" w={4} h={4} borderRadius="50%" mr={2}></Box>
            <Text fontSize="md" color="gray.800">
              Unavailable
            </Text>
          </Flex>
          <Flex alignItems="center">
            <Box bg="red.800" w={4} h={4} borderRadius="50%" mr={2}></Box>
            <Text fontSize="md" color="gray.800">
              Selected
            </Text>
          </Flex>
        </Flex>

        {/* Kéo thả booth */}
        <Grid templateColumns="repeat(4, 1fr)" gap={4} justifyContent="center">
          <GridItem>
            <Booth
              id="1"
              name="Booth 1"
              onClick={handleBoothClick}
              position="1"
            />
          </GridItem>
          <GridItem>
            <BoothDropZone id="2" onDrop={handleDrop} />
          </GridItem>
          <GridItem>
            <BoothDropZone id="3" onDrop={handleDrop} />
          </GridItem>
          <GridItem>
            <Booth
              id="2"
              name="Booth 2"
              onClick={handleBoothClick}
              position="4"
            />
          </GridItem>
        </Grid>
      </Box>

      <Divider my={6} borderColor="gray.300" />

      {/* Phần bản đồ */}
      <Box mb={8}>
        <Heading as="h3" size="lg" mb={4} color="purple.900">
          Location
        </Heading>
        <Box w="100%" h="400px" borderRadius="lg" overflow="hidden">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps/embed/v1/place?q=FPT+University,+Ho+Chi+Minh+City,+Vietnam&key=YOUR_GOOGLE_MAPS_API_KEY`}
            allowFullScreen
            title="Event Location"
          />
        </Box>
      </Box>

      {/* Hiển thị thông tin booth */}
      {selectedBooth && (
        <Box mt={8} p={4} bg="gray.100" borderRadius="md">
          <Text>{boothInfo}</Text>
        </Box>
      )}
    </Box>
  );
};

export default ViewWebsite;
