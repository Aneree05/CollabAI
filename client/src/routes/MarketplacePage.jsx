import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Star,
  DollarSign,
  ArrowRight,
  Sparkles,
  Layers,
  Terminal,
  ShieldCheck,
  ChevronDown,
  Briefcase,
  AlertCircle,
  HelpCircle,
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
import toast from "react-hot-toast";

// Dynamic cover banner styles mapping to category names
export function getCategoryStyles(category = "") {
  const normCat = category.toLowerCase();
  if (normCat.includes("ai")) {
    return {
      gradient: "from-cyan-500/10 via-indigo-500/5 to-accent/5",
      border: "border-cyan-500/10",
      accent: "text-cyan-400",
      icon: Sparkles,
    };
  } else if (normCat.includes("design") || normCat.includes("ui")) {
    return {
      gradient: "from-purple-500/10 via-pink-500/5 to-secondary/5",
      border: "border-purple-500/10",
      accent: "text-purple-400",
      icon: Layers,
    };
  } else if (normCat.includes("web3")) {
    return {
      gradient: "from-amber-500/10 via-orange-500/5 to-highlight/5",
      border: "border-amber-500/10",
      accent: "text-amber-400",
      icon: ShieldCheck,
    };
  } else {
    return {
      gradient: "from-indigo-500/10 via-blue-500/5 to-primary/5",
      border: "border-indigo-500/10",
      accent: "text-primary",
      icon: Terminal,
    };
  }
}

