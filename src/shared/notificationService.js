import axios from "axios";

const BASE_URL =
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/notification";

// Lấy danh sách thông báo cho Host hoặc Vendor
export const getNotifications = async (userid) => {
  try {
    const response = await axios.get(`${BASE_URL}/${userid}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

// Gửi thông báo từ Host đến Vendor hoặc ngược lại
export const sendNotification = async (id, source) => {
  try {
    const response = await axios.post(BASE_URL, { userid: id, source });
    return response.data;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

// Cập nhật trạng thái thông báo (đánh dấu đã đọc)
export const updateNotificationStatus = async (notificationId) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/notification/${notificationId}`,
      {
        id: notificationId,
        status: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating notification status:", error);
    throw error;
  }
};

// Long polling để cập nhật danh sách thông báo
export const pollNotifications = async (userid) => {
  try {
    return await getNotifications(userid);
  } catch (error) {
    console.error("Error during notification polling:", error);
    return [];
  }
};
