import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { PlusCircle, Sparkles, FolderPlus, DollarSign, Clock, FileText, ArrowLeft } from "lucide-react";
import { api } from "../services/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import GlassCard, {
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
} from "../components/ui/GlassCard";
import toast from "react-hot-toast";

// Schema matching the mongoose Service schema fields exactly
const schema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required." })
    .max(80, { message: "Title cannot exceed 80 characters." }),
  category: z
    .string()
    .min(1, { message: "Category is required." }),
  pricing: z
    .number({ invalid_type_error: "Pricing must be a number." })
    .positive({ message: "Pricing must be greater than 0." }),
  deliveryTimeline: z
    .number({ invalid_type_error: "Timeline must be a number." })
    .int({ message: "Timeline must be a whole number." })
    .min(1, { message: "Delivery timeline must be at least 1 day." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
});

export default function CreateServicePage() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      title: "",
      category: "AI Engineering",
      pricing: 50,
      deliveryTimeline: 5,
      description: "",
    },
  });

  // TanStack Query Mutation calling Axios post
  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/services", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Service published successfully!");
      // Invalidate queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
      
      setTimeout(() => {
        window.location.href = "/marketplace/my-services";
      }, 800);
    },
    onError: (err) => {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to create service. Please try again.";
      toast.error(msg);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="relative min-h-screen bg-bg-base text-gray-200 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden select-none font-sans">
      {/* Background radial meshes */}
      <div className="absolute inset-0 noise-overlay pointer-events-none z-50 opacity-2" />
      <div className="absolute inset-0 grid-overlay opacity-25 pointer-events-none z-0" />
      <div className="absolute top-[-100px] right-[-100px] h-[500px] w-[500px] rounded-full bg-primary/10 glow-circle opacity-20 pointer-events-none" />

      <div className="max-w-2xl mx-auto w-full relative z-10 space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <a
            href="/marketplace/my-services"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={13} />
            <span>My Gigs</span>
          </a>
          <Badge variant="primary" size="sm">Freelancer Access Only</Badge>
        </div>

        <GlassCard hoverGlow className="bg-[#0b0f19]/75 border-white/8 backdrop-blur-2xl shadow-2xl p-8">
          <GlassCardHeader className="p-0 mb-6">
            <div className="flex items-center gap-2.5 mb-2">
              <FolderPlus className="text-primary animate-pulse" size={20} />
              <GlassCardTitle className="text-2xl font-extrabold text-white">
                Create New Service
              </GlassCardTitle>
            </div>
            <GlassCardDescription className="text-xs text-gray-400 font-light leading-relaxed">
              Fill in the specifications below to create your service card. All fields align directly with database constraints.
            </GlassCardDescription>
          </GlassCardHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Title field */}
            <div>
              <Input
                label="Service Gig Title"
                placeholder="e.g. Develop custom LangChain workflows with Gemini API"
                id="title"
                autoFocus
                disabled={mutation.isPending}
                error={errors.title?.message}
                {...register("title")}
              />
            </div>

            {/* Grid for Category, Price, Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-xs font-semibold text-gray-400 mb-1.5">
                  Category Area
                </label>
                <select
                  id="category"
                  disabled={mutation.isPending}
                  className="w-full px-3 py-2.5 text-xs rounded-lg border border-white/8 bg-white/3 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
                  {...register("category")}
                >
                  <option value="AI Engineering">AI Engineering</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Fullstack">Fullstack Dev</option>
                  <option value="Web3">Web3 Dev</option>
                </select>
                {errors.category && (
                  <p className="text-[10px] text-rose-400 pl-1 mt-1">{errors.category.message}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <Input
                  label="Starting Price ($)"
                  type="number"
                  placeholder="95"
                  id="pricing"
                  leftIcon={DollarSign}
                  disabled={mutation.isPending}
                  error={errors.pricing?.message}
                  {...register("pricing", { valueAsNumber: true })}
                />
              </div>

              {/* Delivery timeline */}
              <div>
                <Input
                  label="Delivery Timeline (days)"
                  type="number"
                  placeholder="7"
                  id="deliveryTimeline"
                  leftIcon={Clock}
                  disabled={mutation.isPending}
                  error={errors.deliveryTimeline?.message}
                  {...register("deliveryTimeline", { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Description textarea */}
            <div>
              <label htmlFor="description" className="block text-xs font-semibold text-gray-400 mb-1.5">
                Service Description
              </label>
              <textarea
                id="description"
                placeholder="Detail what deliverables you provide, technical stack, scope details..."
                rows="5"
                disabled={mutation.isPending}
                className={`w-full px-3 py-2.5 text-xs rounded-lg border bg-white/3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all font-sans resize-none ${
                  errors.description ? "border-rose-500/40 focus:border-rose-500" : "border-white/8"
                }`}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-[10px] text-rose-400 pl-1 mt-1">{errors.description.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={mutation.isPending || !isValid}
              loading={mutation.isPending}
              className="w-full text-xs font-bold py-3 mt-4"
            >
              Publish Service Gig
            </Button>
          </form>
        </GlassCard>
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
