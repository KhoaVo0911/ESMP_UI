import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  VStack,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import axios from "axios";

const Notification = ({ userId, onNewNotifications, onOpenNotifications }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stopPolling, setStopPolling] = useState(false); // Để dừng polling nếu cần

  const fetchNotifications = async () => {
    if (stopPolling) return; // Nếu dừng polling, thoát khỏi hàm

    try {
      const response = await axios.get(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/notification/${userId}`
      );

      setNotifications(response.data);

      // Gửi số lượng thông báo mới lên header
      if (response.data.length > 0) {
        onNewNotifications(response.data.length);
      }

      setLoading(false);

      // Sau khi hoàn tất, tiếp tục gọi lại chính nó để tạo long polling
      setTimeout(fetchNotifications, 5000); // Gửi yêu cầu mới sau 5 giây
    } catch (error) {
      console.error("Failed to fetch notifications:", error);

      // Nếu có lỗi, thử lại sau 5 giây
      setTimeout(fetchNotifications, 5000);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }

    return () => {
      setStopPolling(true); // Dừng polling khi component bị unmount
    };
  }, [userId]);

  const handleOpenNotifications = () => {
    onOpenNotifications();
  };

  return (
    <Box
      bg="white"
      boxShadow="lg"
      borderRadius="md"
      p={4}
      minW="300px"
      maxH="400px"
      overflowY="auto"
      onClick={handleOpenNotifications}
    >
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Notifications
      </Text>
      {loading ? (
        <Spinner size="sm" />
      ) : (
        <VStack align="start" spacing={2}>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Box key={notification.id} p={2} bg="gray.50" borderRadius="md">
                <Icon as={BellIcon} mr={2} color="blue.500" />
                <Text as="span" fontSize="sm">
                  {notification.source}
                </Text>
              </Box>
            ))
          ) : (
            <Text fontSize="sm" color="gray.500">
              No notifications available.
            </Text>
          )}
        </VStack>
      )}
    </Box>
  );
};

export default Notification;
