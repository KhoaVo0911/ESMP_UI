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
import { FaUserShield, FaStore, FaUserTie, FaUser } from "react-icons/fa";
import axios from "axios";

const LoginComponent = ({ onLoginSuccess }) => {
  const [role, setRole] = useState("vendor"); // Role only for adjusting API link
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();
  const hostCode = "default"; // HostCode is set to 'default'

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Log the data being sent to ensure it is correct
      console.log("Logging in with:", { username, password, hostCode });

      // Set the correct API URL dynamically based on the selected role
      const apiUrl = `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/user/login/${role}`;

      // Send the login request
      const response = await axios.post(apiUrl, {
        username,
        password,
      });

      const { accessToken, userInfo } = response.data;

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
      console.error("Login error:", err.response); // Log error response for debugging

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
          w="lg"
        >
          <Text fontSize="2xl" fontWeight="bold" textAlign="center">
            Choose Account Type
          </Text>
          <RadioGroup value={role} onChange={setRole}>
            <HStack spacing={8}>
              <VStack
                as="label"
                border="2px"
                borderColor={role === "admin" ? "blue.500" : "gray.300"}
                borderRadius="md"
                p={4}
                cursor="pointer"
              >
                <Icon as={FaUserShield} boxSize={12} />
                <Text>Admin</Text>
                <Radio value="admin" />
              </VStack>
              <VStack
                as="label"
                border="2px"
                borderColor={role === "vendor" ? "blue.500" : "gray.300"}
                borderRadius="md"
                p={4}
                cursor="pointer"
              >
                <Icon as={FaStore} boxSize={12} />
                <Text>Vendor</Text>
                <Radio value="vendor" />
              </VStack>
              <VStack
                as="label"
                border="2px"
                borderColor={role === "host" ? "blue.500" : "gray.300"}
                borderRadius="md"
                p={4}
                cursor="pointer"
              >
                <Icon as={FaUserTie} boxSize={12} />
                <Text>Host</Text>
                <Radio value="host" />
              </VStack>
              <VStack
                as="label"
                border="2px"
                borderColor={role === "staff" ? "blue.500" : "gray.300"}
                borderRadius="md"
                p={4}
                cursor="pointer"
              >
                <Icon as={FaUser} boxSize={12} />
                <Text>Staff</Text>
                <Radio value="staff" />
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
            size="lg"
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="lg"
          />

          <Button
            colorScheme="blue"
            w="full"
            size="lg"
            isLoading={loading}
            onClick={handleLogin}
          >
            Login
          </Button>
          {error && <Text color="red.500">{error}</Text>}
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default LoginComponent;
