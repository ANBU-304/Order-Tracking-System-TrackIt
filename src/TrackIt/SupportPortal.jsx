import { useState } from "react";
import {
  Search,
  Phone,
  Mail,
  User,
  AlertTriangle,
  Edit,
  Save,
  FileText,
  Clock,
  MapPin,
  Lock,
  Package,
  Settings,
  LogOut,
  Bell,
  Shield
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
import { useNavigate } from "react-router-dom";

/* ---------------- MOCK DATA ---------------- */
const mockCustomerInfo = {
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  phone: "+1 (555) 123-4567",
  address: "456 Oak Avenue, New York, NY 10001"
};

const mockNotes = [
  {
    id: "1",
    agent: "Support Agent Mike",
    timestamp: "2026-01-03 09:15 AM",
    note: "Customer called regarding delayed delivery."
  },
  {
    id: "2",
    agent: "Support Agent Lisa",
    timestamp: "2026-01-02 02:30 PM",
    note: "Verified shipping address with customer."
  }
];

/* ---------------- COMPONENT ---------------- */
export function SupportPortal() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState("in_transit");
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(mockNotes);
  const [newNote, setNewNote] = useState("");
  const [internalNotes, setInternalNotes] = useState([]);
  const [newInternalNote, setNewInternalNote] = useState("");
  const navigate = useNavigate();

  /* ---------------- HANDLERS ---------------- */
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSelectedOrder(searchQuery);
    }
  };

  const handleSaveStatus = () => {
    setIsEditing(false);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    setNotes([
      {
        id: Date.now().toString(),
        agent: "Support Agent (You)",
        timestamp: new Date().toLocaleString(),
        note: newNote
      },
      ...notes
    ]);
    setNewNote("");
  };

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block w-64 bg-white border-r border-gray-200 shadow-sm min-h-screen">
          <div className="p-6">
            {/* Agent Profile */}
            <div className="flex items-center gap-3 mb-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                <span className="text-lg font-bold">AS</span>
              </div>
              <div>
                <p className="font-medium">Agent Smith</p>
                <p className="text-sm text-gray-500">Support Team</p>
                <Badge className="mt-1 bg-green-100 text-green-700 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Online
                </Badge>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md transition-all hover:shadow-lg">
                <Package className="w-5 h-5" />
                <span className="font-medium">Support Portal</span>
              </button>

              
              
              
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
                <Badge className="ml-auto bg-red-500 text-white">3</Badge>
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors" onClick={() => navigate('/settings')}>
                <Settings className="w-5 h-5"
                 />
                <span>Settings</span>
              </button>
              
              
              
              <Separator className="my-4" />
              
              <button 
                onClick={() => navigate('/login')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 text-gray-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>

            {/* Support Stats */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Today's Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tickets</span>
                  <span className="font-medium text-blue-600">24</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Resolved</span>
                  <span className="font-medium text-green-600">18</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg. Time</span>
                  <span className="font-medium text-purple-600">12m</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6 animate-slide-in">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Support Agent Portal
                  </h1>
                  <p className="text-gray-600">Manage customer orders and resolve issues efficiently</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin Access
                  </Badge>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                    <Bell className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search Section */}
            <Card className="shadow-xl border-0 mb-6 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                   
                    <CardDescription>Search by Order ID, Email, or Phone Number</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Search by Order ID, Email, or Phone Number"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-12 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <Button 
                      onClick={handleSearch} 
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
                    >
                      Search
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Live search across all customer records</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedOrder ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Order Status Management */}
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Order Details</CardTitle>
                          <CardDescription>Order ID: {selectedOrder}</CardDescription>
                        </div>
                        {!isEditing ? (
                          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Status
                          </Button>
                        ) : (
                          <Button size="sm" onClick={handleSaveStatus} className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-600 mb-2 block">Current Status</label>
                            {isEditing ? (
                              <Select value={orderStatus} onValueChange={setOrderStatus}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="order_placed">Order Placed</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="in_transit">In Transit</SelectItem>
                                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                  <SelectItem value="exception">Exception/Issue</SelectItem>
                                  <SelectItem value="returned">Returned</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 px-3 py-1.5">
                                {orderStatus.replace('_', ' ').toUpperCase()}
                              </Badge>
                            )}
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 mb-2 block">Carrier</label>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                <Package className="w-3 h-3 text-blue-600" />
                              </div>
                              <p className="font-medium">FedEx Express</p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">Tracking Number</label>
                            <p className="font-mono text-sm bg-gray-50 p-2 rounded">TRK123456789</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">Order Date</label>
                            <p className="text-sm font-medium">2026-01-01</p>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">Estimated Delivery</label>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-green-600" />
                            <p className="font-medium text-green-600">Today by 8:00 PM</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Alerts */}
                  <Card className="shadow-lg border-0 border-l-4 border-l-yellow-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <CardTitle>Active Alerts</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
                          <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium mb-1">Potential Delay</h4>
                            <p className="text-sm text-gray-600">
                              Weather conditions in the area may cause delivery delays
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Updated 2 hours ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Customer Communication Notes */}
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle>Customer Communication Notes</CardTitle>
                      <CardDescription>Notes about customer interactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Add customer communication note..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            rows={3}
                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                          <Button onClick={handleAddNote} size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                            Add Note
                          </Button>
                        </div>

                        <Separator />

                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {notes.map((note) => (
                            <div key={note.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-start justify-between mb-2">
                                <span className="font-medium text-sm text-gray-900">{note.agent}</span>
                                <span className="text-xs text-gray-500">{note.timestamp}</span>
                              </div>
                              <p className="text-sm text-gray-700">{note.note}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Internal Notes */}
                  <Card className="shadow-lg border-0 border border-amber-200">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                    <CardHeader className="bg-amber-50/50">
                      <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-amber-700" />
                        <CardTitle className="text-amber-900">Internal Notes</CardTitle>
                      </div>
                      <CardDescription className="text-amber-700">
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
                            className="border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                          />
                          <Button 
                            onClick={handleAddInternalNote} 
                            size="sm" 
                            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                          >
                            <Lock className="w-4 h-4 mr-2" />
                            Add Internal Note
                          </Button>
                        </div>

                        <Separator className="bg-amber-200" />

                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {internalNotes.length === 0 ? (
                            <div className="text-center py-8 text-amber-600 text-sm">
                              <Lock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              No internal notes yet
                            </div>
                          ) : (
                            internalNotes.map((note) => (
                              <div key={note.id} className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Lock className="w-3 h-3 text-amber-600" />
                                    <span className="font-medium text-sm text-amber-900">{note.agent}</span>
                                  </div>
                                  <span className="text-xs text-amber-600">{note.timestamp}</span>
                                </div>
                                <p className="text-sm text-gray-700 pl-5">{note.note}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Customer Information */}
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle>Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 pb-3 border-b">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-medium">{mockCustomerInfo.name}</p>
                          <p className="text-sm text-gray-600">Premium Customer</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Mail className="w-4 h-4 text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm text-gray-600 mb-0.5">Email</p>
                            <a href={`mailto:${mockCustomerInfo.email}`} className="text-sm text-indigo-600 hover:text-indigo-700">
                              {mockCustomerInfo.email}
                            </a>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Phone className="w-4 h-4 text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm text-gray-600 mb-0.5">Phone</p>
                            <a href={`tel:${mockCustomerInfo.phone}`} className="text-sm text-indigo-600 hover:text-indigo-700">
                              {mockCustomerInfo.phone}
                            </a>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm text-gray-600 mb-0.5">Shipping Address</p>
                            <p className="text-sm">{mockCustomerInfo.address}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Customer
                      </Button>
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Customer
                      </Button>
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        View Order Details
                      </Button>
                      <Separator className="my-3" />
                      <Button variant="outline" className="w-full justify-start text-blue-600" size="sm">
                        Contact Carrier
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-red-600" size="sm">
                        Escalate Issue
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Case History */}
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle>Case History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-gray-600">Total Cases:</span>
                          <Badge className="bg-indigo-100 text-indigo-700">2 Resolved</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-900">Case #4521</span>
                              <Badge className="bg-green-100 text-green-700 text-xs">Resolved</Badge>
                            </div>
                            <p className="text-xs text-gray-600">Address verification - Dec 28</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-900">Case #4312</span>
                              <Badge className="bg-green-100 text-green-700 text-xs">Resolved</Badge>
                            </div>
                            <p className="text-xs text-gray-600">Delivery inquiry - Dec 15</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="shadow-lg border-0">
                <CardContent className="py-16 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                    <Search className="w-10 h-10 text-indigo-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Search for an order</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Use the search bar above to find customer orders by ID, email, or phone number to get started
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Real-time search</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Multiple search criteria</span>
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