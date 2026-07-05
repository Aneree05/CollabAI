import React, { useState, useEffect, useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  Layers,
  MessageSquare,
  FileCode,
  Activity,
  Star,
  Clock,
  Send,
  UploadCloud,
  File,
  Download,
  Trash2,
  Paperclip,
  CheckCircle,
  FileText,
  AlertTriangle,
  User,
} from "lucide-react";
import { io } from "socket.io-client";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import GlassCard, {
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
} from "../components/ui/GlassCard";
import Skeleton from "../components/ui/Skeleton";
import Badge from "../components/ui/Badge";
import Avatar from "../components/common/Avatar";
import Tabs from "../components/ui/Tabs";
import Timeline from "../components/ui/Timeline";
import toast from "react-hot-toast";

export default function ProjectWorkspace() {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch project details
  const { data: project, isLoading: projectLoading, error: projectError } = useQuery({
    queryKey: ["project-detail", id],
    queryFn: async () => {
      const res = await api.get(`/projects/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-bg-base p-6 md:p-12 space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (projectError || !project) {
    return <Navigate to="/projects" replace />;
  }

  const isClient = project.client?._id === user?._id || project.client === user?._id;
  const isFreelancer = project.freelancer?._id === user?._id || project.freelancer === user?._id;

  const tabsConfig = [
    { id: "overview", label: "Overview", icon: Briefcase },
    { id: "chat", label: "Real-Time Chat", icon: MessageSquare },
    { id: "files", label: "Shared Files", icon: FileCode },
    { id: "activities", label: "Activity Logs", icon: Activity },
    { id: "reviews", label: "Escrow Feedback", icon: Star },
  ];

  return (
    <div className="space-y-8 animate-fade-in font-sans select-none pb-12">
      {/* Upper Workspace Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <a href="/projects" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors mb-2">
            <ArrowLeft size={13} />
            <span>Workspace List</span>
          </a>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            {project.title}
          </h1>
          <p className="text-xs text-gray-400 font-light">
            Escrow Project Workspace • Category: <span className="text-white font-mono">{project.category}</span>
          </p>
        </div>

        <Badge variant={project.status === "Completed" ? "success" : "accent"} size="md">
          {project.status}
        </Badge>
      </div>

      {/* Workspace Sub-tabs Navigation */}
      <Tabs tabs={tabsConfig} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Screen Contents */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <OverviewTab project={project} isClient={isClient} isFreelancer={isFreelancer} />
        )}

        {activeTab === "chat" && (
          <ChatTab projectId={id} project={project} />
        )}

        {activeTab === "files" && (
          <FilesTab projectId={id} project={project} />
        )}

        {activeTab === "activities" && (
          <ActivitiesTab projectId={id} />
        )}

        {activeTab === "reviews" && (
          <ReviewsTab projectId={id} project={project} isClient={isClient} />
        )}
      </div>
    </div>
  );
}

// ==========================================
// 1. OVERVIEW TAB SCREEN COMPONENT
// ==========================================
function OverviewTab({ project, isClient, isFreelancer }) {
  const progressPercent =
    project.status === "Pending"
      ? 10
      : project.status === "Accepted"
      ? 30
      : project.status === "In Progress"
      ? 60
      : project.status === "Completed"
      ? 100
      : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Details (8 cols) */}
      <div className="lg:col-span-8 space-y-6">
        <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Briefcase size={16} className="text-primary" />
            <span>Project Description</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </GlassCard>

        {/* Progress Bar Widget */}
        <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-gray-400">Milestone Escrow Progress</span>
            <span className="font-mono font-bold text-white">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-secondary"
            />
          </div>
        </GlassCard>
      </div>

      {/* Status Details Side Card (4 cols) */}
      <div className="lg:col-span-4 space-y-6">
        <GlassCard className="bg-[#0b0f19]/85 border-white/10 backdrop-blur-2xl p-6 space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Escrow Parameters</h4>
          
          <hr className="border-white/5" />

          <div className="space-y-3.5 text-xs font-light">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Budget</span>
              <span className="font-mono font-bold text-white">${project.budget}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Target Deadline</span>
              <span className="font-mono font-bold text-gray-300">
                {new Date(project.deadline).toLocaleDateString()}
              </span>
            </div>

            <hr className="border-white/5" />

            <div className="space-y-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Client Manager</p>
              <div className="flex items-center gap-2">
                <Avatar user={project.client} size="sm" />
                <span className="font-bold text-white">{project.client?.name}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1.5">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Assigned Specialist</p>
              <div className="flex items-center gap-2">
                <Avatar user={project.freelancer} size="sm" />
                <span className="font-bold text-white">{project.freelancer?.name}</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// ==========================================
// 2. CHAT TAB SCREEN COMPONENT
// ==========================================
function ChatTab({ projectId, project }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [typedMessage, setTypedMessage] = useState("");
  const chatScrollRef = useRef(null);

  // Fetch Conversation history
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["conversation", projectId],
    queryFn: async () => {
      const res = await api.get(`/messages/${projectId}`);
      return res.data || [];
    },
    enabled: !!projectId,
  });

  // Socket Connection management
  useEffect(() => {
    // Establish connection to node.js backend server
    const socket = io("http://localhost:5000");

    socket.emit("joinProject", projectId);

    socket.on("receiveMessage", (newMessage) => {
      // Append incoming socket message to cache
      queryClient.setQueryData(["conversation", projectId], (old = []) => {
        if (old.some((m) => m._id === newMessage._id)) return old;
        return [...old, newMessage];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [projectId, queryClient]);

  // Auto scroll logic
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Send Message Mutation
  const sendMutation = useMutation({
    mutationFn: async (messageText) => {
      const res = await api.post("/messages", { projectId, message: messageText });
      return res.data;
    },
    onSuccess: (populatedMsg) => {
      setTypedMessage("");
      // Optimistically update conversation cache list
      queryClient.setQueryData(["conversation", projectId], (old = []) => {
        if (old.some((m) => m._id === populatedMsg._id)) return old;
        return [...old, populatedMsg];
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to deliver message.");
    },
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (typedMessage.trim() && !sendMutation.isPending) {
      sendMutation.mutate(typedMessage.trim());
    }
  };

  return (
    <GlassCard className="bg-[#0b0f19]/75 border-white/8 backdrop-blur-2xl flex flex-col h-[520px] p-0 overflow-hidden">
      {/* Header bar info */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/1">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold text-white tracking-wide">Secure Project Channel</span>
        </div>
        <span className="text-[10px] text-gray-500 font-mono">id: {projectId}</span>
      </div>

      {/* Messages list scroller */}
      <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 font-sans select-text scrollbar-thin">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-10 w-1/3 ml-auto" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-2">
            <MessageSquare className="text-gray-600 animate-pulse-slow" size={24} />
            <p className="text-xs text-gray-400 font-bold">Secure connection established</p>
            <p className="text-[10px] text-gray-500 font-light">Type a message below to start communicating.</p>
          </div>
        ) : (
          messages.map((m) => {
            const isSelf = m.sender?._id === user?._id || m.sender === user?._id;
            return (
              <div key={m._id} className={`flex items-start gap-2.5 max-w-lg ${isSelf ? "ml-auto flex-row-reverse" : ""}`}>
                <Avatar user={m.sender} size="sm" className="mt-0.5" />
                <div className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                  isSelf
                    ? "bg-gradient-to-r from-primary to-secondary text-white rounded-tr-none shadow-md"
                    : "bg-white/5 border border-white/5 text-gray-200 rounded-tl-none"
                }`}>
                  <div className="flex items-center justify-between gap-4 font-bold text-[10px] text-white/50 font-sans">
                    <span>{m.sender?.name || "Professional"}</span>
                    <span className="font-mono text-[8px]">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="font-light leading-relaxed break-words mt-1">{m.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Chat bottom input area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-white/1 flex items-center gap-2">
        <input
          type="text"
          placeholder="Message project channel..."
          value={typedMessage}
          onChange={(e) => setTypedMessage(e.target.value)}
          disabled={sendMutation.isPending}
          className="flex-1 bg-white/3 border border-white/8 rounded-lg px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
        />
        <Button
          type="submit"
          variant="primary"
          disabled={!typedMessage.trim() || sendMutation.isPending}
          className="p-2.5 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer shadow-neon-primary"
        >
          <Send size={13} />
        </Button>
      </form>
    </GlassCard>
  );
}

// ==========================================
// 3. FILES TAB SCREEN COMPONENT
// ==========================================
function FilesTab({ projectId, project }) {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // TanStack query to fetch project files
  const { data: dbFiles = [], isLoading: filesLoading, error: filesError } = useQuery({
    queryKey: ["project-files", projectId],
    queryFn: async () => {
      const res = await api.get(`/files/${projectId}`);
      return res.data || [];
    },
    enabled: !!projectId,
  });

  const handleUpload = async (fileItem) => {
    if (!fileItem) return;
    setIsUploading(true);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("file", fileItem);

    try {
      setUploadProgress(50);
      await api.post("/files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setUploadProgress(100);
      toast.success("File shared successfully!");
      
      // Invalidate query to automatically fetch fresh database list
      queryClient.invalidateQueries({ queryKey: ["project-files", projectId] });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to share file.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleUpload(droppedFile);
  };

  return (
    <div className="space-y-6">
      {/* Upload Drop Zone card */}
      <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-white/10 rounded-xl py-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500/30 hover:bg-white/1 transition-all space-y-3"
        >
          <UploadCloud size={28} className="text-gray-500 animate-pulse-slow" />
          <div>
            <p className="text-xs font-bold text-white">Drag & drop files here, or browse files</p>
            <p className="text-[9px] text-gray-500 mt-1">Image uploads or PDF project specifications (max 10MB)</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => handleUpload(e.target.files[0])}
          />
        </div>

        {/* Upload Progress Loader */}
        {isUploading && (
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
              <span>Uploading asset...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}
      </GlassCard>

      {/* Files Index Display */}
      <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <FileCode size={16} className="text-secondary" />
          <span>Shared Project Attachments</span>
        </h3>

        {filesLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : filesError ? (
          <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs text-rose-400 flex items-center gap-2.5">
            <AlertTriangle size={15} />
            <span>Failed to synchronize attachments list from the database gateway.</span>
          </div>
        ) : dbFiles.length === 0 ? (
          <div className="py-12 border border-dashed border-white/5 rounded-xl text-center text-gray-500 text-xs font-light">
            No document artifacts uploaded to this project yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dbFiles.map((f, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/2"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-white/5 text-secondary flex-shrink-0">
                    {f.fileType === "image" ? (
                      <img src={f.fileUrl} alt={f.fileName} className="h-6 w-6 object-cover rounded" />
                    ) : f.fileType === "pdf" ? (
                      <FileText size={15} className="text-rose-400" />
                    ) : (
                      <FileText size={15} />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white truncate max-w-[180px]" title={f.fileName}>
                      {f.fileName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-gray-500 font-mono lowercase">
                      <span>{f.fileType}</span>
                      <span>•</span>
                      <span>{f.uploadedBy?.name || "Member"}</span>
                      <span>•</span>
                      <span>{new Date(f.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={f.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded bg-white/5 text-gray-400 hover:text-white cursor-pointer transition-colors"
                    title="Preview File"
                  >
                    <Eye size={13} />
                  </a>
                  <a
                    href={f.fileUrl}
                    download={f.fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded bg-white/5 text-gray-400 hover:text-white cursor-pointer transition-colors"
                    title="Download File"
                  >
                    <Download size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}


// ==========================================
// 4. ACTIVITY TAB SCREEN COMPONENT
// ==========================================
function ActivitiesTab({ projectId }) {
  // Query activity history logs
  const { data: rawActivities = [], isLoading } = useQuery({
    queryKey: ["project-activities", projectId],
    queryFn: async () => {
      const res = await api.get(`/activity/${projectId}`);
      return res.data || [];
    },
    enabled: !!projectId,
  });

  const timelineItems = rawActivities.map((act) => ({
    date: new Date(act.createdAt).toLocaleDateString(),
    badge: act.action?.toLowerCase() || "log",
    title: act.details || "Activity captured",
    description: `Registered by ${act.user?.name || "System"}.`,
    active: true,
  }));

  return (
    <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6">
      <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
        <Activity size={16} className="text-primary" />
        <span>Project Activity Timeline</span>
      </h3>

      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : timelineItems.length === 0 ? (
        <div className="py-12 border border-dashed border-white/5 rounded-xl text-center text-gray-500 text-xs">
          No project activity captures recorded.
        </div>
      ) : (
        <Timeline items={timelineItems} />
      )}
    </GlassCard>
  );
}

// ==========================================
// 5. REVIEWS TAB SCREEN COMPONENT
// ==========================================
function ReviewsTab({ projectId, project, isClient }) {
  const queryClient = useQueryClient();
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");

  const isCompleted = project.status === "Completed";

  // Send Review Mutation
  const reviewMutation = useMutation({
    mutationFn: async (reviewPayload) => {
      const res = await api.post("/reviews", reviewPayload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Feedback rating submitted securely!");
      setCommentInput("");
      // Refetch project
      queryClient.invalidateQueries({ queryKey: ["project-detail", projectId] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to log review. Only client role owners are authorized.");
    },
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    reviewMutation.mutate({
      projectId,
      rating: Number(ratingInput),
      comment: commentInput.trim(),
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
      
      {/* Form Submission (Left Column, only visible to Client manager when project is Completed) */}
      {isClient && isCompleted && (
        <div className="lg:col-span-4">
          <GlassCard className="bg-[#0b0f19]/75 border-white/10 p-6 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Submit Project Review</h4>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              
              {/* Rating dropdown */}
              <div>
                <label className="block text-[10px] text-gray-400 font-semibold mb-1">Stars score</label>
                <select
                  value={ratingInput}
                  onChange={(e) => setRatingInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white/3 border border-white/8 rounded text-white focus:outline-none"
                >
                  <option value="5">5 Stars (Excellent)</option>
                  <option value="4">4 Stars (Good)</option>
                  <option value="3">3 Stars (Average)</option>
                  <option value="2">2 Stars (Fair)</option>
                  <option value="1">1 Star (Poor)</option>
                </select>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-[10px] text-gray-400 font-semibold mb-1">Feedback Message</label>
                <textarea
                  rows="4"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Detail your experience collaborating on deliverables..."
                  className="w-full px-3 py-2 text-xs bg-white/3 border border-white/8 rounded text-white focus:outline-none resize-none"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full text-xs font-bold py-2.5"
                disabled={reviewMutation.isPending || !commentInput.trim()}
              >
                Log Feedback
              </Button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Reviews feed */}
      <div className={isClient && isCompleted ? "lg:col-span-8" : "lg:col-span-12"}>
        <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Star size={16} className="text-warning animate-pulse-slow" />
            <span>Project Feedback Stream</span>
          </h3>

          {/* Fallback to simple dashboard review empty indicator since the backend doesn't support listings endpoints directly */}
          <div className="py-12 border border-dashed border-white/5 rounded-xl text-center text-gray-500 text-xs font-light flex flex-col items-center justify-center space-y-2">
            <Star className="text-gray-600" size={24} />
            <div>
              <p className="font-bold">Reviews stream empty</p>
              <p className="text-[10px] max-w-sm mt-0.5 leading-relaxed">
                Escrow ratings logs are saved to database schemas when clients post feedback upon milestone completion.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

    </div>
  );
}
