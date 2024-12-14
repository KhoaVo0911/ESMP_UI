// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   FormControl,
//   FormLabel,
//   Input,
//   Stack,
//   Text,
//   useToast,
//   Divider,
//   Image,
// } from "@chakra-ui/react";
// import axios from "axios"; // Đảm bảo bạn đã cài axios
// import logoLogin from "../assets/images/login.png"; // Đường dẫn đến logo login
// import projectLogo from "../assets/images/trans_bg.png"; // Đường dẫn đến logo của project
// import tree from "../assets/images/tree.png"; // Đường dẫn đến hình ảnh ở góc dưới trái
// import { useNavigate } from "react-router-dom";

// const LoginComponent = ({ onLoginSuccess }) => {
//   const [role, setRole] = useState(""); // Role only for adjusting API link
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const toast = useToast();
//   const hostCode = "default"; // HostCode is set to 'default'
//   const navigate = useNavigate();

//   // Xóa accessToken khi component được render
//   useEffect(() => {
//     sessionStorage.removeItem("accessToken"); // Xóa token khi vào trang login
//   }, []);

//   const handleLogin = async (event) => {
//     event.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       console.log("Logging in with:", { username, password, hostCode, role });

//       // API URL construction
//       const apiUrl = `https://esmpbe.id.vn/api/user/login/${role}`;

//       // Send POST request to login API
//       const response = await axios.post(apiUrl, {
//         username,
//         password,
//       });

//       const { accessToken, userInfo } = response.data;

//       // Save necessary details in sessionStorage
//       const { hostInfo } = userInfo;
//       sessionStorage.setItem("accessToken", accessToken);
//       sessionStorage.setItem("vendorName", userInfo.username || "N/A");
//       sessionStorage.setItem("userid", userInfo.userid || "N/A");
//       sessionStorage.setItem("hostid", hostInfo?.hostId || "N/A");

//       console.log("Logged in as:", userInfo);

//       // Pass accessToken and userInfo to parent
//       onLoginSuccess(accessToken, userInfo);

//       // Show success toast
//       toast({
//         title: "Login Successfully",
//         description: `Logged in as ${role}`,
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//         position: "top",
//       });
//     } catch (err) {
//       console.error("Login error:", err.response || err.message);

//       // Handle specific error cases
//       if (err.response) {
//         const { status, data } = err.response;
//         if (status === 401) {
//           // Unauthorized: Invalid username or password
//           toast({
//             title: "Login failed",
//             description: "Invalid username or password. Please try again.",
//             status: "error",
//             duration: 3000,
//             isClosable: true,
//             position: "top",
//           });
//         } else if (data?.message === "Account is blocked") {
//           // Account is blocked
//           toast({
//             title: "Account not activated",
//             description: "Your account is inactive. Please contact admin.",
//             status: "error",
//             duration: 3000,
//             isClosable: true,
//             position: "top",
//           });
//         } else {
//           // Other errors
//           toast({
//             title: "Login failed",
//             description: data?.message || "An unexpected error occurred.",
//             status: "error",
//             duration: 3000,
//             isClosable: true,
//             position: "top",
//           });
//         }
//       } else {
//         // Network or unexpected errors
//         toast({
//           title: "Login failed",
//           description: err.message || "An unexpected error occurred.",
//           status: "error",
//           duration: 3000,
//           isClosable: true,
//           position: "top",
//         });
//       }
//       setError(err.message || "Login failed. Please check your credentials.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box display="flex" height="100vh" position="relative">
//       {/* Thêm logo project ở góc trên trái */}
//       <Box position="absolute" top={4} left={4}>
//         <Image src={projectLogo} alt="Project Logo" boxSize="140px" />
//       </Box>

//       {/* Bên trái - Hình ảnh */}
//       <Box
//         flex="3"
//         bg="gray.100"
//         p={4}
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//       >
//         <Image
//           src={logoLogin} // Thay đổi với URL ảnh của bạn
//           alt="Logo"
//           width="100%" // Chiều rộng sẽ chiếm 100% chiều rộng của phần box
//           height="auto" // Chiều cao tự động tính toán để duy trì tỷ lệ
//           maxWidth="580px" // Giới hạn chiều rộng tối đa của logo
//         />
//       </Box>

//       {/* Bên phải - Form đăng nhập */}
//       <Box
//         flex="1"
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         bg="white"
//         boxShadow="lg"
//         borderRadius="lg"
//         padding={8}
//         position="relative"
//       >
//         <Box width="100%" maxWidth="400px">
//           {/* Phần chữ nhỏ làm nền cho tiêu đề */}
//           <Text fontSize="2xl" fontWeight="bold" mb={2}>
//             Welcome to ESMP!
//           </Text>
//           <Text fontSize="medium" color="gray.400" mb={6} fontStyle="inherit">
//             Please sign-in to your account and start the adventure
//           </Text>
//           <Stack spacing={4}>
//             <FormControl isInvalid={!!error}>
//               <FormLabel htmlFor="username">Username</FormLabel>
//               <Input
//                 id="username"
//                 type="text"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 placeholder="Enter your username"
//               />
//             </FormControl>
//             <FormControl isInvalid={!!error}>
//               <FormLabel htmlFor="password">Password</FormLabel>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//               />
//             </FormControl>

