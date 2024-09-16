import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "@chakra-ui/react";

const CreateProductModal = ({ isOpen, onClose, onCreateProduct }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: 1,
    price: "",
  });

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // Handle product creation
  const handleCreate = () => {
    onCreateProduct(newProduct);
    onClose(); // Close the modal after creation
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Product</ModalHeader>
        <ModalBody>
          <Input
            placeholder="Product Name"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            mb={3}
          />
          <Input
            placeholder="Quantity"
            name="quantity"
            type="number"
            value={newProduct.quantity}
            onChange={handleInputChange}
            mb={3}
          />
          <Input
            placeholder="Product Price"
            name="price"
            type="number"
            value={newProduct.price}
            onChange={handleInputChange}
            mb={3}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleCreate}>
            Create
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateProductModal;
