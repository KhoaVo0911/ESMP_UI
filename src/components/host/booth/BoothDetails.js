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
import { v4 as uuidv4 } from "uuid";

const BoothDetails = ({
  booth,
  isOpen,
  onClose,
  onSave,
  locationTypes = [],
}) => {
  const [boothDetails, setBoothDetails] = useState({
    locationId: uuidv4(),
    name: booth?.name || "",
    typeId:
      booth?.typeId ||
      (locationTypes.length > 0 ? locationTypes[0].typeId : ""),
    width: booth?.width || 100,
    height: booth?.height || 100,
    x: booth?.x || 100,
    y: booth?.y || 100,
  });

  useEffect(() => {
    setBoothDetails({
      name: booth?.name || "",
      typeId:
        booth?.typeId ||
        (locationTypes.length > 0 ? locationTypes[0].typeId : ""),
      width: booth?.width || 100,
      height: booth?.height || 100,
      x: booth?.x || 100,
      y: booth?.y || 100,
    });
  }, [booth, locationTypes, isOpen]);

  const handleTypeChange = (e) => {
    const selectedTypeId = e.target.value;
    const isValidTypeId = locationTypes.some(
      (type) => type.typeId === selectedTypeId
    );

    setBoothDetails({
      ...boothDetails,
      typeId: isValidTypeId
        ? selectedTypeId
        : locationTypes[0]?.typeId || "defaultTypeId",
    });
  };

  const handleSave = () => {
    // if (!boothDetails.locationId) {
    //   console.error("BoothDetails missing locationId:", boothDetails);
    //   return;
    // }
    console.log(boothDetails, "1111");
    onSave(boothDetails);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Booth Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Booth Name</FormLabel>
            <Input
              value={boothDetails.name}
              onChange={(e) =>
                setBoothDetails({ ...boothDetails, name: e.target.value })
              }
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Booth Type</FormLabel>
            <Select
              value={boothDetails.typeId}
              onChange={handleTypeChange}
              // placeholder="Select Booth Type"
            >
              {locationTypes?.map((type) => (
                <option key={type.typeId} value={type.typeId}>
                  {type.typeName} (
                  {type.price?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                  )
                </option>
              ))}
            </Select>
          </FormControl>
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
