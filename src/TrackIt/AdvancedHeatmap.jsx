// src/components/AdvancedHeatmap.jsx

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import {
  Layers,
  MapPin,
  Thermometer,
  Maximize2,
  Minimize2,
  Search,
  Filter,
  RefreshCw,
  Download,
  Navigation,
  ZoomIn,
  ZoomOut,
  Target,
  BarChart3,
  Package,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X,
  ChevronDown,
  ChevronUp,
  Crosshair,
} from "lucide-react";

// ─── Fix default marker icons ─────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ─── Status Configuration ─────────────────────────────────────
const STATUS_CONFIG = {
  DELIVERED: {
    color: "#22c55e",
    bgColor: "#dcfce7",
    textColor: "#166534",
    label: "Delivered",
  },
  delivered: {
    color: "#22c55e",
    bgColor: "#dcfce7",
    textColor: "#166534",
    label: "Delivered",
  },
  IN_TRANSIT: {
    color: "#f59e0b",
    bgColor: "#fef3c7",
    textColor: "#92400e",
    label: "In Transit",
  },
  OUT_FOR_DELIVERY: {
    color: "#3b82f6",
    bgColor: "#dbeafe",
    textColor: "#1e40af",
    label: "Out for Delivery",
  },
  EXCEPTION: {
    color: "#ef4444",
    bgColor: "#fee2e2",
    textColor: "#991b1b",
    label: "Exception",
  },
  PENDING: {
    color: "#8b5cf6",
    bgColor: "#ede9fe",
    textColor: "#5b21b6",
    label: "Pending",
  },
  DEFAULT: {
    color: "#64748b",
    bgColor: "#f1f5f9",
    textColor: "#475569",
    label: "Unknown",
  },
};

// ─── Tile Layers Configuration ────────────────────────────────
const TILE_LAYERS = {
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    name: "Street",
    icon: "🗺️",
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    name: "Satellite",
    icon: "🛰️",
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    name: "Dark",
    icon: "🌙",
  },
  terrain: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    name: "Terrain",
    icon: "⛰️",
  },
  light: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    name: "Light",
    icon: "☀️",
  },
};

// ─── Region Presets (India focused) ───────────────────────────
const REGION_PRESETS = [
  { name: "All India", center: [20.5937, 78.9629], zoom: 5 },
  { name: "North India", center: [28.6139, 77.209], zoom: 6 },
  { name: "South India", center: [13.0827, 80.2707], zoom: 6 },
  { name: "West India", center: [19.076, 72.8777], zoom: 6 },
  { name: "East India", center: [22.5726, 88.3639], zoom: 6 },
  { name: "Central India", center: [23.2599, 77.4126], zoom: 6 },
  { name: "Northeast", center: [26.2006, 92.9376], zoom: 7 },
];

