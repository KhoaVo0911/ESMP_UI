import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Step 1: Retrieve vendorId, hostId, and accessToken from sessionStorage
    const vendorId = sessionStorage.getItem("vendorId");
    const hostId = sessionStorage.getItem("hostId");
    const accessToken = sessionStorage.getItem("accessToken");

    if (!vendorId || !hostId || !accessToken) {
      console.error("Missing vendorId, hostId, or accessToken.");
      return;
    }

    // Step 2: Fetch events from the host
    axios
      .get(`https://esmpbe.id.vn/api/event/host/${hostId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        const events = response.data;

        // Step 3: Filter finished events
        const finishedEvents = events.filter(event => event.status === 'finished');
        if (finishedEvents.length === 0) {
          console.log("No finished events found.");
          return;
        }

        const eventIds = finishedEvents.map(event => event.eventId);

        // Step 4: Check vendor participation in each finished event
        const vendorEventPromises = eventIds.map((eventId) =>
          axios
            .get(`/vendorinevent/${vendorId}/${eventId}`)
            .then((response) => {
              const vendorStatus = response.data?.status;
              console.log(`Vendor status for event ${eventId}:`, vendorStatus);

              if (vendorStatus === "accept" || vendorStatus === "finished") {
                return eventId;  // Vendor participates and event is either "accept" or "finished"
              }

              return null;  // Vendor does not participate or status is not "accept" or "finished"
            })
            .catch((error) => {
              console.error(`Error fetching vendor participation for event ${eventId}:`, error);
              return null;
            })
        );

        Promise.all(vendorEventPromises).then((validEventIds) => {
          const filteredEventIds = validEventIds.filter(eventId => eventId !== null);

          if (filteredEventIds.length === 0) {
            console.log("Vendor is not involved in any valid finished events.");
            return;
          }

          // Step 5: Fetch order data for the valid eventIds
          calculateTotalRevenue(filteredEventIds, vendorId, finishedEvents);
        });
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  const calculateTotalRevenue = (eventIds, vendorId, finishedEvents) => {
    const eventPromises = eventIds.map((eventId) =>
      axios
        .get(`/order/event/${eventId}/${vendorId}`)
        .then((response) => {
          const totalRevenue = response.data.reduce((total, order) => total + parseFloat(order.totalPrice), 0);
          return {
            eventId,
            totalRevenue,
            eventName: finishedEvents.find(event => event.eventId === eventId).name,
          };
        })
        .catch((error) => {
          console.error(`Error fetching orders for event ${eventId}:`, error);
          return {
            eventId,
            totalRevenue: 0,
            eventName: finishedEvents.find(event => event.eventId === eventId).name,
          };
        })
    );

    // Wait for all revenue calculations to finish
    Promise.all(eventPromises).then((revenues) => {
      const labels = revenues.map(revenue => revenue.eventName);
      const data = revenues.map(revenue => revenue.totalRevenue);

      const backgroundColors = [
        "#4318FF", "#6AD2FF", "#E1E9F8", "rgba(67, 24, 255, 0.28)",
      ];

      setChartData({
        labels,
        datasets: [
          {
            label: "Total Revenue (VND)",
            data,
            backgroundColor: backgroundColors,
            borderRadius: 10,
            hoverBackgroundColor: "#FF9248",
          },
        ],
      });
    });
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: { size: 14, family: "'Segoe UI', 'Roboto', 'Helvetica', sans-serif" },
          color: "#A3AED0",
        },
      },
      title: {
        display: true,
        text: "Total Revenue of Events",
        font: { size: 18, weight: "bold" },
        color: "#4318FF",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw.toLocaleString("vi-VN")} VND`;
          },
        },
        backgroundColor: "#333",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 14, weight: "500" },
          color: "#A3AED0",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString("vi-VN") + " VND";
          },
          font: { size: 14 },
          color: "#CBD5E0",
        },
        grid: {
          borderColor: "rgba(163, 174, 208, 0.3)",
          drawBorder: false,
          lineWidth: 1,
        },
      },
    },
    layout: {
      padding: { left: 0, right: 0, top: 0, bottom: 0 },
    },
    elements: {
      bar: { borderRadius: 10, barThickness: 40 },
    },
  };

  return (
    <div
      style={{
        width: "110%",
        maxWidth: "900px",
        height: "400px",
        margin: "16px auto",
        padding: "24px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default RevenueChart;
