import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Flex,
} from "@chakra-ui/react";

// BoothDetails (modal showing booth details)
const BoothDetails = ({ booth, isOpen, onClose, onSave, locationTypes }) => {
  const [boothDetails, setBoothDetails] = useState({
    name: booth?.name || "",
    type:
      booth?.type || (locationTypes.length > 0 ? locationTypes[0].name : ""),
    width: booth?.width || 100,
    height: booth?.height || 100,
    x: booth?.x || 0,
    y: booth?.y || 0,
  });

  // Cập nhật state khi booth thay đổi (sử dụng useEffect)
  useEffect(() => {
    setBoothDetails({
      name: booth?.name || "",
      type:
        booth?.type || (locationTypes.length > 0 ? locationTypes[0].name : ""),
      width: booth?.width || 100,
      height: booth?.height || 100,
      x: booth?.x || 0,
      y: booth?.y || 0,
    });
  }, [booth, locationTypes]);

  const handleSave = () => {
    onSave(boothDetails);
    onClose(); // Close the modal after saving
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Booth Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Booth Name */}
          <FormControl mb={4}>
            <FormLabel>Booth Name</FormLabel>
            <Input
              value={boothDetails.name}
              onChange={(e) =>
                setBoothDetails({ ...boothDetails, name: e.target.value })
              }
            />
          </FormControl>

          {/* Booth Type */}
          <FormControl mb={4}>
            <FormLabel>Booth Type</FormLabel>
            <Select
              value={boothDetails.type}
              onChange={(e) =>
                setBoothDetails({ ...boothDetails, type: e.target.value })
              }
            >
              {locationTypes.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name} (
                  {type.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                  )
                </option>
              ))}
            </Select>
          </FormControl>

          {/* Booth Dimensions and Position */}
          <Flex mb={4}>
            <FormControl mr={2}>
              <FormLabel>Width (px)</FormLabel>
              <Input
                type="number"
                value={boothDetails.width}
                onChange={(e) =>
                  setBoothDetails({
                    ...boothDetails,
                    width: parseFloat(e.target.value),
                  })
                }
              />
            </FormControl>
            <FormControl ml={2}>
              <FormLabel>Height (px)</FormLabel>
              <Input
                type="number"
                value={boothDetails.height}
                onChange={(e) =>
                  setBoothDetails({
                    ...boothDetails,
                    height: parseFloat(e.target.value),
                  })
                }
              />
            </FormControl>
          </Flex>

          <Flex mb={4}>
            <FormControl mr={2}>
              <FormLabel>X-Axis</FormLabel>
              <Input
                type="number"
                value={boothDetails.x}
                onChange={(e) =>
                  setBoothDetails({
                    ...boothDetails,
                    x: parseFloat(e.target.value),
                  })
                }
              />
            </FormControl>
            <FormControl ml={2}>
              <FormLabel>Y-Axis</FormLabel>
              <Input
                type="number"
                value={boothDetails.y}
                onChange={(e) =>
                  setBoothDetails({
                    ...boothDetails,
                    y: parseFloat(e.target.value),
                  })
                }
              />
            </FormControl>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BoothDetails;
