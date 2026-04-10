import { getSession } from "next-auth/react";

/**
 * Optimized session check that can be called on-demand.
 * This avoids the overhead of the useSession hook when only 
 * a one-time verification is needed for an action.
 */
export async function checkSession() {
  if (typeof window === "undefined") return null;
  return await getSession();
}
