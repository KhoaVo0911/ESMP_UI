// import axios from "axios";

// // Base URL của server
// const BASE_URL =
//   "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api";

// // Hàm tiện ích để lấy accessToken từ localStorage hoặc sessionStorage
// const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

// // Hàm lấy Location Map theo Event ID và Host ID
// export const getLocationMapByEventId = async (hostId, eventId) => {
//   try {
//     if (!hostId || !eventId) throw new Error("Host ID hoặc Event ID bị thiếu");
//     const accessToken = getAccessToken();
//     if (!accessToken) throw new Error("Access Token không tồn tại");

//     const response = await axios.get(`${BASE_URL}/map/${hostId}/${eventId}`, {
//       headers: {
//         Authorization: accessToken,
//         "Content-Type": "application/json",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi khi lấy Location Map theo Event ID:", error);
//     throw error;
//   }
// };

// // Hàm tạo Location Map mới
// export const createLocationMap = async (hostId, eventId, mapData) => {
//   try {
//     const accessToken = getAccessToken();
//     if (!accessToken) throw new Error("Access Token không tồn tại");

//     const response = await axios.post(
//       `${BASE_URL}/map/${hostId}/${eventId}`,
//       mapData,
//       {
//         headers: {
//           Authorization: accessToken,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Lỗi khi tạo Location Map:", error);
//     throw error;
//   }
// };

// // Hàm cập nhật Location Map hiện tại
// export const updateLocationMap = async (hostId, eventId, mapData) => {
//   try {
//     const accessToken = getAccessToken();
//     if (!accessToken) throw new Error("Access Token không tồn tại");

//     const response = await axios.put(
//       `${BASE_URL}/map/${hostId}/${eventId}`,
//       mapData,
//       {
//         headers: {
//           Authorization: accessToken,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Lỗi khi cập nhật Location Map:", error);
//     throw error;
//   }
// };

// // Hàm xóa Location Map
// export const deleteLocationMap = async (hostId, locationId) => {
//   try {
//     if (!locationId) throw new Error("Thiếu locationId để xóa map.");
//     const accessToken = getAccessToken();
//     if (!accessToken) throw new Error("Access Token không tồn tại");

//     const response = await axios.delete(
//       `${BASE_URL}/map/${hostId}/${locationId}`,
//       {
//         headers: {
//           Authorization: accessToken,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi khi xóa Location Map:", error);
//     throw error;
//   }
// };
import axios from "axios";

// Base URL từ file config hoặc môi trường
const BASE_URL =
  process.env.REACT_APP_BASE_URL ||
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api";

// Hàm tiện ích để lấy Access Token
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

// Cấu hình mặc định cho axios
axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.timeout = 10000; // Thời gian chờ là 10 giây

// Interceptor để tự động thêm Access Token
axios.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Hàm lấy Location Map theo Event ID và Host ID
 * @param {string} hostId
 * @param {string} eventId
 * @returns {Object} { success: boolean, data: Object | null, error: string | null }
 */
export const getLocationMapByEventId = async (hostId, eventId) => {
  try {
    if (!hostId || !eventId) throw new Error("Host ID hoặc Event ID bị thiếu");

    const response = await axios.get(`/map/${hostId}/${eventId}`);
    return { success: true, data: response.data, error: null };
  } catch (error) {
    console.error(
      "Lỗi khi lấy Location Map:",
      error.response?.data || error.message
    );
    return { success: false, data: null, error: error.message };
  }
};

/**
 * Hàm tạo hoặc cập nhật Location Map (dùng chung logic)
 * @param {string} method - "post" cho tạo mới, "put" cho cập nhật
 * @param {string} hostId
 * @param {string} eventId
 * @param {Object} mapData
 * @returns {Object} { success: boolean, data: Object | null, error: string | null }
 */
const sendLocationMapRequest = async (method, hostId, eventId, mapData) => {
  try {
    if (!hostId || !eventId) throw new Error("Host ID hoặc Event ID bị thiếu");

    const response = await axios({
      method,
      url: `/map/${hostId}/${eventId}`,
      data: mapData,
    });

    return { success: true, data: response.data, error: null };
  } catch (error) {
    console.error(
      `Lỗi khi ${method === "post" ? "tạo" : "cập nhật"} map:`,
      error.response?.data || error.message
    );
    return { success: false, data: null, error: error.message };
  }
};

/**
 * Hàm tạo Location Map mới
 * @param {string} hostId
 * @param {string} eventId
 * @param {Object} mapData
 * @returns {Object} { success: boolean, data: Object | null, error: string | null }
 */
export const createLocationMap = (hostId, eventId, mapData) =>
  sendLocationMapRequest("post", hostId, eventId, mapData);

/**
 * Hàm cập nhật Location Map hiện tại
 * @param {string} hostId
 * @param {string} eventId
 * @param {Object} mapData
 * @returns {Object} { success: boolean, data: Object | null, error: string | null }
 */
export const updateLocationMap = (hostId, eventId, mapData) =>
  sendLocationMapRequest("put", hostId, eventId, mapData);

/**
 * Hàm xóa Location Map
 * @param {string} hostId
 * @param {string} locationId
 * @returns {Object} { success: boolean, data: Object | null, error: string | null }
 */
export const deleteLocationMap = async (locationId) => {
  try {
    if (!locationId) throw new Error("Thiếu locationId để xóa map.");
    console.log(locationId, "id");
    const response = await axios.delete(`/map/${locationId}`);
    return { success: true, data: response.data, error: null };
  } catch (error) {
    console.error(
      "Lỗi khi xóa Location Map:",
      error.response?.data || error.message
    );
    return { success: false, data: null, error: error.message };
  }
};

export default {
  getLocationMapByEventId,
  createLocationMap,
  updateLocationMap,
  deleteLocationMap,
};
