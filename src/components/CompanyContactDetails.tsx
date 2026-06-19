import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { mergeCompanyContact, whatsappUrl, type CompanyContactRow } from "@/lib/company-contact";

type CompanyContactDetailsProps = {
  data: CompanyContactRow | null;
  compact?: boolean;
};

export function CompanyContactDetails({ data, compact }: CompanyContactDetailsProps) {
  const c = mergeCompanyContact(data);

  if (compact) {
    return (
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li>
          <a href={`tel:${c.phone1.replace(/\s/g, "")}`} className="hover:text-foreground">
            {c.phone1}
          </a>
          {" · "}
          <a href={`tel:${c.phone2.replace(/\s/g, "")}`} className="hover:text-foreground">
            {c.phone2}
          </a>
        </li>
        <li>
          <a
            href={whatsappUrl(c.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-navira-red hover:underline"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp {c.whatsapp}
          </a>
        </li>
        <li>
          <a href={`mailto:${c.salesEmail}`} className="hover:text-foreground">
            {c.salesEmail}
          </a>
        </li>
      </ul>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4 rounded-lg bg-muted/50 p-4">
        <Mail className="mt-0.5 h-6 w-6 shrink-0 text-navira-red" />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Email</p>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">Sales: </span>
              <a href={`mailto:${c.salesEmail}`} className="font-medium text-navira-red hover:underline">
                {c.salesEmail}
              </a>
            </p>
            <p>
              <span className="text-muted-foreground">General: </span>
              <a href={`mailto:${c.generalEmail}`} className="font-medium text-navira-red hover:underline">
                {c.generalEmail}
              </a>
            </p>
            <p>
              <span className="text-muted-foreground">Accounts: </span>
              <a href={`mailto:${c.accountsEmail}`} className="font-medium text-navira-red hover:underline">
                {c.accountsEmail}
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-4 rounded-lg bg-muted/50 p-4">
        <Phone className="mt-0.5 h-6 w-6 shrink-0 text-navira-red" />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Phone</p>
          <a href={`tel:${c.phone1.replace(/\s/g, "")}`} className="block font-medium hover:text-navira-red">
            {c.phone1}
          </a>
          <a href={`tel:${c.phone2.replace(/\s/g, "")}`} className="block font-medium hover:text-navira-red">
            {c.phone2}
          </a>
        </div>
      </div>

      <div className="flex items-start gap-4 rounded-lg bg-muted/50 p-4">
        <MessageCircle className="mt-0.5 h-6 w-6 shrink-0 text-navira-red" />
        <div>
          <p className="text-sm text-muted-foreground">WhatsApp</p>
          <a
            href={whatsappUrl(c.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-navira-red hover:underline"
          >
            {c.whatsapp}
          </a>
        </div>
      </div>

      <div className="flex items-start gap-4 rounded-lg bg-muted/50 p-4">
        <MapPin className="mt-0.5 h-6 w-6 shrink-0 text-navira-red" />
        <div>
          <p className="text-sm text-muted-foreground">Location</p>
          <p className="font-medium">{c.address}</p>
          <p className="text-muted-foreground">
            {c.city}, {c.country}
          </p>
          {c.googleMapsUrl && (
            <a
              href={c.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-navira-red hover:underline"
            >
              View on Google Maps →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
