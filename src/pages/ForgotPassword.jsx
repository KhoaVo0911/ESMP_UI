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
import forget from "../assets/images/forgot.png";
import projectLogo from "../assets/images/trans_bg.png";
import tree from "../assets/images/tree.png";
import axios from "axios";

// API URL constants
const API_SEND_EMAIL = "https://esmpbe.id.vn/api/mail/send-email"; // Ensure the URL is correct
const API_FORGOT_PASSWORD = "https://esmpbe.id.vn/api/user/forget-password"; // Ensure the URL is correct

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false); // State for email sending progress
  const toast = useToast();
  const [error, setError] = useState(null);

  const handleSendEmail = async (email, accountId) => {
    setSendingEmail(true); // Show loading spinner for email sending
    try {
      const emailBody = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; }
              .container { width: 100%; max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 10px; }
              .header { background-color: #4caf50; color: white; padding: 10px; text-align: center; }
              .content { padding: 20px; }
              .footer { text-align: center; font-size: 12px; color: #888; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header"><h1>Password Reset</h1></div>
              <div class="content">
                <p>Dear user,</p>
                <p>We received a request to reset your password. Please click the link below to reset your password:</p>
                <p><a href="http://localhost:3000/reset-password?accountId=${accountId}">Reset Password</a></p>
                <p>If you did not request a password reset, please ignore this email.</p>
              </div>
              <div class="footer">
                <p>Best regards,<br>Your Company</p>
              </div>
            </div>
          </body>
        </html>
      `;

      await axios.post(API_SEND_EMAIL, {
        toEmail: email,
        subject: "Your Account Details",
        body: emailBody,
      });
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setSendingEmail(false); // Hide email sending spinner
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // Validate the email
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    console.log("Sending reset link to email:", email);

    try {
      // Send forgot password request to API
      const response = await axios.post(
        API_FORGOT_PASSWORD, // Ensure URL is correct
        { email }
      );

      if (response.status === 200) {
        // Extract email and accountId from the response data
        const { email, accountId } = response.data;

        // Ensure email and accountId are returned
        if (email && accountId) {
          // Send reset password email with the accountId in the link
          await handleSendEmail(email, accountId);

          toast({
            title: "Success",
            description: "A reset link has been sent to your email.",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        } else {
          toast({
            title: "Error",
            description: "Account data is missing. Please try again.",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to send reset link. Please try again later.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (err) {
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
      <Box position="absolute" top={4} left={4}>
        <Image src={projectLogo} alt="Project Logo" boxSize="140px" />
      </Box>

      {/* Left side - Image */}
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
          alt="Forgot Password"
          width="100%"
          height="auto"
          maxWidth="580px"
        />
      </Box>

      {/* Right side - Forgot Password Form */}
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
            Forgot Your Password?
          </Text>

          <Text fontSize="medium" color="gray.400" mb={6}>
            Enter your email address to receive a reset link.
          </Text>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel htmlFor="email">Email Address</FormLabel>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </FormControl>

            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isFullWidth
              mt={4}
              isLoading={loading}
              _hover={{ bg: "blue.500" }}
            >
              Send Reset Link
            </Button>
          </Stack>
          <Divider my={4} />

          <Text fontSize="sm" color="gray.500" textAlign="center" mt={4}>
            Remember your password?{" "}
            <Text
              as="span"
              color="blue.500"
              cursor="pointer"
              onClick={() => (window.location.href = "/login")}
            >
              Back to Login
            </Text>
          </Text>
        </Box>
      </Box>

      {/* Bottom-left decoration */}
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

export default ForgotPassword;
