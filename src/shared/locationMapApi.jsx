import axios from "axios";

// Base URL của server
const BASE_URL =
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api";

// Hàm tiện ích để lấy accessToken từ localStorage hoặc sessionStorage
const getAccessToken = () => {
  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken") ||
    "";
  console.log("Access Token:", token); // In ra token để kiểm tra
  return token;
};

// Hàm lấy Location Map theo Event ID và Host ID
export const getLocationMapByEventId = async (hostId, eventId) => {
  try {
    if (!hostId || !eventId) throw new Error("Host ID hoặc Event ID bị thiếu");
    const accessToken = getAccessToken();
    if (!accessToken) throw new Error("Access Token không tồn tại");

    const response = await axios.get(`${BASE_URL}/map/${hostId}/${eventId}`, {
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy Location Map theo Event ID:", error);
    throw error;
  }
};

// Hàm tạo Location Map mới
export const createLocationMap = async (hostId, eventId, data) => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) throw new Error("Access Token không tồn tại");

    const response = await axios.post(
      `${BASE_URL}/map/${hostId}/${eventId}`,
      data,
      {
        headers: {
          Authorization: accessToken, // Giữ nguyên accessToken nếu không cần "Bearer "
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo Location Map:", error);
    throw error;
  }
};

// Hàm cập nhật Location Map hiện tại
export const updateLocationMap = async (hostId, eventId, locationId, data) => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) throw new Error("Access Token không tồn tại");

    const response = await axios.put(`${BASE_URL}/map`, data, {
      headers: {
        Authorization: accessToken, // Giữ nguyên accessToken nếu không cần "Bearer "
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật Location Map:", error);
    throw error;
  }
};

// Hàm xóa Location Map
export const deleteLocationMap = async (hostId, locationId) => {
  try {
    if (!locationId) throw new Error("Thiếu locationId để xóa map.");
    const accessToken = getAccessToken();
    if (!accessToken) throw new Error("Access Token không tồn tại");

    const response = await axios.delete(
      `${BASE_URL}/map/${hostId}/${locationId}`,
      {
        headers: {
          Authorization: accessToken, // Giữ nguyên accessToken nếu không cần "Bearer "
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa Location Map:", error);
    throw error;
  }
};
