import React, { useState, useEffect } from "react";
import { Box, Button, Spinner, useToast } from "@chakra-ui/react";
import axios from "axios";

const EndEvent = ({
  eventId,
  accessToken,
  hostId,
  vendorId,
  totalRevenue,
  onStatusUpdate,
}) => {
  const [vendorInEventId, setVendorInEventId] = useState(null); // ID của vendor in event
  const [eventStatus, setEventStatus] = useState(null); // Trạng thái của event
  const [vendorInEventStatus, setVendorInEventStatus] = useState(null); // Trạng thái của vendor in event
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // Xử lý trạng thái bấm nút
  const toast = useToast();
  const vendorName = sessionStorage.getItem("vendorName");
  const [eventName, setEventName] = useState(null);
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        // Lấy thông tin sự kiện từ host
        const eventResponse = await axios.get(
          `https://esmpbe.id.vn/api/event/host/${hostId}`,
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const currentEvent = eventResponse.data.find(
          (event) => event.eventId === eventId
        );

        if (!currentEvent) {
          toast({
            title: "Error",
            description: "Event not found for the given host.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setLoading(false);
          return;
        }

        setEventStatus(currentEvent.status);
      
        setEventName(currentEvent.name); 
        const vendorResponse = await axios.get(
          `https://esmpbe.id.vn/api/vendorinevent/${vendorId}/${eventId}`,
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (vendorResponse.data && vendorResponse.data.vendorinEventId) {
          setVendorInEventId(vendorResponse.data.vendorinEventId);
          setVendorInEventStatus(vendorResponse.data.status);
        } else {
          toast({
            title: "Error",
            description: "VendorInEventId not found.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch event or vendor details.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [hostId, eventId, vendorId, accessToken, toast]);

  const handleEndEventClick = async () => {
    if (!vendorInEventId || eventStatus !== "finished") {
      toast({
        title: "Error",
        description: "Cannot end event: Event is not finished or invalid ID.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (typeof totalRevenue !== "number" || totalRevenue < 0) {
      toast({
        title: "Error",
        description: "Total revenue must be a non-negative number.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setActionLoading(true);

    try {
      await axios.put(
        `https://esmpbe.id.vn/api/vendorinevent/${vendorInEventId}`,
        {
          vendorinEventId: vendorInEventId,
          eventId: eventId,
          vendorId: vendorId,
          status: "finished",
        },
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      await axios.put(
        `https://esmpbe.id.vn/api/eventpayment/${vendorInEventId}`,
        {
          status: "Refunding Deposite",
        },
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const hostResponse = await axios.get(
        `https://esmpbe.id.vn/api/host/${hostId}`,
        { headers: { Authorization: accessToken } }
      );

      const userId = hostResponse.data.userid;

      if (userId) {
        await axios.post(
          `https://esmpbe.id.vn/api/notification`,
          {
            userid: userId,
            source: `"${vendorName}" ended the event: ${eventName}`,
          },
          { headers: { Authorization: accessToken } }
        );
        console.log("Notification sent successfully.");
      } else {
        console.error("Could not retrieve userId from host data.");
      }

      toast({
        title: "Success",
        description: "Event successfully ended, payment updated, and notification sent.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      if (onStatusUpdate) {
        onStatusUpdate("finished");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to end event, update payment, or send notification.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" />;
  }

  return (
    <Box>
      {eventStatus === "finished" ? (
        <Button
          colorScheme="green"
          onClick={(e) => {
            if (vendorInEventStatus !== "finished" && !actionLoading) {
              handleEndEventClick(e);
            }
          }}
          isLoading={actionLoading}
          disabled={vendorInEventStatus === "finished" || actionLoading}
          cursor={vendorInEventStatus === "finished" || actionLoading ? "not-allowed" : "pointer"}
        >
          End Event
        </Button>
      ) : null}
    </Box>
  );
};

export default EndEvent;
