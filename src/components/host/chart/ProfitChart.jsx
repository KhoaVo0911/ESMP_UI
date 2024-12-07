import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Box, Text, VStack, Container } from '@chakra-ui/react';

const ProfitDashboard = () => {
  const [eventData, setEventData] = useState([]);

  useEffect(() => {
    // Retrieve hostId and accessToken from sessionStorage
    const hostId = sessionStorage.getItem('hostId');
    const accessToken = sessionStorage.getItem('accessToken');

    if (!hostId || !accessToken) {
      console.error('hostId or accessToken is missing!');
      return;
    }

    // Example API call to fetch data
    const fetchData = async () => {
      try {
        const response = await fetch(`https://esmpbe.id.vn/api/event/profit/${hostId}`, {
          method: 'GET',
          headers: {
            'Authorization': `${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        console.log(data); // Check the structure of the data
        setEventData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Prepare chart option only if eventData is available
  const chartOption = {
    title: {
      text: 'Event Profits',
      left: "center",
      top: "20",
      textStyle: {
        fontSize: 24,
        color: "#1B2559",
        fontWeight: "bold",
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      top: 100,
      bottom: 180,
      left: 200,
      
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} VNĐ'
      }
    },
    yAxis: {
      type: 'category',
      data: eventData.length > 0 ? eventData.map(item => item.eventName) : [],
      axisLabel: {
        rotate: 0
      }
    },
    series: [
      {
        name: 'Profit',
        type: 'bar',
        data: eventData.length > 0 ? eventData.map(item => item.profit) : [],
        label: {
          show: true,
          position: 'right',  // Move labels to the right
        //   formatter: '{c} VNĐ'  // Add VNĐ after the profit value
        }
      }
    ]
  };

  return (
    <Container maxW="container.xl" p={10}>
      <VStack align="center" spacing={5}>
        <Box width="90%" height="600px">
          {eventData.length > 0 ? (
            <ReactECharts option={chartOption} style={{ height: '800px' }} />
          ) : (
            <Text>No event data available</Text>
          )}
        </Box>
      </VStack>
    </Container>
  );
};

export default ProfitDashboard;
