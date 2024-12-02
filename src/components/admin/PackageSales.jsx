import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactECharts from "echarts-for-react";

const PackageSales = () => {
  const [salesData, setSalesData] = useState([]);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    // Fetch transaction data
    axios
      .get("https://esmpbe.id.vn/api/transactionpackage")
      .then((response) => {
        const transactions = response.data;

        // Count sales for each package based on host purchases
        const packageSales = transactions.reduce((acc, transaction) => {
          const { packageid, hostid } = transaction;

          if (!acc[packageid]) {
            acc[packageid] = {
              packageid,
              totalSales: 0,
              hosts: new Set(),
            };
          }

          if (!acc[packageid].hosts.has(hostid)) {
            acc[packageid].totalSales += 1;
            acc[packageid].hosts.add(hostid);
          }

          return acc;
        }, {});

        // Prepare the formatted data for chart
        const formattedData = Object.keys(packageSales).map((packageid) => ({
          packageid,
          totalSales: packageSales[packageid].totalSales,
        }));

        setSalesData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching transaction data:", error);
      });

    // Fetch package data to get package names
    axios
      .get("https://esmpbe.id.vn/api/package")
      .then((response) => {
        setPackages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching package data:", error);
      });
  }, []);

  // Get package name by packageid
  const getPackageName = (packageid) => {
    const packageData = packages.find((pkg) => pkg.id === packageid);
    return packageData ? packageData.name : "Unknown Package";
  };

  // Chart options
  const getChartOptions = () => {
    return {
      title: {
        text: "Most Purchased Packages",
        left: "center",
        top: "20",
        textStyle: {
          fontSize: 18,
          color: "#1B2559",
          fontWeight: "bold",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: salesData.map((data) => getPackageName(data.packageid)),
        axisLabel: {
          interval: 0,
          rotate: 45,
        },
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Number of Purchases",
          type: "bar",
          data: salesData.map((data) => data.totalSales),
          itemStyle: {
            color: "#8884d8",
          },
        },
      ],
    };
  };

  return (
    <div style={{ width: "100%", height: "400px", marginTop: "20px" }}>
      <h2>Most Purchased Packages</h2>
      <ReactECharts
        option={getChartOptions()}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
};

export default PackageSales;
