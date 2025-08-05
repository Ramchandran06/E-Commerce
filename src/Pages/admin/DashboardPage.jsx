import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  ListGroup,
  Badge,
} from "react-bootstrap";
import { FaRupeeSign, FaShoppingCart, FaBoxOpen } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import "./DashboardPage.css";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      if (loading) setLoading(true);

      const [statsRes, ordersRes, salesRes] = await Promise.all([
        axios.get("/api/dashboard/stats"),
        axios.get("/api/orders/admin/all", { params: { limit: 5 } }),
        axios.get("/api/orders/admin/sales-summary"),
      ]);

      setStats(statsRes.data);
      setRecentOrders(ordersRes.data.orders);

      const chartLabels = salesRes.data.map((d) =>
        new Date(d.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        })
      );
      const chartValues = salesRes.data.map((d) => d.totalSales);
      setSalesData({
        labels: chartLabels,
        datasets: [
          {
            label: "Daily Sales (₹)",
            data: chartValues,
            fill: true,
            borderColor: "#0d6efd",
            backgroundColor: "rgba(13, 110, 253, 0.2)",
            tension: 0.3,
          },
        ],
      });

      setError(null);
    } catch (err) {
      setError("Failed to fetch dashboard data. Please try again.");
      console.error("Dashboard Fetch Error:", err);
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const intervalId = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  // Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#ffffff" } },
      title: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "#adb5bd" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        ticks: { color: "#adb5bd" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="light" />
      </div>
    );
  if (error)
    return (
      <Alert variant="danger" className="m-4">
        {error}
      </Alert>
    );

  return (
    <div>
      <h1 className="text-white ">Dashboard</h1>
      <Row>
        <Col md={4}>
          <Link to="/admin/orders" className="dashboard-link">
            <Card bg="primary" text="white" className="mb-3 dashboard-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4>Total Sales</h4>
                    <h2>₹{stats.totalSales.toLocaleString("en-IN")}</h2>
                  </div>
                  <FaRupeeSign size={40} opacity={0.5} />
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={4}>
          <Link to="/admin/orders" className="dashboard-link">
            <Card bg="success" text="white" className="mb-3 dashboard-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4>Total Orders</h4>
                    <h2>{stats.totalOrders}</h2>
                  </div>
                  <FaShoppingCart size={40} opacity={0.5} />
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={4}>
          <Link to="/admin/products" className="dashboard-link">
            <Card bg="info" text="white" className="mb-3 dashboard-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4>Total Products</h4>
                    <h2>{stats.totalProducts}</h2>
                  </div>
                  <FaBoxOpen size={40} opacity={0.5} />
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col lg={8}>
          <Card className="bg-dark text-white h-100">
            <Card.Body>
              <Card.Title>Sales Over Time</Card.Title>
              {salesData && salesData.labels.length > 0 ? (
                <Line data={salesData} />
              ) : (
                <p>Not enough sales data to display a chart.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="bg-dark text-white h-100">
            <Card.Body>
              <Card.Title>Recent Orders</Card.Title>
              {recentOrders.length > 0 ? (
                <ListGroup variant="flush">
                  {recentOrders.map((order) => (
                    <ListGroup.Item
                      key={order.OrderID}
                      className="bg-dark text-white d-flex justify-content-between align-items-center px-0"
                    >
                      <div>
                        <Link to="/admin/orders" className="dashboard-link">
                          Order #{order.OrderID}
                        </Link>
                        <br />
                        <small className="text-muted">
                          by {order.Username}
                        </small>
                      </div>
                      <Badge bg="secondary" pill>
                        ₹{Number(order.TotalPrice).toLocaleString("en-IN")}
                      </Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p>No recent orders found.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
