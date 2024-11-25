// import axios from "axios";

// const BASE_URL =
//   "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api";
// const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

// // Hàm lấy danh sách payments theo eventId
// export const getPaymentsByEventId = async (eventId) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/eventpayment/${eventId}`, {
//       headers: { Authorization: `Bearer ${getAccessToken()}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching payments:", error);
//     throw error;
//   }
// };

// // Hàm update trạng thái thanh toán của vendor
// export const updatePaymentStatus = async (vendorInEventId, data) => {
//   try {
//     const response = await axios.put(
//       `${BASE_URL}/eventpayment/${vendorInEventId}`,
//       data,
//       { headers: { Authorization: `Bearer ${getAccessToken()}` } }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error updating payment status:", error);
//     throw error;
//   }
// };

// // Hàm tạo thanh toán mới
// export const createPayment = async (data) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/eventpayment`, data, {
//       headers: { Authorization: `Bearer ${getAccessToken()}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error creating payment:", error);
//     throw error;
//   }
// };

import axios from "axios";

const BASE_URL = "https://esmpbe.id.vn/api";
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

// Hàm lấy danh sách payments theo eventId
export const getPaymentsByEventId = async (eventId) => {
  try {
    const response = await axios.get(`${BASE_URL}/eventpayment/${eventId}`, {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};
