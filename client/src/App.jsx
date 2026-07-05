import React, { useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster, toast } from "react-hot-toast";

// Core Providers
import { queryClient } from "./services/api";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { RoleProvider } from "./context/RoleContext";
import { SocketProvider, useSocket } from "./context/SocketContext";

// Layout & Route guards
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

// Common UI & Layouts
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import GlassCard, {
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
} from "./components/ui/GlassCard";
import MetricCard from "./components/ui/MetricCard";
import Tabs from "./components/ui/Tabs";
import Badge from "./components/ui/Badge";
import Timeline from "./components/ui/Timeline";
import Skeleton from "./components/ui/Skeleton";
import Table, {
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./components/ui/Table";
import ChartWrapper from "./components/charts/ChartWrapper";
import Modal from "./components/ui/Modal";
import Tooltip from "./components/ui/Tooltip";
import Dropdown, { DropdownItem, DropdownDivider } from "./components/ui/Dropdown";
import EmptyState from "./components/common/EmptyState";
import ErrorState from "./components/common/ErrorState";
import NotFound from "./components/common/NotFound";
import LoadingScreen from "./components/common/LoadingScreen";

// Lazy load route pages for performance optimization
const LandingPage = lazy(() => import("./routes/LandingPage"));
const LoginPage = lazy(() => import("./routes/LoginPage"));
const RegisterPage = lazy(() => import("./routes/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./routes/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./routes/ResetPasswordPage"));
const MarketplacePage = lazy(() => import("./routes/MarketplacePage"));
const ServiceDetailsPage = lazy(() => import("./routes/ServiceDetailsPage"));
const CreateServicePage = lazy(() => import("./routes/CreateServicePage"));
const EditServicePage = lazy(() => import("./routes/EditServicePage"));
const MyServicesPage = lazy(() => import("./routes/MyServicesPage"));
const ClientDashboard = lazy(() => import("./routes/ClientDashboard"));
const FreelancerDashboard = lazy(() => import("./routes/FreelancerDashboard"));
const ProjectWorkspace = lazy(() => import("./routes/ProjectWorkspace"));
const AIHome = lazy(() => import("./routes/AIHome"));
const AIScopeGenerator = lazy(() => import("./routes/AIScopeGenerator"));
const AICostEstimator = lazy(() => import("./routes/AICostEstimator"));
const AIFreelancerRecommendation = lazy(() => import("./routes/AIFreelancerRecommendation"));
const AdminPanel = lazy(() => import("./routes/AdminPanel"));
const ProfilePage = lazy(() => import("./routes/ProfilePage"));

// Lucide Icons
import {
  Sparkles,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  User,
  Lock,
  Layers,
  HelpCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle,
  Wifi,
  WifiOff,
} from "lucide-react";

// Primary Showcase component
function DesignSystemPlayground() {
  const [activeTab, setActiveTab] = useState("primitives");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const { user, login, logout, isAuthenticated } = useAuth();
  const { isConnected } = useSocket();

  const tabsConfig = [
    { id: "primitives", label: "UI Primitives", icon: Sparkles },
    { id: "data", label: "Data & Charts", icon: Layers },
    { id: "states", label: "System States", icon: AlertTriangle },
    { id: "auth", label: "API & Socket", icon: Lock },
  ];

  // Dummy Chart Data
  const chartData = [
    { name: "Jan", value: 30 },
    { name: "Feb", value: 45 },
    { name: "Mar", value: 60 },
    { name: "Apr", value: 50 },
    { name: "May", value: 75 },
    { name: "Jun", value: 90 },
  ];

  // Dummy Timeline Data
  const activityLogs = [
    {
      date: "2 hours ago",
      badge: "system",
      title: "Vercel Deployment Completed",
      description: "Production build deployed from commit refs/heads/main successfully.",
      active: true,
    },
    {
      date: "5 hours ago",
      badge: "security",
      title: "New Freelancer Role Registered",
      description: "Freelancer profile updated with 8 vetted skills and portfolio attachments.",
      active: false,
    },
    {
      date: "1 day ago",
      badge: "database",
      title: "MongoDB Schema Synced",
      description: "Collection index definitions synchronized with server schema configurations.",
      active: false,
    },
  ];

  // Handle Authentication submit directly to real backend API
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    
    if (!emailInput || !passwordInput) {
      setAuthError("Email and Password are required parameters.");
      return;
    }

    try {
      setIsButtonLoading(true);
      await login(emailInput, passwordInput);
      toast.success("Successfully logged in via CollabAI JWT Auth!");
      setEmailInput("");
      setPasswordInput("");
    } catch (err) {
      console.error(err);
      setAuthError(err.message || "Invalid credentials provided.");
      toast.error("Auth verification failed.");
    } finally {
      setIsButtonLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner Hero */}
      <div className="relative rounded-2xl glass-panel p-8 overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/5">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge variant="accent" size="sm" className="mb-2">Phase 1 Foundations</Badge>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Collab<span className="text-primary text-gradient-neon">AI</span> Design Token System
            </h1>
            <p className="text-sm text-gray-400 font-light max-w-xl leading-relaxed">
              Explore the dark futuristic design token framework for CollabAI. Fully compatible with React 19, Tailwind CSS v4, and Framer Motion micro-interactions.
            </p>
          </div>
          <Button variant="accent" onClick={() => toast.success("Press CTRL + K or click Search in the Navbar to open the Command Center!", { icon: "⌨️" })} className="flex-shrink-0">
            <span className="flex items-center gap-1.5">
              Press ⌘K for Command Center
            </span>
          </Button>
        </div>
      </div>

      {/* Tabs navigation */}
      <Tabs tabs={tabsConfig} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Contents */}
      <div className="mt-6">
        {/* Tab 1: UI Primitives */}
        {activeTab === "primitives" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buttons Showcase */}
            <GlassCard hoverGlow>
              <GlassCardHeader>
                <GlassCardTitle>Responsive Buttons</GlassCardTitle>
                <GlassCardDescription>Framer-motion triggered visual triggers.</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent className="flex flex-wrap gap-3">
                <Button variant="primary">Primary Glow</Button>
                <Button variant="secondary">Secondary Glass</Button>
                <Button variant="accent">Cyan Accent</Button>
                <Button variant="outline">Border Outline</Button>
                <Button variant="ghost">Ghost link</Button>
                <Button
                  variant="primary"
                  loading={isButtonLoading}
                  onClick={() => {
                    setIsButtonLoading(true);
                    setTimeout(() => setIsButtonLoading(false), 2000);
                  }}
                >
                  Click to Load
                </Button>
              </GlassCardContent>
            </GlassCard>

            {/* Input Primitives */}
            <GlassCard hoverGlow>
              <GlassCardHeader>
                <GlassCardTitle>Form Elements</GlassCardTitle>
                <GlassCardDescription>Gradient focus outlines with label alignment.</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent className="space-y-4">
                <Input label="Workspace Email Address" placeholder="alex@collabai.com" leftIcon={User} />
                <Input label="Passkey Identifier" type="password" placeholder="••••••••" leftIcon={Lock} error="Must contain at least 6 characters" />
              </GlassCardContent>
            </GlassCard>

            {/* Overlays / Popups */}
            <GlassCard hoverGlow>
              <GlassCardHeader>
                <GlassCardTitle>Overlays & Indicators</GlassCardTitle>
                <GlassCardDescription>Tabs, Modals, Tooltips, and Badge tokens.</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Badge variant="primary">Indigo</Badge>
                  <Badge variant="secondary">Purple</Badge>
                  <Badge variant="accent">Cyan</Badge>
                  <Badge variant="highlight">Pink</Badge>
                  <Badge variant="success">Active</Badge>
                  <Badge variant="danger">Error</Badge>
                </div>
                <div className="flex items-center gap-4">
                  <Tooltip content="Quick Help Center" position="top">
                    <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer bg-white/5 border border-border-glass px-2.5 py-1.5 rounded-lg">
                      <HelpCircle size={14} />
                      Hover for Tooltip
                    </button>
                  </Tooltip>

                  <Dropdown
                    align="left"
                    trigger={
                      <Button variant="outline" size="sm">Trigger Dropdown</Button>
                    }
                  >
                    <DropdownItem>Action Option 1</DropdownItem>
                    <DropdownItem>Action Option 2</DropdownItem>
                    <DropdownDivider />
                    <DropdownItem danger>Destructive Action</DropdownItem>
                  </Dropdown>
                </div>

                <div className="pt-2">
                  <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    Launch Spring Modal
                  </Button>
                  <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="CollabAI Modal System">
                    <div className="space-y-3">
                      <p className="text-xs text-gray-400 leading-relaxed font-light">
                        This modal is overlayed with a premium background blur, spring animations, and handles ESC keyboard bindings to close cleanly.
                      </p>
                      <Button variant="accent" size="sm" onClick={() => setIsModalOpen(false)} className="w-full mt-2">
                        Acknowledge and Continue
                      </Button>
                    </div>
                  </Modal>
                </div>
              </GlassCardContent>
            </GlassCard>

            {/* Metric Displays */}
            <div className="grid grid-cols-2 gap-4">
              <MetricCard title="Total Earnings" value="$14,820.00" trend={12.4} icon={DollarSign} sparklineData={[10, 15, 8, 20, 18, 30]} />
              <MetricCard title="Active Contracts" value="48 Projects" trend={-3.2} icon={TrendingUp} sparklineData={[30, 28, 25, 20, 22, 18]} />
            </div>
          </div>
        )}

        {/* Tab 2: Data & Charts */}
        {activeTab === "data" && (
          <div className="space-y-6">
            {/* Visual Performance Chart */}
            <GlassCard hoverGlow>
              <GlassCardHeader>
                <GlassCardTitle>Workspace Performance Metric</GlassCardTitle>
                <GlassCardDescription>Data visualization leveraging design color variables.</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="h-64">
                  <ChartWrapper data={chartData} strokeColor="#8B5CF6" chartTitle="Productivity Level" />
                </div>
              </GlassCardContent>
            </GlassCard>

            {/* Dynamic Glass Table */}
            <GlassCard hoverGlow>
              <GlassCardHeader>
                <GlassCardTitle>Active Collaborators</GlassCardTitle>
                <GlassCardDescription>Responsive table layout matching dark glass theme.</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent>
                <Table>
                  <TableHeader>
                    <TableRow interactive={false}>
                      <TableHead>Collaborator</TableHead>
                      <TableHead>Primary Role</TableHead>
                      <TableHead>Service Status</TableHead>
                      <TableHead>Timeline Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-bold">Aneree Shah</TableCell>
                      <TableCell>Senior AI Lead</TableCell>
                      <TableCell><Badge variant="success">Vetted</Badge></TableCell>
                      <TableCell>July 4, 2026</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold">Devon Webb</TableCell>
                      <TableCell>Fullstack Developer</TableCell>
                      <TableCell><Badge variant="accent">In Progress</Badge></TableCell>
                      <TableCell>June 28, 2026</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold">Clara Vance</TableCell>
                      <TableCell>Staff UI Designer</TableCell>
                      <TableCell><Badge variant="secondary">Available</Badge></TableCell>
                      <TableCell>May 15, 2026</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </GlassCardContent>
            </GlassCard>
          </div>
        )}

        {/* Tab 3: System States */}
        {activeTab === "states" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Loading Shimmer Card */}
            <GlassCard hoverGlow>
              <GlassCardHeader>
                <GlassCardTitle>Skeleton Shimmer Loaders</GlassCardTitle>
                <GlassCardDescription>Dynamic layout skeleton components.</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10" variant="circle" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-5/6" />
                  </div>
                </div>
                <DropdownDivider />
                <div className="space-y-3">
                  <Skeleton className="h-32 w-full" />
                </div>
              </GlassCardContent>
            </GlassCard>

            {/* Empty State Cards */}
            <GlassCard hoverGlow>
              <GlassCardHeader>
                <GlassCardTitle>Data Placeholder Panels</GlassCardTitle>
                <GlassCardDescription>Premium empty list fallback panels.</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent>
                <EmptyState title="No Active Contracts" description="There are currently no collaborative projects matching your search filter." actionText="Post a Service" onAction={() => toast.success("Create service popup triggered!")} />
              </GlassCardContent>
            </GlassCard>

            {/* Error Indicators */}
            <div className="md:col-span-2 flex justify-center">
              <ErrorState title="API Sync Disrupted" message="We encountered a timeout error while retrieving latest notification streams from the MongoDB database cluster." actionText="Retry Connection" onAction={() => toast.success("Refetching data hooks...")} />
            </div>
          </div>
        )}

        {/* Tab 4: API & Sockets */}
        {activeTab === "auth" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Database JWT Login verification - hitting authentic /api/auth/login */}
            <GlassCard hoverGlow>
              <GlassCardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <GlassCardTitle>Live Database Authentication</GlassCardTitle>
                    <GlassCardDescription>Submit directly to backend endpoint `/api/auth/login`</GlassCardDescription>
                  </div>
                  <Badge variant={isAuthenticated ? "success" : "danger"}>
                    {isAuthenticated ? "Session Valid" : "Offline / Guest"}
                  </Badge>
                </div>
              </GlassCardHeader>
              <GlassCardContent>
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex gap-3 items-center">
                      <CheckCircle size={18} />
                      <div>
                        <p className="text-xs font-bold text-white">Authenticated Securely!</p>
                        <p className="text-[10px] text-gray-400 font-light mt-0.5">JWT token captured in localStorage</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 p-3 rounded-lg bg-white/3 border border-border-glass text-xs">
                      <p className="text-gray-400">User Identity: <span className="text-white font-bold">{user?.name}</span></p>
                      <p className="text-gray-400">Email Address: <span className="text-white">{user?.email}</span></p>
                      <p className="text-gray-400">Assigned Roles: <span className="text-accent uppercase font-semibold font-mono">{user?.roles?.join(", ")}</span></p>
                    </div>
                    <Button variant="secondary" onClick={() => {
                      logout();
                      toast.success("Logged out successfully!");
                    }} className="w-full">
                      Sign Out / Clear JWT Cache
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <Input
                      label="Admin / User Email"
                      placeholder="Enter register credentials..."
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      leftIcon={User}
                    />
                    <Input
                      label="Security Passphrase"
                      type="password"
                      placeholder="••••••••"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      leftIcon={Lock}
                    />
                    {authError && (
                      <p className="text-xs text-red-400 font-light pl-1">{authError}</p>
                    )}
                    <Button type="submit" variant="primary" loading={isButtonLoading} className="w-full">
                      Submit Credentials
                    </Button>
                  </form>
                )}
              </GlassCardContent>
            </GlassCard>

            {/* Socket status */}
            <GlassCard hoverGlow flex flex-col justify-between>
              <GlassCardHeader>
                <GlassCardTitle>Socket.IO Connection</GlassCardTitle>
                <GlassCardDescription>Real-time channel status connecting to port 5000.</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/3 border border-border-glass">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2.5 rounded-full",
                      isConnected ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                    )}>
                      {isConnected ? <Wifi size={20} /> : <WifiOff size={20} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Socket Status</p>
                      <p className="text-[10px] text-gray-400 font-light mt-0.5">
                        {isConnected ? "Active listener pipeline established" : "Disconnected (Requires valid JWT login)"}
                      </p>
                    </div>
                  </div>
                  <Badge variant={isConnected ? "success" : "danger"}>
                    {isConnected ? "Connected" : "Inactive"}
                  </Badge>
                </div>

                {/* Timeline display */}
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">
                  Activity Feed Logs
                </h4>
                <Timeline items={activityLogs} />
              </GlassCardContent>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}

