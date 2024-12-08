// import React, { useState } from "react";
// import {
//   Box,
//   VStack,
//   Icon,
//   Text,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
// } from "@chakra-ui/react";
// import { MdAddBox, MdTextFields, MdOutlineFormatShapes } from "react-icons/md";
// import { FaSquare, FaCircle, FaStar, FaArrowUp } from "react-icons/fa";
// import {
//   BsFillPentagonFill,
//   BsFillHexagonFill,
//   BsFillTriangleFill,
// } from "react-icons/bs";

// const Sidebar = ({
//   openBoothModal,
//   addShape,

//   addText,
// }) => {
//   return (
//     <Box
//       p={2}
//       borderRight="1px solid"
//       borderColor="gray.200"
//       bg="white"
//       height="100vh"
//       display="flex"
//       justifyContent="center"
//     >
//       <VStack spacing={4} justifyContent="center" alignItems="center">
//         <Box
//           as="button"
//           onClick={openBoothModal}
//           display="flex"
//           flexDirection="column"
//           alignItems="center"
//         >
//           <Icon as={MdAddBox} boxSize={6} />
//           <Text>Booth</Text>
//         </Box>

//         <Box
//           as="button"
//           onClick={addText}
//           display="flex"
//           flexDirection="column"
//           alignItems="center"
//         >
//           <Icon as={MdTextFields} boxSize={6} />
//           <Text>Text</Text>
//         </Box>

//         <Menu>
//           <MenuButton
//             as={Box}
//             display="flex"
//             flexDirection="column"
//             alignItems="center"
//             cursor="pointer"
//           >
//             <Icon as={MdOutlineFormatShapes} boxSize={6} />
//             <Text>Shape</Text>
//           </MenuButton>
//           <MenuList>
//             <MenuItem icon={<FaSquare />} onClick={() => addShape("rectangle")}>
//               Rectangle
//             </MenuItem>
//             <MenuItem icon={<FaCircle />} onClick={() => addShape("circle")}>
//               Circle
//             </MenuItem>
//             <MenuItem
//               icon={<BsFillPentagonFill />}
//               onClick={() => addShape("pentagon")}
//             >
//               Pentagon
//             </MenuItem>
//             <MenuItem
//               icon={<BsFillHexagonFill />}
//               onClick={() => addShape("hexagon")}
//             >
//               Hexagon
//             </MenuItem>
//             <MenuItem
//               icon={<BsFillTriangleFill />}
//               onClick={() => addShape("triangle")}
//             >
//               Triangle
//             </MenuItem>
//             <MenuItem icon={<FaStar />} onClick={() => addShape("star")}>
//               Star
//             </MenuItem>
//             <MenuItem icon={<FaArrowUp />} onClick={() => addShape("arrow")}>
//               Arrow
//             </MenuItem>
//           </MenuList>
//         </Menu>
//       </VStack>
//     </Box>
//   );
// };

// export default Sidebar;

import React, { useState } from "react";
import {
  Box,
  VStack,
  Icon,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { MdAddBox, MdTextFields, MdOutlineFormatShapes } from "react-icons/md";
import { FaSquare, FaCircle, FaStar, FaArrowUp } from "react-icons/fa";
import {
  BsFillPentagonFill,
  BsFillHexagonFill,
  BsFillTriangleFill,
} from "react-icons/bs";

const Sidebar = ({
  setMode,
  openAdd5BoothsModal,
  openBoothModal,
  addShape,
  addText,
}) => {
  return (
    <Box
      p={2}
      borderRight="1px solid"
      borderColor="gray.200"
      bg="white"
      height="100vh"
      display="flex"
      justifyContent="center"
    >
      <VStack spacing={4} justifyContent="center" alignItems="center">
        <Box
          as="button"
          onClick={openBoothModal}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Icon as={MdAddBox} boxSize={6} />
          <Text>Booth</Text>
        </Box>
        {/* Add 5 Booths Button */}
        <Box
          as="button"
          onClick={openAdd5BoothsModal}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Icon as={MdAddBox} boxSize={6} />
          <Text>Add 5 Booths</Text>
        </Box>

        <Box
          as="button"
          onClick={addText}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Icon as={MdTextFields} boxSize={6} />
          <Text>Text</Text>
        </Box>

        <Menu>
          <MenuButton
            as={Box}
            display="flex"
            flexDirection="column"
            alignItems="center"
            cursor="pointer"
          >
            <Icon as={MdOutlineFormatShapes} boxSize={6} />
            <Text>Shape</Text>
          </MenuButton>
          <MenuList>
            <MenuItem icon={<FaSquare />} onClick={() => addShape("rectangle")}>
              Rectangle
            </MenuItem>
            <MenuItem icon={<FaCircle />} onClick={() => addShape("circle")}>
              Circle
            </MenuItem>
            <MenuItem
              icon={<BsFillPentagonFill />}
              onClick={() => addShape("pentagon")}
            >
              Pentagon
            </MenuItem>
            <MenuItem
              icon={<BsFillHexagonFill />}
              onClick={() => addShape("hexagon")}
            >
              Hexagon
            </MenuItem>
            <MenuItem
              icon={<BsFillTriangleFill />}
              onClick={() => addShape("triangle")}
            >
              Triangle
            </MenuItem>
            <MenuItem icon={<FaStar />} onClick={() => addShape("star")}>
              Star
            </MenuItem>
            <MenuItem icon={<FaArrowUp />} onClick={() => addShape("arrow")}>
              Arrow
            </MenuItem>
          </MenuList>
        </Menu>
      </VStack>
    </Box>
  );
};

export default Sidebar;
