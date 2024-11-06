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
import { getData, postData } from "../../shared/locationType";

const LocationTypePage = () => {
  const { eventId } = useParams();
  const [locationTypes, setLocationTypes] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("Available");

  // Lấy danh sách location types khi component được mount
  useEffect(() => {
    if (eventId) {
      getData("locationType", { eventId })
        .then((data) => {
          setLocationTypes(data);
        })
        .catch((error) => {
          console.error("Error fetching location types:", error);
        });
    }
  }, [eventId]);

  // Hàm thêm mới loại vị trí
  const handleAddLocationType = () => {
    if (!eventId) {
      alert("Event ID is required");
      return;
    }

    const newLocationType = {
      eventId,
      name,
      price: parseFloat(price) || 0, // Giá mặc định là 0 nếu không nhập
      status,
    };

    postData("locationType", newLocationType)
      .then((data) => {
        setLocationTypes([...locationTypes, data]);
        setName("");
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
        <FormLabel>Tên loại vị trí</FormLabel>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên loại vị trí"
        />
      </FormControl>
      <FormControl id="price" mb={4}>
        <FormLabel>Giá (VNĐ)</FormLabel>
        <Input
          value={price}
          type="number"
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Nhập giá (hoặc để trống nếu miễn phí)"
        />
      </FormControl>
      <FormControl id="status" mb={4}>
        <FormLabel>Trạng thái</FormLabel>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Available">Available</option>
          <option value="Booked">Booked</option>
          <option value="On Hold">On Hold</option>
        </Select>
      </FormControl>
      <Button colorScheme="teal" onClick={handleAddLocationType}>
        Thêm loại vị trí
      </Button>

      {/* Bảng hiển thị danh sách loại vị trí */}
      <Table mt={6}>
        <Thead>
          <Tr>
            <Th>Tên</Th>
            <Th>Giá (VNĐ)</Th>
            <Th>Trạng thái</Th>
          </Tr>
        </Thead>
        <Tbody>
          {locationTypes.map((type) => (
            <Tr key={type.id}>
              <Td>{type.name}</Td>
              <Td>
                {type.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Td>{" "}
              {/* Định dạng giá tiền */}
              <Td>{type.status}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default LocationTypePage;
