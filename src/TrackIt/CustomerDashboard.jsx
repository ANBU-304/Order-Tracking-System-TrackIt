import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const orders = [
    {
      id: "ORD-001",
      status: "Out for Delivery",
      carrier: "FedEx",
      progress: 75,
      tracking: "TRK123456",
      items: "Electronics",
    },
    {
      id: "ORD-002",
      status: "Delivered",
      carrier: "UPS",
      progress: 100,
      tracking: "TRK654321",
      items: "Books",
    },
    {
      id: "ORD-003",
      status: "Exception",
      carrier: "DHL",
      progress: 30,
      tracking: "TRK987654",
      items: "Furniture",
    },
  ];

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.tracking.toLowerCase().includes(search.toLowerCase()) ||
      o.items.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <h1>My Orders</h1>
      <p>Track and manage your shipments</p>

      <input
        placeholder="Search orders..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      {filteredOrders.map((order) => (
        <div key={order.id} style={styles.card}>
          <h3>{order.id}</h3>
          <p><b>Items:</b> {order.items}</p>
          <p><b>Carrier:</b> {order.carrier}</p>
          <p><b>Status:</b> {order.status}</p>
          <p><b>Tracking:</b> {order.tracking}</p>

          <div style={styles.progressBg}>
            <div
              style={{
                ...styles.progressFill,
                width: `${order.progress}%`,
              }}
            />
          </div>

          <button
            style={styles.button}
            onClick={() => navigate(`/order/${order.tracking}`)}
          >
            View Details
          </button>
        </div>
      ))}

      <button style={styles.logout} onClick={() => navigate("/login")}>
        Logout
      </button>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    maxWidth: "700px",
    margin: "40px auto",
    fontFamily: "Arial, sans-serif",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "15px 0",
    fontSize: "16px",
  },
  card: {
    border: "1px solid #ccc",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "6px",
  },
  progressBg: {
    background: "#eee",
    height: "8px",
    borderRadius: "4px",
    margin: "8px 0",
  },
  progressFill: {
    background: "#2563eb",
    height: "8px",
    borderRadius: "4px",
  },
  button: {
    padding: "8px 12px",
    marginTop: "10px",
    cursor: "pointer",
  },
  logout: {
    marginTop: "20px",
    padding: "10px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};
