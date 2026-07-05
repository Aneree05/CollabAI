import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Search,
  DollarSign,
  Clock,
  Activity,
  Briefcase,
  AlertCircle,
  Bell,
  Sliders,
  ChevronRight,
  TrendingUp,
  User,
  Grid,
  List,
  CheckCircle,
  Clock3,
  XCircle,
  ExternalLink,
  ChevronDown,
  Star,
  FileCode,
  Layers,
  Settings,
  PlusCircle,
  FolderKanban,
  Edit2,
  Trash2,
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
import MetricCard from "../components/ui/MetricCard";
import Skeleton from "../components/ui/Skeleton";
import Badge from "../components/ui/Badge";
import Avatar from "../components/common/Avatar";
import Tabs from "../components/ui/Tabs";
import Timeline from "../components/ui/Timeline";
import ChartWrapper from "../components/charts/ChartWrapper";
import { getProjectStatusBadge } from "./ClientDashboard";
import { getCategoryStyles } from "./MarketplacePage";
import Modal from "../components/ui/Modal";
import toast from "react-hot-toast";

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // Tabs layout configuration
  const tabsConfig = [
    { id: "overview", label: "Studio Overview", icon: Sparkles },
    { id: "services", label: "My Gigs & Services", icon: FileCode },
    { id: "projects", label: "Active Contracts", icon: Briefcase },
    { id: "reviews", label: "Performance & Reviews", icon: Star },
  ];

  // 1. Fetch Freelancer Dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["freelancer-stats"],
    queryFn: async () => {
      const res = await api.get("/dashboard/freelancer");
      return res.data;
    },
  });

  // 2. Fetch Freelancer Projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["freelancer-projects"],
    queryFn: async () => {
      const res = await api.get("/projects");
      return res.data || [];
    },
  });

  // 3. Fetch Freelancer Services
  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await api.get("/services");
      return res.data?.services || [];
    },
  });

  // Filter freelancer's owned services
  const myServices = services.filter((service) => {
    const freelancerId = service.freelancer?._id || service.freelancer;
    return freelancerId === user?._id;
  });

  // Calculate freelancer metrics summary
  const totalGigs = myServices.length;
  const avgRating =
    myServices.reduce((acc, curr) => acc + (curr.rating || 0), 0) / (totalGigs || 1);

  // 4. Fetch notifications
  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ["freelancer-notifications"],
    queryFn: async () => {
      const res = await api.get("/notifications");
      return res.data || [];
    },
  });

  const acceptMutation = useMutation({
    mutationFn: async (projectId) => {
      const res = await api.patch(`/projects/${projectId}/accept`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Contract project accepted!");
      queryClient.invalidateQueries({ queryKey: ["freelancer-projects"] });
      queryClient.invalidateQueries({ queryKey: ["freelancer-stats"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to accept contract.");
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async (projectId) => {
      const res = await api.patch(`/projects/${projectId}/reject`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Contract project declined.");
      queryClient.invalidateQueries({ queryKey: ["freelancer-projects"] });
      queryClient.invalidateQueries({ queryKey: ["freelancer-stats"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to decline contract.");
    }
  });

  const statusMutation = useMutation({
    mutationFn: async ({ projectId, status }) => {
      const res = await api.patch(`/projects/${projectId}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Project progress updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["freelancer-projects"] });
      queryClient.invalidateQueries({ queryKey: ["freelancer-stats"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to progress milestone.");
    }
  });

  return (
    <div className="space-y-8 animate-fade-in font-sans select-none pb-12">
      {/* Welcome Banner & Profile Summary */}
      <div className="relative rounded-2xl glass-panel p-8 overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-r from-secondary/10 via-primary/5 to-accent/5">
        <div className="absolute inset-0 grid-overlay opacity-15 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar user={user} size="lg" />
            <div className="space-y-1">
              <Badge variant="primary" size="sm" className="mb-1">Freelancer Workspace</Badge>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Studio Space: <span className="text-secondary text-gradient-neon">{user?.name}</span>
              </h1>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Registered: <span className="text-white font-mono">{user?.email}</span> • Skills: {user?.skills?.join(", ") || "Fullstack Dev"}
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={() =>
              toast.success(
                `Profile Detail: Experience: ${user?.experience || "Expert"}, Portfolio: ${
                  user?.portfolio || "Registered"
                }`
              )
            }
            className="flex-shrink-0 text-xs font-bold"
          >
            <User size={13} className="mr-1.5" />
            <span>Profile Summary</span>
          </Button>
        </div>
      </div>

      {/* Tabs navigation */}
      <Tabs tabs={tabsConfig} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Contents */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <OverviewTab
            stats={stats}
            projects={projects}
            myServices={myServices}
            notifications={notifications}
            statsLoading={statsLoading}
            projectsLoading={projectsLoading}
            servicesLoading={servicesLoading}
            avgRating={avgRating}
          />
        )}

        {activeTab === "services" && (
          <ServicesTab myServices={myServices} isLoading={servicesLoading} />
        )}

        {activeTab === "projects" && (
          <ProjectsTab
            projects={projects}
            isLoading={projectsLoading}
            onAccept={(pid) => acceptMutation.mutate(pid)}
            onReject={(pid) => rejectMutation.mutate(pid)}
            onUpdateStatus={(pid, st) => statusMutation.mutate({ projectId: pid, status: st })}
          />
        )}

        {activeTab === "reviews" && (
          <ReviewsTab avgRating={avgRating} myServices={myServices} />
        )}
      </div>
    </div>
  );
}

// ==========================================
// 1. OVERVIEW TAB SCREEN COMPONENT
// ==========================================
function OverviewTab({
  stats,
  projects,
  myServices,
  notifications,
  statsLoading,
  projectsLoading,
  servicesLoading,
  avgRating,
}) {
  const queryClient = useQueryClient();
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  // Chart data formatting based on active contracts budget
  const chartData = projects.slice(0, 6).map((p, idx) => ({
    name: p.title.substring(0, 10) + "...",
    value: p.budget || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Metric stats card list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          <>
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </>
        ) : (
          <>
            <MetricCard title="Total Published Gigs" value={`${stats?.totalServices || myServices.length} Services`} trend={0} icon={FileCode} sparklineData={[0, myServices.length]} />
            <MetricCard title="Active Contracts" value={`${stats?.activeProjects || 0} Gigs`} trend={12.4} icon={Activity} sparklineData={[0, stats?.activeProjects]} className="text-accent" />
            <MetricCard title="Completed Jobs" value={`${stats?.completedProjects || 0} Gigs`} trend={3.5} icon={CheckCircle} sparklineData={[0, stats?.completedProjects]} className="text-success" />
            <MetricCard title="Studio Quality Rating" value={`${avgRating.toFixed(1)} / 5.0`} trend={0} icon={Star} sparklineData={[4.2, 4.5, avgRating]} className="text-warning" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: budget flow and recent active contracts (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* budget Flow chart */}
          <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Active Contract Payout Volume ($)</span>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                <TrendingUp size={12} />
                <span>Volume Stream</span>
              </div>
            </div>
            <div className="h-64">
              {projectsLoading ? (
                <Skeleton className="h-full w-full" />
              ) : chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center border border-dashed border-white/5 rounded-xl text-gray-500 text-xs">
                  Awaiting active contract details to render payouts flow...
                </div>
              ) : (
                <ChartWrapper data={chartData} strokeColor="#10B981" chartTitle="Contract Payouts ($)" />
              )}
            </div>
          </GlassCard>

          {/* Recent projects list summary */}
          <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Briefcase size={16} className="text-primary" />
              <span>Active Freelance Contracts</span>
            </h3>

            {projectsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : projects.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-white/5 rounded-xl text-gray-500 text-xs">
                No active contracts assigned.
              </div>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 3).map((p) => {
                  const statBadge = getProjectStatusBadge(p.status);
                  return (
                    <div
                      key={p._id}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 transition-colors text-xs"
                    >
                      <div className="space-y-1">
                        <p className="font-bold text-white">{p.title}</p>
                        <p className="text-[10px] text-gray-500 font-light truncate max-w-[280px]">
                          Client: {p.client?.name || "Corporate"}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono font-bold text-white">${p.budget}</span>
                        <Badge variant={statBadge.variant} size="sm">
                          {statBadge.text}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Side: Quick Actions & Notifications alert list (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Actions Panel */}
          <GlassCard className="bg-[#0b0f19]/75 border-white/10 backdrop-blur-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Sliders size={16} className="text-indigo-400" />
              <span>Gig Control Center</span>
            </h3>
            
            <div className="space-y-2">
              <button
                onClick={() => (window.location.href = "/marketplace/services/new")}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 hover:border-indigo-500/20 text-left transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle size={14} className="text-primary" />
                  <div>
                    <p className="text-xs font-bold text-white">Create Service Gig</p>
                    <p className="text-[9px] text-gray-500 font-light mt-0.5">Publish new listing</p>
                  </div>
                </div>
                <ChevronRight size={13} className="text-gray-500" />
              </button>

              <button
                onClick={() => (window.location.href = "/marketplace/my-services")}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 hover:border-secondary/20 text-left transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <FileCode size={14} className="text-secondary" />
                  <div>
                    <p className="text-xs font-bold text-white">Manage My Services</p>
                    <p className="text-[9px] text-gray-500 font-light mt-0.5">Edit cover pricing lists</p>
                  </div>
                </div>
                <ChevronRight size={13} className="text-gray-500" />
              </button>

              <button
                onClick={() => toast.success("Escrow performance diagnostics launching in the Phase 7 release.")}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 hover:border-accent/20 text-left transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Star size={14} className="text-accent" />
                  <div>
                    <p className="text-xs font-bold text-white">Vetted Rating Analytics</p>
                    <p className="text-[9px] text-gray-500 font-light mt-0.5">Audit reviews & grades</p>
                  </div>
                </div>
                <ChevronRight size={13} className="text-gray-500" />
              </button>
            </div>
          </GlassCard>

          {/* Alerts feed */}
          <GlassCard className="bg-[#0b0f19]/75 border-white/10 backdrop-blur-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bell size={16} className="text-accent animate-pulse-slow" />
                <span>Recent Studio Alerts</span>
              </h3>
              {unreadNotifications.length > 0 && (
                <Badge variant="danger" size="sm" className="font-bold">
                  {unreadNotifications.length} new
                </Badge>
              )}
            </div>

            {notifications.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6 font-light">No alert entries log.</p>
            ) : (
              <div className="space-y-3.5">
                {notifications.slice(0, 3).map((not) => (
                  <div key={not._id} className="text-[11px] leading-normal space-y-0.5 border-b border-white/4 pb-2 last:border-b-0 last:pb-0">
                    <p className="font-bold text-gray-300 flex justify-between items-center">
                      <span>{not.title}</span>
                      {!not.isRead && <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />}
                    </p>
                    <p className="text-gray-500 font-light mt-0.5">{not.message}</p>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

        </div>

      </div>
    </div>
  );
}

// ==========================================
// 2. SERVICES TAB SCREEN COMPONENT
// ==========================================
function ServicesTab({ myServices, isLoading }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [layoutMode, setLayoutMode] = useState("grid");
  const [sortBy, setSortBy] = useState("pricing");
  const queryClient = useQueryClient();

  // Delete Mutation with Optimistic Updates
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/services/${id}`);
      return response.data;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["services"] });
      const previousServices = queryClient.getQueryData(["services"]);
      queryClient.setQueryData(["services"], (old = []) =>
        old.filter((service) => service._id !== deletedId)
      );
      return { previousServices };
    },
    onError: (err, deletedId, context) => {
      if (context?.previousServices) {
        queryClient.setQueryData(["services"], context.previousServices);
      }
      toast.error(err.response?.data?.message || "Failed to delete service.");
    },
    onSuccess: () => {
      toast.success("Service successfully deleted.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Confirm deletion of this service gig? This action is destructive.")) {
      deleteMutation.mutate(id);
    }
  };

  const filtered = myServices.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-desc") return b.pricing - a.pricing;
    if (sortBy === "price-asc") return a.pricing - b.pricing;
    return b.rating - a.rating;
  });

  return (
    <div className="space-y-6">
      <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search published services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-lg border border-white/8 bg-white/3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 text-xs rounded-lg border border-white/8 bg-white/3 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-sans min-w-[130px]"
            >
              <option value="all">Any Category</option>
              <option value="AI Engineering">AI Engineering</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Fullstack">Fullstack Dev</option>
              <option value="Web3">Web3 Dev</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 text-xs rounded-lg border border-white/8 bg-white/3 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-sans min-w-[130px]"
            >
              <option value="pricing">Sort by Price</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
            </select>

            <div className="flex p-0.8 rounded-lg bg-white/3 border border-white/5">
              <button
                onClick={() => setLayoutMode("grid")}
                className={`p-1.5 rounded cursor-pointer transition-colors ${
                  layoutMode === "grid" ? "bg-white/5 text-white" : "text-gray-400 hover:text-white"
                }`}
                aria-label="Grid Mode"
              >
                <Grid size={14} />
              </button>
              <button
                onClick={() => setLayoutMode("list")}
                className={`p-1.5 rounded cursor-pointer transition-colors ${
                  layoutMode === "list" ? "bg-white/5 text-white" : "text-gray-400 hover:text-white"
                }`}
                aria-label="List Mode"
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>
      </GlassCard>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-white/8 rounded-xl bg-white/2 max-w-md mx-auto">
          <p className="text-xs text-gray-400 font-bold">No published services found</p>
          <p className="text-[10px] text-gray-500 mt-1 font-light">Add new gig slots to the marketplace catalog list.</p>
        </div>
      ) : layoutMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((s) => {
            const coverStyles = getCategoryStyles(s.category);
            const IconComp = coverStyles.icon;
            return (
              <motion.div key={s._id} whileHover={{ y: -3 }}>
                <GlassCard hoverGlow className="bg-[#0b0f19]/75 border-white/8 h-full flex flex-col justify-between p-0 overflow-hidden">
                  <div className={`h-24 w-full bg-gradient-to-br ${coverStyles.gradient} border-b border-white/5 flex items-center justify-center relative`}>
                    <IconComp size={24} className={`${coverStyles.accent} opacity-60`} />
                    <div className="absolute bottom-2 left-3">
                      <Badge variant="outline" size="sm" className="text-[8px] lowercase font-mono">
                        {s.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-white hover:text-primary transition-colors cursor-pointer" onClick={() => window.location.href = `/marketplace/services/${s._id}`}>
                        {s.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 font-light line-clamp-2 leading-relaxed">
                        {s.description}
                      </p>
                    </div>

                    <div className="border-t border-white/5 pt-3 flex items-center justify-between text-xs mt-2">
                      <div>
                        <p className="text-[8px] text-gray-500 uppercase tracking-widest">Pricing rate</p>
                        <p className="font-mono font-black text-white mt-0.5">${s.pricing}/hr</p>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => window.location.href = `/marketplace/services/${s._id}/edit`}
                          className="p-1.5 rounded bg-white/5 text-gray-400 hover:text-white cursor-pointer"
                        >
                          <Edit2 size={11} />
                        </button>
                        <button
                          onClick={() => handleDelete(s._id)}
                          className="p-1.5 rounded bg-white/5 text-rose-400 hover:text-rose-300 cursor-pointer"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((s) => (
            <div
              key={s._id}
              className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 transition-colors text-xs"
            >
              <div className="space-y-0.5">
                <p className="font-bold text-white hover:text-primary transition-colors cursor-pointer" onClick={() => window.location.href = `/marketplace/services/${s._id}`}>
                  {s.title}
                </p>
                <p className="text-[10px] text-gray-500 font-light font-mono">{s.category} • {s.deliveryTimeline}d delivery</p>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-white">${s.pricing}</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => window.location.href = `/marketplace/services/${s._id}/edit`}
                    className="p-1.5 rounded bg-white/5 text-gray-400 hover:text-white cursor-pointer"
                  >
                    <Edit2 size={11} />
                  </button>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="p-1.5 rounded bg-white/5 text-rose-400 hover:text-rose-300 cursor-pointer"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. PROJECTS TAB SCREEN COMPONENT
// ==========================================
function ProjectsTab({ projects, isLoading, onAccept, onReject, onUpdateStatus }) {
  return (
    <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6">
      <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
        <Briefcase size={16} className="text-secondary animate-pulse-slow" />
        <span>Active Contract Gigs</span>
      </h3>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-14 w-full" />
        </div>
      ) : projects.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-white/5 rounded-xl text-gray-500 text-xs">
          No contract projects matched your freelancer account details.
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => {
            const statBadge = getProjectStatusBadge(p.status);
            return (
              <div
                key={p._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 hover:border-indigo-500/20 transition-all text-xs gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className="font-bold text-white hover:text-primary transition-colors cursor-pointer"
                      onClick={() => (window.location.href = `/projects/${p._id}`)}
                    >
                      {p.title}
                    </p>
                    <Badge variant="outline" size="sm" className="font-mono text-[9px] lowercase">
                      {p.category}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-gray-500 font-light truncate max-w-xl">
                    {p.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-6">
                  <div className="text-right font-mono">
                    <p className="font-bold text-white">${p.budget}</p>
                    <p className="text-[9px] text-gray-500 mt-0.5">
                      Deadline: {new Date(p.deadline).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={statBadge.variant} size="sm" className="min-w-[70px] text-center">
                      {statBadge.text}
                    </Badge>

                    {/* Interactive Accept / Reject controls */}
                    {p.status === "Pending" && (
                      <div className="flex gap-1.5">
                        <Button
                          variant="primary"
                          className="px-2.5 py-1 text-[10px] font-bold"
                          onClick={() => onAccept(p._id)}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          className="px-2.5 py-1 text-[10px] font-bold text-rose-400 border-rose-500/20 hover:border-rose-500/40"
                          onClick={() => onReject(p._id)}
                        >
                          Decline
                        </Button>
                      </div>
                    )}

                    {p.status === "Accepted" && (
                      <Button
                        variant="secondary"
                        className="px-3 py-1 text-[10px] font-bold"
                        onClick={() => onUpdateStatus(p._id, "In Progress")}
                      >
                        Start Project
                      </Button>
                    )}

                    {p.status === "In Progress" && (
                      <Button
                        variant="primary"
                        className="px-3 py-1 text-[10px] font-bold !bg-emerald-500 hover:!bg-emerald-600 shadow-neon-success"
                        onClick={() => onUpdateStatus(p._id, "Completed")}
                      >
                        Complete
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      className="px-2.5 py-1 text-[10px] font-bold text-gray-400 border-white/5 hover:border-white/10"
                      onClick={() => (window.location.href = `/projects/${p._id}`)}
                    >
                      Workspace
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}

// ==========================================
// 4. REVIEWS TAB SCREEN COMPONENT
// ==========================================
function ReviewsTab({ avgRating, myServices }) {
  const reviewsCount = myServices.reduce((acc, curr) => acc + (curr.totalReviews || 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Average rating summary (4 cols) */}
      <div className="lg:col-span-4 space-y-6">
        <GlassCard className="bg-[#0b0f19]/75 border-white/8 backdrop-blur-2xl p-6 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Quality score</p>
          <h2 className="text-5xl font-black text-white font-mono mt-3 mb-2">{avgRating.toFixed(1)}</h2>
          
          <div className="flex justify-center gap-1.5 text-amber-400 mb-4">
            <Star size={16} className="fill-amber-400" />
            <Star size={16} className="fill-amber-400" />
            <Star size={16} className="fill-amber-400" />
            <Star size={16} className="fill-amber-400" />
            <Star size={16} className={avgRating >= 4.7 ? "fill-amber-400" : "opacity-35"} />
          </div>

          <p className="text-[11px] text-gray-500 font-light">
            Calculated across {reviewsCount} feedback ratings in active service descriptions.
          </p>
        </GlassCard>
      </div>

      {/* Reviews feed (8 cols) - Visual empty state as per backend routes limitations */}
      <div className="lg:col-span-8">
        <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Star size={16} className="text-warning animate-pulse-slow" />
            <span>Vetted Review Streams</span>
          </h3>

          <div className="py-12 border border-dashed border-white/8 rounded-xl bg-white/2 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <Star className="text-gray-600 animate-pulse" size={24} />
            <div>
              <p className="text-xs text-gray-400 font-bold">Feedback entries empty</p>
              <p className="text-[10px] text-gray-500 font-light max-w-sm mt-1 leading-relaxed">
                Your services catalog ratings are generated and verified automatically upon client milestone checkouts. Active contract logs will populate comments here.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

    </div>
  );
}
