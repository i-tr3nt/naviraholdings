import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type MobileMenuItem = {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "destructive";
};

type MobileMenuProps = {
  items: MobileMenuItem[];
  title?: string;
  className?: string;
};

export function MobileMenu({ items, title = "Menu", className }: MobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className={cn("shrink-0 md:hidden", className)} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(100vw-2rem,20rem)]">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-1">
          {items.map((item) => (
            <SheetClose key={item.label} asChild>
              <Button
                variant="ghost"
                className={cn(
                  "h-11 w-full justify-start text-base",
                  item.variant === "destructive" && "text-destructive hover:text-destructive"
                )}
                onClick={item.onClick}
              >
                {item.icon && <span className="mr-3">{item.icon}</span>}
                {item.label}
              </Button>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default MobileMenu;
