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
export const updateLocationMap = async (hostId, eventId, data) => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) throw new Error("Access Token không tồn tại");

    // Cấu trúc `data` sẽ chứa các loại phần tử khác nhau để cập nhật chính xác
    const payload = {
      hostId,
      eventId,
      booths: data.booths.map((booth) => ({
        locationId: booth.locationId,
        x: booth.x,
        y: booth.y,
        width: booth.width,
        height: booth.height,
        rotation: booth.rotation,
      })),
      shapes: data.shapes.map((shape) => ({
        locationId: shape.locationId,
        x: shape.x,
        y: shape.y,
        width: shape.width,
        height: shape.height,
        rotation: shape.rotation,
      })),
      images: data.images.map((image) => ({
        locationId: image.locationId,
        x: image.x,
        y: image.y,
        width: image.width,
        height: image.height,
        rotation: image.rotation,
      })),
      texts: data.texts.map((text) => ({
        locationId: text.locationId,
        x: text.x,
        y: text.y,
        width: text.width,
        height: text.height,
        rotation: text.rotation,
        content: text.content,
        fontSize: text.fontSize,
        color: text.color,
        bold: text.bold,
        italic: text.italic,
        underline: text.underline,
        textAlign: text.textAlign,
      })),
    };

    const response = await axios.put(
      `${BASE_URL}/map/${hostId}/${eventId}`,
      payload,
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
