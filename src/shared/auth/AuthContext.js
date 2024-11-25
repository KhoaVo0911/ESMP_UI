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

  const logout = () => {
    // Đăng xuất, xóa thông tin người dùng và điều hướng về trang login
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
