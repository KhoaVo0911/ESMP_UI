import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Badge,
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/auth/AuthContext";
import axios from "axios";
import Notification from "./Notification";

const VendorHeader = ({ collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const vendorName = sessionStorage.getItem("vendorName");
  const vendorId = sessionStorage.getItem("vendorId");
  const [userId, setUserId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const hostId = sessionStorage.getItem("hostId");
        const response = await axios.get(
          `https://esmpbe.id.vn/api/vendor/host/${hostId}`
        );

        const vendor = response.data.find((v) => v.vendorid === vendorId);
        if (vendor) {
          setUserId(vendor.userid);
        }
      } catch (error) {
        console.error("Failed to fetch vendor info:", error);
      }
    };

    if (vendorId) {
      fetchUserId();
    }
  }, [vendorId]);

  const handleNewNotifications = (newCount) => {
    setUnreadCount(newCount);
  };

  const handleOpenNotifications = () => {
    setUnreadCount(0); // Reset số thông báo chưa đọc
  };

  const getPageTitle = () => {
    if (location.pathname.startsWith("/dashboard")) {
      return "Dashboard";
    } else if (location.pathname.startsWith("/productsList")) {
      return "List of Products";
    } else if (location.pathname.startsWith("/productSample")) {
      return "Manage Product Items";
    } else if (location.pathname.startsWith("/Transaction")) {
      return "Transaction";
    } else if (location.pathname.startsWith("/eventsVendor")) {
      return "Events List";
    } else if (location.pathname.startsWith("/shop")) {
      return "Shop";
    } else if (location.pathname.startsWith("/ordered-list")) {
      return "Shop";
    } else if (location.pathname.startsWith("/payment")) {
      return "Shop";
    } else if (location.pathname.startsWith("/qrcodecodecode")) {
      return "Setting QR Code";
    }
    else if (location.pathname.startsWith("/staff-account-manager")) {
      return "Staff Accounts";
    }
    return "Event Information";
  };

  return (
    <Box
      as="header"
      bg="rgba(255, 255, 255, 0.2)"
      boxShadow="0px 4px 12px rgba(0, 0, 0, 0.05)"
      padding="16px"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      position="sticky"
      top="0"
      zIndex="1000"
      border="1px solid rgba(200, 200, 200, 0.3)"
      backdropFilter="blur(12px)"
      borderRadius="16px"
      marginLeft="40px"
      width="calc(100% - 75px)"
    >
      <Flex direction="column" alignItems="flex-start" ml={8}>
        <Text fontSize="sm" fontWeight="medium" color="gray.500" mb="2px">
          Menu / {getPageTitle()}
        </Text>
        <Text fontSize="2xl" fontWeight="bold" color="#1B2559">
          {getPageTitle()}
        </Text>
      </Flex>

      <Flex alignItems="center" position="relative">

      
      </Flex>
      <Flex alignItems="center" position="relative">  <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            bg="transparent"
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
            _focus={{ boxShadow: "none" }}
          >
            <Flex alignItems="center">
              <Avatar size="sm" name="Vendor" bg="blue.500" mr={2} />
            </Flex>
          </MenuButton>
          <MenuList boxShadow="lg" borderRadius="lg" padding="12px">
            <MenuItem fontSize="md" fontWeight="700" color="gray.700">
              👋 Hey, {vendorName}
            </MenuItem>
            <MenuItem
              fontSize="md"
              fontWeight="700"
              color="gray.700"
              onClick={() => navigate("/qrcodecodecode")}
            >
              Generate QR Code
            </MenuItem>
            <MenuItem
              fontSize="md"
              fontWeight="700"
              color="red.500"
              onClick={logout}
            >
              Log out
            </MenuItem>
          </MenuList>
        </Menu>
  <Menu>
    <MenuButton
      as={IconButton}
      aria-label="Notifications"
      icon={<BellIcon />}
      variant="ghost"
      fontSize="24px"
      color="gray.600"
      position="relative"
    />
    {unreadCount > 0 && (
      <Badge
        colorScheme="red"
        borderRadius="full"
        fontSize="12px"
        position="absolute"
        top="0" // Đẩy badge lên góc trên
        right="-5px" // Đẩy badge sang phải
        width="20px"
        height="20px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontWeight="bold"
        backgroundColor="red.500"
        color="white"
      >
        {unreadCount}
      </Badge>
    )}
    <MenuList boxShadow="lg" borderRadius="lg" p={0}>
      {userId ? (
        <Notification
          userId={userId}
          onNewNotifications={handleNewNotifications}
          onOpenNotifications={handleOpenNotifications}
        />
      ) : (
        <Box p={4}>
          <Text fontSize="sm" color="gray.500">
            Loading notifications...
          </Text>
        </Box>
      )}
    </MenuList>
  </Menu>
</Flex>

    </Box>
  );
};

export default VendorHeader;
