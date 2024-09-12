import React, { useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Text } from "@chakra-ui/react";

Chart.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const chartRef = useRef(null);

  // Dữ liệu của biểu đồ
  const data = {
    labels: ["Coca", "Sushi", "Pizza", "Bánh mì", "Bún riêu", "Bún đậu"],
    datasets: [
      {
        data: [137, 188, 149, 197, 233, 155],
        backgroundColor: [
          "#6FD195",
          "#8979FF",
          "#FF928A",
          "#3CC3DF",
          "#FFAE4C",
          "#537FF1",
        ],
        hoverBackgroundColor: [
          "#6FD195",
          "#8979FF",
          "#FF928A",
          "#3CC3DF",
          "#FFAE4C",
          "#537FF1",
        ],
      },
    ],
  };

  // Tính tổng số lượng
  const totalQuantity = data.datasets[0].data.reduce(
    (acc, value) => acc + value,
    0
  );

  // Cấu hình tùy chọn
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "right", // Di chuyển label sang bên phải
        align: "right", // Căn giữa các label
        
      },
      tooltip: {
        enabled: true,
      },
    },
    cutout: "50%", // Tạo khoảng trống ở giữa biểu đồ
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ position: "relative", width: "450px" }}>
        {" "}
        {/* Tăng kích thước của biểu đồ */}
        <Text
          fontSize="22px"
          fontWeight="700"
          mb={4}
          color="var(--chakra-colors-secondaryGray-900)"
          style={{ textAlign: "center" }}
        >
          Best Seller Product Categories
        </Text>
        <Pie data={data} options={chartOptions} ref={chartRef} />
        <div
          style={{
            position: "absolute",
            left: "39%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          {totalQuantity}
        </div>
      </div>
    </div>
  );
};

export default PieChart;
