import { randomBytes, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { query, init } from "./db";
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export const digest = (v: string) =>
  createHash("sha256").update(v).digest("hex");
export function isAdmin(user: { role?: string }) {
  return user.role === "admin";
}
export function isBanned(user: { banned_until: string | null }) {
  return (
    user.banned_until === "indefinite" ||
    (!!user.banned_until && new Date(user.banned_until) > new Date())
  );
}
export async function currentUser() {
  await init();
  const token = (await cookies()).get("health_session")?.value;
  if (!token) throw new HttpError(401, "Inicia sesión para continuar.");
  const [user] = await query(
    "SELECT u.* FROM users u JOIN sessions s ON u.id=s.user_id WHERE s.token=? AND s.expires>?",
    [digest(token), new Date().toISOString()],
  );
  if (!user) throw new HttpError(401, "La sesión ha caducado.");
  if (isBanned(user as { banned_until: string | null }))
    throw new HttpError(
      403,
      "Cuenta bloqueada. Puedes solicitar tus derechos mediante el contacto de privacidad.",
    );
  return user;
}
export async function createSession(id: string) {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 30 * 86400000);
  await query("INSERT INTO sessions(token,user_id,expires) VALUES(?,?,?)", [
    digest(token),
    id,
    expires.toISOString(),
  ]);
  (await cookies()).set("health_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}
export async function limit(key: string, max = 10) {
  const bucket = Math.floor(Date.now() / 900000);
  const hashed = digest(`${key}:${bucket}`);
  const [row] = await query(
    "INSERT INTO limits(key,count,expires) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=limits.count+1 RETURNING count",
    [hashed, new Date(Date.now() + 900000).toISOString()],
  );
  await query("DELETE FROM limits WHERE expires<?", [new Date().toISOString()]);
  if (row.count > max)
    throw new HttpError(429, "Demasiados intentos. Espera unos minutos.");
}
