export const ACCOUNT_TYPE_STAFF = "staff";
export const ACCOUNT_TYPE_CUSTOMER = "customer";

export const staffSignupMetadata = () => ({
  account_type: ACCOUNT_TYPE_STAFF,
});

export type CustomerSignupFields = {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  deliveryNotes?: string;
};

export const customerSignupMetadata = (fields: CustomerSignupFields) => ({
  account_type: ACCOUNT_TYPE_CUSTOMER,
  name: fields.fullName.trim(),
  phone: fields.phone.trim(),
  address_line: fields.addressLine.trim(),
  city: fields.city.trim() || "Harare",
  ...(fields.deliveryNotes?.trim() ? { delivery_notes: fields.deliveryNotes.trim() } : {}),
});
