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
  MessageSquare,
  Copy,
  ExternalLink,
  RefreshCw,
  Send,
  Printer,
  Download,
  AlertTriangle,
  X,
  Check,
  Headphones,
  Box,
  ClipboardList,
  Calendar,
  Timer,
  IndianRupee,
  Zap
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/Select";
import { Separator } from "./ui/Separator";
import { Layout } from "./Layout";
import orderService from "../services/orderService";
import { toast } from "sonner";

// Status configurations
const STATUS_CONFIG = {
  order_placed: { 
    color: 'bg-blue-100 text-blue-800', 
    icon: ClipboardList, 
    label: 'Order Placed'
  },
  processing: { 
    color: 'bg-purple-100 text-purple-800', 
    icon: Box, 
    label: 'Processing'
  },
  shipped: { 
    color: 'bg-indigo-100 text-indigo-800', 
    icon: Package, 
    label: 'Shipped'
  },
  in_transit: { 
    color: 'bg-cyan-100 text-cyan-800', 
    icon: Truck, 
    label: 'In Transit'
  },
  out_for_delivery: { 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: Navigation, 
    label: 'Out for Delivery'
  },
  delivered: { 
    color: 'bg-green-100 text-green-800', 
    icon: CheckCircle, 
    label: 'Delivered'
  },
  exception: { 
    color: 'bg-red-100 text-red-800', 
    icon: AlertTriangle, 
    label: 'Exception'
  },
  returned: { 
    color: 'bg-slate-100 text-slate-800', 
    icon: Package, 
    label: 'Returned'
  }
};

// Quick reply templates for email
const QUICK_REPLIES = [
  {
    id: 1,
    title: "Delivery Update",
    subject: "Update on Your Order",
    message: "Dear Customer,\n\nYour package is currently in transit and expected to arrive by the estimated delivery date. You can track real-time updates using your tracking ID.\n\nThank you for your patience.\n\nBest regards,\nSupport Team"
  },
  {
    id: 2,
    title: "Delay Notification",
    subject: "Delivery Delay Notice",
    message: "Dear Customer,\n\nWe apologize for the delay in your delivery. Due to unforeseen circumstances, your package will arrive 1-2 days later than expected.\n\nWe appreciate your patience and understanding.\n\nBest regards,\nSupport Team"
  },
  {
    id: 3,
    title: "Address Confirmation",
    subject: "Please Confirm Your Delivery Address",
    message: "Dear Customer,\n\nPlease confirm your delivery address to ensure successful delivery. If you need to update the address, please reply to this email immediately.\n\nBest regards,\nSupport Team"
  },
  {
    id: 4,
    title: "Delivery Attempt Failed",
    subject: "Delivery Attempt Unsuccessful",
    message: "Dear Customer,\n\nOur delivery partner attempted delivery but was unable to reach you. Please ensure someone is available at the delivery address, or contact us to reschedule.\n\nBest regards,\nSupport Team"
  },
  {
    id: 5,
    title: "Order Delivered",
    subject: "Your Order Has Been Delivered",
    message: "Dear Customer,\n\nGreat news! Your order has been successfully delivered. We hope you enjoy your purchase.\n\nIf you have any questions or concerns, please don't hesitate to reach out.\n\nThank you for shopping with us!\n\nBest regards,\nSupport Team"
  }
];

