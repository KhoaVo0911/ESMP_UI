import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
  Divider,
  Image,
} from "@chakra-ui/react";
import axios from "axios"; // Đảm bảo bạn đã cài axios
import logoLogin from "../assets/images/login.png"; // Đường dẫn đến logo login
import projectLogo from "../assets/images/trans_bg.png"; // Đường dẫn đến logo của project
import tree from "../assets/images/tree.png"; // Đường dẫn đến hình ảnh ở góc dưới trái
import { useNavigate } from "react-router-dom";

const LoginComponent = ({ onLoginSuccess }) => {
  const [role, setRole] = useState(""); // Role only for adjusting API link
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();
  const hostCode = "default"; // HostCode is set to 'default'
  const navigate = useNavigate();

  // Xóa accessToken khi component được render
  useEffect(() => {
    sessionStorage.removeItem("accessToken"); // Xóa token khi vào trang login
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Logging in with:", { username, password, hostCode, role });

      // API URL construction
      const apiUrl = `https://esmpbe.id.vn/api/user/login/${role}`;

      // Send POST request to login API
      const response = await axios.post(apiUrl, {
        username,
        password,
      });

      const { accessToken, userInfo } = response.data;

      // Log the full response to verify data structure
      console.log("Full User Info:", JSON.stringify(userInfo, null, 2));

      // Extract necessary details from userInfo and hostInfo
      const { hostInfo } = userInfo;

      const userid = userInfo.userid || "N/A";
      const expiretime = hostInfo?.expiretime || "N/A";
      const bankingaccount = userInfo.bankingaccount || "N/A";
      const phone = userInfo.phone || "N/A";
      const email = hostInfo?.hostName || "N/A";
      const eventstoragetime = userInfo.eventstoragetime || "N/A";
      const hostid = hostInfo?.hostId || "N/A";

      // Save details in sessionStorage for later use
      sessionStorage.setItem("userid", userid);
      sessionStorage.setItem("expiretime", expiretime);
      sessionStorage.setItem("bankingaccount", bankingaccount);
      sessionStorage.setItem("phone", phone);
      sessionStorage.setItem("email", email);
      sessionStorage.setItem("eventstoragetime", eventstoragetime);
      sessionStorage.setItem("hostid", hostid);
      sessionStorage.setItem("accessToken", accessToken); // Lưu accessToken

      // Pass accessToken and userInfo on successful login
      onLoginSuccess(accessToken, userInfo);

      // Show success toast
      toast({
        title: "Login Successfully",
        description: `Logged in as ${role}`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      // Log the error response to the console
      console.error("Login error:", err.response);

      // Set error state and show error toast
      setError("Login failed. Please check your credentials.");
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" height="100vh" position="relative">
      {/* Thêm logo project ở góc trên trái */}
      <Box position="absolute" top={4} left={4}>
        <Image src={projectLogo} alt="Project Logo" boxSize="140px" />
      </Box>

      {/* Bên trái - Hình ảnh */}
      <Box
        flex="3"
        bg="gray.100"
        p={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Image
          src={logoLogin} // Thay đổi với URL ảnh của bạn
          alt="Logo"
          width="100%" // Chiều rộng sẽ chiếm 100% chiều rộng của phần box
          height="auto" // Chiều cao tự động tính toán để duy trì tỷ lệ
          maxWidth="580px" // Giới hạn chiều rộng tối đa của logo
        />
      </Box>

      {/* Bên phải - Form đăng nhập */}
      <Box
        flex="1"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bg="white"
        boxShadow="lg"
        borderRadius="lg"
        padding={8}
        position="relative"
      >
        <Box width="100%" maxWidth="400px">
          {/* Phần chữ nhỏ làm nền cho tiêu đề */}
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            Welcome to ESMP!
          </Text>
          <Text fontSize="medium" color="gray.400" mb={6} fontStyle="inherit">
            Please sign-in to your account and start the adventure
          </Text>
          <Stack spacing={4}>
            <FormControl isInvalid={!!error}>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </FormControl>
            <FormControl isInvalid={!!error}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </FormControl>

            {/* Di chuyển Forgot Password lên trên button Login */}
            <Text
              fontSize="sm"
              color="blue.500"
              textAlign="right"
              cursor="pointer"
              mb={2} // Đặt khoảng cách dưới của Forgot Password
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </Text>

            <Button
              colorScheme="blue"
              onClick={handleLogin}
              isFullWidth
              mt={4}
              _hover={{ bg: "blue.500" }}
              isLoading={loading}
            >
              Login
            </Button>
          </Stack>
          <Divider my={4} />

          {/* <Text fontSize="sm" color="gray.500" textAlign="center" mt={4}>
            Do you want to host an event?{" "}
            <Text
              as="span"
              color="blue.500"
              cursor="pointer"
              onClick={() => navigate("/register-host")}
            >
              Create Account for Host
            </Text>
          </Text> */}
          <Text
            colorScheme="gray"
            cursor="pointer"
            onClick={() => navigate("/home")}
            mt={4} // Khoảng cách dưới nút
            width="auto" // Đặt chiều rộng tự động để căn giữa
            mx="auto" // Căn giữa nút trong container
            display="block" // Đảm bảo nút được hiển thị như block để căn giữa
            textAlign="center" // Căn giữa nội dung
          >
            Back to Home
          </Text>
        </Box>
      </Box>

      {/* Thêm hình ảnh ở góc dưới trái */}
      <Box position="absolute" bottom={4} left={4}>
        <Image
          src={tree}
          alt="Bottom Left Image"
          width="100%"
          height="auto"
          maxWidth="150px"
        />
      </Box>
    </Box>
  );
};

export default LoginComponent;
