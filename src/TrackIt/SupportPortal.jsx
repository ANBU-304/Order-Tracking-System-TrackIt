import { useState } from "react";
import React from "react";
import ReactDOM from "react-dom/client";

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
  Lock
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

  /* ---------------- JSX ---------------- */

  return (
    
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="max-w-7xl mx-auto">
        <CardHeader>
          <CardTitle>Support Agent Portal</CardTitle>
          <CardDescription>Search and manage customer orders</CardDescription>
          
        </CardHeader>

        <CardContent className="space-y-6">
          {/* SEARCH */}
          <div className="flex gap-2">
            <Input
              placeholder="Order ID / Email / Phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {!selectedOrder && (
            <p className="text-gray-500 text-sm">Search an order to continue</p>
          )}

          {selectedOrder && (
            <>
              {/* ORDER STATUS */}
              <Card>
                <CardHeader className="flex flex-row justify-between">
                  <div>
                    <CardTitle>Order #{selectedOrder}</CardTitle>
                    <CardDescription>Status Management</CardDescription>
                  </div>

                  {!isEditing ? (
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <Button size="sm" onClick={handleSaveStatus}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  )}
                </CardHeader>
                <Card className="mt-6">
  <CardHeader>
    <CardTitle>Customer Information</CardTitle>
  </CardHeader>

  <CardContent className="space-y-3">
    <div className="flex items-center gap-3">
      <User className="w-5 h-5 text-indigo-600" />
      <span className="font-medium">{mockCustomerInfo.name}</span>
    </div>

    <div className="flex items-center gap-3">
      <Mail className="w-5 h-5 text-gray-500" />
      <span>{mockCustomerInfo.email}</span>
    </div>

    <div className="flex items-center gap-3">
      <Phone className="w-5 h-5 text-gray-500" />
      <span>{mockCustomerInfo.phone}</span>
    </div>

    <div className="flex items-start gap-3">
      <MapPin className="w-5 h-5 text-gray-500 mt-1" />
      <span>{mockCustomerInfo.address}</span>
    </div>
  </CardContent>
</Card>


                <CardContent>
                  {isEditing ? (
                    <Select value={orderStatus} onValueChange={setOrderStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="in_transit">In Transit</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge>{orderStatus.replace("_", " ").toUpperCase()}</Badge>
                  )}
                </CardContent>
              </Card>

              {/* CUSTOMER NOTES */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Notes</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <Textarea
                    placeholder="Add note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <Button onClick={handleAddNote}>Add Note</Button>

                  <Separator />

                  {notes.map((n) => (
                    <div key={n.id} className="bg-gray-100 p-3 rounded">
                      <p className="font-medium">{n.agent}</p>
                      <p className="text-xs text-gray-500">{n.timestamp}</p>
                      <p>{n.note}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* INTERNAL NOTES */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Internal Notes
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <Textarea
                    placeholder="Internal note (support only)"
                    value={newInternalNote}
                    onChange={(e) => setNewInternalNote(e.target.value)}
                  />
                  <Button onClick={handleAddInternalNote}>
                    <Lock className="w-4 h-4 mr-2" />
                    Add Internal Note
                  </Button>

                  {internalNotes.map((n) => (
                    <div key={n.id} className="bg-yellow-50 p-3 rounded">
                      <p className="font-medium">{n.agent}</p>
                      <p className="text-xs">{n.timestamp}</p>
                      <p>{n.note}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