export function SupportPortal() {
  // Core states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [orderLocation, setOrderLocation] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Notes & Messages states
  const [internalNotes, setInternalNotes] = useState([]);
  const [newInternalNote, setNewInternalNote] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  
  // Email states
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  
  // Tab state
  const [activeTab, setActiveTab] = useState('details');

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && isEditing) {
        e.preventDefault();
        handleSaveStatus();
      }
      if (e.key === 'Escape' && isEditing) {
        setIsEditing(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing]);

  /* ---------------- SEARCH HANDLER ---------------- */
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
        setEmailSubject("");
        setEmailMessage("");
        
        // Save to recent searches
        const updatedSearches = [
          { query: searchQuery, orderId: order.orderId, timestamp: new Date().toISOString() },
          ...recentSearches.filter(s => s.query !== searchQuery)
        ].slice(0, 5);
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
        
        toast.success("Order found!");
      } else {
        toast.error("No orders found");
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error(error.message || "Failed to search orders");
      setSelectedOrder(null);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UPDATE STATUS HANDLER ---------------- */
  const handleSaveStatus = async () => {
    if (!selectedOrder) return;

    setLoading(true);
    try {
      const updatedOrder = {
        ...selectedOrder,
        status: orderStatus,
        location: orderLocation,
        scanTime: new Date().toISOString()
      };

      const result = await orderService.updateOrder(selectedOrder.orderId, updatedOrder);
      setSelectedOrder(result);
      setIsEditing(false);
      
      toast.success("Order updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- ADD INTERNAL NOTE HANDLER ---------------- */
  const handleAddInternalNote = () => {
    if (!newInternalNote.trim()) return;

    setInternalNotes([
      {
        id: Date.now().toString(),
        agent: "Agent (You)",
        timestamp: new Date().toLocaleString(),
        note: newInternalNote
      },
      ...internalNotes
    ]);
    setNewInternalNote("");
    toast.success("Internal note added");
  };

  /* ---------------- SEND EMAIL TO CUSTOMER ---------------- */
  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      toast.error("Please enter subject and message");
      return;
    }

    if (!selectedOrder?.email) {
      toast.error("Customer email not available");
      return;
    }

    setSendingEmail(true);
    try {
      // Create mailto link and open email client
      const mailtoLink = `mailto:${selectedOrder.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailMessage)}`;
      window.open(mailtoLink, '_blank');
      
      // Add to internal notes for tracking
      setInternalNotes([
        {
          id: Date.now().toString(),
          agent: "Agent (You)",
          timestamp: new Date().toLocaleString(),
          note: `📧 Email sent to customer\nSubject: ${emailSubject}\n\n${emailMessage}`,
          type: 'email'
        },
        ...internalNotes
      ]);
      
      // Clear form
      setEmailSubject("");
      setEmailMessage("");
      setShowQuickReplies(false);
      
      toast.success("Email client opened with message");
    } catch (error) {
      console.error("Email error:", error);
      toast.error("Failed to open email client");
    } finally {
      setSendingEmail(false);
    }
  };

  /* ---------------- USE QUICK REPLY ---------------- */
  const handleUseQuickReply = (template) => {
    setEmailSubject(template.subject);
    setEmailMessage(template.message);
    setShowQuickReplies(false);
  };

  /* ---------------- COPY TO CLIPBOARD ---------------- */
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  /* ---------------- FORMAT DATE ---------------- */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  /* ---------------- EXPORT ORDER DATA ---------------- */
  const handleExportOrder = () => {
    if (!selectedOrder) return;
    
    const exportData = {
      orderId: selectedOrder.orderId,
      status: orderStatus,
      location: orderLocation,
      customer: {
        email: selectedOrder.email,
        phone: selectedOrder.phonenumber
      },
      notes: internalNotes,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order-${selectedOrder.orderId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Order data exported");
  };

  /* ---------------- PRINT ORDER ---------------- */
  const handlePrintOrder = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Layout />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <Headphones className="w-8 h-8 text-yellow-500" />
                    Support Agent Portal
                  </h1>
                  <p className="text-slate-500 mt-1">Manage customer orders and resolve issues efficiently</p>
                </div>
              </div>

              {/* Keyboard Shortcuts Hint */}
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">Ctrl</kbd>
                  <span>+</span>
                  <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">K</kbd>
                  <span className="ml-1">Search</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">Ctrl</kbd>
                  <span>+</span>
                  <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">S</kbd>
                  <span className="ml-1">Save</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">Esc</kbd>
                  <span className="ml-1">Cancel</span>
                </span>
              </div>
            </div>

            {/* Search Section */}
            <Card className="shadow-md border-slate-200 mb-6 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search Input */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="search-input"
                      placeholder="Search by Order ID, Email, or Phone Number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-12 h-12 border-slate-200 focus:border-yellow-500 focus:ring-yellow-500 text-base"
                      disabled={loading}
                    />
                  </div>
                  <Button 
                    onClick={handleSearch} 
                    disabled={loading}
                    className="h-12 px-8 bg-slate-900 hover:bg-slate-800 text-yellow-400 shadow-md disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search Order
                      </>
                    )}
                  </Button>
                </div>

                {/* Recent Searches */}
                {recentSearches.length > 0 && !selectedOrder && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500 uppercase mb-2 flex items-center gap-1">
                      <History className="w-3 h-3" />
                      Recent Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSearchQuery(search.query);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-sm text-slate-700 transition-colors"
                        >
                          <Clock className="w-3 h-3 text-slate-400" />
                          {search.query}
                          <span className="text-slate-400 text-xs">{formatTimeAgo(search.timestamp)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedOrder ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Order Status Management */}
                  <Card className="shadow-md border-slate-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Order Details
                          </CardTitle>
                          <CardDescription>Order ID: {selectedOrder.orderId}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Export Button */}
                          <Button variant="outline" size="sm" onClick={handleExportOrder}>
                            <Download className="w-4 h-4" />
                          </Button>
                          {/* Print Button */}
                          <Button variant="outline" size="sm" onClick={handlePrintOrder}>
                            <Printer className="w-4 h-4" />
                          </Button>
                          {/* Edit/Save Button */}
                          {!isEditing ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setIsEditing(true)} 
                              className="border-slate-300"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Status
                            </Button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={handleSaveStatus}
                                disabled={loading}
                                className="bg-slate-900 text-yellow-400 hover:bg-slate-800"
                              >
                                {loading ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Status and Location - Dropdown Style */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-slate-500 mb-2 block">Current Status</label>
                            {isEditing ? (
                              <Select value={orderStatus} onValueChange={setOrderStatus}>
                                <SelectTrigger className="border-slate-200">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                    <SelectItem key={key} value={key}>
                                      <span className="flex items-center gap-2">
                                        <config.icon className="w-4 h-4" />
                                        {config.label}
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge className={`${STATUS_CONFIG[orderStatus]?.color || 'bg-slate-100'} px-3 py-1.5`}>
                                {STATUS_CONFIG[orderStatus]?.label || orderStatus}
                              </Badge>
                            )}
                          </div>
                          
                          <div>
                            <label className="text-sm text-slate-500 mb-2 block">Current Location</label>
                            {isEditing ? (
                              <Input
                                value={orderLocation}
                                onChange={(e) => setOrderLocation(e.target.value)}
                                placeholder="Enter location"
                                className="border-slate-200"
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-600" />
                                <p className="font-medium text-slate-900">{orderLocation || "N/A"}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <Separator className="bg-slate-100" />

                        {/* Order Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Package className="w-4 h-4 text-slate-400" />
                              <p className="text-xs text-slate-500 uppercase">Order ID</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="font-mono text-sm font-medium text-slate-900">{selectedOrder.orderId}</p>
                              <button 
                                onClick={() => copyToClipboard(selectedOrder.orderId, 'Order ID')}
                                className="text-slate-400 hover:text-slate-600"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          

                          <div className="p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <p className="text-xs text-slate-500 uppercase">Est. Delivery</p>
                            </div>
                            <p className="font-medium text-sm text-slate-900">{formatDate(selectedOrder.estimatedDeliveryDate)}</p>
                          </div>

                          <div className="p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Timer className="w-4 h-4 text-slate-400" />
                              <p className="text-xs text-slate-500 uppercase">Last Updated</p>
                            </div>
                            <p className="font-medium text-sm text-slate-900">{formatDateTime(selectedOrder.scanTime)}</p>
                          </div>

                          {selectedOrder.latitude && selectedOrder.longitude && (
                            <div className="p-3 bg-slate-50 rounded-lg col-span-2">
                              <div className="flex items-center gap-2 mb-1">
                                <Navigation className="w-4 h-4 text-slate-400" />
                                <p className="text-xs text-slate-500 uppercase">GPS Coordinates</p>
                              </div>
                              <p className="font-mono text-sm text-slate-900">
                                {selectedOrder.latitude.toFixed(6)}, {selectedOrder.longitude.toFixed(6)}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* View on Map Button */}
                        {selectedOrder.latitude && selectedOrder.longitude && (
                          <Button 
                            variant="outline" 
                            className="w-full border-slate-200"
                            onClick={() => {
                              const url = `https://www.google.com/maps?q=${selectedOrder.latitude},${selectedOrder.longitude}`;
                              window.open(url, '_blank');
                            }}
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            View Location on Map
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tab Navigation for Email & Notes */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    {[
                     
                      { id: 'notes', label: 'Internal Notes', icon: Lock }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                          activeTab === tab.id 
                            ? 'bg-white text-slate-900 shadow-sm' 
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  

                  {/* Internal Notes Tab */}
                  {activeTab === 'notes' && (
                    <Card className="shadow-md border-slate-200">
                      <CardHeader className="bg-slate-50">
                        <div className="flex items-center gap-2">
                          <Lock className="w-5 h-5 text-slate-600" />
                          <CardTitle className="text-slate-900">Internal Notes</CardTitle>
                        </div>
                        <CardDescription className="text-slate-500">
                          Private communication between support agents
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Textarea
                              placeholder="Add internal note (only visible to support team)..."
                              value={newInternalNote}
                              onChange={(e) => setNewInternalNote(e.target.value)}
                              rows={3}
                              className="border-slate-200 focus:border-slate-900 focus:ring-slate-900"
                            />
                            <Button 
                              onClick={handleAddInternalNote} 
                              size="sm" 
                              className="bg-yellow-400 text-slate-900 hover:bg-yellow-500"
                            >
                              <Lock className="w-4 h-4 mr-2" />
                              Add Internal Note
                            </Button>
                          </div>

                          <Separator className="bg-slate-100" />

                          <div className="space-y-3 max-h-80 overflow-y-auto">
                            {internalNotes.length === 0 ? (
                              <div className="text-center py-8 text-slate-400 text-sm">
                                <Lock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                No internal notes yet
                              </div>
                            ) : (
                              internalNotes.map((note) => (
                                <div 
                                  key={note.id} 
                                  className={`p-4 rounded-lg ${
                                    note.type === 'email' 
                                      ? 'bg-blue-50 border border-blue-100' 
                                      : 'bg-yellow-50/50 border border-yellow-100'
                                  }`}
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      {note.type === 'email' ? (
                                        <Mail className="w-3 h-3 text-blue-500" />
                                      ) : (
                                        <Lock className="w-3 h-3 text-slate-400" />
                                      )}
                                      <span className="font-medium text-sm text-slate-900">{note.agent}</span>
                                    </div>
                                    <span className="text-xs text-slate-400">{note.timestamp}</span>
                                  </div>
                                  <p className="text-sm text-slate-700 pl-5 whitespace-pre-wrap">{note.note}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Sidebar - Right Column */}
                <div className="space-y-6">
                  {/* Customer Information */}
                  <Card className="shadow-md border-slate-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Customer Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                        <div className="w-14 h-14 bg-gradient-to-br from-slate-900 to-slate-700 rounded-full flex items-center justify-center text-yellow-400 shadow-lg">
                          <User className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{selectedOrder.customerName || 'Customer'}</p>
                          <p className="text-sm text-slate-500">{selectedOrder.email}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {/* Email */}
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <div>
                              <p className="text-xs text-slate-500">Email</p>
                              <p className="text-sm text-slate-900">{selectedOrder.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(selectedOrder.email, 'Email')}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => window.location.href = `mailto:${selectedOrder.email}`}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Phone */}
                        {selectedOrder.phonenumber && (
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <Phone className="w-4 h-4 text-slate-400" />
                              <div>
                                <p className="text-xs text-slate-500">Phone</p>
                                <p className="text-sm text-slate-900">{selectedOrder.phonenumber}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => copyToClipboard(selectedOrder.phonenumber, 'Phone')}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => window.location.href = `tel:${selectedOrder.phonenumber}`}
                              >
                                <Phone className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Contact Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          className="border-slate-200"
                          onClick={() => {
                            setActiveTab('email');
                          }}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </Button>
                        {selectedOrder.phonenumber && (
                          <Button 
                            variant="outline" 
                            className="border-slate-200"
                            onClick={() => window.location.href = `tel:${selectedOrder.phonenumber}`}
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order Summary */}
                  {(selectedOrder.amount || selectedOrder.deliveryCharge) && (
                    <Card className="shadow-md border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                      <CardHeader>
                        <CardTitle className="text-yellow-400 flex items-center gap-2">
                          <IndianRupee className="w-5 h-5" />
                          Order Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Subtotal</span>
                          <span className="font-semibold">₹{selectedOrder.amount || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Delivery</span>
                          <span className="font-semibold">₹{selectedOrder.deliveryCharge || 0}</span>
                        </div>
                        <Separator className="bg-slate-700" />
                        <div className="flex items-center justify-between text-lg">
                          <span className="text-yellow-400 font-semibold">Total</span>
                          <span className="font-bold text-yellow-400">
                            ₹{(selectedOrder.amount || 0) + (selectedOrder.deliveryCharge || 0)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Delivery Address */}
                  {selectedOrder.deliveryAddress && (
                    <Card className="shadow-md border-slate-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <MapPin className="w-5 h-5" />
                          Delivery Address
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-700">{selectedOrder.deliveryAddress}</p>
                        {selectedOrder.latitude && selectedOrder.longitude && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="mt-3 w-full"
                            onClick={() => {
                              const url = `https://www.google.com/maps?q=${selectedOrder.latitude},${selectedOrder.longitude}`;
                              window.open(url, '_blank');
                            }}
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            View on Map
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              /* Empty State */
              <Card className="shadow-md border-slate-200">
                <CardContent className="py-20 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                    <Search className="w-12 h-12 text-slate-900" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Search for an Order</h3>
                  <p className="text-slate-500 max-w-md mx-auto mb-8">
                    Enter an Order ID, Email, or Phone Number in the search bar above to view and manage customer orders
                  </p>
                  
                  <div className="flex items-center justify-center gap-8 text-sm text-slate-400 mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span>Real-time Search</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Live Tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                      <span>Email Support</span>
                    </div>
                  </div>

                  {/* Feature Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <Package className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-slate-900">Track Orders</h4>
                      <p className="text-xs text-slate-500">View real-time order status and location</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <Mail className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-slate-900">Email Customers</h4>
                      <p className="text-xs text-slate-500">Send updates directly to customer email</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <Edit className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-slate-900">Update Status</h4>
                      <p className="text-xs text-slate-500">Modify order status with dropdown</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportPortal;