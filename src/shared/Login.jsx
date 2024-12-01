// import React, { useState } from "react";
// import {
//   ChakraProvider,
//   Box,
//   Button,
//   Input,
//   Text,
//   VStack,
//   HStack,
//   Radio,
//   RadioGroup,
//   useToast,
//   Icon,
// } from "@chakra-ui/react";
// import { FaUserShield, FaStore, FaUserTie, FaUser } from "react-icons/fa";
// import axios from "axios";

// const LoginComponent = ({ onLoginSuccess }) => {
//   const [role, setRole] = useState("vendor"); // Role only for adjusting API link
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const toast = useToast();
//   const hostCode = "default"; // HostCode is set to 'default'

//   const handleLogin = async (event) => {
//     event.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       // Log the data being sent to ensure it is correct
//       console.log("Logging in with:", { username, password, hostCode, role });

//       // const apiUrl = `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/user/login/${role}`;
//       const apiUrl = `https://esmpbe.id.vn/api/user/login/${role}`;
//       // const apiUrl = `https://esmpbe.id.vn:2510/api`;

//       // Send the login request
//       const response = await axios.post(apiUrl, {
//         username,
//         password,
//       });

//       const { accessToken, userInfo } = response.data;
//       // Lưu thông tin từ server
//       const {
//         userid,
//         expiretime,
//         bankingaccount,
//         phone,
//         email,
//         eventstoragetime,
//         hostid,
//       } = userInfo;
//       // Lưu thông tin vào sessionStorage

//       console.log(JSON.stringify(userInfo, null, 2), "userInfo");
//       // Pass accessToken and userInfo on successful login
//       onLoginSuccess(accessToken, userInfo);

//       sessionStorage.setItem("userid", userid);
//       sessionStorage.setItem("expiretime", expiretime);
//       sessionStorage.setItem("bankingaccount", bankingaccount);
//       sessionStorage.setItem("phone", phone);
//       sessionStorage.setItem("email", email);
//       sessionStorage.setItem("eventstoragetime", eventstoragetime);
//       sessionStorage.setItem("hostid", hostid);

//       console.log("User Info Details:");
//       console.log("User ID:", userInfo.userid);
//       console.log("Expire Time:", userInfo.expiretime);
//       console.log("Banking Account:", userInfo.bankingaccount);
//       console.log("Phone:", userInfo.phone);
//       console.log("Email:", userInfo.email);
//       console.log("Event Storage Time:", userInfo.eventstoragetime);
//       console.log("Host ID:", userInfo.hostid);
//       // Show success toast
//       toast({
//         title: "Đăng nhập thành công",
//         description: `Logged in as ${role}`,
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//         position: "top",
//       });
//     } catch (err) {
//       console.error("Login error:", err.response); // Log error response for debugging

