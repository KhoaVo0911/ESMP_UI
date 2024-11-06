import React, { useState, useEffect, useMemo } from "react";
import {
  Flex,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import Toolbar from "../../components/host/booth/Toolbar";
import Sidebar from "../../components/host/booth/Sidebar";
import PropertiesPanel from "../../components/host/booth/PropertiesPanel";
import BoothDetails from "../../components/host/booth/BoothDetails";
import Shape from "../../components/host/booth/Shape";
import Booth from "../../components/host/booth/Booth";
import ImageElement from "../../components/host/booth/Image";
import {
  createLocationMap,
  updateLocationMap,
  getLocationMapByEventId,
} from "../../shared/locationMapApi";
import { getData } from "../../shared/locationType";
import { useParams } from "react-router-dom";

const BoothPlan = () => {
  const { eventId } = useParams();
  const [selectedMode, setSelectedMode] = useState("select");
  const [booths, setBooths] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [shapes, setShapes] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isGridVisible, setIsGridVisible] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imageElements, setImageElements] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeElement, setActiveElement] = useState(null);
  const [locationMapId, setLocationMapId] = useState(null);
  const [locationTypes, setLocationTypes] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const [mainTemplate, setMainTemplate] = useState({
    id: "main-template",
    name: "Main Template",
    x: 100,
    y: 100,
    width: 600,
    height: 400,
    rotation: 0,
    fillColor: "transparent",
    strokeColor: "#000000",
  });

  useEffect(() => {
    const fetchLocationMap = async () => {
      try {
        const data = await getLocationMapByEventId(eventId);
        if (data && data.length > 0) {
          setBooths(data[0].booths || []);
          setShapes(data[0].shapes || []);
          setMainTemplate(data[0].mainTemplate || mainTemplate);
          setImageElements(data[0].imageElements || []);
          setLocationMapId(data[0].locationId || null);
        } else {
          console.warn("No data found for the specified event ID");
        }
      } catch (error) {
        console.error("Error fetching Location Map:", error);
      }
    };

    fetchLocationMap();

    const fetchLocationTypes = async () => {
      try {
        const data = await getData("locationType");
        setLocationTypes(data);
      } catch (error) {
        console.error("Error fetching location types:", error);
      }
    };

    fetchLocationTypes();
  }, [eventId]);

  useEffect(() => {
    console.log("Shapes:", shapes);
    console.log("Booths:", booths);
    console.log("Main Template:", mainTemplate);
  }, [shapes, booths, mainTemplate]);

  const handleMainTemplateUpdate = (updatedTemplate) => {
    setMainTemplate(updatedTemplate);
    saveLocationMap();
  };

  const handleBoothUpdate = (updatedBooth) => {
    setBooths((prevBooths) =>
      prevBooths.map((booth) =>
        booth.id === updatedBooth.id ? updatedBooth : booth
      )
    );
    setSelectedBooth(updatedBooth);
    setActiveElement(updatedBooth);
    saveLocationMap();
  };

  const handleImageUpdate = (updatedImage) => {
    setImageElements((prevImages) =>
      prevImages.map((img) => (img.id === updatedImage.id ? updatedImage : img))
    );
    setSelectedImage(updatedImage);
    setActiveElement(updatedImage);
    saveLocationMap();
  };

  const handleElementClick = (element) => {
    setActiveElement(element);
    if (element.type === "image") {
      setSelectedImage(element);
      setSelectedShape(null);
      setSelectedBooth(null);
    } else if (element.type === "booth") {
      setSelectedBooth(element);
      setSelectedShape(null);
      setSelectedImage(null);
    } else if (element.type === "shape") {
      setSelectedBooth(null);
      setSelectedShape(element);
      setSelectedImage(null);
    } else {
      setSelectedShape(element);
      setSelectedBooth(null);
      setSelectedImage(null);
    }
  };

  const saveLocationMap = async () => {
    const locationMapData = {
      eventId,
      booths: booths.map((booth) => ({
        ...booth,
        locationTypeId: booth.locationTypeId || null,
      })),
      shapes: shapes.filter((shape) => shape.id !== "main-template"),
      mainTemplate,
      imageElements,
    };

    try {
      if (locationMapId) {
        await updateLocationMap(locationMapId, locationMapData);
      } else {
        const newLocationMap = await createLocationMap(locationMapData);
        setLocationMapId(newLocationMap.locationId);
      }
    } catch (error) {
      console.error("Error saving Location Map:", error);
    }
  };

  const handleShapeUpdate = (updatedShape) => {
    if (updatedShape.id === "main-template") {
      handleMainTemplateUpdate(updatedShape);
    } else {
      setShapes(
        shapes.map((shape) =>
          shape.id === updatedShape.id ? updatedShape : shape
        )
      );
      setSelectedShape(updatedShape);
      setSelectedBooth(null);
      setSelectedImage(null);
      setActiveElement(updatedShape);
      saveLocationMap();
    }
  };

  const handleBoothClick = (booth) => {
    setSelectedBooth(booth);
    setSelectedShape(null);
    setSelectedImage(null);
    setActiveElement(booth);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setSelectedBooth(null);
    setSelectedShape(null);
    setActiveElement(image);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack.pop();
      setRedoStack([
        ...redoStack,
        { booths, shapes, imageElements, mainTemplate },
      ]);
      setBooths(previousState.booths);
      setShapes(previousState.shapes);
      setImageElements(previousState.imageElements);
      setMainTemplate(previousState.mainTemplate);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack.pop();
      setUndoStack([
        ...undoStack,
        { booths, shapes, imageElements, mainTemplate },
      ]);
      setBooths(nextState.booths);
      setShapes(nextState.shapes);
      setImageElements(nextState.imageElements);
      setMainTemplate(nextState.mainTemplate);
    }
  };

  const handleSave = () => {
    const currentData = {
      booths,
      shapes,
      imageElements,
      mainTemplate,
    };
    localStorage.setItem(
      `boothPlanData_${eventId}`,
      JSON.stringify(currentData)
    );
    alert("Booth plan has been saved!");
  };

  const handleDeleteShape = () => {
    setShapes(shapes.filter((shape) => shape.id !== selectedShape.id));
    setSelectedShape(null);
    setActiveElement(null);
    saveLocationMap();
  };

  const handleDeleteBooth = () => {
    setBooths(booths.filter((booth) => booth.id !== selectedBooth.id));
    setSelectedBooth(null);
    setActiveElement(null);
    saveLocationMap();
  };

  const handleDeleteImage = () => {
    setImageElements(
      imageElements.filter((img) => img.id !== selectedImage.id)
    );
    setSelectedImage(null);
    setActiveElement(null);
    saveLocationMap();
  };

  const handleCanvasClick = (e) => {
    if (!selectedBooth && selectedShape) {
      setActiveElement(selectedShape);
    } else if (!selectedBooth && !selectedShape && !selectedImage) {
      setActiveElement(null);
    }
  };

  const handleAddShape = (shapeType, shapeData = null) => {
    let newShape = {
      id: shapes.length + 1,
      name: `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)}`,
      type: shapeType,
      x: shapeData?.x || 100,
      y: shapeData?.y || 100,
      width: shapeData?.width || 100,
      height: shapeData?.height || 100,
      fillColor: "rgba(0, 0, 0, 0.1)",
      strokeColor: "#000000",
    };
    setShapes([...shapes, newShape]);
    setSelectedShape(newShape);
    setSelectedBooth(null);
    setSelectedImage(null);
    setActiveElement(newShape);
    updateUndoStack();
    saveLocationMap();
  };

  const handleAddBooth = (boothDetails) => {
    const newBooth = {
      id: booths.length + 1,
      ...boothDetails,
      x: boothDetails?.x || 100,
      y: boothDetails?.y || 100,
      width: boothDetails?.width || 75,
      height: boothDetails?.height || 75,
      rotation: 0,
    };
    setBooths([...booths, newBooth]);
    setSelectedBooth(newBooth);
    setIsDrawerOpen(false);
    setSelectedShape(null);
    setSelectedImage(null);
    setActiveElement(newBooth);
    saveLocationMap();
  };

  const handleGridToggle = () => setIsGridVisible(!isGridVisible);
  const handleZoomIn = () =>
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 2));
  const handleZoomOut = () =>
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 0.5));

  const updateUndoStack = () => {
    setUndoStack([
      ...undoStack,
      { booths, shapes, imageElements, mainTemplate },
    ]);
  };

  const handleAddImage = (imageData) => {
    const newImage = {
      id: imageElements.length + 1,
      ...imageData,
      x: 100,
      y: 100,
      width: 300,
      height: 200,
    };
    setImageElements([...imageElements, newImage]);
    setSelectedImage(newImage);
    setSelectedBooth(null);
    setSelectedShape(null);
    setActiveElement(newImage);
    setImagePreview(null);
    setIsImageModalOpen(false);
    saveLocationMap();
  };

  const handleImageDragEnd = (updatedImage) => {
    setImageElements((prevImages) =>
      prevImages.map((img) =>
        img.id === updatedImage.id
          ? { ...img, x: updatedImage.x, y: updatedImage.y }
          : img
      )
    );
    saveLocationMap();
  };

  const handleImageResize = (updatedImage) => {
    setImageElements((prevImages) =>
      prevImages.map((img) => (img.id === updatedImage.id ? updatedImage : img))
    );
    saveLocationMap();
  };

  const memoizedShapes = useMemo(() => {
    return [
      <Shape
        key={mainTemplate.id}
        shape={mainTemplate}
        onShapeUpdate={handleMainTemplateUpdate}
        isMainTemplate={true}
      />,
      ...shapes.map((shape) => (
        <Shape key={shape.id} shape={shape} onShapeUpdate={handleShapeUpdate} />
      )),
    ];
  }, [shapes, mainTemplate]);

  const memoizedBooths = useMemo(() => {
    return booths.map((booth) => (
      <Booth
        key={booth.id}
        booth={booth}
        onBoothUpdate={handleBoothUpdate}
        onClick={() => handleBoothClick(booth)}
        style={{ zIndex: activeElement?.id === booth.id ? 10 : 1 }}
      />
    ));
  }, [booths, activeElement]);

  return (
    <Flex direction="column" height="100vh">
      <Toolbar
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handleSave={handleSave}
        handleGridToggle={handleGridToggle}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleDelete={
          selectedShape
            ? handleDeleteShape
            : selectedBooth
            ? handleDeleteBooth
            : selectedImage
            ? handleDeleteImage
            : null
        }
        isDeleteDisabled={!selectedShape && !selectedBooth && !selectedImage}
      />
      <Flex flex="1" onMouseDown={handleCanvasClick}>
        <Sidebar
          setMode={setSelectedMode}
          openBoothModal={() => setIsDrawerOpen(true)}
          openImageUploadModal={() => setIsImageModalOpen(true)}
          addShape={handleAddShape}
          addImage={handleAddImage}
          selectedMode={selectedMode}
        />
        <Box
          flex="1"
          position="relative"
          bg="white"
          p={4}
          onDragOver={(e) => e.preventDefault()}
          className="grid-canvas"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "0 0",
            backgroundImage: isGridVisible
              ? "linear-gradient(to right, #e0e0e0 1px, transparent 1px), linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)"
              : "none",
            backgroundSize: "20px 20px",
          }}
        >
          {memoizedShapes}
          {memoizedBooths}

          {imageElements.map((image) => (
            <ImageElement
              key={image.id}
              image={image}
              onDragEnd={handleImageDragEnd}
              onResizeEnd={handleImageResize}
              onClick={() => handleImageClick(image)}
              isSelected={activeElement?.id === image.id}
            />
          ))}
        </Box>
        <PropertiesPanel
          selectedShape={selectedShape}
          onShapeUpdate={
            selectedShape?.id === "main-template"
              ? handleMainTemplateUpdate
              : handleShapeUpdate
          }
          selectedBooth={selectedBooth}
          onBoothUpdate={handleBoothUpdate}
          selectedImage={selectedImage}
          onImageUpdate={handleImageUpdate}
          mainTemplate={mainTemplate}
        />
        <BoothDetails
          booth={selectedBooth}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSave={handleAddBooth}
          locationTypes={locationTypes}
        />
      </Flex>
      <Modal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose Image</ModalHeader>
          <ModalBody>
            {imagePreview ? (
              <Box>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "100%" }}
                />
              </Box>
            ) : (
              <Box>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setImagePreview(event.target.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsImageModalOpen(false)}>Cancel</Button>
            <Button
              colorScheme="blue"
              onClick={() =>
                handleAddImage({ type: "image", src: imagePreview })
              }
              isDisabled={!imagePreview}
            >
              Upload
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default BoothPlan;
