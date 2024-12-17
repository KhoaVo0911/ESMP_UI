import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import bcrypt from "bcryptjs"; // Import bcryptjs để mã hóa mật khẩu
import {
  Box,
  Flex,
  Avatar,
  Text,
  Heading,
  FormControl,
  FormLabel,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Input,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import avatar from "../../assets/images/avatardefault_92824.png";

const Settings = () => {
  const { hostId } = useParams(); // Lấy hostId từ URL
  const [user, setUser] = useState({
    account: {
      id: "",
      username: "",
      password: "",
      name: "",
      phoneNumber: "",
      email: "",
    }, // Lưu mật khẩu để so sánh khi cập nhật
    bankingaccount: "", // Thêm banking account
    expiretime: "",
    eventstoragetime: "", // Thời gian lưu trữ sự kiện sẽ được gửi trong API
  });
  const [isEditing, setIsEditing] = useState(false); // Cờ chỉnh sửa hồ sơ
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(""); // Lỗi xác nhận mật khẩu
  const [oldPasswordError, setOldPasswordError] = useState(""); // Lỗi mật khẩu cũ
  const toast = useToast();

  // Hàm chuyển expiretime từ chuỗi ISO sang định dạng ngày tháng dễ đọc
  const convertExpireTime = (expiretime) => {
    if (!expiretime) return "";
    const date = new Date(expiretime);
    return date.toISOString().slice(0, 16); // Lấy phần ngày và giờ
  };

  useEffect(() => {
    if (!hostId) return;

    // Lấy dữ liệu từ API
    axios
      .get(`https://esmpbe.id.vn/api/host/${hostId}`)
      .then((response) => {
        const data = response.data;
        setUser({
          account: data.account,
          username: data.account.username,
          password: data.account.password, // Lưu mật khẩu hiện tại để so sánh
          name: data.account.name,
          phoneNumber: data.account.phone,
          email: data.account.email,
          bankingaccount: data.bankingaccount || "", // Lấy tài khoản ngân hàng
          expiretime: data.expiretime, // Lưu nguyên giá trị để gửi lên API
          eventstoragetime: data.eventstoragetime,
        });
      })
      .catch((error) => {
        console.error("Error fetching host data", error);
      });
  }, [hostId]);

  // Hàm cập nhật thông tin người dùng
  const handleUpdateProfile = () => {
    const updatedUser = { ...user };

    // Không bao gồm expiretime và eventstoragetime trong UI nhưng giữ lại để gửi lên API
    delete updatedUser.expiretime;
    delete updatedUser.eventstoragetime;

    // Gửi dữ liệu người dùng đã cập nhật lên API
    axios
      .put(`https://esmpbe.id.vn/api/host/${hostId}`, updatedUser)
      .then(() => {
        alert("Profile updated successfully!");
        setIsEditing(false); // Thoát khỏi chế độ chỉnh sửa
      })
      .catch((error) => {
        console.error("Error updating profile", error);
      });
  };

  // Hàm cập nhật mật khẩu
  // const handleUpdatePassword = () => {
  //   // Reset trạng thái lỗi
  //   setPasswordError("");
  //   setOldPasswordError("");

  //   // Kiểm tra mật khẩu cũ
  //   if (oldPassword !== user.password) {
  //     setOldPasswordError("Old password is incorrect.");
  //     return; // Dừng nếu mật khẩu cũ không chính xác
  //   }

  //   // Kiểm tra mật khẩu mới và xác nhận mật khẩu
  //   if (newPassword !== confirmPassword) {
  //     setPasswordError("New password and confirm password do not match.");
  //     return;
  //   }
  //   // Dữ liệu gửi lên API
  //   const passwordData = {
  //     newPassword, // Mã hóa mật khẩu mới
  //   };

  //   // Lấy accountId từ dữ liệu người dùng
  //   const accountId = user.account?.id; // Sử dụng optional chaining để tránh lỗi nếu account undefined
  //   if (!accountId) {
  //     console.error("Account ID is undefined");
  //     return;
  //   }

  //   // Gửi yêu cầu cập nhật mật khẩu
  //   axios
  //     .put(
  //       `https://esmpbe.id.vn/api/user/newpassword/${accountId}`,
  //       passwordData
  //     )
  //     .then(() => {
  //       alert("Mật khẩu đã được cập nhật thành công!");
  //       // Reset lại các trường mật khẩu
  //       setOldPassword("");
  //       setNewPassword("");
  //       setConfirmPassword("");
  //     })
  //     .catch((error) => {
  //       console.error("Error updating password", error);
  //     });
  // };

  const handleUpdatePassword = () => {
    // Reset trạng thái lỗi
    setPasswordError("");
    setOldPasswordError("");

    // Kiểm tra mật khẩu cũ
    if (!oldPassword) {
      setOldPasswordError("Please enter old password.");
      return;
    }

    if (oldPassword !== user.password) {
      setOldPasswordError("Old password is incorrect.");
      return; // Dừng nếu mật khẩu cũ không chính xác
    }

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu
    if (!newPassword) {
      setPasswordError("Please enter new password.");
      return;
    }

    if (!confirmPassword) {
      setPasswordError("Please confirm new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    // Dữ liệu gửi lên API
    const passwordData = {
      newPassword, // Mã hóa mật khẩu mới
    };

    const accountId = user.account?.id; // Lấy accountId từ dữ liệu người dùng
    if (!accountId) {
      console.error("Account ID is undefined");
      return;
    }

    axios
      .put(
        `https://esmpbe.id.vn/api/user/newpassword/${accountId}`,
        passwordData
      )
      .then(() => {
        toast({
          title: "Successfully!",
          description: "Password updated successfully.",
          status: "success",
          duration: 3000, // Thời gian hiển thị (ms)
          isClosable: true, // Cho phép đóng thông báo
          position: "top-right", // Vị trí xuất hiện
        });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        console.error("Error updating password", error);
      });
  };

  return (
    <Box bg="gray.50" minHeight="100vh">
      <Box
        bgGradient="linear(to-r, blue.200, purple.200)"
        h="180px"
        borderRadius="0 0 2xl 2xl"
        mb={8}
      />

      <Box
        maxW="900px"
        mx="auto"
        bg="white"
        borderRadius="lg"
        shadow="lg"
        p={6}
      >
        <Flex alignItems="center" justify="space-between" mb={8}>
          <Flex alignItems="center">
            <Avatar size="xl" src={avatar} />
            <Box ml={6}>
              <Heading as="h2" size="lg" fontWeight="bold">
                {user.name || "Loading..."}
              </Heading>
              <Text fontSize="md" color="gray.500">
                {user.email || "Loading..."}
              </Text>
            </Box>
          </Flex>

          {/* Nút Edit Profile */}
          <Button
            colorScheme="blue"
            onClick={() => setIsEditing((prev) => !prev)}
            variant="outline"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </Flex>

        {/* Tabs cho My Details và Password */}
        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList>
            <Tab>My Profile</Tab>
            <Tab>Password</Tab>
          </TabList>

          <TabPanels mt={4}>
            {/* My Details Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                {/* Các trường thông tin người dùng */}
                <FormControl>
                  <FormLabel>Username</FormLabel>
                  {isEditing ? (
                    <Input
                      value={user.username}
                      onChange={(e) =>
                        setUser({ ...user, username: e.target.value })
                      }
                    />
                  ) : (
                    <Text>{user.username || "Loading..."}</Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Name</FormLabel>
                  {isEditing ? (
                    <Input
                      value={user.name}
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                    />
                  ) : (
                    <Text>{user.name || "Loading..."}</Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  {isEditing ? (
                    <Input
                      value={user.phoneNumber}
                      onChange={(e) =>
                        setUser({ ...user, phoneNumber: e.target.value })
                      }
                    />
                  ) : (
                    <Text>{user.phoneNumber || "Loading..."}</Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Email Address</FormLabel>
                  {isEditing ? (
                    <Input
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                    />
                  ) : (
                    <Text>{user.email || "Loading..."}</Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Banking Account</FormLabel>
                  {isEditing ? (
                    <Input
                      value={user.bankingaccount}
                      onChange={(e) =>
                        setUser({ ...user, bankingaccount: e.target.value })
                      }
                    />
                  ) : (
                    <Text>{user.bankingaccount || "Loading..."}</Text>
                  )}
                </FormControl>

                {/* Nút Lưu thay đổi */}
                {isEditing && (
                  <Button
                    colorScheme="blue"
                    onClick={handleUpdateProfile}
                    w="full"
                    mt={4}
                  >
                    Save Changes
                  </Button>
                )}
              </VStack>
            </TabPanel>

            {/* Password Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                {/* Trường mật khẩu cũ */}
                <FormControl isInvalid={!!oldPasswordError}>
                  <FormLabel>Old Password</FormLabel>
                  <Input
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    type="password"
                    placeholder="Your Old Password"
                  />
                  {oldPasswordError && (
                    <Text color="red.500">{oldPasswordError}</Text>
                  )}
                </FormControl>

                {/* Trường mật khẩu mới */}
                <FormControl>
                  <FormLabel>New Password</FormLabel>
                  <Input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type="password"
                    placeholder="Your New Password"
                  />
                </FormControl>

                {/* Trường xác nhận mật khẩu */}
                <FormControl isInvalid={passwordError}>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    placeholder="Confirm your password"
                  />
                  {passwordError && (
                    <Text color="red.500">{passwordError}</Text>
                  )}
                </FormControl>

                {/* Nút lưu mật khẩu */}
                <Button
                  colorScheme="blue"
                  size="lg"
                  alignSelf="flex-end"
                  onClick={handleUpdatePassword}
                >
                  Save Password
                </Button>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default Settings;
