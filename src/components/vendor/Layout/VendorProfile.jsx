import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  Input,
  Button,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const VendorProfile = () => {
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedVendor, setUpdatedVendor] = useState({
    name: "",
    email: "",
    urlQr: "",
  });
  const toast = useToast();
  const vendorId = sessionStorage.getItem("vendorId");
  // Lấy các thông tin từ sessionStorage
  const hostId = sessionStorage.getItem("hostId");
  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    // Gọi API để lấy thông tin vendor
    axios
      .get(`/vendor/${vendorId}`)
      .then((response) => {
        setVendorData(response.data);
        setUpdatedVendor({
          name: response.data.name,
          email: response.data.email,
          urlQr: response.data.urlQr,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load vendor data");
        setLoading(false);
      });
  }, [vendorId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedVendor({
      name: vendorData.name,
      email: vendorData.email,
      urlQr: vendorData.urlQr,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedVendor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Chỉ gửi các trường name, email, urlQr
    const updatedData = {
      name: updatedVendor.name,
      email: updatedVendor.email,
      urlQr: updatedVendor.urlQr,
    };

    try {
      // Gửi PUT request
      const response = await axios.put(`/vendor/${vendorId}`, updatedData, {
        headers: {
          Authorization: `${accessToken}`,
          "Host-Id": hostId,
        },
      });

      // Cập nhật dữ liệu mới và thông báo thành công
      setVendorData(response.data);
      setIsEditing(false);
      toast({
        title: "Profile updated.",
        description: "Your vendor profile has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log("There was an error updating your profile.", error);
      // toast({
      //   title: 'Update failed.',
      //   description: 'There was an error updating your profile.',
      //   status: 'error',
      //   duration: 3000,
      //   isClosable: true
      // });
    }
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <Box p={4} borderWidth={1} borderRadius="md" boxShadow="md">
      <VStack spacing={4} align="flex-start">
        <Heading size="lg">{vendorData.name}</Heading>
        <FormControl id="name">
          <FormLabel>Name</FormLabel>
          <Input
            isDisabled={!isEditing}
            name="name"
            value={updatedVendor.name}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input
            isDisabled={!isEditing}
            name="email"
            value={updatedVendor.email}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id="urlQr">
          <FormLabel>QR Code URL</FormLabel>
          <Input
            isDisabled={!isEditing}
            name="urlQr"
            value={updatedVendor.urlQr}
            onChange={handleChange}
          />
        </FormControl>
        <Text>
          <strong>Phone:</strong> {vendorData.phone || "N/A"}
        </Text>
        <Text>
          <strong>Address:</strong> {vendorData.address}
        </Text>

        <VStack spacing={4} direction="row" align="center">
          {isEditing ? (
            <>
              <Button onClick={handleSubmit} colorScheme="blue">
                Save
              </Button>
              <Button onClick={handleCancel} colorScheme="gray">
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit} colorScheme="teal">
              Edit
            </Button>
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

export default VendorProfile;
