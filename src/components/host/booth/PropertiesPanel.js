// import React from "react";
// import {
//   Box,
//   FormControl,
//   FormLabel,
//   Input,
//   Text,
//   Grid,
// } from "@chakra-ui/react";

// const PropertiesPanel = ({
//   selectedShape,
//   onShapeUpdate,
//   selectedBooth,
//   onBoothUpdate,
//   selectedImage,
//   onImageUpdate,
//   selectedText,
//   onTextUpdate,
//   mainTemplate,
//   onMainTemplateUpdate,
// }) => {
//   const handleChange = (field, value, updateFn, element) => {
//     const updatedElement = { ...element, [field]: value };
//     updateFn(updatedElement);
//   };

//   const renderMainTemplateProperties = () => (
//     <>
//       <Text fontWeight="bold">Main Template Properties</Text>
//       <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
//         <FormControl>
//           <FormLabel>Width (px)</FormLabel>
//           <Input
//             type="number"
//             value={mainTemplate.width}
//             onChange={(e) =>
//               handleChange(
//                 "width",
//                 parseFloat(e.target.value),
//                 onMainTemplateUpdate,
//                 mainTemplate
//               )
//             }
//           />
//         </FormControl>
//         <FormControl>
//           <FormLabel>Height (px)</FormLabel>
//           <Input
//             type="number"
//             value={mainTemplate.height}
//             onChange={(e) =>
//               handleChange(
//                 "height",
//                 parseFloat(e.target.value),
//                 onMainTemplateUpdate,
//                 mainTemplate
//               )
//             }
//           />
//         </FormControl>
//       </Grid>
//       <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
//         <FormControl>
//           <FormLabel>X-Axis</FormLabel>
//           <Input
//             type="number"
//             value={mainTemplate.x}
//             onChange={(e) =>
//               handleChange(
//                 "x",
//                 parseFloat(e.target.value),
//                 onMainTemplateUpdate,
//                 mainTemplate
//               )
//             }
//           />
//         </FormControl>
//         <FormControl>
//           <FormLabel>Y-Axis</FormLabel>
//           <Input
//             type="number"
//             value={mainTemplate.y}
//             onChange={(e) =>
//               handleChange(
//                 "y",
//                 parseFloat(e.target.value),
//                 onMainTemplateUpdate,
//                 mainTemplate
//               )
//             }
//           />
//         </FormControl>
//       </Grid>
//       <FormControl mb={2}>
//         <FormLabel>Rotation (°)</FormLabel>
//         <Input
//           type="number"
//           value={mainTemplate.rotation || 0}
//           onChange={(e) =>
//             handleChange(
//               "rotation",
//               parseFloat(e.target.value),
//               onMainTemplateUpdate,
//               mainTemplate
//             )
//           }
//         />
//       </FormControl>
//     </>
//   );

//   const renderImageProperties = () => (
//     <>
//       <Text fontWeight="bold">Image Properties</Text>
//       <FormControl mb={2}>
//         <FormLabel>Image Name</FormLabel>
//         <Input
//           value={selectedImage.name || `Image ${selectedImage.id}`}
//           onChange={(e) =>
//             handleChange("name", e.target.value, onImageUpdate, selectedImage)
//           }
//         />
//       </FormControl>
//       <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
//         <FormControl>
//           <FormLabel>Width (px)</FormLabel>
//           <Input
//             type="number"
//             value={selectedImage.width}
//             onChange={(e) =>
//               handleChange(
//                 "width",
//                 parseFloat(e.target.value),
//                 onImageUpdate,
//                 selectedImage
//               )
//             }
//           />
//         </FormControl>
//         <FormControl>
//           <FormLabel>Height (px)</FormLabel>
//           <Input
//             type="number"
//             value={selectedImage.height}
//             onChange={(e) =>
//               handleChange(
//                 "height",
//                 parseFloat(e.target.value),
//                 onImageUpdate,
//                 selectedImage
//               )
//             }
//           />
//         </FormControl>
//       </Grid>
//       <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
//         <FormControl>
//           <FormLabel>X-Axis</FormLabel>
//           <Input
//             type="number"
//             value={selectedImage.x}
//             onChange={(e) =>
//               handleChange(
//                 "x",
//                 parseFloat(e.target.value),
//                 onImageUpdate,
//                 selectedImage
//               )
//             }
//           />
//         </FormControl>
//         <FormControl>
//           <FormLabel>Y-Axis</FormLabel>
//           <Input
//             type="number"
//             value={selectedImage.y}
//             onChange={(e) =>
//               handleChange(
//                 "y",
//                 parseFloat(e.target.value),
//                 onImageUpdate,
//                 selectedImage
//               )
//             }
//           />
//         </FormControl>
//       </Grid>
//       <FormControl mb={2}>
//         <FormLabel>Rotation (°)</FormLabel>
//         <Input
//           type="number"
//           value={selectedImage.rotation || 0}
//           onChange={(e) =>
//             handleChange(
//               "rotation",
//               parseFloat(e.target.value),
//               onImageUpdate,
//               selectedImage
//             )
//           }
//         />
//       </FormControl>
//     </>
//   );

