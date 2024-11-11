// src/components/ThemeEventSection.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  FormControl,
  FormLabel,
  Input,
  Select,
  Heading,
} from "@chakra-ui/react";

const ThemeEventSection = () => {
  const [themes, setThemes] = useState([
    { id: 1, name: "Tech Talk", status: "ACTIVE" },
    { id: 2, name: "Workshop", status: "INACTIVE" },
  ]);
  const [newTheme, setNewTheme] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  const handleAddTheme = () => {
    if (newTheme.trim()) {
      setThemes([...themes, { id: themes.length + 1, name: newTheme, status }]);
      setNewTheme("");
      setStatus("ACTIVE");
    }
  };

  const handleDeleteTheme = (id) => {
    setThemes(themes.filter((theme) => theme.id !== id));
  };

  return (
    <Box mb={10}>
      <Heading size="lg" fontWeight="bold" color="blue.600" mb={6}>
        Theme Event
      </Heading>
      <Box mb={8} bg="white" p={6} borderRadius="md" shadow="md">
        <FormControl mb={4}>
          <FormLabel>Theme Name</FormLabel>
          <Input
            placeholder="Enter theme name"
            value={newTheme}
            onChange={(e) => setNewTheme(e.target.value)}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Status</FormLabel>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ACTIVE">Available</option>
            <option value="INACTIVE">Inactive</option>
          </Select>
        </FormControl>
        <Button colorScheme="teal" onClick={handleAddTheme}>
          Add Theme
        </Button>
      </Box>

      <Table
        variant="simple"
        colorScheme="gray"
        size="lg"
        bg="white"
        borderRadius="md"
        shadow="md"
      >
        <Thead bg="gray.200">
          <Tr>
            <Th>No</Th>
            <Th>Name</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {themes.map((theme, index) => (
            <Tr key={theme.id}>
              <Td>{index + 1}</Td>
              <Td>{theme.name}</Td>
              <Td>
                <Badge
                  colorScheme={theme.status === "ACTIVE" ? "green" : "red"}
                >
                  {theme.status}
                </Badge>
              </Td>
              <Td>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeleteTheme(theme.id)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ThemeEventSection;
