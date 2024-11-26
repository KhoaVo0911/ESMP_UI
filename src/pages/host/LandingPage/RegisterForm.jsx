import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const RegisterForm = () => {
  // Tính toán ngày hết hạn (expiretime) là 7 ngày sau
  const today = new Date();
  today.setDate(today.getDate() + 7);
  const expiretime = today.toISOString(); // Chuyển đổi ngày thành định dạng ISO 8601

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    phone: "",
    email: "",
    expiretime: expiretime, // Cố định giá trị expiretime
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("https://esmpbe.id.vn/api/user/register", formData);
      toast({
        title: "Success",
        description: "Registration successful!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setFormData({
        username: "",
        password: "",
        name: "",
        phone: "",
        email: "",
        expiretime: expiretime, // Đảm bảo giữ nguyên giá trị expiretime
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="500px" mx="auto" p={6} bg="white" borderRadius="md" boxShadow="lg">
      <Heading as="h2" size="xl" textAlign="center" mb={6}>
        Register Account
      </Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="name">Full Name</FormLabel>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="phone">Phone</FormLabel>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </FormControl>

          {/* Disable input field for expiretime */}
          {/* <FormControl isRequired>
            <FormLabel htmlFor="expiretime">Expiration Date</FormLabel>
            <Input
              type="datetime-local"
              id="expiretime"
              name="expiretime"
              value={formData.expiretime}
              onChange={handleChange}
              disabled
            />
          </FormControl> */}

          <Button
            colorScheme="blue"
            isFullWidth
            type="submit"
            isLoading={isLoading}
            loadingText="Submitting"
          >
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default RegisterForm;
