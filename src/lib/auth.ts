import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

const authBaseURL = process.env.BETTER_AUTH_URL;
const authSecret = process.env.BETTER_AUTH_SECRET;

export const auth = betterAuth({
  appName: "Nike Store",
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  ...(authBaseURL
    ? {
        baseURL: authBaseURL,
        trustedOrigins: [authBaseURL],
      }
    : {}),
  ...(authSecret
    ? {
        secret: authSecret,
      }
    : {}),
  emailAndPassword: {
    enabled: true,
  },
});
