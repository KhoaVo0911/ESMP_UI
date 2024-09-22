import React, { useState } from "react";
import {
  Box,
  Flex,
  Grid,
  Button,
  Text,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  GridItem, // Import GridItem
} from "@chakra-ui/react";
import { FaHandPointer, FaSquare, FaVectorSquare } from "react-icons/fa";
import { useDrop } from "react-dnd"; // For drag-and-drop handling
import Booth from "../../components/host/booth/Booth";
import Shape from "../../components/host/booth/Shape"; // Component for draggable shape

const BoothPlan = () => {
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [shapes, setShapes] = useState([]); // Store the list of created shapes
  const [modalOpen, setModalOpen] = useState(false);
  const [newBooth, setNewBooth] = useState({
    number: "",
    category: "",
    length: 10,
    breadth: 10,
  });
  const [selectedShape, setSelectedShape] = useState(null);
  const [selectedTool, setSelectedTool] = useState("select"); // Track the selected tool

  // Function to handle shape creation
  const handleShapeDrop = () => {
    if (selectedTool === "shape") {
      // Create a new shape with default dimensions
      const newShape = {
        id: shapes.length + 1, // Assign a unique ID
        booths: [],
        width: 200,
        height: 150,
        left: Math.random() * 300, // Random position for demo
        top: Math.random() * 300,
      };
      setShapes([...shapes, newShape]);
    }
  };

  // Handle Booth creation after selecting a booth area
  const handleBoothClick = (boothId, shapeId) => {
    if (selectedTool === "booth") {
      setSelectedBooth(boothId);
      setSelectedShape(shapeId); // Track which shape the booth is being placed in
      setModalOpen(true); // Open modal for booth creation
    }
  };

  const handleSaveBooth = () => {
    // Logic to save booth to the selected shape
    const updatedShapes = shapes.map((shape) => {
      if (shape.id === selectedShape) {
        shape.booths.push(newBooth); // Add booth to the shape's booth list
      }
      return shape;
    });
    setShapes(updatedShapes);
    setModalOpen(false);
    setNewBooth({ number: "", category: "", length: 10, breadth: 10 });
  };

  return (
    <Box bg="#F8FAFF" p={8} minH="100vh">
      <Flex>
        {/* Sidebar with Icons */}
        <Box
          w="80px"
          h="100vh"
          bg="gray.100"
          borderRight="1px solid"
          borderColor="gray.200"
          display="flex"
          flexDirection="column"
          alignItems="center"
          py={4}
          gap={6}
        >
          {/* Select Tool */}
          <Flex
            direction="column"
            align="center"
            onClick={() => setSelectedTool("select")}
            cursor="pointer"
            bg={selectedTool === "select" ? "blue.50" : "transparent"} // Highlight active tool
          >
            <Icon as={FaHandPointer} boxSize={6} color="blue.500" />
            <Text fontSize="sm" mt={2}>
              Select
            </Text>
          </Flex>

          {/* Booth Creation Tool */}
          <Flex
            direction="column"
            align="center"
            onClick={() => setSelectedTool("booth")}
            cursor="pointer"
            bg={selectedTool === "booth" ? "green.50" : "transparent"} // Highlight active tool
          >
            <Icon as={FaSquare} boxSize={6} color="green.500" />
            <Text fontSize="sm" mt={2}>
              Booth
            </Text>
          </Flex>

          {/* Shape Tool for Booth Area */}
          <Flex
            direction="column"
            align="center"
            onClick={() => setSelectedTool("shape")}
            cursor="pointer"
            bg={selectedTool === "shape" ? "purple.50" : "transparent"} // Highlight active tool
          >
            <Icon as={FaVectorSquare} boxSize={6} color="purple.500" />
            <Text fontSize="sm" mt={2}>
              Shape
            </Text>
          </Flex>
        </Box>

        {/* Booth Plan Grid */}
        <Box flex="1" p={4} bg="white" position="relative">
          {/* Shapes and Booths */}
          <Grid
            templateColumns="repeat(12, 1fr)"
            gap={4}
            p={4}
            bg="gray.50"
            borderRadius="md"
            boxShadow="sm"
            zIndex="1"
          >
            {shapes.map((shape) => (
              <GridItem
                colSpan={4}
                key={shape.id}
                style={{
                  position: "absolute",
                  left: shape.left,
                  top: shape.top,
                  width: shape.width,
                  height: shape.height,
                  border: "1px solid black",
                }}
                onClick={handleShapeDrop}
              >
                {/* Render booths inside the shape */}
                {shape.booths.map((booth) => (
                  <Booth
                    key={booth.number}
                    id={booth.number}
                    name={booth.number}
                    position={`(${booth.length}x${booth.breadth})`}
                    onClick={() => handleBoothClick(booth.number, shape.id)}
                  />
                ))}
              </GridItem>
            ))}
          </Grid>
        </Box>

        {/* Booth Creation Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Booth</ModalHeader>
            <ModalBody>
              <Input
                placeholder="Booth Number"
                value={newBooth.number}
                onChange={(e) =>
                  setNewBooth({ ...newBooth, number: e.target.value })
                }
                mb={4}
              />
              <Input
                placeholder="Exhibitor Category"
                value={newBooth.category}
                onChange={(e) =>
                  setNewBooth({ ...newBooth, category: e.target.value })
                }
                mb={4}
              />
              <Flex justifyContent="space-between">
                <Input
                  placeholder="Length (ft)"
                  type="number"
                  value={newBooth.length}
                  onChange={(e) =>
                    setNewBooth({ ...newBooth, length: e.target.value })
                  }
                />
                <Input
                  placeholder="Breadth (ft)"
                  type="number"
                  value={newBooth.breadth}
                  onChange={(e) =>
                    setNewBooth({ ...newBooth, breadth: e.target.value })
                  }
                />
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Close
              </Button>
              <Button colorScheme="blue" onClick={handleSaveBooth}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </Box>
  );
};

export default BoothPlan;
