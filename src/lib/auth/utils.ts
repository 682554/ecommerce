import { cookies } from "next/headers";
import { db } from "@/db";
import { session, user } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Check if user is authenticated by validating session cookie
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_session")?.value;

    if (!authToken) {
      return false;
    }

    const [sessionRecord] = await db
      .select()
      .from(session)
      .where(eq(session.token, authToken))
      .limit(1);

    if (!sessionRecord || new Date() > sessionRecord.expiresAt) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Get current authenticated user
 */
export async function getUser() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_session")?.value;

    if (!authToken) {
      return null;
    }

    const [sessionRecord] = await db
      .select()
      .from(session)
      .where(eq(session.token, authToken))
      .limit(1);

    if (!sessionRecord || new Date() > sessionRecord.expiresAt) {
      return null;
    }

    const [currentUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, sessionRecord.userId))
      .limit(1);

    return currentUser || null;
  } catch {
    return null;
  }
}

/**
 * Require authentication - use in server components
 */
export async function requireAuth() {
  const currentUser = await getUser();
  if (!currentUser) {
    throw new Error("Authentication required");
  }
  return currentUser;
}
