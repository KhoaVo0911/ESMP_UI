import React, { useState, useEffect } from "react";
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
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../shared/auth/AuthContext";
import { pollNotifications } from "../../shared/notificationService";
import NotificationList from "../../components/host/NotificationList";
import UpdateApiBanking from "./UpdateApiBanking"; // Import the UpdateApiBanking component
import Notification from "./HostNotification";
import axios from "axios";
const HostHeader = ({ collapsed }) => {
  const location = useLocation();
  const { currentUser, logout } = useAuth(); // Lấy thông tin người dùng từ AuthContext
  const hostId = sessionStorage.getItem("hostId");
  const [unreadCount, setUnreadCount] = useState(0);
  const [userId, setUserId] = useState(null);
  // Modal Disclosure for UpdateApiBanking
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        if (!hostId) {
          console.error("host ID is missing in session storage.");
          return;
        }

        const response = await axios.get(
          `https://esmpbe.id.vn/api/host/${hostId}`
        );

        console.log("API Response:", response.data); // Log full response to verify data

        if (response.data && response.data.userid) {
          setUserId(response.data.userid);
          console.log("User ID found:", response.data.userid);
        } else {
          console.warn("No user ID found for hostId:", hostId);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, [hostId]);

  const handleNewNotifications = (newCount) => {
    setUnreadCount(newCount);
  };

  // Handle opening notifications (mark them as read)
  const handleOpenNotifications = () => {
    setUnreadCount(0); // Reset unread count
  };

  const getPageTitle = () => {
    if (location.pathname.startsWith(`/${hostId}/dashboard`)) {
      return "Dashboard";
    } else if (location.pathname.startsWith("/events")) {
      return "Event Management";
    } else if (location.pathname.startsWith("/accounts")) {
      return "Account Managers";
    } else if (location.pathname.startsWith("/eventconfig")) {
      return "Event Config";
    } else if (location.pathname.includes("/eventpayment")) {
      return "Payment List";
    } else if (location.pathname.includes("/booth-plan")) {
      return "Booth Plan";
    } else if (location.pathname.includes("/location-type")) {
      return "Location Type";
    } else if (location.pathname.startsWith("/settings")) {
      return "Settings";
    } else if (location.pathname.startsWith("/packages")) {
      return "Packages";
    } else if (location.pathname.includes("/extensionEvent")) {
      return "Extension Event";
    } else if (location.pathname.includes("/package-trans")) {
      return "Packages Transaction History";
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
              <Avatar size="sm" name={currentUser?.name} bg="blue.500" mr={2} />
            </Flex>
          </MenuButton>
          <MenuList boxShadow="lg" borderRadius="lg" padding="12px">
            <MenuItem fontSize="md" fontWeight="700" color="gray.700">
              👋 Hey, {currentUser?.name || "Host"}
            </MenuItem>
            <MenuItem
              fontSize="md"
              fontWeight="700"
              color="red.500"
              onClick={logout}
            >
              Log out
            </MenuItem>
            <MenuItem
              fontSize="md"
              fontWeight="700"
              color="blue.500"
              onClick={onOpen} // Open the UpdateApiBanking modal
            >
              Update API Banking
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
              top="0"
              right="-5px"
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

      {/* Modal for Update API Banking */}
      <UpdateApiBanking isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default HostHeader;
