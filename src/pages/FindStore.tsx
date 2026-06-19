import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Phone } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { StoreLocationMap } from "@/components/StoreLocationMap";
import { mergeCompanyContact, type CompanyContactRow, whatsappUrl } from "@/lib/company-contact";

const FindStore = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState<CompanyContactRow | null>(null);

  useEffect(() => {
    supabase
      .from("company_info")
      .select("*")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setCompany(data));
  }, []);

  const contact = mergeCompanyContact(company);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="shrink-0 border-b border-border bg-card shadow-sm">
        <div className="container mx-auto flex items-center justify-between gap-2 px-4 py-3">
          <button type="button" onClick={() => navigate("/")} className="text-left">
            <BrandLogo size="sm" className="sm:hidden" />
            <BrandLogo size="md" className="hidden sm:flex" />
            <p className="mt-0.5 text-sm text-muted-foreground">Find our store</p>
          </button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col">
        <StoreLocationMap contact={company} minHeight="min-h-[calc(100vh-12rem)] md:min-h-[calc(100vh-10rem)]" />
      </div>

      <div className="shrink-0 border-t border-border bg-muted/30">
        <div className="container mx-auto grid gap-4 px-4 py-4 sm:grid-cols-3">
          <div className="flex items-start gap-2 text-sm">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-navira-red" />
            <div>
              <p className="font-medium">Hours</p>
              <p className="text-muted-foreground">{contact.weekdayHours}</p>
              <p className="text-muted-foreground">{contact.saturdayHours}</p>
              <p className="text-muted-foreground">{contact.sundayHours}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-navira-red" />
            <div>
              <p className="font-medium">Call us</p>
              <a href={`tel:${contact.phone1.replace(/\s/g, "")}`} className="block text-muted-foreground hover:text-foreground">
                {contact.phone1}
              </a>
              <a href={`tel:${contact.phone2.replace(/\s/g, "")}`} className="block text-muted-foreground hover:text-foreground">
                {contact.phone2}
              </a>
              <a
                href={whatsappUrl(contact.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-navira-red hover:underline"
              >
                WhatsApp {contact.whatsapp}
              </a>
            </div>
          </div>
          <div className="flex items-end sm:justify-end">
            <Button variant="outline" asChild>
              <Link to="/company-info">Full contact details</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindStore;