//   const renderShapeProperties = () => (
//     <>
//       <Text fontWeight="bold">Shape Properties</Text>
//       <FormControl mb={2}>
//         <FormLabel>Shape Name</FormLabel>
//         <Input
//           value={selectedShape.name || `Shape ${selectedShape.locationId}`}
//           onChange={(e) =>
//             handleChange("name", e.target.value, onShapeUpdate, selectedShape)
//           }
//         />
//       </FormControl>
//       <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
//         <FormControl>
//           <FormLabel>Width (px)</FormLabel>
//           <Input
//             type="number"
//             value={selectedShape.width}
//             onChange={(e) =>
//               handleChange(
//                 "width",
//                 parseFloat(e.target.value),
//                 onShapeUpdate,
//                 selectedShape
//               )
//             }
//           />
//         </FormControl>
//         <FormControl>
//           <FormLabel>Height (px)</FormLabel>
//           <Input
//             type="number"
//             value={selectedShape.height}
//             onChange={(e) =>
//               handleChange(
//                 "height",
//                 parseFloat(e.target.value),
//                 onShapeUpdate,
//                 selectedShape
//               )
//             }
//           />
//         </FormControl>
//       </Grid>
//       <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
//         <FormControl>
//           <FormLabel>X-Axis</FormLabel>
//           <Input
//             type="number"
//             value={selectedShape.x}
//             onChange={(e) =>
//               handleChange(
//                 "x",
//                 parseFloat(e.target.value),
//                 onShapeUpdate,
//                 selectedShape
//               )
//             }
//           />
//         </FormControl>
//         <FormControl>
//           <FormLabel>Y-Axis</FormLabel>
//           <Input
//             type="number"
//             value={selectedShape.y}
//             onChange={(e) =>
//               handleChange(
//                 "y",
//                 parseFloat(e.target.value),
//                 onShapeUpdate,
//                 selectedShape
//               )
//             }
//           />
//         </FormControl>
//       </Grid>
//       <FormControl mb={2}>
//         <FormLabel>Rotation (°)</FormLabel>
//         <Input
//           type="number"
//           value={selectedShape.rotation || 0}
//           onChange={(e) =>
//             handleChange(
//               "rotation",
//               parseFloat(e.target.value),
//               onShapeUpdate,
//               selectedShape
//             )
//           }
//         />
//       </FormControl>
//     </>
//   );

