import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MessageCircle,
  Mail,
  LifeBuoy,
  ChevronDown,
  ChevronUp,
  Phone,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
} from "lucide-react";

import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

export function HelpCenter() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  
  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "bot",
      message: "Hello! 👋 I'm TrackIt AI Assistant. How can I help you today?",
      timestamp: new Date(),
    },
    {
      id: 2,
      type: "bot",
      message: "You can ask me about:\n• Order tracking\n• Delivery status\n• Returns & refunds\n• Account issues",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

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
    { 
      icon: MessageCircle, 
      title: "Live Chat", 
      desc: "Available 24/7",
      type: "chat"
    },
    { 
      icon: Mail, 
      title: "Email Support", 
      desc: "Avg response: 2h",
      agentInfo: {
        name: "Support Team",
        email: "support@trackit.com",
        alternateEmail: "help@trackit.com",
        responseTime: "2-4 hours",
        workingHours: "Mon-Fri, 8AM-8PM EST"
      }
    },
    { 
      icon: Phone, 
      title: "Hotline", 
      desc: "1-800-TRACKIT",
      agentInfo: {
        primaryNumber: "1-800-872-2548",
        alternateNumber: "+1 (555) 123-4567",
        internationalNumber: "+44 20 7946 0958",
        workingHours: "24/7 Support Available",
        tollFree: "Yes (US & Canada)"
      }
    },
  ];

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Focus input when chat opens
  useEffect(() => {
    if (showChat && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [showChat, isMinimized]);

  // AI Bot response logic
  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Tracking related
    if (message.includes("track") || message.includes("tracking") || message.includes("where is my")) {
      return "To track your order, please provide your tracking number or go to our homepage and enter it in the tracking field. Your tracking number can be found in your order confirmation email. Would you like me to help you with anything else?";
    }
    
    // Delivery related
    if (message.includes("deliver") || message.includes("shipping") || message.includes("when will")) {
      return "Standard delivery takes 3-5 business days, while express shipping takes 1-2 business days. If your package is delayed beyond the expected date, please provide your tracking number and I can check the status for you.";
    }
    
    // Delay related
    if (message.includes("delay") || message.includes("late") || message.includes("stuck")) {
      return "I'm sorry to hear about the delay! Packages can sometimes be delayed due to weather, high volume, or customs processing. If your tracking hasn't updated in 48+ hours, I recommend contacting our support team who can initiate a trace. Would you like our hotline number?";
    }
    
    // Return related
    if (message.includes("return") || message.includes("refund") || message.includes("money back")) {
      return "You can initiate a return within 30 days of delivery through your 'My Orders' dashboard. Once we receive the item, refunds are processed within 5-7 business days. Would you like step-by-step instructions for starting a return?";
    }
    
    // Account related
    if (message.includes("account") || message.includes("password") || message.includes("login") || message.includes("profile")) {
      return "For account-related issues:\n• To reset password: Click 'Forgot Password' on login page\n• To update profile: Go to Settings > Profile\n• For account security: Enable 2FA in Security settings\n\nIs there a specific account issue I can help with?";
    }
    
    // Contact human
    if (message.includes("human") || message.includes("agent") || message.includes("person") || message.includes("representative")) {
      return "I understand you'd like to speak with a human agent. You can:\n• Call us at 1-800-872-2548 (24/7)\n• Email: support@trackit.com\n• Request a callback through your account\n\nOur average wait time is under 2 minutes!";
    }
    
    // Greeting
    if (message.includes("hello") || message.includes("hi") || message.includes("hey") || message.includes("good")) {
      return "Hello! 👋 Great to chat with you! How can I assist you today? Feel free to ask about tracking, deliveries, returns, or any other questions!";
    }
    
    // Thanks
    if (message.includes("thank") || message.includes("thanks") || message.includes("appreciate")) {
      return "You're welcome! 😊 Is there anything else I can help you with? I'm here 24/7 to assist you!";
    }
    
    // Goodbye
    if (message.includes("bye") || message.includes("goodbye") || message.includes("exit") || message.includes("close")) {
      return "Thank you for chatting with TrackIt AI! Have a great day! 👋 Feel free to come back anytime you need assistance.";
    }
    
    // Order status
    if (message.includes("order") || message.includes("status") || message.includes("package")) {
      return "I'd be happy to help with your order! To check your order status, I'll need your:\n• Tracking number, or\n• Order number\n\nYou can also view all your orders in the 'My Orders' section of your account.";
    }
    
    // Pricing/Cost
    if (message.includes("price") || message.includes("cost") || message.includes("fee") || message.includes("charge")) {
      return "Our shipping rates depend on package size, weight, and destination:\n• Standard: From $5.99\n• Express: From $12.99\n• Overnight: From $24.99\n\nFor exact pricing, use our shipping calculator on the homepage!";
    }
    
    // Default response
    return "Thanks for your message! I'm here to help with tracking, deliveries, returns, and account questions. Could you please provide more details about what you need help with? Or if you prefer, you can speak with a human agent by calling 1-800-872-2548.";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMsg = {
      id: chatMessages.length + 1,
      type: "user",
      message: inputMessage,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = {
        id: chatMessages.length + 2,
        type: "bot",
        message: getBotResponse(inputMessage),
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay 1-2 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleContactClick = (opt) => {
    if (opt.type === "chat") {
      setShowChat(true);
      setIsMinimized(false);
    } else {
      setSelectedContact(opt);
    }
  };

  const quickReplies = [
    "Track my order",
    "Delivery time",
    "Return policy",
    "Talk to human",
  ];

  // Contact Modal Component
  const ContactModal = ({ contact, onClose }) => {
    if (!contact) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
          {/* Modal Header */}
          <div className="bg-slate-900 p-6 relative">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 rounded-2xl bg-yellow-400 flex items-center justify-center mb-4">
              <contact.icon className="w-7 h-7 text-slate-900" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">
              {contact.title}
            </h3>
            <p className="text-slate-400 text-sm font-medium mt-1">{contact.desc}</p>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {contact.title === "Email Support" && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Primary Email</p>
                  <a 
                    href={`mailto:${contact.agentInfo.email}`}
                    className="text-lg font-bold text-slate-900 hover:text-yellow-600 transition-colors"
                  >
                    {contact.agentInfo.email}
                  </a>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Alternate Email</p>
                  <a 
                    href={`mailto:${contact.agentInfo.alternateEmail}`}
                    className="text-lg font-bold text-slate-900 hover:text-yellow-600 transition-colors"
                  >
                    {contact.agentInfo.alternateEmail}
                  </a>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Response Time</span>
                    <span className="text-sm font-bold text-slate-900">{contact.agentInfo.responseTime}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Working Hours</span>
                    <span className="text-sm font-bold text-slate-900">{contact.agentInfo.workingHours}</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl mt-4"
                  onClick={() => window.location.href = `mailto:${contact.agentInfo.email}`}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </div>
            )}

            {contact.title === "Hotline" && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Toll-Free Number</p>
                  <a 
                    href={`tel:${contact.agentInfo.primaryNumber}`}
                    className="text-2xl font-black text-slate-900 hover:text-yellow-600 transition-colors"
                  >
                    {contact.agentInfo.primaryNumber}
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Alternate</p>
                    <a 
                      href={`tel:${contact.agentInfo.alternateNumber}`}
                      className="text-sm font-bold text-slate-900"
                    >
                      {contact.agentInfo.alternateNumber}
                    </a>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">International</p>
                    <a 
                      href={`tel:${contact.agentInfo.internationalNumber}`}
                      className="text-sm font-bold text-slate-900"
                    >
                      {contact.agentInfo.internationalNumber}
                    </a>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Availability</span>
                    <span className="text-sm font-bold text-green-600">{contact.agentInfo.workingHours}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Toll-Free</span>
                    <span className="text-sm font-bold text-slate-900">{contact.agentInfo.tollFree}</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl mt-4"
                  onClick={() => window.location.href = `tel:${contact.agentInfo.primaryNumber}`}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Live Chat Component
  const LiveChat = () => {
    if (!showChat) return null;

    return (
      <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isMinimized ? 'w-72' : 'w-96'}`}>
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col" style={{ height: isMinimized ? 'auto' : '600px' }}>
          {/* Chat Header */}
          <div className="bg-slate-900 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">TrackIt AI Assistant</h4>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-xs font-medium">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => setShowChat(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex items-end gap-2 max-w-[80%] ${msg.type === "user" ? "flex-row-reverse" : ""}`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.type === "user" ? "bg-slate-900" : "bg-yellow-400"
                      }`}>
                        {msg.type === "user" ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-slate-900" />
                        )}
                      </div>
                      
                      {/* Message Bubble */}
                      <div className={`rounded-2xl px-4 py-3 ${
                        msg.type === "user" 
                          ? "bg-slate-900 text-white rounded-br-md" 
                          : "bg-white text-slate-700 rounded-bl-md shadow-sm border border-slate-100"
                      }`}>
                        <p className="text-sm whitespace-pre-line">{msg.message}</p>
                        <p className={`text-[10px] mt-1 ${
                          msg.type === "user" ? "text-slate-400" : "text-slate-400"
                        }`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-end gap-2">
                      <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-slate-900" />
                      </div>
                      <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-slate-100">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {/* Quick Replies */}
              <div className="px-4 py-2 bg-white border-t border-slate-100">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputMessage(reply);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      className="flex-shrink-0 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-full transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 bg-slate-100 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className={`p-3 rounded-xl transition-all ${
                      inputMessage.trim() 
                        ? "bg-slate-900 hover:bg-slate-800 text-white" 
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

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

        {/* Contact Grid - Now with 3 options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          {contactOptions.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleContactClick(opt)}
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

      {/* Contact Modal for Email & Phone */}
      <ContactModal 
        contact={selectedContact} 
        onClose={() => setSelectedContact(null)} 
      />

      {/* Live Chat Bot */}
      <LiveChat />
    </div>
  );
}