// import React, { useState } from "react";
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   ModalFooter,
//   Button,
//   Select,
// } from "@chakra-ui/react";
// import BoothDetails from "./BoothDetails"; // Import modal cho BoothDetails
// import { v4 as uuidv4 } from "uuid";

// const Add5BoothsModal = ({ isOpen, onClose, locationTypes, onSave }) => {
//   const [boothsDetails, setBoothsDetails] = useState(
//     Array.from({ length: 5 }).map(() => ({
//       locationId: uuidv4(),
//       typeId: locationTypes[0]?.typeId || "",
//       x: Math.random() * 500, // Random position for X
//       y: Math.random() * 500, // Random position for Y
//       width: 100,
//       height: 100,
//       color: locationTypes[0]?.color || "",
//     }))
//   );

//   const handleBoothDetailChange = (index, newDetails) => {
//     const updatedBooths = [...boothsDetails];
//     updatedBooths[index] = newDetails;
//     setBoothsDetails(updatedBooths);
//   };

//   const handleSaveAllBooths = () => {
//     onSave(boothsDetails);
//     onClose();
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} size="lg">
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader>Add 5 Booths</ModalHeader>
//         <ModalCloseButton />
//         <ModalBody>
//           {boothsDetails.map((booth, index) => (
//             <BoothDetails
//               key={booth.locationId}
//               booth={booth}
//               isOpen={true} // Automatically open modal for each booth
//               onClose={() => {}}
//               onSave={(newDetails) =>
//                 handleBoothDetailChange(index, newDetails)
//               }
//               locationTypes={locationTypes}
//             />
//           ))}
//         </ModalBody>

//         <ModalFooter>
//           <Button colorScheme="blue" mr={3} onClick={handleSaveAllBooths}>
//             Save All Booths
//           </Button>
//           <Button variant="ghost" onClick={onClose}>
//             Cancel
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default Add5BoothsModal;

// import React, { useState } from "react";
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
//   Select,
// } from "@chakra-ui/react";
// import { v4 as uuidv4 } from "uuid";

// // const Add5BoothsModal = ({ isOpen, onClose, onSave, locationTypes }) => {
// //   const [boothType, setBoothType] = useState(locationTypes[0]?.typeId || "");

// //   const handleTypeChange = (e) => {
// //     setBoothType(e.target.value);
// //   };

// //   const handleAdd5Booths = () => {
// //     const newBooths = [];

// //     for (let i = 0; i < 5; i++) {
// //       const newBooth = {
// //         locationId: uuidv4(), // Tạo ID duy nhất cho booth
// //         typeId: boothType, // Booth type
// //         name:
// //           locationTypes.find((type) => type.typeId === boothType)?.typeName ||
// //           "",
// //         color:
// //           locationTypes.find((type) => type.typeId === boothType)?.color || "",
// //         width: 100, // Kích thước mặc định
// //         height: 100, // Kích thước mặc định
// //         x: Math.random() * 500, // Vị trí x ngẫu nhiên
// //         y: Math.random() * 500, // Vị trí y ngẫu nhiên
// //       };

// //       newBooths.push(newBooth);
// //     }

// //     // Kiểm tra và thêm các booth vào state
// //     onSave(newBooths); // Gọi hàm lưu booth mới
// //     onClose(); // Đóng modal
// //   };
// const Add5BoothsModal = ({ isOpen, onClose, onSave, locationTypes }) => {
//   const [boothType, setBoothType] = useState(locationTypes[0]?.typeId || "");

//   const handleTypeChange = (e) => {
//     setBoothType(e.target.value);
//   };

//   const handleAdd5Booths = () => {
//     // Lấy defaultTypeId giống như trong handleAddBooth
//     const defaultTypeId =
//       locationTypes.length > 0 ? locationTypes[0].typeId : null;

//     if (!defaultTypeId) {
//       console.error("No available booth types in locationTypes.");
//       return; // Nếu không có loại booth, không thêm booth mới
//     }

