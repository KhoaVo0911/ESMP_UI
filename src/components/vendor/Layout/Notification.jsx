import React, { useEffect, useState } from "react";
import { Box, Text, VStack, Icon, Spinner, useToast } from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import axios from "axios";

const Notification = ({ userId, onNewNotifications, onOpenNotifications }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stopPolling, setStopPolling] = useState(false); // Dừng polling nếu cần
  const [pollingInterval, setPollingInterval] = useState(120000); // 2 phút mặc định
  const toast = useToast();

  const fetchNotifications = async () => {
    if (stopPolling) return; // Nếu dừng polling, thoát khỏi hàm

    try {
      const response = await axios.get(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/notification/${userId}`
      );

      const unreadNotifications = response.data.filter((n) => !n.status);
      setNotifications(response.data);

      // Nếu có thông báo mới
      if (unreadNotifications.length > 0) {
        onNewNotifications(unreadNotifications.length);
        setPollingInterval(30000); // Gọi nhanh hơn (30 giây) khi có thông báo mới
      } else {
        setPollingInterval(120000); // Gọi chậm lại (2 phút) khi không có thông báo mới
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);

      // Tăng thời gian polling khi có lỗi
      setPollingInterval(180000); // 3 phút nếu có lỗi
    } finally {
      // Gọi lại hàm sau khoảng thời gian động
      setTimeout(fetchNotifications, pollingInterval);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }

    return () => {
      setStopPolling(true); // Dừng polling khi component bị unmount
    };
  }, [userId, pollingInterval]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/notification/${userId}/${notificationId}`,
        { status: true }
      );

      // Cập nhật trạng thái thông báo đã đọc trong danh sách
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notificationId ? { ...n, status: true } : n
        )
      );

      toast({
        title: "Thông báo",
        description: "Thông báo đã được đánh dấu là đã đọc.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

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
              <Box
                key={notification.id}
                p={2}
                bg={notification.status ? "gray.100" : "blue.50"}
                borderRadius="md"
                cursor="pointer"
                onClick={() => markAsRead(notification.id)}
              >
                <Icon as={BellIcon} mr={2} color="blue.500" />
                <Text as="span" fontSize="sm" fontWeight={!notification.status ? "bold" : "normal"}>
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
