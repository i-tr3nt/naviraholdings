import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { CompanyContactDetails } from "@/components/CompanyContactDetails";
import { StoreLocationMap } from "@/components/StoreLocationMap";
import { mergeCompanyContact, type CompanyContactRow } from "@/lib/company-contact";

const CompanyInfo = () => {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState<CompanyContactRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const { data, error } = await supabase.from("company_info").select("*").limit(1).maybeSingle();
      if (error) throw error;
      setCompanyData(data);
    } catch (error) {
      console.error("Error fetching company info:", error);
    } finally {
      setLoading(false);
    }
  };

  const hours = mergeCompanyContact(companyData);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <BrandLogo size="md" />
            <p className="mt-0.5 text-sm text-muted-foreground">Contact Us</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-8">
        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Loading...</div>
        ) : (
          <>
          <div className="mb-8 overflow-hidden rounded-xl border border-border shadow-sm">
            <StoreLocationMap contact={companyData} minHeight="min-h-[320px] md:min-h-[400px]" />
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-6 w-6 text-navira-red" />
                NAVIRA HARDWARE — Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <CompanyContactDetails data={companyData} />

              <div className="border-t border-border pt-4">
                <h3 className="mb-4 font-semibold">Business hours</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="text-muted-foreground">Monday – Friday</dt>
                  <dd className="font-medium">{hours.weekdayHours}</dd>
                  <dt className="text-muted-foreground">Saturday</dt>
                  <dd className="font-medium">{hours.saturdayHours}</dd>
                  <dt className="text-muted-foreground">Sunday</dt>
                  <dd className="font-medium">{hours.sundayHours}</dd>
                </dl>
              </div>
            </CardContent>
          </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default CompanyInfo;