//     const newBooths = [];

//     for (let i = 0; i < 5; i++) {
//       const newBooth = {
//         location: uuidv4(), // Tạo ID duy nhất cho booth
//         typeId: boothType || defaultTypeId, // Nếu không có boothType, dùng defaultTypeId
//         name:
//           locationTypes.find(
//             (type) => type.typeId === (boothType || defaultTypeId)
//           )?.typeName || "",
//         color:
//           locationTypes.find(
//             (type) => type.typeId === (boothType || defaultTypeId)
//           )?.color || "",
//         width: 100, // Kích thước mặc định
//         height: 100, // Kích thước mặc định
//         x: Math.random() * 500, // Vị trí x ngẫu nhiên
//         y: Math.random() * 500, // Vị trí y ngẫu nhiên
//       };

//       newBooths.push(newBooth);
//     }

//     // Kiểm tra và thêm các booth vào state
//     onSave(newBooths); // Gọi hàm lưu booth mới
//     onClose(); // Đóng modal
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} size="lg">
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader>Add 5 Booths</ModalHeader>
//         <ModalCloseButton />
//         <ModalBody>
//           <FormControl mb={4}>
//             <FormLabel>Booth Type</FormLabel>
//             <Select value={boothType} onChange={handleTypeChange}>
//               {locationTypes.map((type) => (
//                 <option key={type.typeId} value={type.typeId}>
//                   {type.typeName}
//                 </option>
//               ))}
//             </Select>
//           </FormControl>
//         </ModalBody>
//         <ModalFooter>
//           <Button colorScheme="blue" mr={3} onClick={handleAdd5Booths}>
//             Add 5 Booths
//           </Button>
//           <Button variant="ghost" onClick={onClose}>
//             Cancel
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default Add5BoothsModal;

import React, { useState } from "react";
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
  Select,
} from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";

const Add5BoothsModal = ({
  isOpen,
  onClose,
  onSave,
  locationTypes,
  selectedElement,
  onDelete, // Nhận handleDelete từ BoothPlan
  booths, // Danh sách booth hiện tại
  setBooths, // Cập nhật lại state booths
}) => {
  const [boothType, setBoothType] = useState(locationTypes[0]?.typeId || "");

  const handleTypeChange = (e) => {
    setBoothType(e.target.value);
  };

  const handleAdd5Booths = () => {
    const defaultTypeId =
      locationTypes.length > 0 ? locationTypes[0].typeId : null;

    if (!defaultTypeId) {
      console.error("No available booth types in locationTypes.");
      return;
    }

    const newBooths = [];

    for (let i = 0; i < 5; i++) {
      const newBooth = {
        location: uuidv4(),
        typeId: boothType || defaultTypeId,
        name:
          locationTypes.find(
            (type) => type.typeId === (boothType || defaultTypeId)
          )?.typeName || "",
        color:
          locationTypes.find(
            (type) => type.typeId === (boothType || defaultTypeId)
          )?.color || "",
        width: 100,
        height: 100,
        x: Math.random() * 500,
        y: Math.random() * 500,
      };

      newBooths.push(newBooth);
    }

    onSave(newBooths);
    onClose();
  };

  const handleDelete = async () => {
    if (selectedElement) {
      const { location } = selectedElement;
      // Xóa booth từ danh sách booths
      setBooths((prevBooths) =>
        prevBooths.filter((booth) => booth.location !== location)
      );

      // Gọi onDelete từ cha (BoothPlan) nếu cần
      onDelete(location);

      onClose(); // Đóng modal sau khi xóa
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add 5 Booths</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Booth Type</FormLabel>
              <Select value={boothType} onChange={handleTypeChange}>
                {locationTypes.map((type) => (
                  <option key={type.typeId} value={type.typeId}>
                    {type.typeName}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAdd5Booths}>
              Add 5 Booths
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Add5BoothsModal;
