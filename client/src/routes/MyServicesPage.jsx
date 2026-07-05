import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Star,
  Activity,
  Briefcase,
  AlertTriangle,
  Search,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import GlassCard, {
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
} from "../components/ui/GlassCard";
import MetricCard from "../components/ui/MetricCard";
import Skeleton from "../components/ui/Skeleton";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import toast from "react-hot-toast";

export default function MyServicesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch all services and filter in frontend to find owned services
  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await api.get("/services");
      return response.data?.services || [];
    },
  });

  // Filter owned services
  const myServices = services.filter((service) => {
    const freelancerId = service.freelancer?._id || service.freelancer;
    return freelancerId === user?._id;
  });

  // Filter by local search query
  const filteredMyServices = myServices.filter((service) =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics metrics
  const activeGigsCount = myServices.length;
  const avgRating =
    myServices.reduce((acc, curr) => acc + (curr.rating || 0), 0) / (activeGigsCount || 1);
  const totalReviewsCount = myServices.reduce((acc, curr) => acc + (curr.totalReviews || 0), 0);

  // Delete Mutation with Optimistic Updates
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/services/${id}`);
      return response.data;
    },
    // Optimistic Update
    onMutate: async (deletedId) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["services"] });

      // Snapshot the previous value
      const previousServices = queryClient.getQueryData(["services"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["services"], (old = []) =>
        old.filter((service) => service._id !== deletedId)
      );

      // Return context with snapshotted value
      return { previousServices };
    },
    onError: (err, deletedId, context) => {
      // Rollback to snapshotted state
      if (context?.previousServices) {
        queryClient.setQueryData(["services"], context.previousServices);
      }
      toast.error(err.response?.data?.message || "Failed to delete service.");
    },
    onSuccess: () => {
      toast.success("Service deleted from escrow dashboard.");
    },
    onSettled: () => {
      // Always refetch to sync with server
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      deleteMutation.mutate(deleteTargetId);
      setIsDeleteModalOpen(false);
      setDeleteTargetId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-base p-6 space-y-6">
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-bg-base text-gray-200 p-6 md:p-8 lg:p-12 overflow-hidden select-none font-sans">
      <div className="absolute inset-0 noise-overlay pointer-events-none z-50 opacity-2" />
      <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none z-0" />
      
      {/* Visual background spots */}
      <div className="absolute top-[-100px] right-[-100px] h-[500px] w-[500px] rounded-full bg-primary glow-circle opacity-10" />
      <div className="absolute bottom-[-100px] left-[-100px] h-[500px] w-[500px] rounded-full bg-secondary glow-circle opacity-10" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="primary" size="sm" className="mb-2">Escrow Provider Profile</Badge>
            <h1 className="text-3xl font-black text-white tracking-tight">
              My Published Services
            </h1>
            <p className="text-xs text-gray-400 font-light mt-1">
              Review and manage your active bids, pricing tiers, and delivery timelines.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => (window.location.href = "/marketplace/services/new")}
            className="flex items-center gap-1.5 self-start sm:self-center font-bold text-xs"
          >
            <Plus size={14} />
            <span>Create New Gig</span>
          </Button>
        </div>

        {/* Animated Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Active Gigs"
            value={`${activeGigsCount} Services`}
            trend={0}
            icon={Briefcase}
            sparklineData={[0, activeGigsCount]}
          />
          <MetricCard
            title="Average Quality Rating"
            value={`${avgRating.toFixed(1)} / 5.0`}
            trend={12.4}
            icon={Star}
            sparklineData={[4.0, 4.2, 4.5, 4.8, avgRating]}
          />
          <MetricCard
            title="Escrow Reviews"
            value={`${totalReviewsCount} Reviews`}
            trend={3.5}
            icon={Activity}
            sparklineData={[2, 5, 8, 12, totalReviewsCount]}
          />
        </div>

        {/* Main Gigs Listing Panel */}
        <GlassCard hoverGlow className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <h3 className="text-base font-bold text-white">Active Service Catalog</h3>
            
            {/* Search Input */}
            <div className="relative w-full md:max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search gigs or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-white/5 bg-white/3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
              />
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            <div className="space-y-3">
              {filteredMyServices.map((service) => (
                <motion.div
                  key={service._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 transition-colors gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white hover:text-primary transition-colors cursor-pointer" onClick={() => window.location.href = `/marketplace/services/${service._id}`}>
                        {service.title}
                      </span>
                      <Badge variant="outline" size="sm" className="text-[9px] lowercase font-mono">
                        {service.category}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-gray-400 font-light line-clamp-1 max-w-xl">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    {/* Price and timeline parameters */}
                    <div className="text-right">
                      <p className="text-xs font-black text-white font-mono">${service.pricing}</p>
                      <p className="text-[9px] text-gray-500 font-mono mt-0.5">{service.deliveryTimeline}d delivery</p>
                    </div>

                    {/* Quick controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => (window.location.href = `/marketplace/services/${service._id}`)}
                        className="p-2 rounded bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        title="View Service details"
                      >
                        <Eye size={12} />
                      </button>
                      <button
                        onClick={() => (window.location.href = `/marketplace/services/${service._id}/edit`)}
                        className="p-2 rounded bg-white/5 border border-white/5 text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                        title="Edit Service parameters"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(service._id)}
                        className="p-2 rounded bg-white/5 border border-white/5 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                        title="Delete Service gig"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredMyServices.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center border border-dashed border-white/8 rounded-xl bg-white/2">
                  <p className="text-gray-400 text-xs font-light">No published service gigs found</p>
                  <p className="text-gray-600 text-[10px] font-light mt-0.5">Click "Create New Gig" at the top right to start bidding.</p>
                </div>
              )}
            </div>
          </AnimatePresence>
        </GlassCard>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Service Deletion"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-400 flex gap-2 items-start font-mono leading-relaxed">
            <AlertTriangle size={15} className="flex-shrink-0 mt-0.5 animate-pulse" />
            <div>
              <span className="font-bold text-white uppercase">[Warning]:</span> This action is destructive and irreversible. Deleting this service removes it from search catalogs.
            </div>
          </div>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            Are you sure you want to delete this service card? Current active client contract escrows using this service definition will remain active.
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" size="sm" className="w-full text-xs font-bold" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" className="w-full text-xs font-bold bg-rose-600 hover:bg-rose-500 shadow-rose-600/15" onClick={confirmDelete}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>

      <style>{`
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.015;
        }
      `}</style>
    </div>
  );
}
