import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Search,
  Filter,
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
  Brain,
  Calculator,
  UserCheck,
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
import toast from "react-hot-toast";

// Mappings for project status styling badges
export function getProjectStatusBadge(status = "") {
  const norm = status.toLowerCase();
  if (norm === "pending") return { variant: "warning", text: "Pending" };
  if (norm === "accepted") return { variant: "primary", text: "Accepted" };
  if (norm === "in progress") return { variant: "accent", text: "Active" };
  if (norm === "completed") return { variant: "success", text: "Completed" };
  return { variant: "danger", text: "Cancelled" };
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // Tab configurations
  const tabsConfig = [
    { id: "overview", label: "Overview Workspace", icon: Sparkles },
    { id: "projects", label: "My Projects", icon: FolderKanbanIcon },
    { id: "activities", label: "Chronological Logs", icon: Activity },
    { id: "notifications", label: "Notifications Feed", icon: Bell },
  ];

  // Helper custom icon since FolderKanban is not imported
  function FolderKanbanIcon(props) {
    return <Briefcase {...props} />;
  }

  // 1. Fetch Client Dashboard Metrics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["client-stats"],
    queryFn: async () => {
      const res = await api.get("/dashboard/client");
      return res.data;
    },
  });

  // 2. Fetch Projects list
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["client-projects"],
    queryFn: async () => {
      const res = await api.get("/projects");
      return res.data || [];
    },
  });

  // 3. Fetch Notifications list
  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ["client-notifications"],
    queryFn: async () => {
      const res = await api.get("/notifications");
      return res.data || [];
    },
  });

  // 4. Fetch aggregated activities across first 3 projects dynamically
  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ["client-activities", projects],
    queryFn: async () => {
      if (!projects || projects.length === 0) return [];
      const promises = projects
        .slice(0, 3)
        .map((p) => api.get(`/activities/${p._id}`).then((res) => res.data));
      const results = await Promise.all(promises);
      
      // Flatten, format, and sort by date
      return results
        .flat()
        .map((act) => ({
          date: new Date(act.createdAt).toLocaleDateString(),
          badge: act.action?.toLowerCase() || "system",
          title: act.details || "Activity logged",
          description: `Logged by ${act.user?.name || "System"} on project.`,
          active: true,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    enabled: projects.length > 0,
  });

  return (
    <div className="space-y-8 animate-fade-in font-sans select-none pb-12">
      {/* Welcome Banner Hero & Profile Summary */}
      <div className="relative rounded-2xl glass-panel p-8 overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/5">
        <div className="absolute inset-0 grid-overlay opacity-15 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar user={user} size="lg" />
            <div className="space-y-1">
              <Badge variant="accent" size="sm" className="mb-1">Client Dashboard</Badge>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Welcome back, <span className="text-primary text-gradient-neon">{user?.name}</span>
              </h1>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Workspace: <span className="text-white font-mono">{user?.email}</span> • Role: Client Manager
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={() =>
              toast.success(
                `Profile details: Name: ${user?.name}, Roles: ${user?.roles?.join(", ")}, Created: ${new Date(
                  user?.createdAt
                ).toLocaleDateString()}`
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
            activities={activities}
            notifications={notifications}
            statsLoading={statsLoading}
            projectsLoading={projectsLoading}
            activitiesLoading={activitiesLoading}
          />
        )}

        {activeTab === "projects" && (
          <ProjectsTab projects={projects} isLoading={projectsLoading} />
        )}

        {activeTab === "activities" && (
          <ActivitiesTab activities={activities} isLoading={activitiesLoading} />
        )}

        {activeTab === "notifications" && (
          <NotificationsTab notifications={notifications} isLoading={notificationsLoading} />
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
  activities,
  notifications,
  statsLoading,
  projectsLoading,
  activitiesLoading,
}) {
  const queryClient = useQueryClient();
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  // Chart budget metrics for recharts
  const chartData = projects.slice(0, 6).map((p, idx) => ({
    name: p.title.substring(0, 10) + "...",
    value: p.budget || 0,
  }));

  const handleAIAction = (slug) => {
    toast.success(`AI Page /ai/${slug} shortcut triggered. This workflow will be fully functional in Phase 6!`, { icon: "🧠" });
  };

  return (
    <div className="space-y-6">
      {/* 3 Metrics Cards Grid */}
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
            <MetricCard title="Total Projects" value={`${stats?.totalProjects || 0} Gigs`} trend={0} icon={Briefcase} sparklineData={[0, stats?.totalProjects]} />
            <MetricCard title="Pending Review" value={`${stats?.pendingProjects || 0} Gigs`} trend={0} icon={Clock3} sparklineData={[0, stats?.pendingProjects]} className="text-warning" />
            <MetricCard title="Active Contracts" value={`${stats?.activeProjects || 0} Gigs`} trend={12.4} icon={Activity} sparklineData={[0, stats?.activeProjects]} className="text-accent" />
            <MetricCard title="Completed Jobs" value={`${stats?.completedProjects || 0} Gigs`} trend={3.5} icon={CheckCircle} sparklineData={[0, stats?.completedProjects]} className="text-success" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Chart and Recent Gigs (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Chart Wrapper */}
          <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Project Budget Allocation ($)</span>
              <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-mono">
                <TrendingUp size={12} />
                <span>Allocation Flow</span>
              </div>
            </div>
            <div className="h-64">
              {projectsLoading ? (
                <Skeleton className="h-full w-full" />
              ) : chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center border border-dashed border-white/5 rounded-xl text-gray-500 text-xs">
                  Awaiting project budgets to render flow charts...
                </div>
              ) : (
                <ChartWrapper data={chartData} strokeColor="#6366F1" chartTitle="Project Budgets ($)" />
              )}
            </div>
          </GlassCard>

          {/* Recent projects list summary */}
          <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Briefcase size={16} className="text-primary" />
              <span>Recent Project Overview</span>
            </h3>

            {projectsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : projects.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-white/5 rounded-xl text-gray-500 text-xs">
                No projects initialized yet.
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
                          Freelancer: {p.freelancer?.name || "Unassigned"}
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

        {/* Right Side: AI Shortcuts, Notifications preview (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Shortcuts widgets */}
          <GlassCard className="bg-[#0b0f19]/75 border-white/10 backdrop-blur-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Brain size={16} className="text-indigo-400" />
              <span>AI Assistant Shortcuts</span>
            </h3>
            
            <div className="space-y-2">
              <button
                onClick={() => handleAIAction("scope")}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 hover:border-indigo-500/20 text-left transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Brain size={14} className="text-primary" />
                  <div>
                    <p className="text-xs font-bold text-white">Project Scope Generator</p>
                    <p className="text-[9px] text-gray-500 font-light mt-0.5">Parse brief prompts into tasks</p>
                  </div>
                </div>
                <ChevronRight size={13} className="text-gray-500" />
              </button>

              <button
                onClick={() => handleAIAction("cost")}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 hover:border-secondary/20 text-left transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Calculator size={14} className="text-secondary" />
                  <div>
                    <p className="text-xs font-bold text-white">Cost Estimator</p>
                    <p className="text-[9px] text-gray-500 font-light mt-0.5">Review milestone allocations</p>
                  </div>
                </div>
                <ChevronRight size={13} className="text-gray-500" />
              </button>

              <button
                onClick={() => handleAIAction("freelancer")}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 hover:border-accent/20 text-left transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck size={14} className="text-accent" />
                  <div>
                    <p className="text-xs font-bold text-white">Talent Recommendation</p>
                    <p className="text-[9px] text-gray-500 font-light mt-0.5">Discover vetted expert profiles</p>
                  </div>
                </div>
                <ChevronRight size={13} className="text-gray-500" />
              </button>
            </div>
          </GlassCard>

          {/* Recent Notifications summary widget */}
          <GlassCard className="bg-[#0b0f19]/75 border-white/10 backdrop-blur-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bell size={16} className="text-accent animate-pulse-slow" />
                <span>Recent Alerts</span>
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
// 2. PROJECTS TAB SCREEN COMPONENT
// ==========================================
function ProjectsTab({ projects, isLoading }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [layoutMode, setLayoutMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("deadline");

  // Filtering projects list client-side
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sorting
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "budget-desc") return b.budget - a.budget;
    if (sortBy === "budget-asc") return a.budget - b.budget;
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return new Date(a.deadline) - new Date(b.deadline);
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters panel */}
      <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full lg:max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search project title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-lg border border-white/8 bg-white/3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
            />
          </div>

          {/* Select dropdown filters */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 text-xs rounded-lg border border-white/8 bg-white/3 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-sans min-w-[130px]"
            >
              <option value="all">Any Status</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="In Progress">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 text-xs rounded-lg border border-white/8 bg-white/3 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-sans min-w-[130px]"
            >
              <option value="deadline">Sort by Deadline</option>
              <option value="title">Sort by Title</option>
              <option value="budget-desc">Budget: High to Low</option>
              <option value="budget-asc">Budget: Low to High</option>
            </select>

            {/* List/Grid layout toggle */}
            <div className="flex p-0.8 rounded-lg bg-white/3 border border-white/5">
              <button
                onClick={() => setLayoutMode("grid")}
                className={`p-1.5 rounded cursor-pointer transition-colors ${
                  layoutMode === "grid" ? "bg-white/5 text-white" : "text-gray-400 hover:text-white"
                }`}
                aria-label="Grid Layout"
              >
                <Grid size={14} />
              </button>
              <button
                onClick={() => setLayoutMode("list")}
                className={`p-1.5 rounded cursor-pointer transition-colors ${
                  layoutMode === "list" ? "bg-white/5 text-white" : "text-gray-400 hover:text-white"
                }`}
                aria-label="List Layout"
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Projects Display */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : sortedProjects.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-white/8 rounded-2xl bg-white/2 max-w-md mx-auto space-y-3">
          <Briefcase className="text-gray-600 mx-auto" size={30} />
          <div>
            <p className="text-xs text-gray-400 font-bold">No projects matched search criteria</p>
            <p className="text-[10px] text-gray-500 font-light mt-0.5">Adjust filter options or initialize a gig checkout contract.</p>
          </div>
        </div>
      ) : layoutMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map((p) => {
            const statBadge = getProjectStatusBadge(p.status);
            return (
              <motion.div
                key={p._id}
                whileHover={{ y: -3 }}
                className="cursor-pointer"
                onClick={() => (window.location.href = `/projects/${p._id}`)}
              >
                <GlassCard hoverGlow className="bg-[#0b0f19]/75 border-white/8 h-full flex flex-col justify-between p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" size="sm" className="font-mono text-[9px] lowercase">
                        {p.category}
                      </Badge>
                      <Badge variant={statBadge.variant} size="sm">
                        {statBadge.text}
                      </Badge>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-sm font-extrabold text-white line-clamp-1">{p.title}</h4>
                      <p className="text-xs text-gray-400 font-light line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest">Escrow budget</p>
                      <p className="font-mono font-black text-white mt-0.5">${p.budget}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest">Deadline</p>
                      <p className="font-mono text-gray-400 mt-0.5">
                        {new Date(p.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedProjects.map((p) => {
            const statBadge = getProjectStatusBadge(p.status);
            return (
              <div
                key={p._id}
                onClick={() => (window.location.href = `/projects/${p._id}`)}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 hover:border-indigo-500/20 transition-all text-xs gap-4 cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white hover:text-primary transition-colors">{p.title}</p>
                    <Badge variant="outline" size="sm" className="font-mono text-[9px] lowercase">
                      {p.category}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-gray-500 font-light truncate max-w-xl">
                    {p.description}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-right font-mono">
                    <p className="font-bold text-white">${p.budget}</p>
                    <p className="text-[9px] text-gray-500 mt-0.5">
                      {new Date(p.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={statBadge.variant} size="sm" className="min-w-[70px] text-center">
                    {statBadge.text}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. ACTIVITY TAB SCREEN COMPONENT
// ==========================================
function ActivitiesTab({ activities, isLoading }) {
  return (
    <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Activity size={16} className="text-primary" />
          <span>Chronological Log Streams</span>
        </h3>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : activities.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-white/5 rounded-xl text-gray-500 text-xs">
          No project activities logged for your active contracts.
        </div>
      ) : (
        <Timeline items={activities} />
      )}
    </GlassCard>
  );
}

// ==========================================
// 4. NOTIFICATIONS TAB SCREEN COMPONENT
// ==========================================
function NotificationsTab({ notifications, isLoading }) {
  const queryClient = useQueryClient();

  const handleMarkAllRead = () => {
    // Check if notifications exist to mark
    if (notifications.length === 0) return;
    
    // Simulate updating read status on database logs
    toast.success("Simulation check: Notifications marked as read!");
    queryClient.setQueryData(["client-notifications"], (old = []) =>
      old.map((n) => ({ ...n, isRead: true }))
    );
  };

  return (
    <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Bell size={16} className="text-accent animate-pulse-slow" />
          <span>Alert Stream Manager</span>
        </h3>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-gray-400 hover:text-white cursor-pointer hover:underline transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-white/5 rounded-xl text-gray-500 text-xs">
          No alerts logged.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((not) => (
            <div
              key={not._id}
              className={`p-4 rounded-xl border transition-colors flex items-start gap-3.5 text-xs ${
                not.isRead
                  ? "border-white/5 bg-white/2 text-gray-400"
                  : "border-indigo-500/20 bg-indigo-500/5 text-white"
              }`}
            >
              <div className={`p-2 rounded-lg ${not.isRead ? "bg-white/5" : "bg-indigo-500/10 text-primary"}`}>
                <Bell size={14} />
              </div>
              <div className="space-y-1">
                <p className="font-bold flex items-center gap-2">
                  <span>{not.title}</span>
                  {!not.isRead && <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />}
                </p>
                <p className="text-gray-400 font-light mt-0.5 leading-relaxed">{not.message}</p>
                <p className="text-[10px] text-gray-500 font-mono mt-1">
                  {new Date(not.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
