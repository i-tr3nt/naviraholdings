import { Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  size?: "xs" | "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
  onDark?: boolean;
};

const sizeClasses = {
  xs: { mark: "h-7 w-7", navira: "text-sm", hardware: "text-xs", icon: "h-3.5 w-3.5" },
  sm: { mark: "h-8 w-8", navira: "text-base", hardware: "text-sm", icon: "h-4 w-4" },
  md: { mark: "h-11 w-11", navira: "text-lg", hardware: "text-base", icon: "h-5 w-5" },
  lg: { mark: "h-14 w-14", navira: "text-2xl", hardware: "text-lg", icon: "h-6 w-6" },
};

/** NAVIRA (navy) + Hardware (red) — matches business card typography */
export function BrandLogo({ size = "md", showIcon = true, className, onDark = false }: BrandLogoProps) {
  const s = sizeClasses[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {showIcon && (
        <div
          className={cn(
            "brand-logo-mark shrink-0",
            s.mark,
            onDark && "border-white/20 bg-white/10"
          )}
        >
          <Wrench className={cn(s.icon)} />
        </div>
      )}
      <div className="leading-tight">
        <span
          className={cn(
            "brand-wordmark brand-wordmark-navira block uppercase",
            s.navira,
            onDark && "!text-white"
          )}
        >
          Navira
        </span>
        <span className={cn("brand-wordmark brand-wordmark-hardware block", s.hardware)}>Hardware</span>
      </div>
    </div>
  );
}

export default BrandLogo;
