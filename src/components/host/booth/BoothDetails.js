// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   ModalFooter,
//   Button,
//   FormControl,
//   FormLabel,
//   Input,
//   Select,
//   Flex,
// } from "@chakra-ui/react";
// import { v4 as uuidv4 } from "uuid";

// const BoothDetails = ({
//   booth,
//   isOpen,
//   onClose,
//   onSave,
//   locationTypes = [],
// }) => {
//   const [boothDetails, setBoothDetails] = useState({
//     locationId: uuidv4(),
//     name: "",
//     typeId: "", // Khởi tạo typeId rỗng
//     width: 100,
//     height: 100,
//     x: 100,
//     y: 100,
//     color: "", // Thêm trường color để lưu màu sắc
//   });

//   // Cập nhật boothDetails khi locationTypes hoặc booth thay đổi
//   useEffect(() => {
//     if (isOpen && locationTypes.length > 0) {
//       const defaultTypeId = booth?.typeId || locationTypes[0].typeId;
//       const defaultName =
//         booth?.name ||
//         locationTypes.find((type) => type.typeId === defaultTypeId)?.typeName ||
//         "";
//       const defaultColor =
//         booth?.color ||
//         locationTypes.find((type) => type.typeId === defaultTypeId)?.color ||
//         ""; // Lấy màu sắc từ locationTypes

//       setBoothDetails({
//         locationId: uuidv4(),
//         name: defaultName,
//         typeId: defaultTypeId,
//         color: defaultColor, // Lưu màu sắc vào boothDetails
//         width: booth?.width || 100,
//         height: booth?.height || 100,
//         x: booth?.x || 100,
//         y: booth?.y || 100,
//       });
//     }
//   }, [booth, locationTypes, isOpen]);

//   const handleTypeChange = (e) => {
//     const selectedTypeId = e.target.value;
//     const selectedType = locationTypes.find(
//       (type) => type.typeId === selectedTypeId
//     );

//     setBoothDetails({
//       ...boothDetails,
//       typeId: selectedTypeId,
//       name: selectedType?.typeName || "", // Cập nhật name khi thay đổi typeId
//       color: selectedType?.color || "", // Cập nhật color khi thay đổi typeId
//     });
//   };

//   const handleSave = () => {
//     onSave(boothDetails);
//     onClose();
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} size="lg">
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader>Booth Details</ModalHeader>
//         <ModalCloseButton />
//         <ModalBody>
//           <FormControl mb={4}>
//             <FormLabel>Booth Type</FormLabel>
//             <Select value={boothDetails.typeId} onChange={handleTypeChange}>
//               {locationTypes.map((type) => (
//                 <option key={type.typeId} value={type.typeId}>
//                   {type.typeName} (
//                   {type.price?.toLocaleString("vi-VN", {
//                     style: "currency",
//                     currency: "VND",
//                   })}
//                   )
//                 </option>
//               ))}
//             </Select>
//           </FormControl>
//           <Flex mb={4}>
//             <FormControl mr={2}>
//               <FormLabel>Width (px)</FormLabel>
//               <Input
//                 type="number"
//                 value={boothDetails.width}
//                 onChange={(e) =>
//                   setBoothDetails({
//                     ...boothDetails,
//                     width: parseFloat(e.target.value),
//                   })
//                 }
//               />
//             </FormControl>
//             <FormControl ml={2}>
//               <FormLabel>Height (px)</FormLabel>
//               <Input
//                 type="number"
//                 value={boothDetails.height}
//                 onChange={(e) =>
//                   setBoothDetails({
//                     ...boothDetails,
//                     height: parseFloat(e.target.value),
//                   })
//                 }
//               />
//             </FormControl>
//           </Flex>
//           <Flex mb={4}>
//             <FormControl mr={2}>
//               <FormLabel>X-Axis</FormLabel>
//               <Input
//                 type="number"
//                 value={boothDetails.x}
//                 onChange={(e) =>
//                   setBoothDetails({
//                     ...boothDetails,
//                     x: parseFloat(e.target.value),
//                   })
//                 }
//               />
//             </FormControl>
//             <FormControl ml={2}>
//               <FormLabel>Y-Axis</FormLabel>
//               <Input
//                 type="number"
//                 value={boothDetails.y}
//                 onChange={(e) =>
//                   setBoothDetails({
//                     ...boothDetails,
//                     y: parseFloat(e.target.value),
//                   })
//                 }
//               />
//             </FormControl>
//           </Flex>
//         </ModalBody>

//         <ModalFooter>
//           <Button colorScheme="blue" mr={3} onClick={handleSave}>
//             Save
//           </Button>
//           <Button variant="ghost" onClick={onClose}>
//             Cancel
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default BoothDetails;

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
  Text,
} from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";

const BoothDetails = ({ isOpen, onClose, onSave, locationTypes = [] }) => {
  const [boothDetails, setBoothDetails] = useState({
    locationId: uuidv4(),
    name: "",
    typeId: "",
    width: 100,
    height: 100,
    x: 100,
    y: 100,
    color: "",
  });

  const [quantity, setQuantity] = useState(1); // Add quantity state

  useEffect(() => {
    if (isOpen && locationTypes.length > 0) {
      const defaultTypeId = locationTypes[0].typeId;
      const defaultName =
        locationTypes.find((type) => type.typeId === defaultTypeId)?.typeName ||
        "";
      const defaultColor =
        locationTypes.find((type) => type.typeId === defaultTypeId)?.color ||
        "";

      setBoothDetails((prevDetails) => ({
        ...prevDetails,
        typeId: defaultTypeId,
        name: defaultName,
        color: defaultColor,
      }));
    }
  }, [isOpen, locationTypes]);

  const handleTypeChange = (e) => {
    const selectedTypeId = e.target.value;
    const selectedType = locationTypes.find(
      (type) => type.typeId === selectedTypeId
    );

    setBoothDetails({
      ...boothDetails,
      typeId: selectedTypeId,
      name: selectedType?.typeName || "",
      color: selectedType?.color || "",
    });
  };

  const handleSave = () => {
    const newBooths = Array.from({ length: quantity }, (_, index) => ({
      ...boothDetails,
      locationId: uuidv4(),
      x: boothDetails.x + index * (boothDetails.width + 10), // Offset each booth
      y: boothDetails.y,
    }));
    onSave(newBooths);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Booths</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Hãy nhập số lượng booth mà bạn muốn</FormLabel>
            <Input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value)))
              }
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Booth Type</FormLabel>
            <Select value={boothDetails.typeId} onChange={handleTypeChange}>
              {locationTypes.map((type) => (
                <option key={type.typeId} value={type.typeId}>
                  {type.typeName}
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
