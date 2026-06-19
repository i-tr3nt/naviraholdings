import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import type { CartItem } from "@/components/ShoppingCart";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, LogIn } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { ensureCustomerProfileFromUser } from "@/lib/customer-profile";
import { formatAuthError } from "@/lib/supabase-env";
import { isDemoMode } from "@/lib/demo-mode";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CustomerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/shop";
  const pendingCart = (location.state as { cart?: CartItem[] } | null)?.cart;
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;

      if (data.user?.user_metadata?.account_type === "staff") {
        await supabase.auth.signOut();
        toast({
          title: "Staff account",
          description: "Use the staff portal to sign in as an employee.",
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        await ensureCustomerProfileFromUser(data.user);
      }

      toast({ title: "Welcome back!", description: "You are signed in." });
      navigate(redirect, pendingCart?.length ? { state: { cart: pendingCart } } : undefined);
    } catch (err: unknown) {
      toast({
        title: "Sign in failed",
        description: formatAuthError(err),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <BrandLogo size="md" />
        </div>
      </header>

      <main className="container mx-auto max-w-md px-4 py-8">
        <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="h-6 w-6 text-navira-red" />
              Sign in to shop online
            </CardTitle>
            <CardDescription>
              {redirect.startsWith("/checkout")
                ? "Sign in or create an account to complete your order."
                : redirect === "/shop" || redirect.startsWith("/shop?")
                  ? "Sign in to shop online, add items to your cart, and place orders."
                  : "Sign in to your customer account."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isDemoMode() && (
              <Alert className="mb-6 border-amber-500/40 bg-amber-50 text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
                <AlertTitle>Preview mode</AlertTitle>
                <AlertDescription>
                  Sign-in is disabled until Supabase is connected. Browse the catalogue from the home page.
                </AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-navira-red hover:bg-navira-red/90 text-white"
                disabled={submitting || isDemoMode()}
              >
                {submitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              New customer?{" "}
              <Link
                to={`/shop/register?redirect=${encodeURIComponent(redirect)}`}
                className="font-medium text-navira-red hover:underline"
              >
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CustomerLogin;
