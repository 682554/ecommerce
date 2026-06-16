"use server";

import { db } from "@/db";
import { user, account, session, guest } from "@/db/schema/index";
import { eq, and } from "drizzle-orm";
import { signUpSchema, signInSchema } from "./validation";
import { cookies } from "next/headers";
import crypto from "crypto";
import { mergeGuestCartWithUserCart as mergeGuestCartSnapshot } from "@/lib/actions/cart";

// Hash password using crypto (in production, use bcrypt)
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

/**
 * Create a new guest session
 * Returns session token to be stored in cookie
 */
export async function createGuestSession() {
  try {
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db
      .insert(guest)
      .values({
        sessionToken,
        expiresAt,
      })
      .returning();

    // Set guest_session cookie
    const cookieStore = await cookies();
    cookieStore.set("guest_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return {
      success: true,
      message: "Guest session created",
      data: { sessionToken },
    };
  } catch (error) {
    console.error("Failed to create guest session:", error);
    return {
      success: false,
      message: "Failed to create guest session",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get current guest session from cookie
 */
export async function getGuestSession() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("guest_session")?.value;

    if (!sessionToken) {
      return {
        success: false,
        message: "No guest session found",
        data: null,
      };
    }

    const [guestSession] = await db
      .select()
      .from(guest)
      .where(eq(guest.sessionToken, sessionToken))
      .limit(1);

    if (!guestSession || new Date() > guestSession.expiresAt) {
      // Clear expired session
      cookieStore.delete("guest_session");
      return {
        success: false,
        message: "Guest session expired",
        data: null,
      };
    }

    return {
      success: true,
      message: "Guest session found",
      data: guestSession,
    };
  } catch (error) {
    console.error("Failed to get guest session:", error);
    return {
      success: false,
      message: "Failed to get guest session",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(input: unknown) {
  try {
    const validatedInput = signUpSchema.parse(input);
    const cookieStore = await cookies();
    const guestSessionToken = cookieStore.get("guest_session")?.value ?? null;

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, validatedInput.email))
      .limit(1);

    if (existingUser.length > 0) {
      return {
        success: false,
        message: "User already exists with this email",
      };
    }

    // Create new user
    const [newUser] = await db
      .insert(user)
      .values({
        name: validatedInput.name,
        email: validatedInput.email,
        emailVerified: false, // MVP: no verification
      })
      .returning();

    // Create account for email/password
    const hashedPassword = hashPassword(validatedInput.password);
    await db.insert(account).values({
      userId: newUser.id,
      accountId: validatedInput.email,
      providerId: "credentials",
      password: hashedPassword,
    });

    // Create session
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.insert(session).values({
      userId: newUser.id,
      token,
      expiresAt,
    });

    // Set auth_session cookie
    cookieStore.set("auth_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    if (guestSessionToken) {
      await mergeGuestCartSnapshot(newUser.id, guestSessionToken);
      cookieStore.delete("guest_session");
    }

    return {
      success: true,
      message: "User created successfully",
      data: { user: newUser },
    };
  } catch (error) {
    console.error("Sign up error:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return {
        success: false,
        message: "Invalid input provided",
        error: error.message,
      };
    }
    return {
      success: false,
      message: "Failed to sign up",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(input: unknown) {
  try {
    const validatedInput = signInSchema.parse(input);
    const cookieStore = await cookies();
    const guestSessionToken = cookieStore.get("guest_session")?.value ?? null;

    // Find user by email
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, validatedInput.email))
      .limit(1);

    if (!foundUser) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Find account with password
    const [foundAccount] = await db
      .select()
      .from(account)
      .where(
        and(
          eq(account.userId, foundUser.id),
          eq(account.providerId, "credentials")
        )
      )
      .limit(1);

    if (!foundAccount || !foundAccount.password) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Verify password
    const hashedPassword = hashPassword(validatedInput.password);
    if (foundAccount.password !== hashedPassword) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Create session
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.insert(session).values({
      userId: foundUser.id,
      token,
      expiresAt,
    });

    // Set auth_session cookie
    cookieStore.set("auth_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    if (guestSessionToken) {
      await mergeGuestCartSnapshot(foundUser.id, guestSessionToken);
      cookieStore.delete("guest_session");
    }

    return {
      success: true,
      message: "Signed in successfully",
      data: { user: foundUser },
    };
  } catch (error) {
    console.error("Sign in error:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return {
        success: false,
        message: "Invalid input provided",
        error: error.message,
      };
    }
    return {
      success: false,
      message: "Failed to sign in",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Sign out user - clear session and cookies
 */
export async function signOut() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_session")?.value;

    if (authToken) {
      // Delete session from database
      await db.delete(session).where(eq(session.token, authToken));
    }

    // Clear auth_session cookie
    cookieStore.delete("auth_session");

    return {
      success: true,
      message: "Signed out successfully",
    };
  } catch (error) {
    console.error("Sign out error:", error);
    return {
      success: false,
      message: "Failed to sign out",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get current authenticated user from session
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_session")?.value;

    if (!authToken) {
      return {
        success: false,
        message: "Not authenticated",
        data: null,
      };
    }

    const [sessionRecord] = await db
      .select()
      .from(session)
      .where(eq(session.token, authToken))
      .limit(1);

    if (!sessionRecord || new Date() > sessionRecord.expiresAt) {
      cookieStore.delete("auth_session");
      return {
        success: false,
        message: "Session expired",
        data: null,
      };
    }

    const [currentUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, sessionRecord.userId))
      .limit(1);

    if (!currentUser) {
      return {
        success: false,
        message: "User not found",
        data: null,
      };
    }

    return {
      success: true,
      message: "User found",
      data: currentUser,
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return {
      success: false,
      message: "Failed to get current user",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Merge guest cart with user cart (placeholder for future cart implementation)
 * This will be called after successful login/signup
 */
export async function mergeGuestCartWithUserCart(userId: string, guestSessionToken: string) {
  try {
    const result = await mergeGuestCartSnapshot(userId, guestSessionToken);
    if (!result.success) {
      return {
        success: false,
        message: result.message,
        error: result.error,
      };
    }

    return {
      success: true,
      message: "Cart migrated successfully",
      data: { userId, guestSessionToken },
    };
  } catch (error) {
    console.error("Merge cart error:", error);
    return {
      success: false,
      message: "Failed to merge cart",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