//       setError("Login failed. Please check your credentials.");
//       toast({
//         title: "Đăng nhập thất bại",
//         description: "Invalid username or password",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//         position: "top",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ChakraProvider>
//       <Box
//         position="relative"
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         minHeight="100vh"
//         bgGradient="radial-gradient(circle at 20% 50%, #001f3f, #001f1f, #000)"
//         overflow="hidden"
//         _before={{
//           content: '""',
//           position: "absolute",
//           top: "-100px",
//           right: "-100px",
//           width: "400px",
//           height: "400px",
//           bgGradient: "radial(circle, rgba(255,255,255,0.1), transparent)",
//           borderRadius: "50%",
//           filter: "blur(150px)",
//         }}
//         _after={{
//           content: '""',
//           position: "absolute",
//           bottom: "-150px",
//           left: "-150px",
//           width: "600px",
//           height: "600px",
//           bgGradient: "radial(circle, rgba(255,255,255,0.2), transparent)",
//           borderRadius: "50%",
//           filter: "blur(200px)",
//         }}
//       >
//         <VStack
//           zIndex={1}
//           bg="white"
//           borderRadius="md"
//           boxShadow="lg"
//           p={8}
//           spacing={6}
//           w="lg"
//         >
//           <Text fontSize="2xl" fontWeight="bold" textAlign="center">
//             Choose Account Type
//           </Text>
//           <RadioGroup value={role} onChange={setRole}>
//             <HStack spacing={8}>
//               <VStack
//                 as="label"
//                 border="2px"
//                 borderColor={role === "admin" ? "blue.500" : "gray.300"}
//                 borderRadius="md"
//                 p={4}
//                 cursor="pointer"
//               >
//                 <Icon as={FaUserShield} boxSize={12} />
//                 <Text>Admin</Text>
//                 <Radio value="admin" />
//               </VStack>
//               <VStack
//                 as="label"
//                 border="2px"
//                 borderColor={role === "vendor" ? "blue.500" : "gray.300"}
//                 borderRadius="md"
//                 p={4}
//                 cursor="pointer"
//               >
//                 <Icon as={FaStore} boxSize={12} />
//                 <Text>Vendor</Text>
//                 <Radio value="vendor" />
//               </VStack>
//               <VStack
//                 as="label"
//                 border="2px"
//                 borderColor={role === "host" ? "blue.500" : "gray.300"}
//                 borderRadius="md"
//                 p={4}
//                 cursor="pointer"
//               >
//                 <Icon as={FaUserTie} boxSize={12} />
//                 <Text>Host</Text>
//                 <Radio value="host" />
//               </VStack>
//               <VStack
//                 as="label"
//                 border="2px"
//                 borderColor={role === "staff" ? "blue.500" : "gray.300"}
//                 borderRadius="md"
//                 p={4}
//                 cursor="pointer"
//               >
//                 <Icon as={FaUser} boxSize={12} />
//                 <Text>Staff</Text>
//                 <Radio value="staff" />
//               </VStack>
//             </HStack>
//           </RadioGroup>

//           <Text>
//             Hello {role.toLowerCase()}! Please fill out the form below to get
//             started.
//           </Text>

//           <Input
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             size="lg"
//           />
//           <Input
//             placeholder="Password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             size="lg"
//           />

//           <Button
//             colorScheme="blue"
//             w="full"
//             size="lg"
//             isLoading={loading}
//             onClick={handleLogin}
//           >
//             Login
//           </Button>
//           {error && <Text color="red.500">{error}</Text>}
//         </VStack>
//       </Box>
//     </ChakraProvider>
//   );
// };

// export default LoginComponent;

// import React, { useState } from "react";
// import {
//   ChakraProvider,
//   Box,
//   Button,
//   Input,
//   Text,
//   VStack,
//   HStack,
//   Radio,
//   RadioGroup,
//   useToast,
//   Icon,
// } from "@chakra-ui/react";
// import { FaUserShield, FaStore, FaUserTie, FaUser } from "react-icons/fa";
// import axios from "axios";

// const LoginComponent = ({ onLoginSuccess }) => {
//   const [role, setRole] = useState("vendor"); // Role only for adjusting API link
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const toast = useToast();
//   const hostCode = "default"; // HostCode is set to 'default'

//   const handleLogin = async (event) => {
//     event.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       console.log("Logging in with:", { username, password, hostCode, role });

//       const apiUrl = `https://esmpbe.id.vn/api/user/login/${role}`;
//       const response = await axios.post(apiUrl, {
//         username,
//         password,
//       });

//       const { accessToken, userInfo } = response.data;

//       // Extract data from userInfo
//       const { hostInfo } = userInfo;

//       // Log full response to verify structure
//       console.log("Full User Info:", JSON.stringify(userInfo, null, 2));

//       // Extract and save key details
//       const userid = userInfo.userid || "N/A";
//       const expiretime = hostInfo?.expiretime || "N/A";
//       const bankingaccount = userInfo.bankingaccount || "N/A";
//       const phone = userInfo.phone || "N/A";
//       const email = hostInfo?.hostName || "N/A";
//       const eventstoragetime = userInfo.eventstoragetime || "N/A";
//       const hostid = hostInfo?.hostId || "N/A";

//       // Save details in sessionStorage
//       sessionStorage.setItem("userid", userid);
//       sessionStorage.setItem("expiretime", expiretime);
//       sessionStorage.setItem("bankingaccount", bankingaccount);
//       sessionStorage.setItem("phone", phone);
//       sessionStorage.setItem("email", email);
//       sessionStorage.setItem("eventstoragetime", eventstoragetime);
//       sessionStorage.setItem("hostid", hostid);

//       // Pass accessToken and userInfo on successful login
//       onLoginSuccess(accessToken, userInfo);

