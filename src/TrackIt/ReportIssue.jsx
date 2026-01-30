import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Upload, X, CheckCircle2, ShieldAlert, FileText, Database } from "lucide-react";
import { Layout } from "./Layout";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";

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
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => navigate("/help"), 2500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-green-500" />
          <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Ticket Logged</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-8 leading-relaxed">
            Incident ID: #INC-{10000} <br />
            Response team has been dispatched.
          </p>
          <Button
            onClick={() => navigate("/help")}
            className="w-full bg-slate-900 text-yellow-400 font-black uppercase tracking-widest py-4 rounded-xl"
          >
            Return to Terminal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Layout />
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          {/* Back Nav */}
          <button
            onClick={() => navigate("/help")}
            className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:text-slate-900 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Abort Reporting</span>
          </button>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
              Report <span className="text-yellow-500">Incident</span>
              <AlertTriangle className="text-red-500 w-8 h-8" />
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">
              Log technical anomalies or operational failures
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
              <div className="h-1.5 w-full bg-slate-900" />
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Issue Type */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Log Category *</label>
                    <select
                      required
                      className="w-full bg-slate-50 border-slate-100 rounded-xl p-3 font-mono text-xs focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
                      value={formData.issueType}
                      onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      <option value="tracking">TRACKING_ERROR</option>
                      <option value="delivery">DELIVERY_FAILURE</option>
                      <option value="payment">TRANSACTION_VOID</option>
                      <option value="bug">SYSTEM_GLITCH</option>
                    </select>
                  </div>

                  {/* Severity */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Threat Level *</label>
                    <select
                      required
                      className={`w-full bg-slate-50 border-slate-100 rounded-xl p-3 font-mono text-xs outline-none transition-all ${
                        formData.severity === 'critical' ? 'text-red-600 bg-red-50 font-bold' : ''
                      }`}
                      value={formData.severity}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    >
                      <option value="">Select Level</option>
                      <option value="critical">CRITICAL (System Down)</option>
                      <option value="high">HIGH (Action Needed)</option>
                      <option value="medium">MEDIUM (Standard)</option>
                      <option value="low">LOW (Minor)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Reference Number</label>
                  <input
                    className="w-full bg-slate-50 border-slate-100 rounded-xl p-3 font-mono text-xs"
                    placeholder="e.g. TRK-99021"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Subject Heading *</label>
                  <input
                    required
                    className="w-full bg-slate-50 border-slate-100 rounded-xl p-3 font-bold text-slate-900"
                    placeholder="Short summary of anomaly"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Incident Description *</label>
                  <textarea
                    required
                    className="w-full bg-slate-50 border-slate-100 rounded-xl p-3 font-mono text-xs min-h-[120px]"
                    placeholder="Provide detailed technical breakdown..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* File Upload */}
                <div className="pt-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3">Evidence Attachments</label>
                  <div className="flex flex-wrap gap-4">
                    <label className="w-32 h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-yellow-400 hover:bg-yellow-50 transition-all group">
                      <input type="file" multiple className="hidden" onChange={handleFileSelect} />
                      <Upload className="w-6 h-6 text-slate-400 group-hover:text-yellow-600 mb-2" />
                      <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400 group-hover:text-yellow-600">Upload Media</span>
                    </label>

                    {attachments.map((file, index) => (
                      <div key={index} className="w-32 h-32 bg-slate-900 rounded-2xl p-3 relative flex flex-col items-center justify-center text-center overflow-hidden">
                        <FileText className="text-yellow-400 w-8 h-8 mb-2" />
                        <span className="text-[8px] text-white font-mono break-all line-clamp-2 px-2">{file.name}</span>
                        <button 
                          type="button" 
                          onClick={() => removeAttachment(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-lg p-1"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 text-yellow-400 hover:bg-slate-800 font-black uppercase text-[10px] tracking-widest h-14 rounded-xl shadow-xl shadow-slate-200"
            >
              {isSubmitting ? (
                <>
                  <Database className="w-4 h-4 mr-2 animate-spin" />
                  Transmitting to Servers...
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 mr-2" />
                  Finalize Incident Report
                </>
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}