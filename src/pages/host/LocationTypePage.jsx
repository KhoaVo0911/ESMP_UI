import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE_URL =
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/map";
const FIXED_HOST_ID = "c12042fa-bd4d-4147-92b8-ad904e374f11"; // hostId cố định

const LocationTypePage = () => {
  const { eventId } = useParams();
  const [locationTypes, setLocationTypes] = useState([]);
  const [typeName, setTypeName] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("Available");

  useEffect(() => {
    if (eventId) {
      axios
        .get(`${API_BASE_URL}/locationTyple/${FIXED_HOST_ID}/${eventId}`, {
          headers: {
            Authorization: sessionStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          setLocationTypes(response.data);
        })
        .catch((error) => {
          console.error("Error fetching location types:", error);
        });
    }
  }, [eventId]);

  const handleAddLocationType = () => {
    if (!eventId) {
      alert("Event ID is required");
      return;
    }

    const newLocationType = {
      eventId,
      typeName,
      price: parseFloat(price) || 0,
      status,
    };

    axios
      .post(
        `${API_BASE_URL}/locationTyple/${FIXED_HOST_ID}/${eventId}`,
        newLocationType,
        {
          headers: {
            Authorization: sessionStorage.getItem("accessToken"),
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setLocationTypes([...locationTypes, response.data]);
        setTypeName("");
        setPrice("");
        setStatus("Available");
      })
      .catch((error) => {
        console.error("Error adding location type:", error);
      });
  };

  return (
    <Box p={4}>
      <FormControl id="name" mb={4}>
        <FormLabel>Booth Type Name</FormLabel>
        <Input
          value={typeName}
          onChange={(e) => setTypeName(e.target.value)}
          placeholder="Enter booth type name"
        />
      </FormControl>
      <FormControl id="price" mb={4}>
        <FormLabel>Price (VND)</FormLabel>
        <Input
          value={price}
          type="number"
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price (or leave blank for free)"
        />
      </FormControl>
      <FormControl id="status" mb={4}>
        <FormLabel>Status</FormLabel>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Available">Available</option>
          <option value="Booked">Booked</option>
          <option value="On Hold">On Hold</option>
        </Select>
      </FormControl>
      <Button colorScheme="teal" onClick={handleAddLocationType}>
        Add Booth Type
      </Button>

      <Table mt={6}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Price (VND)</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {locationTypes.map((type) => (
            <Tr key={type.typeId}>
              <Td>{type.typeName}</Td>
              <Td>
                {type.price
                  ? type.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })
                  : "N/A"}
              </Td>
              <Td>{type.status}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default LocationTypePage;
