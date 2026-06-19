import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { staffSignupMetadata } from "@/lib/auth";
import { fetchStaffRole, isStaffRole } from "@/lib/staff";
import BrandLogo from "@/components/BrandLogo";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const routeAuthenticatedUser = async (userId: string) => {
    const role = await fetchStaffRole(userId);
    if (isStaffRole(role)) {
      navigate("/dashboard");
      return;
    }
    navigate("/shop");
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          await supabase.auth.signOut();
          return;
        }
        if (session) {
          await routeAuthenticatedUser(session.user.id);
        }
      } catch {
        await supabase.auth.signOut();
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === "TOKEN_REFRESHED" || event === "SIGNED_IN") && session) {
        await routeAuthenticatedUser(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data.user) throw new Error("Sign in failed.");

        const role = await fetchStaffRole(data.user.id);
        if (!isStaffRole(role)) {
          await supabase.auth.signOut();
          throw new Error(
            "This is a customer account. Use Login on the online shop, or ask an admin to assign you staff access."
          );
        }

        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: staffSignupMetadata(),
          },
        });
        if (error) throw error;
        toast({
          title: "Account created!",
          description:
            "Check your email to confirm your account. You will be registered as an employee once verified.",
        });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center brand-hero p-4">
      <Card className="relative w-full max-w-md border-2 border-white/20 bg-card shadow-2xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <CardHeader className="space-y-1 pt-14 text-center">
          <div className="mb-2 flex justify-center">
            <BrandLogo size="lg" />
          </div>
          <p className="text-sm text-muted-foreground">Staff portal — employees and admins only</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-navira-red hover:bg-navira-red/90 text-white"
              disabled={loading}
            >
              {loading ? "Processing..." : isLogin ? "Staff Sign In" : "Staff Sign Up"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-muted-foreground"
            >
              {isLogin ? "Need a staff account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Shopping online?{" "}
            <button
              type="button"
              className="text-navira-red underline-offset-2 hover:underline"
              onClick={() => navigate("/shop")}
            >
              Go to the store
            </button>
          </p>
          {!isLogin && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              New staff accounts start as employees. An administrator can grant admin access.
            </p>
          )}
          <div className="mt-6 border-t border-border pt-6 text-center">
            <p className="text-base text-muted-foreground">Powered by Tyger</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
