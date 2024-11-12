import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Flex, Box } from "@chakra-ui/react";
import Toolbar from "../../components/host/booth/Toolbar";
import Sidebar from "../../components/host/booth/Sidebar";
import PropertiesPanel from "../../components/host/booth/PropertiesPanel";
import Shape from "../../components/host/booth/Shape";
import Booth from "../../components/host/booth/Booth";
import BoothDetails from "../../components/host/booth/BoothDetails";
import ImageElement from "../../components/host/booth/Image";
import TextElement from "../../components/host/booth/TextElement";
import { Rnd } from "react-rnd";
import { useLocation, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const BASE_URL =
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api";
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const BoothPlan = () => {
  const location = useLocation();
  const { eventId } = useParams();
  const hostId =
    location.state?.hostId || sessionStorage.getItem("hostId") || "";

  const [selectedMode, setSelectedMode] = useState("select");
  const [booths, setBooths] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [imageElements, setImageElements] = useState([]);
  const [textElements, setTextElements] = useState([]);
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

  const [locationTypes, setLocationTypes] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedBoothId, setSelectedBoothId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isBoothModalOpen, setIsBoothModalOpen] = useState(false);
  const [modifiedElements, setModifiedElements] = useState([]);

  useEffect(() => {
    const fetchLocationMap = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/map/${hostId}/${eventId}`,
          {
            headers: { Authorization: getAccessToken() },
          }
        );
        const data = response.data;
        if (data) {
          const boothsWithLocation = data.booths.map((booth) => ({
            ...booth,
            x: booth.location?.x ?? 0,
            y: booth.location?.y ?? 0,
            width: booth.location?.width || 100,
            height: booth.location?.height || 100,
            rotation: booth.location?.rotation ?? 0,
          }));

          const shapesWithLocation = data.shapes.map((shape) => ({
            ...shape,
            x: shape.location?.x ?? 0,
            y: shape.location?.y ?? 0,
            width: shape.location?.width || 100,
            height: shape.location?.height || 100,
            rotation: shape.location?.rotation ?? 0,
            type: shape.location.shape,
          }));

          setBooths(boothsWithLocation);
          setShapes(shapesWithLocation);
          setMainTemplate(data.mainTemplate || mainTemplate);
          setImageElements(data.imageElements || []);
        }
      } catch (error) {
        console.error("Error fetching Location Map:", error);
      }
    };
    fetchLocationMap();

    const fetchLocationTypes = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/map/locationTyple/${hostId}/${eventId}`,
          {
            headers: { Authorization: getAccessToken() },
          }
        );
        setLocationTypes(response.data);
      } catch (error) {
        console.error("Error fetching location types:", error);
      }
    };

    fetchLocationTypes();
  }, [hostId, eventId]);

  const addModifiedElement = (element) => {
    setModifiedElements((prev) => [
      ...prev.filter((el) => el.locationId !== element.locationId),
      element,
    ]);
  };

  const handleBoothUpdate = (updatedBooth) => {
    console.log(updatedBooth, "abc");
    setBooths((prevBooths) =>
      prevBooths.map((booth) =>
        booth.locationId === updatedBooth.locationId ? updatedBooth : booth
      )
    );
    addModifiedElement(updatedBooth);
  };

  const handleShapeUpdate = (updatedShape) => {
    console.log(updatedShape, "xyz");
    setShapes((prevShapes) =>
      prevShapes.map((shape) =>
        shape.locationId === updatedShape.locationId ? updatedShape : shape
      )
    );
    addModifiedElement(updatedShape);
  };

  const handleImageUpdate = (updatedImage) => {
    setImageElements((prevImages) =>
      prevImages.map((img) =>
        img.locationId === updatedImage.locationId ? updatedImage : img
      )
    );
    addModifiedElement(updatedImage);
  };

  const handleMainTemplateUpdate = (updatedTemplate) => {
    setMainTemplate(updatedTemplate);
    addModifiedElement(updatedTemplate);
  };

  const handleSave = async () => {
    if (modifiedElements.length > 0) {
      try {
        await axios.put(`${BASE_URL}/map`, modifiedElements, {
          headers: { Authorization: getAccessToken() },
        });
        alert("Saved successfully!");
        setModifiedElements([]);
      } catch (error) {
        console.error("Error saving data:", error);
        alert("Failed to save data.");
      }
    } else {
      alert("No changes to save.");
    }
  };

  const handleDelete = () => {
    if (selectedElement) {
      const { locationId } = selectedElement;

      setBooths((prevBooths) =>
        prevBooths.filter((booth) => booth.locationId !== locationId)
      );
      setShapes((prevShapes) =>
        prevShapes.filter((shape) => shape.locationId !== locationId)
      );
      setImageElements((prevImages) =>
        prevImages.filter((img) => img.locationId !== locationId)
      );
      setTextElements((prevTexts) =>
        prevTexts.filter((text) => text.locationId !== locationId)
      );

      addModifiedElement({ ...selectedElement, deleted: true });

      setSelectedElement(null);
      setSelectedBoothId(null);
    }
  };

  const handleBoothClick = (booth) => {
    setSelectedBoothId(booth.locationId);
    setSelectedElement(booth);
  };

  const handleShapeClick = (shape) => {
    setSelectedElement(shape);
    setSelectedBoothId(null);
  };

  const handleImageClick = (image) => {
    setSelectedElement(image);
    setSelectedBoothId(null);
  };

  const handleTextClick = (text) => {
    setSelectedElement(text);
    setSelectedBoothId(null);
  };

  const handleTextUpdate = (updatedText) => {
    setTextElements((prevTexts) =>
      prevTexts.map((text) =>
        text.locationId === updatedText.locationId ? updatedText : text
      )
    );
    addModifiedElement(updatedText);
  };

  const handleTextContentChange = (updatedText) => {
    setTextElements((prevTexts) =>
      prevTexts.map((text) =>
        text.locationId === updatedText.locationId ? updatedText : text
      )
    );
  };

  const addText = () => {
    const newText = {
      locationId: uuidv4(),
      x: 100,
      y: 100,
      width: 150,
      height: 50,
      content: "New Text",
      fontSize: 16,
      color: "#000",
      backgroundColor: "transparent",
      bold: false,
      italic: false,
      underline: false,
      textAlign: "center",
      rotation: 0,
    };
    setTextElements([...textElements, newText]);
  };

  const handleAddBooth = (newBoothDetails) => {
    const newBooth = {
      ...newBoothDetails,
      locationId: uuidv4(),
    };
    setBooths([...booths, newBooth]);
    setIsBoothModalOpen(false);
  };

  const handleUndo = () => {
    console.log("Undo action triggered");
    // Implement undo logic here
  };

  const handleRedo = () => {
    console.log("Redo action triggered");
    // Implement redo logic here
  };

  const handleGridToggle = () => {
    console.log("Grid toggle action triggered");
    // Implement grid toggle logic here
  };

  const handleZoomIn = () => {
    console.log("Zoom in action triggered");
    // Implement zoom-in logic here
  };

  const handleZoomOut = () => {
    console.log("Zoom out action triggered");
    // Implement zoom-out logic here
  };

  const openBoothModal = () => setIsBoothModalOpen(true);
  const closeBoothModal = () => setIsBoothModalOpen(false);

  const memoizedElements = [
    <Rnd
      key={mainTemplate.id}
      size={{ width: mainTemplate.width, height: mainTemplate.height }}
      position={{ x: mainTemplate.x, y: mainTemplate.y }}
      onDragStop={(e, d) =>
        handleMainTemplateUpdate({ ...mainTemplate, x: d.x, y: d.y })
      }
      onResizeStop={(e, direction, ref, delta, position) => {
        handleMainTemplateUpdate({
          ...mainTemplate,
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          ...position,
        });
      }}
      style={{
        transform: `rotate(${mainTemplate.rotation || 0}deg)`,
        zIndex: 1,
      }}
    >
      <Shape shape={mainTemplate} isMainTemplate={true} />
    </Rnd>,
    ...shapes.map((shape) => (
      <Rnd
        key={shape.locationId}
        size={{ width: shape.width, height: shape.height }}
        position={{ x: shape.x || 0, y: shape.y || 0 }}
        onDragStop={(e, d) => {
          const updatedShape = { ...shape, x: d.x, y: d.y };
          handleShapeUpdate(updatedShape);
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          const updatedShape = {
            ...shape,
            width: ref.offsetWidth,
            height: ref.offsetHeight,
            x: position.x,
            y: position.y,
          };
          handleShapeUpdate(updatedShape);
        }}
        style={{
          transform: `rotate(${shape.rotation || 0}deg)`,
        }}
        onClick={() => handleShapeClick(shape)}
      >
        <Shape shape={shape} />
      </Rnd>
    )),
    ...booths.map((booth) => (
      <Rnd
        key={booth.locationId} // Đảm bảo key duy nhất cho mỗi booth
        size={{ width: booth.width, height: booth.height }}
        position={{ x: booth.x || 0, y: booth.y || 0 }}
        onDragStop={(e, d) => {
          const updatedBooth = { ...booth, x: d.x, y: d.y };
          handleBoothUpdate(updatedBooth);
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          const updatedBooth = {
            ...booth,
            width: ref.offsetWidth,
            height: ref.offsetHeight,
            x: position.x,
            y: position.y,
          };
          handleBoothUpdate(updatedBooth);
        }}
        style={{
          zIndex: selectedBoothId === booth.locationId ? 10 : 1,
          transform: `rotate(${booth.rotation || 0}deg)`,
        }}
        onClick={() => handleBoothClick(booth)}
      >
        <Booth booth={booth} />
      </Rnd>
    )),
    ...imageElements.map((image) => (
      <Rnd
        key={image.locationId}
        size={{ width: image.width, height: image.height }}
        position={{ x: image.x, y: image.y }}
        onDragStop={(e, d) => handleImageUpdate({ ...image, x: d.x, y: d.y })}
        onResizeStop={(e, direction, ref, delta, position) => {
          handleImageUpdate({
            ...image,
            width: ref.offsetWidth,
            height: ref.offsetHeight,
            ...position,
          });
        }}
        style={{
          transform: `rotate(${image.rotation || 0}deg)`,
        }}
        onClick={() => handleImageClick(image)}
      >
        <ImageElement image={image} />
      </Rnd>
    )),
    ...textElements.map((text) => (
      <Rnd
        key={text.locationId}
        size={{ width: text.width, height: text.height }}
        position={{ x: text.x, y: text.y }}
        onDragStop={(e, d) => handleTextUpdate({ ...text, x: d.x, y: d.y })}
        onResizeStop={(e, direction, ref, delta, position) => {
          handleTextUpdate({
            ...text,
            width: ref.offsetWidth,
            height: ref.offsetHeight,
            x: position.x,
            y: position.y,
          });
        }}
        style={{
          transform: `rotate(${text.rotation || 0}deg)`,
        }}
        onClick={() => handleTextClick(text)}
      >
        <TextElement text={text} onTextChange={handleTextContentChange} />
      </Rnd>
    )),
  ];

  return (
    <Flex direction="column" height="100vh">
      <Toolbar
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handleSave={handleSave}
        handleGridToggle={handleGridToggle}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleDelete={handleDelete}
        isDeleteDisabled={!selectedElement}
      />
      <Flex flex="1">
        <Sidebar
          setMode={setSelectedMode}
          openBoothModal={openBoothModal}
          addText={addText}
        />
        <Box flex="1" position="relative" bg="white" p={4}>
          {memoizedElements}
        </Box>
        <PropertiesPanel
          selectedShape={selectedElement}
          onShapeUpdate={handleShapeUpdate}
          mainTemplate={mainTemplate}
          onMainTemplateUpdate={handleMainTemplateUpdate}
          locationTypes={locationTypes}
        />
      </Flex>
      <BoothDetails
        isOpen={isBoothModalOpen}
        onClose={closeBoothModal}
        onSave={handleAddBooth}
        locationTypes={locationTypes}
      />
    </Flex>
  );
};

export default BoothPlan;
