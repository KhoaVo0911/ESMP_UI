import axios from "axios";

// Base URL của MockAPI
const BASE_URL = "https://668e540abf9912d4c92dcd67.mockapi.io";

export const getData = async (endpoint, params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await axios.get(`${BASE_URL}/${endpoint}?${query}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    throw error;
  }
};

export const getLocationMapByEventId = async (eventId) => {
  try {
    if (!eventId) throw new Error("Event ID bị thiếu");
    const response = await axios.get(
      `${BASE_URL}/events/${eventId}/locationMaps`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy Location Map theo Event ID:", error);
    throw error;
  }
};

export const createLocationMap = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/locationMaps`, data);
    if (!response.data.locationId) {
      throw new Error("Phản hồi API không có locationId");
    }
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo Location Map:", error);
    throw error;
  }
};

export const updateLocationMap = async (locationId, data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/locationMaps/${locationId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật Location Map:", error);
    throw error;
  }
};

export const deleteLocationMap = async (locationId) => {
  try {
    if (!locationId) throw new Error("Thiếu locationId để xóa map.");
    const response = await axios.delete(
      `${BASE_URL}/locationMaps/${locationId}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa Location Map:", error);
    throw error;
  }
};
