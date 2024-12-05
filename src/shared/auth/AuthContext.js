import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Thông tin người dùng
  const navigate = useNavigate();
 

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (userData) => {
    // Lưu thông tin người dùng vào state và localStorage
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    // Điều hướng dựa trên vai trò (role)
    const role = userData.role || "unknown";
    switch (role) {
      case "admin":
        navigate("/admin", { state: { userId: userData.userid } });
        break;
      case "host":
        navigate("/dashboard", { state: { userId: userData.userid } });
        break;
      case "manager":
        navigate("/DashboardVendor", { state: { userId: userData.userid } });
        break;
      case "staff":
        navigate("/eventStaff", { state: { userId: userData.userid } });
        break;
      default:
        console.error("Unknown role:", role);
        navigate("/");
        break;
    }
  };

  const logout = async () => {
    try {
      // Retrieve AccessToken from sessionStorage
      const accessToken = sessionStorage.getItem("accessToken");
  
      if (!accessToken) {
        console.error("No accessToken found in sessionStorage.");
        return;
      }
  
      console.log("Logging out with accessToken:", accessToken);
  
      // POST request to the logout API
      const response = await fetch("https://esmpbe.id.vn/api/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${accessToken}`, // Ensure accessToken is included as Bearer token
        },
      });
  
      if (!response.ok) {
        throw new Error("Logout failed. Please try again.");
      }
  
      // Clear session storage items
      sessionStorage.removeItem("accessToken"); // Remove accessToken from sessionStorage
      sessionStorage.removeItem("userid");
      sessionStorage.removeItem("expiretime");
      sessionStorage.removeItem("bankingaccount");
      sessionStorage.removeItem("phone");
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("eventstoragetime");
      sessionStorage.removeItem("hostid");
  
      // Clear state and localStorage
      setUser(null);  // Reset the user state
      localStorage.removeItem("user");  // Remove the user from localStorage
  
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, handle the error (e.g., show a notification)
    }
  };
  
  

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
