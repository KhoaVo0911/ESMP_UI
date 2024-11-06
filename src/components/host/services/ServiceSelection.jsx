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
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";

const ServiceSelection = ({ onSave, onSkip }) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ isOpen: true });
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    name: "",
    price: "",
    quantity: "",
    status: false,
  });

  const handleAddService = () => {
    if (!newService.name || !newService.price || !newService.quantity) return;

    setServices([...services, newService]);
    setNewService({ name: "", price: "", quantity: "" });
  };

  const handleSave = () => {
    onSave(services); // Call the onSave function and pass the services
    onClose(); // Close the modal after saving
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onSkip} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Service Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Form to enter service information */}
            <FormControl mb={4}>
              <FormLabel>Service Name</FormLabel>
              <Input
                placeholder="Enter service name"
                value={newService.name}
                onChange={(e) =>
                  setNewService({ ...newService, name: e.target.value })
                }
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                placeholder="Enter service price"
                value={newService.price}
                onChange={(e) =>
                  setNewService({ ...newService, price: e.target.value })
                }
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Quantity</FormLabel>
              <Input
                type="number"
                placeholder="Enter quantity"
                value={newService.quantity}
                onChange={(e) =>
                  setNewService({ ...newService, quantity: e.target.value })
                }
              />
            </FormControl>
            <Button onClick={handleAddService} colorScheme="blue" mb={4}>
              Add Service
            </Button>

            {/* Table to display the added services */}
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Service Name</Th>
                  <Th>Price</Th>
                  <Th>Quantity</Th>
                </Tr>
              </Thead>
              <Tbody>
                {services.map((service, index) => (
                  <Tr key={index}>
                    <Td>{service.name}</Td>
                    <Td>{service.price}</Td>
                    <Td>{service.quantity}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              Save
            </Button>
            <Button variant="ghost" onClick={onSkip}>
              Skip
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ServiceSelection;
