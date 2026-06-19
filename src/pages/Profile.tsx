import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Wrench, ArrowLeft, User, Mail, Shield, Calendar, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fetchStaffRole, isStaffRole } from "@/lib/staff";
import {
  ensureCustomerProfileFromUser,
  fetchCustomerProfile,
  upsertCustomerProfile,
  type CustomerProfileInput,
} from "@/lib/customer-profile";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState<CustomerProfileInput>({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "Harare",
    deliveryNotes: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/shop");
        return;
      }

      setUserId(session.user.id);
      setEmail(session.user.email || "");
      setCreatedAt(
        new Date(session.user.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );

      const staffRole = await fetchStaffRole(session.user.id);
      setRole(staffRole);

      if (!isStaffRole(staffRole)) {
        const profile =
          (await fetchCustomerProfile(session.user.id)) ||
          (await ensureCustomerProfileFromUser(session.user));
        if (profile) {
          setProfileForm({
            fullName: profile.fullName,
            phone: profile.phone,
            addressLine: profile.addressLine,
            city: profile.city,
            deliveryNotes: profile.deliveryNotes || "",
          });
        }
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!userId) return;
    if (!profileForm.fullName.trim() || !profileForm.phone.trim() || !profileForm.addressLine.trim()) {
      toast({
        title: "Missing details",
        description: "Name, phone, and address are required for online orders.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    const { error } = await upsertCustomerProfile(userId, profileForm);
    setSaving(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    await supabase.auth.updateUser({
      data: {
        account_type: "customer",
        name: profileForm.fullName.trim(),
        phone: profileForm.phone.trim(),
        address_line: profileForm.addressLine.trim(),
        city: profileForm.city.trim(),
        delivery_notes: profileForm.deliveryNotes?.trim() || "",
      },
    });

    toast({ title: "Saved", description: "Your delivery details have been updated." });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate(isStaffRole(role) ? "/auth" : "/shop");
  };

  const isStaff = isStaffRole(role);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Wrench className="h-8 w-8 text-navira-red" />
            <div>
              <h1 className="text-xl font-bold">NAVIRA HARDWARE</h1>
              <p className="text-sm text-muted-foreground">{isStaff ? "Staff profile" : "My account"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate(isStaff ? "/dashboard" : "/shop")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {isStaff ? "Dashboard" : "Shop"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6 text-navira-red" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input value={email} disabled />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Account type
              </Label>
              {isStaff ? (
                <Badge>{role === "admin" ? "Admin" : "Employee"}</Badge>
              ) : (
                <Badge variant="outline">Customer</Badge>
              )}
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Member since
              </Label>
              <Input value={createdAt} disabled />
            </div>
          </CardContent>
        </Card>

        {!isStaff && (
          <Card>
            <CardHeader>
              <CardTitle>Order &amp; delivery details</CardTitle>
              <p className="text-sm text-muted-foreground">
                Used at checkout for pickup and delivery orders.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={profileForm.addressLine}
                  onChange={(e) => setProfileForm({ ...profileForm, addressLine: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={profileForm.city}
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Default order notes</Label>
                <Textarea
                  id="notes"
                  value={profileForm.deliveryNotes ?? ""}
                  onChange={(e) => setProfileForm({ ...profileForm, deliveryNotes: e.target.value })}
                  rows={2}
                />
              </div>
              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full bg-navira-red hover:bg-navira-red/90 text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save details"}
              </Button>
            </CardContent>
          </Card>
        )}

        {!isStaff && (
          <Button variant="outline" className="w-full" onClick={() => navigate("/my-orders")}>
            View my orders
          </Button>
        )}

        <Button onClick={handleLogout} variant="destructive" className="w-full">
          Sign out
        </Button>
      </main>
    </div>
  );
};

export default Profile;
