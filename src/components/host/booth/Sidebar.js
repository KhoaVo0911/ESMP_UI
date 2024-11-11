// Sidebar.js
import React, { useRef, useState } from "react";
import {
  Box,
  VStack,
  Icon,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Center,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  MdPanTool,
  MdAddBox,
  MdTextFields,
  MdImage,
  MdOutlineFormatShapes,
  MdWeb,
} from "react-icons/md";
import { FaMousePointer } from "react-icons/fa";
import { FaSquare, FaCircle, FaStar, FaArrowUp } from "react-icons/fa";
import {
  BsFillPentagonFill,
  BsFillHexagonFill,
  BsFillTriangleFill,
} from "react-icons/bs";

const Sidebar = ({
  setMode,
  openBoothModal,
  addShape,
  addElement,
  addText,
  selectedMode,
  addImage,
}) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);

  const handleImageButtonClick = () => {
    setIsImageModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = () => {
    if (imagePreview) {
      const img = new window.Image();
      img.src = imagePreview;
      img.onload = () => {
        const newImage = {
          type: "image",
          src: img.src,
          x: 100,
          y: 100,
          width: img.width,
          height: img.height,
        };
        addImage(newImage);
        setIsImageModalOpen(false);
        setImagePreview(null);
      };
    }
  };

  const closeModal = () => {
    setIsImageModalOpen(false);
    setImagePreview(null);
  };

  return (
    <Box
      p={2}
      borderRight="1px solid"
      borderColor="gray.200"
      bg="white"
      height="100vh"
      display="flex"
      justifyContent="center"
    >
      <VStack spacing={4} justifyContent="center" alignItems="center">
        <Box
          as="button"
          onClick={() => setMode("select")}
          display="flex"
          flexDirection="column"
          alignItems="center"
          className={selectedMode === "select" ? "selected-tool" : ""}
        >
          <Icon as={FaMousePointer} boxSize={6} />
          <Text>Select</Text>
        </Box>

        <Box
          as="button"
          onClick={() => setMode("hand")}
          display="flex"
          flexDirection="column"
          alignItems="center"
          className={selectedMode === "hand" ? "selected-tool" : ""}
        >
          <Icon as={MdPanTool} boxSize={6} />
          <Text>Hand</Text>
        </Box>

        <Box
          as="button"
          onClick={() => openBoothModal()}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Icon as={MdAddBox} boxSize={6} />
          <Text>Booth</Text>
        </Box>

        <Box
          as="button"
          onClick={() => addText()}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Icon as={MdTextFields} boxSize={6} />
          <Text>Text</Text>
        </Box>

        <Box
          as="button"
          onClick={handleImageButtonClick}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Icon as={MdImage} boxSize={6} />
          <Text>Image</Text>
        </Box>

        <Menu>
          <MenuButton
            as={Box}
            display="flex"
            flexDirection="column"
            alignItems="center"
            cursor="pointer"
          >
            <Icon as={MdOutlineFormatShapes} boxSize={6} />
            <Text>Shape</Text>
          </MenuButton>
          <MenuList>
            <MenuItem icon={<FaSquare />} onClick={() => addShape("rectangle")}>
              Rectangle
            </MenuItem>
            <MenuItem icon={<FaCircle />} onClick={() => addShape("circle")}>
              Circle
            </MenuItem>
            <MenuItem
              icon={<BsFillPentagonFill />}
              onClick={() => addShape("pentagon")}
            >
              Pentagon
            </MenuItem>
            <MenuItem
              icon={<BsFillHexagonFill />}
              onClick={() => addShape("hexagon")}
            >
              Hexagon
            </MenuItem>
            <MenuItem
              icon={<BsFillTriangleFill />}
              onClick={() => addShape("triangle")}
            >
              Triangle
            </MenuItem>
            <MenuItem icon={<FaStar />} onClick={() => addShape("star")}>
              Star
            </MenuItem>
            <MenuItem icon={<FaArrowUp />} onClick={() => addShape("arrow")}>
              Arrow
            </MenuItem>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton
            as={Box}
            display="flex"
            flexDirection="column"
            alignItems="center"
            cursor="pointer"
          >
            <Icon as={MdWeb} boxSize={6} />
            <Text>Elements</Text>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => addElement("coffee")}>Coffee</MenuItem>
            <MenuItem onClick={() => addElement("toilet")}>Toilet</MenuItem>
            <MenuItem onClick={() => addElement("door")}>Door</MenuItem>
            <MenuItem onClick={() => addElement("food")}>Food</MenuItem>
          </MenuList>
        </Menu>
      </VStack>

      <Modal isOpen={isImageModalOpen} onClose={closeModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose Image</ModalHeader>
          <ModalBody>
            <Center>
              <Input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={handleImageChange}
                border="none"
                p={2}
                cursor="pointer"
              />
            </Center>
            {imagePreview && (
              <Box mt={4} textAlign="center">
                <Image src={imagePreview} alt="Preview" maxWidth="100%" />
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={closeModal} variant="outline" mr={3}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleUploadImage}
              isDisabled={!imagePreview}
            >
              Upload
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Sidebar;
