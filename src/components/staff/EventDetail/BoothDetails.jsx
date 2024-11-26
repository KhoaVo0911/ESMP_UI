import React from "react";
import { Box, Heading, Text, VStack, Button } from "@chakra-ui/react";

const BoothDetails = ({ selectedBooth, boothTypeDetails, onBookBooth }) => {
  return (
    <Box
      flex="2"
      bg="white"
      borderRadius="md"
      border="1px solid"
      borderColor="gray.200"
      p={6}
      height="100%"
    >
      <Heading size="lg" mb={6} textAlign="center" color="teal.500">
        Booth Details
      </Heading>
      {selectedBooth ? (
        <VStack align="start" spacing={5}>
          <Text fontSize="lg">
            <strong>Name:</strong> {selectedBooth.name}
          </Text>
          <Text fontSize="lg">
            <strong>Status:</strong>{" "}
            <span style={{ color: selectedBooth.location.status === "Available" ? "green" : "red" }}>
              {selectedBooth.location.status}
            </span>
          </Text>
          {boothTypeDetails ? (
            <>
              <Text fontSize="lg">
                <strong>Type:</strong> {boothTypeDetails.typeName}
              </Text>
              <Text fontSize="lg">
                <strong>Price:</strong>{" "}
                {parseInt(boothTypeDetails.price).toLocaleString()} VND
              </Text>
            </>
          ) : (
            <Text fontSize="lg" color="gray.500">
              No type details available for this booth
            </Text>
          )}
          <Button
            colorScheme="blue"
            size="lg"
            onClick={onBookBooth}
            isDisabled={selectedBooth.location.status !== "Available"}
          >
            Book Booth
          </Button>
        </VStack>
      ) : (
        <Text fontSize="lg" color="gray.500">
          Select a booth to see details
        </Text>
      )}
    </Box>
  );
};

export default BoothDetails;
