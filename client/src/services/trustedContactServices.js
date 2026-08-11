import {
  apiGet,
  apiPost,
  apiDelete,
} from "./api";

// ============================================================
// GET TRUSTED CONTACTS
// ============================================================

export async function getTrustedContacts() {
  return apiGet("/api/trusted-contacts");
}

// ============================================================
// ADD TRUSTED CONTACT
// ============================================================

export async function addTrustedContact(contact) {
  return apiPost(
    "/api/trusted-contacts",
    contact
  );
}

// ============================================================
// DELETE TRUSTED CONTACT
// ============================================================

export async function deleteTrustedContact(id) {
  return apiDelete(
    `/api/trusted-contacts/${id}`
  );
}