import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, CheckCircle, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
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

// Validation schema using Zod
const schema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name is required." })
      .max(50, { message: "Name cannot exceed 50 characters." }),
    email: z
      .string()
      .min(1, { message: "Email address is required." })
      .email({ message: "Must be a valid email address format." }),
    password: z
      .string()
      .min(6, { message: "Password must contain at least 6 characters." }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required." }),
    role: z.enum(["client", "freelancer", "agency"], {
      required_error: "Role selection is required.",
    }),
    terms: z.literal(true, {
      error_messages: {
        required_error: "You must accept the terms & conditions.",
      },
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password must match the password.",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  
  // Password Strength State variables
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: "Weak", color: "bg-rose-500" });

  const {
    register: registerField,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid, dirtyFields },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "client",
      terms: false,
    },
  });

  const watchedPassword = watch("password", "");

  // Update password strength meter in real time
  useEffect(() => {
    if (!watchedPassword) {
      setPasswordStrength({ score: 0, text: "Weak", color: "bg-rose-500/20" });
      return;
    }
    
    let score = 0;
    if (watchedPassword.length >= 8) score++;
    if (/[0-9]/.test(watchedPassword)) score++;
    if (/[A-Z]/.test(watchedPassword)) score++;
    if (/[^A-Za-z0-9]/.test(watchedPassword)) score++;

    let text = "Weak";
    let color = "bg-rose-500";
    if (score === 2) {
      text = "Fair";
      color = "bg-amber-500";
    } else if (score === 3) {
      text = "Good";
      color = "bg-indigo-400";
    } else if (score === 4) {
      text = "Strong";
      color = "bg-emerald-400";
    }

    setPasswordStrength({ score, text, color });
  }, [watchedPassword]);

  // Track Caps Lock
  const handleKeyDown = (e) => {
    const isCapsLock = e.getModifierState && e.getModifierState("CapsLock");
    setCapsLockActive(isCapsLock);
  };

  // React Query Mutation calling register context handler
  const registerMutation = useMutation({
    mutationFn: async (data) => {
      // Map data structure back to backend expectations: name, email, password, roles
      const formattedData = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        roles: [data.role], // Array structure expected by mongoose schema
      };
      return await registerUser(formattedData);
    },
    onSuccess: (res) => {
      toast.success("Workspace account registered successfully!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    },
    onError: (err) => {
      console.error("Registration error details:", err);
      const msg = err.message || "Failed to create workspace. Try another email address.";
      toast.error(msg);
    },
  });

  const onSubmit = (data) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="relative min-h-screen bg-bg-base text-gray-200 grid grid-cols-1 lg:grid-cols-12 overflow-hidden select-none font-sans">
      {/* Background visual overlays */}
      <div className="absolute inset-0 noise-overlay pointer-events-none z-50 opacity-2" />
      <div className="absolute inset-0 grid-overlay opacity-25 pointer-events-none z-0" />

      {/* Screen Loading Overlay */}
      <AnimatePresence>
        {registerMutation.isPending && (
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
              Creating secure workspace profile...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left side: Layout branding illustration */}
      <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-between p-12 overflow-hidden border-r border-white/5 bg-[#050816]/50">
        <div className="absolute top-[10%] left-[10%] h-[600px] w-[600px] rounded-full bg-primary/10 glow-circle opacity-30 pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] h-[500px] w-[500px] rounded-full bg-secondary/10 glow-circle opacity-25 pointer-events-none" />

        {/* Brand logo header */}
        <a href="/" className="flex items-center gap-2 relative z-10">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
            <Sparkles size={18} className="text-white fill-white/10 animate-pulse-slow" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            Collab<span className="text-primary text-gradient-neon">AI</span>
          </span>
        </a>

        {/* Floating panel elements */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-lg border border-white/10 bg-[#0b0f19]/80 backdrop-blur-2xl rounded-2xl shadow-2xl p-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span className="text-xs font-mono font-bold text-gray-300">security_checksum_valid</span>
              </div>
              <Badge variant="success" size="sm">active</Badge>
            </div>

            <div className="space-y-4">
              <div className="p-3 border border-white/5 bg-[#050816]/30 rounded-lg text-[11px] text-gray-400 leading-relaxed font-light font-mono">
                [SYSTEM] Database cluster initialized. Encrypting password hashes using Bcrypt round allocations...
              </div>

              {/* Progress bars illustrating activity */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] text-gray-500 font-mono">
                  <span>Mongoose Schema checks</span>
                  <span className="text-indigo-400">100% schema alignment</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-primary to-accent"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Subtext description below illustration */}
          <div className="mt-8 text-center max-w-md">
            <h2 className="text-lg font-bold text-white font-sans">
              Welcome to the Digital Frontier
            </h2>
            <p className="text-xs text-gray-400 font-light mt-1.5 leading-relaxed font-sans">
              Sign up as a client to commission project escrows, or register as a freelancer to discover curated AI development bids.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-[10px] text-gray-600 font-mono relative z-10">
          © 2026 CollabAI Inc. Verified Cryptographic Escrows.
        </p>
      </div>

      {/* Right side: Registration Form Card */}
      <div className="col-span-1 lg:col-span-5 flex items-center justify-center p-6 relative z-10 bg-[#050816]/20 overflow-y-auto min-h-screen py-12">
        <div className="absolute top-[40%] right-[-100px] h-[400px] w-[400px] rounded-full bg-primary/10 glow-circle opacity-20 pointer-events-none" />

        <div className="w-full max-w-md my-auto">
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
                Register Workspace
              </GlassCardTitle>
              <GlassCardDescription className="text-xs text-gray-400 font-light mt-1 text-center lg:text-left">
                Create a secure account on CollabAI.
              </GlassCardDescription>
            </GlassCardHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <div>
                <Input
                  label="Display Name"
                  placeholder="Alex Rivera"
                  leftIcon={User}
                  id="name"
                  autoFocus
                  disabled={registerMutation.isPending}
                  error={errors.name?.message}
                  className={
                    errors.name
                      ? "border-rose-500/40 focus:border-rose-500"
                      : dirtyFields.name && !errors.name
                      ? "border-emerald-500/40 focus:border-emerald-500"
                      : ""
                  }
                  {...registerField("name")}
                />
              </div>

              {/* Email Field */}
              <div>
                <Input
                  label="Workspace Email"
                  placeholder="alex@collabai.com"
                  leftIcon={Mail}
                  type="email"
                  id="email"
                  disabled={registerMutation.isPending}
                  error={errors.email?.message}
                  className={
                    errors.email
                      ? "border-rose-500/40 focus:border-rose-500"
                      : dirtyFields.email && !errors.email
                      ? "border-emerald-500/40 focus:border-emerald-500"
                      : ""
                  }
                  {...registerField("email")}
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <Input
                  label="Security Password"
                  placeholder="••••••••"
                  leftIcon={Lock}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  disabled={registerMutation.isPending}
                  error={errors.password?.message}
                  onKeyDown={handleKeyDown}
                  className={
                    errors.password
                      ? "border-rose-500/40 focus:border-rose-500"
                      : dirtyFields.password && !errors.password
                      ? "border-emerald-500/40 focus:border-emerald-500"
                      : ""
                  }
                  {...registerField("password")}
                />

                {/* Password visibility toggle */}
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
                
                {/* Password Strength Indicator */}
                {watchedPassword && (
                  <div className="mt-2 space-y-1.5 animate-fade-in">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-500 font-light">Password Strength:</span>
                      <span className={`font-bold font-mono ${
                        passwordStrength.text === "Weak" 
                          ? "text-rose-400" 
                          : passwordStrength.text === "Fair" 
                          ? "text-amber-400" 
                          : passwordStrength.text === "Good" 
                          ? "text-indigo-400" 
                          : "text-emerald-400"
                      }`}>{passwordStrength.text}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-0.5">
                      <div className={`h-full flex-1 transition-all duration-300 ${passwordStrength.score >= 1 ? passwordStrength.color : "bg-white/5"}`} />
                      <div className={`h-full flex-1 transition-all duration-300 ${passwordStrength.score >= 2 ? passwordStrength.color : "bg-white/5"}`} />
                      <div className={`h-full flex-1 transition-all duration-300 ${passwordStrength.score >= 3 ? passwordStrength.color : "bg-white/5"}`} />
                      <div className={`h-full flex-1 transition-all duration-300 ${passwordStrength.score >= 4 ? passwordStrength.color : "bg-white/5"}`} />
                    </div>
                    {/* Requirements checklist */}
                    <div className="grid grid-cols-2 gap-1 text-[9px] text-gray-500 pt-0.5 font-sans leading-none">
                      <div className={`flex items-center gap-1 ${watchedPassword.length >= 8 ? "text-emerald-400 font-medium" : ""}`}>
                        <span className="h-1 w-1 rounded-full bg-current" />
                        <span>Min 8 chars</span>
                      </div>
                      <div className={`flex items-center gap-1 ${/[0-9]/.test(watchedPassword) ? "text-emerald-400 font-medium" : ""}`}>
                        <span className="h-1 w-1 rounded-full bg-current" />
                        <span>Has number</span>
                      </div>
                      <div className={`flex items-center gap-1 ${/[A-Z]/.test(watchedPassword) ? "text-emerald-400 font-medium" : ""}`}>
                        <span className="h-1 w-1 rounded-full bg-current" />
                        <span>Has uppercase</span>
                      </div>
                      <div className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(watchedPassword) ? "text-emerald-400 font-medium" : ""}`}>
                        <span className="h-1 w-1 rounded-full bg-current" />
                        <span>Has symbol</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <Input
                  label="Confirm Password"
                  placeholder="••••••••"
                  leftIcon={Lock}
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  disabled={registerMutation.isPending}
                  error={errors.confirmPassword?.message}
                  className={
                    errors.confirmPassword
                      ? "border-rose-500/40 focus:border-rose-500"
                      : dirtyFields.confirmPassword && !errors.confirmPassword
                      ? "border-emerald-500/40 focus:border-emerald-500"
                      : ""
                  }
                  {...registerField("confirmPassword")}
                />
                
                {/* Password visibility toggle */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-[38px] text-gray-500 hover:text-white transition-colors cursor-pointer"
                  aria-label="Toggle Password Visibility"
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Role Selection (Controlled custom Radio cards) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400">Choose Workspace Role</label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "client", title: "Client", desc: "Escrow funds" },
                        { id: "freelancer", title: "Freelancer", desc: "Build & earn" },
                        { id: "agency", title: "Agency", desc: "Manage talent" },
                      ].map((item) => {
                        const isSelected = value === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => !registerMutation.isPending && onChange(item.id)}
                            className={`p-3 rounded-xl border text-center cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? "bg-indigo-500/10 border-indigo-500/40 text-white shadow-neon-primary/25"
                                : "bg-white/3 border-white/5 text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <p className="text-xs font-bold">{item.title}</p>
                            <p className="text-[8px] text-gray-500 font-light mt-0.5">{item.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                />
                {errors.role && <p className="text-xs text-rose-400 font-light pl-1">{errors.role.message}</p>}
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-400 hover:text-white select-none leading-tight">
                  <input
                    type="checkbox"
                    disabled={registerMutation.isPending}
                    className="h-4 w-4 mt-0.5 rounded border border-white/10 bg-white/3 text-primary focus:ring-primary focus:ring-opacity-50 accent-primary flex-shrink-0"
                    {...registerField("terms")}
                  />
                  <span>
                    I acknowledge that I accept the CollabAI{" "}
                    <span className="text-indigo-400 hover:underline cursor-pointer" onClick={() => toast.success("Mock terms checked!")}>Terms of Service</span> and{" "}
                    <span className="text-indigo-400 hover:underline cursor-pointer" onClick={() => toast.success("Mock privacy checked!")}>Privacy Policy</span>.
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-[10px] text-rose-400 font-light pl-1 mt-1 flex items-center gap-1 animate-fade-in">
                    <AlertCircle size={10} />
                    <span>Acceptance of Terms is mandatory to register.</span>
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={registerMutation.isPending || !isValid}
                loading={registerMutation.isPending}
                className="w-full text-xs font-bold py-3 mt-4 flex items-center justify-center gap-1.5"
              >
                <span>Initialize Workspace Account</span>
                <ArrowRight size={14} />
              </Button>
            </form>

            <GlassCardFooter className="flex flex-col gap-4 text-center mt-6 p-0 border-t border-white/5 pt-6 animate-fade-in">
              <p className="text-xs text-gray-400 font-light">
                Already possess a workspace account?{" "}
                <a href="/login" className="text-primary hover:text-indigo-400 font-bold hover:underline">
                  Sign In
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
