import axios from "axios";

const BASE_URL =
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/notification";

// Hàm lấy danh sách thông báo
export const getNotifications = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

// Hàm cập nhật trạng thái thông báo (đánh dấu đã đọc)
export const updateNotificationStatus = async (notificationId) => {
  try {
    const response = await axios.put(`${BASE_URL}/notification`, {
      id: notificationId,
      status: true, // Đánh dấu thông báo là đã đọc
    });
    return response.data;
  } catch (error) {
    console.error("Error updating notification status:", error);
    throw error;
  }
};

// Long polling để cập nhật danh sách thông báo
export const pollNotifications = async (userId) => {
  try {
    return await getNotifications(userId);
  } catch (error) {
    console.error("Error during notification polling:", error);
    return [];
  }
};
