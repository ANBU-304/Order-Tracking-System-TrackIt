import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Upload, X, CheckCircle2 } from "lucide-react";

export default function ReportIssue() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const [formData, setFormData] = useState({
    issueType: "",
    severity: "",
    orderNumber: "",
    subject: "",
    description: "",
    stepsToReproduce: "",
  });

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.issueType || !formData.severity || !formData.subject || !formData.description) {
      alert("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setShowSuccess(true);

    setTimeout(() => {
      navigate("/help");
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Issue Reported</h2>
          <p className="text-gray-600 mb-6">
            Our team will review your issue shortly.
          </p>
          <button
            onClick={() => navigate("/help")}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg"
          >
            Back to Help Center
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => navigate("/help")}
          className="flex items-center gap-2 text-gray-600 mb-4"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <AlertTriangle className="text-red-500" /> Report an Issue
        </h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
          <select
            className="w-full border p-2 rounded"
            value={formData.issueType}
            onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
          >
            <option value="">Select Issue Type *</option>
            <option value="tracking">Tracking</option>
            <option value="delivery">Delivery</option>
            <option value="payment">Payment</option>
            <option value="bug">Bug</option>
          </select>

          <select
            className="w-full border p-2 rounded"
            value={formData.severity}
            onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
          >
            <option value="">Select Severity *</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <input
            className="w-full border p-2 rounded"
            placeholder="Order Number (optional)"
            value={formData.orderNumber}
            onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Subject *"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />

          <textarea
            className="w-full border p-2 rounded"
            rows="4"
            placeholder="Description *"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <textarea
            className="w-full border p-2 rounded"
            rows="3"
            placeholder="Steps to reproduce (optional)"
            value={formData.stepsToReproduce}
            onChange={(e) => setFormData({ ...formData, stepsToReproduce: e.target.value })}
          />

          <input type="file" multiple onChange={handleFileSelect} />

          {attachments.map((file, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span>{file.name}</span>
              <button type="button" onClick={() => removeAttachment(index)}>
                <X className="text-red-500" size={16} />
              </button>
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg"
          >
            {isSubmitting ? "Submitting..." : "Submit Issue"}
          </button>
        </form>
      </div>
    </div>
  );
}
