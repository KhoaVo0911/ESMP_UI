// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Image,
//   Input,
//   VStack,
//   HStack,
//   Text,
//   useDisclosure,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalCloseButton,
//   IconButton,
// } from "@chakra-ui/react";
// import { DeleteIcon } from "@chakra-ui/icons";
// import { storage } from "../../shared/firebase/firebaseConfig";
// import {
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   listAll,
//   deleteObject,
// } from "firebase/storage";

// const ImageEventManagement = ({ eventId, hostId }) => {
//   const [imageFile, setImageFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState("");
//   const [uploadedImages, setUploadedImages] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(""); // Hình được chọn để xem chi tiết
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   // Fetch uploaded images
//   const fetchUploadedImages = async () => {
//     const imagesRef = ref(storage, `${hostId}/${eventId}`);
//     try {
//       const imagesList = await listAll(imagesRef);
//       const urls = await Promise.all(
//         imagesList.items.map(async (item) => ({
//           url: await getDownloadURL(item),
//           ref: item,
//         }))
//       );
//       setUploadedImages(urls);
//     } catch (error) {
//       console.error("Error fetching images:", error);
//     }
//   };

//   useEffect(() => {
//     if (eventId && hostId) {
//       fetchUploadedImages();
//     }
//   }, [eventId, hostId]);

//   const handleImageUpload = async () => {
//     if (!imageFile || !eventId || !hostId) {
//       alert("File ảnh, Event ID và Host ID là bắt buộc");
//       return;
//     }

//     const imageRef = ref(storage, `${hostId}/${eventId}/${imageFile.name}`);
//     try {
//       await uploadBytes(imageRef, imageFile);
//       const url = await getDownloadURL(imageRef);
//       setUploadedImages([...uploadedImages, { url, ref: imageRef }]);
//       setPreviewUrl("");
//       setImageFile(null); // Reset file input
//       //   alert("Ảnh đã được tải lên thành công!");
//     } catch (error) {
//       console.error("Error uploading image:", error);
//     }
//   };

//   const handleImageClick = (url) => {
//     setSelectedImage(url);
//     onOpen();
//   };

//   const handleDeleteImage = async (imageRef) => {
//     try {
//       await deleteObject(imageRef);
//       setUploadedImages(
//         uploadedImages.filter((image) => image.ref !== imageRef)
//       );
//       //   alert("Xóa hình ảnh thành công!");
//     } catch (error) {
//       console.error("Error deleting image:", error);
//       //   alert("Lỗi khi xóa hình ảnh!");
//     }
//   };

//   // Tính toán kích thước hình ảnh theo số lượng
//   const calculateImageSize = () => {
//     const count = uploadedImages.length;
//     if (count <= 4) return "240px";
//     if (count <= 10) return "200px";
//     if (count <= 15) return "180px";
//     return "120px";
//   };

//   const imageSize = calculateImageSize();

//   return (
//     <HStack
//       spacing={24}
//       align="flex-start"
//       p={4}
//       borderWidth="1px"
//       borderRadius="md"
//       boxShadow="sm"
//     >
//       {/* Preview và upload */}
//       <VStack align="start" spacing={4}>
//         {/* Preview Box */}
//         <Box
//           border="2px dashed gray"
//           width="200px"
//           height="140px"
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           bg="gray.50"
//           borderRadius="md"
//         >
//           {previewUrl ? (
//             <Image src={previewUrl} alt="Preview" maxH="100%" />
//           ) : (
//             <Text color="gray.500">Preview Image</Text>
//           )}
//         </Box>

//         {/* Nút chọn và upload ảnh */}
//         <VStack spacing={2} align="stretch" width="200px">
//           <Input
//             type="file"
//             accept="image/*"
//             onChange={(e) => {
//               const file = e.target.files[0];
//               setImageFile(file);
//               setPreviewUrl(URL.createObjectURL(file));
//             }}
//             display="none"
//             id="image-upload"
//           />
//           <Button as="label" htmlFor="image-upload" colorScheme="blue">
//             Choose Image
//           </Button>
//           <Button
//             colorScheme="teal"
//             onClick={handleImageUpload}
//             isDisabled={!imageFile}
//           >
//             Upload Image
//           </Button>
//         </VStack>
//       </VStack>

//       {/* Danh sách ảnh */}
//       <HStack wrap="wrap" spacing={4} align="start">
//         {uploadedImages.slice(1).map(({ url, ref }, index) => (
//           <Box
//             key={index}
//             borderWidth="1px"
//             borderRadius="md"
//             overflow="hidden"
//             boxShadow="md"
//             width={imageSize}
//             height={imageSize}
//             bg="white"
//             position="relative"
//           >
//             <Image
//               src={url}
//               alt={`Uploaded ${index + 1}`}
//               objectFit="cover"
//               width="100%"
//               height="100%"
//               onClick={() => handleImageClick(url)}
//               cursor="pointer"
//             />
//             {/* Nút xóa hình */}
//             <IconButton
//               icon={<DeleteIcon />}
//               size="sm"
//               colorScheme="red"
//               position="absolute"
//               top="5px"
//               right="5px"
//               onClick={() => handleDeleteImage(ref)}
//               aria-label="Delete Image"
//             />
//           </Box>
//         ))}
//       </HStack>

//       {/* Popup xem chi tiết hình */}
//       <Modal isOpen={isOpen} onClose={onClose} size="lg">
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Image Preview</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             <Image src={selectedImage} alt="Selected" width="100%" />
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </HStack>
//   );
// };

// export default ImageEventManagement;

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
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
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
  const [selectedImage, setSelectedImage] = useState(""); // Selected image for preview
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const toast = useToast();

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
      alert("Image file, Event ID, and Host ID are required.");
      return;
    }

    const imageRef = ref(storage, `${hostId}/${eventId}/${imageFile.name}`);
    try {
      await uploadBytes(imageRef, imageFile);
      const url = await getDownloadURL(imageRef);
      setUploadedImages([...uploadedImages, { url, ref: imageRef }]);
      setPreviewUrl("");
      setImageFile(null); // Reset file input
      // alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleImageClick = (url) => {
    setSelectedImage(url);
    onOpen();
  };

  const openDeleteDialog = (imageRef) => {
    setImageToDelete(imageRef);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteImage = async () => {
    if (!imageToDelete) return;

    try {
      await deleteObject(imageToDelete);
      setUploadedImages(
        uploadedImages.filter((image) => image.ref !== imageToDelete)
      );
      toast({
        title: "Image deleted",
        description: "The image has been deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Error",
        description: "There was an error deleting the image.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsDeleteDialogOpen(false);
    }
  };

  // Calculate image size based on the number of images
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
      {/* Preview and upload */}
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

        {/* Choose and upload image buttons */}
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

      {/* Image list */}
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
            {/* Delete image button */}
            <IconButton
              icon={<DeleteIcon />}
              size="sm"
              colorScheme="red"
              position="absolute"
              top="5px"
              right="5px"
              onClick={() => openDeleteDialog(ref)}
              aria-label="Delete Image"
            />
          </Box>
        ))}
      </HStack>

      {/* Image preview modal */}
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

      {/* Confirm delete dialog */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Confirm Deletion</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this image?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                variant="ghost"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteImage} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </HStack>
  );
};

export default ImageEventManagement;
