import React, { useState } from "react";
import axios from "axios";
import {
  ChakraProvider,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  List,
  ListItem,
  Select,
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
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Giá trị tìm kiếm
  const [filteredBanks, setFilteredBanks] = useState([]); // Kết quả tìm kiếm
  const toast = useToast();

  // Lấy vendorId và accessToken từ sessionStorage
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

  // Xử lý tìm kiếm ngân hàng
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

  // Xử lý khi chọn ngân hàng
  const handleSelectBank = (bank) => {
    setBankCode(bank.code);
    setSearchTerm(bank.name); // Hiển thị tên ngân hàng trong ô input
    setFilteredBanks([]); // Xóa danh sách gợi ý
  };

  const handleGenerateQR = async () => {
    if (!bankCode || !accountNumber) {
      toast({
        title: "Vui lòng nhập đầy đủ thông tin!",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newQrUrl = `${bankCode}-${accountNumber}`;
    const qrImageUrl = `https://img.vietqr.io/image/${newQrUrl}-compact2.png?amount=0&addInfo=Event Tech&accountName=YourName`;
    setQrCodeUrl(qrImageUrl);
    onOpen();

    // Cập nhật urlQr vào API
    try {
      const response = await axios.put(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/vendor/${vendorId}`,
        { urlQr: newQrUrl },
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Cập nhật sessionStorage và phát sự kiện
        sessionStorage.setItem("urlQr", newQrUrl);
        toast({
          title: "Cập nhật URL QR thành công!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật URL QR:", error);
      toast({
        title: "Lỗi khi cập nhật URL QR",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider>
      <Box maxW="md" mx="auto" mt={10} p={5} borderWidth={1} borderRadius="lg" boxShadow="lg">
        <FormControl mb={4}>
          <FormLabel>Mã hoặc tên ngân hàng</FormLabel>
          <Input
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Nhập mã hoặc tên ngân hàng"
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

        <FormControl mb={4}>
          <FormLabel>Hoặc chọn từ danh sách</FormLabel>
          <Select
            placeholder="Chọn ngân hàng"
            onChange={(e) => {
              const selected = banks.find((bank) => bank.code === e.target.value);
              if (selected) handleSelectBank(selected);
            }}
            value={bankCode || ""}
          >
            {banks.map((bank) => (
              <option key={bank.code} value={bank.code}>
                {bank.code} - {bank.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Số tài khoản</FormLabel>
          <Input
            type="text"
            placeholder="Nhập số tài khoản"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
        </FormControl>

        <Button colorScheme="teal" onClick={handleGenerateQR} isFullWidth>
          Tạo Quicklink
        </Button>

        {/* QR Code Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>QR Code của bạn</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {qrCodeUrl && <Image src={qrCodeUrl} alt="QR Code" />}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" onClick={onClose}>
                Đóng
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  );
};

export default TestQRCODE;
