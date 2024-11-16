import React, { useState } from 'react';
import axios from 'axios';
import {
  ChakraProvider,
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
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
} from '@chakra-ui/react';

const TestQRCODE = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const toast = useToast();

  // Lấy vendorId và accessToken từ sessionStorage
  const vendorId = sessionStorage.getItem('vendorId');
  const accessToken = sessionStorage.getItem('accessToken');

  const banks = [
    { code: '970415', name: 'VietinBank' },
    { code: '970436', name: 'Vietcombank' },
    { code: '970418', name: 'BIDV' },
    { code: '970405', name: 'Agribank' },
    { code: '970448', name: 'OCB' },
    { code: '970422', name: 'MBBank' },
    { code: '970407', name: 'Techcombank' },
    { code: '970416', name: 'ACB' },
    { code: '970432', name: 'VPBank' },
    { code: '970423', name: 'TPBank' },
    { code: '970437', name: 'Sacombank' },
    { code: '970433', name: 'HDBank' },
    { code: '970454', name: 'VietCapitalBank' },
    { code: '970429', name: 'SCB' },
    { code: '970441', name: 'VIB' },
    { code: '970443', name: 'SHB' },
    { code: '970431', name: 'Eximbank' },
    { code: '970426', name: 'MSB' },
  ];

  const handleGenerateQR = async () => {
    const newQrUrl = `${bankCode}-${accountNumber}`;
    const qrImageUrl = `https://img.vietqr.io/image/${newQrUrl}-compact2.png?amount=0&addInfo=Event Tech&accountName=YourName`;
    setQrCodeUrl(qrImageUrl);
    onOpen();
  
    console.log("Trước khi cập nhật sessionStorage:", sessionStorage.getItem('qrUrl'));
  
    // Cập nhật urlQr vào API sau khi QR Code được tạo
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
        // Cập nhật urlQr mới vào sessionStorage
        sessionStorage.setItem('qrUrl', newQrUrl);
        console.log("Sau khi cập nhật sessionStorage:", sessionStorage.getItem('qrUrl'));
  
        toast({
          title: 'Cập nhật URL QR thành công!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật URL QR:', error);
      toast({
        title: 'Lỗi khi cập nhật URL QR',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  return (
    <ChakraProvider>
      <Box maxW="md" mx="auto" mt={10} p={5} borderWidth={1} borderRadius="lg" boxShadow="lg">
        <FormControl id="bank" mb={4}>
          <FormLabel>Ngân hàng</FormLabel>
          <Select placeholder="Chọn ngân hàng" onChange={(e) => setBankCode(e.target.value)}>
            {banks.map((bank) => (
              <option key={bank.code} value={bank.code}>
                ({bank.code}) {bank.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="accountNumber" mb={4}>
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
