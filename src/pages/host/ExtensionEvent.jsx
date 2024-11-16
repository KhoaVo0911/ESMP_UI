import React from "react";
import { Box, Heading, Divider, Grid, GridItem } from "@chakra-ui/react";
import { useParams, useLocation } from "react-router-dom";
import LocationTypeManagement from "../../components/extensionEvent/LocationTypePage";
import ServiceManagement from "../../components/extensionEvent/ServiceSelection";
import ImageEventManagement from "../../components/extensionEvent/ImageEventManagement";

const ExtensionEvent = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const hostId =
    location.state?.hostId || sessionStorage.getItem("hostId") || "";

  return (
    <Box p={6} bg="gray.50" borderRadius="md" boxShadow="md">
      <Heading size="lg" mb={4}>
        Extension Event
      </Heading>

      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(2, 1fr)"
        gap={6}
      >
        {/* Image Event Management */}
        <GridItem colSpan={2}>
          <Box p={4} bg="white" borderRadius="md" boxShadow="sm">
            <Heading size="md" mb={4}>
              Image Event Management
            </Heading>
            <Divider mb={4} />
            <ImageEventManagement eventId={eventId} hostId={hostId} />
          </Box>
        </GridItem>

        {/* Location Type Management */}
        <GridItem>
          <Box p={4} bg="white" borderRadius="md" boxShadow="sm">
            <Heading size="md" mb={4}>
              Location Type Management
            </Heading>
            <Divider mb={4} />
            <LocationTypeManagement eventId={eventId} hostId={hostId} />
          </Box>
        </GridItem>

        {/* Service Management */}
        <GridItem>
          <Box p={4} bg="white" borderRadius="md" boxShadow="sm">
            <Heading size="md" mb={4}>
              Service Management
            </Heading>
            <Divider mb={4} />
            <ServiceManagement eventId={eventId} />
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default ExtensionEvent;