function NavigateToProjectsDashboard() {
  const { user } = useAuth();
  if (user?.roles?.includes("admin")) {
    return <Navigate to="/dashboard/admin" replace />;
  }
  if (user?.roles?.includes("client")) {
    return <Navigate to="/dashboard/client" replace />;
  }
  return <Navigate to="/dashboard/freelancer" replace />;
}

// Router configuration mapping to dashboard layout and fallback pages
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <RoleProvider>
            <SocketProvider>
              <Router>
                <Suspense fallback={<LoadingScreen />}>
                  <Routes>
                    {/* Public SaaS Landing Page */}
                    <Route
                      path="/"
                      element={<LandingPage />}
                    />

                    {/* Public design showcase layout wrapper */}
                    <Route
                      path="/design-system"
                      element={
                        <MainLayout>
                          <DesignSystemPlayground />
                        </MainLayout>
                      }
                    />

                  {/* Authentication Routes (Public only) */}
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <LoginPage />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <RegisterPage />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <PublicRoute>
                        <ForgotPasswordPage />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/reset-password"
                    element={
                      <PublicRoute>
                        <ResetPasswordPage />
                      </PublicRoute>
                    }
                  />

                  {/* Protected Role-based Dashboard Placeholders */}
                  <Route
                    path="/dashboard/client"
                    element={
                      <ProtectedRoute allowedRoles={["client"]}>
                        <MainLayout>
                          <ClientDashboard />
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/freelancer"
                    element={
                      <ProtectedRoute allowedRoles={["freelancer", "agency"]}>
                        <MainLayout>
                          <FreelancerDashboard />
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/admin"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <MainLayout>
                          <AdminPanel />
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Projects & Workspace Routes */}
                  <Route
                    path="/projects"
                    element={
                      <ProtectedRoute allowedRoles={["client", "freelancer", "agency"]}>
                        <NavigateToProjectsDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/projects/:id"
                    element={
                      <ProtectedRoute allowedRoles={["client", "freelancer", "agency"]}>
                        <MainLayout>
                          <ProjectWorkspace />
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute allowedRoles={["client", "freelancer", "agency", "admin"]}>
                        <MainLayout>
                          <ProfilePage />
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />

                  {/* AI Module Routes */}
                  <Route
                    path="/ai"
                    element={
                      <ProtectedRoute allowedRoles={["client", "freelancer", "agency"]}>
                        <MainLayout>
                          <AIHome />
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/ai/scope"
                    element={
                      <ProtectedRoute allowedRoles={["client", "freelancer", "agency"]}>
                        <AIScopeGenerator />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/ai/cost"
                    element={
                      <ProtectedRoute allowedRoles={["client", "freelancer", "agency"]}>
                        <AICostEstimator />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/ai/freelancer"
                    element={
                      <ProtectedRoute allowedRoles={["client", "freelancer", "agency"]}>
                        <AIFreelancerRecommendation />
                      </ProtectedRoute>
                    }
                  />

                  {/* Marketplace Routes */}
                  <Route
                    path="/marketplace"
                    element={<MarketplacePage />}
                  />
                  <Route
                    path="/marketplace/services/:id"
                    element={<ServiceDetailsPage />}
                  />
                  <Route
                    path="/marketplace/services/new"
                    element={
                      <ProtectedRoute allowedRoles={["freelancer", "agency"]}>
                        <CreateServicePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/marketplace/services/:id/edit"
                    element={
                      <ProtectedRoute allowedRoles={["freelancer", "agency"]}>
                        <EditServicePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/marketplace/my-services"
                    element={
                      <ProtectedRoute allowedRoles={["freelancer", "agency"]}>
                        <MyServicesPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Router>

              {/* Central micro toast overlays */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "rgba(11, 15, 25, 0.9)",
                    color: "#fff",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    fontSize: "13px",
                    fontWeight: 300,
                    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
                  },
                }}
              />
            </SocketProvider>
          </RoleProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Temporary dashboard verification placeholders
function MockDashboard({ roleName }) {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-bg-base text-gray-200 flex flex-col items-center justify-center p-6 relative overflow-hidden select-none font-sans">
      <div className="absolute inset-0 noise-overlay pointer-events-none z-50 opacity-2" />
      <div className="absolute inset-0 grid-overlay opacity-25 pointer-events-none z-0" />
      
      <div className="absolute top-[-100px] right-[-100px] h-[500px] w-[500px] rounded-full bg-primary glow-circle opacity-10" />
      <div className="absolute bottom-[-100px] left-[-100px] h-[500px] w-[500px] rounded-full bg-secondary glow-circle opacity-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard hoverGlow className="bg-[#0b0f19]/75 border-white/8 backdrop-blur-2xl shadow-2xl p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle size={24} className="animate-bounce" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white capitalize">{roleName} Dashboard</h3>
            <p className="text-xs text-gray-400 font-light max-w-sm mx-auto leading-relaxed">
              Successfully authenticated as <span className="text-indigo-400 font-bold font-mono">{user?.name}</span> ({user?.email}).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/5 bg-white/2 text-xs space-y-2 text-left">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Session parameters</p>
            <p className="text-gray-400">Role level: <span className="text-accent font-bold uppercase font-mono">{roleName}</span></p>
            <p className="text-gray-400">Token presence: <span className="text-emerald-400 font-mono">Verified JWT</span></p>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="w-full text-xs font-bold py-2.5"
              onClick={() => (window.location.href = "/")}
            >
              Go to Landing Page
            </Button>
            <Button
              variant="secondary"
              className="w-full text-xs font-bold py-2.5"
              onClick={() => {
                logout();
                toast.success("Signed out successfully!");
                setTimeout(() => {
                  window.location.href = "/login";
                }, 500);
              }}
            >
              Sign Out
            </Button>
          </div>
        </GlassCard>
      </motion.div>
      <style>{`
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.015;
        }
      `}</style>
    </div>
  );
}
