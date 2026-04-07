"use server"

// Server action for public grave search.
// No auth required — results are public information.

import { searchDeceased, type PublicDeceasedResult } from "@/lib/queries/public-portal"

export async function searchDeceasedAction(
  query: string
): Promise<PublicDeceasedResult[]> {
  return searchDeceased(query)
}
