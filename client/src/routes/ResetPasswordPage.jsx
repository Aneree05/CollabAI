import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
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

// Schema validation
const schema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must contain at least 6 characters." }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password must match the new password.",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setLoading(true);

    // Simulate password resetting
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      toast.success("Simulation check: Credentials updated successfully!", { icon: "🔐" });
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-bg-base text-gray-200 flex flex-col items-center justify-center p-4 overflow-hidden select-none font-sans">
      {/* Background visual glows */}
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none z-0" />
      <div className="absolute top-[-100px] right-[-100px] h-[500px] w-[500px] rounded-full bg-primary glow-circle opacity-10" />
      <div className="absolute bottom-[-100px] left-[-100px] h-[500px] w-[500px] rounded-full bg-secondary glow-circle opacity-10" />
      
      {/* Noise layer */}
      <div className="absolute inset-0 noise-overlay pointer-events-none z-50 opacity-2" />

      {/* Floating Card container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard hoverGlow className="bg-[#0b0f19]/75 border-white/8 backdrop-blur-2xl shadow-2xl p-8">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <GlassCardHeader className="text-center p-0">
                  <div className="flex justify-center mb-4">
                    <div className="h-11 w-11 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg">
                      <Sparkles size={20} className="text-white animate-pulse" />
                    </div>
                  </div>
                  <GlassCardTitle className="text-2xl font-extrabold text-white">
                    Reset Password
                  </GlassCardTitle>
                  <GlassCardDescription className="text-xs text-gray-400 font-light mt-1 max-w-xs mx-auto">
                    Type a secure new password below to update your login credentials.
                  </GlassCardDescription>
                </GlassCardHeader>

                <div className="px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-400 flex gap-2 items-start font-mono leading-relaxed">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white uppercase">System Info:</span> This page is currently a visual-only UI placeholder. No actual backend request is dispatched.
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* New Password field */}
                  <div className="relative">
                    <Input
                      label="New Password"
                      placeholder="••••••••"
                      leftIcon={Lock}
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autoFocus
                      disabled={loading}
                      error={errors.password?.message}
                      className={
                        errors.password
                          ? "border-rose-500/40 focus:border-rose-500"
                          : dirtyFields.password && !errors.password
                          ? "border-emerald-500/40 focus:border-emerald-500"
                          : ""
                      }
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-[38px] text-gray-500 hover:text-white transition-colors cursor-pointer"
                      aria-label="Toggle Password Visibility"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  {/* Confirm Password field */}
                  <div className="relative">
                    <Input
                      label="Confirm Password"
                      placeholder="••••••••"
                      leftIcon={Lock}
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      disabled={loading}
                      error={errors.confirmPassword?.message}
                      className={
                        errors.confirmPassword
                          ? "border-rose-500/40 focus:border-rose-500"
                          : dirtyFields.confirmPassword && !errors.confirmPassword
                          ? "border-emerald-500/40 focus:border-emerald-500"
                          : ""
                      }
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-[38px] text-gray-500 hover:text-white transition-colors cursor-pointer"
                      aria-label="Toggle Password Visibility"
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading || !isValid}
                    loading={loading}
                    className="w-full text-xs font-bold py-3 mt-2"
                  >
                    Update Password
                  </Button>
                </form>

                <div className="text-center pt-2">
                  <a
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft size={13} />
                    <span>Back to Login</span>
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-6"
              >
                <div className="flex justify-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <CheckCircle size={24} className="animate-bounce" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Reset Successful</h3>
                  <p className="text-xs text-gray-400 font-light max-w-sm mx-auto leading-relaxed">
                    Your simulated password update is successful. You can now use your new credentials on the mock environment.
                  </p>
                </div>

                <Button
                  variant="primary"
                  className="w-full text-xs font-bold py-3"
                  onClick={() => (window.location.href = "/login")}
                >
                  Return to Login
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
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
