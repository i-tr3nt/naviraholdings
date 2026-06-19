import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, UserPlus } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { customerSignupMetadata } from "@/lib/auth";
import { upsertCustomerProfile } from "@/lib/customer-profile";
import {
  CustomerSignupForm,
  emptySignupForm,
  validateSignupForm,
  type CustomerSignupFormState,
} from "@/components/shop/CustomerSignupForm";
import { formatAuthError, getSupabaseConfig, isSupabaseConfigured } from "@/lib/supabase-env";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CustomerRegister = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/shop";
  const { toast } = useToast();
  const [form, setForm] = useState<CustomerSignupFormState>(emptySignupForm());
  const [submitting, setSubmitting] = useState(false);
  const [connectionOk, setConnectionOk] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setConnectionOk(false);
      return;
    }
    const { url, key } = getSupabaseConfig();
    fetch(`${url}/auth/v1/health`, { headers: { apikey: key } })
      .then((r) => setConnectionOk(r.ok))
      .catch(() => setConnectionOk(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateSignupForm(form);
    if (validationError) {
      toast({ title: "Check your details", description: validationError, variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const profileFields = {
        fullName: form.fullName,
        phone: form.phone,
        addressLine: form.addressLine,
        city: form.city,
        deliveryNotes: form.deliveryNotes,
      };

      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          emailRedirectTo: `${window.location.origin}${redirect.startsWith("/") ? redirect : `/${redirect}`}`,
          data: customerSignupMetadata(profileFields),
        },
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await upsertCustomerProfile(data.user.id, profileFields);
        if (profileError) console.warn("Profile save:", profileError.message);
      }

      if (data.session) {
        toast({ title: "Account created", description: "You can now shop and place orders online." });
        navigate(redirect);
      } else {
        toast({
          title: "Account created",
          description: "Check your email to confirm your account, then sign in to place orders.",
        });
        navigate(`/shop/login?redirect=${encodeURIComponent(redirect)}`);
      }
    } catch (err: unknown) {
      toast({
        title: "Could not create account",
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

      <main className="container mx-auto max-w-lg px-4 py-8">
        <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate("/shop")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to shop
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-navira-navy dark:text-foreground">
              <UserPlus className="h-6 w-6 text-navira-red" />
              Create your account
            </CardTitle>
            <CardDescription>
              Register to order online. Your details are saved for faster checkout next time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {connectionOk === false && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Cannot connect to Supabase</AlertTitle>
                <AlertDescription>
                  Account signup needs a working Supabase project. In your project folder, open{" "}
                  <code className="text-xs">.env</code> and set{" "}
                  <code className="text-xs">VITE_SUPABASE_URL</code> and{" "}
                  <code className="text-xs">VITE_SUPABASE_PUBLISHABLE_KEY</code> from Supabase → Settings →
                  API (Project URL and anon public key). Then restart{" "}
                  <code className="text-xs">npm run dev</code>.
                </AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <CustomerSignupForm value={form} onChange={setForm} idPrefix="reg" />
              <Button
                type="submit"
                className="w-full bg-navira-red hover:bg-navira-red/90 text-white"
                disabled={submitting || connectionOk === false}
              >
                {submitting ? "Creating account..." : "Create account"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to={`/shop/login?redirect=${encodeURIComponent(redirect)}`}
                className="font-medium text-navira-red hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CustomerRegister;
