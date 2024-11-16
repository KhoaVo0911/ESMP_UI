import React from "react";
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
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../shared/auth/AuthContext";

const HostHeader = ({ collapsed }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const getPageTitle = () => {
    if (location.pathname.startsWith("/dashboard")) {
      return "Dashboard";
    } else if (location.pathname.startsWith("/events")) {
      return "Event Management";
    } else if (location.pathname.startsWith("/accounts")) {
      return "Account Managers";
    } else if (location.pathname.startsWith("/eventconfig")) {
      return "Event Config";
    } else if (location.pathname.includes("/transactions")) {
      return "Transaction";
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

      <Flex alignItems="center">
        <IconButton
          aria-label="Notifications"
          icon={<BellIcon />}
          variant="ghost"
          fontSize="20px"
          color="gray.600"
          mr={4}
        />

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
              👋 Hey, Host
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
      </Flex>
    </Box>
  );
};

export default HostHeader;
