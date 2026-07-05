import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Star,
  Search,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  Layers,
  Terminal,
  ChevronDown,
  Shield,
  Zap,
  Clock,
  Briefcase,
  Sliders,
  Play,
  ArrowUpRight,
  Lock,
  ChevronRight,
  Plus,
  Send,
} from "lucide-react";

const GithubIcon = ({ size = 14, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = ({ size = 14, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = ({ size = 14, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import GlassCard, {
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
} from "../components/ui/GlassCard";
import MetricCard from "../components/ui/MetricCard";
import Badge from "../components/ui/Badge";
import Timeline from "../components/ui/Timeline";
import ServiceCard from "../components/ui/ServiceCard";
import CommandPalette from "../components/common/CommandPalette";
import ChartWrapper from "../components/charts/ChartWrapper";
import toast from "react-hot-toast";

// Animated Numerical Counter Component
function AnimatedCounter({ value, duration = 1.5, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const cleanVal = value.toString().replace(/[^0-9.]/g, "");
    const end = parseFloat(cleanVal);
    const isDecimal = value.toString().includes(".");
    
    if (isNaN(end)) {
      setCount(value);
      return;
    }

    const totalMilliseconds = duration * 1000;
    const incrementTime = 30; // ms
    const totalSteps = totalMilliseconds / incrementTime;
    const stepValue = end / totalSteps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      let currentVal = stepValue * currentStep;
      if (currentStep >= totalSteps) {
        clearInterval(timer);
        currentVal = end;
      }
      setCount(isDecimal ? parseFloat(currentVal.toFixed(1)) : Math.floor(currentVal));
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  const formatNumber = (num) => {
    if (typeof num === "string") return num;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return <span ref={ref}>{formatNumber(count)}{suffix}</span>;
}

export default function LandingPage() {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Handle transparent navbar scroll transformation
  useEffect(() => {
    return scrollY.onChange((latest) => {
      setScrolled(latest > 30);
    });
  }, [scrollY]);

  // Global hotkey CMD+K to open Command Palette
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen bg-bg-base text-gray-200 overflow-hidden font-sans select-none selection:bg-primary/30 selection:text-white">
      {/* Noise Overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none z-50 opacity-2" />
      
      {/* Ambient Radial Gradients (Mesh Effect) */}
      <div className="absolute top-[-150px] left-[5%] h-[800px] w-[800px] rounded-full bg-primary/10 glow-circle opacity-40 mix-blend-screen" />
      <div className="absolute top-[400px] right-[5%] h-[800px] w-[800px] rounded-full bg-secondary/10 glow-circle opacity-30 mix-blend-screen" />
      <div className="absolute bottom-[200px] left-[15%] h-[900px] w-[900px] rounded-full bg-accent/5 glow-circle opacity-20 mix-blend-screen" />
      <div className="absolute bottom-[-200px] right-[10%] h-[700px] w-[700px] rounded-full bg-highlight/5 glow-circle opacity-15 mix-blend-screen" />

      {/* Grid Overlay background */}
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none z-0" />

      {/* Section 1: Floating Navbar */}
      <NavbarSection onSearchClick={() => setIsPaletteOpen(true)} scrolled={scrolled} />

      {/* Section 2: Hero Section */}
      <HeroSection onSearchClick={() => setIsPaletteOpen(true)} />

      {/* Section 3: Trusted By (Infinite Marquee) */}
      <TrustedBySection />

      {/* Section 4: Statistics */}
      <StatisticsSection />

      {/* Section 5: Features Bento Grid */}
      <FeaturesSection />

      {/* Section 6: Marketplace Preview (Filtered Visual Showcase) */}
      <MarketplacePreviewSection />

      {/* Section 7: AI Showcase (Dynamic visual workspace mockup) */}
      <AIShowcaseSection />

      {/* Section 8: Dashboard Visual Preview (Client/Freelancer/Admin Tab panel) */}
      <DashboardPreviewSection />

      {/* Section 9: How It Works Timeline */}
      <HowItWorksSection />

      {/* Section 10: Testimonials Grid */}
      <TestimonialsSection />

      {/* Section 11: Pricing Model */}
      <PricingSection />

      {/* Section 12: FAQ Accordion */}
      <FAQSection />

      {/* Section 13: Footer */}
      <FooterSection />

      {/* Command Center Palette Modal */}
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />

      {/* Custom Styles for Noise and Animations */}
      <style>{`
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.015;
        }
        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
          display: flex;
        }
        .marquee-content {
          display: inline-flex;
          animation: marquee 25s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .hero-glow-blob {
          filter: blur(100px);
          opacity: 0.15;
          mix-blend-mode: screen;
        }
        .bento-card-spotlight {
          position: absolute;
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 0;
          transition: opacity 0.5s ease;
        }
      `}</style>
    </div>
  );
}

// 1. FLOATING NAVBAR COMPONENT
function NavbarSection({ onSearchClick, scrolled }) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-4 left-0 right-0 z-40 mx-auto max-w-7xl px-4 transition-all duration-300 ${
        scrolled ? "max-w-5xl" : "max-w-7xl"
      }`}
    >
      <div
        className={`flex items-center justify-between px-6 py-3.5 rounded-2xl transition-all duration-300 border ${
          scrolled
            ? "bg-[#0b0f19]/80 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            : "bg-transparent border-transparent"
        }`}
      >
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
            <Sparkles size={18} className="text-white fill-white/10 animate-pulse-slow" />
          </div>
          <span className="text-xl font-black tracking-tight text-white font-sans">
            Collab<span className="text-primary text-gradient-neon">AI</span>
          </span>
        </a>

        {/* Desktop Anchor Menu */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#marketplace" className="hover:text-white transition-colors">Marketplace</a>
          <a href="#ai-showcase" className="hover:text-white transition-colors">AI Engine</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">Process</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        {/* Call to Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Search cmd+K */}
          <button
            onClick={onSearchClick}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/3 border border-border-glass text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <Search size={13} />
            <span>Search...</span>
            <kbd className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded border border-border-glass bg-white/5 text-[9px] text-gray-500 font-mono font-bold">
              ⌘K
            </kbd>
          </button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => toast.success("Authentication system and login dashboard will be fully implemented in Phase 3.")}
          >
            Login
          </Button>
          
          <Button
            variant="primary"
            size="sm"
            className="shadow-neon-primary"
            onClick={() => toast.success("Onboarding workflows and client-registration triggers will launch in Phase 3.")}
          >
            Get Started
          </Button>
        </div>
      </div>
    </motion.header>
  );
}

// 2. HERO SECTION COMPONENT (With Mouse Parallax and Floating Dashboard Preview)
function HeroSection({ onSearchClick }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Mouse Parallax coordinates tracker
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (clientX - left - width / 2) / (width / 2);
    const y = (clientY - top - height / 2) / (height / 2);
    setCoords({ x, y });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen pt-36 pb-24 px-4 flex flex-col items-center justify-center overflow-hidden z-10"
    >
      {/* Animated Light blobs for Hero Backdrop */}
      <div className="absolute top-[25%] left-[50%] -translate-x-1/2 -translate-y-1/2 h-[350px] w-[500px] bg-primary/20 hero-glow-blob" />
      <div className="absolute top-[20%] left-[45%] -translate-x-1/2 -translate-y-1/2 h-[350px] w-[450px] bg-secondary/15 hero-glow-blob" style={{ animationDelay: "2s" }} />

      <div className="max-w-5xl mx-auto text-center space-y-8 relative z-20">
        {/* Glow pill warning badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/3 border border-indigo-500/20 text-xs font-semibold text-indigo-300 shadow-lg shadow-indigo-500/5 backdrop-blur-md"
        >
          <Sparkles size={13} className="text-accent animate-pulse" />
          <span>Autonomous AI Escrow & Vetted Freelancing</span>
        </motion.div>

        {/* Massive Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] font-sans"
        >
          Build Projects in the <br />
          <span className="text-gradient-neon">Autonomous AI Workspace</span>
        </motion.h1>

        {/* Subtitle Description */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-lg md:text-xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed"
        >
          CollabAI merges elite global freelancers with autonomous AI agents. Generate scopes instantly, execute smart escrow contracts, and collaborate in real-time.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto shadow-neon-primary flex items-center justify-center gap-2"
            onClick={() => {
              const el = document.getElementById("ai-showcase");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span>Try AI Engine</span>
            <ArrowRight size={16} />
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
            onClick={onSearchClick}
          >
            <Search size={15} />
            <span>Search Talents (⌘K)</span>
          </Button>
        </motion.div>
      </div>

      {/* Floating Dashboard Preview (Simulated Isometric 3D Mockup with mouse parallax) */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="w-full max-w-5xl mt-16 px-4 relative z-30"
        style={{
          transform: `perspective(1000px) rotateX(${15 - coords.y * 5}deg) rotateY(${coords.x * 5}deg) scale(0.98)`,
          transition: "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <div className="relative rounded-2xl border border-white/10 bg-[#050816]/95 shadow-[0_32px_128px_rgba(99,102,241,0.15)] overflow-hidden">
          {/* Mock Window Controls Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8 bg-[#0b0f19]/70">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="px-4 py-0.8 rounded bg-white/3 border border-border-glass text-[10px] text-gray-500 font-mono">
              app.collabai.com/workspace
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-gray-400 font-mono">live synced</span>
            </div>
          </div>

          {/* Mock Dashboard Layout */}
          <div className="grid grid-cols-12 min-h-[380px] p-6 gap-6">
            {/* Sidebar Mock */}
            <div className="col-span-3 border-r border-white/5 pr-4 hidden md:flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-2 rounded bg-white/5 border border-white/5">
                  <div className="h-6 w-6 rounded bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">C</div>
                  <span className="text-xs font-semibold text-white">Client Portal</span>
                </div>
                <div className="space-y-1.5 pl-1.5">
                  <div className="h-3.5 w-24 rounded bg-white/5" />
                  <div className="h-3.5 w-32 rounded bg-white/5" />
                  <div className="h-3.5 w-20 rounded bg-white/5" />
                </div>
              </div>
              <div className="p-2 border border-border-glass rounded bg-white/3 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold">AS</span>
                <span className="text-[10px] font-bold text-gray-400 truncate">Aneree Shah (Lead)</span>
              </div>
            </div>

            {/* Dashboard Content Mock */}
            <div className="col-span-12 md:col-span-9 flex flex-col justify-between gap-6">
              {/* Header metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl border border-white/5 bg-white/3">
                  <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Escrow Deposited</p>
                  <p className="text-lg font-black text-white font-mono mt-1">$14,820</p>
                </div>
                <div className="p-3.5 rounded-xl border border-white/5 bg-white/3">
                  <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Active Agents</p>
                  <p className="text-lg font-black text-emerald-400 font-mono mt-1">4 Online</p>
                </div>
                <div className="p-3.5 rounded-xl border border-white/5 bg-white/3 font-sans">
                  <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Milestone Velocity</p>
                  <p className="text-lg font-black text-indigo-400 font-mono mt-1">98.4%</p>
                </div>
              </div>

              {/* Chart Mock */}
              <div className="flex-1 min-h-[160px] p-4 border border-white/5 bg-white/2 rounded-xl flex flex-col justify-between">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-white">Project Work Velocity</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                    <TrendingUp size={12} />
                    <span>+12.4% Productivity</span>
                  </div>
                </div>
                {/* SVG Area Chart Mock */}
                <div className="w-full h-32 relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Path */}
                    <path
                      d="M0 25 C10 20, 20 28, 30 18 C40 8, 50 15, 60 10 C70 5, 80 12, 90 6 C95 3, 100 5, 100 5 L100 30 L0 30 Z"
                      fill="url(#chartGrad)"
                    />
                    <path
                      d="M0 25 C10 20, 20 28, 30 18 C40 8, 50 15, 60 10 C70 5, 80 12, 90 6 C95 3, 100 5, 100 5"
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="0.8"
                    />
                  </svg>
                  {/* Cursor elements simulating collaboration */}
                  <div className="absolute top-8 left-[35%] flex flex-col gap-0.5 pointer-events-none">
                    <div className="flex items-center gap-1 bg-primary px-1.5 py-0.5 rounded text-[8px] text-white font-bold shadow-lg">
                      <Sparkles size={8} className="animate-spin" />
                      <span>AI Agent "ScopeBot"</span>
                    </div>
                  </div>
                  <div className="absolute top-16 left-[70%] flex flex-col gap-0.5 pointer-events-none">
                    <div className="flex items-center gap-1 bg-accent px-1.5 py-0.5 rounded text-[8px] text-bg-base font-bold shadow-lg">
                      <div className="h-1.5 w-1.5 rounded-full bg-bg-base animate-ping" />
                      <span>Devon (Lead Dev)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Console log list mockup */}
              <div className="h-14 border border-white/5 bg-[#050816] rounded-lg p-2 font-mono text-[9px] text-gray-500 overflow-hidden flex flex-col justify-end gap-0.5">
                <div>[INFO] Escrow locked successfully. Verification transaction hash: 0x9f5a...</div>
                <div className="text-indigo-400">[AGENTS] ScopeBot parsed 4 custom milestones based on prompt input.</div>
                <div className="text-emerald-400 animate-pulse">[SYSTEM] Socket listener pipe established. Streaming workspace sync signals.</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// 3. TRUSTED BY LOGO MARQUEE COMPONENT
function TrustedBySection() {
  const logos = [
    { name: "Vercel", tech: "Vercel" },
    { name: "Stripe", tech: "Stripe" },
    { name: "Framer", tech: "Framer" },
    { name: "GitHub", tech: "GitHub" },
    { name: "Figma", tech: "Figma" },
    { name: "Notion", tech: "Notion" },
    { name: "Slack", tech: "Slack" },
    { name: "Raycast", tech: "Raycast" },
  ];

  // Double list to allow infinite looping scroll
  const marqueeList = [...logos, ...logos, ...logos];

  return (
    <section className="relative py-12 border-y border-white/5 bg-[#050816]/40 backdrop-blur-sm z-10">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">
          Accelerating development for teams at
        </p>
        
        <div className="marquee-container relative w-full overflow-hidden mask-gradient">
          {/* Left and Right fades */}
          <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-bg-base to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-bg-base to-transparent z-10 pointer-events-none" />
          
          <div className="marquee-content gap-16 flex items-center">
            {marqueeList.map((logo, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors duration-300 font-sans cursor-pointer group"
              >
                <div className="h-6 w-6 rounded bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-indigo-500/20 group-hover:bg-indigo-500/5 transition-all">
                  <Sparkles size={11} className="text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <span className="font-extrabold text-sm tracking-tight">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// 4. STATISTICS SECTION COMPONENT
function StatisticsSection() {
  const stats = [
    { title: "Total Volume Transacted", value: "14.8", suffix: "M+", icon: DollarSign, color: "text-primary" },
    { title: "Vetted Freelancers Network", value: "48", suffix: "K+", icon: Users, color: "text-secondary" },
    { title: "Escrow Projects Completed", value: "99.8", suffix: "%", icon: CheckCircle, color: "text-accent" },
    { title: "AI-Matching Duration Rate", value: "4.2", suffix: "m", icon: Clock, color: "text-highlight" },
  ];

  return (
    <section className="relative py-24 px-4 z-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard hoverGlow className="flex flex-col justify-between h-full bg-[#0b0f19]/40 border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-gray-400 font-medium font-sans uppercase tracking-widest">{stat.title}</span>
                  <div className={`p-2.5 rounded-lg bg-white/3 border border-white/5 ${stat.color}`}>
                    <Icon size={18} />
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-4xl font-extrabold text-white font-mono tracking-tight flex items-baseline">
                    {stat.value.includes(".") ? (
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    ) : (
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    )}
                  </h3>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-4">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.15 }}
                      className="h-full bg-gradient-to-r from-primary to-accent"
                    />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// 5. FEATURES BENTO GRID COMPONENT
function FeaturesSection() {
  const [spotlightCoords, setSpotlightCoords] = useState({ x: 0, y: 0 });
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const features = [
    {
      title: "AI Project Engine",
      description: "Auto-parse raw prompts into technical milestones, user stories, and cost estimates using our specialized AI LLM agent core.",
      badge: "AI Native",
      grid: "col-span-12 md:col-span-8",
      icon: Sparkles,
      color: "from-indigo-500/10 to-purple-500/5",
    },
    {
      title: "Multiplayer Canvas",
      description: "Simultaneous collaboration with mouse-position presences, integrated workspaces, and shared code canvases.",
      badge: "Real-time",
      grid: "col-span-12 md:col-span-4",
      icon: Activity,
      color: "from-cyan-500/10 to-teal-500/5",
    },
    {
      title: "Smart Escrow System",
      description: "Cryptographic escrow contracts release funds automatically upon review checks and approved deliverables.",
      badge: "Secured",
      grid: "col-span-12 md:col-span-4",
      icon: Shield,
      color: "from-rose-500/10 to-amber-500/5",
    },
    {
      title: "Instant Matchmaking",
      description: "Stop posting ads. The engine parses freelancer skills portfolios and recommends candidates in under 5 minutes.",
      badge: "Automated",
      grid: "col-span-12 md:col-span-8",
      icon: Users,
      color: "from-pink-500/10 to-purple-500/5",
    },
    {
      title: "Rich File Vault",
      description: "Upload workspace resources, Figma link credentials, and documentation with static analysis scans and security checks.",
      badge: "Encrypted",
      grid: "col-span-12 md:col-span-6",
      icon: Layers,
      color: "from-blue-500/10 to-cyan-500/5",
    },
    {
      title: "Work Stream Logs",
      description: "Complete chronological logs of your workspace. Real-time updates push automatically straight to Slack, Discord, or Email.",
      badge: "Synced",
      grid: "col-span-12 md:col-span-6",
      icon: Terminal,
      color: "from-amber-500/10 to-orange-500/5",
    },
  ];

  const handleMouseMove = (e, index) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSpotlightCoords({ x, y });
    setHoveredIdx(index);
  };

  return (
    <section id="features" className="relative py-24 px-4 z-10 max-w-7xl mx-auto scroll-mt-20">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <Badge variant="primary" size="sm">System Architecture</Badge>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-none">
          Co-designed for the Autonomous Future
        </h2>
        <p className="text-sm sm:text-base text-gray-400 font-light max-w-2xl mx-auto">
          We combined core developer workflow tools, security models, and specialized AI agents into a single, cohesive team dashboard.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {features.map((feat, index) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className={`relative group overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br ${feat.color} backdrop-blur-md transition-all duration-300 hover:border-white/10 ${feat.grid}`}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Spotlight Glow Effect */}
              {hoveredIdx === index && (
                <div
                  className="bento-card-spotlight"
                  style={{
                    left: `${spotlightCoords.x}px`,
                    top: `${spotlightCoords.y}px`,
                  }}
                />
              )}

              <div className="p-8 space-y-6 flex flex-col justify-between h-full relative z-10">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white">
                    <Icon size={20} />
                  </div>
                  <Badge variant="outline" size="sm" className="text-[10px] font-mono tracking-widest text-indigo-300 border-indigo-500/20">
                    {feat.badge}
                  </Badge>
                </div>

                <div className="space-y-2.5">
                  <h3 className="text-lg sm:text-xl font-bold text-white font-sans">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">{feat.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// 6. MARKETPLACE PREVIEW SECTION
function MarketplacePreviewSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", name: "All Talents" },
    { id: "ai", name: "AI Engineers" },
    { id: "fullstack", name: "Fullstack Devs" },
    { id: "design", name: "UI/UX Designers" },
  ];

  const mockFreelancers = [
    {
      id: 1,
      title: "Senior AI Integration Expert",
      description: "Experienced Python/LangChain developer focused on agentic frameworks, Gemini prompt chaining, and custom vector databases.",
      freelancer: { name: "Aneree Shah", title: "Senior AI Lead", profileImage: "", isOnline: true },
      rating: 4.9,
      reviewCount: 124,
      hourlyRate: 110,
      tags: ["python", "langchain", "gemini", "mongodb"],
      category: "ai",
    },
    {
      id: 2,
      title: "React & Node Fullstack Architect",
      description: "Build robust, responsive web applications leveraging Next.js, Tailwind v4, Express clusters, and WebRTC streaming technologies.",
      freelancer: { name: "Devon Webb", title: "Fullstack Architect", profileImage: "", isOnline: true },
      rating: 4.8,
      reviewCount: 96,
      hourlyRate: 95,
      tags: ["react", "next.js", "node.js", "tailwind"],
      category: "fullstack",
    },
    {
      id: 3,
      title: "Interactive WebGL & UI Designer",
      description: "Visual systems designer focusing on modern CSS grids, dark aesthetics, 3D Canvas rendering, and micro-interactions.",
      freelancer: { name: "Clara Vance", title: "Lead UI Designer", profileImage: "", isOnline: false },
      rating: 5.0,
      reviewCount: 68,
      hourlyRate: 85,
      tags: ["figma", "webgl", "framer-motion", "css"],
      category: "design",
    },
  ];

  // Filtering Logic (local dataset search & filter chips)
  const filteredServices = mockFreelancers.filter((service) => {
    const matchesCategory = activeCategory === "all" || service.category === activeCategory;
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.freelancer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="marketplace" className="relative py-24 px-4 z-10 max-w-7xl mx-auto scroll-mt-20">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
        <Badge variant="accent" size="sm">Talent Marketplace</Badge>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-none">
          Assemble Your Dream Digital Team
        </h2>
        <p className="text-sm text-gray-400 font-light max-w-xl mx-auto">
          Explore profiles of vetted elite specialists. Real-time contracts allow instant matching, secure escrow payouts, and automated milestones.
        </p>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border border-white/5 bg-[#0b0f19]/30 rounded-2xl mb-8 backdrop-blur-md">
        {/* Category chips */}
        <div className="flex flex-wrap gap-2 items-center justify-start w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-md"
                  : "bg-white/3 border-white/5 text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Local Search input */}
        <div className="relative w-full md:max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search name, skills or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-white/5 bg-white/3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
          />
        </div>
      </div>

      {/* List display */}
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <ServiceCard
                service={service}
                onActionClick={() =>
                  toast.success(
                    `Freelancer detail views for ${service.freelancer.name} will be active in the Phase 3 Marketplace launch.`
                  )
                }
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {filteredServices.length === 0 && (
        <div className="py-12 flex flex-col items-center justify-center border border-dashed border-white/8 rounded-xl bg-white/2">
          <p className="text-gray-400 text-sm font-light mb-1">No professionals match your filters</p>
          <p className="text-gray-600 text-xs font-light">Try searching for keywords like "react", "python" or "figma"</p>
        </div>
      )}
    </section>
  );
}

// 7. AI SHOWCASE SECTION (Project Scope Generator, Cost Estimator, Freelancer Rec)
function AIShowcaseSection() {
  const [activeTab, setActiveTab] = useState("scope");
  const [promptInput, setPromptInput] = useState("");
  const [simulatedLogs, setSimulatedLogs] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [mockOutput, setMockOutput] = useState(null);
  const logsEndRef = useRef(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [simulatedLogs]);

  // Preloaded mock configurations
  const startSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setMockOutput(null);
    setSimulatedLogs([]);

    const steps = [
      { text: "⏳ Initiating semantic parser analyzer...", delay: 500 },
      { text: "🧠 Analysis: Web App Project architecture requested.", delay: 1000 },
      { text: "🛠️ Generating task checklist modules...", delay: 1500 },
      { text: "💵 Reviewing resource allocations & budget tiers...", delay: 2000 },
      { text: "🧬 Matching qualified vetted freelancers...", delay: 2500 },
      { text: "✅ Scope Generation Complete.", delay: 3000 },
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setSimulatedLogs((prev) => [...prev, step.text]);
        if (idx === steps.length - 1) {
          setIsSimulating(false);
          // Load outputs
          setMockOutput({
            hours: 82,
            rate: 95,
            developer: "Aneree Shah (Lead Developer)",
            deliverables: [
              { milestone: "Sprint 1: Architecture setup & Database schemas", time: "18h" },
              { milestone: "Sprint 2: JWT Auth & Protected Route guards", time: "22h" },
              { milestone: "Sprint 3: Recharts performance dashboards", time: "26h" },
              { milestone: "Sprint 4: WebSocket listener pipelines", time: "16h" },
            ],
          });
          toast.success("AI Mock Scope calculated!");
        }
      }, step.delay);
    });
  };

  return (
    <section id="ai-showcase" className="relative py-24 px-4 z-10 max-w-7xl mx-auto scroll-mt-20">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <Badge variant="highlight" size="sm">CollabAI Engine</Badge>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-none">
          Simulate the AI-Agent Core
        </h2>
        <p className="text-sm text-gray-400 font-light max-w-xl mx-auto">
          Write a quick design brief below to see how our specialized agents convert raw descriptions into clean structured development files.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side Controls */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white leading-normal">AI Core Features</h3>
            <p className="text-xs leading-relaxed text-gray-400 font-light">
              Toggle options to see previews of how AI handles the scope design, cost breakdowns, and freelancer match queries.
            </p>

            <div className="space-y-2 pt-2">
              {[
                { id: "scope", title: "Project Scope Generator", desc: "Build milestone checklists instantly from text inputs." },
                { id: "cost", title: "Autonomous Cost Estimator", desc: "Calculate budgets and fee outlines before coding." },
                { id: "freelancer", title: "Freelancer Matchmaker", desc: "Scan and pair top experts within the network." },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMockOutput(null);
                    setSimulatedLogs([]);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    activeTab === item.id
                      ? "bg-indigo-500/10 border-indigo-500/35 text-white"
                      : "bg-white/3 border-white/5 text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <p className="text-xs font-bold">{item.title}</p>
                  <p className="text-[10px] text-gray-500 font-light mt-1">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border border-white/5 bg-[#0b0f19]/30 rounded-xl backdrop-blur-md flex items-center gap-3">
            <div className="h-7 w-7 rounded bg-white/5 flex items-center justify-center text-gray-400">
              <Terminal size={14} />
            </div>
            <p className="text-[10px] text-gray-500 font-mono leading-relaxed">
              Note: This is a high-fidelity visual simulator demonstrating future core features. No actual backend calls are triggered.
            </p>
          </div>
        </div>

        {/* Right Side Sandbox Interface */}
        <div className="lg:col-span-7">
          <GlassCard className="h-full flex flex-col justify-between bg-[#0b0f19]/60 border-white/5 min-h-[460px]">
            {activeTab === "scope" && (
              <div className="flex-1 flex flex-col justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Terminal size={15} className="text-primary" />
                    <span className="text-xs font-mono font-bold text-indigo-300">scope_generator.log</span>
                  </div>
                  
                  {/* Mock Chat input */}
                  <div className="space-y-4">
                    <Input
                      label="Prompt Project Brief"
                      placeholder="Describe what you want to build (e.g. Next.js SaaS landing page with responsive charts)..."
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      disabled={isSimulating}
                    />
                    <Button
                      variant="primary"
                      onClick={() => {
                        if (!promptInput.trim()) {
                          toast.error("Type in a short description first!");
                          return;
                        }
                        startSimulation();
                      }}
                      loading={isSimulating}
                      className="w-full text-xs font-bold"
                    >
                      {isSimulating ? "AI Processing..." : "Generate AI Scope Breakdown"}
                    </Button>
                  </div>
                </div>

                {/* Simulated Output logs */}
                <div className="flex-1 border border-white/5 bg-[#050816] rounded-xl p-4 font-mono text-[10px] text-gray-400 space-y-2 overflow-y-auto max-h-[180px] min-h-[140px]">
                  {simulatedLogs.map((log, idx) => (
                    <div key={idx} className="animate-fade-in">{log}</div>
                  ))}
                  <div ref={logsEndRef} />
                  {simulatedLogs.length === 0 && (
                    <p className="text-gray-600 text-xs italic">Awaiting generator brief submit...</p>
                  )}
                </div>

                {/* Final mockup output display */}
                {mockOutput && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-indigo-500/25 bg-indigo-500/5 rounded-xl space-y-3"
                  >
                    <div className="flex justify-between items-center border-b border-white/8 pb-2">
                      <span className="text-xs font-extrabold text-white">Calculated Checkpoints</span>
                      <Badge variant="accent" size="sm">Estimate: {mockOutput.hours} hrs</Badge>
                    </div>
                    <div className="space-y-1.5">
                      {mockOutput.deliverables.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-[11px] text-gray-300">
                          <span className="font-light truncate">{item.milestone}</span>
                          <span className="font-mono text-gray-400">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === "cost" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sliders size={15} className="text-secondary" />
                    <span className="text-xs font-mono font-bold text-indigo-300">autonomous_calculator.api</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">Simulated Project Budget Breakdown</h4>
                  <p className="text-xs text-gray-400 font-light">
                    Drag the slider to preview how the escrow structure models payouts, reserve holds, and network support commissions.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Dummy Budget Slider */}
                  <CostEstimatorSlider />
                </div>
              </div>
            )}

            {activeTab === "freelancer" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users size={15} className="text-accent" />
                    <span className="text-xs font-mono font-bold text-indigo-300">agent_matchmaker.conf</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">Simulated Profile Semantic Search</h4>
                  <p className="text-xs text-gray-400 font-light leading-relaxed">
                    AI matches freelancer tags with project prompts using vector database indexes. Here is a simulated response output:
                  </p>
                </div>

                {/* Simulated profile match result */}
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-accent p-[1.5px]">
                        <div className="h-full w-full rounded-full bg-bg-surface flex items-center justify-center font-black text-xs text-white">AS</div>
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">Aneree Shah</h5>
                        <p className="text-[10px] text-gray-400 font-light">Senior AI Lead • $110/hr</p>
                      </div>
                    </div>
                    <Badge variant="success">98.2% Match Fit</Badge>
                  </div>

                  <div className="p-4 rounded-xl border border-white/5 bg-white/3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-accent p-[1.5px]">
                        <div className="h-full w-full rounded-full bg-bg-surface flex items-center justify-center font-black text-xs text-white">DW</div>
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">Devon Webb</h5>
                        <p className="text-[10px] text-gray-400 font-light">Fullstack Architect • $95/hr</p>
                      </div>
                    </div>
                    <Badge variant="outline">91.4% Match Fit</Badge>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

// Interactive Cost Estimator Sub-component
function CostEstimatorSlider() {
  const [hours, setHours] = useState(80);
  const rate = 95;
  const escrowFeeRate = 0.015;

  const totalDeveloperFee = hours * rate;
  const platformFee = Math.ceil(totalDeveloperFee * escrowFeeRate);
  const totalEscrowHold = totalDeveloperFee + platformFee;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-white/3 border border-white/5">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-xs font-semibold text-gray-400">Estimated Project Hours</span>
          <span className="text-lg font-black text-white font-mono">{hours} hrs</span>
        </div>
        <input
          type="range"
          min="10"
          max="200"
          step="5"
          value={hours}
          onChange={(e) => setHours(parseInt(e.target.value))}
          className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3.5 border border-white/5 bg-white/2 rounded-xl">
          <p className="text-[10px] text-gray-500 font-medium">Developer Payout</p>
          <p className="text-base font-extrabold text-white font-mono mt-1">${totalDeveloperFee.toLocaleString()}</p>
        </div>
        <div className="p-3.5 border border-white/5 bg-white/2 rounded-xl">
          <p className="text-[10px] text-gray-500 font-medium">Escrow Fee (1.5%)</p>
          <p className="text-base font-extrabold text-white font-mono mt-1">${platformFee.toLocaleString()}</p>
        </div>
        <div className="p-3.5 border border-indigo-500/20 bg-indigo-500/5 rounded-xl">
          <p className="text-[10px] text-indigo-400 font-medium">Total Escrow Hold</p>
          <p className="text-base font-extrabold text-white font-mono mt-1">${totalEscrowHold.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

// 8. DASHBOARD PREVIEW SECTION (Tabbed Client/Freelancer/Admin layout previews)
function DashboardPreviewSection() {
  const [activeTab, setActiveTab] = useState("client");

  // Chart data for preview
  const previewChartData = [
    { name: "Week 1", value: 4000 },
    { name: "Week 2", value: 6500 },
    { name: "Week 3", value: 5800 },
    { name: "Week 4", value: 8500 },
    { name: "Week 5", value: 9200 },
    { name: "Week 6", value: 12450 },
  ];

  return (
    <section className="relative py-24 px-4 z-10 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <Badge variant="primary" size="sm">Workspace Portals</Badge>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-none">
          Unified Views for Every Role
        </h2>
        <p className="text-sm text-gray-400 font-light max-w-xl mx-auto">
          Get complete visual overview of progress charts, contract payouts, and agent processes built custom for clients, freelancers, and admins.
        </p>
      </div>

      <div className="space-y-6">
        {/* Tab triggers */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 rounded-xl bg-white/3 border border-white/5">
            {[
              { id: "client", label: "Client Dashboard" },
              { id: "freelancer", label: "Freelancer Studio" },
              { id: "admin", label: "Network Admin" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#050816] text-white shadow-md border border-white/5"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Mock View container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="border border-white/8 rounded-2xl bg-[#0b0f19]/70 backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden"
          >
            {activeTab === "client" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metric list */}
                <div className="space-y-4 md:col-span-1">
                  <MetricCard title="Escrow Hold Total" value="$12,450.00" trend={8.2} icon={DollarSign} sparklineData={[5, 12, 10, 14, 18, 12]} />
                  <MetricCard title="Developer Productivity" value="94.6%" trend={3.5} icon={Activity} sparklineData={[70, 75, 80, 85, 90, 94]} />
                </div>
                {/* Recharts chart component reuse */}
                <div className="md:col-span-2 border border-white/5 bg-white/2 rounded-xl p-4 flex flex-col justify-between">
                  <p className="text-xs font-bold text-white mb-4">Client Project Funding Flow</p>
                  <div className="h-56">
                    <ChartWrapper data={previewChartData} strokeColor="#06B6D4" chartTitle="Project Spent Value ($)" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "freelancer" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Recharts chart component reuse */}
                <div className="md:col-span-2 border border-white/5 bg-white/2 rounded-xl p-4 flex flex-col justify-between">
                  <p className="text-xs font-bold text-white mb-4">Developer Code Velocity Rate</p>
                  <div className="h-56">
                    <ChartWrapper data={previewChartData.map((d) => ({ ...d, value: d.value / 100 }))} strokeColor="#8B5CF6" chartTitle="Commits / Task Speed (%)" />
                  </div>
                </div>
                {/* Metric list */}
                <div className="space-y-4 md:col-span-1">
                  <MetricCard title="Pending Milestone Payouts" value="$4,500.00" trend={12.4} icon={DollarSign} sparklineData={[2, 4, 3, 5, 4, 4.5]} />
                  <MetricCard title="Completed Milestones" value="18 Contracts" trend={0} icon={Briefcase} sparklineData={[10, 12, 14, 15, 17, 18]} />
                </div>
              </div>
            )}

            {activeTab === "admin" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4 md:col-span-1">
                  <MetricCard title="Network Volume Transacted" value="$14.2M" trend={24.8} icon={TrendingUp} sparklineData={[10, 11, 12, 13, 13.5, 14.2]} />
                  <MetricCard title="Escrow Disputes Ratio" value="0.04%" trend={-12.2} icon={Shield} sparklineData={[0.08, 0.07, 0.06, 0.05, 0.04, 0.04]} />
                </div>
                <div className="md:col-span-2 border border-white/5 bg-white/2 rounded-xl p-4 flex flex-col justify-between">
                  <p className="text-xs font-bold text-white mb-4">Total Network Volume ($)</p>
                  <div className="h-56">
                    <ChartWrapper data={previewChartData.map((d) => ({ ...d, value: d.value * 1200 }))} strokeColor="#EC4899" chartTitle="Platform Volume Flow ($)" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// 9. HOW IT WORKS TIMELINE SECTION
function HowItWorksSection() {
  const steps = [
    {
      date: "Step 01",
      badge: "design",
      title: "Write Project Brief & AI Prompts",
      description: "Brief our AI-agent with a raw text prompt description. The engine builds functional milestone lists, task deadlines, and budget options.",
      active: true,
    },
    {
      date: "Step 02",
      badge: "match",
      title: "Instant Expert Matching",
      description: "Our vector profile search tags match your task specifications to elite freelancers. Check match ratings and profiles in seconds.",
      active: true,
    },
    {
      date: "Step 03",
      badge: "secure",
      title: "Lock Funds in Escrow Safeguards",
      description: "Initiate smart agreements with milestone thresholds. Funds remain locked in secure escrow pools until you authorize code delivery.",
      active: true,
    },
    {
      date: "Step 04",
      badge: "deliver",
      title: "Collaborate and Payout System",
      description: "Utilize real-time chats, task canvas updates, and code logs. Release funds to your matched expert automatically.",
      active: true,
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 px-4 z-10 max-w-5xl mx-auto scroll-mt-20">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <Badge variant="accent" size="sm">Workspace Flow</Badge>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-none">
          How CollabAI Drives Operations
        </h2>
        <p className="text-sm text-gray-400 font-light max-w-xl mx-auto">
          Start building custom remote developer workflows effortlessly in under 5 minutes.
        </p>
      </div>

      <div className="p-8 border border-white/5 bg-[#0b0f19]/30 rounded-2xl backdrop-blur-xl">
        <Timeline items={steps} />
      </div>
    </section>
  );
}

// 10. TESTIMONIALS SECTION COMPONENT
function TestimonialsSection() {
  const reviews = [
    {
      quote: "Generating milestone scope lists with CollabAI saved us hours of design work. The AI estimation aligned within 5% of actual hours worked.",
      author: "Alex Rivera",
      role: "VP of Product, Stripe",
      avatarLetter: "AR",
    },
    {
      quote: "The escrow security gives our management absolute peace of mind. Payout thresholds release seamlessly, and matching took under 4 minutes.",
      author: "Juliet Sterling",
      role: "Founder, Vercel Studio",
      avatarLetter: "JS",
    },
    {
      quote: "Collaborating with elite engineers inside the shared workspace while tracking cursor actions is next level. Our output velocity grew 40%.",
      author: "Marcus Chen",
      role: "Lead Engineer, Notion",
      avatarLetter: "MC",
    },
  ];

  return (
    <section className="relative py-24 px-4 z-10 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <Badge variant="highlight" size="sm">Client Testimonials</Badge>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-none">
          Approved by Product Pioneers
        </h2>
        <p className="text-sm text-gray-400 font-light max-w-xl mx-auto">
          See what engineering leaders are saying about the next generation of remote contractor matching.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <GlassCard hoverGlow className="flex flex-col justify-between h-full bg-[#0b0f19]/40 border-white/5 p-8 relative">
              <div className="absolute top-4 right-6 text-gray-700/30 text-7xl font-black font-serif pointer-events-none select-none">
                “
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-gray-300 font-light italic mb-8 relative z-10">
                "{rev.quote}"
              </p>
              
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-accent p-[1.5px]">
                  <div className="h-full w-full rounded-full bg-bg-surface flex items-center justify-center font-bold text-xs text-white">
                    {rev.avatarLetter}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{rev.author}</h4>
                  <p className="text-[10px] text-gray-500 font-light">{rev.role}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// 11. PRICING SECTION COMPONENT
function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState("monthly");

  const plans = [
    {
      name: "Starter",
      description: "Perfect for testing pilot integrations and single milestone contracts.",
      price: { monthly: 0, yearly: 0 },
      features: [
        "1 Active Escrow Project",
        "AI Scope Generator (5 prompts/mo)",
        "Standard Vetted Talent access",
        "2.5% Escrow support fee",
        "Standard Email support",
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Pro Professional",
      description: "For fast-scaling engineering teams requesting automated match rates.",
      price: { monthly: 49, yearly: 39 },
      features: [
        "Unlimited Active Escrow Projects",
        "Unlimited AI Scope Generator uses",
        "Priority 5-min Matchmaker access",
        "Reduced 1.5% Escrow support fee",
        "Private Slack channel integrations",
        "24/7 Priority support access",
      ],
      cta: "Upgrade to Pro",
      popular: true,
    },
    {
      name: "Enterprise Core",
      description: "For custom volume requirements, security controls, and escrow setups.",
      price: { monthly: 199, yearly: 159 },
      features: [
        "Dedicated Escrow Contract logic",
        "Custom Vetting Criteria rules",
        "Reduced 0.8% Escrow support fee",
        "Dedicated Account Director",
        "SAML SSO & Audit log outputs",
        "99.9% SLA uptime contract",
      ],
      cta: "Contact Operations",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="relative py-24 px-4 z-10 max-w-7xl mx-auto scroll-mt-20">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
        <Badge variant="primary" size="sm">Billing Tiers</Badge>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-none">
          Simple, Transparent Payout Rules
        </h2>
        <p className="text-sm text-gray-400 font-light max-w-xl mx-auto">
          Choose the speed that fits your workspace demands. Save up to 20% on billing with a yearly payment term.
        </p>

        {/* Toggle billing period */}
        <div className="flex justify-center pt-4">
          <div className="inline-flex p-1 rounded-xl bg-white/3 border border-white/5">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                billingPeriod === "monthly" ? "bg-primary text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                billingPeriod === "yearly" ? "bg-primary text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Yearly billing (-20%)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="h-full"
          >
            <div
              className={`h-full flex flex-col justify-between rounded-2xl border p-8 backdrop-blur-md relative transition-all duration-300 ${
                plan.popular
                  ? "bg-gradient-to-b from-indigo-500/10 to-indigo-500/3 border-indigo-500/30 shadow-[0_16px_48px_rgba(99,102,241,0.15)] scale-[1.02] md:translate-y-[-8px]"
                  : "bg-[#0b0f19]/40 border-white/5 hover:border-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-primary to-secondary text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full shadow-lg border border-white/10">
                  Most Popular
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white font-sans">{plan.name}</h3>
                  <p className="text-xs text-gray-500 font-light mt-1 min-h-[32px]">{plan.description}</p>
                </div>

                <div className="flex items-baseline">
                  <span className="text-3xl font-black text-white font-mono">
                    ${plan.price[billingPeriod]}
                  </span>
                  <span className="text-xs text-gray-500 font-light ml-1.5">/month</span>
                </div>

                <hr className="border-white/5" />

                <ul className="space-y-3.5 text-xs text-gray-300 font-light">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2.5">
                      <CheckCircle size={14} className="text-primary flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Button
                  variant={plan.popular ? "primary" : "secondary"}
                  className="w-full text-xs font-bold"
                  onClick={() => toast.success(`Pricing subscription checkout will trigger in the Phase 3 billing release.`)}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// 12. FAQ ACCORDION COMPONENT
function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: "How does the smart escrow agreement system keep funds safe?",
      a: "When you initiate a milestone contract, payment funds are deposited directly into a secure cryptographic escrow reserve. Payouts are held transparently and only released to the freelancer once you review and verify the deliverable checklists or task outputs.",
    },
    {
      q: "What specialized tasks can the AI Project Engine model?",
      a: "Our AI LLM agent core parses raw sentences into technical structures: generating database schema specifications, task velocity lists, user stories, hourly scopes, estimated price matrices, and freelancer match fits.",
    },
    {
      q: "How are freelancers vetted within the CollabAI network?",
      a: "Freelancers must pass technical assessment stages, portfolio checks, video validation steps, and client verification reviews. Only the top 3% of applicants are approved to receive match invitations.",
    },
    {
      q: "What fees does CollabAI charge on active escrows?",
      a: "Our core escrow support fee ranges from 0.8% to 2.5% depending on your active billing tier. There are no registration setup charges, hidden transaction fees, or monthly user access premiums on starter tiers.",
    },
  ];

  return (
    <section id="faq" className="relative py-24 px-4 z-10 max-w-4xl mx-auto scroll-mt-20">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <Badge variant="accent" size="sm">Help Center</Badge>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-none font-sans">
          Frequently Answered Queries
        </h2>
        <p className="text-sm text-gray-400 font-light max-w-xl mx-auto">
          Explore quick responses to common topics regarding contract locks, escrow payouts, and developer profiles.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIdx === index;
          return (
            <div
              key={index}
              className="border border-white/5 rounded-2xl overflow-hidden bg-[#0b0f19]/35 backdrop-blur-md transition-all duration-200"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-white hover:bg-white/3 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`}
                />
              </button>
              
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-5 pt-0 border-t border-white/5 text-xs sm:text-sm text-gray-400 font-light leading-relaxed bg-[#0b0f19]/10">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// 13. FOOTER COMPONENT (Including newsletter form with mock updates)
function FooterSection() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter a valid email address!");
      return;
    }
    toast.success("Subscribed to the CollabAI newsletter feed!", { icon: "📧" });
    setEmail("");
  };

  return (
    <footer className="relative border-t border-white/5 bg-[#050816]/75 backdrop-blur-lg pt-20 pb-10 px-4 z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6 pb-16">
        
        {/* Brand details */}
        <div className="md:col-span-4 space-y-6">
          <a href="#" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
              <Sparkles size={18} className="text-white fill-white/10" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Collab<span className="text-primary text-gradient-neon">AI</span>
            </span>
          </a>
          <p className="text-xs text-gray-400 leading-relaxed font-light max-w-sm">
            Merging elite global engineers with autonomous AI agents. Generate scopes instantly, execute smart escrow contracts, and collaborate in real-time.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-3">
            {[
              { icon: GithubIcon, link: "https://github.com" },
              { icon: TwitterIcon, link: "https://twitter.com" },
              { icon: LinkedinIcon, link: "https://linkedin.com" },
            ].map((soc, sIdx) => {
              const Icon = soc.icon;
              return (
                <a
                  key={sIdx}
                  href={soc.link}
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-indigo-500/30 transition-all"
                >
                  <Icon size={14} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Links Grid */}
        <div className="md:col-span-5 grid grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Product</h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-light">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#marketplace" className="hover:text-white transition-colors">Marketplace</a></li>
              <li><a href="#ai-showcase" className="hover:text-white transition-colors">AI Showcase</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Resources</h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-light">
              <li><span className="text-gray-600 hover:text-gray-400 transition-colors cursor-pointer" onClick={() => toast.success("Docs launching in Phase 3.")}>Docs</span></li>
              <li><span className="text-gray-600 hover:text-gray-400 transition-colors cursor-pointer" onClick={() => toast.success("API references launching in Phase 3.")}>APIs</span></li>
              <li><span className="text-gray-600 hover:text-gray-400 transition-colors cursor-pointer" onClick={() => toast.success("Guides launching in Phase 3.")}>Guides</span></li>
              <li><span className="text-gray-600 hover:text-gray-400 transition-colors cursor-pointer" onClick={() => toast.success("System status page active in production.")}>Status</span></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Legal</h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-light">
              <li><span className="text-gray-600 hover:text-gray-400 transition-colors cursor-pointer" onClick={() => toast.success("Terms documents in revision.")}>Terms</span></li>
              <li><span className="text-gray-600 hover:text-gray-400 transition-colors cursor-pointer" onClick={() => toast.success("Privacy documents in revision.")}>Privacy</span></li>
              <li><span className="text-gray-600 hover:text-gray-400 transition-colors cursor-pointer" onClick={() => toast.success("Security guidelines documents in revision.")}>Security</span></li>
            </ul>
          </div>
        </div>

        {/* Newsletter subscribe */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Weekly Tech Brief</h4>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            Stay synced with global matching velocity rates and prompt releases.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-white/5 bg-white/3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
            />
            <button
              type="submit"
              className="p-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors shadow-md shadow-indigo-500/10 cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500 font-light">
        <p>© 2026 CollabAI Inc. All rights reserved.</p>
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>All escrow layers verified secure</span>
        </div>
      </div>
    </footer>
  );
}