// Marketplace Card component with hover-prefetching functionality
function MarketplaceServiceCard({ service }) {
  const queryClient = useQueryClient();
  const styles = getCategoryStyles(service.category);
  const IconComponent = styles.icon;

  // Prefetches details on mouse hover to optimize load performance
  const handlePrefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ["service-detail", service._id],
      queryFn: async () => {
        const response = await api.get(`/services/${service._id}`);
        return response.data?.service;
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <motion.div
      onMouseEnter={handlePrefetch}
      whileHover={{ y: -4, scale: 1.01 }}
      className="cursor-pointer"
      onClick={() => (window.location.href = `/marketplace/services/${service._id}`)}
    >
      <GlassCard hoverGlow className="bg-[#0b0f19]/75 border-white/8 h-full flex flex-col justify-between p-0 overflow-hidden">
        {/* Dynamic Category cover art placeholder */}
        <div className={`h-32 w-full bg-gradient-to-br ${styles.gradient} border-b border-white/5 relative flex items-center justify-center`}>
          <div className="absolute inset-0 grid-overlay opacity-15 pointer-events-none" />
          <IconComponent size={32} className={`${styles.accent} opacity-60 animate-pulse-slow`} />
          <div className="absolute bottom-3 left-4">
            <Badge variant="outline" size="sm" className="text-[9px] lowercase font-mono">
              {service.category}
            </Badge>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            {/* Freelancer Info */}
            <div className="flex items-center gap-2">
              <Avatar user={service.freelancer} size="sm" />
              <div>
                <p className="text-xs font-bold text-white leading-normal truncate max-w-[120px]">
                  {service.freelancer?.name || "Professional"}
                </p>
                <p className="text-[9px] text-gray-500 font-light truncate">freelancer</p>
              </div>
            </div>

            <h4 className="text-sm font-extrabold text-white line-clamp-1 hover:text-primary transition-colors mt-2">
              {service.title}
            </h4>
            <p className="text-xs text-gray-400 font-light line-clamp-2 leading-relaxed">
              {service.description}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-wider">Starting Rate</p>
              <p className="text-base font-black text-white font-mono mt-0.5">
                ${service.pricing}
                <span className="text-[10px] font-normal text-gray-500">/hr</span>
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-white/3 border border-white/5 px-2.5 py-1 rounded text-xs">
              <Star size={12} className="fill-amber-400 stroke-amber-400" />
              <span className="font-bold text-amber-400">{service.rating.toFixed(1)}</span>
              <span className="text-gray-500 font-light">({service.totalReviews || 0})</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  // Query marketplace listings based on query parameters exactly matching the backend
  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ["services", { search, category, minPrice, maxPrice, rating }],
    queryFn: async () => {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category && category !== "all") params.category = category;
      if (minPrice) params.minPrice = Number(minPrice);
      if (maxPrice) params.maxPrice = Number(maxPrice);
      if (rating && rating !== "all") params.rating = Number(rating);

      const response = await api.get("/services", { params });
      return response.data?.services || [];
    },
  });

  // Client-side sorting logic
  const sortedServices = [...services].sort((a, b) => {
    if (sortBy === "price-asc") return a.pricing - b.pricing;
    if (sortBy === "price-desc") return b.pricing - a.pricing;
    if (sortBy === "rating") return b.rating - a.rating;
    // Fallback date sort (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="relative min-h-screen bg-bg-base text-gray-200 p-6 md:p-8 lg:p-12 overflow-hidden select-none font-sans">
      <div className="absolute inset-0 noise-overlay pointer-events-none z-50 opacity-2" />
      <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none z-0" />
      
      {/* Visual background ambient spots */}
      <div className="absolute top-[-100px] left-[5%] h-[500px] w-[500px] rounded-full bg-primary glow-circle opacity-5 pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[5%] h-[500px] w-[500px] rounded-full bg-secondary glow-circle opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="accent" size="sm" className="mb-2">Phase 4 Active</Badge>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Freelance Marketplace
            </h1>
            <p className="text-xs text-gray-400 font-light mt-1">
              Hire vetted specialists and AI developers to commission escrow project contracts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/marketplace/my-services")}
              className="flex items-center gap-1.5 font-bold text-xs"
            >
              <span>Manage My Gigs</span>
            </Button>
            <Button
              variant="primary"
              onClick={() => (window.location.href = "/marketplace/services/new")}
              className="flex items-center gap-1.5 font-bold text-xs shadow-neon-primary"
            >
              <span>Publish Gig</span>
            </Button>
          </div>
        </div>

        {/* Global Controls Panel */}
        <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Search Input (4 cols) */}
            <div className="lg:col-span-4 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search gigs description or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-lg border border-white/8 bg-white/3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
              />
            </div>

            {/* Price ranges min/max (3 cols) */}
            <div className="lg:col-span-3 flex items-center gap-2">
              <div className="relative flex-1">
                <DollarSign size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="number"
                  placeholder="Min price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full pl-7 pr-2.5 py-2.5 text-xs rounded-lg border border-white/8 bg-white/3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
                />
              </div>
              <span className="text-gray-500 text-xs">-</span>
              <div className="relative flex-1">
                <DollarSign size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="number"
                  placeholder="Max price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full pl-7 pr-2.5 py-2.5 text-xs rounded-lg border border-white/8 bg-white/3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
                />
              </div>
            </div>

            {/* Rating Filter (2 cols) */}
            <div className="lg:col-span-2">
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-lg border border-white/8 bg-white/3 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
              >
                <option value="all">Any Rating</option>
                <option value="4">4.0+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="5">5.0 Stars</option>
              </select>
            </div>

            {/* Sorting (3 cols) */}
            <div className="lg:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-lg border border-white/8 bg-white/3 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
              >
                <option value="rating">Sort by Rating</option>
                <option value="date">Sort by Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Filter horizontal chips */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5 justify-start">
            {[
              { id: "all", label: "All Areas" },
              { id: "AI Engineering", label: "AI Engineering" },
              { id: "UI/UX Design", label: "UI/UX Design" },
              { id: "Fullstack", label: "Fullstack Dev" },
              { id: "Web3", label: "Web3 Dev" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                  category === cat.id
                    ? "bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-md"
                    : "bg-white/3 border-white/5 text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Services Listings grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : error ? (
          <div className="py-12 text-center border border-dashed border-rose-500/20 rounded-xl bg-rose-500/3 max-w-md mx-auto space-y-3">
            <AlertCircle className="text-rose-400 mx-auto" size={28} />
            <h4 className="text-sm font-bold text-white">Database Sync Interrupted</h4>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              We encountered an issue attempting to stream service catalog lists from the backend server.
            </p>
          </div>
        ) : sortedServices.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-white/8 rounded-2xl bg-white/2 max-w-md mx-auto space-y-4">
            <Briefcase className="text-gray-600 mx-auto" size={32} />
            <div>
              <h4 className="text-sm font-bold text-white">No Services Found</h4>
              <p className="text-xs text-gray-500 font-light mt-0.5 leading-relaxed">
                Try expanding your search boundaries or selecting another category filter area.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedServices.map((service) => (
              <MarketplaceServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.015;
        }
      `}</style>
    </div>
  );
}
