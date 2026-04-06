// Query functions for contacts.

import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { Contact, ContactType } from "@/lib/types/database"

export async function getContacts(): Promise<Contact[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("last_name")

  if (error) {
    console.error("getContacts error:", error)
    return []
  }
  return data as Contact[]
}

export async function getContactById(id: string): Promise<Contact | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("getContactById error:", error)
    return null
  }
  return data as Contact
}

export async function getContactsByType(type: ContactType): Promise<Contact[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("contact_type", type)
    .order("last_name")

  if (error) {
    console.error("getContactsByType error:", error)
    return []
  }
  return data as Contact[]
}
