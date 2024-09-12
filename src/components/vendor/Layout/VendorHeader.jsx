import React from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { SearchIcon, BellIcon, InfoIcon, MoonIcon } from "@chakra-ui/icons";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useLocation } from "react-router-dom";

const VendorHeader = ({ collapsed }) => {
  const location = useLocation();

  // Lấy tiêu đề của trang dựa trên đường dẫn hiện tại
  const getPageTitle = () => {
    if (location.pathname.startsWith("/dashboard")) {
      return "Dashboard";
    } else if (location.pathname.startsWith("/listProducts")) {
      return "List Products";
    } else if (location.pathname.startsWith("/ManageProductItems")) {
      return "Manage Product Items";
    }
    return "Event Information"; // Tiêu đề dự phòng
  };

  return (
    <Box
      as="header"
      bg="rgba(255, 255, 255, 0.2)" // Nền có độ mờ
      boxShadow="0px 4px 12px rgba(0, 0, 0, 0.05)"
      padding="16px"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      position="sticky"
      top="0"
      zIndex="1000"
      border="1px solid rgba(200, 200, 200, 0.3)" // Viền nhẹ
      backdropFilter="blur(12px)" // Hiệu ứng blur
      borderRadius="16px"
      marginLeft="40px" // Dịch header sang phải, tránh chạm vào sidebar
      width="calc(100% - 75px)" // Tự động điều chỉnh kích thước theo độ rộng của sidebar
    >
      <Flex alignItems="center" ml={8}>
        {" "}
        {/* Thêm khoảng cách để tránh bị dính vào sidebar */}
        <Text fontSize="sm" fontWeight="medium" mr={4} color="gray.500">
          Menu / {getPageTitle()}
        </Text>
        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
          {getPageTitle()}
        </Text>
      </Flex>

      <Flex alignItems="center">
        {/* Ô tìm kiếm */}
        <Box position="relative" mr={4} width="240px">
          <Input
            placeholder="Search..."
            size="md"
            borderRadius="full"
            paddingLeft="40px"
            boxShadow="sm"
            _placeholder={{ color: "gray.400" }}
          />
          <SearchIcon position="absolute" left={4} top={3} color="gray.400" />
        </Box>
        <IconButton
          aria-label="Notifications"
          icon={<BellIcon />}
          variant="ghost"
          fontSize="20px"
          color="gray.600"
          mr={1}
        />
        {/* Dropdown cho Avatar người dùng */}
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            bg="transparent"
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
            _focus={{ boxShadow: "none" }}
          >
            <Flex alignItems="center">
              <Avatar size="sm" name="Host" bg="blue.500" mr={2} />
            </Flex>
          </MenuButton>
          <MenuList boxShadow="lg" borderRadius="lg" padding="12px">
            <MenuItem fontSize="md" fontWeight="700" color="gray.700">
              👋 Hey, "..."
            </MenuItem>
            <MenuItem fontSize="md" fontWeight="700" color="red.500">
              Log out
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};

export default VendorHeader;
