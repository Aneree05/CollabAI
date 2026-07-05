import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Brain,
  ArrowLeft,
  Sparkles,
  Copy,
  Download,
  Trash2,
  Send,
  HelpCircle,
  Check,
} from "lucide-react";
import { api } from "../services/api";
import Button from "../components/ui/Button";
import GlassCard, {
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
} from "../components/ui/GlassCard";
import Badge from "../components/ui/Badge";
import toast from "react-hot-toast";

// Example scope prompt chips
const EXAMPLES = [
  "Build a secure chat app using WebSockets, Node.js, and React.",
  "Design a SaaS landing page with responsive bento grids and animations.",
  "Develop a decentralized voting contract with solidity smart tests.",
];

export default function AIScopeGenerator() {
  const [prompt, setPrompt] = useState("");
  const [rawResponse, setRawResponse] = useState("");
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [copied, setCopied] = useState(false);

  // Typing streaming-style effect simulation
  useEffect(() => {
    if (!rawResponse) {
      setDisplayedResponse("");
      return;
    }

    setDisplayedResponse("");
    let currentIdx = 0;
    const interval = setInterval(() => {
      setDisplayedResponse((prev) => prev + rawResponse.charAt(currentIdx));
      currentIdx++;
      if (currentIdx >= rawResponse.length) {
        clearInterval(interval);
      }
    }, 4);

    return () => clearInterval(interval);
  }, [rawResponse]);

  // TanStack Query Mutation linking to backend AI API
  const scopeMutation = useMutation({
    mutationFn: async (desc) => {
      const res = await api.post("/ai/project-scope", { description: desc });
      return res.data?.result;
    },
    onSuccess: (data) => {
      setRawResponse(data || "No scope generated.");
      toast.success("Project specifications compiled successfully!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Scope compilation interrupted.");
    },
  });

  const handleGenerate = (e) => {
    e.preventDefault();
    if (prompt.trim() && !scopeMutation.isPending) {
      setRawResponse("");
      scopeMutation.mutate(prompt.trim());
    }
  };

  const handleCopy = () => {
    if (!rawResponse) return;
    navigator.clipboard.writeText(rawResponse);
    setCopied(true);
    toast.success("Scope copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!rawResponse) return;
    const element = document.createElement("a");
    const file = new Blob([rawResponse], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "collabai_project_scope.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Document downloaded!");
  };

  const handleClear = () => {
    setPrompt("");
    setRawResponse("");
    setDisplayedResponse("");
    toast.success("Conversation cleared.");
  };

  return (
    <div className="relative min-h-screen bg-bg-base text-gray-200 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden select-none font-sans flex flex-col justify-center">
      <div className="absolute inset-0 noise-overlay pointer-events-none z-50 opacity-2" />
      <div className="absolute inset-0 grid-overlay opacity-25 pointer-events-none z-0" />
      
      {/* Background visual details */}
      <div className="absolute top-[-100px] left-[10%] h-[500px] w-[500px] rounded-full bg-primary glow-circle opacity-10" />

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
          {/* Left Column: Prompts Input area (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="bg-[#0b0f19]/75 border-white/8 backdrop-blur-2xl p-6">
              <GlassCardHeader className="p-0 mb-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Brain className="text-primary animate-pulse-slow" size={18} />
                  <GlassCardTitle className="text-lg font-extrabold text-white">Scope Draft Center</GlassCardTitle>
                </div>
                <GlassCardDescription className="text-xs text-gray-400 font-light leading-relaxed">
                  Enter your core project brief. The model outputs technical blocks, frameworks, and milestones.
                </GlassCardDescription>
              </GlassCardHeader>

              <form onSubmit={handleGenerate} className="space-y-4">
                <textarea
                  rows="6"
                  placeholder="e.g. Build a Web3 marketplace..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={scopeMutation.isPending}
                  className="w-full px-3.5 py-3 text-xs bg-white/3 border border-white/8 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all font-sans resize-none"
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full text-xs font-bold py-3 shadow-neon-primary"
                  loading={scopeMutation.isPending}
                  disabled={!prompt.trim() || scopeMutation.isPending}
                >
                  <Send size={12} className="mr-1.5" />
                  <span>Generate Scope</span>
                </Button>
              </form>

              {/* example prompts list */}
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

          {/* Right Column: Output displays (7 cols) */}
          <div className="lg:col-span-7">
            <GlassCard className="bg-[#0b0f19]/70 border-white/8 backdrop-blur-2xl p-6 min-h-[400px] flex flex-col justify-between">
              
              {/* Output Header Controls */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles size={13} className="text-indigo-400" />
                  <span>Compiled Scope Logs</span>
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

              {/* Text display */}
              <div className="flex-1 overflow-y-auto max-h-[380px] pr-2 scrollbar-thin">
                {scopeMutation.isPending ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : displayedResponse ? (
                  <pre className="text-xs text-gray-300 font-light leading-relaxed whitespace-pre-wrap font-sans select-text">
                    {displayedResponse}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-2 py-20">
                    <Brain className="text-gray-700 animate-pulse-slow" size={28} />
                    <p className="text-xs text-gray-500 font-bold">Workspace Ready</p>
                    <p className="text-[10px] text-gray-600 font-light max-w-xs mt-1 leading-relaxed">
                      AI response outputs are streamed dynamically character-by-character. Submit a prompt to start drafting.
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
