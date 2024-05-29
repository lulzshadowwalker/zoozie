import { jwtVerify } from "jose";
import Config from "@/lib/config";
import { TUserRole } from "@/lib/types";

interface JwtCustomClaims {
  name: string;
  role: TUserRole;
  agencyId?: number;
  agencySlug?: string;
  sub: string | number;
  exp: number;
  customerId?: number;
}

export type TUserClaims = JwtCustomClaims;

export class TokenNotFound extends Error {}
export class Forbidden extends Error {}

/**
 * Verifies the user's JWT token and returns its payload if it's valid.
 */
export async function authenticate(token: string | undefined) {
  if (!token) throw new TokenNotFound("Missing user token");

  try {
    const verified = await jwtVerify<JwtCustomClaims>(
      token,
      new TextEncoder().encode(Config.jwtSecret),
    );
    return verified.payload as JwtCustomClaims;
  } catch (err) {
    throw err;
  }
}

export function forbidden() {
  throw new Forbidden("Forbidden");
}
