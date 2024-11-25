import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  List,
  ListItem,
  Divider,
  Badge,
  Flex,
  Icon,
  Tooltip,
  Spinner,
} from "@chakra-ui/react";
import {
  InfoOutlineIcon,
  CheckCircleIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import {
  getNotifications,
  updateNotificationStatus,
} from "../../shared/notificationService";

const NotificationList = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications when component mounts
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const data = await getNotifications(userId);
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [userId]);

  // Handle marking a notification as read
  const onMarkAsRead = async (notificationId) => {
    try {
      await updateNotificationStatus(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, status: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <Box
      maxW="400px"
      bg="white"
      borderRadius="md"
      boxShadow="lg"
      p={4}
      maxHeight="500px"
      overflowY="auto"
    >
      <Text fontWeight="bold" fontSize="lg" mb={4} color="gray.700">
        Notifications
      </Text>
      {loading ? (
        <Flex justify="center" align="center" p={3}>
          <Spinner size="md" />
        </Flex>
      ) : notifications.length === 0 ? (
        <Text textAlign="center" color="gray.500">
          No new notifications
        </Text>
      ) : (
        <List spacing={4}>
          {notifications.map((notification) => (
            <React.Fragment key={notification.id}>
              <ListItem>
                <Flex
                  justify="space-between"
                  align="center"
                  onClick={() => onMarkAsRead(notification.id)}
                  cursor="pointer"
                  _hover={{ bg: "gray.50" }}
                  p={2}
                  borderRadius="md"
                  border="1px"
                  borderColor={notification.status ? "gray.200" : "blue.400"}
                >
                  <Flex align="center">
                    <Icon
                      as={
                        notification.type === "success"
                          ? CheckCircleIcon
                          : notification.type === "warning"
                          ? WarningIcon
                          : InfoOutlineIcon
                      }
                      boxSize={5}
                      color={
                        notification.type === "success"
                          ? "green.400"
                          : notification.type === "warning"
                          ? "yellow.400"
                          : "blue.400"
                      }
                      mr={3}
                    />
                    <Box>
                      <Tooltip label={notification.source} fontSize="md">
                        <Text
                          fontWeight="medium"
                          color="gray.800"
                          noOfLines={1}
                          title={notification.source}
                        >
                          {notification.source}
                        </Text>
                      </Tooltip>
                      <Text fontSize="xs" color="gray.500">
                        {new Date(notification.createdAt).toLocaleString(
                          "en-GB",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </Text>
                    </Box>
                  </Flex>
                  {!notification.status && (
                    <Badge colorScheme="red" ml={2}>
                      New
                    </Badge>
                  )}
                </Flex>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default NotificationList;
