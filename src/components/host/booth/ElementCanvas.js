import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faToilet,
  faDoorOpen,
  faHamburger,
} from "@fortawesome/free-solid-svg-icons";

const ElementCanvas = () => {
  const [elements, setElements] = useState([]);

  const handleElementUpdate = (id, newProps) => {
    setElements(
      elements.map((el) => (el.id === id ? { ...el, ...newProps } : el))
    );
  };

  const addElement = (type) => {
    const newElement = {
      id: elements.length + 1,
      type,
      x: 100,
      y: 100,
      width: 50,
      height: 50,
    };
    setElements([...elements, newElement]);
  };

  const renderIcon = (type) => {
    switch (type) {
      case "coffee":
        return <FontAwesomeIcon icon={faCoffee} />;
      case "toilet":
        return <FontAwesomeIcon icon={faToilet} />;
      case "door":
        return <FontAwesomeIcon icon={faDoorOpen} />;
      case "food":
        return <FontAwesomeIcon icon={faHamburger} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {elements.map((el) => (
        <Rnd
          key={el.id}
          size={{ width: el.width, height: el.height }}
          position={{ x: el.x, y: el.y }}
          onDragStop={(e, d) => handleElementUpdate(el.id, { x: d.x, y: d.y })}
          onResizeStop={(e, direction, ref, delta, position) => {
            handleElementUpdate(el.id, {
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              x: position.x,
              y: position.y,
            });
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {renderIcon(el.type)}
          </div>
        </Rnd>
      ))}
    </div>
  );
};

export default ElementCanvas;