//   const renderBoothProperties = () => (
//     <>
//       <Text fontWeight="bold">Booth Properties</Text>
//       <FormControl mb={2}>
//         <FormLabel>Booth Name</FormLabel>
//         <Input
//           value={selectedBooth.name || `Booth ${selectedBooth.locationId}`}
//           onChange={(e) =>
//             handleChange("name", e.target.value, onBoothUpdate, selectedBooth)
//           }
//         />
//       </FormControl>
//       <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
//         <FormControl>
//           <FormLabel>Width (px)</FormLabel>
//           <Input
//             type="number"
//             value={selectedBooth.width}
//             onChange={(e) =>
//               handleChange(
//                 "width",
//                 parseFloat(e.target.value),
//                 onBoothUpdate,
//                 selectedBooth
//               )
//             }
//           />
//         </FormControl>
//         <FormControl>
//           <FormLabel>Height (px)</FormLabel>
//           <Input
//             type="number"
//             value={selectedBooth.height}
//             onChange={(e) =>
//               handleChange(
//                 "height",
//                 parseFloat(e.target.value),
//                 onBoothUpdate,
//                 selectedBooth
//               )
//             }
//           />
//         </FormControl>
//       </Grid>
//       <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
//         <FormControl>
//           <FormLabel>X-Axis</FormLabel>
//           <Input
//             type="number"
//             value={selectedBooth.x}
//             onChange={(e) =>
//               handleChange(
//                 "x",
//                 parseFloat(e.target.value),
//                 onBoothUpdate,
//                 selectedBooth
//               )
//             }
//           />
//         </FormControl>
//         <FormControl>
//           <FormLabel>Y-Axis</FormLabel>
//           <Input
//             type="number"
//             value={selectedBooth.y}
//             onChange={(e) =>
//               handleChange(
//                 "y",
//                 parseFloat(e.target.value),
//                 onBoothUpdate,
//                 selectedBooth
//               )
//             }
//           />
//         </FormControl>
//       </Grid>
//       <FormControl mb={2}>
//         <FormLabel>Rotation (°)</FormLabel>
//         <Input
//           type="number"
//           value={selectedBooth.rotation || 0}
//           onChange={(e) =>
//             handleChange(
//               "rotation",
//               parseFloat(e.target.value),
//               onBoothUpdate,
//               selectedBooth
//             )
//           }
//         />
//       </FormControl>
//     </>
//   );

//   const renderTextProperties = () => (
//     <>
//       <Text fontWeight="bold">Text Properties</Text>
//       <FormControl mb={2}>
//         <FormLabel>Text Content</FormLabel>
//         <Input
//           value={selectedText.name || ""}
//           onChange={(e) =>
//             handleChange("content", e.target.value, onTextUpdate, selectedText)
//           }
//         />
//       </FormControl>
//       <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
//         <FormControl>
//           <FormLabel>Width (px)</FormLabel>
//           <Input
//             type="number"
//             value={selectedText.width}
//             onChange={(e) =>
//               handleChange(
//                 "width",
//                 parseFloat(e.target.value),
//                 onTextUpdate,
//                 selectedText
//               )
//             }
//           />
//         </FormControl>
//         <FormControl>
//           <FormLabel>Height (px)</FormLabel>
//           <Input
//             type="number"
//             value={selectedText.height}
//             onChange={(e) =>
//               handleChange(
//                 "height",
//                 parseFloat(e.target.value),
//                 onTextUpdate,
//                 selectedText
//               )
//             }
//           />
//         </FormControl>
//         <FormControl>
//           <FormLabel>Font Size</FormLabel>
//           <Input
//             type="number"
//             value={selectedText.fontSize || 16}
//             onChange={(e) =>
//               handleChange(
//                 "fontSize",
//                 parseFloat(e.target.value),
//                 onTextUpdate,
//                 selectedText
//               )
//             }
//           />
//         </FormControl>
//         <FormControl>
//           <FormLabel>Rotation (°)</FormLabel>
//           <Input
//             type="number"
//             value={selectedText.rotation || 0}
//             onChange={(e) =>
//               handleChange(
//                 "rotation",
//                 parseFloat(e.target.value),
//                 onTextUpdate,
//                 selectedText
//               )
//             }
//           />
//         </FormControl>
//       </Grid>
//       <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
//         <FormControl>
//           <FormLabel>X-Axis</FormLabel>
//           <Input
//             type="number"
//             value={selectedText.x || 0}
//             onChange={(e) =>
//               handleChange(
//                 "x",
//                 parseFloat(e.target.value),
//                 onTextUpdate,
//                 selectedText
//               )
//             }
//           />
//         </FormControl>
//         <FormControl>
//           <FormLabel>Y-Axis</FormLabel>
//           <Input
//             type="number"
//             value={selectedText.y || 0}
//             onChange={(e) =>
//               handleChange(
//                 "y",
//                 parseFloat(e.target.value),
//                 onTextUpdate,
//                 selectedText
//               )
//             }
//           />
//         </FormControl>
//       </Grid>
//     </>
//   );

