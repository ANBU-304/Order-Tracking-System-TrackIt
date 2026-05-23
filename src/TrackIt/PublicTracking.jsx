import { useState, useEffect, useRef } from 'react';
import {
  Search, Award, Phone, Mail, Facebook, Twitter,
  Instagram, Linkedin, Star, Loader2, Package,
  Truck, MapPin, Bell, Shield, Zap, ArrowRight,
  Globe, Clock, CheckCircle2
} from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';
import trackingService from '../services/trackingService';
import { toast } from 'sonner';

export function PublicTracking() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [trackMethod, setTrackMethod] = useState('orderid');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'E-commerce Store Owner',
      content: 'TrackIt has reduced my customer service queries by 70%. The real-time tracking is incredibly accurate.',
      rating: 5,
      avatar: 'SJ',
      color: 'from-yellow-400 to-amber-500',
    },
    {
      name: 'Michael Chen',
      role: 'Logistics Manager',
      content: 'Managing multiple carriers was a nightmare. TrackIt unified everything into one simple dashboard.',
      rating: 5,
      avatar: 'MC',
      color: 'from-slate-700 to-slate-900',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Small Business Owner',
      content: 'The mobile app notifications keep me updated without constantly checking. Game changer!',
      rating: 4,
      avatar: 'ER',
      color: 'from-amber-400 to-yellow-600',
    },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Real-Time Tracking',
      desc: 'Get instant updates on your package location and delivery status with live GPS tracking.',
      accent: 'bg-yellow-400',
      img: 'https://images.pexels.com/photos/9594428/pexels-photo-9594428.jpeg',
    },
    {
      icon: Globe,
      title: 'Multiple Carriers',
      desc: 'Track packages from FedEx, UPS, USPS, DHL, and more all in one unified dashboard.',
      accent: 'bg-slate-900',
      img: 'https://images.pexels.com/photos/9754798/pexels-photo-9754798.jpeg',
    },
    {
      icon: Clock,
      title: 'Location History',
      desc: 'View complete journey of your package with detailed timestamps and location data.',
      accent: 'bg-amber-500',
      img: 'https://images.pexels.com/photos/5137965/pexels-photo-5137965.jpeg',
    },
  ];

  const steps = [
    { num: '01', icon: Search, title: 'Enter Tracking Number', desc: 'Enter your unique order ID or email address in the search box above.' },
    { num: '02', icon: MapPin, title: 'Get Real-Time Status', desc: 'View current location, delivery status, and estimated arrival time.' },
    { num: '03', icon: Clock, title: 'View Timeline', desc: 'Check complete tracking history with detailed location updates.' },
    { num: '04', icon: Bell, title: 'Receive Updates', desc: 'Get instant notifications when your package is delivered.' },
  ];

  const stats = [
    { value: '50K+', label: 'Packages Tracked Daily' },
    { value: '99.8%', label: 'Tracking Accuracy' },
    { value: '24/7', label: 'Real-Time Updates' },
    { value: '15+', label: 'Carrier Integrations' },
  ];

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number or email');
      return;
    }
    setIsSearching(true);
    try {
      let result;
      if (trackMethod === 'orderid') {
        result = await trackingService.getEventsByOrderId(trackingNumber);
      } else {
        if (!trackingNumber.includes('@')) {
          toast.error('Please enter a valid email address');
          setIsSearching(false);
          return;
        }
        result = await trackingService.getEventsByEmail(trackingNumber);
      }
      if (result && result.content && result.content.length > 0) {
        toast.success('Tracking information found!');
        const orderId = trackMethod === 'orderid' ? trackingNumber : result.content[0].orderId;
        navigate(`/order/${orderId}`);
      } else {
        toast.error('No tracking information found for this ' + (trackMethod === 'orderid' ? 'Order ID' : 'Email'));
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('Order not found. Please check your tracking number.');
      } else {
        toast.error('Failed to fetch tracking information. Please try again.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubscribe = () => {
    if (email.includes('@')) {
      toast.success("Thank you for subscribing! We'll keep you updated.");
      setEmail('');
    } else {
      toast.error('Please enter a valid email address');
    }
  };
  const stepsRef = useRef([]);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        } else {
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateY(40px)';
        }
      });
    },
    { threshold: 0.2 }
  );

  stepsRef.current.forEach((el) => {
    if (el) observer.observe(el);
  });

  return () => observer.disconnect();
}, []);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-white min-h-[92vh] flex items-center">

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-yellow-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-3xl" />
          {/* Grid lines - fade out toward bottom */}
          <div
  className="absolute inset-0"
  style={{
    backgroundImage:
      'linear-gradient(rgba(255,255,255,0.03) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.03) 2px, transparent 2px)',
    backgroundSize: '60px 60px',
    maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
  }}
