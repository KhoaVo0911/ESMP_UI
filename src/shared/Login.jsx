import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  Button,
  Input,
  Text,
  VStack,
  HStack,
  Radio,
  RadioGroup,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { FaUserShield, FaStore, FaUserTie, FaUsers } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../shared/auth/AuthContext";

const LoginPage = () => {
  const [role, setRole] = useState("Admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://668e540abf9912d4c92dcd67.mockapi.io/login"
      );

      const user = response.data.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        const { role: userRole } = user;

        if (userRole.toLowerCase() !== role.toLowerCase()) {
          toast({
            title: "Role mismatch",
            description: `Loại tài khoản không khớp! Vui lòng chọn ${userRole} để đăng nhập.`,
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        } else {
          login(user);
          toast({
            title: "Đăng nhập thành công",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
          });

          if (userRole === "admin") {
            navigate("/admin");
          } else if (userRole === "host") {
            navigate("/dashboard");
          } else if (userRole === "manager") {
            navigate("/dashboardVendor");
          } else if (userRole === "staff") {
            navigate("/eventStaff");
          }
        }
      } else {
        toast({
          title: "Invalid credentials",
          description: "Sai tên đăng nhập hoặc mật khẩu.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Đã xảy ra lỗi khi kết nối tới server.",
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
    <ChakraProvider>
      <Box
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgGradient="radial-gradient(circle at 20% 50%, #001f3f, #001f1f, #000)"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          bgGradient: "radial(circle, rgba(255,255,255,0.1), transparent)",
          borderRadius: "50%",
          filter: "blur(150px)",
        }}
        _after={{
          content: '""',
          position: "absolute",
          bottom: "-150px",
          left: "-150px",
          width: "600px",
          height: "600px",
          bgGradient: "radial(circle, rgba(255,255,255,0.2), transparent)",
          borderRadius: "50%",
          filter: "blur(200px)",
        }}
      >
        <VStack
          zIndex={1}
          bg="white"
          borderRadius="md"
          boxShadow="lg"
          p={8}
          spacing={6}
          w="sm"
        >
          <Text fontSize="2xl" fontWeight="bold" textAlign="center">
            Choose Account Type
          </Text>
          <RadioGroup value={role} onChange={setRole}>
            <HStack spacing={4} justifyContent="space-around" w="full">
              <VStack
                as="label"
                border="2px"
                borderColor={role === "Admin" ? "blue.500" : "gray.300"}
                borderRadius="md"
                p={4}
                cursor="pointer"
                width="full"
                textAlign="center"
              >
                <Icon as={FaUserShield} boxSize={10} />
                <Text>Admin</Text>
                <Radio value="Admin" />
              </VStack>
              <VStack
                as="label"
                border="2px"
                borderColor={role === "Host" ? "blue.500" : "gray.300"}
                borderRadius="md"
                p={4}
                cursor="pointer"
                width="full"
                textAlign="center"
              >
                <Icon as={FaUserTie} boxSize={10} />
                <Text>Host</Text>
                <Radio value="Host" />
              </VStack>
              <VStack
                as="label"
                border="2px"
                borderColor={role === "Manager" ? "blue.500" : "gray.300"}
                borderRadius="md"
                p={4}
                cursor="pointer"
                width="full"
                textAlign="center"
              >
                <Icon as={FaStore} boxSize={10} />
                <Text>Manager</Text>
                <Radio value="Manager" />
              </VStack>
              <VStack
                as="label"
                border="2px"
                borderColor={role === "Staff" ? "blue.500" : "gray.300"}
                borderRadius="md"
                p={4}
                cursor="pointer"
                width="full"
                textAlign="center"
              >
                <Icon as={FaUsers} boxSize={10} />
                <Text>Staff</Text>
                <Radio value="Staff" />
              </VStack>
            </HStack>
          </RadioGroup>

          <Text>
            Hello {role.toLowerCase()}! Please fill out the form below to get
            started.
          </Text>

          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            colorScheme="blue"
            w="full"
            isLoading={loading}
            onClick={handleLogin}
          >
            Login
          </Button>
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default LoginPage;
