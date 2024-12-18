import React, { useEffect, useState, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Text } from "@chakra-ui/react";
import axios from "axios";

Chart.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const chartRef = useRef(null);

  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});

  useEffect(() => {
    // Retrieve vendorId and hostId from sessionStorage
    const vendorId = sessionStorage.getItem("vendorId");
    const hostId = sessionStorage.getItem("hostId");

    if (vendorId && hostId) {
      // Fetch product data by vendorId
      axios
        .get(`https://esmpbe.id.vn/api/product/${vendorId}`)
        .then((response) => {
          setProductData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching product data:", error);
        });

      // Fetch category data by hostId
      axios
        .get(`https://esmpbe.id.vn/api/category/host/${hostId}`)
        .then((response) => {
          setCategoryData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching category data:", error);
        });
    }
  }, []);

  // Calculate the product count per category
  useEffect(() => {
    if (productData.length && categoryData.length) {
      const counts = categoryData.reduce((acc, category) => {
        // Filter products by categoryId and sum up their count
        const productsInCategory = productData.filter(
          (product) => product.categoryId === category.categoryId
        );
        const totalCount = productsInCategory.reduce(
          (sum, product) => sum + product.count,
          0
        );
        acc[category.categoryId] = totalCount;
        return acc;
      }, {});

      setCategoryCounts(counts);
    }
  }, [productData, categoryData]);

  // Generate random color
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Generate a consistent set of random colors for each category
  const colors = categoryData.map(() => getRandomColor());

  // Prepare data for the pie chart
  const chartData = {
    labels: categoryData.map((category) => category.categoryName),
    datasets: [
      {
        data: categoryData.map(
          (category) => categoryCounts[category.categoryId] || 0
        ),
        backgroundColor: colors,
        hoverBackgroundColor: colors, // Ensure hover color matches background color
      },
    ],
  };

  // Calculate the total quantity
  const totalQuantity = Object.values(categoryCounts).reduce(
    (acc, value) => acc + value,
    0
  );

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "right", // Move labels to the right
        align: "right", // Center the labels
      },
      tooltip: {
        enabled: true,
      },
    },
    cutout: "50%", // Create space in the middle of the chart
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
        <Text
          fontSize="22px"
          fontWeight="700"
          mb={4}
          color="var(--chakra-colors-secondaryGray-900)"
          style={{ textAlign: "center" }}
        >
          Best Seller Product Categories
        </Text>
        <Pie data={chartData} options={chartOptions} ref={chartRef} />
        <div
          style={{
            position: "absolute",
            left: "24%", // Adjusted to center
            top: "54%",  // Adjusted to center
            transform: "translate(-20%, -50%)", // Centering transform
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
