import React, { useState, useEffect } from "react";
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

const BASE_URL = "https://esmpbe.id.vn/api/event";
const getAccessToken = () => sessionStorage.getItem("accessToken") || "";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibWluaGRxMjUxMiIsImEiOiJjbTNvcng0Y3MwNmJpMmxxdWl3aDVjYXU0In0.aL5rtwlAjXrvQ_lRfnSXNQ";

const MapboxComponent = ({ eventId, eventData = {}, onSaveCoordinates }) => {
  const [viewport, setViewport] = useState({
    latitude: 10.8231,
    longitude: 106.6297,
    zoom: 15,
  });
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [coordinates, setCoordinates] = useState("");

  useEffect(() => {
    if (eventData?.coordinates) {
      const [latitude, longitude] = eventData.coordinates
        .split(",")
        .map(parseFloat);
      setViewport({ latitude, longitude, zoom: 15 });
      setCoordinates(eventData.coordinates);
    }
  }, [eventData]);

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
      const payload = {
        ...eventData,
        coordinates,
        deposit: parseFloat(eventData?.deposit) || 0, // Ensure deposit is a number
        onWed: eventData.onWeb, // Map onWeb to onWed as requested
      };

      console.log("Sending updated event data to backend:", payload);

      const response = await fetch(`${BASE_URL}/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${getAccessToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Coordinates updated successfully!");
        if (onSaveCoordinates) onSaveCoordinates(coordinates);
      } else {
        const errorResponse = await response.json();
        console.error("Failed to update event data:", errorResponse);
        alert(`Error: ${errorResponse.message}`);
      }
    } catch (error) {
      console.error("Error updating event data:", error);
      alert("An error occurred while updating event data.");
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

        {coordinates && selectedLocation && (
          <Box>
            <Text fontWeight="bold" mb={2}>
              Current Coordinates:
            </Text>
            <Text>{coordinates}</Text>
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
            initialViewState={viewport}
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
