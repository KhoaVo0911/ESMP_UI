import React, { useState, useEffect } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Box, Text, Badge, Spinner, useToast, TableContainer, Card, CardHeader, CardBody } from "@chakra-ui/react";
import { format } from "date-fns";

const BASE_URL = "https://esmpbe.id.vn/api";

const ListEventEnrolled = () => {
  const vendorId = sessionStorage.getItem("vendorId");
  const hostId = sessionStorage.getItem("hostId");
  const accessToken = sessionStorage.getItem("accessToken");
  const toast = useToast();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!vendorId || !hostId || !accessToken) {
        setError("Missing vendorId, hostId, or accessToken.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/event/host/${hostId}`, {
          method: "GET",
          headers: {
            "Authorization": `${accessToken}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events for the host.");
        }

        const eventsData = await response.json();

        const vendorParticipationPromises = eventsData.map(async (event) => {
          const eventResponse = await fetch(`${BASE_URL}/vendorinevent/${vendorId}/${event.eventId}`, {
            method: "GET",
            headers: {
              "Authorization": `${accessToken}`,
              "Content-Type": "application/json"
            }
          });

          const eventDetails = await eventResponse.json();

          return {
            ...event,
            isEnrolled: eventDetails.status === "accept" || eventDetails.status === "finished",
          };
        });

        const eventsWithParticipation = await Promise.all(vendorParticipationPromises);
        setEvents(eventsWithParticipation.filter(event => event.isEnrolled));
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [vendorId, hostId, accessToken]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <Box p={6} maxWidth="1200px" mx="auto">
      <Card boxShadow="md" border="1px" borderColor="gray.300" borderRadius="md" overflow="hidden">
        <CardHeader bg="white" p={4}>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            Events Participated by Vendor
          </Text>
        </CardHeader>
        <CardBody>
          <TableContainer>
            <Table variant="simple" border="1px" borderColor="gray.300">
              <Thead>
                <Tr>
                  <Th border="1px" borderColor="gray.300">Event Name</Th>
                  <Th border="1px" borderColor="gray.300">Start Date</Th>
                  <Th border="1px" borderColor="gray.300">End Date</Th>
                  <Th border="1px" borderColor="gray.300">Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {events.map((event, index) => (
                  <Tr key={index}>
                    <Td border="1px" borderColor="gray.300">{event.name}</Td>
                    <Td border="1px" borderColor="gray.300">{format(new Date(event.startDate), "yyyy-MM-dd")}</Td>
                    <Td border="1px" borderColor="gray.300">{format(new Date(event.endDate), "yyyy-MM-dd")}</Td>
                    <Td border="1px" borderColor="gray.300">
                      <Badge colorScheme={event.status === "Active" ? "green" : "blue"}>
                        {event.status}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
    </Box>
  );
};

export default ListEventEnrolled;
