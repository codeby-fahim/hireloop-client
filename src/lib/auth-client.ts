import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

/**
 * Same-origin client: the auth endpoints are served from `/api/auth/*`,
 * so no `baseURL` is needed. `BETTER_AUTH_URL` is also not exposed to the
 * browser unless it is prefixed with `NEXT_PUBLIC_`.
 */
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
