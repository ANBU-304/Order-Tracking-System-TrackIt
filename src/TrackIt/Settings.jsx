import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Globe,
  Shield,
  Bell,
  Moon,
  Sun,
  Smartphone,
  Monitor,
  Save,
} from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    language: "en",
    region: "in",
    timezone: "Asia/Kolkata",
    theme: "light",
    autoUpdate: true,
    notifications: true,
    twoFactor: false,
    dataSharing: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    alert("✅ Settings saved successfully!");
  };

  const themes = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "auto", label: "Auto", icon: Monitor },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back */}
      <button
        onClick={() => navigate("/profile")}
        className="flex items-center gap-2 mb-4 text-gray-600 hover:text-blue-600"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Language & Region */}
      <Section icon={<Globe />} title="Language & Region">
        <Select
          label="Language"
          value={settings.language}
          onChange={(v) => setSettings({ ...settings, language: v })}
          options={[
            ["en", "English"],
            ["ta", "Tamil"],
            ["hi", "Hindi"],
          ]}
        />

        <Select
          label="Region"
          value={settings.region}
          onChange={(v) => setSettings({ ...settings, region: v })}
          options={[
            ["in", "India"],
            ["us", "USA"],
            ["uk", "UK"],
          ]}
        />
      </Section>

      {/* Appearance */}
      <Section icon={<Smartphone />} title="Appearance">
        <div className="grid grid-cols-3 gap-4">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setSettings({ ...settings, theme: t.id })}
              className={`border rounded-lg p-4 ${
                settings.theme === t.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <t.icon className="mx-auto mb-2" />
              {t.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Privacy */}
      <Section icon={<Shield />} title="Privacy & Security">
        <Toggle
          label="Two Factor Authentication"
          value={settings.twoFactor}
          onChange={() =>
            setSettings({ ...settings, twoFactor: !settings.twoFactor })
          }
        />
        <Toggle
          label="Data Sharing"
          value={settings.dataSharing}
          onChange={() =>
            setSettings({ ...settings, dataSharing: !settings.dataSharing })
          }
        />
      </Section>

      {/* Preferences */}
      <Section icon={<Bell />} title="App Preferences">
        <Toggle
          label="Automatic Updates"
          value={settings.autoUpdate}
          onChange={() =>
            setSettings({ ...settings, autoUpdate: !settings.autoUpdate })
          }
        />
        <Toggle
          label="Notifications"
          value={settings.notifications}
          onChange={() =>
            setSettings({ ...settings, notifications: !settings.notifications })
          }
        />
      </Section>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => navigate("/profile")}
          className="flex-1 border rounded-lg py-2"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 bg-blue-600 text-white rounded-lg py-2"
        >
          {isSaving ? "Saving..." : <><Save size={16} /> Save</>}
        </button>
      </div>
    </div>
  );
}

/* ---------- Helper Components ---------- */

function Section({ icon, title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 mb-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg p-2"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="flex justify-between items-center mb-3">
      <span>{label}</span>
      <button
        onClick={onChange}
        className={`w-12 h-6 rounded-full ${
          value ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <div
          className={`h-5 w-5 bg-white rounded-full transform ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
