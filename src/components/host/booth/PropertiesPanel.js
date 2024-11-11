import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Text,
  Grid,
} from "@chakra-ui/react";

const PropertiesPanel = ({
  selectedShape,
  onShapeUpdate,
  selectedBooth,
  onBoothUpdate,
  selectedImage,
  onImageUpdate,
  selectedText,
  onTextUpdate,
  mainTemplate,
  onMainTemplateUpdate,
}) => {
  const handleChange = (field, value, updateFn, element) => {
    const updatedElement = { ...element, [field]: value };
    updateFn(updatedElement);
  };

  const renderImageProperties = () => (
    <>
      <Text fontWeight="bold">Image Properties</Text>
      <FormControl mb={2}>
        <FormLabel>Image Name</FormLabel>
        <Input
          value={selectedImage.name || `Image ${selectedImage.id}`}
          onChange={(e) =>
            handleChange("name", e.target.value, onImageUpdate, selectedImage)
          }
        />
      </FormControl>
      <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
        <FormControl>
          <FormLabel>Width (px)</FormLabel>
          <Input
            type="number"
            value={selectedImage.width}
            onChange={(e) =>
              handleChange(
                "width",
                parseFloat(e.target.value),
                onImageUpdate,
                selectedImage
              )
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Height (px)</FormLabel>
          <Input
            type="number"
            value={selectedImage.height}
            onChange={(e) =>
              handleChange(
                "height",
                parseFloat(e.target.value),
                onImageUpdate,
                selectedImage
              )
            }
          />
        </FormControl>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
        <FormControl>
          <FormLabel>X-Axis</FormLabel>
          <Input
            type="number"
            value={selectedImage.x}
            onChange={(e) =>
              handleChange(
                "x",
                parseFloat(e.target.value),
                onImageUpdate,
                selectedImage
              )
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Y-Axis</FormLabel>
          <Input
            type="number"
            value={selectedImage.y}
            onChange={(e) =>
              handleChange(
                "y",
                parseFloat(e.target.value),
                onImageUpdate,
                selectedImage
              )
            }
          />
        </FormControl>
      </Grid>
      <FormControl mb={2}>
        <FormLabel>Rotation (°)</FormLabel>
        <Input
          type="number"
          value={selectedBooth?.rotation || 0}
          onChange={(e) =>
            handleChange(
              "rotation",
              parseFloat(e.target.value),
              onBoothUpdate,
              selectedBooth
            )
          }
        />
      </FormControl>
    </>
  );

  const renderShapeProperties = () => (
    <>
      <Text fontWeight="bold">Shape Properties</Text>
      <FormControl mb={2}>
        <FormLabel>Shape Name</FormLabel>
        <Input
          value={selectedShape.name || `Shape ${selectedShape.id}`}
          onChange={(e) =>
            handleChange("name", e.target.value, onShapeUpdate, selectedShape)
          }
        />
      </FormControl>
      <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
        <FormControl>
          <FormLabel>Width (px)</FormLabel>
          <Input
            type="number"
            value={selectedShape.width}
            onChange={(e) =>
              handleChange(
                "width",
                parseFloat(e.target.value),
                onShapeUpdate,
                selectedShape
              )
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Height (px)</FormLabel>
          <Input
            type="number"
            value={selectedShape.height}
            onChange={(e) =>
              handleChange(
                "height",
                parseFloat(e.target.value),
                onShapeUpdate,
                selectedShape
              )
            }
          />
        </FormControl>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
        <FormControl>
          <FormLabel>X-Axis</FormLabel>
          <Input
            type="number"
            value={selectedShape.x}
            onChange={(e) =>
              handleChange(
                "x",
                parseFloat(e.target.value),
                onShapeUpdate,
                selectedShape
              )
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Y-Axis</FormLabel>
          <Input
            type="number"
            value={selectedShape.y}
            onChange={(e) =>
              handleChange(
                "y",
                parseFloat(e.target.value),
                onShapeUpdate,
                selectedShape
              )
            }
          />
        </FormControl>
      </Grid>
      <FormControl mb={2}>
        <FormLabel>Rotation (°)</FormLabel>
        <Input
          type="number"
          value={selectedBooth?.rotation ?? 0} // Nếu rotation chưa có giá trị, đặt mặc định là 0
          onChange={(e) =>
            handleChange(
              "rotation",
              parseFloat(e.target.value),
              onBoothUpdate,
              selectedBooth
            )
          }
        />
      </FormControl>
    </>
  );

  const renderBoothProperties = () => (
    <>
      <Text fontWeight="bold">Booth Properties</Text>
      <FormControl mb={2}>
        <FormLabel>Booth Name</FormLabel>
        <Input
          value={selectedBooth.name}
          onChange={(e) =>
            handleChange("name", e.target.value, onBoothUpdate, selectedBooth)
          }
        />
      </FormControl>
      <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
        <FormControl>
          <FormLabel>Width (px)</FormLabel>
          <Input
            type="number"
            value={selectedBooth.width}
            onChange={(e) =>
              handleChange(
                "width",
                parseFloat(e.target.value),
                onBoothUpdate,
                selectedBooth
              )
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Height (px)</FormLabel>
          <Input
            type="number"
            value={selectedBooth.height}
            onChange={(e) =>
              handleChange(
                "height",
                parseFloat(e.target.value),
                onBoothUpdate,
                selectedBooth
              )
            }
          />
        </FormControl>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
        <FormControl>
          <FormLabel>X-Axis</FormLabel>
          <Input
            type="number"
            value={selectedBooth.x}
            onChange={(e) =>
              handleChange(
                "x",
                parseFloat(e.target.value),
                onBoothUpdate,
                selectedBooth
              )
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Y-Axis</FormLabel>
          <Input
            type="number"
            value={selectedBooth.y}
            onChange={(e) =>
              handleChange(
                "y",
                parseFloat(e.target.value),
                onBoothUpdate,
                selectedBooth
              )
            }
          />
        </FormControl>
      </Grid>
      <FormControl mb={2}>
        <FormLabel>Rotation (°)</FormLabel>
        <Input
          type="number"
          value={selectedBooth.rotation || 0}
          onChange={(e) =>
            handleChange(
              "rotation",
              parseFloat(e.target.value),
              onBoothUpdate,
              selectedBooth
            )
          }
        />
      </FormControl>
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
      {selectedImage && renderImageProperties()}
      {selectedShape && renderShapeProperties()}
      {selectedBooth && renderBoothProperties()}
      {selectedText && (
        <>
          <Text fontWeight="bold">Text Properties</Text>
          <FormControl mb={2}>
            <FormLabel>Text Content</FormLabel>
            <Input
              value={selectedText.content}
              onChange={(e) =>
                handleChange(
                  "content",
                  e.target.value,
                  onTextUpdate,
                  selectedText
                )
              }
            />
          </FormControl>
          <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
            <FormControl>
              <FormLabel>Font Size</FormLabel>
              <Input
                type="number"
                value={selectedText.fontSize}
                onChange={(e) =>
                  handleChange(
                    "fontSize",
                    parseFloat(e.target.value),
                    onTextUpdate,
                    selectedText
                  )
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Rotation (°)</FormLabel>
              <Input
                type="number"
                value={selectedText.rotation || 0}
                onChange={(e) =>
                  handleChange(
                    "rotation",
                    parseFloat(e.target.value),
                    onTextUpdate,
                    selectedText
                  )
                }
              />
            </FormControl>
          </Grid>
          <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
            <FormControl>
              <FormLabel>X-Axis</FormLabel>
              <Input
                type="number"
                value={selectedText.x}
                onChange={(e) =>
                  handleChange(
                    "x",
                    parseFloat(e.target.value),
                    onTextUpdate,
                    selectedText
                  )
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Y-Axis</FormLabel>
              <Input
                type="number"
                value={selectedText.y}
                onChange={(e) =>
                  handleChange(
                    "y",
                    parseFloat(e.target.value),
                    onTextUpdate,
                    selectedText
                  )
                }
              />
            </FormControl>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default PropertiesPanel;
