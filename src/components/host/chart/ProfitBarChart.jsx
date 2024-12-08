import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import axios from "axios";

const ProfitChart = ({ hostId }) => {
  const [chartData, setChartData] = useState([]);
  const [eventNames, setEventNames] = useState([]);
  const [eventIds, setEventIds] = useState([]);

  useEffect(() => {
    if (!hostId) return;

    // Lấy danh sách sự kiện từ hostId
    axios
      .get(`/api/event/host/${hostId}`)
      .then((response) => {
        const events = response.data;
        setEventIds(events.map((event) => event.eventId)); // Lưu lại danh sách eventId
        setEventNames(events.map((event) => event.name)); // Lưu lại tên sự kiện
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, [hostId]);

  useEffect(() => {
    if (eventIds.length === 0) return;

    // Lấy dữ liệu payment của từng eventId
    const fetchData = async () => {
      const profits = await Promise.all(
        eventIds.map(async (eventId) => {
          try {
            const eventPayments = await axios.get(
              `/api/eventpayment/${eventId}`
            );
            const services = await axios.get(`/api/service/${eventId}`);

            let totalProfit = 0;
            let vendorCount = 0;
            let totalServiceCost = 0;

            // Tính tổng lợi nhuận và số lượng vendor
            eventPayments.data.forEach((payment) => {
              if (payment.status === "finished") {
                vendorCount++;
              }
              totalProfit += parseFloat(payment.totalprofit);
            });

            // Tính tổng chi phí dịch vụ
            services.data.forEach((service) => {
              totalServiceCost += parseFloat(service.price) * service.quantity;
            });

            // Tính lợi nhuận cho từng sự kiện
            return totalProfit - 2000 * vendorCount - totalServiceCost;
          } catch (error) {
            console.error("Error fetching payment or service data:", error);
            return 0; // Trả về 0 nếu có lỗi
          }
        })
      );

      // Lưu lại dữ liệu vào chartData
      setChartData(
        profits.map((profit, index) => ({
          name: eventNames[index],
          value: profit,
        }))
      );
    };

    fetchData();
  }, [eventIds, eventNames]);

  const option = {
    title: {
      text: "Event Profit",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: eventNames, // Tên sự kiện
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: chartData.map((item) => item.value), // Giá trị lợi nhuận
        type: "bar",
      },
    ],
  };

  return <ReactECharts option={option} />;
};

export default ProfitChart;
