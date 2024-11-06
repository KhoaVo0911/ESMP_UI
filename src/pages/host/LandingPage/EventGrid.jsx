import { Box, Grid, Heading, Image, Text } from "@chakra-ui/react";

const FoodGrid = () => {
  const foodItems = [
    {
      name: "Hamburger",
      image:
        "https://th.bing.com/th/id/OIP.KomAB7rg-OCyK3QEDO81fwHaEn?w=305&h=190&c=7&r=0&o=5&pid=1.7", // Thay bằng đường dẫn ảnh thực tế
    },
    {
      name: "Pasta",
      image:
        "https://th.bing.com/th/id/OIP.zHlfUSrRK43bOCSf-dk71gHaE8?rs=1&pid=ImgDetMain", // Thay bằng đường dẫn ảnh thực tế
    },
    {
      name: "Wrap",
      image:
        "https://th.bing.com/th/id/OIP.IFzsTC5lK000n2hqul99swHaEK?rs=1&pid=ImgDetMain", // Thay bằng đường dẫn ảnh thực tế
    },
    {
      name: "Chi Chi Chanh Chanh",
      image:
        "https://i.pinimg.com/736x/0c/8e/76/0c8e7608c6c0af65c8378e82ad633911.jpg", // Thay bằng đường dẫn ảnh thực tế
    },
    {
      name: "Dance Event",
      image:
        "https://th.bing.com/th/id/OIP.wmqq4KVW_p0HN4kbts1TGwHaJX?rs=1&pid=ImgDetMain", // Thay bằng đường dẫn ảnh thực tế
    },
    {
      name: "Nhạc hội",
      image:
        "https://danangfantasticity.com/wp-content/uploads/2023/07/29.7-POSTER-CHINH-copy-819x1024.jpg", // Thay bằng đường dẫn ảnh thực tế
    },
  ];

  return (
    <Box maxWidth="1200px" margin="0 auto" p={4}>
      {" "}
      {/* Giới hạn chiều rộng và căn giữa */}
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {foodItems.map((item, index) => (
          <Box
            key={index}
            position="relative"
            overflow="hidden"
            role="group" // Để kích hoạt hover
          >
            {/* Hình ảnh */}
            <Image
              src={item.image}
              alt={item.name}
              style={{ width: "100%" }}
              transition="all 0.3s ease-in-out"
              _groupHover={{
                filter: "blur(4px)", // Làm mờ hình ảnh khi hover
                transform: "scale(1.1)", // Phóng to nhẹ khi hover
                width: "100%",
              }}
            />

            {/* Overlay mờ với chữ */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="rgba(0, 0, 0, 0.6)" // Màu nền mờ đen
              opacity={0}
              transition="all 0.3s ease-in-out"
              _groupHover={{ opacity: 1 }} // Hiện ra khi hover
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="2xl" fontWeight="bold" color="white">
                {item.name}
              </Text>
            </Box>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default FoodGrid;
