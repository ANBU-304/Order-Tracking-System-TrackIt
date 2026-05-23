// src/components/SupportPortal.jsx

import { useState, useEffect } from "react";
import {
  Search,
  Phone,
  Mail,
  User,
  Edit,
  Save,
  Clock,
  MapPin,
  Lock,
  Package,
  Loader2,
  Navigation,
  CheckCircle,
  Truck,
  History,
  Copy,
  ExternalLink,
  Send,
  Printer,
  Download,
  AlertTriangle,
  X,
  Headphones,
  Box,
  ClipboardList,
  Timer,
  IndianRupee,
  Zap,
  ChevronRight,
  Sparkles,
  Shield,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { Separator } from "./ui/Separator";
import { Layout } from "./Layout";
import orderService from "../services/orderService";
import { toast } from "sonner";

// Status configurations
const STATUS_CONFIG = {
  order_placed: {
    color: "bg-blue-100 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
    icon: ClipboardList,
    label: "Order Placed",
  },
  processing: {
    color: "bg-violet-100 text-violet-700 border border-violet-200",
    dot: "bg-violet-500",
    icon: Box,
    label: "Processing",
  },
  shipped: {
    color: "bg-indigo-100 text-indigo-700 border border-indigo-200",
    dot: "bg-indigo-500",
    icon: Package,
    label: "Shipped",
  },
  in_transit: {
    color: "bg-cyan-100 text-cyan-700 border border-cyan-200",
    dot: "bg-cyan-500",
    icon: Truck,
    label: "In Transit",
  },
  out_for_delivery: {
    color: "bg-amber-100 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
    icon: Navigation,
    label: "Out for Delivery",
  },
  delivered: {
    color: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    icon: CheckCircle,
    label: "Delivered",
  },
  exception: {
    color: "bg-red-100 text-red-700 border border-red-200",
    dot: "bg-red-500",
    icon: AlertTriangle,
    label: "Exception",
  },
  returned: {
    color: "bg-slate-100 text-slate-700 border border-slate-200",
    dot: "bg-slate-400",
    icon: Package,
    label: "Returned",
  },
};

export function SupportPortal() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [orderLocation, setOrderLocation] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [internalNotes, setInternalNotes] = useState([]);
  const [newInternalNote, setNewInternalNote] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeTab, setActiveTab] = useState("notes");

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) setRecentSearches(JSON.parse(saved).slice(0, 5));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s" && isEditing) {
        e.preventDefault();
        handleSaveStatus();
      }
      if (e.key === "Escape" && isEditing) setIsEditing(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditing]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    setLoading(true);
    try {
      const orders = await orderService.searchOrders(searchQuery);
      if (orders && orders.length > 0) {
        const order = orders[0];
        setSelectedOrder(order);
        setOrderStatus(order.status || "in_transit");
        setOrderLocation(order.location || "");
        setInternalNotes([]);

        const updatedSearches = [
          {
            query: searchQuery,
            orderId: order.orderId,
            timestamp: new Date().toISOString(),
          },
          ...recentSearches.filter((s) => s.query !== searchQuery),
        ].slice(0, 5);
        setRecentSearches(updatedSearches);
        localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
        toast.success("Order found!");
      } else {
        toast.error("No orders found");
        setSelectedOrder(null);
      }
    } catch (error) {
      toast.error(error.message || "Failed to search orders");
      setSelectedOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder) return;
    setLoading(true);
    try {
      const updatedOrder = {
        ...selectedOrder,
        status: orderStatus,
        location: orderLocation,
        scanTime: new Date().toISOString(),
      };
      const result = await orderService.updateOrder(
        selectedOrder.orderId,
        updatedOrder
      );
      setSelectedOrder(result);
      setIsEditing(false);
      toast.success("Order updated successfully!");
    } catch (error) {
      toast.error("Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  const handleAddInternalNote = () => {
    if (!newInternalNote.trim()) return;
    setInternalNotes([
      {
        id: Date.now().toString(),
        agent: "Agent (You)",
        timestamp: new Date().toLocaleString(),
        note: newInternalNote,
      },
      ...internalNotes,
    ]);
    setNewInternalNote("");
    toast.success("Note added");
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";

  const formatDateTime = (d) =>
    d
      ? new Date(d).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

  const formatTimeAgo = (d) => {
    if (!d) return "";
    const diff = Date.now() - new Date(d);
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const day = Math.floor(diff / 86400000);
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${day}d ago`;
  };

  const handleExportOrder = () => {
    if (!selectedOrder) return;
    const blob = new Blob(
      [
        JSON.stringify(
          {
            orderId: selectedOrder.orderId,
            status: orderStatus,
            location: orderLocation,
            notes: internalNotes,
            exportedAt: new Date().toISOString(),
          },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `order-${selectedOrder.orderId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported");
  };

  const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status];
    if (!cfg) return null;
    const Icon = cfg.icon;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${cfg.color}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        <Icon className="w-3 h-3" />
        {cfg.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Layout />

      <main className="flex-1 overflow-auto">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-slate-100 px-6 lg:px-8 py-4 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
                <Headphones className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">
                  Support Portal
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Agent Dashboard
                </p>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-400">
              {[
                { keys: ["Ctrl", "K"], label: "Search" },
                { keys: ["Ctrl", "S"], label: "Save" },
                { keys: ["Esc"], label: "Cancel" },
              ].map((sc, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  {sc.keys.map((k) => (
                    <kbd
                      key={k}
                      className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-600"
                    >
                      {k}
                    </kbd>
                  ))}
                  <span className="text-slate-400">{sc.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Card */}
          <div className="mb-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-slate-900 via-slate-700 to-yellow-400" />
              <div className="p-5">
                <div className="flex flex-col lg:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="search-input"
                      type="text"
                      placeholder="Search by Order ID, Email, or Phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      disabled={loading}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-yellow-400 font-bold text-sm rounded-xl transition-all shadow-sm disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Search Order
                      </>
                    )}
                  </button>
                </div>

                {/* Recent Searches */}
                {recentSearches.length > 0 && !selectedOrder && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <History className="w-3 h-3" />
                      Recent Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => setSearchQuery(s.query)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-bold text-slate-600 transition-colors"
                        >
                          <Clock className="w-3 h-3 text-slate-400" />
                          {s.query}
                          <span className="text-slate-400 font-normal">
                            {formatTimeAgo(s.timestamp)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {selectedOrder ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* ── LEFT COLUMN ── */}
              <div className="lg:col-span-2 space-y-5">
                {/* Order Details Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="h-1 w-full bg-yellow-400" />
                  <div className="p-6">
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Package className="w-4 h-4 text-slate-400" />
                          <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                            Order Details
                          </h2>
                        </div>
                        <p className="text-xs text-slate-400 font-mono">
                          #{selectedOrder.orderId}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleExportOrder}
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-all"
                          title="Export"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => window.print()}
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-all"
                          title="Print"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {!isEditing ? (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setIsEditing(false)}
                              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleSaveStatus}
                              disabled={loading}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-yellow-400 text-xs font-bold transition-all"
                            >
                              {loading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Save className="w-3.5 h-3.5" />
                              )}
                              Save
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status & Location */}
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                          Status
                        </p>
                        {isEditing ? (
                          <Select
                            value={orderStatus}
                            onValueChange={setOrderStatus}
                          >
                            <SelectTrigger className="bg-white border-slate-200 rounded-lg h-9 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(STATUS_CONFIG).map(
                                ([key, cfg]) => (
                                  <SelectItem key={key} value={key}>
                                    <span className="flex items-center gap-2">
                                      <cfg.icon className="w-3.5 h-3.5" />
                                      {cfg.label}
                                    </span>
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        ) : (
                          <StatusBadge status={orderStatus} />
                        )}
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                          Location
                        </p>
                        {isEditing ? (
                          <input
                            value={orderLocation}
                            onChange={(e) => setOrderLocation(e.target.value)}
                            placeholder="Enter location..."
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="text-sm font-bold text-slate-900 truncate">
                              {orderLocation || "N/A"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        {
                          icon: Package,
                          label: "Order ID",
                          value: selectedOrder.orderId,
                          mono: true,
                          copy: true,
                        },
                        {
                          icon: Clock,
                          label: "Est. Delivery",
                          value: formatDate(selectedOrder.estimatedDeliveryDate),
                        },
                        {
                          icon: Timer,
                          label: "Last Updated",
                          value: formatDateTime(selectedOrder.scanTime),
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-100"
                        >
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <item.icon className="w-3.5 h-3.5 text-slate-400" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                              {item.label}
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`text-xs font-bold text-slate-900 truncate ${item.mono ? "font-mono" : ""}`}
                            >
                              {item.value}
                            </p>
                            {item.copy && (
                              <button
                                onClick={() =>
                                  copyToClipboard(item.value, item.label)
                                }
                                className="text-slate-300 hover:text-slate-600 transition-colors flex-shrink-0"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* GPS */}
                    {selectedOrder.latitude && selectedOrder.longitude && (
                      <div className="mt-3">
                        <button
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps?q=${selectedOrder.latitude},${selectedOrder.longitude}`,
                              "_blank"
                            )
                          }
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-yellow-400 hover:bg-yellow-50 text-sm font-bold text-slate-500 hover:text-yellow-600 transition-all group"
                        >
                          <MapPin className="w-4 h-4 group-hover:text-yellow-500" />
                          View on Google Maps
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes Section */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="h-1 w-full bg-slate-900" />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                          Internal Notes
                        </h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Private · Support team only
                        </p>
                      </div>
                    </div>

                    {/* Note Input */}
                    <div className="mb-4">
                      <textarea
                        value={newInternalNote}
                        onChange={(e) => setNewInternalNote(e.target.value)}
                        placeholder="Add a private note for the support team..."
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none transition-all"
                      />
                      <button
                        onClick={handleAddInternalNote}
                        className="mt-2 flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-xs font-black rounded-lg transition-all"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        Add Note
                      </button>
                    </div>

                    <Separator className="bg-slate-100 mb-4" />

                    {/* Notes List */}
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {internalNotes.length === 0 ? (
                        <div className="text-center py-10">
                          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Lock className="w-5 h-5 text-slate-300" />
                          </div>
                          <p className="text-sm font-bold text-slate-400">
                            No notes yet
                          </p>
                          <p className="text-xs text-slate-300 mt-1">
                            Add a note above to get started
                          </p>
                        </div>
                      ) : (
                        internalNotes.map((note) => (
                          <div
                            key={note.id}
                            className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center">
                                  <User className="w-3 h-3 text-yellow-400" />
                                </div>
                                <span className="text-xs font-black text-slate-900">
                                  {note.agent}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {note.timestamp}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 whitespace-pre-wrap pl-8">
                              {note.note}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── RIGHT COLUMN ── */}
              <div className="space-y-5">
                {/* Customer Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="h-1 w-full bg-gradient-to-r from-slate-900 to-slate-700" />
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-4 h-4 text-slate-400" />
                      <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                        Customer
                      </h2>
                    </div>

                    {/* Avatar */}
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                      <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-yellow-400 font-black text-lg flex-shrink-0">
                        {selectedOrder.customerName?.charAt(0)?.toUpperCase() || (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-sm text-slate-900 truncate">
                          {selectedOrder.customerName || "Customer"}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {selectedOrder.email}
                        </p>
                      </div>
                    </div>

                    {/* Contact Items */}
                    <div className="space-y-2">
                      {[
                        {
                          icon: Mail,
                          label: "Email",
                          value: selectedOrder.email,
                          href: `mailto:${selectedOrder.email}`,
                          show: true,
                        },
                        {
                          icon: Phone,
                          label: "Phone",
                          value: selectedOrder.phonenumber,
                          href: `tel:${selectedOrder.phonenumber}`,
                          show: !!selectedOrder.phonenumber,
                        },
                      ]
                        .filter((c) => c.show)
                        .map((contact, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 transition-colors group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <contact.icon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                  {contact.label}
                                </p>
                                <p className="text-xs font-bold text-slate-900 truncate">
                                  {contact.value}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() =>
                                  copyToClipboard(contact.value, contact.label)
                                }
                                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                              <a
                                href={contact.href}
                                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Quick Contact Buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <a
                        href={`mailto:${selectedOrder.email}`}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-yellow-400 text-xs font-black transition-all"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Email
                      </a>
                      {selectedOrder.phonenumber && (
                        <a
                          href={`tel:${selectedOrder.phonenumber}`}
                          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-slate-200 hover:border-slate-900 hover:bg-slate-50 text-slate-700 text-xs font-black transition-all"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Call
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                {(selectedOrder.amount || selectedOrder.deliveryCharge) && (
                  <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-sm">
                    <div className="h-1 w-full bg-yellow-400" />
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <IndianRupee className="w-4 h-4 text-yellow-400" />
                        <h2 className="text-sm font-black text-white uppercase tracking-tight">
                          Order Summary
                        </h2>
                      </div>

                      <div className="space-y-2.5">
                        {[
                          { label: "Subtotal", value: selectedOrder.amount || 0 },
                          {
                            label: "Delivery",
                            value: selectedOrder.deliveryCharge || 0,
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm text-slate-400">
                              {item.label}
                            </span>
                            <span className="text-sm font-bold text-white">
                              ₹{item.value}
                            </span>
                          </div>
                        ))}

                        <div className="h-px bg-slate-700 my-3" />

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-black text-yellow-400 uppercase tracking-tight">
                            Total
                          </span>
                          <span className="text-xl font-black text-yellow-400">
                            ₹
                            {(selectedOrder.amount || 0) +
                              (selectedOrder.deliveryCharge || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Address */}
                {selectedOrder.deliveryAddress && (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                          Delivery Address
                        </h2>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {selectedOrder.deliveryAddress}
                      </p>
                      {selectedOrder.latitude && selectedOrder.longitude && (
                        <button
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps?q=${selectedOrder.latitude},${selectedOrder.longitude}`,
                              "_blank"
                            )
                          }
                          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 hover:border-slate-900 hover:bg-slate-50 text-xs font-bold text-slate-600 hover:text-slate-900 transition-all"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          Open in Maps
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ── EMPTY STATE ── */
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-slate-900 via-slate-700 to-yellow-400" />
              <div className="py-20 px-6 text-center">
                {/* Icon */}
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center shadow-2xl shadow-slate-200 mx-auto">
                    <Search className="w-10 h-10 text-yellow-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-slate-900" />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">
                  Search for an Order
                </h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto mb-8 font-medium">
                  Enter an Order ID, Email, or Phone Number to view and manage
                  customer orders
                </p>

                {/* Live Indicators */}
                <div className="flex items-center justify-center gap-6 mb-10">
                  {[
                    { color: "bg-yellow-400", label: "Real-time Search" },
                    { color: "bg-emerald-400", label: "Live Tracking" },
                    { color: "bg-blue-400", label: "Email Support" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${item.color} animate-pulse`}
                      />
                      <span className="text-xs font-bold text-slate-400">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  {[
                    {
                      icon: Package,
                      color: "bg-yellow-400",
                      title: "Track Orders",
                      desc: "View real-time status and location",
                    },
                    {
                      icon: Mail,
                      color: "bg-blue-500",
                      title: "Contact Customers",
                      desc: "Email and call customers directly",
                    },
                    {
                      icon: Edit,
                      color: "bg-emerald-500",
                      title: "Update Status",
                      desc: "Modify order status instantly",
                    },
                  ].map((f, i) => (
                    <div
                      key={i}
                      className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-left group hover:border-slate-200 hover:shadow-sm transition-all"
                    >
                      <div
                        className={`w-10 h-10 ${f.color} rounded-xl flex items-center justify-center mb-3`}
                      >
                        <f.icon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-sm font-black text-slate-900 mb-1">
                        {f.title}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium">
                        {f.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default SupportPortal;