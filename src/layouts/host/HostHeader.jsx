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

const HostHeader = ({ collapsed }) => {
  const location = useLocation();
  const { currentUser, logout } = useAuth(); // Lấy thông tin người dùng từ AuthContext

  const hostId = sessionStorage.getItem("hostId");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const userId = sessionStorage.getItem("userId"); // Lấy userId từ currentUser

  // Modal Disclosure for UpdateApiBanking
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!userId) {
      console.warn("No userId found, skipping notification polling");
      return;
    }

    let pollingInterval;

    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const data = await pollNotifications(userId);
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.status).length); // Đếm thông báo chưa đọc
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Bắt đầu polling với setInterval
    pollingInterval = setInterval(() => {
      fetchNotifications();
    }, 2000); // 2 giây mỗi lần

    // Cleanup khi unmount
    return () => {
      clearInterval(pollingInterval);
    };
  }, [userId]);

  const markAsRead = (notificationId) => {
    // Đánh dấu thông báo là đã đọc
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, status: true } : n))
    );
    setUnreadCount((prev) => Math.max(prev - 1, 0));
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
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Notifications"
            icon={<BellIcon />}
            variant="ghost"
            fontSize="20px"
            color="gray.600"
            mr={4}
            position="relative"
          >
            {unreadCount > 0 && (
              <Badge
                colorScheme="red"
                borderRadius="full"
                position="absolute"
                top="-3px"
                right="-3px"
                fontSize="10px"
                px={2}
                py={1}
              >
                {unreadCount}
              </Badge>
            )}
          </MenuButton>

          <MenuList maxW="400px" maxH="300px" overflowY="auto">
            {isLoading ? (
              <Flex justifyContent="center" alignItems="center" p={4}>
                <Spinner size="md" color="blue.500" />
              </Flex>
            ) : notifications && notifications.length > 0 ? (
              <NotificationList
                notifications={notifications}
                onMarkAsRead={markAsRead}
              />
            ) : (
              <Flex justifyContent="center" alignItems="center" p={4}>
                <Text fontSize="sm" color="gray.500">
                  No new notifications
                </Text>
              </Flex>
            )}
          </MenuList>
        </Menu>

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
      </Flex>

      {/* Modal for Update API Banking */}
      <UpdateApiBanking isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default HostHeader;

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Flex,
//   Text,
//   IconButton,
//   Avatar,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   Button,
//   Badge,
//   Spinner,
//   useDisclosure,
// } from "@chakra-ui/react";
// import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
// import { useLocation } from "react-router-dom";
// import { useAuth } from "../../shared/auth/AuthContext";
// import { pollNotifications } from "../../shared/notificationService";
// import NotificationList from "../../components/host/NotificationList";
// import UpdateApiBanking from "./UpdateApiBanking"; // Import the UpdateApiBanking component
// import axios from "axios"; // Ensure axios is imported

// const HostHeader = ({ collapsed }) => {
//   const location = useLocation();
//   const { currentUser, logout } = useAuth(); // Lấy thông tin người dùng từ AuthContext

//   const hostId = sessionStorage.getItem("hostId");
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [eventName, setEventName] = useState(""); // State to store event name

//   const userId = sessionStorage.getItem("userId"); // Lấy userId từ currentUser

//   // Modal Disclosure for UpdateApiBanking
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   // Fetch event name from API when component mounts or when hostId changes
//   useEffect(() => {
//     if (!hostId) {
//       console.warn("No hostId found, skipping event name fetch");
//       return;
//     }

//     const fetchEventName = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axios.get(`/api/event/host/${hostId}`);
//         const event = response.data; // Assuming the response is an object containing event data
//         setEventName(event.name); // Set the event name in state
//       } catch (error) {
//         console.error("Error fetching event name:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchEventName();
//   }, [hostId]); // Re-run the effect if hostId changes

//   useEffect(() => {
//     if (!userId) {
//       console.warn("No userId found, skipping notification polling");
//       return;
//     }

//     let pollingInterval;

//     const fetchNotifications = async () => {
//       setIsLoading(true);
//       try {
//         const data = await pollNotifications(userId);
//         setNotifications(data);
//         setUnreadCount(data.filter((n) => !n.status).length); // Đếm thông báo chưa đọc
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     // Bắt đầu polling với setInterval
//     pollingInterval = setInterval(() => {
//       fetchNotifications();
//     }, 2000); // 2 giây mỗi lần

//     // Cleanup khi unmount
//     return () => {
//       clearInterval(pollingInterval);
//     };
//   }, [userId]);

//   const markAsRead = (notificationId) => {
//     // Đánh dấu thông báo là đã đọc
//     setNotifications((prev) =>
//       prev.map((n) => (n.id === notificationId ? { ...n, status: true } : n))
//     );
//     setUnreadCount((prev) => Math.max(prev - 1, 0));
//   };

