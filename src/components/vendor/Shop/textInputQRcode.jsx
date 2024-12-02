import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ChakraProvider,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  List,
  ListItem,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

const TestQRCODE = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [bankCode, setBankCode] = useState(""); // Allow bank code to be edited manually
  const [accountNumber, setAccountNumber] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Search term for bank name/code
  const [filteredBanks, setFilteredBanks] = useState([]); // Filtered bank results
  const [selectedBank, setSelectedBank] = useState(""); // Store selected bank name
  const [vendorName, setVendorName] = useState(""); // Store vendor name
  const [vendorEmail, setVendorEmail] = useState(""); // Store vendor email
  const toast = useToast();

  // Retrieve vendorId and accessToken from sessionStorage
  const vendorId = sessionStorage.getItem("vendorId");
  const accessToken = sessionStorage.getItem("accessToken");

  const banks = [
    { code: "970415", name: "VietinBank" },
    { code: "970436", name: "Vietcombank" },
    { code: "970418", name: "BIDV" },
    { code: "970405", name: "Agribank" },
    { code: "970448", name: "OCB" },
    { code: "970422", name: "MBBank" },
    { code: "970407", name: "Techcombank" },
    { code: "970416", name: "ACB" },
    { code: "970432", name: "VPBank" },
    { code: "970423", name: "TPBank" },
  ];

  // Fetch URL QR code and vendor details from the API on component load
  useEffect(() => {
    const fetchVendorInfo = async () => {
      try {
        const response = await axios.get(
          `https://esmpbe.id.vn/api/vendor/${vendorId}`,
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const { name, email, urlQr } = response.data;

        // Set vendor details
        setVendorName(name);
        setVendorEmail(email);

        if (urlQr) {
          // Extract bank code and account number from the URL
          const [bankCodeFromApi, accountNumberFromApi] = urlQr.split("-");
          setBankCode(bankCodeFromApi);
          setAccountNumber(accountNumberFromApi);

          // Find the selected bank from the bank list
          const selectedBank = banks.find((bank) => bank.code === bankCodeFromApi);
          if (selectedBank) {
            setSelectedBank(selectedBank.name);
          }

          const qrImageUrl = `https://img.vietqr.io/image/${urlQr}-compact2.png?amount=0&addInfo=Event Tech&accountName=YourName`;
          setQrCodeUrl(qrImageUrl);
        }
      } catch (error) {
        console.error("Error fetching QR code info:", error);
        toast({
          title: "Error fetching QR info",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    if (vendorId && accessToken) {
      fetchVendorInfo();
    }
  }, [vendorId, accessToken]);

  // Handle search input and filter banks
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value === "") {
      setFilteredBanks([]);
      return;
    }

    const results = banks.filter(
      (bank) =>
        bank.name.toLowerCase().includes(value.toLowerCase()) ||
        bank.code.includes(value)
    );
    setFilteredBanks(results);
  };

  // Handle bank selection
  const handleSelectBank = (bank) => {
    setBankCode(bank.code); // Update the bank code field
    setSearchTerm(bank.name); // Show bank name in the input field
    setFilteredBanks([]); // Clear the search suggestions
    setSelectedBank(bank.name); // Set the selected bank name
  };

  const handleGenerateQR = async () => {
    if (!bankCode || !accountNumber) {
      toast({
        title: "Please enter all details!",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Combine the bankCode and accountNumber to form the new urlQr
    const newQrUrl = `${bankCode}-${accountNumber}`;
    const qrImageUrl = `https://img.vietqr.io/image/${newQrUrl}-compact2.png?amount=0&addInfo=Event Tech&accountName=YourName`;
    setQrCodeUrl(qrImageUrl);
    onOpen();

    // Data to update
    const updatedData = {
      name: vendorName, // Use vendor name from the GET request
      email: vendorEmail, // Use vendor email from the GET request
      urlQr: newQrUrl, // This is dynamically generated
    };

    // Update the URL QR in the API
    try {
      const response = await axios.put(
        `https://esmpbe.id.vn/api/vendor/${vendorId}`,
        updatedData, // Send the updated name, email, and urlQr
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        sessionStorage.setItem("urlQr", newQrUrl); // Save the updated QR URL to sessionStorage
        toast({
          title: "QR URL updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating QR URL:", error);
      toast({
        title: "Error updating QR URL",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider>
      <Box maxW="md" mx="auto" mt={10} p={5} borderWidth={1} borderRadius="lg" boxShadow="lg">
        {/* Bank search */}
        <FormControl mb={4}>
          <FormLabel>Bank Code or Name</FormLabel>
          <Input
            value={searchTerm} // Use searchTerm for input value
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Enter bank code or name"
          />
          {filteredBanks.length > 0 && (
            <List
              bg="white"
              border="1px solid #ddd"
              borderRadius="md"
              mt={2}
              maxH="150px"
              overflowY="auto"
              boxShadow="sm"
            >
              {filteredBanks.map((bank) => (
                <ListItem
                  key={bank.code}
                  p={2}
                  borderBottom="1px solid #ddd"
                  _hover={{ bg: "gray.100", cursor: "pointer" }}
                  onClick={() => handleSelectBank(bank)}
                >
                  {bank.code} - {bank.name}
                </ListItem>
              ))}
            </List>
          )}
        </FormControl>

        {/* Account Number */}
        <FormControl mb={4}>
          <FormLabel>Account Number</FormLabel>
          <Input
            type="text"
            placeholder="Enter account number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
        </FormControl>

        <Button colorScheme="teal" onClick={handleGenerateQR} isFullWidth>
          Generate Quicklink
        </Button>

        {/* QR Code Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Your QR Code</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {qrCodeUrl && <Image src={qrCodeUrl} alt="QR Code" />}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  );
};

export default TestQRCODE;
