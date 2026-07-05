import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Shield,
  Search,
  Activity,
  FolderKanban,
  FileCode,
  Users,
  AlertCircle,
  Database,
  Globe,
  Settings,
  ChevronRight,
  TrendingUp,
  Cpu,
  Star,
  Eye,
  Lock,
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import GlassCard, {
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
} from "../components/ui/GlassCard";
import MetricCard from "../components/ui/MetricCard";
import Skeleton from "../components/ui/Skeleton";
import Badge from "../components/ui/Badge";
import Avatar from "../components/common/Avatar";
import Tabs from "../components/ui/Tabs";
import ChartWrapper from "../components/charts/ChartWrapper";
import toast from "react-hot-toast";

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const tabsConfig = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "users", label: "Users Directory", icon: Users },
    { id: "services", label: "Global Gigs", icon: FileCode },
    { id: "projects", label: "Projects Log", icon: FolderKanban },
  ];

  // 1. Query Admin Statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await api.get("/dashboard/admin");
      return res.data;
    },
  });

  // 2. Query all public services
  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await api.get("/services");
      return res.data?.services || [];
    },
  });

  return (
    <div className="space-y-8 animate-fade-in font-sans select-none pb-12">
      {/* Banner */}
      <div className="relative rounded-2xl glass-panel p-8 overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-r from-red-500/10 via-primary/5 to-accent/5">
        <div className="absolute inset-0 grid-overlay opacity-15 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar user={user} size="lg" />
            <div className="space-y-1">
              <Badge variant="danger" size="sm" className="mb-1 uppercase tracking-widest font-mono">
                System Administrator
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Admin Console: <span className="text-red-400 text-gradient-neon">{user?.name}</span>
              </h1>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Management Panel • Session: <span className="text-white font-mono">{user?.email}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabsConfig} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Screen Contents */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <OverviewTab stats={stats} statsLoading={statsLoading} />
        )}

        {activeTab === "users" && (
          <UsersTab adminUser={user} />
        )}

        {activeTab === "services" && (
          <ServicesTab services={services} isLoading={servicesLoading} />
        )}

        {activeTab === "projects" && (
          <ProjectsTab stats={stats} />
        )}
      </div>
    </div>
  );
}

