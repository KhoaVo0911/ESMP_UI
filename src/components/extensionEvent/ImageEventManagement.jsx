import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Image,
  Input,
  VStack,
  HStack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  IconButton,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { storage } from "../../shared/firebase/firebaseConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";

const ImageEventManagement = ({ eventId, hostId }) => {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(""); // Hình được chọn để xem chi tiết
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch uploaded images
  const fetchUploadedImages = async () => {
    const imagesRef = ref(storage, `${hostId}/${eventId}`);
    try {
      const imagesList = await listAll(imagesRef);
      const urls = await Promise.all(
        imagesList.items.map(async (item) => ({
          url: await getDownloadURL(item),
          ref: item,
        }))
      );
      setUploadedImages(urls);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    if (eventId && hostId) {
      fetchUploadedImages();
    }
  }, [eventId, hostId]);

  const handleImageUpload = async () => {
    if (!imageFile || !eventId || !hostId) {
      alert("File ảnh, Event ID và Host ID là bắt buộc");
      return;
    }

    const imageRef = ref(storage, `${hostId}/${eventId}/${imageFile.name}`);
    try {
      await uploadBytes(imageRef, imageFile);
      const url = await getDownloadURL(imageRef);
      setUploadedImages([...uploadedImages, { url, ref: imageRef }]);
      setPreviewUrl("");
      setImageFile(null); // Reset file input
      //   alert("Ảnh đã được tải lên thành công!");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleImageClick = (url) => {
    setSelectedImage(url);
    onOpen();
  };

  const handleDeleteImage = async (imageRef) => {
    try {
      await deleteObject(imageRef);
      setUploadedImages(
        uploadedImages.filter((image) => image.ref !== imageRef)
      );
      //   alert("Xóa hình ảnh thành công!");
    } catch (error) {
      console.error("Error deleting image:", error);
      //   alert("Lỗi khi xóa hình ảnh!");
    }
  };

  // Tính toán kích thước hình ảnh theo số lượng
  const calculateImageSize = () => {
    const count = uploadedImages.length;
    if (count <= 4) return "240px";
    if (count <= 10) return "200px";
    if (count <= 15) return "180px";
    return "120px";
  };

  const imageSize = calculateImageSize();

  return (
    <HStack
      spacing={24}
      align="flex-start"
      p={4}
      borderWidth="1px"
      borderRadius="md"
      boxShadow="sm"
    >
      {/* Preview và upload */}
      <VStack align="start" spacing={4}>
        {/* Preview Box */}
        <Box
          border="2px dashed gray"
          width="200px"
          height="140px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bg="gray.50"
          borderRadius="md"
        >
          {previewUrl ? (
            <Image src={previewUrl} alt="Preview" maxH="100%" />
          ) : (
            <Text color="gray.500">Preview Image</Text>
          )}
        </Box>

        {/* Nút chọn và upload ảnh */}
        <VStack spacing={2} align="stretch" width="200px">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setImageFile(file);
              setPreviewUrl(URL.createObjectURL(file));
            }}
            display="none"
            id="image-upload"
          />
          <Button as="label" htmlFor="image-upload" colorScheme="blue">
            Choose Image
          </Button>
          <Button
            colorScheme="teal"
            onClick={handleImageUpload}
            isDisabled={!imageFile}
          >
            Upload Image
          </Button>
        </VStack>
      </VStack>

      {/* Danh sách ảnh */}
      <HStack wrap="wrap" spacing={4} align="start">
        {uploadedImages.slice(1).map(({ url, ref }, index) => (
          <Box
            key={index}
            borderWidth="1px"
            borderRadius="md"
            overflow="hidden"
            boxShadow="md"
            width={imageSize}
            height={imageSize}
            bg="white"
            position="relative"
          >
            <Image
              src={url}
              alt={`Uploaded ${index + 1}`}
              objectFit="cover"
              width="100%"
              height="100%"
              onClick={() => handleImageClick(url)}
              cursor="pointer"
            />
            {/* Nút xóa hình */}
            <IconButton
              icon={<DeleteIcon />}
              size="sm"
              colorScheme="red"
              position="absolute"
              top="5px"
              right="5px"
              onClick={() => handleDeleteImage(ref)}
              aria-label="Delete Image"
            />
          </Box>
        ))}
      </HStack>

      {/* Popup xem chi tiết hình */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Image Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src={selectedImage} alt="Selected" width="100%" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </HStack>
  );
};

export default ImageEventManagement;
