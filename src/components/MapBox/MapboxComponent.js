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

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibWluaGRxMjUxMiIsImEiOiJjbTNvcng0Y3MwNmJpMmxxdWl3aDVjYXU0In0.aL5rtwlAjXrvQ_lRfnSXNQ";

const MapboxComponent = ({ onSaveCoordinates }) => {
  const [viewport, setViewport] = useState({
    latitude: 10.8231,
    longitude: 106.6297,
    zoom: 15,
  });
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [coordinates, setCoordinates] = useState("");
  const [locationName, setLocationName] = useState("");

  const geocoder = MapboxGeocoder({ accessToken: MAPBOX_TOKEN });

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.trim().length < 2) {
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
    setLocationName(place.place_name);
    setSuggestions([]);
  };

  const handleSubmitToBackend = () => {
    if (!coordinates) {
      alert("No coordinates to save!");
      return;
    }

    if (onSaveCoordinates) onSaveCoordinates(coordinates);
    alert(`Coordinates (${coordinates}) saved temporarily.`);
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

        {locationName && (
          <Box>
            <Text fontWeight="bold" mb={2}>
              Selected Location:
            </Text>
            <Text>{locationName}</Text>
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
            onMove={(evt) => {
              setViewport(evt.viewState);
              console.log("Viewport updated:", evt.viewState); // Log giá trị viewport sau mỗi lần di chuyển bản đồ
            }}
          >
            {coordinates && (
              <Marker
                latitude={parseFloat(coordinates.split(",")[0])}
                longitude={parseFloat(coordinates.split(",")[1])}
                anchor="center" // Đảm bảo marker ở chính giữa
                color="red"
              />
            )}
            {coordinates && console.log("Marker coordinates:", coordinates)}{" "}
            {/* Log tọa độ của Marker */}
          </Map>
        </Box>

        <Button
          onClick={handleSubmitToBackend}
          colorScheme="green"
          isDisabled={!coordinates}
        >
          Create Location
        </Button>
      </VStack>
    </Box>
  );
};

export default MapboxComponent;
