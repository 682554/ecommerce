# Nike Authentication System

## Overview

This is a production-ready authentication system built with:
- **Database**: PostgreSQL via Drizzle ORM
- **Sessions**: Cookie-based auth with UUID tokens
- **Validation**: Zod schemas for type-safe input validation
- **Architecture**: Modular, server-action based auth flow

## Architecture

### Database Schema

All schemas are modular and located in `src/db/schema/`:

- **`user.ts`**: User accounts (name, email, image, verification status)
- **`account.ts`**: Auth providers (credentials, OAuth tokens for future use)
- **`session.ts`**: Active user sessions with token-based auth
- **`verification.ts`**: Email verification tokens (for future implementation)
- **`guest.ts`**: Guest session tracking for cart persistence
- **`products.ts`**: Product catalog (existing)

### Cookie-Based Sessions

Two types of sessions are supported:

1. **`auth_session`**: For authenticated users
   - HttpOnly, Secure, SameSite=strict
   - 7-day expiry
   - UUID token stored in `session` table

2. **`guest_session`**: For unauthenticated users
   - HttpOnly, Secure, SameSite=strict
   - 7-day expiry
   - UUID sessionToken stored in `guest` table
   - Used for cart persistence before login

## File Structure

```
src/
├── lib/
│   └── auth/
│       ├── actions.ts       # Server actions (signUp, signIn, signOut, etc.)
│       ├── validation.ts    # Zod schemas for input validation
│       ├── utils.ts         # Helper functions (isAuthenticated, getUser, etc.)
│       └── index.ts         # Clean exports
├── db/
│   ├── index.ts             # Database client initialization
│   ├── schema.ts            # Re-exports all schemas
│   └── schema/
│       ├── user.ts          # User table schema
│       ├── session.ts       # Session table schema
│       ├── account.ts       # Account table schema
│       ├── verification.ts  # Verification table schema
│       ├── guest.ts         # Guest session table schema
│       ├── products.ts      # Product table schema
│       └── index.ts         # Schema exports
```

## Server Actions

All auth operations are implemented as server actions in `src/lib/auth/actions.ts`:

### `signUp(input: SignUpInput)`
Creates a new user account with email and password.

**Payload:**
```typescript
{
  name: string;           // 2-100 chars
  email: string;          // Valid email
  password: string;       // Min 8 chars
  confirmPassword: string;// Must match password
}
```

**Returns:**
```typescript
{
  success: boolean;
  message: string;
  data?: { user: User };
  error?: string;
}
```

### `signIn(input: SignInInput)`
Authenticates a user with email and password.

**Payload:**
```typescript
{
  email: string;
  password: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  message: string;
  data?: { user: User };
  error?: string;
}
```

### `signOut()`
Clears user session and cookies.

**Returns:**
```typescript
{
  success: boolean;
  message: string;
}
```

### `createGuestSession()`
Creates a guest session for unauthenticated users.

**Returns:**
```typescript
{
  success: boolean;
  message: string;
  data?: { sessionToken: string };
  error?: string;
}
```

### `getGuestSession()`
Retrieves the current guest session from cookies.

**Returns:**
```typescript
{
  success: boolean;
  message: string;
  data?: Guest;
  error?: string;
}
```

### `getCurrentUser()`
Gets the currently authenticated user from the session.

**Returns:**
```typescript
{
  success: boolean;
  message: string;
  data?: User;
  error?: string;
}
```

### `mergeGuestCartWithUserCart(userId: string, guestSessionToken: string)`
Migrates guest cart to authenticated user account.

**Note**: Placeholder for future implementation when cart system is built.

## Utility Functions

Located in `src/lib/auth/utils.ts`:

### `isAuthenticated(): Promise<boolean>`
Check if user is currently authenticated.

### `getUser(): Promise<User | null>`
Get current authenticated user or null.

### `requireAuth(): Promise<User>`
Throws error if not authenticated, returns user if authenticated.

## Usage Examples

### Client Component - Sign Up Form

```typescript
"use client";
import { signUp } from "@/lib/auth";
import { useState } from "react";

export function SignUpForm() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const result = await signUp({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!result.success) {
      setError(result.message);
    } else {
      // Redirect to dashboard or home
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" type="text" required />
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <input name="confirmPassword" type="password" required />
      <button type="submit">Sign Up</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

### Server Component - Protected Content

```typescript
import { requireAuth } from "@/lib/auth";

export default async function Dashboard() {
  const user = await requireAuth(); // Throws if not authenticated

  return <div>Welcome, {user.name}!</div>;
}
```

### Middleware - Route Protection

```typescript
// middleware.ts
import { getUser } from "@/lib/auth/utils";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const user = await getUser();

  // Redirect to sign-in if accessing protected routes
  if (!user && request.nextUrl.pathname.startsWith("/checkout")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/dashboard/:path*"],
};
```

## Database Setup

### 1. Create Database
Ensure your PostgreSQL database is created via Neon or your provider.

### 2. Set Environment Variables
```env
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production # or development
```

### 3. Generate Migrations
```bash
npm run db:generate
```

### 4. Apply Migrations
```bash
npm run db:push
```

### 5. Seed Database (Optional)
```bash
npm run db:seed
```

## Security Considerations

1. **Password Hashing**: Currently uses SHA-256 for MVP. **For production, use bcrypt or Argon2**.

2. **Session Tokens**: Generated using `crypto.randomUUID()` - cryptographically secure.

3. **Cookies**: All auth cookies are:
   - `HttpOnly` - Not accessible to JavaScript
   - `Secure` - Only transmitted over HTTPS in production
   - `SameSite=strict` - CSRF protection
   - 7-day expiry

4. **Input Validation**: All user input validated with Zod before processing.

5. **SQL Injection**: Drizzle ORM parameterizes all queries - safe from SQL injection.

## Future Enhancements

1. **OAuth Integration**
   - Google, Apple OAuth (schema ready)
   - `account.ts` supports OAuth tokens

2. **Email Verification**
   - `verification.ts` schema ready
   - Token-based email confirmation flow

3. **2FA Support**
   - Add `twoFactorEnabled` to user table
   - Create `twoFactor` table for secrets

4. **Password Reset**
   - Extend `verification.ts` for reset tokens
   - Implement reset email flow

5. **Better Password Hashing**
   - Replace SHA-256 with bcrypt/Argon2
   - Use industry-standard libraries

## Troubleshooting

### "User already exists"
- User with email already registered
- Use sign-in instead or provide different email

### "Invalid session token"
- Session expired (7 days)
- User logged out manually
- Database session record deleted
- Create new session by signing in again

### "No guest session found"
- Guest session expired
- Browser cookies cleared
- Create new session with `createGuestSession()`

## Related Documentation

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Zod Validation](https://zod.dev/)
- [Next.js Cookies API](https://nextjs.org/docs/app/api-reference/functions/cookies)
