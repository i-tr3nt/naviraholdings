import { ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatFullAddress,
  getGoogleMapsEmbedUrl,
  getGoogleMapsOpenUrl,
  mergeCompanyContact,
  type CompanyContactRow,
} from "@/lib/company-contact";

type StoreLocationMapProps = {
  contact: CompanyContactRow | null;
  className?: string;
  /** Height of the map area (default fills available space). */
  minHeight?: string;
};

export function StoreLocationMap({
  contact,
  className = "",
  minHeight = "min-h-[55vh] md:min-h-[65vh]",
}: StoreLocationMapProps) {
  const c = mergeCompanyContact(contact);
  const embedUrl = getGoogleMapsEmbedUrl(c);
  const openUrl = getGoogleMapsOpenUrl(c);
  const address = formatFullAddress(c);

  return (
    <div className={`flex flex-col ${className}`}>
      <div className={`relative w-full flex-1 ${minHeight}`}>
        <iframe
          title="NAVIRA Hardware store location on Google Maps"
          src={embedUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className="flex flex-col gap-3 border-t border-border bg-card px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-navira-red" />
          <div>
            <p className="font-semibold text-navira-navy dark:text-foreground">NAVIRA HARDWARE</p>
            <p className="text-sm text-muted-foreground">{address}</p>
          </div>
        </div>
        <Button
          asChild
          className="shrink-0 bg-navira-red hover:bg-navira-red/90 text-white"
        >
          <a href={openUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in Google Maps
          </a>
        </Button>
      </div>
    </div>
  );
}
