import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueChart = () => {
  // Dữ liệu cho biểu đồ
  const data = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Total Revenue (VND)",
        data: [1500000, 3000000, 2500000, 4000000],
        backgroundColor: [
          "#4318FF",
          "#6AD2FF",
          "#E1E9F8",
          "rgba(67, 24, 255, 0.28)",
        ],
        borderRadius: 10,
        hoverBackgroundColor: "#FF9248",
      },
    ],
  };

  // Cấu hình biểu đồ
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            size: 14,
            family: "'Segoe UI', 'Roboto', 'Helvetica', sans-serif",
          },
          color: "#A3AED0", // Màu chữ trong chú giải
        },
      },
      title: {
        display: true,
        text: "Total Revenue by Quarter",
        font: {
          size: 18,
          weight: "bold",
        },
        color: "#4318FF", // Màu tiêu đề
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            // Format tooltip thành tiền tệ (VND)
            return `${context.dataset.label}: ${context.raw.toLocaleString(
              "vi-VN"
            )} VND`;
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
        grid: {
          display: false, // Không hiển thị lưới trục X
        },
        ticks: {
          font: {
            size: 14,
            weight: "500",
          },
          color: "#A3AED0", // Màu của nhãn trục X
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString("vi-VN") + " VND";
          },
          font: {
            size: 14,
          },
          color: "#CBD5E0", // Màu của nhãn trục Y
        },
        grid: {
          borderColor: "rgba(163, 174, 208, 0.3)",
          drawBorder: false,
          lineWidth: 1,
        },
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
    elements: {
      bar: {
        borderRadius: 10, // Bo góc cột
        barThickness: 40, // Độ rộng cột
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "700px",
        height: "400px",
        margin: "16px auto",
        padding: "24px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Bar data={data} options={options} />
    </div>
  );
};

export default RevenueChart;
