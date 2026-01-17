import { Navigate } from "react-router-dom";

/* ---------------- MOCK LOGIN DATA ----------------
   Change role to test:
   "customer" | "admin" | "support"
-------------------------------------------------- */
const auth = {
  isAuthenticated: true,
  user: {
    name: "John Smith",
    role: "customer", // change role here
  },
};

export default function Dashboard() {
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = auth.user.role;

  if (role === "customer") return <CustomerDashboard />;
  if (role === "admin") return <AdminDashboard />;
  if (role === "support") return <SupportDashboard />;

  return <Navigate to="/login" replace />;
}

/* ---------------- CUSTOMER ---------------- */

function CustomerDashboard() {
  return (
    <Page title="📦 Customer Dashboard">
      <Card title="Active Orders">2 orders in transit</Card>
      <Card title="Delivered Orders">5 orders delivered</Card>
      <button style={styles.btn}>Track Order</button>
    </Page>
  );
}

/* ---------------- ADMIN ---------------- */

function AdminDashboard() {
  return (
    <Page title="🧑‍💼 Admin Dashboard">
      <Card title="Total Users">1,245</Card>
      <Card title="Total Orders">8,430</Card>
      <Card title="System Status">All systems operational</Card>
      <button style={styles.btn}>Manage System</button>
    </Page>
  );
}

/* ---------------- SUPPORT ---------------- */

function SupportDashboard() {
  return (
    <Page title="🛠 Support Agent Dashboard">
      <Card title="Open Tickets">12 pending tickets</Card>
      <Card title="Resolved Today">8 tickets resolved</Card>
      <button style={styles.btn}>View Tickets</button>
    </Page>
  );
}

/* ---------------- COMMON UI ---------------- */

function Page({ title, children }) {
  return (
    <div style={styles.page}>
      <h1>{title}</h1>
      {children}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    maxWidth: "600px",
    margin: "60px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  card: {
    padding: "15px",
    margin: "15px 0",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  btn: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
