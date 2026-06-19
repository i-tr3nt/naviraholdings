import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CustomerProfileInput } from "@/lib/customer-profile";

export type CustomerSignupFormState = CustomerProfileInput & {
  email: string;
  password: string;
  confirmPassword: string;
};

export const emptySignupForm = (): CustomerSignupFormState => ({
  fullName: "",
  email: "",
  phone: "",
  addressLine: "",
  city: "Harare",
  deliveryNotes: "",
  password: "",
  confirmPassword: "",
});

type CustomerSignupFormProps = {
  value: CustomerSignupFormState;
  onChange: (next: CustomerSignupFormState) => void;
  idPrefix?: string;
};

export function CustomerSignupForm({ value, onChange, idPrefix = "" }: CustomerSignupFormProps) {
  const id = (field: string) => (idPrefix ? `${idPrefix}-${field}` : field);

  const set = <K extends keyof CustomerSignupFormState>(key: K, val: CustomerSignupFormState[K]) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
        We need these details to process your online orders, contact you about pickup or delivery, and send order
        updates.
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={id("fullName")}>Full name *</Label>
          <Input
            id={id("fullName")}
            value={value.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            placeholder="e.g. John Moyo"
            required
            autoComplete="name"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={id("email")}>Email *</Label>
          <Input
            id={id("email")}
            type="email"
            value={value.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={id("phone")}>Phone / WhatsApp *</Label>
          <Input
            id={id("phone")}
            type="tel"
            value={value.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+263..."
            required
            autoComplete="tel"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={id("city")}>City *</Label>
          <Input
            id={id("city")}
            value={value.city}
            onChange={(e) => set("city", e.target.value)}
            placeholder="Harare"
            required
            autoComplete="address-level2"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={id("addressLine")}>Delivery / pickup address *</Label>
          <Input
            id={id("addressLine")}
            value={value.addressLine}
            onChange={(e) => set("addressLine", e.target.value)}
            placeholder="Street, suburb, or store pickup"
            required
            autoComplete="street-address"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={id("deliveryNotes")}>Order notes (optional)</Label>
          <Textarea
            id={id("deliveryNotes")}
            value={value.deliveryNotes ?? ""}
            onChange={(e) => set("deliveryNotes", e.target.value)}
            placeholder="e.g. Call on arrival, gate code, preferred pickup time"
            rows={2}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 border-t border-border pt-4">
        <div className="space-y-2">
          <Label htmlFor={id("password")}>Password *</Label>
          <Input
            id={id("password")}
            type="password"
            value={value.password}
            onChange={(e) => set("password", e.target.value)}
            minLength={6}
            required
            autoComplete="new-password"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={id("confirmPassword")}>Confirm password *</Label>
          <Input
            id={id("confirmPassword")}
            type="password"
            value={value.confirmPassword}
            onChange={(e) => set("confirmPassword", e.target.value)}
            minLength={6}
            required
            autoComplete="new-password"
          />
        </div>
      </div>
    </div>
  );
}

export function validateSignupForm(form: CustomerSignupFormState): string | null {
  if (!form.fullName.trim()) return "Please enter your full name.";
  if (!form.email.trim()) return "Please enter your email.";
  if (!form.phone.trim()) return "Please enter your phone number.";
  if (!form.addressLine.trim()) return "Please enter your delivery or pickup address.";
  if (!form.city.trim()) return "Please enter your city.";
  if (form.password.length < 6) return "Password must be at least 6 characters.";
  if (form.password !== form.confirmPassword) return "Passwords do not match.";
  return null;
}
