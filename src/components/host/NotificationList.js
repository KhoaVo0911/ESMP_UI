import React from "react";
import {
  Box,
  Text,
  List,
  ListItem,
  Divider,
  Badge,
  Flex,
} from "@chakra-ui/react";

const NotificationList = ({ notifications, onMarkAsRead }) => {
  return (
    <Box
      maxW="400px"
      bg="white"
      borderRadius="md"
      boxShadow="lg"
      p={4}
      maxHeight="400px"
      overflowY="auto"
    >
      <Text fontWeight="bold" fontSize="lg" mb={4} color="gray.700">
        Notifications
      </Text>
      {notifications.length === 0 ? (
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
                  _hover={{ bg: "gray.100" }}
                  p={2}
                  borderRadius="md"
                >
                  <Box>
                    <Text fontWeight="medium" color="gray.800">
                      {notification.source}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </Text>
                  </Box>
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
