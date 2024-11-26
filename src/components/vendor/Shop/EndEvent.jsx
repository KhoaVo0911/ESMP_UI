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

  // Fetch VendorInEventId và Event Details
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

        // Lọc sự kiện hiện tại theo eventId
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

        // Cập nhật trạng thái sự kiện
        setEventStatus(currentEvent.status);

        // Lấy VendorInEventId nếu event tồn tại
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
          
          // Kiểm tra trạng thái vendorInEvent và cập nhật
          const vendorStatus = vendorResponse.data.status;
          setVendorInEventStatus(vendorStatus);

          // if (eventStatus !== "finished" && vendorStatus !== "active") {            toast({
          //     title: "Error",
          //     description: `Vendor status is not active. Current status: ${vendorStatus}`,
          //     status: "error",
          //     duration: 3000,
          //     isClosable: true,
          //   });
          //   setLoading(false); // Dừng tải dữ liệu nếu trạng thái không hợp lệ
          //   return;
          // }
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

  // Xử lý bấm nút "End Event"
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
      // Cập nhật trạng thái VendorInEvent
      await axios.put(
        `https://esmpbe.id.vn/api/vendorinevent/${vendorInEventId}`,
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
        `https://esmpbe.id.vn/api/eventpayment/${vendorInEventId}`,
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

  // Chỉ hiển thị nút nếu trạng thái sự kiện là "finished"
  return (
    <Box>
    {eventStatus === "finished" ? (
      <Button
        colorScheme="green"
        onClick={(e) => {
          if (vendorInEventStatus !== "finished" && !actionLoading) {
            handleEndEventClick(e); // Chỉ gọi handleEndEventClick khi nút không bị vô hiệu hóa
          }
        }}
        isLoading={actionLoading} // Hiển thị spinner khi đang xử lý
        disabled={vendorInEventStatus === "finished" || actionLoading} // Vô hiệu hóa nút nếu trạng thái là "finished" hoặc đang xử lý
        cursor={vendorInEventStatus === "finished" || actionLoading ? "not-allowed" : "pointer"} // Đổi con trỏ thành "not-allowed" khi nút bị vô hiệu hóa
      >
        End Event
      </Button>
    ) : null}
  </Box>
  
  
  );
};

export default EndEvent;
