// Booth.js
import React from "react";
import { Box, Text } from "@chakra-ui/react";

const Booth = ({ booth }) => {
  return (
    <Box
      className={booth.selected ? "selected" : ""}
      bg="blue.200"
      border="1px solid black"
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      pointerEvents="auto"
    >
      <Text textAlign="center">{booth.name}</Text>
    </Box>
  );
};

export default Booth;

// Booth.js
// import React from "react";
// import { Box, Text } from "@chakra-ui/react";

// // Màu sắc cho từng loại booth
// const typeIdToColor = {
//   1: "#FF5733", // Indoor
//   2: "#33FF57", // Outdoor
//   // Thêm màu cho các loại booth khác ở đây
// };

// const Booth = ({ booth }) => {
//   const boothColor = typeIdToColor[booth.typeId] || "#FFFFFF"; // Lấy màu sắc từ typeId

//   return (
//     <Box
//       className={booth.selected ? "selected" : ""}
//       bg={boothColor} // Áp dụng màu sắc cho nền của booth
//       border="1px solid black"
//       width="100%"
//       height="100%"
//       display="flex"
//       alignItems="center"
//       justifyContent="center"
//       pointerEvents="auto"
//     >
//       <Text textAlign="center">{booth.name}</Text>
//     </Box>
//   );
// };

// export default Booth;
