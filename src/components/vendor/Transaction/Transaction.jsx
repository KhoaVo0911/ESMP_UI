import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Table } from "antd";

const { Title, Text } = Typography;

const RevenueSummary = ({ totalRevenue, rejectedRevenue }) => {
  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={16}>
        <Col span={12}>
          <Card
            style={{
              backgroundColor: "#e6f7e6",
              borderRadius: "10px",
            }}
          >
            <Title level={4}>Total Revenue</Title>
            <Title
              level={2}
              style={{ color: "#52c41a", fontSize: "36px", fontWeight: "bold" }}
            >
              {totalRevenue.toLocaleString("vi-VN")} đ
            </Title>
            <Text type="secondary">as of 01-December 2022</Text>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            style={{
              backgroundColor: "#f5f5f5",
              borderRadius: "10px",
            }}
          >
            <Title level={4}>Rejected Payments</Title>
            <Title
              level={2}
              style={{ color: "#1890ff", fontSize: "36px", fontWeight: "bold" }}
            >
              {rejectedRevenue.toLocaleString("vi-VN")} đ
            </Title>
            <Text type="secondary">as of 01-December 2022</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const Transaction = () => {
  const data = [
    {
      key: "1",
      no: "1",
      orderID: "#15267",
      date: "Mar 1, 2023",
      shopName: "BBQ",
      quantity: 1,
      totalAmount: 140000,
      status: "Success",
    },
    {
      key: "2",
      no: "2",
      orderID: "#153587",
      date: "Jan 26, 2023",
      shopName: "BBQ",
      quantity: 1,
      totalAmount: 140000,
      status: "Success",
    },
    {
      key: "3",
      no: "3",
      orderID: "#12436",
      date: "Feb 12, 2033",
      shopName: "BBQ",
      quantity: 1,
      totalAmount: 140000,
      status: "Success",
    },
    {
      key: "4",
      no: "4",
      orderID: "#16879",
      date: "Feb 12, 2033",
      shopName: "BBQ",
      quantity: 1,
      totalAmount: 140000,
      status: "Success",
    },
    {
      key: "5",
      no: "5",
      orderID: "#16378",
      date: "Feb 28, 2033",
      shopName: "BBQ",
      quantity: 1,
      totalAmount: 140000,
      status: "Rejected",
    },
    {
      key: "6",
      no: "6",
      orderID: "#16609",
      date: "Mar 13, 2033",
      shopName: "BBQ",
      quantity: 1,
      totalAmount: 140000,
      status: "Success",
    },
    {
      key: "7",
      no: "7",
      orderID: "#16907",
      date: "Mar 18, 2033",
      shopName: "BBQ",
      quantity: 1,
      totalAmount: 140000,
      status: "Pending",
    },
    {
      key: "8",
      no: "8",
      orderID: "#17123",
      date: "Apr 1, 2033",
      shopName: "BBQ",
      quantity: 1,
      totalAmount: 140000,
      status: "Success",
    },
    {
      key: "9",
      no: "9",
      orderID: "#17456",
      date: "Apr 10, 2033",
      shopName: "BBQ",
      quantity: 1,
      totalAmount: 140000,
      status: "Rejected",
    },
    {
      key: "10",
      no: "10",
      orderID: "#17789",
      date: "Apr 20, 2033",
      shopName: "BBQ",
      quantity: 1,
      totalAmount: 140000,
      status: "Success",
    },
  ];

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [rejectedRevenue, setRejectedRevenue] = useState(0);

  useEffect(() => {
    // Tính tổng doanh thu
    const total = data.reduce((acc, curr) => acc + curr.totalAmount, 0);
    setTotalRevenue(total);

    // Tính tổng tiền bị từ chối
    const rejected = data
      .filter((item) => item.status === "Rejected")
      .reduce((acc, curr) => acc + curr.totalAmount, 0);
    setRejectedRevenue(rejected);
  }, []);

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "Order ID",
      dataIndex: "orderID",
      key: "orderID",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Shop Name",
      dataIndex: "shopName",
      key: "shopName",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `${amount.toLocaleString("vi-VN")} đ`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "green";
        if (status === "Rejected") color = "red";
        if (status === "Pending") color = "orange";
        return <span style={{ color }}>{status}</span>;
      },
    },
  ];

  return (
    <div>
      {/* Khối Revenue Summary nằm trên table */}
      <RevenueSummary
        totalRevenue={totalRevenue}
        rejectedRevenue={rejectedRevenue}
      />

      {/* Table */}
      <div style={{ padding: "20px" }}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default Transaction;
    