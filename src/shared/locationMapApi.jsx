import axios from "axios";

// Base URL của server
const BASE_URL =
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api";

// Hàm tiện ích để lấy accessToken từ localStorage hoặc sessionStorage
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

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
export const createLocationMap = async (hostId, eventId, mapData) => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) throw new Error("Access Token không tồn tại");

    const response = await axios.post(
      `${BASE_URL}/map/${hostId}/${eventId}`,
      mapData,
      {
        headers: {
          Authorization: accessToken,
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
export const updateLocationMap = async (hostId, eventId, mapData) => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) throw new Error("Access Token không tồn tại");

    const response = await axios.put(
      `${BASE_URL}/map/${hostId}/${eventId}`,
      mapData,
      {
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
      }
    );

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
          Authorization: accessToken,
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