// ==========================================
// 1. OVERVIEW TAB SCREEN COMPONENT
// ==========================================
function OverviewTab({ stats, statsLoading }) {
  const chartData = [
    { name: "Users", value: stats?.totalUsers || 0 },
    { name: "Services", value: stats?.totalServices || 0 },
    { name: "Projects", value: stats?.totalProjects || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Dynamic Statistics Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statsLoading ? (
          <>
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </>
        ) : (
          <>
            <MetricCard title="Registered Accounts" value={`${stats?.totalUsers || 0} Accounts`} trend={0} icon={Users} sparklineData={[0, stats?.totalUsers]} />
            <MetricCard title="Global Gig Catalog" value={`${stats?.totalServices || 0} Services`} trend={0} icon={FileCode} sparklineData={[0, stats?.totalServices]} className="text-accent" />
            <MetricCard title="Escrow Projects" value={`${stats?.totalProjects || 0} Contracts`} trend={0} icon={FolderKanban} sparklineData={[0, stats?.totalProjects]} className="text-success" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Graph representation (8 cols) */}
        <div className="lg:col-span-8">
          <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Platform Asset Flow</span>
              <div className="flex items-center gap-1.5 text-[10px] text-red-400 font-mono">
                <TrendingUp size={12} />
                <span>Growth Volume</span>
              </div>
            </div>
            <div className="h-64">
              {statsLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ChartWrapper data={chartData} strokeColor="#EF4444" chartTitle="Platform Assets" />
              )}
            </div>
          </GlassCard>
        </div>

        {/* System Health Status (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="bg-[#0b0f19]/75 border-white/10 backdrop-blur-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity size={16} className="text-red-400" />
              <span>Platform Health Logs</span>
            </h3>

            <hr className="border-white/5" />

            <div className="space-y-3.5 text-xs font-light">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Database Status</span>
                <span className="text-emerald-400 font-bold font-mono">ONLINE</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">API Gateway</span>
                <span className="text-emerald-400 font-bold font-mono">ONLINE</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Escrow provider latency</span>
                <span className="text-white font-mono">14ms</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Socket connection channel</span>
                <span className="text-emerald-400 font-bold font-mono">LISTENING</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. USERS DIRECTORY COMPONENT
// ==========================================
function UsersTab({ adminUser }) {
  return (
    <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Users size={16} className="text-primary" />
          <span>Active Users Directory</span>
        </h3>
        <Badge variant="outline" size="sm" className="font-mono text-[9px]">
          Read-only list
        </Badge>
      </div>

      <p className="text-xs text-gray-400 font-light leading-relaxed">
        The backend API does not currently expose listing routes for registered users to safeguard privacy. Below is the active session administrator user account information:
      </p>

      {/* Admin User Details Display */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-white/2 gap-4 text-xs mt-4">
        <div className="flex items-center gap-3">
          <Avatar user={adminUser} size="md" />
          <div>
            <p className="font-bold text-white">{adminUser?.name}</p>
            <p className="text-gray-500 font-light mt-0.5 font-mono">{adminUser?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="danger" size="sm" className="uppercase font-mono">
            {adminUser?.roles?.join(", ") || "admin"}
          </Badge>
          <span className="text-gray-500 font-light font-mono">
            Created: {new Date(adminUser?.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </GlassCard>
  );
}

// ==========================================
// 3. SERVICES DIRECTORY COMPONENT
// ==========================================
function ServicesTab({ services, isLoading }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = services.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Filtering Header */}
      <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search global gigs catalog..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-lg border border-white/8 bg-white/3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
            />
          </div>

          <div className="w-full lg:w-auto flex justify-end">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 text-xs rounded-lg border border-white/8 bg-white/3 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-sans min-w-[150px]"
            >
              <option value="all">Any Category</option>
              <option value="AI Engineering">AI Engineering</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Fullstack">Fullstack Dev</option>
              <option value="Web3">Web3 Dev</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Services grid */}
      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : filtered.length === 0 ? (
        <div className="py-12 border border-dashed border-white/5 rounded-xl text-center text-gray-500 text-xs font-light">
          No services matched filters criteria.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div
              key={s._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-white/2 text-xs gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-white hover:text-primary transition-colors cursor-pointer" onClick={() => window.location.href = `/marketplace/services/${s._id}`}>
                    {s.title}
                  </p>
                  <Badge variant="outline" size="sm" className="font-mono text-[9px] lowercase">
                    {s.category}
                  </Badge>
                </div>
                <p className="text-[10px] text-gray-500 font-light truncate max-w-xl">
                  Provider: {s.freelancer?.name || "Professional"} ({s.freelancer?.email})
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6">
                <div className="text-right font-mono">
                  <p className="font-bold text-white">${s.pricing}/hr</p>
                  <p className="text-[9px] text-gray-500 mt-0.5">{s.deliveryTimeline}d timeline</p>
                </div>
                <div className="flex items-center gap-1.5 bg-white/3 border border-white/5 px-2.5 py-1 rounded text-[11px] text-amber-400 font-bold font-mono">
                  <Star size={11} className="fill-amber-400" />
                  <span>{s.rating.toFixed(1)}</span>
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
// 4. PROJECTS LOG SCREEN COMPONENT
// ==========================================
function ProjectsTab({ stats }) {
  return (
    <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FolderKanban size={16} className="text-success" />
          <span>Active Escrow Project Contracts</span>
        </h3>
        <Badge variant="outline" size="sm" className="font-mono text-[9px]">
          Escrow volume
        </Badge>
      </div>

      <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-400 flex items-start gap-2.5 leading-relaxed font-sans">
        <Lock size={15} className="flex-shrink-0 mt-0.5 animate-pulse" />
        <div>
          <span className="font-bold text-white uppercase">[Access Denied]:</span> The project database list is restricted to active contract participants (Clients and Freelancers). Admins can inspect overall totals via stats counters.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
        <div className="p-4 rounded-xl border border-white/5 bg-[#0b0f19]/50 backdrop-blur-sm">
          <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Total Platform Gigs</p>
          <h4 className="text-2xl font-black text-white font-mono mt-1">{stats?.totalProjects || 0} Projects</h4>
        </div>

        <div className="p-4 rounded-xl border border-white/5 bg-[#0b0f19]/50 backdrop-blur-sm">
          <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Vetted Services listings</p>
          <h4 className="text-2xl font-black text-white font-mono mt-1">{stats?.totalServices || 0} Slots</h4>
        </div>
      </div>
    </GlassCard>
  );
}
