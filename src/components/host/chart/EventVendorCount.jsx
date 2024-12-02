import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactECharts from "echarts-for-react";

const EventVendorCount = ({ hostId }) => {
  const [eventData, setEventData] = useState([]);
  const [vendorUsernames, setVendorUsernames] = useState({}); // Lưu trữ thông tin username của các vendor

  useEffect(() => {
    // Fetch data from the /vendorinevent/countevents API
    axios
      .get(`https://esmpbe.id.vn/api/vendorinevent/countevents/${hostId}`)
      .then((response) => {
        const vendorEvents = response.data.eventCount;

        // Step 1: Group by eventId and count the vendors for each event
        const eventCounts = vendorEvents.reduce((acc, event) => {
          const { eventId, vendorId } = event;
          if (!acc[eventId]) {
            acc[eventId] = { vendorIds: new Set() }; // Use Set to ensure unique vendors
          }

          // Add the vendorId to the set for this eventId
          acc[eventId].vendorIds.add(vendorId);

          return acc;
        }, {});

        // Step 2: Convert the data into a format suitable for the chart
        const formattedEventData = Object.keys(eventCounts).map((eventId) => ({
          eventId,
          vendorCount: eventCounts[eventId].vendorIds.size, // The size of the Set gives the unique vendor count
          vendorIds: Array.from(eventCounts[eventId].vendorIds),
        }));

        setEventData(formattedEventData);

        // Step 3: Fetch vendor usernames based on vendorIds
        const vendorIds = formattedEventData
          .flatMap((event) => event.vendorIds)
          .filter((value, index, self) => self.indexOf(value) === index); // Unique vendorIds

        const vendorRequests = vendorIds.map((vendorId) =>
          axios.get(`https://esmpbe.id.vn/api/vendor/${vendorId}`)
        );

        // Fetch all vendor usernames at once
        Promise.all(vendorRequests)
          .then((responses) => {
            const newVendorUsernames = responses.reduce((acc, response) => {
              const vendor = response.data;
              acc[vendor.vendorid] = vendor.username; // Save vendor username by vendorId
              return acc;
            }, {});

            setVendorUsernames(newVendorUsernames); // Set all vendor usernames
          })
          .catch((error) => {
            console.error("Error fetching vendor usernames:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching vendor events:", error);
      });
  }, [hostId]);

  // Prepare chart options
  const getChartOptions = () => {
    return {
      title: {
        text: "Events with Most Vendors",
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
        formatter: (params) => {
          const event = params[0];
          const eventId = event.name;
          const vendorCount = event.value;

          const vendorList = eventData
            .find((data) => data.eventId === eventId)
            .vendorIds.map(
              (vendorId) => vendorUsernames[vendorId] || "Unknown Vendor"
            )
            .join(", ");

          return `
            Event ID: ${eventId}<br />
            Number of Vendors: ${vendorCount}<br />
            Vendors: ${vendorList}
          `;
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
        data: eventData.map((data) => data.eventId),
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
          name: "Number of Vendors",
          type: "bar",
          data: eventData.map((data) => data.vendorCount),
          itemStyle: {
            color: "#8884d8",
          },
        },
      ],
    };
  };

  return (
    <div style={{ width: "100%", height: "400px", marginTop: "20px" }}>
      <h2>Events with the Most Vendors</h2>
      <ReactECharts
        option={getChartOptions()}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
};

export default EventVendorCount;
