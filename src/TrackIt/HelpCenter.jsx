import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MessageCircle,
  Mail,
  LifeBuoy,
  ChevronDown,
  ChevronUp,
  Phone,
  FileText,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

export function HelpCenter() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      category: "Tracking",
      question: "How do I track my order?",
      answer: "Enter your tracking number on the homepage. You will receive tracking updates via email once your order has been shipped.",
    },
    {
      category: "Tracking",
      question: "Why is my tracking not updating?",
      answer: "Information usually updates within 24-48 hours. If your status is stuck longer, please contact our logistics desk.",
    },
    {
      category: "Delivery",
      question: "What if my package is delayed?",
      answer: "Check your tracking for carrier alerts. If the delay exceeds 3 business days, our support team can initiate a trace.",
    },
    {
      category: "Account",
      question: "How do I update my profile?",
      answer: "Visit your Profile Settings to manage personal details, addresses, and notification preferences.",
    },
    {
      category: "Returns",
      question: "How do I return a package?",
      answer: "Initiate a return through your 'My Orders' dashboard. Most items are eligible for return within 30 days.",
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    return (
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const contactOptions = [
    { icon: MessageCircle, title: "Live Chat", desc: "Available 24/7", action: () => navigate("/support/contact") },
    { icon: Mail, title: "Email Support", desc: "Avg response: 2h", action: () => navigate("/support/contact") },
    { icon: Phone, title: "Hotline", desc: "1-800-TRACKIT", action: () => navigate("/support/contact") },
    { icon: FileText, title: "Report Issue", desc: "Submit a claim", action: () => navigate("/support/report") },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200">
            <LifeBuoy className="w-8 h-8 text-yellow-400" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-3">
            Help <span className="text-yellow-500 text-5xl">.</span> Center
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
            Expert Logistics Support & Knowledge Base
          </p>
        </div>

        {/* Search Bar Only */}
        <div className="relative mb-12">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <Input
            placeholder="Search for answers (e.g., 'delay', 'tracking', 'refund')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-12 pr-4 py-6 bg-white border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/50 text-slate-900 font-medium placeholder:text-slate-400 focus:ring-yellow-400 focus:border-yellow-400 text-lg transition-all"
          />
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {contactOptions.map((opt, i) => (
            <button
              key={i}
              onClick={opt.action}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-yellow-400 transition-all group text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-slate-900 transition-colors">
                <opt.icon className="w-5 h-5 text-slate-900 group-hover:text-yellow-400 transition-colors" />
              </div>
              <p className="text-xs font-black text-slate-900 uppercase tracking-tight mb-1">{opt.title}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{opt.desc}</p>
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] whitespace-nowrap">
              Frequently Asked
            </h2>
            <div className="h-px w-full bg-slate-200" />
          </div>

          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors ${expandedFAQ === index ? 'bg-yellow-400' : 'bg-slate-300'}`} />
                  <span className="font-bold text-slate-900 text-sm tracking-tight">{faq.question}</span>
                </div>
                {expandedFAQ === index ? (
                  <ChevronUp className="w-5 h-5 text-slate-900" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-900" />
                )}
              </button>
              
              <div 
                className={`px-6 transition-all duration-300 ease-in-out ${
                  expandedFAQ === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}
              >
                <div className="pt-2 text-slate-500 text-sm leading-relaxed font-medium">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}

          {filteredFAQs.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-100">
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No results found for "{searchTerm}"</p>
               <Button 
                variant="ghost" 
                onClick={() => setSearchTerm("")}
                className="mt-4 text-yellow-600 font-bold hover:bg-yellow-50"
               >
                 Clear Search
               </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}