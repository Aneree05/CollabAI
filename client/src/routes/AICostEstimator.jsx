import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Calculator,
  ArrowLeft,
  Sparkles,
  Copy,
  Download,
  Trash2,
  Send,
  DollarSign,
  Clock,
  Gauge,
  Users,
  Check,
} from "lucide-react";
import { api } from "../services/api";
import Button from "../components/ui/Button";
import GlassCard, {
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
} from "../components/ui/GlassCard";
import Badge from "../components/ui/Badge";
import Skeleton from "../components/ui/Skeleton";
import toast from "react-hot-toast";

const EXAMPLES = [
  "Build a Web3 gaming contract with react dashboard interface.",
  "Create an enterprise SaaS dashboard panel with live sockets stream logs.",
  "Design a dark-themed portfolio mesh layout for developer studio profile.",
];

export default function AICostEstimator() {
  const [prompt, setPrompt] = useState("");
  const [rawResponse, setRawResponse] = useState("");
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [copied, setCopied] = useState(false);

  // Parsing helper to grab specific metric blocks from standard AI text response formats
  const extractMetric = (key = "") => {
    if (!rawResponse) return "--";
    const lines = rawResponse.split("\n");
    const matchLine = lines.find((line) => line.toLowerCase().includes(key.toLowerCase()));
    if (matchLine) {
      const parts = matchLine.split(":");
      return parts[1] ? parts[1].trim() : matchLine.replace(/.*:/, "").trim();
    }
    return "--";
  };

  // Extracting variables
  const timeline = extractMetric("timeline") || extractMetric("time") || "3-4 weeks";
  const cost = extractMetric("cost") || extractMetric("usd") || "$4,500";
  const difficulty = extractMetric("difficulty") || "Medium";
  const teamSize = extractMetric("team") || extractMetric("size") || "2-3 developers";

  // Typing effect
  useEffect(() => {
    if (!rawResponse) {
      setDisplayedResponse("");
      return;
    }

    setDisplayedResponse("");
    let idx = 0;
    const timer = setInterval(() => {
      setDisplayedResponse((prev) => prev + rawResponse.charAt(idx));
      idx++;
      if (idx >= rawResponse.length) {
        clearInterval(timer);
      }
    }, 4);

    return () => clearInterval(timer);
  }, [rawResponse]);

  // TanStack Query Cost Mutation linking to backend `/ai/cost-estimator`
  const costMutation = useMutation({
    mutationFn: async (desc) => {
      const res = await api.post("/ai/cost-estimator", { description: desc });
      return res.data?.result;
    },
    onSuccess: (data) => {
      setRawResponse(data || "");
      toast.success("Cost estimates calculated successfully!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Estimations calculation interrupted.");
    },
  });

  const handleEstimate = (e) => {
    e.preventDefault();
    if (prompt.trim() && !costMutation.isPending) {
      setRawResponse("");
      costMutation.mutate(prompt.trim());
    }
  };

  const handleCopy = () => {
    if (!rawResponse) return;
    navigator.clipboard.writeText(rawResponse);
    setCopied(true);
    toast.success("Calculations copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!rawResponse) return;
    const element = document.createElement("a");
    const file = new Blob([rawResponse], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "collabai_cost_estimate.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Estimates document downloaded!");
  };

  const handleClear = () => {
    setPrompt("");
    setRawResponse("");
    setDisplayedResponse("");
    toast.success("Calculation cleared.");
  };

  return (
    <div className="relative min-h-screen bg-bg-base text-gray-200 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden select-none font-sans flex flex-col justify-center">
      <div className="absolute inset-0 noise-overlay pointer-events-none z-50 opacity-2" />
      <div className="absolute inset-0 grid-overlay opacity-25 pointer-events-none z-0" />

      {/* Ambient background glow spots */}
      <div className="absolute bottom-[-100px] left-[10%] h-[500px] w-[500px] rounded-full bg-secondary glow-circle opacity-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full relative z-10 space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <a
            href="/ai"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={13} />
            <span>AI Hub</span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: inputs prompt panels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="bg-[#0b0f19]/75 border-white/8 backdrop-blur-2xl p-6">
              <GlassCardHeader className="p-0 mb-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Calculator className="text-secondary animate-pulse-slow" size={18} />
                  <GlassCardTitle className="text-lg font-extrabold text-white">Escrow Estimator Center</GlassCardTitle>
                </div>
                <GlassCardDescription className="text-xs text-gray-400 font-light leading-relaxed">
                  Enter your project requirements. The model estimates budget bounds, timelines, and developers required.
                </GlassCardDescription>
              </GlassCardHeader>

              <form onSubmit={handleEstimate} className="space-y-4">
                <textarea
                  rows="6"
                  placeholder="e.g. Build a Web3 marketplace..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={costMutation.isPending}
                  className="w-full px-3.5 py-3 text-xs bg-white/3 border border-white/8 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all font-sans resize-none"
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full text-xs font-bold py-3 shadow-neon-secondary"
                  loading={costMutation.isPending}
                  disabled={!prompt.trim() || costMutation.isPending}
                >
                  <Send size={12} className="mr-1.5" />
                  <span>Estimate Costs</span>
                </Button>
              </form>

              {/* examples prompts list */}
              <div className="mt-6 pt-6 border-t border-white/5 space-y-2">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider pl-0.5">Quick Examples</p>
                <div className="space-y-2">
                  {EXAMPLES.map((ex, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPrompt(ex)}
                      className="w-full text-left p-2.5 rounded-lg border border-white/4 bg-white/1 hover:bg-white/3 hover:border-white/8 text-[10.5px] text-gray-400 hover:text-white transition-all duration-200 cursor-pointer line-clamp-2 leading-relaxed"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right Column: cost analysis and outputs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 4 Stats Cards grid */}
            {rawResponse && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-white/5 bg-[#0b0f19]/70 backdrop-blur-md flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <DollarSign size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Estimated Cost</p>
                    <p className="text-xs font-black text-white font-mono mt-0.5">{cost}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-[#0b0f19]/70 backdrop-blur-md flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Timeline</p>
                    <p className="text-xs font-black text-white font-mono mt-0.5">{timeline}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-[#0b0f19]/70 backdrop-blur-md flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                    <Gauge size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Difficulty</p>
                    <p className="text-xs font-black text-white font-mono mt-0.5">{difficulty}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-[#0b0f19]/70 backdrop-blur-md flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Users size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Team Recommendation</p>
                    <p className="text-xs font-black text-white font-mono mt-0.5">{teamSize}</p>
                  </div>
                </div>
              </div>
            )}

            <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6 min-h-[300px] flex flex-col justify-between">
              
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles size={13} className="text-secondary" />
                  <span>Cost Explanation Analysis</span>
                </span>

                {rawResponse && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCopy}
                      className="p-2 rounded bg-white/5 hover:bg-white/8 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy response"
                    >
                      {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-2 rounded bg-white/5 hover:bg-white/8 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      title="Download response text"
                    >
                      <Download size={11} />
                    </button>
                    <button
                      onClick={handleClear}
                      className="p-2 rounded bg-white/5 hover:bg-white/8 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                      title="Clear screen logs"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto max-h-[320px] pr-2 scrollbar-thin">
                {costMutation.isPending ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : displayedResponse ? (
                  <pre className="text-xs text-gray-300 font-light leading-relaxed whitespace-pre-wrap font-sans select-text">
                    {displayedResponse}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-2 py-16">
                    <Calculator className="text-gray-700 animate-pulse-slow" size={28} />
                    <p className="text-xs text-gray-500 font-bold">Calculation System Ready</p>
                    <p className="text-[10px] text-gray-600 font-light max-w-xs mt-1 leading-relaxed">
                      Detailed escrow allocations print dynamically character-by-character. Submit a project description to calculate bounds.
                    </p>
                  </div>
                )}
              </div>

            </GlassCard>
          </div>
        </div>
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
