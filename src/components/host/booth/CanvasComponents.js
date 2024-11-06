import React, { useState } from "react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import BoothDetails from "./BoothDetails";
import Booth from "./Booth";
import useImage from "use-image"; // Hook to load images (map)

export const Canvas = ({
  booths,
  setBooths,
  onResizeShape,
  onAddBooth,
  onEditBooth,
  deleteBooth,
  mode,
  selectedShapeType,
  mapUrl, // URL của bản đồ
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [newShape, setNewShape] = useState(null);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [mapImage] = useImage(mapUrl); // Load hình ảnh bản đồ

  // Vẽ lưới (tùy chọn, có thể bỏ nếu không cần)
  const gridSize = 50;
  const renderGrid = () => {
    const lines = [];
    const width = window.innerWidth;
    const height = window.innerHeight;
    const numVerticalLines = Math.floor(width / gridSize);
    const numHorizontalLines = Math.floor(height / gridSize);

    for (let i = 0; i < numVerticalLines; i++) {
      lines.push(
        <Rect
          key={`v-${i}`}
          x={i * gridSize}
          y={0}
          width={1}
          height={height}
          fill="#ddd"
        />
      );
    }

    for (let j = 0; j < numHorizontalLines; j++) {
      lines.push(
        <Rect
          key={`h-${j}`}
          x={0}
          y={j * gridSize}
          width={width}
          height={1}
          fill="#ddd"
        />
      );
    }

    return lines;
  };

  const handleShapeMouseDown = (e) => {
    if (mode === "select" || mode === null) return;
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    setIsDrawing(true);

    let newShape;
    switch (selectedShapeType) {
      case "rectangle":
        newShape = {
          type: "rectangle",
          x: pointerPosition.x,
          y: pointerPosition.y,
          width: 0,
          height: 0,
        };
        break;
      case "circle":
        newShape = {
          type: "circle",
          x: pointerPosition.x,
          y: pointerPosition.y,
          width: 0,
          height: 0,
        };
        break;
      case "triangle":
        newShape = {
          type: "triangle",
          x: pointerPosition.x,
          y: pointerPosition.y,
          width: 0,
          height: 0,
        };
        break;
      case "line":
        newShape = {
          type: "line",
          points: [
            pointerPosition.x,
            pointerPosition.y,
            pointerPosition.x + 50,
            pointerPosition.y + 50,
          ],
        };
        break;
      default:
        return;
    }

    setNewShape(newShape);
  };

  const handleShapeMouseMove = (e) => {
    if (!isDrawing) return;
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    const width = pointerPosition.x - newShape.x;
    const height = pointerPosition.y - newShape.y;

    setNewShape({
      ...newShape,
      width,
      height,
    });
  };

  const handleShapeMouseUp = () => {
    if (isDrawing) {
      if (newShape.width > 0 && newShape.height > 0) {
        setBooths([...booths, newShape]);
      }
      setIsDrawing(false);
      setNewShape(null);
    }
  };

  return (
    <>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleShapeMouseDown}
        onMouseMove={handleShapeMouseMove}
        onMouseUp={handleShapeMouseUp}
      >
        <Layer>{renderGrid()}</Layer>
        <Layer>
          {mapImage && (
            <KonvaImage
              image={mapImage}
              x={0}
              y={0}
              width={window.innerWidth}
              height={window.innerHeight}
            />
          )}

          {booths.map((booth, index) => (
            <Booth
              key={index}
              booth={booth}
              onEditBooth={onEditBooth}
              onDelete={() => deleteBooth(index)}
            />
          ))}
        </Layer>
      </Stage>

      {/* Popup chi tiết booth */}
      {selectedBooth && (
        <BoothDetails
          booth={selectedBooth}
          isOpen={!!selectedBooth}
          onClose={() => setSelectedBooth(null)}
          onSave={onEditBooth}
        />
      )}
    </>
  );
};

// Default export
export default Canvas;
