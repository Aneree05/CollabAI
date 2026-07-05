import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import GlassCard, {
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
} from "../components/ui/GlassCard";
import Badge from "../components/ui/Badge";
import toast from "react-hot-toast";

// Validation schema
const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Email address is required." })
    .email({ message: "Must be a valid email address format." }),
  password: z
    .string()
    .min(6, { message: "Password must contain at least 6 characters." }),
  rememberMe: z.boolean().optional(),
});

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

  // Retrieve saved email for Remember Me
  const [savedEmail] = useState(() => {
    return localStorage.getItem("collabai_remember_email") || "";
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: savedEmail,
      rememberMe: !!savedEmail,
    },
  });

  // Track Caps Lock
  const handleKeyDown = (e) => {
    const isCapsLock = e.getModifierState && e.getModifierState("CapsLock");
    setCapsLockActive(isCapsLock);
  };

  // TanStack Query Mutation for Axios JWT authentication
  const loginMutation = useMutation({
    mutationFn: async (data) => {
      // Sanitize inputs
      const email = data.email.trim().toLowerCase();
      const password = data.password;
      return await login(email, password);
    },
    onSuccess: (user, data) => {
      // Remember me email caching
      if (data.rememberMe) {
        localStorage.setItem("collabai_remember_email", data.email);
      } else {
        localStorage.removeItem("collabai_remember_email");
      }

      toast.success(`Welcome back, ${user.name}!`);

      // Determine redirect path by role
      setTimeout(() => {
        if (user.roles?.includes("admin")) {
          window.location.href = "/dashboard/admin";
        } else if (user.roles?.includes("client")) {
          window.location.href = "/dashboard/client";
        } else {
          window.location.href = "/dashboard/freelancer";
        }
      }, 800);
    },
    onError: (err) => {
      console.error("Authentication error details:", err);
      // Clean and safe user-facing message, hide raw database outputs
      const message = err.message || "Invalid credentials. Please verify your email and password.";
      toast.error(message);
    },
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="relative min-h-screen bg-bg-base text-gray-200 grid grid-cols-1 lg:grid-cols-12 overflow-hidden select-none font-sans">
      {/* Background visual layers */}
      <div className="absolute inset-0 noise-overlay pointer-events-none z-50 opacity-2" />
      <div className="absolute inset-0 grid-overlay opacity-25 pointer-events-none z-0" />

      {/* Full Page Loading Overlay */}
      <AnimatePresence>
        {loginMutation.isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050816]/90 backdrop-blur-md flex flex-col items-center justify-center gap-4"
          >
            <div className="relative flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <Sparkles size={20} className="text-primary absolute animate-pulse" />
            </div>
            <p className="text-xs text-gray-400 font-mono tracking-widest uppercase">
              Verifying security tokens...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left side: Animated Illustration (Hidden on mobile) */}
      <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-between p-12 overflow-hidden border-r border-white/5 bg-[#050816]/50">
        <div className="absolute top-[10%] left-[10%] h-[600px] w-[600px] rounded-full bg-primary/10 glow-circle opacity-30 pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] h-[500px] w-[500px] rounded-full bg-secondary/10 glow-circle opacity-25 pointer-events-none" />

        {/* Brand Header */}
        <a href="/" className="flex items-center gap-2 relative z-10">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
            <Sparkles size={18} className="text-white fill-white/10 animate-pulse-slow" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            Collab<span className="text-primary text-gradient-neon">AI</span>
          </span>
        </a>

        {/* Floating dashboard visual elements */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-lg border border-white/10 bg-[#0b0f19]/80 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 relative"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span className="text-xs font-mono font-bold text-gray-300">escrow_vault_active</span>
              </div>
              <Badge variant="success" size="sm">secured</Badge>
            </div>

            <div className="space-y-4">
              <div className="h-10 border border-white/5 bg-[#050816]/75 rounded-lg flex items-center justify-between px-3 text-xs">
                <span className="text-gray-400">Total Volume Guarded</span>
                <span className="font-mono text-white font-bold">$14,820,000.00</span>
              </div>

              {/* Progress bars illustrating activity */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] text-gray-500 font-mono">
                  <span>Matchmaker parsing queue</span>
                  <span className="text-indigo-400">98.4% fit rate</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "98.4%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-primary to-accent"
                  />
                </div>
              </div>

              <div className="p-3 border border-white/5 bg-[#050816]/30 rounded-lg text-[11px] text-gray-400 leading-relaxed font-light font-mono">
                [AGENTS] Escrow layer compiled cleanly. System verifying signature verification keys.
              </div>
            </div>
          </motion.div>

          {/* Subtext description below illustration */}
          <div className="mt-8 text-center max-w-md">
            <h2 className="text-lg font-bold text-white font-sans">
              Elite Network Escrow Protections
            </h2>
            <p className="text-xs text-gray-400 font-light mt-1.5 leading-relaxed">
              Verify credentials instantly, lock payment values in transparent escrow reserves, and collaborate within visual workspace channels.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-[10px] text-gray-600 font-mono relative z-10">
          © 2026 CollabAI Inc. Verified Cryptographic Escrows.
        </p>
      </div>

      {/* Right side: Login Card */}
      <div className="col-span-1 lg:col-span-5 flex items-center justify-center p-6 relative z-10 bg-[#050816]/20">
        <div className="absolute top-[40%] right-[-100px] h-[400px] w-[400px] rounded-full bg-primary/10 glow-circle opacity-20 pointer-events-none" />

        <div className="w-full max-w-md">
          <GlassCard hoverGlow className="bg-[#0b0f19]/75 border-white/8 backdrop-blur-2xl shadow-2xl p-8">
            <GlassCardHeader className="p-0 mb-6">
              <div className="flex justify-center lg:hidden mb-4">
                <a href="/" className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center">
                    <Sparkles size={18} className="text-white fill-white/10" />
                  </div>
                </a>
              </div>
              <GlassCardTitle className="text-2xl font-extrabold text-white text-center lg:text-left">
                Verify Identity
              </GlassCardTitle>
              <GlassCardDescription className="text-xs text-gray-400 font-light mt-1 text-center lg:text-left">
                Access your secure workspace workspace metrics.
              </GlassCardDescription>
            </GlassCardHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Address */}
              <div>
                <Input
                  label="Workspace Email"
                  placeholder="alex@collabai.com"
                  leftIcon={Mail}
                  type="email"
                  id="email"
                  autoFocus
                  disabled={loginMutation.isPending}
                  error={errors.email?.message}
                  className={
                    errors.email
                      ? "border-rose-500/40 focus:border-rose-500"
                      : dirtyFields.email && !errors.email
                      ? "border-emerald-500/40 focus:border-emerald-500"
                      : ""
                  }
                  {...register("email")}
                />
                {dirtyFields.email && !errors.email && (
                  <p className="text-[10px] text-emerald-400 font-medium pl-1 mt-1 flex items-center gap-1 animate-fade-in">
                    <CheckCircle size={10} />
                    <span>Email format verified</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <Input
                  label="Security Password"
                  placeholder="••••••••"
                  leftIcon={Lock}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  disabled={loginMutation.isPending}
                  error={errors.password?.message}
                  onKeyDown={handleKeyDown}
                  className={
                    errors.password
                      ? "border-rose-500/40 focus:border-rose-500"
                      : dirtyFields.password && !errors.password
                      ? "border-emerald-500/40 focus:border-emerald-500"
                      : ""
                  }
                  {...register("password")}
                />
                
                {/* Password Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-[38px] text-gray-500 hover:text-white transition-colors cursor-pointer"
                  aria-label="Toggle Password Visibility"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>

                {/* Caps Lock warning indicator */}
                {capsLockActive && (
                  <div className="absolute right-10 top-[38px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] text-amber-400 font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                    <AlertCircle size={10} />
                    <span>Caps Lock ON</span>
                  </div>
                )}
              </div>

              {/* Remember me / forgot password actions */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-400 hover:text-white select-none">
                  <input
                    type="checkbox"
                    disabled={loginMutation.isPending}
                    className="h-3.5 w-3.5 rounded border border-white/10 bg-white/3 text-primary focus:ring-primary focus:ring-opacity-50 accent-primary"
                    {...register("rememberMe")}
                  />
                  <span>Remember me</span>
                </label>

                <a
                  href="/forgot-password"
                  className="text-xs text-gray-400 hover:text-white hover:underline transition-colors"
                >
                  Forgot Password?
                </a>
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={loginMutation.isPending || !isValid}
                loading={loginMutation.isPending}
                className="w-full text-xs font-bold py-3 mt-4 flex items-center justify-center gap-1.5"
              >
                <span>Verify & Continue</span>
                <ArrowRight size={14} />
              </Button>
            </form>

            <GlassCardFooter className="flex flex-col gap-4 text-center mt-6 p-0 border-t border-white/5 pt-6">
              <p className="text-xs text-gray-400 font-light">
                Don't possess a workspace account?{" "}
                <a href="/register" className="text-primary hover:text-indigo-400 font-bold hover:underline">
                  Create Workspace
                </a>
              </p>
            </GlassCardFooter>
          </GlassCard>
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
