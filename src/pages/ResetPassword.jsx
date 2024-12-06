// import React, { useState } from "react";
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
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import forget from "../assets/images/forgot.png"; // Hình ảnh quên mật khẩu
// import projectLogo from "../assets/images/logo.png"; // Logo của dự án
// import tree from "../assets/images/tree.png"; // Hình ảnh trang trí bên dưới

// const ResetPassword = () => {
//   const { accountId } = useParams(); // Lấy accountId từ URL
//   const navigate = useNavigate();
//   const [newPassword, setNewPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const toast = useToast();

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setLoading(true);

//     try {
//       const response = await axios.post(
//         `https://esmpbe.id.vn/api/user/newpassword/${accountId}`,
//         { newPassword }
//       );

//       if (response.status === 200) {
//         toast({
//           title: "Success",
//           description:
//             "Password reset successfully. You can now log in with your new password.",
//           status: "success",
//           duration: 3000,
//           isClosable: true,
//           position: "top",
//         });
//         navigate("/login");
//       } else {
//         toast({
//           title: "Error",
//           description: "Failed to reset password. Please try again.",
//           status: "error",
//           duration: 3000,
//           isClosable: true,
//           position: "top",
//         });
//       }
//     } catch (err) {
//       toast({
//         title: "Error",
//         description: "An error occurred. Please try again.",
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
//     <Box display="flex" height="100vh" position="relative">
//       {/* Logo của dự án ở góc trái */}
//       <Box position="absolute" top={4} left={4}>
//         <Image src={projectLogo} alt="Project Logo" boxSize="50px" />
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
//           src={forget}
//           alt="Logo"
//           width="100%"
//           height="auto"
//           maxWidth="580px"
//         />
//       </Box>

//       {/* Bên phải - Form Reset Password */}
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
//           <Text fontSize="2xl" fontWeight="bold" mb={2}>
//             Reset Your Password
//           </Text>

//           <Text fontSize="medium" color="gray.400" mb={6}>
//             Enter your new password below.
//           </Text>
//           <Stack spacing={4}>
//             <FormControl>
//               <FormLabel htmlFor="newPassword">New Password</FormLabel>
//               <Input
//                 id="newPassword"
//                 type="password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 placeholder="Enter new password"
//               />
//             </FormControl>

//             <Button
//               colorScheme="blue"
//               onClick={handleSubmit}
//               isFullWidth
//               mt={4}
//               isLoading={loading}
//               _hover={{ bg: "blue.500" }}
//             >
//               Reset Password
//             </Button>
//           </Stack>
//           <Divider my={4} />
//         </Box>
//       </Box>

//       {/* Hình ảnh trang trí ở góc dưới bên trái */}
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

// export default ResetPassword;

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
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import forget from "../assets/images/forgot.png"; // Hình ảnh quên mật khẩu
import projectLogo from "../assets/images/trans_bg.png"; // Logo của dự án
import tree from "../assets/images/tree.png"; // Hình ảnh trang trí bên dưới

const ResetPassword = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const accountId = searchParams.get("accountId"); // Lấy accountId từ query string
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  // Regular expression for password validation
  const passwordPattern = /^[A-Za-z][.@A-Za-z0-9-]{7,39}$/;

  const validatePassword = (password) => {
    // Validate password pattern
    if (!password.match(passwordPattern)) {
      return "Password must be between 8 - 40 characters and start with only letters and contain only letters, numbers, dots, and hyphens.";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(""); // Clear previous error

    // Validate new password
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      // Kiểm tra giá trị của accountId
      console.log("Account ID:", accountId); // Kiểm tra nếu accountId hợp lệ

      // Sử dụng phương thức PUT và truyền accountId vào URL
      const response = await axios.put(
        `https://esmpbe.id.vn/api/user/newpassword/${accountId}`, // Đảm bảo thay thế :accountId với giá trị thực tế
        { newPassword }
      );

      if (response.status === 200) {
        toast({
          title: "Success",
          description:
            "Password reset successfully. You can now log in with your new password.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        navigate("/login"); // Điều hướng đến trang login sau khi reset mật khẩu thành công
      } else {
        toast({
          title: "Error",
          description: "Failed to reset password. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (err) {
      console.error("Error:", err); // In lỗi để kiểm tra chi tiết hơn
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
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
      {/* Logo của dự án ở góc trái */}
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
          src={forget}
          alt="Logo"
          width="100%"
          height="auto"
          maxWidth="580px"
        />
      </Box>

      {/* Bên phải - Form Reset Password */}
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
            Reset Your Password
          </Text>

          <Text fontSize="medium" color="gray.400" mb={6}>
            Enter your new password below.
          </Text>
          <Stack spacing={4}>
            <FormControl isInvalid={error}>
              <FormLabel htmlFor="newPassword">New Password</FormLabel>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              {error && (
                <Text color="red.500" fontSize="sm">
                  {error}
                </Text>
              )}
            </FormControl>

            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isFullWidth
              mt={4}
              isLoading={loading}
              _hover={{ bg: "blue.500" }}
            >
              Reset Password
            </Button>
          </Stack>
          <Divider my={4} />
        </Box>
      </Box>

      {/* Hình ảnh trang trí ở góc dưới bên trái */}
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

export default ResetPassword;