//   // Function to get the page title, now including the event name
//   const getPageTitle = () => {
//     if (location.pathname.includes("/eventpayment")) {
//       return eventName ? `Payment List - ${eventName}` : "Payment List";
//     } else if (location.pathname.includes("/booth-plan")) {
//       return eventName ? `Booth Plan - ${eventName}` : "Booth Plan";
//     } else if (location.pathname.includes("/extensionEvent")) {
//       return eventName ? `Extension Event - ${eventName}` : "Extension Event";
//     }

//     // Các điều kiện hiển thị tiêu đề mặc định
//     if (location.pathname.startsWith(`/${hostId}/dashboard`)) {
//       return "Dashboard";
//     } else if (location.pathname.startsWith("/events")) {
//       return "Event Management";
//     } else if (location.pathname.startsWith("/accounts")) {
//       return "Account Managers";
//     } else if (location.pathname.startsWith("/eventconfig")) {
//       return "Event Config";
//     } else if (location.pathname.includes("/location-type")) {
//       return "Location Type";
//     } else if (location.pathname.startsWith("/settings")) {
//       return "Settings";
//     } else if (location.pathname.startsWith("/packages")) {
//       return "Packages";
//     }

//     return "Event Information";
//   };

//   return (
//     <Box
//       as="header"
//       bg="rgba(255, 255, 255, 0.2)"
//       boxShadow="0px 4px 12px rgba(0, 0, 0, 0.05)"
//       padding="16px"
//       display="flex"
//       justifyContent="space-between"
//       alignItems="center"
//       position="sticky"
//       top="0"
//       zIndex="1000"
//       border="1px solid rgba(200, 200, 200, 0.3)"
//       backdropFilter="blur(12px)"
//       borderRadius="16px"
//       marginLeft="40px"
//       width="calc(100% - 75px)"
//     >
//       <Flex direction="column" alignItems="flex-start" ml={8}>
//         <Text fontSize="sm" fontWeight="medium" color="gray.500" mb="2px">
//           Menu / {getPageTitle()}
//         </Text>
//         <Text fontSize="2xl" fontWeight="bold" color="#1B2559">
//           {getPageTitle()}
//         </Text>
//       </Flex>

//       <Flex alignItems="center">
//         <Menu>
//           <MenuButton
//             as={IconButton}
//             aria-label="Notifications"
//             icon={<BellIcon />}
//             variant="ghost"
//             fontSize="20px"
//             color="gray.600"
//             mr={4}
//             position="relative"
//           >
//             {unreadCount > 0 && (
//               <Badge
//                 colorScheme="red"
//                 borderRadius="full"
//                 position="absolute"
//                 top="-3px"
//                 right="-3px"
//                 fontSize="10px"
//                 px={2}
//                 py={1}
//               >
//                 {unreadCount}
//               </Badge>
//             )}
//           </MenuButton>

//           <MenuList maxW="400px" maxH="300px" overflowY="auto">
//             {isLoading ? (
//               <Flex justifyContent="center" alignItems="center" p={4}>
//                 <Spinner size="md" color="blue.500" />
//               </Flex>
//             ) : notifications && notifications.length > 0 ? (
//               <NotificationList
//                 notifications={notifications}
//                 onMarkAsRead={markAsRead}
//               />
//             ) : (
//               <Flex justifyContent="center" alignItems="center" p={4}>
//                 <Text fontSize="sm" color="gray.500">
//                   No new notifications
//                 </Text>
//               </Flex>
//             )}
//           </MenuList>
//         </Menu>

//         <Menu>
//           <MenuButton
//             as={Button}
//             rightIcon={<ChevronDownIcon />}
//             bg="transparent"
//             _hover={{ bg: "transparent" }}
//             _active={{ bg: "transparent" }}
//             _focus={{ boxShadow: "none" }}
//           >
//             <Flex alignItems="center">
//               <Avatar size="sm" name={currentUser?.name} bg="blue.500" mr={2} />
//             </Flex>
//           </MenuButton>
//           <MenuList boxShadow="lg" borderRadius="lg" padding="12px">
//             <MenuItem fontSize="md" fontWeight="700" color="gray.700">
//               👋 Hey, {currentUser?.name || "Host"}
//             </MenuItem>
//             <MenuItem
//               fontSize="md"
//               fontWeight="700"
//               color="red.500"
//               onClick={logout}
//             >
//               Log out
//             </MenuItem>
//             <MenuItem
//               fontSize="md"
//               fontWeight="700"
//               color="blue.500"
//               onClick={onOpen} // Open the UpdateApiBanking modal
//             >
//               Update API Banking
//             </MenuItem>
//           </MenuList>
//         </Menu>
//       </Flex>

//       {/* Modal for Update API Banking */}
//       <UpdateApiBanking isOpen={isOpen} onClose={onClose} />
//     </Box>
//   );
// };

// export default HostHeader;
