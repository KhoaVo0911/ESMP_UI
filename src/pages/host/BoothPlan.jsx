import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
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
  Image,
  Center,
  Input,
} from "@chakra-ui/react";
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
import {
  updateLocationMap,
  createLocationMap,
  deleteLocationMap,
} from "../../shared/locationMapApi";
import { storage } from "../../shared/firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
  const [selectedShape, setSelectedShape] = useState(null);
  const [isBoothModalOpen, setIsBoothModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);
  const [modifiedElements, setModifiedElements] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [locationMapId, setLocationMapId] = useState(null);

  const openImageModal = () => setIsImageModalOpen(true);
  const closeImageModal = () => setIsImageModalOpen(false);

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
        console.log(data, "data");
        if (data) {
          // Xử lý dữ liệu booths
          const boothsWithLocation = data.booths.map((booth) => {
            const location = booth.location.locationId;
            const locationTypeId = booth.location.typeId;
            const x = booth.location?.x ?? 0;
            const y = booth.location?.y ?? 0;
            const width = booth.location?.width || 100;
            const height = booth.location?.height || 100;
            const rotation = booth.location?.rotation ?? 0;

            console.log(
              `Booth ID: ${
                locationTypeId || "Unknown"
              }, X: ${x}, Y: ${y}, Width: ${width}, Height: ${height}, Rotation: ${rotation}`
            );
            console.log("Booth Raw Data:", booth);
            return {
              ...booth,
              location,
              locationTypeId,
              x,
              y,
              width,
              height,
              rotation,
            };
          });

          // Xử lý dữ liệu shapes
          const shapesWithLocation = data.shapes.map((shape) => {
            const location = shape.location.locationId;
            const name = shape.name;
            const x = shape.location?.x ?? 0;
            const y = shape.location?.y ?? 0;
            const width = shape.location?.width || 100;
            const height = shape.location?.height || 100;
            const rotation = shape.location?.rotation ?? 0;

            console.log(
              `Shape Location: ${
                location || "Unknown"
              }, X: ${x}, Y: ${y}, Width: ${width}, Height: ${height}, Rotation: ${rotation}`
            );

            return {
              ...shape,
              location,
              name,
              x,
              y,
              width,
              height,
              rotation,
            };
          });

          // Xử lý dữ liệu mainTemplate
          const updatedMainTemplate = {
            ...data.mainTemplate,
            x: data.mainTemplate?.x || 0,
            y: data.mainTemplate?.y || 0,
            width: data.mainTemplate?.width || 600,
            height: data.mainTemplate?.height || 400,
            rotation: data.mainTemplate?.rotation || 0,
          };

          console.log(
            `Main Template: X: ${updatedMainTemplate.x}, Y: ${updatedMainTemplate.y}, Width: ${updatedMainTemplate.width}, Height: ${updatedMainTemplate.height}, Rotation: ${updatedMainTemplate.rotation}`
          );

          // Xử lý dữ liệu imageElements
          const imageElementsWithLocation = data.imageElements.map((image) => {
            const x = image.location?.x ?? 0;
            const y = image.location?.y ?? 0;
            const width = image.location?.width || 150;
            const height = image.location?.height || 150;
            const rotation = image.location?.rotation ?? 0;

            console.log(
              `Image ID: ${
                image.locationId || "Unknown"
              }, X: ${x}, Y: ${y}, Width: ${width}, Height: ${height}, Rotation: ${rotation}`
            );

            return {
              ...image,
              x,
              y,
              width,
              height,
              rotation,
            };
          });

          // Xử lý dữ liệu textElements
          const textElementsWithLocation = data.textElements.map((text) => {
            const location = text.location.locationId;
            const x = text.location?.x ?? 0;
            const y = text.location?.y ?? 0;
            const width = text.location?.width || 150;
            const height = text.location?.height || 50;
            const rotation = text.location?.rotation ?? 0;

            console.log(
              `Text Name: ${
                text.name || "Unknown"
              }, X: ${x}, Y: ${y}, Width: ${width}, Height: ${height}, Rotation: ${rotation}`
            );

            return {
              ...text,
              location,
              x,
              y,
              width,
              height,
              rotation,
            };
          });

          // Cập nhật state
          setBooths(boothsWithLocation);
          setShapes(shapesWithLocation);
          setMainTemplate(updatedMainTemplate);
          setImageElements(imageElementsWithLocation);
          setTextElements(textElementsWithLocation);
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
            headers: {
              Authorization: sessionStorage.getItem("accessToken"),
            },
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
    setBooths((prevBooths) =>
      prevBooths.map((booth) =>
        booth.location === updatedBooth.location
          ? {
              ...booth, // Giữ nguyên các thuộc tính cũ
              x: updatedBooth.x, // Cập nhật giá trị x mới
              y: updatedBooth.y, // Cập nhật giá trị y mới
            }
          : booth
      )
    );
    console.log(updatedBooth, "update");
    addModifiedElement(updatedBooth);
  };

  const handleShapeUpdate = (updatedShape) => {
    setShapes((prevShapes) =>
      prevShapes.map((shape) =>
        shape.location === updatedShape.location
          ? {
              ...shape,
              x: updatedShape.x,
              y: updatedShape.y,
            }
          : shape
      )
    );
    addModifiedElement(updatedShape);
  };

  const handleImageUpdate = (updatedImage) => {
    setImageElements((prevImages) =>
      prevImages.map((img) =>
        img.location === updatedImage.location ? updatedImage : img
      )
    );
    setSelectedElement(updatedImage);
    addModifiedElement(updatedImage);
  };

  const handleMainTemplateUpdate = (updatedTemplate) => {
    setMainTemplate(updatedTemplate);
    addModifiedElement(updatedTemplate);
  };

  const handleSave = async () => {
    try {
      const payload = {
        booths: booths.map((booth) => {
          // Log toàn bộ booth trước khi chuyển đổi
          console.log("Booth Data:", booth);
          return {
            typeId: booth.locationTypeId || "",
            rotation: booth.rotation || 0,
            x: booth.x || 0,
            y: booth.y || 0,
            height: booth.height || 0,
            width: booth.width || 0,
            status: booth.status || "",
          };
        }),
        shapes: shapes.map((shape) => ({
          name: shape.name || "",
          rotation: shape.rotation || 0,
          x: shape.x || 0,
          y: shape.y || 0,
          height: shape.height || 0,
          width: shape.width || 0,
        })),
        textElements: textElements.map((text) => ({
          name: text.name || "",
          rotation: text.rotation || 0,
          x: text.x || 0,
          y: text.y || 0,
          height: text.height || 0,
          width: text.width || 0,
        })),
        mainTemplate: {
          eventId: eventId,
          name: mainTemplate.name || "Main Template",
          x: mainTemplate.x || 0,
          y: mainTemplate.y || 0,
          width: mainTemplate.width || 600,
          height: mainTemplate.height || 400,
          rotation: mainTemplate.rotation || 0,
        },
        imageElements: imageElements.map((image) => image.src || ""),
      };

      console.log("Payload to send:", payload);

      const deleteIds = booths.map((booth) => {
        // Log toàn bộ booth trước khi chuyển đổi
        console.log("Booth Data:", booth);
        return booth.location; // Trả về locationId để xóa
      });

      // Thực hiện xóa từng locationId
      for (const locationId of deleteIds) {
        if (locationId) {
          await deleteLocationMap(locationId);
          console.log(`Deleted location map for locationId: ${locationId}`);
        } else {
          console.log("No locationId found for this booth.");
        }
      }
      // Gửi dữ liệu lên server
      await createLocationMap(hostId, eventId, payload);
      alert("Map saved successfully!");
    } catch (error) {
      console.error("Error saving map:", error);
      alert("Failed to save map.");
    }
  };

  const uploadImageToFirebase = async (file) => {
    try {
      const fileName = `image_${uuidv4()}`;
      const imageRef = ref(storage, `images/${fileName}`);
      await uploadBytes(imageRef, file);
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

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

  const handleUploadImage = async () => {
    if (imageInputRef.current.files[0]) {
      const file = imageInputRef.current.files[0];
      try {
        const url = await uploadImageToFirebase(file);
        if (url) {
          const newImage = {
            src: url,
            x: 100,
            y: 100,
            width: 150,
            height: 150,
            rotation: 0,
            type: "image",
          };
          setImageElements((prev) => [...prev, newImage]);
          addModifiedElement(newImage);
          setSelectedElement(newImage);
          closeModal();
        }
      } catch (error) {
        console.error("Error adding image:", error);
      }
    }
  };

  const closeModal = () => {
    setIsImageModalOpen(false);
    setImagePreview(null);
  };

  const handleDelete = () => {
    if (selectedElement) {
      const { locationId } = selectedElement;

      setBooths((prevBooths) =>
        prevBooths.filter((booth) => booth.location.locationId !== locationId)
      );
      setShapes((prevShapes) =>
        prevShapes.filter((shape) => shape.location.locationId !== locationId)
      );
      setImageElements((prevImages) =>
        prevImages.filter((img) => img.locationId !== locationId)
      );
      setTextElements((prevTexts) =>
        prevTexts.filter((text) => text.location.locationId !== locationId)
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
    if (
      !text ||
      !text.location ||
      !text.location.locationId ||
      !text.locationId
    ) {
      console.error("Text click failed: missing locationId", text.location);
      return;
    }

    setSelectedElement(text);
    setSelectedBoothId(null);
  };

  // const handleTextUpdate = (updatedText) => {
  //   setTextElements((prevTexts) =>
  //     prevTexts.map((text) =>
  //       text.location === updatedText.location
  //         ? {
  //             ...text,
  //             name: updatedText.name,
  //             x: updatedText.x,
  //             y: updatedText.y,
  //           }
  //         : text
  //     )
  //   );
  //   addModifiedElement(updatedText);
  // };

  // const handleTextContentChange = (updatedText) => {
  //   setTextElements((prevTexts) =>
  //     prevTexts.map((text) =>
  //       text.location === updatedText.location
  //         ? {
  //             ...text,
  //             name: updatedText.name,
  //             x: updatedText.x,
  //             y: updatedText.y,
  //           }
  //         : text
  //     )
  //   );
  // };
  const updateTextElements = (updatedText, trackChanges = false) => {
    setTextElements((prevTexts) =>
      prevTexts.map((text) =>
        text.location === updatedText.location
          ? {
              ...text,
              name: updatedText.name,
              x: updatedText.x,
              y: updatedText.y,
            }
          : text
      )
    );

    if (trackChanges) {
      addModifiedElement(updatedText);
    }
  };

  const addText = () => {
    const newText = {
      x: 100,
      y: 100,
      width: 150,
      height: 50,
      name: "New Text",
      type: "text",
    };
    setTextElements([...textElements, newText]);
  };

  const handleAddBooth = (newBoothDetails) => {
    const newBooth = {
      ...newBoothDetails,
      rotation: 0,
      status: "Available",
      type: "booth",
    };
    setBooths([...booths, newBooth]);
  };

  const handleAddShape = (shapeName) => {
    const newShape = {
      name: shapeName,
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      type: "shape",
    };
    setShapes([...shapes, newShape]);
    console.log(newShape, "shape");
  };

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
          x: position.x,
          y: position.y,
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
          console.log(updatedShape, "acb");
          console.log("Key của Shape:", shape.locationId);
        }}
        style={{
          transform: `rotate(${shape.rotation || 0}deg)`,
          zIndex: selectedShape?.locationId === shape.locationId ? 10 : 1,
        }}
        onClick={() => handleShapeClick(shape)}
      >
        <Shape shape={shape} />
      </Rnd>
    )),
    ...booths.map((booth) => (
      <Rnd
        key={booth.location.locationId}
        size={{ width: booth.width, height: booth.height }}
        position={{ x: booth.x || 0, y: booth.y || 0 }}
        onDragStop={(e, d) => {
          const updatedBooth = { ...booth, x: d.x, y: d.y };
          handleBoothUpdate(updatedBooth);
          console.log(updatedBooth, "as");
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
          console.log("Key của Booth:", booth.location.locationId);
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
        position={{ x: image.x, y: image.y }} // Luôn sử dụng position thay vì default
        onDragStop={(e, d) => {
          const updatedImage = { ...image, x: d.x, y: d.y };
          handleImageUpdate(updatedImage);
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          const updatedImage = {
            ...image,
            width: parseInt(ref.style.width, 10),
            height: parseInt(ref.style.height, 10),
            x: position.x,
            y: position.y,
          };
          handleImageUpdate(updatedImage);
          console.log("Key của Image:", image.locationId);
        }}
        style={{
          zIndex: selectedElement?.locationId === image.locationId ? 10 : 1,
          transform: `rotate(${image.rotation || 0}deg)`,
        }}
        onClick={() => handleImageClick(image)}
        enableResizing={{
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true,
        }}
      >
        <ImageElement image={image} />
      </Rnd>
    )),
    // ...textElements.map((text) => (
    //   <Rnd>
    //     <TextElement
    //       key={text.locationId}
    //       text={text}
    //       isSelected={selectedElement?.locationId === text.locationId}
    //       onClick={() => handleTextClick(text)}
    //       onTextChange={(updatedText) => handleTextContentChange(updatedText)}
    //       onDragEnd={(updatedText) => handleTextUpdate(updatedText)}
    //       onResizeEnd={(updatedText) => handleTextUpdate(updatedText)}
    //     />
    //   </Rnd>
    // )),
    ...textElements.map((text) => (
      <Rnd
        key={text.locationId}
        size={{ width: text.width, height: text.height }}
        position={{ x: text.x, y: text.y }}
        onDragStop={(e, d) => {
          const updatedText = { ...text, x: d.x, y: d.y };
          updateTextElements(updatedText);
          console.log(text, "text");
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          const updatedText = {
            ...text,
            width: ref.offsetWidth,
            height: ref.offsetHeight,
            x: position.x,
            y: position.y,
          };
          updateTextElements(updatedText);
          console.log(updatedText, "text");
        }}
        style={{
          zIndex: selectedElement?.locationId === text.locationId ? 10 : 1,
          transform: `rotate(${text.rotation || 0}deg)`,
        }}
        onClick={() => handleTextClick(text)}
      >
        <TextElement
          text={text}
          isSelected={selectedElement?.locationId === text.locationId}
          onClick={() => handleTextClick(text)}
          onTextChange={(updatedText) => updateTextElements(updatedText)}
        />
      </Rnd>
    )),
  ];

  return (
    <Flex direction="column" height="100vh">
      <Toolbar
        handleUndo={() => {}}
        handleRedo={() => {}}
        handleSave={handleSave}
        handleGridToggle={() => {}}
        handleZoomIn={() => {}}
        handleZoomOut={() => {}}
        handleDelete={handleDelete}
        isDeleteDisabled={!selectedElement}
      />
      <Flex flex="1">
        <Sidebar
          setMode={setSelectedMode}
          openBoothModal={() => setIsBoothModalOpen(true)}
          addText={addText}
          addShape={handleAddShape}
          addImage={handleImageButtonClick}
          openImageModal={openImageModal}
        />

        <Box flex="1" position="relative" bg="white" p={4}>
          {memoizedElements}
        </Box>
        <PropertiesPanel
          selectedShape={
            selectedElement?.type === "shape" ? selectedElement : null
          }
          selectedBooth={
            selectedElement?.type === "booth" ? selectedElement : null
          }
          selectedImage={
            selectedElement?.type === "image" ? selectedElement : null
          }
          selectedText={
            selectedElement?.type === "text" ? selectedElement : null
          }
          mainTemplate={mainTemplate}
          onShapeUpdate={handleShapeUpdate}
          onBoothUpdate={handleBoothUpdate}
          onImageUpdate={handleImageUpdate}
          onTextUpdate={updateTextElements}
          onMainTemplateUpdate={handleMainTemplateUpdate} // Truyền hàm cập nhật cho mainTemplate
          locationTypes={locationTypes}
        />
      </Flex>
      <BoothDetails
        isOpen={isBoothModalOpen}
        onClose={() => setIsBoothModalOpen(false)}
        onSave={handleAddBooth}
        locationTypes={locationTypes}
      />
      <Modal isOpen={isImageModalOpen} onClose={closeModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Image</ModalHeader>
          <ModalBody>
            <Center>
              <Input
                type="file"
                ref={imageInputRef}
                onChange={handleImageChange}
              />
            </Center>
            {imagePreview && (
              <Box mt={4} textAlign="center">
                <Image src={imagePreview} alt="Preview" maxWidth="100%" />
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={closeImageModal} variant="outline" mr={3}>
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
    </Flex>
  );
};

export default BoothPlan;
