import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Container, Spinner, Alert, AlertIcon, Text } from "@chakra-ui/react";

const BarChart = () => {
  const [hostData, setHostData] = useState(null);
  const [transactionData, setTransactionData] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");

    if (accessToken) {
      // Fetch host data
      fetch("https://esmpbe.id.vn/api/host", {
        method: "GET",
        headers: {
          Authorization: `${accessToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Unable to fetch host information.");
          }
          return response.json();
        })
        .then((hostList) => {
          if (hostList && hostList.length > 0) {
            setHostData(hostList);
            return fetch("https://esmpbe.id.vn/api/transactionpackage", {
              method: "GET",
              headers: {
                Authorization: `${accessToken}`,
              },
            });
          } else {
            throw new Error("No hosts found.");
          }
        })
        .then((response) => response.json())
        .then((transactions) => {
          setTransactionData(transactions);
          return fetch("https://esmpbe.id.vn/api/package", {
            method: "GET",
            headers: {
              Authorization: `${accessToken}`,
            },
          });
        })
        .then((response) => response.json())
        .then((packages) => {
          setPackages(packages);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setError("No access token found.");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Container centerContent>
        <Spinner size="xl" />
        <Text mt={4}>Loading data...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container centerContent>
        <Alert status="error" borderRadius="md" mt={4}>
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  // Process data for bar chart
  const hostExpenseMap = {};

  transactionData.forEach((transaction) => {
    const hostInfo = hostData.find(
      (host) => host.hostid === transaction.hostid
    );
    const packageInfo = packages.find(
      (pkg) => pkg.id === transaction.packageid
    );

    const hostName = hostInfo ? hostInfo.account.name : "Unknown";
    const price = packageInfo ? parseFloat(packageInfo.price) : 0;

    if (hostExpenseMap[hostName]) {
      hostExpenseMap[hostName] += price;
    } else {
      hostExpenseMap[hostName] = price;
    }
  });

  // Get the top 5 hosts by total spending
  const sortedHosts = Object.keys(hostExpenseMap)
    .map((hostName) => ({
      hostName,
      totalSpent: hostExpenseMap[hostName],
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  const chartData = {
    labels: sortedHosts.map((host) => host.hostName),
    values: sortedHosts.map((host) => host.totalSpent),
  };

  const option = {
    title: {
      text: "Top 5 Hosts by Spending",
      left: "center",
      top: "20px",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: chartData.labels,
      axisLabel: {
        rotate: 45,
        interval: 0,
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: chartData.values,
        type: "bar",
        itemStyle: {
          color: "#4CAF50",
        },
      },
    ],
  };

  return (
    // <Container
    //   maxW="100%"
    //   backgroundColor="white"
    //   borderRadius="md"
    //   boxShadow="lg"
    //   p={5}
    // >
    <ReactECharts option={option} style={{ height: "400px", width: "100%" }} />
    // </Container>
  );
};

export default BarChart;