/>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: Text */}
            <div className="space-y-8">
             

              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-black text-white leading-none tracking-tighter uppercase">
                  Track Your
                  <br />
                  <span className="text-yellow-400">Orders</span>
                  <br />
                  Easily
                  <span className="text-yellow-400 text-8xl">.</span>
                </h1>
                <p className="text-slate-400 text-lg font-medium max-w-md leading-relaxed">
                  Real-time package tracking across multiple carriers. Just enter your Email or Order ID and see where your package is.
                </p>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 pt-2">
                {[
                  { icon: Shield, label: '100% Secure' },
                  { icon: Zap, label: 'Instant Results' },
                  { icon: Globe, label: '15+ Carriers' },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <b.icon className="w-4 h-4 text-yellow-400" />
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{b.label}</span>
                  </div>
                ))}
              </div>

              {/* Floating package animation */}
              <div className="hidden lg:flex items-center gap-4 pt-6">
                {/* Animated Package Illustration */}
                <div className="relative">
                  {/* Main Package */}
                  <div className="w-20 h-20 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-400/30 animate-bounce"
                    style={{ animationDuration: '3s' }}>
                    <Package className="w-10 h-10 text-slate-900" />
                  </div>
                  {/* Small floating boxes */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center shadow-lg"
                    style={{ animation: 'bounce 3s infinite 0.5s' }}>
                    <Package className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="absolute -bottom-2 -left-4 w-6 h-6 bg-slate-800 rounded-md flex items-center justify-center shadow-md"
                    style={{ animation: 'bounce 3s infinite 1s' }}>
                    <Package className="w-3 h-3 text-yellow-400/70" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {/* Route line */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                    <div className="w-16 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-400/20 rounded-full" />
                    <div className="w-2 h-2 bg-slate-600 rounded-full" />
                    <div className="w-16 h-0.5 bg-slate-700 rounded-full" />
                    <div className="w-2 h-2 bg-slate-700 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2 pl-3">
                    <Truck className="w-4 h-4 text-yellow-400/60" />
                    <span className="text-slate-500 text-xs font-medium">In Transit → Destination</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Tracking Card */}
            <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <div className="bg-white rounded-3xl shadow-2xl shadow-black/30 overflow-hidden">
                {/* Card Top Accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-slate-900 via-yellow-400 to-yellow-500" />

                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                        Track Your Package
                      </h2>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        Real-time tracking
                      </p>
                    </div>
                  </div>

                  {/* Method Toggle */}
                  <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6">
                    {[
                      { id: 'orderid', label: 'Order ID' },
                      { id: 'email', label: 'Email' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setTrackMethod(m.id)}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                          trackMethod === m.id
                            ? 'bg-slate-900 text-yellow-400 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* Inputs */}
                  <div className="space-y-3 mb-6">
                    <div className="relative">
                      {trackMethod === 'orderid'
                        ? <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        : <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      }
                      <input
                        placeholder={trackMethod === 'email' ? 'Enter Email Address' : 'Enter Order ID'}
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                        type={trackMethod === 'email' ? 'email' : 'text'}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      />
                    </div>

                    {trackMethod === 'orderid' && (
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          placeholder="Phone No. (Optional)"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                        />
                      </div>
                    )}
                  </div>

                  {/* Track Button */}
                  <button
                    onClick={handleTrack}
                    disabled={isSearching}
                    className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-slate-900 font-black text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-yellow-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        Track Now
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Sample hint */}
                  <p className="text-center text-[10px] text-slate-400 font-medium mt-4">
                    Try: <span className="font-black text-slate-600">ORD-2024-001</span> to see a demo
                  </p>
                </div>

                {/* Card Bottom - Live status strip */}
                <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[11px] font-bold text-slate-500">System Online</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {['FedEx', 'UPS', 'DHL'].map((c) => (
                      <span key={c} className="text-[9px] font-black px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full">
                        {c}
                      </span>
                    ))}
                    <span className="text-[9px] font-black text-slate-400">+12</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ STATS BAR ══════════════════ */}
      <section className="bg-yellow-400 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-black text-slate-900 mb-1">{s.value}</div>
                <div className="text-slate-800 text-xs font-bold uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FEATURES ══════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-3">
              Why TrackIt
            </p>
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
              Why Choose Our{' '}
              <span className="text-yellow-500">Tracking</span> System
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                {/* Image */}
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={f.img}
                    alt={f.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  {/* Icon Badge */}
                  <div className={`absolute top-4 left-4 w-10 h-10 ${f.accent} rounded-xl flex items-center justify-center shadow-lg`}>
                    <f.icon className={`w-5 h-5 ${f.accent === 'bg-yellow-400' ? 'text-slate-900' : 'text-yellow-400'}`} />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {f.desc}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-yellow-500 text-xs font-black uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn More <ArrowRight className="w-3 h-3" />
                  </div>
                </div>

                {/* Bottom accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${f.accent} scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
<section className="relative py-24 bg-slate-950">
  {/* Top fade: white → dark */}
  <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-10" />
  {/* Bottom fade: dark → white (into next section) */}
  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />

  <div className="relative max-w-7xl mx-auto px-4 z-20">
    <div className="text-center mb-16">
      <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-3">
        Simple Process
      </p>
      <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
        How It <span className="text-yellow-400">Works</span>
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
      {/* Connecting line */}
      <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-yellow-400/20 via-yellow-400/50 to-yellow-400/20" />

      {steps.map((step, i) => (
        <div
          key={i}
          ref={(el) => (stepsRef.current[i] = el)}
          className="relative flex flex-col items-center text-center group"
          style={{
            opacity: 0,
            transform: 'translateY(40px)',
            transition: `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`,
          }}
        >
          {/* Step number + icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-slate-900 border-2 border-slate-800 group-hover:border-yellow-400 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 shadow-xl relative z-10">
              <step.icon className="w-7 h-7 text-yellow-400 mb-0.5" />
              <span className="text-[9px] font-black text-slate-500 group-hover:text-yellow-400/70 transition-colors">
                {step.num}
              </span>
            </div>
            {/* Glow on hover */}
            <div className="absolute inset-0 rounded-2xl bg-yellow-400/0 group-hover:bg-yellow-400/10 blur-xl transition-all duration-300" />
          </div>

          <h4 className="text-sm font-black text-white uppercase tracking-tight mb-2">
            {step.title}
          </h4>
          <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-[180px]">
            {step.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-3">
              Testimonials
            </p>
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
              Loved by <span className="text-yellow-500">Businesses</span> Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">
                  "{t.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 bg-gradient-to-br ${t.color} rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400 font-medium">{t.role}</p>
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="h-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full mt-6 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative bg-slate-900 rounded-3xl p-12 text-center overflow-hidden">
            {/* Decoration */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

            {/* Package Icon */}
            <div className="relative inline-flex mb-6">
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-400/30">
                <Package className="w-8 h-8 text-slate-900" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-3 relative">
              Start Tracking Like a Pro
            </h2>
            <p className="text-slate-400 font-medium mb-8 max-w-lg mx-auto relative">
              Join 50,000+ businesses that trust TrackIt for their shipping needs
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="Enter your work email"
                  className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                />
              </div>
              <button
                onClick={handleSubscribe}
                className="px-6 py-4 bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-slate-900 font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-yellow-400/20 whitespace-nowrap"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer className="bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center shadow-sm">
                  <Package className="w-5 h-5 text-slate-900" />
                </div>
                <span className="text-xl font-black text-white uppercase tracking-tighter">
                  Track<span className="text-yellow-400 text-2xl">.</span>It
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                Your reliable partner for real-time package tracking across multiple carriers worldwide.
              </p>
              <div className="flex gap-2">
                {[
                  { Icon: Facebook, href: '#' },
                  { Icon: Twitter, href: '#' },
                  { Icon: Instagram, href: 'https://www.linkedin.com/in/anbumani-p-5a1311299/' },
                  { Icon: Linkedin, href: 'https://www.linkedin.com/in/anbumani-p-5a1311299/' },
                ].map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-yellow-400 hover:border-yellow-400/30 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-5">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'Track Package', href: '/' },
                  { label: 'Login', href: '/login' },
                  { label: 'About Us', href: '#' },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 group">
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-yellow-400 transition-opacity -ml-1" />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-5">
                Support
              </h4>
              <ul className="space-y-3">
                {[
                  { label: 'Help Center', href: '/help' },
                  { label: 'FAQ', href: '/help' },
                  { label: 'Contact Us', href: '#' },
                  { label: 'Privacy Policy', href: '#' },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 group">
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-yellow-400 transition-opacity -ml-1" />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-5">
                Contact Info
              </h4>
              <div className="space-y-3">
                {[
                  { Icon: Phone, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
                  { Icon: Mail, text: 'support@trackit.com', href: 'mailto:support@trackit.com' },
                ].map(({ Icon, text, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-yellow-400 group-hover:border-yellow-400 transition-all">
                      <Icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-900 transition-colors" />
                    </div>
                    <span className="text-slate-400 group-hover:text-white text-sm font-medium transition-colors">
                      {text}
                    </span>
                  </a>
                ))}
                <div className="mt-4 p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">
                    123 Shipping Street<br />
                    San Francisco, CA 94107<br />
                    United States
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-xs font-medium">
              © {new Date().getFullYear()} TrackIt. All rights reserved.
            </p>
            <p className="text-slate-700 text-xs italic">
              Real-time tracking data provided by carrier APIs. Accuracy may vary.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}