//             {/* Di chuyển Forgot Password lên trên button Login */}
//             <Text
//               fontSize="sm"
//               color="blue.500"
//               textAlign="right"
//               cursor="pointer"
//               mb={2} // Đặt khoảng cách dưới của Forgot Password
//               onClick={() => navigate("/forgot-password")}
//             >
//               Forgot Password?
//             </Text>

//             <Button
//               colorScheme="blue"
//               onClick={handleLogin}
//               isFullWidth
//               mt={4}
//               _hover={{ bg: "blue.500" }}
//               isLoading={loading}
//             >
//               Login
//             </Button>
//           </Stack>
//           <Divider my={4} />

//           <Text fontSize="sm" color="gray.500" textAlign="center" mt={4}>
//             Do you want to host an event?{" "}
//             <Text
//               as="span"
//               color="blue.500"
//               cursor="pointer"
//               onClick={() => navigate("/register-host")}
//             >
//               Create Account for Host
//             </Text>
//           </Text>
//           <Text
//             colorScheme="gray"
//             cursor="pointer"
//             onClick={() => navigate("/home")}
//             mt={4} // Khoảng cách dưới nút
//             width="auto" // Đặt chiều rộng tự động để căn giữa
//             mx="auto" // Căn giữa nút trong container
//             display="block" // Đảm bảo nút được hiển thị như block để căn giữa
//             textAlign="center" // Căn giữa nội dung
//           >
//             Back to Home
//           </Text>
//         </Box>
//       </Box>

//       {/* Thêm hình ảnh ở góc dưới trái */}
//       <Box position="absolute" bottom={4} left={4}>
//         <Image
//           src={tree}
//           alt="Bottom Left Image"
//           width="100%"
//           height="auto"
//           maxWidth="150px"
//         />
//       </Box>
//     </Box>
//   );
// };

// export default LoginComponent;

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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logoLogin from "../assets/images/login.png";
import projectLogo from "../assets/images/trans_bg.png";
import tree from "../assets/images/tree.png";

const LoginComponent = ({ onLoginSuccess }) => {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem("accessToken"); // Clear token on component load
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apiUrl = `https://esmpbe.id.vn/api/user/login/${role}`;
      const response = await axios.post(apiUrl, { username, password });
      console.log("Sending API request to:", apiUrl);

      const { accessToken, userInfo } = response.data;

      // Kiểm tra thông tin role
      const userRole = userInfo.role || "";
      const hostId = userInfo.hostInfo?.hostId || "";
      const vendorId = userInfo.vendorInfo?.vendorId || "";
      const staffId = userInfo.staffInfo?.staffId || "";
      const vendorName = userInfo.vendorInfo
      ? userInfo.vendorInfo.vendorName
      : "";
      const expiretime = userInfo.hostInfo?.expiretime|| "";
      sessionStorage.setItem("expiretime", expiretime);
      sessionStorage.setItem("vendorName", vendorName);
      // Lưu dữ liệu vào sessionStorage
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("role", userRole);
      sessionStorage.setItem("hostId", hostId);
      sessionStorage.setItem("vendorId", vendorId);
      sessionStorage.setItem("staffId", staffId);

      console.log("Logged in as:", userInfo);

      // Điều hướng dựa trên vai trò
      if (userRole === "admin") {
        navigate("/dashboard-admin");
      } else if (userRole === "host") {
        if (!hostId) {
          throw new Error("Host ID not found for this user");
        }
        navigate(`/${hostId}/dashboard`);
      } else if (userRole === "manager") {
        if (!vendorId) {
          throw new Error("Vendor ID not found for this user");
        }
        navigate(`/${vendorId}/dashboardVendor`);
      } else if (userRole === "staff") {
        if (!vendorId || !staffId) {
          throw new Error("Vendor or Staff ID not found for this user");
        }
        navigate(`/eventStaff/${vendorId}/${staffId}`);
      } else {
        throw new Error("Invalid user role");
      }

      toast({
        title: "Login Successfully",
        description: `Logged in as ${userRole}`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      console.error("Login error:", err);

      // Xử lý lỗi và hiển thị thông báo
      toast({
        title: "Login failed",
        description:
          err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred.",
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
      <Box position="absolute" top={4} left={4}>
        <Image src={projectLogo} alt="Project Logo" boxSize="140px" />
      </Box>

      <Box
        flex="3"
        bg="gray.100"
        p={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Image
          src={logoLogin}
          alt="Logo"
          width="100%"
          height="auto"
          maxWidth="580px"
        />
      </Box>

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
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            Welcome to ESMP!
          </Text>
          <Text fontSize="medium" color="gray.400" mb={6}>
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

            <Text
              fontSize="sm"
              color="blue.500"
              textAlign="right"
              cursor="pointer"
              mb={2}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </Text>

            <Button
              colorScheme="blue"
              onClick={handleLogin}
              isFullWidth
              mt={4}
              isLoading={loading}
            >
              Login
            </Button>
          </Stack>
          <Divider my={4} />
          <Text fontSize="sm" color="gray.500" textAlign="center" mt={4}>
            Do you want to host an event?{" "}
            <Text
              as="span"
              color="blue.500"
              cursor="pointer"
              onClick={() => navigate("/register-host")}
            >
              Create Account for Host
            </Text>
          </Text>
        </Box>
      </Box>

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
