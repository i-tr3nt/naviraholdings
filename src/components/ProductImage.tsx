import { Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { getProductFallbackImage, isLocalHardwareImage } from "@/lib/hardware-images";

type ProductImageProps = {
  src?: string | null;
  alt: string;
  category: string;
  className?: string;
  aspect?: "square" | "video";
};

export function ProductImage({ src, alt, category, className, aspect = "video" }: ProductImageProps) {
  const fallback = getProductFallbackImage(category, alt);
  const imageSrc = src?.trim() || fallback;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-muted",
        aspect === "square" ? "aspect-square" : "aspect-[4/3]",
        className
      )}
    >
      <img
        src={imageSrc}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        onError={(e) => {
          const img = e.currentTarget;
          if (img.src !== fallback) img.src = fallback;
        }}
      />
      {!src?.trim() && !isLocalHardwareImage(imageSrc) && (
        <span className="absolute bottom-2 right-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white/90">
          Sample image
        </span>
      )}
    </div>
  );
}

export function ProductImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex aspect-[4/3] w-full items-center justify-center bg-muted text-muted-foreground",
        className
      )}
    >
      <Package className="h-12 w-12 opacity-40" />
    </div>
  );
}

export default ProductImage;
