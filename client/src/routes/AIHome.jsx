import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  Calculator,
  UserCheck,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import Button from "../components/ui/Button";
import GlassCard, {
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
} from "../components/ui/GlassCard";
import Badge from "../components/ui/Badge";

export default function AIHome() {
  const features = [
    {
      title: "Project Scope Generator",
      desc: "Deconstruct your project briefs into clean modules, specifications, and target timelines using Gemini.",
      path: "/ai/scope",
      icon: Brain,
      accent: "text-primary",
      glow: "hover:border-primary/30",
    },
    {
      title: "Cost Estimator",
      desc: "Analyze difficulty, recommended team sizes, and escrow cost calculations based on project scopes.",
      path: "/ai/cost",
      icon: Calculator,
      accent: "text-secondary",
      glow: "hover:border-secondary/30",
    },
    {
      title: "Freelancer Recommendation",
      desc: "Discover vetted freelancer profiles, required skills, and budget breakdowns matched to your project descriptions.",
      path: "/ai/freelancer",
      icon: UserCheck,
      accent: "text-accent",
      glow: "hover:border-accent/30",
    },
  ];

  return (
    <div className="relative min-h-screen bg-bg-base text-gray-200 p-6 md:p-8 lg:p-12 overflow-hidden select-none font-sans flex flex-col justify-center">
      <div className="absolute inset-0 noise-overlay pointer-events-none z-50 opacity-2" />
      <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none z-0" />
      
      {/* Dynamic ambient glow spots */}
      <div className="absolute top-[10%] left-[10%] h-[500px] w-[500px] rounded-full bg-primary glow-circle opacity-10 pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] h-[500px] w-[500px] rounded-full bg-secondary glow-circle opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Badge variant="accent" size="sm" className="mb-2 uppercase font-mono tracking-widest">
            Gemini Flash Active
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none">
            Collab<span className="text-primary text-gradient-neon">AI</span> Assistant
          </h1>
          <p className="text-sm text-gray-400 font-light leading-relaxed">
            Welcome to the AI Hub. Leverage advanced AI prompts to draft scope contracts, estimate costs, and hire specialized freelance talent.
          </p>
        </div>

        {/* Features Card Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, idx) => {
            const IconComponent = f.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.01 }}
                className="cursor-pointer"
                onClick={() => (window.location.href = f.path)}
              >
                <GlassCard hoverGlow className={`bg-[#0b0f19]/75 border-white/8 h-full flex flex-col justify-between p-8 transition-all duration-300 ${f.glow}`}>
                  <div className="space-y-6">
                    <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-sm">
                      <IconComponent size={24} className={`${f.accent} animate-pulse-slow`} />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-extrabold text-white">{f.title}</h3>
                      <p className="text-xs text-gray-400 font-light leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-primary transition-colors pt-6 border-t border-white/5 mt-6 font-sans">
                    <span>Initialize Workflow</span>
                    <ArrowRight size={13} className="mt-0.5" />
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Small tips card */}
        <GlassCard className="bg-[#0b0f19]/50 border-white/5 max-w-2xl mx-auto p-4 flex items-center gap-3">
          <Lightbulb size={16} className="text-amber-400 flex-shrink-0" />
          <p className="text-[11px] text-gray-500 font-light leading-normal">
            <span className="font-bold text-white font-mono uppercase">[Tip]:</span> Inputs are parsed securely by the Gemini-2.5-Flash model. For best results, specify development constraints and deliverables clearly.
          </p>
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
