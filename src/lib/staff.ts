import { supabase } from "@/integrations/supabase/client";

export type StaffRole = "admin" | "employee";

export async function fetchStaffRole(userId: string): Promise<StaffRole | null> {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();

  const role = data?.role;
  if (role === "admin" || role === "employee") {
    return role;
  }
  return null;
}

export function isStaffRole(role: string | null | undefined): role is StaffRole {
  return role === "admin" || role === "employee";
}

export async function requireStaffUser(userId: string): Promise<StaffRole> {
  const role = await fetchStaffRole(userId);
  if (!isStaffRole(role)) {
    throw new Error(
      "This account does not have staff access. Sign in from the online shop for customer accounts, or ask an admin to assign you a role."
    );
  }
  return role;
}