//   return (
//     <Box
//       p={4}
//       bg="white"
//       borderLeft="1px solid"
//       borderColor="gray.200"
//       width="300px"
//       height="100vh"
//       overflowY="auto"
//     >
//       {mainTemplate && renderMainTemplateProperties()}
//       {selectedImage && renderImageProperties()}
//       {selectedShape && renderShapeProperties()}
//       {selectedBooth && renderBoothProperties()}
//       {selectedText && renderTextProperties()}
//     </Box>
//   );
// };

// export default PropertiesPanel;

import React from "react";
import { Box, FormControl, FormLabel, Grid, Text } from "@chakra-ui/react";

const PropertiesPanel = ({
  selectedShape,
  selectedBooth,
  selectedImage,
  selectedText,
  mainTemplate,
}) => {
  const renderMainTemplateProperties = () => (
    <>
      <Text fontWeight="bold" mb={2}>
        Main Template Properties
      </Text>
      <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
        <FormControl>
          <FormLabel>Width (px)</FormLabel>
          <Box
            p={2}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
          >
            {mainTemplate.width}
          </Box>
        </FormControl>
        <FormControl>
          <FormLabel>Height (px)</FormLabel>
          <Box
            p={2}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
          >
            {mainTemplate.height}
          </Box>
        </FormControl>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
        <FormControl>
          <FormLabel>X-Axis</FormLabel>
          <Box
            p={2}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
          >
            {mainTemplate.x}
          </Box>
        </FormControl>
        <FormControl>
          <FormLabel>Y-Axis</FormLabel>
          <Box
            p={2}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
          >
            {mainTemplate.y}
          </Box>
        </FormControl>
      </Grid>
      {/* <FormControl mb={2}>
        <FormLabel>Rotation (°)</FormLabel>
        <Box p={2} border="1px solid" borderColor="gray.300" borderRadius="md">
          {mainTemplate.rotation || 0}
        </Box>
      </FormControl> */}
    </>
  );

  const renderImageProperties = () => (
    <>
      <Text fontWeight="bold" mb={2}>
        Image Properties
      </Text>
      <FormControl mb={2}>
        <FormLabel>Image Name</FormLabel>
        <Box p={2} border="1px solid" borderColor="gray.300" borderRadius="md">
          {selectedImage.name || `Image ${selectedImage.id}`}
        </Box>
      </FormControl>
      <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
        <FormControl>
          <FormLabel>Width (px)</FormLabel>
          <Box
            p={2}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
          >
            {selectedImage.width}
          </Box>
        </FormControl>
        <FormControl>
          <FormLabel>Height (px)</FormLabel>
          <Box
            p={2}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
          >
            {selectedImage.height}
          </Box>
        </FormControl>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
        <FormControl>
          <FormLabel>X-Axis</FormLabel>
          <Box
            p={2}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
          >
            {selectedImage.x}
          </Box>
        </FormControl>
        <FormControl>
          <FormLabel>Y-Axis</FormLabel>
          <Box
            p={2}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
          >
            {selectedImage.y}
          </Box>
        </FormControl>
      </Grid>
      {/* <FormControl mb={2}>
        <FormLabel>Rotation (°)</FormLabel>
        <Box p={2} border="1px solid" borderColor="gray.300" borderRadius="md">
          {selectedImage.rotation || 0}
        </Box>
      </FormControl> */}
    </>
  );

  const renderShapeProperties = () => (
    <>
      <Text fontWeight="bold" mb={2}>
        Shape Properties
      </Text>
      <FormControl mb={2}>
        <FormLabel>Shape Name</FormLabel>
        <Box p={2} border="1px solid" borderColor="gray.300" borderRadius="md">
          {selectedShape.name || `Shape ${selectedShape.locationId}`}
        </Box>
      </FormControl>
      <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
        <FormControl>
          <FormLabel>Width (px)</FormLabel>
          <Box
            p={2}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
          >
            {selectedShape.width}
          </Box>
        </FormControl>
        <FormControl>
          <FormLabel>Height (px)</FormLabel>
          <Box
            p={2}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
          >
            {selectedShape.height}
          </Box>
        </FormControl>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
        <FormControl>
          <FormLabel>X-Axis</FormLabel>
          <Box
            p={2}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
          >
            {selectedShape.x}
          </Box>
        </FormControl>
        <FormControl>
          <FormLabel>Y-Axis</FormLabel>
          <Box
            p={2}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
          >
            {selectedShape.y}
          </Box>
        </FormControl>
      </Grid>
      {/* <FormControl mb={2}>
        <FormLabel>Rotation (°)</FormLabel>
        <Box p={2} border="1px solid" borderColor="gray.300" borderRadius="md">
          {selectedShape.rotation || 0}
        </Box>
      </FormControl> */}
    </>
  );

  const renderBoothProperties = () => (
    <>
      <Text fontWeight="bold" mb={2}>
        Booth Properties
      </Text>
      <FormControl mb={2}>
        <FormLabel>Booth Name</FormLabel>
        <Box p={2} border="1px solid" borderColor="gray.300" borderRadius="md">
          {selectedBooth.name || `Booth ${selectedBooth.locationId}`}
        </Box>
      </FormControl>
      <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
        <FormControl>
          <FormLabel>Width (px)</FormLabel>
          <Box
            p={2}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
          >
            {selectedBooth.width}
          </Box>
        </FormControl>
        <FormControl>
          <FormLabel>Height (px)</FormLabel>
          <Box
            p={2}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
          >
            {selectedBooth.height}
          </Box>
        </FormControl>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
        <FormControl>
          <FormLabel>X-Axis</FormLabel>
          <Box
            p={2}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
          >
            {selectedBooth.x}
          </Box>
        </FormControl>
        <FormControl>
          <FormLabel>Y-Axis</FormLabel>
          <Box
            p={2}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
          >
            {selectedBooth.y}
          </Box>
        </FormControl>
      </Grid>
      {/* <FormControl mb={2}>
        <FormLabel>Rotation (°)</FormLabel>
        <Box p={2} border="1px solid" borderColor="gray.300" borderRadius="md">
          {selectedBooth.rotation || 0}
        </Box>
      </FormControl> */}
    </>
  );

  const renderTextProperties = () => (
    <>
      <Text fontWeight="bold" mb={2}>
        Text Properties
      </Text>
      <FormControl mb={2}>
        <FormLabel>Text Content</FormLabel>
        <Box p={2} border="1px solid" borderColor="gray.300" borderRadius="md">
          {selectedText.name || ""}
        </Box>
      </FormControl>
      <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
        <FormControl>
          <FormLabel>Width (px)</FormLabel>
          <Box
            p={2}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
          >
            {selectedText.width}
          </Box>
        </FormControl>
        <FormControl>
          <FormLabel>Height (px)</FormLabel>
          <Box
            p={2}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
          >
            {selectedText.height}
          </Box>
        </FormControl>
        {/* <FormControl>
          <FormLabel>Font Size</FormLabel>
          <Box
            p={2}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
          >
            {selectedText.fontSize || 16}
          </Box>
        </FormControl> */}
        {/* <FormControl>
          <FormLabel>Rotation (°)</FormLabel>
          <Box
            p={2}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
          >
            {selectedText.rotation || 0}
          </Box>
        </FormControl> */}
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
        <FormControl>
          <FormLabel>X-Axis</FormLabel>
          <Box
            p={2}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
          >
            {selectedText.x || 0}
          </Box>
        </FormControl>
        <FormControl>
          <FormLabel>Y-Axis</FormLabel>
          <Box
            p={2}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
          >
            {selectedText.y || 0}
          </Box>
        </FormControl>
      </Grid>
    </>
  );

  return (
    <Box
      p={4}
      bg="white"
      borderLeft="1px solid"
      borderColor="gray.200"
      width="300px"
      height="100vh"
      overflowY="auto"
    >
      {mainTemplate && renderMainTemplateProperties()}
      {selectedImage && renderImageProperties()}
      {selectedShape && renderShapeProperties()}
      {selectedBooth && renderBoothProperties()}
      {selectedText && renderTextProperties()}
    </Box>
  );
};

export default PropertiesPanel;
