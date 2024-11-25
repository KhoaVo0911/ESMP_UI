import React, { useState, useEffect } from "react";
import { Box, Button, Spinner, useToast } from "@chakra-ui/react";
import axios from "axios";

const EndEvent = ({
  eventId,
  accessToken,
  hostId,
  vendorId,
  vendorInEventStatus,
  totalRevenue,
  onStatusUpdate,
}) => {
  const [vendorInEventId, setVendorInEventId] = useState(null); // ID của vendor in event
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // Xử lý trạng thái bấm nút
  const toast = useToast();

  // Fetch VendorInEventId
  useEffect(() => {
    const fetchVendorInEventId = async () => {
      try {
        const response = await axios.get(
          `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/vendorinevent/${vendorId}/${eventId}`,
          {
            headers: {
              Authorization: `${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.vendorinEventId) {
          setVendorInEventId(response.data.vendorinEventId);
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
          description: "Failed to fetch VendorInEventId.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      setLoading(false);
    };

    fetchVendorInEventId();
  }, [vendorId, eventId, accessToken, toast]);

  // Xử lý bấm nút "End Event"
  const handleEndEventClick = async () => {
    if (!vendorInEventId || vendorInEventStatus === "finished") {
      toast({
        title: "Error",
        description: "Cannot end event: Event is already finished or invalid ID.",
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
      // Cập nhật trạng thái VendorInEvent
      await axios.put(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/vendorinevent/${vendorInEventId}`,
        {
          vendorinEventId: vendorInEventId,
          eventId: eventId,
          vendorId: vendorId,
          status: "finished", // Cập nhật trạng thái thành "finished"
        },
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Gửi tổng doanh thu và trạng thái vào API event payment
      await axios.put(
        `http://ec2-13-215-31-68.ap-southeast-1.compute.amazonaws.com:2510/api/eventpayment/${vendorInEventId}`,
        {
          totalrevenue: totalRevenue,
          status: "Refunding Deposit", // Trạng thái thanh toán
        },
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        title: "Success",
        description: "Event successfully ended and payment updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Gọi callback để cập nhật trạng thái trong Shop
      if (onStatusUpdate) {
        onStatusUpdate("finished");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to end event or update payment.",
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
      <Button
        colorScheme="green"
        onClick={handleEndEventClick}
        disabled={vendorInEventStatus === "finished" || actionLoading}
        cursor={vendorInEventStatus === "finished" ? "not-allowed" : "pointer"}
        isLoading={actionLoading} // Hiển thị spinner khi đang xử lý
      >
        End Event
      </Button>
    </Box>
  );
};

export default EndEvent;
