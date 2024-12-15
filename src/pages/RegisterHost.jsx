
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
  IconButton,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormErrorMessage,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { InfoIcon, CheckIcon } from "@chakra-ui/icons";
import * as Yup from "yup"; // Import Yup
import { useFormik } from "formik"; // Import Formik
import regiser from "../assets/images/register.png";
import projectLogo from "../assets/images/trans_bg.png";
import tree from "../assets/images/tree.png";

// Schema validation with Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Full name is required."),
  username: Yup.string()
    .matches(
      /^[a-z][a-z0-9]{7,39}$/,
      "Username must be 8-40 characters, lowercase, and start with a letter."
    )
    .required("Username is required."),
  email: Yup.string()
    .email("Invalid email format.")
    .required("Email is required."),
  phone: Yup.string()
    .matches(/^\d+$/, "Phone number must be numeric.")
    .required("Phone number is required."),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,40}$/,
      "Password must be 8-40 characters, including uppercase, lowercase, number, and special character."
    )
    .required("Password is required."),
});

const RegisterHostComponent = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      email: "",
      phone: "",
      name: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const currentDate = new Date();
        const expiretime = new Date(
          currentDate.getFullYear() , // Trừ 1 năm
          currentDate.getMonth(),       // Tháng hiện tại
          currentDate.getDate() - 1,        // Ngày hiện tại
        ).toISOString(); // Chuyển thành định dạng ISO

        const apiUrl = "https://esmpbe.id.vn/api/user/register";

        // Gửi request đăng ký
        const response = await axios.post(apiUrl, {
          ...values,
          expiretime,
        });

        const { message } = response.data;

        // Sau khi đăng ký thành công, gọi API thông báo
        const notificationApiUrl = `https://esmpbe.id.vn/api/user/notification`;
        await axios.post(notificationApiUrl, {
          source: `${values.username} has successfully registered an account`,
        });

        toast({
          title: "Registration Successful",
          description: message || "Host account created successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });

        onOpen(); 
      } catch (error) {
        toast({
          title: "Registration Failed",
          description: "Unable to create account. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box display="flex" height="100vh" position="relative">
      <Box
        flex="1"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bg="white"
        boxShadow="lg"
        borderRadius="lg"
        padding={8}
      >
        <Box width="100%" maxWidth="400px">
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            Create Account for Host
            <Tooltip label="A Host can organize and manage events on the platform.">
              <IconButton
                icon={<InfoIcon />}
                aria-label="Info"
                size="sm"
                variant="link"
                color="blue.500"
                ml={2}
              />
            </Tooltip>
          </Text>

          <Text fontSize="medium" color="gray.400" mb={6}>
            Please fill in the details to create your Host account.
          </Text>

          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={4}>
              {[
                { name: "name", label: "Full Name", type: "text" },
                { name: "username", label: "Username", type: "text" },
                { name: "email", label: "Email", type: "email" },
                { name: "phone", label: "Phone Number", type: "text" },
                { name: "password", label: "Password", type: "password" },
              ].map(({ name, label, type }) => (
                <FormControl
                  key={name}
                  isInvalid={
                    formik.touched[name] && Boolean(formik.errors[name])
                  }
                >
                  <FormLabel htmlFor={name}>{label}</FormLabel>
                  <Input
                    id={name}
                    name={name}
                    type={type}
                    value={formik.values[name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={`Enter your ${label.toLowerCase()}`}
                  />
                  <FormErrorMessage>{formik.errors[name]}</FormErrorMessage>
                </FormControl>
              ))}

              <Button
                colorScheme="blue"
                type="submit"
                isFullWidth
                mt={4}
                _hover={{ bg: "blue.500" }}
                isLoading={formik.isSubmitting}
              >
                Create Account
              </Button>
            </Stack>
          </form>

          <Divider my={4} />

          <Text fontSize="sm" color="gray.500" textAlign="center" mt={4}>
            Already have an account?{" "}
            <Text
              as="span"
              color="blue.500"
              cursor="pointer"
              onClick={() => navigate("/login")}
            >
              Login here
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

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={() => {}} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Account Registration Successful</ModalHeader>
          <ModalBody>
            <Text fontSize="lg" mb={4}>
              Your account has been successfully registered and forwarded to the
              Admin.
            </Text>
            <Text fontSize="md" mb={6}>
              Please contact the Admin to activate your account.
            </Text>
            <Box textAlign="center" mb={4}>
              <IconButton
                icon={<CheckIcon />}
                aria-label="Success"
                colorScheme="green"
                size="lg"
                isRound
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => navigate("/login")}
              width="100%"
            >
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpen} onClose={() => {}} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Account Registration Successful</ModalHeader>
          <ModalBody>
            <Text fontSize="lg" mb={4}>
              Your account has been successfully registered and forwarded to the
              Admin.
            </Text>
            <Text fontSize="md" mb={6}>
              Please contact the Admin to activate your account.
            </Text>
            <Box textAlign="center" mb={4}>
              <IconButton
                icon={<CheckIcon />}
                aria-label="Success"
                colorScheme="green"
                size="lg"
                isRound
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => navigate("/login")}
              width="100%"
            >
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


    </Box>

    
  );
};

export default RegisterHostComponent;
