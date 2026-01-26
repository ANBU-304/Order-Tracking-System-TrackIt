import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MessageCircle,
  Mail,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  FileText,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
      answer:
        "You can track your order by entering your tracking number on the homepage. You will receive tracking information via email once your order has been shipped.",
    },
    {
      category: "Tracking",
      question: "Why is my tracking not updating?",
      answer:
        "Tracking information may take 24-48 hours to update after your order is shipped. If it has been longer than this, please contact our support team.",
    },
    {
      category: "Delivery",
      question: "What should I do if my package is delayed?",
      answer:
        "If your package is delayed beyond the estimated delivery date, please check your tracking information for updates. If the delay persists, contact our support team with your order details.",
    },
    {
      category: "Delivery",
      question: "Can I change my delivery address?",
      answer:
        "You can change your delivery address before the package is shipped. Once shipped, please contact the carrier directly or our support team for assistance.",
    },
    {
      category: "Account",
      question: "How do I reset my password?",
      answer:
        'Click on "Forgot Password" on the login page. You will receive an email with instructions to reset your password.',
    },
    {
      category: "Account",
      question: "How do I update my profile information?",
      answer:
        'Go to your profile page and click on "Personal Details" to update your information including name, email, phone number, and address.',
    },
    {
      category: "Returns",
      question: "How do I return a package?",
      answer:
        "Contact our support team to initiate a return. You will receive a return label and instructions via email. Most items can be returned within 30 days of delivery.",
    },
    {
      category: "Returns",
      question: "When will I receive my refund?",
      answer:
        "Refunds are typically processed within 5-7 business days after we receive your return. You will receive a confirmation email once the refund has been processed.",
    },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(faqs.map((faq) => faq.category))];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      action: () => navigate("/support/contact"),
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      action: () => navigate("/support/contact"),
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us: 1-800-TRACKIT",
      action: () => navigate("/support/contact"),
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FileText,
      title: "Report an Issue",
      description: "Submit a detailed report",
      action: () => navigate("/support/report"),
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-in">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-2 bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Help Center</h1>
          <p className="text-gray-600">Find answers to common questions and get support</p>
        </div>

        {/* Search Bar */}
        <Card className="border-0 shadow-xl mb-8 overflow-hidden animate-scale-in">
          <div className="absolute top-0 left-0 right-0 h-1 gradient-primary"></div>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search for help articles, FAQs, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {contactOptions.map((option, index) => (
            <Card
              key={index}
              className="border-0 shadow-md hover:shadow-xl transition-all cursor-pointer group overflow-hidden animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={option.action}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${option.color}`}></div>
              <CardContent className="pt-6 text-center">
                <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${option.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                  <option.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-indigo-600 transition-colors">{option.title}</h3>
                <p className="text-sm text-gray-600">{option.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Sections */}
        {categories.map((category, catIndex) => (
          <Card key={category} className="border-0 shadow-xl mb-6 overflow-hidden animate-slide-in" style={{ animationDelay: `${catIndex * 0.1}s` }}>
            <div className="absolute top-0 left-0 right-0 h-1 gradient-success"></div>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
              <CardDescription>
                {filteredFAQs.filter(faq => faq.category === category).length} articles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredFAQs
                .filter(faq => faq.category === category)
                .map((faq) => {
                  const faqIndex = faqs.indexOf(faq);
                  const isExpanded = expandedFAQ === faqIndex;
                  
                  return (
                    <div
                      key={faqIndex}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:border-indigo-300 transition-colors"
                    >
                      <button
                        onClick={() => setExpandedFAQ(isExpanded ? null : faqIndex)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-left">{faq.question}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 animate-slide-in">
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        ))}

        {/* No Results */}
        {filteredFAQs.length === 0 && searchTerm && (
          <Card className="border-0 shadow-xl text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold mb-2">No results found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any articles matching "{searchTerm}"
              </p>
              <Button 
                onClick={() => navigate('/support/contact')}
                className="gradient-primary hover:opacity-90"
              >
                Contact Support
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Still Need Help */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 gradient-info"></div>
          <CardContent className="pt-6 text-center">
            <h3 className="font-semibold mb-2">Still need help?</h3>
            <p className="text-gray-600 mb-4">
              Our support team is available 24/7 to assist you
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => navigate('/support/contact')}
                className="gradient-primary hover:opacity-90"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/support/report')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Report an Issue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
