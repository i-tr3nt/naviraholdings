import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Wrench, ArrowLeft, Save } from "lucide-react";
import { NAVIRA_CONTACT } from "@/lib/company-contact";

type CompanyForm = {
  id: string;
  email: string;
  sales_email: string;
  general_email: string;
  accounts_email: string;
  whatsapp: string;
  landline: string;
  cell_number: string;
  address: string;
  city: string;
  country: string;
  google_maps_url: string;
  weekday_hours: string;
  saturday_hours: string;
  sunday_hours: string;
};

const defaultForm = (): CompanyForm => ({
  id: "",
  email: NAVIRA_CONTACT.salesEmail,
  sales_email: NAVIRA_CONTACT.salesEmail,
  general_email: NAVIRA_CONTACT.generalEmail,
  accounts_email: NAVIRA_CONTACT.accountsEmail,
  whatsapp: NAVIRA_CONTACT.whatsapp,
  landline: NAVIRA_CONTACT.phone1,
  cell_number: NAVIRA_CONTACT.phone2,
  address: NAVIRA_CONTACT.address,
  city: NAVIRA_CONTACT.city,
  country: NAVIRA_CONTACT.country,
  google_maps_url: "",
  weekday_hours: "8:00 AM - 6:00 PM",
  saturday_hours: "8:00 AM - 4:00 PM",
  sunday_hours: "Closed",
});

const AdminCompanySettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [companyData, setCompanyData] = useState<CompanyForm>(defaultForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchCompanyInfo();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (!roleData || roleData.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "Only admins can access this page",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      const { data, error } = await supabase.from("company_info").select("*").limit(1).maybeSingle();
      if (error) throw error;
      if (data) {
        setCompanyData({
          id: data.id,
          email: data.email ?? NAVIRA_CONTACT.salesEmail,
          sales_email: data.sales_email ?? data.email ?? NAVIRA_CONTACT.salesEmail,
          general_email: data.general_email ?? NAVIRA_CONTACT.generalEmail,
          accounts_email: data.accounts_email ?? NAVIRA_CONTACT.accountsEmail,
          whatsapp: data.whatsapp ?? NAVIRA_CONTACT.whatsapp,
          landline: data.landline ?? NAVIRA_CONTACT.phone1,
          cell_number: data.cell_number ?? NAVIRA_CONTACT.phone2,
          address: data.address ?? NAVIRA_CONTACT.address,
          city: data.city ?? NAVIRA_CONTACT.city,
          country: data.country ?? NAVIRA_CONTACT.country,
          google_maps_url: data.google_maps_url ?? "",
          weekday_hours: data.weekday_hours ?? "8:00 AM - 6:00 PM",
          saturday_hours: data.saturday_hours ?? "8:00 AM - 4:00 PM",
          sunday_hours: data.sunday_hours ?? "Closed",
        });
      }
    } catch (error) {
      console.error("Error fetching company info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const updateData = {
        email: companyData.sales_email || companyData.email,
        sales_email: companyData.sales_email,
        general_email: companyData.general_email,
        accounts_email: companyData.accounts_email,
        whatsapp: companyData.whatsapp,
        landline: companyData.landline,
        cell_number: companyData.cell_number,
        address: companyData.address,
        city: companyData.city,
        country: companyData.country,
        google_maps_url: companyData.google_maps_url || null,
        weekday_hours: companyData.weekday_hours,
        saturday_hours: companyData.saturday_hours,
        sunday_hours: companyData.sunday_hours,
        updated_at: new Date().toISOString(),
        updated_by: session?.user.id,
      };

      if (companyData.id) {
        const { error } = await supabase.from("company_info").update(updateData).eq("id", companyData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("company_info").insert(updateData);
        if (error) throw error;
      }

      toast({ title: "Success", description: "Company information updated successfully" });
      fetchCompanyInfo();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update company info",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof CompanyForm, value: string) => {
    setCompanyData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Wrench className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">NAVIRA HARDWARE</h1>
              <p className="text-sm text-muted-foreground">Company Settings</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate("/dashboard")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-8">
        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Loading...</div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sales_email">Sales email</Label>
                <Input
                  id="sales_email"
                  type="email"
                  value={companyData.sales_email}
                  onChange={(e) => handleChange("sales_email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="general_email">General email</Label>
                <Input
                  id="general_email"
                  type="email"
                  value={companyData.general_email}
                  onChange={(e) => handleChange("general_email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accounts_email">Accounts email</Label>
                <Input
                  id="accounts_email"
                  type="email"
                  value={companyData.accounts_email}
                  onChange={(e) => handleChange("accounts_email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={companyData.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  placeholder="+263..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="landline">Phone 1</Label>
                  <Input
                    id="landline"
                    value={companyData.landline}
                    onChange={(e) => handleChange("landline", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cell_number">Phone 2</Label>
                  <Input
                    id="cell_number"
                    value={companyData.cell_number}
                    onChange={(e) => handleChange("cell_number", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={companyData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={companyData.city} onChange={(e) => handleChange("city", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={companyData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="google_maps_url">Google Maps URL</Label>
                <Input
                  id="google_maps_url"
                  value={companyData.google_maps_url}
                  onChange={(e) => handleChange("google_maps_url", e.target.value)}
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="mb-4 font-semibold">Business Hours</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="weekday_hours">Monday - Friday</Label>
                    <Input
                      id="weekday_hours"
                      value={companyData.weekday_hours}
                      onChange={(e) => handleChange("weekday_hours", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="saturday_hours">Saturday</Label>
                    <Input
                      id="saturday_hours"
                      value={companyData.saturday_hours}
                      onChange={(e) => handleChange("saturday_hours", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sunday_hours">Sunday</Label>
                    <Input
                      id="sunday_hours"
                      value={companyData.sunday_hours}
                      onChange={(e) => handleChange("sunday_hours", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminCompanySettings;