// ─── Heatmap Gradients ────────────────────────────────────────
const HEATMAP_GRADIENTS = {
  default: {
    0.0: "#0f172a",
    0.2: "#1e40af",
    0.4: "#3b82f6",
    0.6: "#22c55e",
    0.8: "#facc15",
    1.0: "#ef4444",
  },
  thermal: {
    0.0: "#000000",
    0.25: "#0000ff",
    0.5: "#00ff00",
    0.75: "#ffff00",
    1.0: "#ff0000",
  },
  viridis: {
    0.0: "#440154",
    0.25: "#3b528b",
    0.5: "#21918c",
    0.75: "#5ec962",
    1.0: "#fde725",
  },
  plasma: {
    0.0: "#0d0887",
    0.25: "#6a00a8",
    0.5: "#b12a90",
    0.75: "#e16462",
    1.0: "#fca636",
  },
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const AdvancedHeatmap = ({
  data = [],
  height = "500px",
  showControls = true,
  showLegend = true,
  showStats = true,
  enableSearch = true,
  enableFullscreen = true,
  enableExport = true,
  onMarkerClick = null,
  onRegionChange = null,
  initialCenter = [20.5937, 78.9629],
  initialZoom = 5,
  className = "",
}) => {
  // ─── Refs ───────────────────────────────────────────────────
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const heatLayerRef = useRef(null);
  const markersLayerRef = useRef(null);
  const tileLayerRef = useRef(null);
  const containerRef = useRef(null);

  // ─── State ──────────────────────────────────────────────────
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [mapStyle, setMapStyle] = useState("street");
  const [heatmapGradient, setHeatmapGradient] = useState("default");
  const [heatmapRadius, setHeatmapRadius] = useState(30);
  const [heatmapBlur, setHeatmapBlur] = useState(20);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showRegions, setShowRegions] = useState(false);
  const [showStatistics, setShowStatistics] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(initialZoom);

  // ─── Computed / Filtered Data ───────────────────────────────
  const filteredData = useMemo(() => {
    let result = data.filter(
      (point) =>
        point.latitude !== null &&
        point.latitude !== undefined &&
        point.longitude !== null &&
        point.longitude !== undefined
    );

    if (selectedStatuses.length > 0) {
      result = result.filter((point) =>
        selectedStatuses.includes(point.status)
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (point) =>
          point.location?.toLowerCase().includes(query) ||
          point.orderId?.toLowerCase().includes(query) ||
          point.status?.toLowerCase().includes(query) ||
          point.carrier?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [data, selectedStatuses, searchQuery]);

  // ─── Statistics ─────────────────────────────────────────────
  const statistics = useMemo(() => {
    const stats = {
      total: filteredData.length,
      delivered: 0,
      inTransit: 0,
      outForDelivery: 0,
      exceptions: 0,
      pending: 0,
      other: 0,
      totalOrders: 0,
      avgOrdersPerLocation: 0,
    };

    filteredData.forEach((point) => {
      const status = point.status?.toUpperCase();
      stats.totalOrders += point.orderCount || 1;

      switch (status) {
        case "DELIVERED":
          stats.delivered++;
          break;
        case "IN_TRANSIT":
          stats.inTransit++;
          break;
        case "OUT_FOR_DELIVERY":
          stats.outForDelivery++;
          break;
        case "EXCEPTION":
          stats.exceptions++;
          break;
        case "PENDING":
          stats.pending++;
          break;
        default:
          stats.other++;
      }
    });

    stats.avgOrdersPerLocation =
      stats.total > 0 ? (stats.totalOrders / stats.total).toFixed(1) : 0;

    return stats;
  }, [filteredData]);

  // ─── Unique statuses for filter ─────────────────────────────
  const availableStatuses = useMemo(() => {
    const statuses = new Set(data.map((point) => point.status).filter(Boolean));
    return Array.from(statuses);
  }, [data]);

  // ─── Initialize Map ─────────────────────────────────────────
  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: false,
        attributionControl: true,
      });

      tileLayerRef.current = L.tileLayer(TILE_LAYERS[mapStyle].url, {
        attribution: TILE_LAYERS[mapStyle].attribution,
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);

      mapInstanceRef.current.on("zoomend", () => {
        setCurrentZoom(mapInstanceRef.current.getZoom());
      });

      mapInstanceRef.current.on("moveend", () => {
        onRegionChange?.(mapInstanceRef.current.getBounds());
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // ─── Update Tile Layer ──────────────────────────────────────
  useEffect(() => {
    if (mapInstanceRef.current && tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
      tileLayerRef.current = L.tileLayer(TILE_LAYERS[mapStyle].url, {
        attribution: TILE_LAYERS[mapStyle].attribution,
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
      tileLayerRef.current.setZIndex(0);
    }
  }, [mapStyle]);

  // ─── Update Heatmap & Markers ───────────────────────────────
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    setIsLoading(true);

    if (heatLayerRef.current) {
      mapInstanceRef.current.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    }

    if (filteredData.length === 0) {
      setIsLoading(false);
      return;
    }

    // Create heatmap points
    const heatPoints = filteredData.map((point) => [
      parseFloat(point.latitude),
      parseFloat(point.longitude),
      point.orderCount || 1,
    ]);

    const maxIntensity = Math.max(...heatPoints.map((p) => p[2]), 1);

    heatLayerRef.current = L.heatLayer(heatPoints, {
      radius: heatmapRadius,
      blur: heatmapBlur,
      maxZoom: 12,
      max: maxIntensity,
      gradient: HEATMAP_GRADIENTS[heatmapGradient],
    });

    if (showHeatmap) {
      heatLayerRef.current.addTo(mapInstanceRef.current);
    }

    // Create markers with Leaflet popup only
    filteredData.forEach((point) => {
      const lat = parseFloat(point.latitude);
      const lng = parseFloat(point.longitude);
      const statusConfig = STATUS_CONFIG[point.status] || STATUS_CONFIG.DEFAULT;

      const customIcon = L.divIcon({
        className: "custom-marker-icon",
        html: `
          <div style="
            background-color: ${statusConfig.color};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
          "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Simple popup content
      const popupContent = `
        <div style="font-family: system-ui, sans-serif; min-width: 200px;">
          <div style="
            background: #0f172a;
            color: white;
            padding: 10px 12px;
            margin: -10px -10px 10px -10px;
            border-radius: 4px 4px 0 0;
            font-weight: 600;
            font-size: 13px;
          ">
            📍 ${point.location || "Unknown Location"}
          </div>
          <div style="padding: 0 4px 4px 4px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #64748b; font-size: 12px;">Order ID</span>
              <span style="font-weight: 600; font-size: 12px;">${point.orderId || "N/A"}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="color: #64748b; font-size: 12px;">Status</span>
              <span style="
                background: ${statusConfig.bgColor};
                color: ${statusConfig.textColor};
                padding: 3px 10px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
              ">${statusConfig.label}</span>
            </div>
            ${point.carrier ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #64748b; font-size: 12px;">Carrier</span>
                <span style="font-size: 12px;">${point.carrier}</span>
              </div>
            ` : ""}
            ${(point.orderCount || 1) > 1 ? `
              <div style="
                background: #fef3c7;
                color: #92400e;
                padding: 6px 10px;
                border-radius: 6px;
                text-align: center;
                font-size: 12px;
                font-weight: 600;
                margin-top: 8px;
              ">📦 ${point.orderCount} orders here</div>
            ` : ""}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 280,
        className: "custom-leaflet-popup",
      });

      // Optional callback on click
      if (onMarkerClick) {
        marker.on("click", () => onMarkerClick(point));
      }

      markersLayerRef.current.addLayer(marker);
    });

    // Fit bounds
    if (filteredData.length > 0) {
      try {
        const bounds = L.latLngBounds(
          filteredData.map((p) => [parseFloat(p.latitude), parseFloat(p.longitude)])
        );
        mapInstanceRef.current.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 12,
        });
      } catch (error) {
        console.warn("Could not fit bounds:", error);
      }
    }

    setIsLoading(false);
  }, [filteredData, showHeatmap, heatmapGradient, heatmapRadius, heatmapBlur]);

  // ─── Toggle Heatmap ─────────────────────────────────────────
  useEffect(() => {
    if (!mapInstanceRef.current || !heatLayerRef.current) return;

    if (showHeatmap) {
      if (!mapInstanceRef.current.hasLayer(heatLayerRef.current)) {
        heatLayerRef.current.addTo(mapInstanceRef.current);
      }
    } else {
      if (mapInstanceRef.current.hasLayer(heatLayerRef.current)) {
        mapInstanceRef.current.removeLayer(heatLayerRef.current);
      }
    }
  }, [showHeatmap]);

  // ─── Toggle Markers ─────────────────────────────────────────
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    if (showMarkers) {
      if (!mapInstanceRef.current.hasLayer(markersLayerRef.current)) {
        markersLayerRef.current.addTo(mapInstanceRef.current);
      }
    } else {
      if (mapInstanceRef.current.hasLayer(markersLayerRef.current)) {
        mapInstanceRef.current.removeLayer(markersLayerRef.current);
      }
    }
  }, [showMarkers]);

  // ─── Fullscreen Handler ─────────────────────────────────────
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  }, []);

  // ─── Map Controls ───────────────────────────────────────────
  const handleZoomIn = useCallback(() => mapInstanceRef.current?.zoomIn(), []);
  const handleZoomOut = useCallback(() => mapInstanceRef.current?.zoomOut(), []);
  const handleResetView = useCallback(() => {
    mapInstanceRef.current?.setView(initialCenter, initialZoom);
  }, [initialCenter, initialZoom]);

  const handleLocateUser = useCallback(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.locate({ setView: true, maxZoom: 12 });
    mapInstanceRef.current.on("locationfound", (e) => {
      L.marker(e.latlng)
        .addTo(mapInstanceRef.current)
        .bindPopup("📍 You are here")
        .openPopup();
    });
  }, []);

  const handleGoToRegion = useCallback((region) => {
    mapInstanceRef.current?.setView(region.center, region.zoom);
    setShowRegions(false);
  }, []);

  const handleStatusToggle = useCallback((status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedStatuses([]);
    setSearchQuery("");
  }, []);

  // ─── Export ─────────────────────────────────────────────────
  const handleExportJSON = useCallback(() => {
    const exportData = filteredData.map((p) => ({
      orderId: p.orderId,
      location: p.location,
      latitude: p.latitude,
      longitude: p.longitude,
      status: p.status,
      orderCount: p.orderCount || 1,
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `heatmap-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredData]);

  const handleExportCSV = useCallback(() => {
    const headers = ["Order ID", "Location", "Latitude", "Longitude", "Status", "Order Count"];
    const rows = filteredData.map((p) => [
      p.orderId || "",
      p.location || "",
      p.latitude,
      p.longitude,
      p.status || "",
      p.orderCount || 1,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `heatmap-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredData]);

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div
      ref={containerRef}
      className={`relative bg-slate-100 rounded-xl overflow-hidden ${className}`}
      style={{ height: isFullscreen ? "100vh" : height }}
    >
      {/* Styles */}
      <style>{`
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          padding: 0;
        }
        .custom-leaflet-popup .leaflet-popup-content {
          margin: 10px;
        }
        .custom-marker-icon {
          background: transparent !important;
          border: none !important;
        }
      `}</style>

      {/* Loading */}
      {isLoading && (
        <div className="absolute inset-0 z-[2000] bg-white/80 flex items-center justify-center">
          <RefreshCw className="w-8 h-8 animate-spin text-slate-600" />
        </div>
      )}

      {/* No Data */}
      {!isLoading && filteredData.length === 0 && (
        <div className="absolute inset-0 z-[500] bg-white/90 flex items-center justify-center">
          <div className="text-center px-6">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium mb-3">No data available</p>
            {(selectedStatuses.length > 0 || searchQuery) && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Top Controls */}
      {showControls && (
        <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-between pointer-events-none">
          {/* Left: Search & Filters */}
          <div className="flex flex-col gap-2 pointer-events-auto">
            {enableSearch && (
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-8 py-2 w-64 bg-white rounded-lg text-sm shadow-lg border-0 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shadow ${
                  showFilters || selectedStatuses.length > 0
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                Filter
                {selectedStatuses.length > 0 && (
                  <span className="bg-white text-slate-900 px-1.5 rounded-full text-[10px]">
                    {selectedStatuses.length}
                  </span>
                )}
              </button>

              {selectedStatuses.map((status) => {
                const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.DEFAULT;
                return (
                  <span
                    key={status}
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shadow"
                    style={{ backgroundColor: cfg.bgColor, color: cfg.textColor }}
                  >
                    {cfg.label}
                    <button onClick={() => handleStatusToggle(status)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>

            {showFilters && (
              <div className="bg-white rounded-lg shadow-xl p-3 w-64">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-sm text-slate-900">Status Filter</span>
                  {selectedStatuses.length > 0 && (
                    <button onClick={handleClearFilters} className="text-xs text-slate-500">
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  {availableStatuses.map((status) => {
                    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.DEFAULT;
                    const selected = selectedStatuses.includes(status);
                    const count = data.filter((d) => d.status === status).length;
                    return (
                      <button
                        key={status}
                        onClick={() => handleStatusToggle(status)}
                        className={`w-full flex justify-between items-center p-2 rounded-lg text-sm ${
                          selected ? "ring-2 ring-slate-900" : "hover:bg-slate-50"
                        }`}
                        style={{ backgroundColor: selected ? cfg.bgColor : undefined }}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: cfg.color }}
                          />
                          <span style={{ color: selected ? cfg.textColor : "#334155" }}>
                            {cfg.label}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 bg-slate-100 px-1.5 rounded">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col gap-2 items-end pointer-events-auto">
            <div className="flex gap-2">
              {/* Regions */}
              <div className="relative">
                <button
                  onClick={() => setShowRegions(!showRegions)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg shadow text-sm text-slate-700"
                >
                  <Navigation className="w-4 h-4" />
                  <span className="hidden sm:inline">Regions</span>
                  <ChevronDown className={`w-4 h-4 transition ${showRegions ? "rotate-180" : ""}`} />
                </button>
                {showRegions && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-xl py-1 z-10">
                    {REGION_PRESETS.map((r) => (
                      <button
                        key={r.name}
                        onClick={() => handleGoToRegion(r)}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                      >
                        {r.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Export */}
              {enableExport && (
                <div className="relative group">
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg shadow text-sm text-slate-700">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <button
                      onClick={handleExportJSON}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      JSON
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      CSV
                    </button>
                  </div>
                </div>
              )}

              {/* Fullscreen */}
              {enableFullscreen && (
                <button
                  onClick={toggleFullscreen}
                  className="p-2 bg-white rounded-lg shadow text-slate-700"
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
              )}
            </div>

            {/* Map Styles */}
            <div className="bg-white rounded-lg shadow p-1.5 flex gap-1">
              {Object.entries(TILE_LAYERS).map(([key, layer]) => (
                <button
                  key={key}
                  onClick={() => setMapStyle(key)}
                  className={`p-1.5 rounded text-sm ${
                    mapStyle === key ? "bg-slate-900 text-white" : "hover:bg-slate-100"
                  }`}
                  title={layer.name}
                >
                  {layer.icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Right Side Controls */}
      {showControls && (
        <div className="absolute top-1/2 right-4 -translate-y-1/2 z-[1000] flex flex-col gap-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <button onClick={handleZoomIn} className="p-2 hover:bg-slate-100 block border-b">
              <ZoomIn className="w-5 h-5 text-slate-700" />
            </button>
            <button onClick={handleZoomOut} className="p-2 hover:bg-slate-100 block">
              <ZoomOut className="w-5 h-5 text-slate-700" />
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <button onClick={handleResetView} className="p-2 hover:bg-slate-100 block border-b">
              <Target className="w-5 h-5 text-slate-700" />
            </button>
            <button onClick={handleLocateUser} className="p-2 hover:bg-slate-100 block">
              <Crosshair className="w-5 h-5 text-slate-700" />
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-1.5 space-y-1">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`w-full p-1.5 rounded flex justify-center ${
                showHeatmap ? "bg-orange-100 text-orange-700" : "text-slate-400 hover:bg-slate-100"
              }`}
            >
              <Thermometer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowMarkers(!showMarkers)}
              className={`w-full p-1.5 rounded flex justify-center ${
                showMarkers ? "bg-blue-100 text-blue-700" : "text-slate-400 hover:bg-slate-100"
              }`}
            >
              <MapPin className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`w-full p-1.5 rounded flex justify-center ${
                showSettings ? "bg-slate-900 text-white" : "text-slate-400 hover:bg-slate-100"
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-1/2 right-20 -translate-y-1/2 z-[1000] bg-white rounded-lg shadow-xl p-4 w-56">
          <div className="flex justify-between mb-3">
            <span className="font-semibold text-sm">Heatmap Settings</span>
            <button onClick={() => setShowSettings(false)} className="text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-600 mb-1.5 block">Gradient</label>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.keys(HEATMAP_GRADIENTS).map((g) => (
                  <button
                    key={g}
                    onClick={() => setHeatmapGradient(g)}
                    className={`p-1.5 rounded text-xs capitalize ${
                      heatmapGradient === g
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">Radius</span>
                <span className="text-slate-500">{heatmapRadius}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={heatmapRadius}
                onChange={(e) => setHeatmapRadius(Number(e.target.value))}
                className="w-full accent-slate-900"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">Blur</span>
                <span className="text-slate-500">{heatmapBlur}px</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={heatmapBlur}
                onChange={(e) => setHeatmapBlur(Number(e.target.value))}
                className="w-full accent-slate-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      {showStats && filteredData.length > 0 && (
        <>
          {showStatistics ? (
            <div className="absolute bottom-4 right-4 z-[1000] bg-white rounded-lg shadow-xl w-64 overflow-hidden">
              <div
                className="bg-slate-900 text-white px-3 py-2 flex justify-between items-center cursor-pointer"
                onClick={() => setShowStatistics(false)}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="font-medium text-sm">Statistics</span>
                </div>
                <ChevronUp className="w-4 h-4" />
              </div>
              <div className="p-3 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-50 rounded p-2 text-center">
                    <p className="text-lg font-bold">{statistics.total}</p>
                    <p className="text-[10px] text-slate-500">Locations</p>
                  </div>
                  <div className="bg-green-50 rounded p-2 text-center">
                    <p className="text-lg font-bold text-green-700">{statistics.delivered}</p>
                    <p className="text-[10px] text-green-600">Delivered</p>
                  </div>
                  <div className="bg-yellow-50 rounded p-2 text-center">
                    <p className="text-lg font-bold text-yellow-700">{statistics.inTransit}</p>
                    <p className="text-[10px] text-yellow-600">In Transit</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <StatusBar label="Delivered" count={statistics.delivered} total={statistics.total} color="#22c55e" />
                  <StatusBar label="In Transit" count={statistics.inTransit} total={statistics.total} color="#f59e0b" />
                  <StatusBar label="Exceptions" count={statistics.exceptions} total={statistics.total} color="#ef4444" />
                </div>
                <div className="pt-2 border-t text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Orders</span>
                    <span className="font-semibold">{statistics.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Zoom Level</span>
                    <span className="font-semibold">{currentZoom}x</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowStatistics(true)}
              className="absolute bottom-4 right-4 z-[1000] bg-white rounded-lg shadow px-3 py-2 flex items-center gap-2 text-sm text-slate-700"
            >
              <BarChart3 className="w-4 h-4" />
              Stats
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </>
      )}

      {/* Legend */}
      {showLegend && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-xl p-3 w-44">
          <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5" />
            Heat Intensity
          </p>
          <div
            className="w-full h-2.5 rounded-full mb-1"
            style={{
              background: `linear-gradient(to right, ${Object.values(HEATMAP_GRADIENTS[heatmapGradient]).join(", ")})`,
            }}
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Low</span>
            <span>High</span>
          </div>

          <div className="border-t mt-2.5 pt-2.5">
            <p className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Status
            </p>
            <div className="space-y-1">
              {Object.entries(STATUS_CONFIG)
                .filter(([k]) => !["DEFAULT", "delivered"].includes(k))
                .map(([k, v]) => (
                  <div key={k} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: v.color }} />
                    <span className="text-[10px] text-slate-600">{v.label}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" style={{ zIndex: 1 }} />
    </div>
  );
};

// ─── Status Bar Component ─────────────────────────────────────
const StatusBar = ({ label, count, total, color }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-0.5">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold">{count}</span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default AdvancedHeatmap;