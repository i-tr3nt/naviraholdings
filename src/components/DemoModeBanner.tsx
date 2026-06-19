import { isDemoMode } from "@/lib/demo-mode";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

/** Non-blocking notice when the site runs without a live database. */
export function DemoModeBanner() {
  if (!isDemoMode()) return null;

  return (
    <Alert className="rounded-none border-x-0 border-t-0 border-amber-500/40 bg-amber-50 text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
      <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertDescription>
        <strong>Preview mode</strong> — browsing and sample products work without a database. Sign-in,
        registration, and checkout are disabled until Supabase is connected.
      </AlertDescription>
    </Alert>
  );
}
