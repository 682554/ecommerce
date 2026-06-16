import { createAuthClient } from "better-auth/react";

const clientBaseURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL;

export const authClient = createAuthClient(
  clientBaseURL
    ? {
        baseURL: clientBaseURL,
      }
    : {},
);