//       // Show success toast
//       toast({
//         title: "Đăng nhập thành công",
//         description: `Logged in as ${role}`,
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//         position: "top",
//       });
//     } catch (err) {
//       console.error("Login error:", err.response);

//       setError("Login failed. Please check your credentials.");
//       toast({
//         title: "Đăng nhập thất bại",
//         description: "Invalid username or password",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//         position: "top",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ChakraProvider>
//       <Box
//         position="relative"
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         minHeight="100vh"
//         bgGradient="radial-gradient(circle at 20% 50%, #001f3f, #001f1f, #000)"
//         overflow="hidden"
//         _before={{
//           content: '""',
//           position: "absolute",
//           top: "-100px",
//           right: "-100px",
//           width: "400px",
//           height: "400px",
//           bgGradient: "radial(circle, rgba(255,255,255,0.1), transparent)",
//           borderRadius: "50%",
//           filter: "blur(150px)",
//         }}
//         _after={{
//           content: '""',
//           position: "absolute",
//           bottom: "-150px",
//           left: "-150px",
//           width: "600px",
//           height: "600px",
//           bgGradient: "radial(circle, rgba(255,255,255,0.2), transparent)",
//           borderRadius: "50%",
//           filter: "blur(200px)",
//         }}
//       >
//         <VStack
//           zIndex={1}
//           bg="white"
//           borderRadius="md"
//           boxShadow="lg"
//           p={8}
//           spacing={6}
//           w="lg"
//         >
//           <Text fontSize="2xl" fontWeight="bold" textAlign="center">
//             Choose Account Type
//           </Text>
//           <RadioGroup value={role} onChange={setRole}>
//             <HStack spacing={8}>
//               <VStack
//                 as="label"
//                 border="2px"
//                 borderColor={role === "admin" ? "blue.500" : "gray.300"}
//                 borderRadius="md"
//                 p={4}
//                 cursor="pointer"
//               >
//                 <Icon as={FaUserShield} boxSize={12} />
//                 <Text>Admin</Text>
//                 <Radio value="admin" />
//               </VStack>
//               <VStack
//                 as="label"
//                 border="2px"
//                 borderColor={role === "vendor" ? "blue.500" : "gray.300"}
//                 borderRadius="md"
//                 p={4}
//                 cursor="pointer"
//               >
//                 <Icon as={FaStore} boxSize={12} />
//                 <Text>Vendor</Text>
//                 <Radio value="vendor" />
//               </VStack>
//               <VStack
//                 as="label"
//                 border="2px"
//                 borderColor={role === "host" ? "blue.500" : "gray.300"}
//                 borderRadius="md"
//                 p={4}
//                 cursor="pointer"
//               >
//                 <Icon as={FaUserTie} boxSize={12} />
//                 <Text>Host</Text>
//                 <Radio value="host" />
//               </VStack>
//               <VStack
//                 as="label"
//                 border="2px"
//                 borderColor={role === "staff" ? "blue.500" : "gray.300"}
//                 borderRadius="md"
//                 p={4}
//                 cursor="pointer"
//               >
//                 <Icon as={FaUser} boxSize={12} />
//                 <Text>Staff</Text>
//                 <Radio value="staff" />
//               </VStack>
//             </HStack>
//           </RadioGroup>

//           <Text>
//             Hello {role.toLowerCase()}! Please fill out the form below to get
//             started.
//           </Text>

//           <Input
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             size="lg"
//           />
//           <Input
//             placeholder="Password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             size="lg"
//           />

//           <Button
//             colorScheme="blue"
//             w="full"
//             size="lg"
//             isLoading={loading}
//             onClick={handleLogin}
//           >
//             Login
//           </Button>
//           {error && <Text color="red.500">{error}</Text>}
//         </VStack>
//       </Box>
//     </ChakraProvider>
//   );
// };

// export default LoginComponent;

import React, { useState } from "react";
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
import projectLogo from "../assets/images/logo.png"; // Đường dẫn đến logo của project
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

      // Pass accessToken and userInfo on successful login
      onLoginSuccess(accessToken, userInfo);

      // Show success toast
      toast({
        title: "Đăng nhập thành công",
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
        title: "Đăng nhập thất bại",
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
        <Image src={projectLogo} alt="Project Logo" boxSize="50px" />
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
