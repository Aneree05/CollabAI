import React from "react";
import GlassCard, {
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
} from "./GlassCard";
import Avatar from "../common/Avatar";
import Badge from "./Badge";
import { Star, ArrowRight } from "lucide-react";
import Button from "./Button";

export default function ServiceCard({
  service,
  onActionClick,
  actionLabel = "View Profile",
  className,
}) {
  const {
    title,
    description,
    freelancer,
    rating,
    reviewCount,
    hourlyRate,
    tags = [],
  } = service;

  return (
    <GlassCard
      hoverGlow
      interactive
      onClick={onActionClick}
      className={className}
    >
      <GlassCardHeader className="flex flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <Avatar user={freelancer} size="md" showPresence isOnline={freelancer.isOnline} />
          <div>
            <h4 className="text-sm font-bold text-white leading-normal hover:text-primary transition-colors">
              {freelancer.name}
            </h4>
            <p className="text-xs text-gray-400 font-light">{freelancer.title || "Elite Professional"}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/5 text-[11px] text-amber-400 font-bold">
          <Star size={12} className="fill-amber-400 stroke-amber-400" />
          <span>{rating.toFixed(1)}</span>
          <span className="text-gray-500 font-light font-sans">({reviewCount})</span>
        </div>
      </GlassCardHeader>

      <GlassCardContent className="space-y-4">
        <div>
          <GlassCardTitle className="text-base text-white font-semibold line-clamp-1 mb-2">
            {title}
          </GlassCardTitle>
          <GlassCardDescription className="text-xs leading-relaxed text-gray-400 line-clamp-2">
            {description}
          </GlassCardDescription>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" size="sm" className="text-[9px] lowercase font-mono">
              {tag}
            </Badge>
          ))}
        </div>
      </GlassCardContent>

      <GlassCardFooter className="flex items-center justify-between mt-4">
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none">Starting from</p>
          <p className="text-lg font-black text-white font-mono mt-1">
            ${hourlyRate}
            <span className="text-xs font-normal text-gray-500">/hr</span>
          </p>
        </div>
        <Button variant="secondary" size="sm" className="flex items-center gap-1.5 group">
          <span>{actionLabel}</span>
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </Button>
      </GlassCardFooter>
    </GlassCard>
  );
}
