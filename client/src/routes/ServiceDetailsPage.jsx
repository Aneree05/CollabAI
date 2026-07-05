import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Clock,
  Briefcase,
  Layers,
  MessageSquare,
  ShieldCheck,
  User,
  ExternalLink,
  ChevronRight,
  Sparkles,
  AlertCircle,
  X,
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import GlassCard, {
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
} from "../components/ui/GlassCard";
import Skeleton from "../components/ui/Skeleton";
import Badge from "../components/ui/Badge";
import Avatar from "../components/common/Avatar";
import { getCategoryStyles } from "./MarketplacePage";
import toast from "react-hot-toast";

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [showHireModal, setShowHireModal] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectBudget, setProjectBudget] = useState("");
  const [projectDeadline, setProjectDeadline] = useState("");

  // Query service details by ID from backend API
  const { data: service, isLoading, error } = useQuery({
    queryKey: ["service-detail", id],
    queryFn: async () => {
      const response = await api.get(`/services/${id}`);
      return response.data?.service;
    },
    enabled: !!id,
  });

  // Load defaults once service details are loaded
  useEffect(() => {
    if (service) {
      setProjectTitle(`Contract for: ${service.title}`);
      setProjectDesc(service.description || "");
      setProjectBudget(service.pricing || "");
      
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + (service.deliveryTimeline || 7));
      setProjectDeadline(targetDate.toISOString().split("T")[0]);
    }
  }, [service]);

  const handleHireClick = () => {
    if (!user) {
      toast.error("Authentication required to hire a specialist.");
      setTimeout(() => (window.location.href = "/login"), 1000);
      return;
    }
    if (!user.roles?.includes("client")) {
      toast.error("Only client accounts can issue project proposals.");
      return;
    }
    setShowHireModal(true);
  };

  const handleHireSubmit = async (e) => {
    e.preventDefault();
    if (!projectTitle.trim() || !projectDesc.trim() || !projectBudget) return;

    try {
      const res = await api.post("/projects", {
        freelancer: service.freelancer._id || service.freelancer,
        title: projectTitle.trim(),
        description: projectDesc.trim(),
        category: service.category,
        budget: Number(projectBudget),
        deadline: new Date(projectDeadline).toISOString(),
      });
      toast.success("Project contract proposed and escrow locked!", { icon: "🛡️" });
      setShowHireModal(false);
      window.location.href = `/projects/${res.data._id}`;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to establish escrow contract.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-base p-6 md:p-12 space-y-6">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center p-6 select-none font-sans">
        <GlassCard className="text-center p-8 space-y-4 max-w-md bg-[#0b0f19]/75 border-white/8 backdrop-blur-2xl">
          <AlertCircle className="text-rose-400 mx-auto" size={32} />
          <h3 className="text-lg font-bold text-white">Service Not Found</h3>
          <p className="text-xs text-gray-400 font-light">
            We couldn't retrieve the details of the requested service from the database server.
          </p>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = "/marketplace")}>
            Back to Marketplace
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-bg-base text-gray-200 p-4 md:p-8 lg:p-12 overflow-hidden select-none font-sans">
      <div className="absolute inset-0 noise-overlay pointer-events-none z-50 opacity-2" />
      <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none z-0" />

      {/* Visual background spot */}
      <div className="absolute top-[-100px] left-[15%] h-[600px] w-[600px] rounded-full bg-primary glow-circle opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <a
            href="/marketplace"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Marketplace</span>
          </a>
        </div>

        {/* Hero Cover Banner Layout */}
        <div className={`relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br ${styles.gradient} p-8 md:p-12 flex flex-col justify-end min-h-[220px] shadow-2xl`}>
          <div className="absolute inset-0 grid-overlay opacity-15 pointer-events-none" />
          <div className="absolute top-6 right-6 h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
            <IconComponent size={24} className={styles.accent} />
          </div>
          
          <div className="space-y-3 relative z-10 max-w-3xl">
            <Badge variant="accent" size="sm" className="lowercase font-mono">{service.category}</Badge>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {service.title}
            </h1>
            
            {/* Freelancer details summary */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-2 font-sans">
              <div className="flex items-center gap-2">
                <Avatar user={service.freelancer} size="sm" />
                <span className="font-bold text-white">{service.freelancer?.name}</span>
              </div>
              <span className="h-1 w-1 rounded-full bg-gray-600" />
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star size={12} className="fill-amber-400 stroke-amber-400" />
                <span>{service.rating.toFixed(1)}</span>
                <span className="text-gray-500 font-light font-sans">({service.totalReviews || 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Content Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Description, Skills, Reviews (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Gig Description */}
            <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Briefcase size={16} className="text-primary" />
                <span>Service Description</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </GlassCard>

            {/* Vetted skills */}
            <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Layers size={16} className="text-secondary" />
                <span>Skills & Frameworks</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {/* Dynamically fallback to basic tags based on category */}
                {service.category.toLowerCase().includes("ai") ? (
                  ["python", "langchain", "gemini", "vector-db", "prompt-chaining"].map((tag) => (
                    <Badge key={tag} variant="outline" size="sm" className="font-mono">{tag}</Badge>
                  ))
                ) : service.category.toLowerCase().includes("design") ? (
                  ["figma", "ui-ux", "wireframing", "vector-assets", "responsive"].map((tag) => (
                    <Badge key={tag} variant="outline" size="sm" className="font-mono">{tag}</Badge>
                  ))
                ) : (
                  ["javascript", "react", "node.js", "tailwind-css", "mongodb"].map((tag) => (
                    <Badge key={tag} variant="outline" size="sm" className="font-mono">{tag}</Badge>
                  ))
                )}
              </div>
            </GlassCard>

            {/* Reviews list - Visual empty state */}
            <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <MessageSquare size={16} className="text-accent" />
                <span>Reviews & Feedback</span>
              </h3>
              
              <div className="py-10 border border-dashed border-white/8 rounded-xl bg-white/2 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <Star className="text-gray-600 animate-pulse-slow" size={24} />
                <div>
                  <p className="text-xs text-gray-400 font-bold">No feedback received yet</p>
                  <p className="text-[10px] text-gray-500 font-light max-w-xs mt-1 leading-relaxed">
                    This gig description is ready. Reviews are generated and published automatically upon successful escrow contract releases and milestone completions.
                  </p>
                </div>
              </div>
            </GlassCard>

          </div>

          {/* Right Column: Sticky checkout card (4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            
            <GlassCard hoverGlow className="bg-[#0b0f19]/80 border-white/10 backdrop-blur-2xl shadow-2xl p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-semibold text-gray-400">Starting Price</span>
                  <span className="text-2xl font-black text-white font-mono">
                    ${service.pricing}
                    <span className="text-xs font-normal text-gray-500">/hr</span>
                  </span>
                </div>

                <hr className="border-white/5" />

                <div className="space-y-2.5 text-xs text-gray-300 font-light">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-primary" />
                      <span>Delivery Timeline</span>
                    </div>
                    <span className="font-bold text-white font-mono">{service.deliveryTimeline} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-400" />
                      <span>Escrow Secured</span>
                    </div>
                    <span className="text-emerald-400 font-bold font-mono">100% Locked</span>
                  </div>
                </div>

                <hr className="border-white/5" />

                {/* Checklist detail items */}
                <div className="space-y-2 text-[11px] text-gray-400 font-light font-sans">
                  <p>✔ Auto-generated milestone deliverables</p>
                  <p>✔ Access to project workspace channels</p>
                  <p>✔ Escrow release upon milestone checks</p>
                </div>

                <Button
                  variant="primary"
                  className="w-full text-xs font-bold py-3 mt-2 shadow-neon-primary"
                  onClick={handleHireClick}
                >
                  Hire Specialist
                </Button>
              </div>
            </GlassCard>

            {/* Small card detailing freelancer profile */}
            <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-4 flex items-center gap-3">
              <Avatar user={service.freelancer} size="md" />
              <div>
                <p className="text-xs font-bold text-white">{service.freelancer?.name}</p>
                <p className="text-[10px] text-gray-500 font-light mt-0.5 truncate max-w-[160px]">{service.freelancer?.email}</p>
              </div>
              <button
                className="ml-auto p-2 rounded bg-white/3 hover:bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                onClick={() => toast.success("Freelancer portfolio profiles will be active in the Phase 5 detail releases.")}
                title="View Freelancer profile"
              >
                <ExternalLink size={12} />
              </button>
            </GlassCard>

          </div>

        </div>
      </div>

      <AnimatePresence>
        {showHireModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0b0f19]/90 border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl font-sans"
            >
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Briefcase size={16} className="text-primary" />
                  <span>Establish Project Escrow</span>
                </h3>
                <button
                  onClick={() => setShowHireModal(false)}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleHireSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] text-gray-400 font-bold uppercase pl-0.5">Contract Title</label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-xs bg-white/3 border border-white/8 rounded text-white focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-gray-400 font-bold uppercase pl-0.5">Specifications & Description</label>
                  <textarea
                    rows="4"
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-xs bg-white/3 border border-white/8 rounded text-white focus:outline-none focus:border-indigo-500/50 transition-all resize-none font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] text-gray-400 font-bold uppercase pl-0.5">Project Budget ($)</label>
                    <input
                      type="number"
                      value={projectBudget}
                      onChange={(e) => setProjectBudget(e.target.value)}
                      required
                      min="1"
                      className="w-full px-3.5 py-2 text-xs bg-white/3 border border-white/8 rounded text-white focus:outline-none focus:border-indigo-500/50 transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] text-gray-400 font-bold uppercase pl-0.5">Target Deadline</label>
                    <input
                      type="date"
                      value={projectDeadline}
                      onChange={(e) => setProjectDeadline(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 text-xs bg-white/3 border border-white/8 rounded text-white focus:outline-none focus:border-indigo-500/50 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full text-xs font-bold py-2.5"
                    onClick={() => setShowHireModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full text-xs font-bold py-2.5 shadow-neon-primary"
                  >
                    Lock Escrow & Propose
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.015;
        }
      `}</style>
    </div>
  );
}
