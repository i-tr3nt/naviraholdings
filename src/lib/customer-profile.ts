import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type CustomerProfileInput = {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  deliveryNotes?: string;
};

export type CustomerProfile = CustomerProfileInput & {
  userId: string;
};

export function profileFromMetadata(user: User): CustomerProfileInput | null {
  const m = user.user_metadata;
  if (m?.account_type !== "customer") return null;
  const fullName = (m.name as string | undefined)?.trim();
  const phone = (m.phone as string | undefined)?.trim();
  const addressLine = (m.address_line as string | undefined)?.trim();
  const city = (m.city as string | undefined)?.trim();
  if (!fullName || !phone || !addressLine) return null;
  return {
    fullName,
    phone,
    addressLine,
    city: city || "Harare",
    deliveryNotes: (m.delivery_notes as string | undefined)?.trim() || undefined,
  };
}

export async function fetchCustomerProfile(userId: string): Promise<CustomerProfile | null> {
  const { data, error } = await supabase
    .from("customer_profiles")
    .select("user_id, full_name, phone, address_line, city, delivery_notes")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    userId: data.user_id,
    fullName: data.full_name,
    phone: data.phone,
    addressLine: data.address_line,
    city: data.city,
    deliveryNotes: data.delivery_notes ?? undefined,
  };
}

export async function upsertCustomerProfile(
  userId: string,
  input: CustomerProfileInput
): Promise<{ error: Error | null }> {
  const row = {
    user_id: userId,
    full_name: input.fullName.trim(),
    phone: input.phone.trim(),
    address_line: input.addressLine.trim(),
    city: input.city.trim() || "Harare",
    delivery_notes: input.deliveryNotes?.trim() || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("customer_profiles").upsert(row, { onConflict: "user_id" });
  return { error: error ? new Error(error.message) : null };
}

export async function ensureCustomerProfileFromUser(user: User): Promise<CustomerProfile | null> {
  const existing = await fetchCustomerProfile(user.id);
  if (existing) return existing;

  const fromMeta = profileFromMetadata(user);
  if (!fromMeta) return null;

  await upsertCustomerProfile(user.id, fromMeta);
  return { userId: user.id, ...fromMeta };
}

export function formatDeliveryAddress(profile: CustomerProfileInput): string {
  return [profile.addressLine, profile.city].filter(Boolean).join(", ");
}

export function formatCustomerContact(profile: CustomerProfileInput): string {
  return profile.phone;
}
