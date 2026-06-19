import { isSupabaseConfigured } from "@/lib/supabase-env";
import BrandLogo from "@/components/BrandLogo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ConfigGateProps = {
  children: React.ReactNode;
};

/**
 * Prevents a blank screen when VITE_SUPABASE_* were not set at build time (e.g. on Render).
 */
export function ConfigGate({ children }: ConfigGateProps) {
  if (isSupabaseConfigured()) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <BrandLogo size="md" className="mx-auto" />
        <Alert variant="destructive">
          <AlertTitle>Site configuration incomplete</AlertTitle>
          <AlertDescription className="space-y-3 pt-2">
            <p>
              Supabase environment variables were missing when this site was built, so the app
              cannot connect to your database.
            </p>
            <p className="font-medium">On Render → your static site → Environment, add:</p>
            <ul className="list-inside list-disc text-sm">
              <li>
                <code>VITE_SUPABASE_URL</code>
              </li>
              <li>
                <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>
              </li>
              <li>
                <code>VITE_SUPABASE_PROJECT_ID</code>
              </li>
            </ul>
            <p className="text-sm">
              Use values from Supabase → Settings → API. Then click <strong>Manual Deploy</strong>{" "}
              → Clear build cache & deploy (required so Vite rebuilds with the new values).
            </p>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
