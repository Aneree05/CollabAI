import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Award,
  Link as LinkIcon,
  Tag,
  Save,
  ArrowLeft,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import GlassCard, {
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
} from "../components/ui/GlassCard";
import Avatar from "../components/common/Avatar";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [nameInput, setNameInput] = useState("");
  const [experienceInput, setExperienceInput] = useState("");
  const [portfolioInput, setPortfolioInput] = useState("");
  const [skillsList, setSkillsList] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Synchronize with active user states
  useEffect(() => {
    if (user) {
      setNameInput(user.name || "");
      setExperienceInput(user.experience || "");
      setPortfolioInput(user.portfolio || "");
      setSkillsList(user.skills || []);
    }
  }, [user]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
      setSkillsList((prev) => [...prev, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillsList((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      toast.error("Name is required.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.put("/profile", {
        name: nameInput.trim(),
        skills: skillsList,
        experience: experienceInput.trim(),
        portfolio: portfolioInput.trim(),
      });

      // Update global context cache
      const updatedUser = response.data?.user;
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem("collabai_user", JSON.stringify(updatedUser));
        toast.success("Profile saved successfully!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save profile configuration.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-bg-base text-gray-200 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden select-none font-sans flex flex-col justify-center">
      <div className="absolute inset-0 noise-overlay pointer-events-none z-50 opacity-2" />
      <div className="absolute inset-0 grid-overlay opacity-25 pointer-events-none z-0" />
      
      {/* Visual details */}
      <div className="absolute top-[-100px] left-[10%] h-[500px] w-[500px] rounded-full bg-primary glow-circle opacity-10 pointer-events-none" />

      <div className="max-w-2xl mx-auto w-full relative z-10 space-y-6">
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>Go Back</span>
          </button>
        </div>

        <GlassCard className="bg-[#0b0f19]/75 border-white/8 backdrop-blur-2xl p-8">
          <GlassCardHeader className="p-0 mb-6 flex flex-col sm:flex-row items-center gap-4 border-b border-white/5 pb-6">
            <Avatar user={user} size="lg" />
            <div className="text-center sm:text-left space-y-1">
              <GlassCardTitle className="text-xl font-extrabold text-white">Profile Configurations</GlassCardTitle>
              <GlassCardDescription className="text-xs text-gray-400 font-light leading-normal">
                Account Level: <span className="text-accent font-bold uppercase font-mono">{user?.roles?.join(", ")}</span> • ID: <span className="font-mono">{user?._id}</span>
              </GlassCardDescription>
            </div>
          </GlassCardHeader>

          <form onSubmit={handleProfileSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="Enter profile name..."
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                leftIcon={User}
              />

              <div>
                <label className="block text-[11px] text-gray-400 font-bold mb-1.5 uppercase tracking-wider pl-1">
                  Email Address (Read-only)
                </label>
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-white/5 bg-white/2 text-gray-500 text-xs font-mono">
                  <Mail size={14} />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Experience Level"
                placeholder="e.g. Senior Backend developer (5+ yrs)"
                value={experienceInput}
                onChange={(e) => setExperienceInput(e.target.value)}
                leftIcon={Award}
              />

              <Input
                label="Portfolio URL"
                placeholder="e.g. https://myportfolio.dev"
                value={portfolioInput}
                onChange={(e) => setPortfolioInput(e.target.value)}
                leftIcon={LinkIcon}
              />
            </div>

            {/* Skills tag editor */}
            <div className="space-y-2">
              <label className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider pl-1">
                Professional Skills
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add skill tag..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 bg-white/3 border border-white/8 rounded-lg px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
                />
                <Button onClick={handleAddSkill} variant="secondary" className="text-xs font-bold px-4 cursor-pointer">
                  Add
                </Button>
              </div>

              {/* Tag pill display */}
              <div className="flex flex-wrap gap-2 pt-2">
                {skillsList.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white/5 border border-white/5 text-[11px] text-gray-300 font-mono"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full text-xs font-bold py-3 shadow-neon-primary"
              loading={isSaving}
              disabled={isSaving}
            >
              <Save size={12} className="mr-1.5" />
              <span>Save Configurations</span>
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
