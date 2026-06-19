import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type RequireShopLoginProps = {
  children: React.ReactNode;
};

/** Gate for /shop (Shop online) — catalog and departments stay public. */
export function RequireShopLogin({ children }: RequireShopLoginProps) {
  const location = useLocation();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAllowed(!!session);
    };
    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAllowed(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (allowed === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!allowed) {
    const redirect = `${location.pathname}${location.search}`;
    return <Navigate to={`/shop/login?redirect=${encodeURIComponent(redirect)}`} replace />;
  }

  return <>{children}</>;
}
