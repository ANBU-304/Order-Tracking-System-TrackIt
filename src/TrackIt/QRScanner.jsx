// src/components/QRScanner.jsx

import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  Camera, CheckCircle, XCircle, RefreshCw,
  Loader2, X, MapPin, Clock, Package,
  AlertTriangle, Wifi, History, Trash2
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const ORDER_API = "http://localhost:9092/api/orders";

const STATUS_OPTIONS = [
  { value: "order_placed",     label: "Order Placed",     color: "bg-blue-100 text-blue-700 border-blue-200",     dot: "bg-blue-500" },
  { value: "processing",       label: "Processing",       color: "bg-violet-100 text-violet-700 border-violet-200", dot: "bg-violet-500" },
  { value: "shipped",          label: "Shipped",          color: "bg-indigo-100 text-indigo-700 border-indigo-200", dot: "bg-indigo-500" },
  { value: "in_transit",       label: "In Transit",       color: "bg-cyan-100 text-cyan-700 border-cyan-200",      dot: "bg-cyan-500" },
  { value: "out_for_delivery", label: "Out for Delivery", color: "bg-amber-100 text-amber-700 border-amber-200",   dot: "bg-amber-500" },
  { value: "delivered",        label: "Delivered",        color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  { value: "exception",        label: "Exception",        color: "bg-red-100 text-red-700 border-red-200",         dot: "bg-red-500" },
  { value: "returned",         label: "Returned",         color: "bg-slate-100 text-slate-700 border-slate-200",   dot: "bg-slate-400" },
];

export function QRScanner() {
  const [scanning, setScanning]             = useState(false);
  const [processing, setProcessing]         = useState(false);
  const [result, setResult]                 = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("in_transit");
  const [currentTime, setCurrentTime]       = useState(new Date());
  const [location, setLocation]             = useState("Fetching...");
  const [latitude, setLatitude]             = useState(null);
  const [longitude, setLongitude]           = useState(null);
  const [locationReady, setLocationReady]   = useState(false);
  const [scanHistory, setScanHistory]       = useState([]);
  const [lastScanned, setLastScanned]       = useState(null);

  const scannerRef   = useRef(null);
  const locationRef  = useRef({ location: "Unknown", latitude: null, longitude: null });
  const processingRef = useRef(false); // prevent duplicate scans

  // ── Clock ──────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // ── Auto GPS on mount ──────────────────────────────────
  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = () => {
    setLocationReady(false);
    setLocation("Fetching location...");

    if (!navigator.geolocation) {
      setLocation("Not supported");
      setLocationReady(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lng);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await res.json();
          const city  = data.address?.city || data.address?.town || data.address?.village || data.address?.county || "Unknown";
          const state = data.address?.state || "";
          const full  = `${city}${state ? ", " + state : ""}`;

          setLocation(full);
          locationRef.current = { location: full, latitude: lat, longitude: lng };
        } catch {
          const fallback = `${lat}, ${lng}`;
          setLocation(fallback);
          locationRef.current = { location: fallback, latitude: lat, longitude: lng };
        }

        setLocationReady(true);
      },
      () => {
        setLocation("Location denied");
        locationRef.current = { location: "Unknown", latitude: null, longitude: null };
        setLocationReady(true);
        toast.error("Allow location access for GPS tracking");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // ── Start Scanner ──────────────────────────────────────
  const startScanner = () => {
    setScanning(true);
    setResult(null);

    setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true,
        },
        false
      );

      scanner.render(
        async (decodedText) => {
          // ✅ Prevent duplicate rapid scans
          if (processingRef.current) return;
          if (lastScanned === decodedText) {
            const now = Date.now();
            if (now - (scannerRef.lastScanTime || 0) < 3000) return;
          }

          processingRef.current = true;
          scannerRef.lastScanTime = Date.now();
          setLastScanned(decodedText);

          await autoUpdateMongoDB(decodedText);

          // Allow next scan after 3 seconds
          setTimeout(() => {
            processingRef.current = false;
          }, 3000);
        },
        () => {} // ignore frame errors
      );

      scannerRef.current = scanner;
    }, 150);
  };

  // ── Stop Scanner ───────────────────────────────────────
  const stopScanner = () => {
    scannerRef.current?.clear().catch(console.error);
    setScanning(false);
    processingRef.current = false;
  };

  // ── AUTO UPDATE MongoDB ────────────────────────────────
  const autoUpdateMongoDB = async (raw) => {
    // Parse order ID from QR
    let orderId = raw.trim();
    try {
      const parsed = JSON.parse(raw);
      orderId = parsed.orderId || parsed.id || raw;
    } catch {}

    setProcessing(true);
    setResult(null);

    const scanTime = new Date();
    const { location: loc, latitude: lat, longitude: lng } = locationRef.current;
    const token = localStorage.getItem("token");

    try {
      // ✅ Call your backend API - auto update
      const response = await axios.put(
        `${ORDER_API}/${orderId}/status`,
        {
          status:    selectedStatus,
          location:  loc || "QR Scan",
          latitude:  lat,
          longitude: lng,
          scanTime:  scanTime.toISOString(),
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "application/json",
          },
        }
      );

      const successResult = {
        success:   true,
        orderId,
        status:    selectedStatus,
        location:  loc,
        latitude:  lat,
        longitude: lng,
        scanTime:  scanTime.toLocaleString("en-IN"),
        timestamp: Date.now(),
      };

      setResult(successResult);
      setScanHistory(prev => [successResult, ...prev].slice(0, 15));
      toast.success(`✅ ${orderId} → ${STATUS_OPTIONS.find(s => s.value === selectedStatus)?.label}`);

    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Update failed";

      const failResult = {
        success:   false,
        orderId,
        error:     errMsg,
        timestamp: Date.now(),
      };

      setResult(failResult);
      setScanHistory(prev => [failResult, ...prev].slice(0, 15));
      toast.error(`❌ ${orderId}: ${errMsg}`);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => () => stopScanner(), []);

  const statusConfig = STATUS_OPTIONS.find(s => s.value === selectedStatus);

  // ════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Top Header ── */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center">
              <Camera className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white uppercase tracking-tight leading-none">
                QR Scanner
              </h1>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                Auto Update MongoDB
              </p>
            </div>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded-full border border-slate-700">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">
              Live
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">

        {/* ── System Info Bar ── */}
        <div className="grid grid-cols-2 gap-3">
          {/* Time */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Current Time
              </p>
            </div>
            <p className="text-sm font-black text-slate-900">
              {currentTime.toLocaleTimeString("en-IN", {
                hour: "2-digit", minute: "2-digit", second: "2-digit"
              })}
            </p>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">
              {currentTime.toLocaleDateString("en-IN", {
                day: "2-digit", month: "short", year: "numeric"
              })}
            </p>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Location
                </p>
              </div>
              <button
                onClick={fetchLocation}
                className="text-slate-300 hover:text-yellow-500 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {locationReady ? (
              <>
                <p className="text-sm font-black text-slate-900 truncate">{location}</p>
                {latitude && (
                  <p className="text-[9px] font-mono text-slate-400 truncate mt-0.5">
                    {latitude}, {longitude}
                  </p>
                )}
              </>
            ) : (
              <div className="flex items-center gap-1.5 mt-1">
                <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
                <p className="text-[10px] text-slate-400 font-bold">Detecting...</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Status Selector ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-yellow-400" />
          <div className="p-4">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
              Step 1 — Select Status to Apply on Scan
            </p>

            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedStatus(opt.value)}
                  className={`flex items-center gap-2 py-2.5 px-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-wider transition-all ${
                    selectedStatus === opt.value
                      ? "border-slate-900 bg-slate-900 text-yellow-400"
                      : `border-transparent ${opt.color} hover:border-current`
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    selectedStatus === opt.value ? "bg-yellow-400" : opt.dot
                  }`} />
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Preview */}
            <div className="mt-3 flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Will Apply:
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border ${statusConfig?.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig?.dot}`} />
                {statusConfig?.label}
              </span>
            </div>
          </div>
        </div>

        {/* ── Camera / Scanner ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-slate-900" />
          <div className="p-4">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
              Step 2 — Point Camera at QR Code
            </p>

            {!scanning ? (
              <button
                onClick={startScanner}
                className="w-full py-5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-yellow-400 font-black text-sm uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Camera className="w-5 h-5" />
                Open Camera
              </button>
            ) : (
              <div className="space-y-3">

                {/* Status bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {processing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-yellow-500" />
                        <span className="text-[10px] font-black text-yellow-600 uppercase tracking-wider">
                          Updating MongoDB...
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                          Scanning...
                        </span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={stopScanner}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 hover:text-red-500 text-slate-500 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Camera feed */}
                <div
                  id="qr-reader"
                  className={`w-full rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    processing
                      ? "border-yellow-400 opacity-60"
                      : "border-slate-100"
                  }`}
                />

                {/* Processing overlay */}
                {processing && (
                  <div className="flex items-center justify-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <Loader2 className="w-4 h-4 animate-spin text-yellow-600" />
                    <p className="text-xs font-black text-yellow-700 uppercase tracking-wider">
                      Saving to MongoDB...
                    </p>
                  </div>
                )}

                <button
                  onClick={stopScanner}
                  className="w-full py-2.5 border-2 border-slate-200 hover:border-red-400 hover:bg-red-50 text-slate-500 hover:text-red-500 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-3.5 h-3.5" />
                  Stop Camera
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Result Card ── */}
        {result && (
          <div className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition-all ${
            result.success ? "border-emerald-400" : "border-red-400"
          }`}>
            <div className={`h-1 w-full ${result.success ? "bg-emerald-400" : "bg-red-400"}`} />
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  result.success ? "bg-emerald-100" : "bg-red-100"
                }`}>
                  {result.success
                    ? <CheckCircle className="w-5 h-5 text-emerald-600" />
                    : <XCircle className="w-5 h-5 text-red-500" />
                  }
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-black uppercase tracking-tight ${
                    result.success ? "text-emerald-700" : "text-red-600"
                  }`}>
                    {result.success ? "MongoDB Updated!" : "Update Failed"}
                  </p>
                  <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                    {result.orderId}
                  </p>
                </div>

                {result.success && (
                  <span className={`ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border flex-shrink-0 ${statusConfig?.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig?.dot}`} />
                    {statusConfig?.label}
                  </span>
                )}
              </div>

              {/* Success details */}
              {result.success && (
                <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  {[
                    { label: "Order ID",  value: result.orderId },
                    { label: "Status",    value: STATUS_OPTIONS.find(s => s.value === result.status)?.label },
                    { label: "Location",  value: result.location },
                    { label: "GPS",       value: result.latitude ? `${result.latitude}, ${result.longitude}` : "N/A" },
                    { label: "Scan Time", value: result.scanTime },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between gap-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase flex-shrink-0">
                        {row.label}
                      </span>
                      <span className="text-[9px] font-bold text-slate-900 truncate text-right">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Error message */}
              {!result.success && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600 font-medium">{result.error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Scan History ── */}
        {scanHistory.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="h-1 w-full bg-slate-200" />
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <History className="w-3.5 h-3.5 text-slate-400" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Scan History ({scanHistory.length})
                  </p>
                </div>
                <button
                  onClick={() => setScanHistory([])}
                  className="flex items-center gap-1 text-[9px] font-black text-slate-300 hover:text-red-500 uppercase tracking-wider transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {scanHistory.map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border ${
                      item.success
                        ? "bg-emerald-50 border-emerald-100"
                        : "bg-red-50 border-red-100"
                    }`}
                  >
                    {item.success
                      ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      : <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                    }
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-black text-slate-900 font-mono truncate">
                        {item.orderId}
                      </p>
                      <p className={`text-[9px] font-medium truncate ${
                        item.success ? "text-emerald-600" : "text-red-500"
                      }`}>
                        {item.success
                          ? STATUS_OPTIONS.find(s => s.value === item.status)?.label
                          : item.error
                        }
                      </p>
                    </div>
                    <span className="text-[8px] font-bold text-slate-300 flex-shrink-0">
                      {new Date(item.timestamp).toLocaleTimeString("en-IN", {
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QRScanner;