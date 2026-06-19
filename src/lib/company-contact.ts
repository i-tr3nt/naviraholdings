/** Canonical NAVIRA HARDWARE contact details (used as defaults and DB seed). */
export const NAVIRA_CONTACT = {
  salesEmail: "sales@navirahardware.co.zw",
  generalEmail: "navira@navrahardwae.co.zw",
  accountsEmail: "accounts@navirahardware.co.zw",
  whatsapp: "+263772253246",
  phone1: "+263774740730",
  phone2: "+263713712204",
  address: "Chillarz Complex, Westwood Drive, Westwood",
  city: "Harare",
  country: "Zimbabwe",
  weekdayHours: "Mon–Fri: 8:00 AM – 6:00 PM",
  saturdayHours: "Sat: 8:00 AM – 4:00 PM",
  sundayHours: "Sun: Closed",
} as const;

export type CompanyContactRow = {
  email?: string | null;
  sales_email?: string | null;
  accounts_email?: string | null;
  general_email?: string | null;
  whatsapp?: string | null;
  landline?: string | null;
  cell_number?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  weekday_hours?: string | null;
  saturday_hours?: string | null;
  sunday_hours?: string | null;
  google_maps_url?: string | null;
};

export function mergeCompanyContact(row: CompanyContactRow | null): Required<
  Pick<
    typeof NAVIRA_CONTACT,
    | "salesEmail"
    | "generalEmail"
    | "accountsEmail"
    | "whatsapp"
    | "phone1"
    | "phone2"
    | "address"
    | "city"
    | "country"
    | "weekdayHours"
    | "saturdayHours"
    | "sundayHours"
  >
> & { googleMapsUrl: string | null; primaryEmail: string } {
  return {
    salesEmail: row?.sales_email || row?.email || NAVIRA_CONTACT.salesEmail,
    generalEmail: row?.general_email || NAVIRA_CONTACT.generalEmail,
    accountsEmail: row?.accounts_email || NAVIRA_CONTACT.accountsEmail,
    whatsapp: row?.whatsapp || NAVIRA_CONTACT.whatsapp,
    phone1: row?.landline || NAVIRA_CONTACT.phone1,
    phone2: row?.cell_number || NAVIRA_CONTACT.phone2,
    address: row?.address || NAVIRA_CONTACT.address,
    city: row?.city || NAVIRA_CONTACT.city,
    country: row?.country || NAVIRA_CONTACT.country,
    weekdayHours: row?.weekday_hours || NAVIRA_CONTACT.weekdayHours,
    saturdayHours: row?.saturday_hours || NAVIRA_CONTACT.saturdayHours,
    sundayHours: row?.sunday_hours || NAVIRA_CONTACT.sundayHours,
    googleMapsUrl: row?.google_maps_url ?? null,
    primaryEmail: row?.email || row?.sales_email || NAVIRA_CONTACT.salesEmail,
  };
}

export function whatsappUrl(number: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function formatFullAddress(c: ReturnType<typeof mergeCompanyContact>): string {
  return [c.address, c.city, c.country].filter(Boolean).join(", ");
}

/** Embedded Google Maps iframe (no API key required). */
export function getGoogleMapsEmbedUrl(c: ReturnType<typeof mergeCompanyContact>): string {
  if (c.googleMapsUrl?.includes("google.com/maps/embed")) {
    return c.googleMapsUrl;
  }
  const q = encodeURIComponent(formatFullAddress(c));
  return `https://maps.google.com/maps?q=${q}&z=16&ie=UTF8&iwloc=&output=embed`;
}

/** Opens Google Maps app/site for directions. */
export function getGoogleMapsOpenUrl(c: ReturnType<typeof mergeCompanyContact>): string {
  if (c.googleMapsUrl && !c.googleMapsUrl.includes("embed")) {
    return c.googleMapsUrl;
  }
  const q = encodeURIComponent(formatFullAddress(c));
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}
