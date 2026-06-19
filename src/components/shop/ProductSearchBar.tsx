import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProductSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Light text on dark header (catalog / department heroes) */
  variant?: "default" | "onDark";
  className?: string;
  id?: string;
};

export function ProductSearchBar({
  value,
  onChange,
  placeholder = "Search products...",
  variant = "default",
  className,
  id = "product-search",
}: ProductSearchBarProps) {
  const onDark = variant === "onDark";

  return (
    <div className={cn("relative max-w-xl", className)}>
      <Search
        className={cn(
          "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2",
          onDark ? "text-white/50" : "text-muted-foreground"
        )}
      />
      <Input
        id={id}
        type="search"
        role="searchbox"
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "pl-10 pr-10",
          onDark && "border-white/20 bg-white/10 text-white placeholder:text-white/50"
        )}
      />
      {value.length > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2",
            onDark && "text-white/80 hover:bg-white/10 hover:text-white"
          )}
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
