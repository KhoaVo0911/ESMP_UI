import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  FormControl,
  Input,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const UpdateApiBanking = ({ isOpen, onClose }) => {
  const hostId = sessionStorage.getItem("hostId"); // Get hostId from sessionStorage
  const [data, setData] = useState(null); // State to store all fetched data
  const [bankingAccount, setBankingAccount] = useState("");
  const [apiBanking, setApiBanking] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  // Fetch current data on component mount
  useEffect(() => {
    if (!hostId) {
      console.warn("Host ID not found in sessionStorage");
      return;
    }

    const fetchBankingData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://esmpbe.id.vn/api/host/${hostId}`
        );

        // Assuming the response contains all fields, we'll only display the banking info for editing
        setData(response.data);
        setBankingAccount(response.data.bankingaccount || "");
        setApiBanking(response.data.apibanking || "");
      } catch (error) {
        console.error("Error fetching banking data", error);
        // toast({
        //   title: "Error fetching data.",
        //   description: "There was an issue fetching the current banking data.",
        //   status: "error",
        //   duration: 5000,
        //   isClosable: true,
        // });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBankingData();
  }, [hostId]);

  const handleSubmit = async () => {
    if (!bankingAccount || !apiBanking) {
      toast({
        title: "Validation Error.",
        description: "Please fill in both fields.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data with only the fields you want to update
      const updatedData = {
        name: data.account.name, // Giữ nguyên tên hiện tại
        phone: data.account.phone, // Giữ nguyên số điện thoại hiện tại
        email: data.account.email, // Giữ nguyên email hiện tại
        expiretime: data.expiretime, // Giữ nguyên thời gian hết hạn
        eventstoragetime: data.eventstoragetime, // Giữ nguyên thời gian lưu trữ sự kiện
        bankingaccount: bankingAccount, // Cập nhật tài khoản ngân hàng
        apibanking: apiBanking, // Cập nhật liên kết API ngân hàng
      };

      // Send PUT request with only the fields that need to be updated
      const response = await axios.put(
        `https://esmpbe.id.vn/api/host/${hostId}`,
        updatedData
      );
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Banking data updated successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose(); // Close the modal on success
      }
    } catch (error) {
      console.error("Error updating banking data", error);
      // toast({
      //   title: "Error updating data.",
      //   description: "There was an issue updating the banking data.",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      // });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update API Banking Information</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <form>
              {/* Only render the fields for banking account and API banking */}
              <FormControl mb={4}>
                <FormLabel htmlFor="bankingAccount">Banking Account</FormLabel>
                <Input
                  id="bankingAccount"
                  value={bankingAccount}
                  onChange={(e) => setBankingAccount(e.target.value)}
                  placeholder="Enter banking account"
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel htmlFor="apiBanking">API Banking Link</FormLabel>
                <Input
                  id="apiBanking"
                  value={apiBanking}
                  onChange={(e) => setApiBanking(e.target.value)}
                  placeholder="Enter API banking link"
                />
              </FormControl>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                loadingText="Submitting"
                isFullWidth
              >
                Update Banking Info
              </Button>
            </form>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UpdateApiBanking;
