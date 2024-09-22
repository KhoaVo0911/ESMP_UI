import { Box, Button, List, ListItem, Link, Spinner } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the mockAPI
    axios
      .get("https://667be23e3c30891b865a6c89.mockapi.io/events")
      .then((response) => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box>
      <List>
        {events.map((event) => (
          <ListItem
            key={event.id}
            borderWidth="1px"
            borderRadius="md"
            p={4}
            mb={2}
          >
            <Link as={RouterLink} to={`/events/${event.id}`}>
              <Button>{event.eventName}</Button>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default EventList;
