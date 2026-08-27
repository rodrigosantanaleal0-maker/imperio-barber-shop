import "server-only";
import { randomBytes, createHash, timingSafeEqual } from "node:crypto";

/** Token de acesso do cliente (sem login). Alta entropia, nunca armazenado em texto puro. */
export function generateAccessToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Comparação em tempo constante — evita vazar informação por timing attack. */
export function verifyTokenHash(token: string, storedHash: string): boolean {
  const candidate = Buffer.from(hashToken(token), "hex");
  const stored = Buffer.from(storedHash, "hex");
  if (candidate.length !== stored.length) return false;
  return timingSafeEqual(candidate, stored);
}
