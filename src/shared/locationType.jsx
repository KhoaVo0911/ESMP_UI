// services/apiService.js
const BASE_URL = "https://668e540abf9912d4c92dcd67.mockapi.io"; // Thay bằng URL gốc của MockAPI

// Hàm tổng quát để gọi API GET
export const getData = async (endpoint, params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/${endpoint}?${query}`);
    if (!response.ok) {
      throw new Error("Error fetching data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getData:", error);
    throw error;
  }
};

// Hàm tổng quát để gọi API POST
export const postData = async (endpoint, body) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error("Error posting data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in postData:", error);
    throw error;
  }
};

// Hàm tổng quát để gọi API PUT
export const putData = async (endpoint, body) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error("Error updating data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in putData:", error);
    throw error;
  }
};

// Hàm tổng quát để gọi API DELETE
export const deleteData = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error deleting data");
    }
    return true;
  } catch (error) {
    console.error("Error in deleteData:", error);
    throw error;
  }
};
