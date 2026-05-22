// src/components/HeatmapComponent.jsx

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icons
const createCustomIcon = (status) => {
  const colors = {
    DELIVERED: "#10b981",
    IN_TRANSIT: "#f59e0b",
    PENDING: "#6366f1",
    CANCELLED: "#ef4444",
    DEFAULT: "#3b82f6",
  };

  const color = colors[status] || colors.DEFAULT;

  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 14px;
          font-weight: bold;
        ">📦</div>
      </div>
    `,
    className: "custom-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const HeatmapComponent = ({
  data = [],
  height = "500px",
  title = "Geographic Distribution",
  showControls = true,
  showLegend = true,
  showStats = true,
  defaultLayer = "both", // 'heatmap', 'markers', 'both'
  onMarkerClick,
  theme = "light",
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const heatLayerRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [activeLayer, setActiveLayer] = useState(defaultLayer);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [mapStyle, setMapStyle] = useState("streets");
  const [heatmapIntensity, setHeatmapIntensity] = useState(25);

  // Map tile layers
  const tileLayers = {
    streets: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "&copy; OpenStreetMap contributors",
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "&copy; Esri",
    },
    dark: {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution: "&copy; CartoDB",
    },
    light: {
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution: "&copy; CartoDB",
    },
  };

  // Calculate statistics
  const stats = {
    totalPoints: data.length,
    totalOrders: data.reduce((sum, p) => sum + (p.orderCount || 1), 0),
    delivered: data.filter((p) => p.status === "DELIVERED").length,
    inTransit: data.filter((p) => p.status === "IN_TRANSIT").length,
    pending: data.filter((p) => p.status === "PENDING").length,
  };

  // Initialize map
  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      const defaultCenter = [20.5937, 78.9629];
      const defaultZoom = 5;

      mapInstanceRef.current = L.map(mapRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        zoomControl: false,
      });

      // Add zoom control to top-right
      L.control.zoom({ position: "topright" }).addTo(mapInstanceRef.current);

      // Add initial tile layer
      L.tileLayer(tileLayers[mapStyle].url, {
        attribution: tileLayers[mapStyle].attribution,
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);

      setIsLoading(false);
    }
  }, []);

  // Update tile layer when style changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      L.tileLayer(tileLayers[mapStyle].url, {
        attribution: tileLayers[mapStyle].attribution,
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }
  }, [mapStyle]);

  // Update heatmap and markers
  useEffect(() => {
    if (!mapInstanceRef.current || !data || data.length === 0) return;

    // Remove existing layers
    if (heatLayerRef.current) {
      mapInstanceRef.current.removeLayer(heatLayerRef.current);
    }
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    }

    const validPoints = data.filter((p) => p.latitude && p.longitude);
    const heatPoints = validPoints.map((p) => [
      p.latitude,
      p.longitude,
      p.orderCount || 1,
    ]);

    if (heatPoints.length === 0) return;

    // Add heatmap layer
    if (activeLayer === "heatmap" || activeLayer === "both") {
      heatLayerRef.current = L.heatLayer(heatPoints, {
        radius: heatmapIntensity,
        blur: 20,
        maxZoom: 12,
        max: Math.max(...heatPoints.map((p) => p[2])),
        gradient: {
          0.0: "#1e3a5f",
          0.2: "#0ea5e9",
          0.4: "#22d3ee",
          0.6: "#fbbf24",
          0.8: "#f97316",
          1.0: "#dc2626",
        },
      }).addTo(mapInstanceRef.current);
    }

    // Add markers
    if (activeLayer === "markers" || activeLayer === "both") {
      validPoints.forEach((point) => {
        const marker = L.marker([point.latitude, point.longitude], {
          icon: createCustomIcon(point.status),
        });

        const popupContent = createPopupContent(point);
        marker.bindPopup(popupContent, {
          maxWidth: 320,
          className: "custom-popup",
        });

        marker.on("click", () => {
          setSelectedPoint(point);
          if (onMarkerClick) onMarkerClick(point);
        });

        markersLayerRef.current.addLayer(marker);
      });
    }

    // Fit bounds
    const bounds = L.latLngBounds(heatPoints.map((p) => [p[0], p[1]]));
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
  }, [data, activeLayer, heatmapIntensity]);

  // Create popup content
  const createPopupContent = (point) => {
    const statusColors = {
      DELIVERED: { bg: "#dcfce7", text: "#166534" },
      IN_TRANSIT: { bg: "#fef3c7", text: "#92400e" },
      PENDING: { bg: "#e0e7ff", text: "#3730a3" },
      CANCELLED: { bg: "#fee2e2", text: "#991b1b" },
    };

    const statusStyle = statusColors[point.status] || {
      bg: "#f1f5f9",
      text: "#475569",
    };

    return `
      <div class="popup-content">
        <div class="popup-header">
          <h3>${point.location || "Unknown Location"}</h3>
          <span class="popup-status" style="background: ${statusStyle.bg}; color: ${statusStyle.text};">
            ${point.status || "N/A"}
          </span>
        </div>
        <div class="popup-body">
          <div class="popup-row">
            <span class="popup-label">📋 Order ID</span>
            <span class="popup-value">${point.orderId || "N/A"}</span>
          </div>
          <div class="popup-row">
            <span class="popup-label">📍 Coordinates</span>
            <span class="popup-value">${point.latitude?.toFixed(4)}, ${point.longitude?.toFixed(4)}</span>
          </div>
          ${point.orderCount > 1 ? `
          <div class="popup-row highlight">
            <span class="popup-label">📦 Orders</span>
            <span class="popup-value">${point.orderCount} at this location</span>
          </div>
          ` : ""}
          ${point.customer ? `
          <div class="popup-row">
            <span class="popup-label">👤 Customer</span>
            <span class="popup-value">${point.customer}</span>
          </div>
          ` : ""}
          ${point.date ? `
          <div class="popup-row">
            <span class="popup-label">📅 Date</span>
            <span class="popup-value">${new Date(point.date).toLocaleDateString()}</span>
          </div>
          ` : ""}
        </div>
      </div>
    `;
  };

  // Control handlers
  const handleZoomToFit = useCallback(() => {
    if (mapInstanceRef.current && data.length > 0) {
      const validPoints = data.filter((p) => p.latitude && p.longitude);
      const bounds = L.latLngBounds(
        validPoints.map((p) => [p.latitude, p.longitude])
      );
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [data]);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 100);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className={`heatmap-container ${isFullscreen ? "fullscreen" : ""} ${theme}`}
      style={{ "--map-height": height }}
    >
      {/* Popup Styles */}
      <style>{`
        .heatmap-container {
          position: relative;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .heatmap-container.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          border-radius: 0;
        }
        
        .heatmap-container.dark {
          background: #1e293b;
          color: white;
        }

        .heatmap-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
        }

        .heatmap-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .heatmap-title h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .heatmap-title .icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .heatmap-title .subtitle {
          font-size: 13px;
          color: #94a3b8;
          margin-top: 2px;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 8px 12px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .action-btn.primary {
          background: #3b82f6;
          color: white;
        }

        .action-btn.primary:hover {
          background: #2563eb;
        }

        .action-btn.secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .action-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .stats-bar {
          display: flex;
          gap: 16px;
          padding: 12px 20px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          overflow-x: auto;
        }

        .heatmap-container.dark .stats-bar {
          background: #0f172a;
          border-color: #334155;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          min-width: fit-content;
        }

        .heatmap-container.dark .stat-item {
          background: #1e293b;
        }

        .stat-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .stat-icon.blue { background: #dbeafe; }
        .stat-icon.green { background: #dcfce7; }
        .stat-icon.yellow { background: #fef3c7; }
        .stat-icon.purple { background: #e0e7ff; }

        .stat-content .value {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }

        .heatmap-container.dark .stat-content .value {
          color: white;
        }

        .stat-content .label {
          font-size: 12px;
          color: #64748b;
        }

        .map-wrapper {
          position: relative;
        }

        .map-element {
          height: var(--map-height);
          width: 100%;
          z-index: 1;
        }

        .heatmap-container.fullscreen .map-element {
          height: calc(100vh - 140px);
        }

        .controls-panel {
          position: absolute;
          bottom: 20px;
          left: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 1000;
        }

        .control-group {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          padding: 8px;
          display: flex;
          gap: 4px;
        }

        .control-btn {
          padding: 10px 14px;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .control-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .control-btn.active {
          background: #3b82f6;
          color: white;
        }

        .legend-panel {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          padding: 16px;
          z-index: 1000;
          min-width: 160px;
        }

        .legend-title {
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 12px;
        }

        .legend-gradient {
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(90deg, #1e3a5f, #0ea5e9, #22d3ee, #fbbf24, #f97316, #dc2626);
          margin-bottom: 8px;
        }

        .legend-labels {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #64748b;
        }

        .legend-items {
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #475569;
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .intensity-slider {
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid #e2e8f0;
        }

        .intensity-slider label {
          font-size: 12px;
          color: #64748b;
          display: block;
          margin-bottom: 8px;
        }

        .intensity-slider input[type="range"] {
          width: 100%;
          height: 4px;
          border-radius: 2px;
          background: #e2e8f0;
          outline: none;
          -webkit-appearance: none;
        }

        .intensity-slider input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }

        .style-selector {
          margin-top: 12px;
          display: flex;
          gap: 4px;
        }

        .style-btn {
          flex: 1;
          padding: 6px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 11px;
          color: #64748b;
          transition: all 0.2s ease;
        }

        .style-btn.active {
          border-color: #3b82f6;
          background: #eff6ff;
          color: #3b82f6;
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid #e2e8f0;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text {
          margin-top: 16px;
          font-size: 14px;
          color: #64748b;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: var(--map-height);
          color: #64748b;
          text-align: center;
          padding: 40px;
        }

        .empty-state .icon {
          font-size: 64px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          color: #0f172a;
        }

        /* Custom popup styles */
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
          padding: 0;
          overflow: hidden;
        }

        .custom-popup .leaflet-popup-content {
          margin: 0;
          min-width: 280px;
        }

        .custom-popup .leaflet-popup-tip {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .popup-content {
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .popup-header {
          padding: 16px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .popup-header h3 {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
        }

        .popup-status {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .popup-body {
          padding: 12px 16px;
        }

        .popup-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .popup-row:last-child {
          border-bottom: none;
        }

        .popup-row.highlight {
          background: #fffbeb;
          margin: 8px -16px;
          padding: 12px 16px;
          border-bottom: none;
        }

        .popup-label {
          font-size: 12px;
          color: #64748b;
        }

        .popup-value {
          font-size: 12px;
          font-weight: 600;
          color: #0f172a;
        }

        .custom-marker {
          background: transparent !important;
          border: none !important;
        }

        @media (max-width: 768px) {
          .stats-bar {
            padding: 8px 12px;
            gap: 8px;
          }

          .stat-item {
            padding: 6px 12px;
          }

          .stat-icon {
            width: 28px;
            height: 28px;
            font-size: 12px;
          }

          .stat-content .value {
            font-size: 14px;
          }

          .legend-panel {
            bottom: auto;
            top: 10px;
            right: 10px;
            max-width: 140px;
          }

          .controls-panel {
            bottom: 10px;
            left: 10px;
          }

          .control-btn span {
            display: none;
          }
        }
      `}</style>

      {/* Header */}
      <div className="heatmap-header">
        <div className="heatmap-title">
          <div className="icon">🗺️</div>
          <div>
            <h2>{title}</h2>
            <div className="subtitle">
              {stats.totalPoints} locations • {stats.totalOrders} orders
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button className="action-btn secondary" onClick={handleZoomToFit}>
            <span>🎯</span>
            <span>Fit All</span>
          </button>
          <button
            className="action-btn secondary"
            onClick={handleToggleFullscreen}
          >
            <span>{isFullscreen ? "✕" : "⛶"}</span>
            <span>{isFullscreen ? "Exit" : "Fullscreen"}</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      {showStats && (
        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-icon blue">📍</div>
            <div className="stat-content">
              <div className="value">{stats.totalPoints}</div>
              <div className="label">Locations</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon green">✓</div>
            <div className="stat-content">
              <div className="value">{stats.delivered}</div>
              <div className="label">Delivered</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon yellow">🚚</div>
            <div className="stat-content">
              <div className="value">{stats.inTransit}</div>
              <div className="label">In Transit</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon purple">⏳</div>
            <div className="stat-content">
              <div className="value">{stats.pending}</div>
              <div className="label">Pending</div>
            </div>
          </div>
        </div>
      )}

      {/* Map Wrapper */}
      <div className="map-wrapper">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading map...</div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && data.length === 0 && (
          <div className="empty-state">
            <div className="icon">🗺️</div>
            <h3>No Location Data</h3>
            <p>Add orders with coordinates to see them on the map.</p>
          </div>
        )}

        {/* Map Element */}
        <div ref={mapRef} className="map-element" />

        {/* Controls Panel */}
        {showControls && data.length > 0 && (
          <div className="controls-panel">
            <div className="control-group">
              <button
                className={`control-btn ${activeLayer === "both" ? "active" : ""}`}
                onClick={() => setActiveLayer("both")}
              >
                <span>◐</span>
                <span>Both</span>
              </button>
              <button
                className={`control-btn ${activeLayer === "heatmap" ? "active" : ""}`}
                onClick={() => setActiveLayer("heatmap")}
              >
                <span>🌡️</span>
                <span>Heatmap</span>
              </button>
              <button
                className={`control-btn ${activeLayer === "markers" ? "active" : ""}`}
                onClick={() => setActiveLayer("markers")}
              >
                <span>📍</span>
                <span>Markers</span>
              </button>
            </div>
          </div>
        )}

        {/* Legend Panel */}
        {showLegend && data.length > 0 && (
          <div className="legend-panel">
            <div className="legend-title">Heat Intensity</div>
            <div className="legend-gradient"></div>
            <div className="legend-labels">
              <span>Low</span>
              <span>High</span>
            </div>

            <div className="legend-items">
              <div className="legend-item">
                <div
                  className="legend-dot"
                  style={{ background: "#10b981" }}
                ></div>
                <span>Delivered</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-dot"
                  style={{ background: "#f59e0b" }}
                ></div>
                <span>In Transit</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-dot"
                  style={{ background: "#6366f1" }}
                ></div>
                <span>Pending</span>
              </div>
            </div>

            <div className="intensity-slider">
              <label>Radius: {heatmapIntensity}px</label>
              <input
                type="range"
                min="10"
                max="50"
                value={heatmapIntensity}
                onChange={(e) => setHeatmapIntensity(Number(e.target.value))}
              />
            </div>

            <div className="style-selector">
              {Object.keys(tileLayers).map((style) => (
                <button
                  key={style}
                  className={`style-btn ${mapStyle === style ? "active" : ""}`}
                  onClick={() => setMapStyle(style)}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeatmapComponent;