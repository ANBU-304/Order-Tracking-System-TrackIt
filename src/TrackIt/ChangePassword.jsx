import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
} from "lucide-react";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const rules = [
    { label: "At least 8 characters", ok: newPassword.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(newPassword) },
    { label: "Lowercase letter", ok: /[a-z]/.test(newPassword) },
    { label: "Number", ok: /[0-9]/.test(newPassword) },
    { label: "Special character", ok: /[!@#$%^&*]/.test(newPassword) },
  ];

  const validPassword = rules.every((r) => r.ok);
  const match = newPassword === confirmPassword && confirmPassword !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      alert("Enter current password");
      return;
    }

    if (!validPassword) {
      alert("Password does not meet requirements");
      return;
    }

    if (!match) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);

    alert("Password changed successfully");
    navigate("/profile");
  };

  return (
    <div style={styles.page}>
      <button onClick={() => navigate("/profile")} style={styles.back}>
        <ArrowLeft size={18} /> Back
      </button>

      <h2>Change Password</h2>

      <form onSubmit={handleSubmit} style={styles.card}>
        {/* Current */}
        <div style={styles.field}>
          <label>Current Password</label>
          <div style={styles.inputBox}>
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <span onClick={() => setShowCurrent(!showCurrent)}>
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
        </div>

        {/* New */}
        <div style={styles.field}>
          <label>New Password</label>
          <div style={styles.inputBox}>
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span onClick={() => setShowNew(!showNew)}>
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
        </div>

        {/* Confirm */}
        <div style={styles.field}>
          <label>Confirm Password</label>
          <div style={styles.inputBox}>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {confirmPassword && (
            <p style={{ color: match ? "green" : "red" }}>
              {match ? "Passwords match" : "Passwords do not match"}
            </p>
          )}
        </div>

        {/* Rules */}
        <div>
          {rules.map((r, i) => (
            <div key={i} style={styles.rule}>
              {r.ok ? (
                <CheckCircle2 size={16} color="green" />
              ) : (
                <X size={16} color="gray" />
              )}
              <span>{r.label}</span>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || !validPassword || !match}
          style={styles.submit}
        >
          {loading ? "Saving..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}

/* --------- SIMPLE INLINE STYLES --------- */
const styles = {
  page: {
    maxWidth: 420,
    margin: "40px auto",
    fontFamily: "Arial",
  },
  back: {
    marginBottom: 10,
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  card: {
    border: "1px solid #ddd",
    padding: 20,
    borderRadius: 8,
  },
  field: {
    marginBottom: 15,
  },
  inputBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  rule: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 14,
  },
  submit: {
    width: "100%",
    padding: 10,
    marginTop: 15,
    cursor: "pointer",
  },
};
