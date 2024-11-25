import React, { useState } from "react";
import Map, { Marker } from "react-map-gl";
import MapboxGeocoder from "@mapbox/mapbox-sdk/services/geocoding";
import {
  Box,
  Input,
  Button,
  VStack,
  Text,
  HStack,
  List,
  ListItem,
  Link,
} from "@chakra-ui/react";

const BASE_URL =
  "http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/event";
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibWluaGRxMjUxMiIsImEiOiJjbTNvcng0Y3MwNmJpMmxxdWl3aDVjYXU0In0.aL5rtwlAjXrvQ_lRfnSXNQ";

const MapboxComponent = ({ eventId, onSaveCoordinates }) => {
  const [viewport, setViewport] = useState({
    latitude: 10.8231,
    longitude: 106.6297,
    zoom: 15,
  });
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [coordinates, setCoordinates] = useState("");

  const geocoder = MapboxGeocoder({ accessToken: MAPBOX_TOKEN });

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await geocoder
        .forwardGeocode({
          query: value,
          limit: 4,
        })
        .send();

      setSuggestions(response.body.features);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSuggestionClick = (place) => {
    const latitude = place.geometry.coordinates[1];
    const longitude = place.geometry.coordinates[0];

    setViewport({ latitude, longitude, zoom: 15 });
    setCoordinates(`${latitude},${longitude}`);
    setSelectedLocation(place);
    setSuggestions([]);
  };

  const handleSubmitToBackend = async () => {
    if (!coordinates || !eventId) {
      alert("Missing required information (coordinates or eventId)!");
      return;
    }

    try {
      const [latitude, longitude] = coordinates.split(",");

      const payload = {
        coordinates: `${latitude},${longitude}`,
      };

      console.log("Sending coordinates to backend:", payload);

      const response = await fetch(`${BASE_URL}/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Coordinates updated successfully!");
        if (onSaveCoordinates) onSaveCoordinates(coordinates);
      } else {
        console.error("Failed to update coordinates:", await response.text());
        alert("Failed to update coordinates.");
      }
    } catch (error) {
      console.error("Error updating coordinates:", error);
      alert("An error occurred while updating coordinates.");
    }
  };

  return (
    <Box p={6}>
      <VStack spacing={4} align="stretch">
        <Box>
          <Text fontWeight="bold" mb={2}>
            Search Location
          </Text>
          <HStack>
            <Input
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Enter location"
            />
          </HStack>

          {suggestions.length > 0 && (
            <List bg="white" border="1px solid #ccc" borderRadius="8px" mt={2}>
              {suggestions.map((place, index) => (
                <ListItem
                  key={index}
                  p={2}
                  _hover={{ bg: "gray.100", cursor: "pointer" }}
                  onClick={() => handleSuggestionClick(place)}
                >
                  {place.place_name}
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {selectedLocation && (
          <Box>
            <Text fontWeight="bold" mb={2}>
              Selected Location:
            </Text>
            <Text>{selectedLocation.place_name}</Text>
            <Text>Coordinates: {coordinates}</Text>
            <Link
              href={`https://www.google.com/maps?q=${coordinates}`}
              isExternal
              color="blue.500"
              mt={2}
            >
              View Larger Map
            </Link>
          </Box>
        )}

        <Box>
          <Text fontWeight="bold" mb={2}>
            Map
          </Text>
          <Map
            mapboxAccessToken={MAPBOX_TOKEN}
            initialViewState={{
              latitude: viewport.latitude,
              longitude: viewport.longitude,
              zoom: viewport.zoom,
            }}
            style={{ width: "100%", height: "400px" }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            onMove={(evt) => setViewport(evt.viewState)}
          >
            {coordinates && (
              <Marker
                latitude={parseFloat(coordinates.split(",")[0])}
                longitude={parseFloat(coordinates.split(",")[1])}
                anchor="center"
                color="red"
              />
            )}
          </Map>
        </Box>

        <Button
          onClick={handleSubmitToBackend}
          colorScheme="green"
          isDisabled={!coordinates}
        >
          Update Event Location
        </Button>
      </VStack>
    </Box>
  );
};

export default MapboxComponent;
