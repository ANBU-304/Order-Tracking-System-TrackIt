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
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Sidebar */}
        
              <Layout/>
        

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6 animate-slide-in">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Support Agent Portal
                  </h1>
                  <p className="text-slate-500">Manage customer orders and resolve issues efficiently</p>
                </div>
                <div className="flex items-center gap-3">
                  
                  
                </div>
              </div>
            </div>

            {/* Search Section */}
            <Card className="shadow-md border-slate-200 mb-6 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-400"></div>
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
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      placeholder="Search by Order ID, Email, or Phone Number"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-12 h-12 border-slate-200 focus:border-yellow-500 focus:ring-yellow-500"
                    />
                    <Button 
                      onClick={handleSearch} 
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 hover:bg-slate-800 text-yellow-400 shadow-md"
                    >
                      Search
                    </Button>
                  </div>
                
                </div>
              </CardContent>
            </Card>

            {selectedOrder ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Order Status Management */}
                  <Card className="shadow-md border-slate-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Order Details</CardTitle>
                          <CardDescription>Order ID: {selectedOrder}</CardDescription>
                        </div>
                        {!isEditing ? (
                          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="border-slate-300">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Status
                          </Button>
                        ) : (
                          <Button size="sm" onClick={handleSaveStatus} className="bg-slate-900 text-yellow-400 hover:bg-slate-800">
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
                            <label className="text-sm text-slate-500 mb-2 block">Current Status</label>
                            {isEditing ? (
                              <Select value={orderStatus} onValueChange={setOrderStatus}>
                                <SelectTrigger className="border-slate-200">
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
                              <Badge className="bg-yellow-100 text-slate-900 hover:bg-yellow-200 border-yellow-200 px-3 py-1.5">
                                {orderStatus.replace('_', ' ').toUpperCase()}
                              </Badge>
                            )}
                          </div>
                          <div>
                            <label className="text-sm text-slate-500 mb-2 block">Carrier</label>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center">
                                <Package className="w-3 h-3 text-slate-600" />
                              </div>
                              <p className="font-medium text-slate-900">FedEx Express</p>
                            </div>
                          </div>
                        </div>

                        <Separator className="bg-slate-100" />

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-slate-500 mb-1 block">Tracking Number</label>
                            <p className="font-mono text-sm bg-slate-100 p-2 rounded text-slate-700">TRK123456789</p>
                          </div>
                          <div>
                            <label className="text-sm text-slate-500 mb-1 block">Order Date</label>
                            <p className="text-sm font-medium text-slate-900">2026-01-01</p>
                          </div>
                        </div>

                        <Separator className="bg-slate-100" />

                        <div>
                          <label className="text-sm text-slate-500 mb-1 block">Estimated Delivery</label>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-900" />
                            <p className="font-medium text-slate-900">Today by 8:00 PM</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Alerts */}
                  <Card className="shadow-md border-0 border-l-4 border-l-yellow-400">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <CardTitle>Active Alerts</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium mb-1 text-slate-900">Potential Delay</h4>
                            <p className="text-sm text-slate-600">
                              Weather conditions in the area may cause delivery delays
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Updated 2 hours ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Customer Communication Notes */}
                  <Card className="shadow-md border-slate-200">
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
                            className="border-slate-200 focus:border-yellow-400 focus:ring-yellow-400"
                          />
                          <Button onClick={handleAddNote} size="sm" className="bg-slate-900 text-yellow-400 hover:bg-slate-800">
                            Add Note
                          </Button>
                        </div>

                        <Separator className="bg-slate-100" />

                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {notes.map((note) => (
                            <div key={note.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="flex items-start justify-between mb-2">
                                <span className="font-medium text-sm text-slate-900">{note.agent}</span>
                                <span className="text-xs text-slate-400">{note.timestamp}</span>
                              </div>
                              <p className="text-sm text-slate-700">{note.note}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Internal Notes */}
                  <Card className="shadow-md border-slate-200">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900"></div>
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

                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {internalNotes.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 text-sm">
                              <Lock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                              No internal notes yet
                            </div>
                          ) : (
                            internalNotes.map((note) => (
                              <div key={note.id} className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Lock className="w-3 h-3 text-slate-400" />
                                    <span className="font-medium text-sm text-slate-900">{note.agent}</span>
                                  </div>
                                  <span className="text-xs text-slate-400">{note.timestamp}</span>
                                </div>
                                <p className="text-sm text-slate-700 pl-5">{note.note}</p>
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
                  <Card className="shadow-md border-slate-200">
                    <CardHeader>
                      <CardTitle>Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                        <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-yellow-400 shadow-sm">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{mockCustomerInfo.name}</p>
                          <p className="text-sm text-slate-500">Premium Customer</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Mail className="w-4 h-4 text-slate-400 mt-1" />
                          <div>
                            <p className="text-sm text-slate-500 mb-0.5">Email</p>
                            <a href={`mailto:${mockCustomerInfo.email}`} className="text-sm text-slate-900 hover:text-yellow-600 transition-colors">
                              {mockCustomerInfo.email}
                            </a>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Phone className="w-4 h-4 text-slate-400 mt-1" />
                          <div>
                            <p className="text-sm text-slate-500 mb-0.5">Phone</p>
                            <a href={`tel:${mockCustomerInfo.phone}`} className="text-sm text-slate-900 hover:text-yellow-600 transition-colors">
                              {mockCustomerInfo.phone}
                            </a>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-slate-400 mt-1" />
                          <div>
                            <p className="text-sm text-slate-500 mb-0.5">Shipping Address</p>
                            <p className="text-sm text-slate-700">{mockCustomerInfo.address}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="shadow-md border-slate-200">
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start border-slate-200 text-slate-700 hover:bg-slate-50" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Customer
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-slate-200 text-slate-700 hover:bg-slate-50" size="sm">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Customer
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-slate-200 text-slate-700 hover:bg-slate-50" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        View Order Details
                      </Button>
                      <Separator className="my-3 bg-slate-100" />
                      <Button variant="outline" className="w-full justify-start text-slate-900 border-slate-200 hover:bg-slate-50" size="sm">
                        Contact Carrier
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-red-600 border-slate-200 hover:bg-red-50" size="sm">
                        Escalate Issue
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Case History */}
                  <Card className="shadow-md border-slate-200">
                    <CardHeader>
                      <CardTitle>Case History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-slate-500">Total Cases:</span>
                          <Badge className="bg-slate-100 text-slate-700">2 Resolved</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-slate-900">Case #4521</span>
                              <Badge className="bg-slate-200 text-slate-600 text-[10px]">Resolved</Badge>
                            </div>
                            <p className="text-xs text-slate-500">Address verification - Dec 28</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-slate-900">Case #4312</span>
                              <Badge className="bg-slate-200 text-slate-600 text-[10px]">Resolved</Badge>
                            </div>
                            <p className="text-xs text-slate-500">Delivery inquiry - Dec 15</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="shadow-md border-slate-200">
                <CardContent className="py-16 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-yellow-50 rounded-full flex items-center justify-center">
                    <Search className="w-10 h-10 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Search for an order</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Use the search bar above to find customer orders by ID, email, or phone number to get started
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Real-time search</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
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