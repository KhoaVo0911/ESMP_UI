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
//   IconButton,
//   Tooltip,
//   FormErrorMessage,
// } from "@chakra-ui/react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { InfoIcon } from "@chakra-ui/icons";
// import * as Yup from "yup"; // Import Yup
// import regiser from "../assets/images/register.png";
// import projectLogo from "../assets/images/trans_bg.png";
// import tree from "../assets/images/tree.png";

// // Schema validation với Yup
// const validationSchema = Yup.object({
//   name: Yup.string().required("Full name is required."),
//   username: Yup.string()
//     .matches(
//       /^[A-Za-z][A-Za-z0-9-]{7,39}$/,
//       "Username must be between 8 - 40 characters and start with only letters and contain only letters, numbers, and hyphens."
//     )
//     .required("Username is required."),
//   email: Yup.string()
//     .email("Invalid email format")
//     .required("Email is required."),
//   phone: Yup.string().required("Phone number is required."),
//   password: Yup.string()
//     .matches(
//       /^[A-Za-z][.@A-Za-z0-9-]{7,39}$/,
//       "Password must be between 8 - 40 characters and start with only letters and contain only letters, numbers, dots, and hyphens."
//     )
//     .required("Password is required."),
// });

// const RegisterHostComponent = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     email: "",
//     phone: "",
//     name: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const toast = useToast();
//   const navigate = useNavigate();

//   // Hàm để kiểm tra và cập nhật giá trị form
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleRegister = async (event) => {
//     event.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       // Validate dữ liệu trước khi gửi
//       await validationSchema.validate(formData, { abortEarly: false });

//       const currentDate = new Date();
//       const expiretime = new Date(
//         currentDate.setFullYear(currentDate.getFullYear() + 1)
//       ).toISOString(); // Tính expiretime

//       const apiUrl = "https://esmpbe.id.vn/api/user/register";

//       // Gửi request đăng ký
//       const response = await axios.post(apiUrl, {
//         username: formData.username,
//         password: formData.password,
//         email: formData.email,
//         phone: formData.phone,
//         name: formData.name, // Truyền tên người dùng
//         expiretime, // Thêm expiretime
//       });

//       const { message } = response.data;

//       // Sau khi đăng ký thành công, gọi API thông báo
//       const notificationApiUrl = `https://esmpbe.id.vn/api/user/notification`;
//       await axios.post(notificationApiUrl, {
//         source: `${formData.username} has successfully registered an account`, // Thông báo bằng tiếng Anh
//       });

//       toast({
//         title: "Registration Successful",
//         description: message || "Host account created successfully.",
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//         position: "top",
//       });

//       navigate("/login");
//     } catch (err) {
//       if (err.name === "ValidationError") {
//         setError(err.errors);
//       } else {
//         setError("Unable to create account. Please try again.");
//       }
//       toast({
//         title: "Registration Failed",
//         description: error || "Unable to create account. Please try again.",
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
//             Create Account for Host
//             <Tooltip label="A Host can organize and manage events on the platform.">
//               <IconButton
//                 icon={<InfoIcon />}
//                 aria-label="Info"
//                 size="sm"
//                 variant="link"
//                 color="blue.500"
//                 ml={2}
//               />
//             </Tooltip>
//           </Text>

//           <Text fontSize="medium" color="gray.400" mb={6}>
//             Please fill in the details to create your Host account.
//           </Text>
//           <Stack spacing={4}>
//             <FormControl isInvalid={!!error}>
//               <FormLabel htmlFor="name">Full Name</FormLabel>
//               <Input
//                 id="name"
//                 name="name"
//                 type="text"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Enter your full name"
//               />
//               <Text fontSize="sm" color="gray.500">
//                 Full name is required.
//               </Text>
//             </FormControl>

//             <FormControl isInvalid={!!error}>
//               <FormLabel htmlFor="username">Username</FormLabel>
//               <Input
//                 id="username"
//                 name="username"
//                 type="text"
//                 value={formData.username}
//                 onChange={handleChange}
//                 placeholder="Enter your username"
//               />
//               <FormErrorMessage>{error?.username}</FormErrorMessage>
//               <Text fontSize="sm" color="gray.500">
//                 Username must be between 8 - 40 characters and start with only
//                 letters and contain only letters, numbers, and hyphens.
//               </Text>
//             </FormControl>

//             <FormControl isInvalid={!!error}>
//               <FormLabel htmlFor="email">Email</FormLabel>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Enter your email"
//               />
//               <FormErrorMessage>{error?.email}</FormErrorMessage>
//               <Text fontSize="sm" color="gray.500">
//                 Invalid email format. Email is required.
//               </Text>
//             </FormControl>

//             <FormControl isInvalid={!!error}>
//               <FormLabel htmlFor="phone">Phone Number</FormLabel>
//               <Input
//                 id="phone"
//                 name="phone"
//                 type="text"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder="Enter your phone number"
//               />
//               <FormErrorMessage>{error?.phone}</FormErrorMessage>
//               <Text fontSize="sm" color="gray.500">
//                 Phone number is required.
//               </Text>
//             </FormControl>

//             <FormControl isInvalid={!!error}>
//               <FormLabel htmlFor="password">Password</FormLabel>
//               <Input
//                 id="password"
//                 name="password"
//                 type="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Enter your password"
//               />
//               <FormErrorMessage>{error?.password}</FormErrorMessage>
//               <Text fontSize="sm" color="gray.500">
//                 Password must be between 8 - 40 characters and start with only
//                 letters and contain only letters, numbers, dots, and hyphens.
//               </Text>
//             </FormControl>

//             <Button
//               colorScheme="blue"
//               onClick={handleRegister}
//               isFullWidth
//               mt={4}
//               _hover={{ bg: "blue.500" }}
//               isLoading={loading}
//             >
//               Create Account
//             </Button>
//           </Stack>
//           <Divider my={4} />

//           <Text fontSize="sm" color="gray.500" textAlign="center" mt={4}>
//             Already have an account?{" "}
//             <Text
//               as="span"
//               color="blue.500"
//               cursor="pointer"
//               onClick={() => navigate("/login")}
//             >
//               Login here
//             </Text>
//           </Text>
//         </Box>
//       </Box>

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

// export default RegisterHostComponent;

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
  FormErrorMessage,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { InfoIcon } from "@chakra-ui/icons";
import * as Yup from "yup"; // Import Yup
import { useFormik } from "formik"; // Import Formik
import regiser from "../assets/images/register.png";
import projectLogo from "../assets/images/trans_bg.png";
import tree from "../assets/images/tree.png";

// Schema validation với Yup
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
          currentDate.setFullYear(currentDate.getFullYear() + 1)
        ).toISOString(); // Tính expiretime

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

        navigate("/login");
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
        position="relative"
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
    </Box>
  );
};

export default RegisterHostComponent;
