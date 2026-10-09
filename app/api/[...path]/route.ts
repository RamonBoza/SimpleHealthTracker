import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { z } from "zod";
import { query, init } from "@/lib/db";
import { allowedOrigin } from "@/lib/origin";
import {
  currentUser,
  createSession,
  digest,
  HttpError,
  isAdmin,
  isBanned,
  limit,
} from "@/lib/auth";
import {
  daySchema,
  dateSchema,
  settingsSchema,
  defaultSettings,
} from "@/lib/model";
export const runtime = "nodejs";
const password = z
  .string()
  .min(12, "Usa al menos 12 caracteres")
  .max(72)
  .refine(
    (v) => Buffer.byteLength(v, "utf8") <= 72,
    "La contraseña debe ocupar como máximo 72 bytes.",
  );
const email = z
  .email()
  .max(254)
  .transform((v) => v.trim().toLowerCase());
const username = z
  .string()
  .trim()
  .min(3)
  .max(40)
  .regex(/^[\p{L}\p{N}_ .-]+$/u);
const publicUser = (u: Record<string, any>) => ({
  id: u.id,
  username: u.username,
  email: u.email,
  admin: isAdmin(u),
  settings: settingsSchema.parse(JSON.parse(u.settings)),
});
async function removeUser(id: string) {
  await query("UPDATE audit SET target=NULL WHERE target=?", [id]);
  await query("UPDATE audit SET actor=NULL WHERE actor=?", [id]);
  await query("DELETE FROM users WHERE id=?", [id]);
}
async function body(req: NextRequest) {
  const text = await req.text();
  if (text.length > 150000)
    throw new HttpError(413, "Registro demasiado grande.");
  return JSON.parse(text);
}
async function handle(req: NextRequest) {
  await init();
  const path = req.nextUrl.pathname.replace(/^\/api\//, "").split("/");
  const op = path[0];
  const mutation = req.method !== "GET";
  if (mutation) {
    if (
      !allowedOrigin(
        req.headers.get("origin"),
        req.nextUrl.origin,
        process.env.APP_URL,
        process.env.NODE_ENV === "development",
      )
    )
      throw new HttpError(403, "Origen no permitido.");
    if (!req.headers.get("content-type")?.includes("application/json"))
      throw new HttpError(415, "Se requiere JSON.");
  }
  if (op === "privacy" && req.method === "GET")
    return {
      controller: process.env.DATA_CONTROLLER || "",
      contact: process.env.PRIVACY_CONTACT || "",
      recovery: !!process.env.SMTP_HOST,
      ready: !!process.env.DATA_CONTROLLER && !!process.env.PRIVACY_CONTACT,
    };
  if (op === "register" && req.method === "POST") {
    await limit("register-global", 100);
    if (
      process.env.VERCEL &&
      (!process.env.DATA_CONTROLLER || !process.env.PRIVACY_CONTACT)
    )
      throw new HttpError(503, "El registro no está configurado todavía.");
    const data = z
      .object({ username, email, password, consent: z.literal(true) })
      .parse(await body(req));
    await limit("register:" + data.email, 5);
    const id = randomUUID();
    const hash = await bcrypt.hash(data.password, 12);
    try {
      await query(
        "INSERT INTO users(id,username,username_key,email,password,settings,created,consent) VALUES(?,?,?,?,?,?,?,?)",
        [
          id,
          data.username,
          data.username.toLowerCase(),
          data.email,
          hash,
          JSON.stringify(
            defaultSettings(data.username.toLowerCase() === "boza"),
          ),
          new Date().toISOString(),
          "health-v1:" + new Date().toISOString(),
        ],
      );
    } catch (error) {
      if (/unique|duplicate/i.test(String(error)))
        throw new HttpError(409, "No se puede crear la cuenta con esos datos.");
      throw error;
    }
    await createSession(id);
    return { ok: true };
  }
  if (op === "login" && req.method === "POST") {
    const data = z
      .object({
        identity: z.string().trim().min(1).max(254),
        password: z.string().max(72),
      })
      .parse(await body(req));
    await limit("login:" + data.identity.toLowerCase(), 10);
    await limit("login-global", 300);
    const [u] = await query(
      "SELECT * FROM users WHERE email=? OR username_key=?",
      [data.identity.toLowerCase(), data.identity.toLowerCase()],
    );
    const valid = await bcrypt.compare(
      data.password,
      u?.password ||
        "$2b$12$RE4UWGSOBBaRY7evBFUS4ePBE9OKtyhjps8O/ohMAKS.8X/z/OHBq",
    );
    if (!u || !valid)
      throw new HttpError(401, "Usuario o contraseña incorrectos.");
    if (isBanned(u as { banned_until: string | null }))
      throw new HttpError(
        403,
        "Cuenta bloqueada. Contacta con el responsable de privacidad para soporte o derechos.",
      );
    await createSession(u.id);
    return { ok: true };
  }
  if (op === "forgot" && req.method === "POST") {
    const data = z.object({ email }).parse(await body(req));
    await limit("forgot:" + data.email, 3);
    await limit("forgot-global", 100);
    if (!process.env.SMTP_HOST)
      throw new HttpError(
        503,
        "La recuperación por correo aún no está configurada.",
      );
    const [u] = await query("SELECT * FROM users WHERE email=?", [data.email]);
    if (u) {
      const token = randomBytes(32).toString("hex");
      await query("INSERT INTO resets(token,user_id,expires) VALUES(?,?,?)", [
        digest(token),
        u.id,
        new Date(Date.now() + 3600000).toISOString(),
      ]);
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_PORT === "465",
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
      });
      try {
        await transport.sendMail({
          from: process.env.SMTP_FROM,
          to: u.email,
          subject: "Recupera tu acceso · SimpleHealthTracker",
          text: `Cambia tu contraseña en ${process.env.APP_URL}/?reset=${token}\nEl enlace caduca en una hora. Si no lo has solicitado, ignora este mensaje.`,
        });
      } catch {
        await query("DELETE FROM resets WHERE token=?", [digest(token)]);
        console.error("Recovery email delivery failed");
      }
    }
    return {
      ok: true,
      message:
        "Si existe la cuenta, recibirás un enlace para cambiar tu contraseña.",
    };
  }
  if (op === "reset" && req.method === "POST") {
    const data = z
      .object({ token: z.string().regex(/^[a-f0-9]{64}$/), password })
      .parse(await body(req));
    await limit("reset-global", 100);
    const hash = await bcrypt.hash(data.password, 12);
    const [reset] = await query(
      "DELETE FROM resets WHERE token=? AND expires>? RETURNING user_id",
      [digest(data.token), new Date().toISOString()],
    );
    if (!reset)
      throw new HttpError(400, "El enlace ha caducado o ya se ha utilizado.");
    await query("UPDATE users SET password=? WHERE id=?", [
      hash,
      reset.user_id,
    ]);
    await query("DELETE FROM sessions WHERE user_id=?", [reset.user_id]);
    await query("DELETE FROM resets WHERE user_id=?", [reset.user_id]);
    return { ok: true };
  }
  if (op === "logout" && req.method === "POST") {
    const jar = await cookies();
    const token = jar.get("health_session")?.value;
    if (token)
      await query("DELETE FROM sessions WHERE token=?", [digest(token)]);
    jar.delete("health_session");
    return { ok: true };
  }
  const user = await currentUser();
  if (op === "me" && req.method === "GET") return publicUser(user);
  if (op === "days" && req.method === "GET") {
    const rows = await query(
      "SELECT date,data FROM days WHERE user_id=? ORDER BY date",
      [user.id],
    );
    return Object.fromEntries(rows.map((r) => [r.date, JSON.parse(r.data)]));
  }
  if (op === "days" && path[1]) {
    const date = dateSchema.parse(path[1]);
    if (req.method === "PUT") {
      const data = daySchema.parse(await body(req));
      await query(
        "INSERT INTO days(user_id,date,data) VALUES(?,?,?) ON CONFLICT(user_id,date) DO UPDATE SET data=excluded.data",
        [user.id, date, JSON.stringify(data)],
      );
      return { ok: true };
    }
    if (req.method === "DELETE") {
      await query("DELETE FROM days WHERE user_id=? AND date=?", [
        user.id,
        date,
      ]);
      return { ok: true };
    }
  }
  if (op === "settings" && req.method === "PUT") {
    const data = settingsSchema.parse(await body(req));
    await query("UPDATE users SET settings=? WHERE id=?", [
      JSON.stringify(data),
      user.id,
    ]);
    return { ok: true };
  }
  if (op === "account" && req.method === "DELETE") {
    const data = z
      .object({ password: z.string(), confirm: z.literal("ELIMINAR") })
      .parse(await body(req));
    await limit("delete:" + user.id, 5);
    if (!(await bcrypt.compare(data.password, user.password)))
      throw new HttpError(403, "Contraseña incorrecta.");
    await removeUser(user.id);
    (await cookies()).delete("health_session");
    return { ok: true };
  }
  if (op === "admin") {
    if (!isAdmin(user))
      throw new HttpError(403, "Acceso solo para administración.");
    if (req.method === "GET" && path[1] === "users")
      return await query(
        "SELECT id,username,email,created,banned_until,ban_reason,role FROM users ORDER BY created DESC",
      );
    if (req.method === "GET" && path[1] === "audit")
      return await query("SELECT * FROM audit ORDER BY created DESC LIMIT 100");
    if (req.method === "POST") {
      const data = z
        .object({
          target: z.string().uuid(),
          action: z.enum(["inspect", "ban", "unban", "delete"]),
          reason: z.string().trim().min(10).max(500),
          until: z.string().nullable().optional(),
        })
        .parse(await body(req));
      const [target] = await query("SELECT * FROM users WHERE id=?", [
        data.target,
      ]);
      if (!target) throw new HttpError(404, "Usuario no encontrado.");
      if (isAdmin(target) && data.action !== "inspect")
        throw new HttpError(
          400,
          "No se puede moderar una cuenta administradora.",
        );
      let until: string | null = null;
      if (data.action === "ban") {
        until = data.until || "indefinite";
        if (
          until !== "indefinite" &&
          (isNaN(Date.parse(until)) || new Date(until) <= new Date())
        )
          throw new HttpError(400, "Elige una fecha futura.");
      }
      await query(
        "INSERT INTO audit(id,actor,target,action,reason,created) VALUES(?,?,?,?,?,?)",
        [
          randomUUID(),
          user.id,
          target.id,
          data.action,
          data.reason,
          new Date().toISOString(),
        ],
      );
      if (data.action === "inspect") {
        const rows = await query(
          "SELECT date,data FROM days WHERE user_id=? ORDER BY date DESC",
          [target.id],
        );
        return {
          user: publicUser(target),
          days: Object.fromEntries(
            rows.map((r) => [r.date, JSON.parse(r.data)]),
          ),
        };
      }
      if (data.action === "ban") {
        await query("UPDATE users SET banned_until=?,ban_reason=? WHERE id=?", [
          until,
          data.reason,
          target.id,
        ]);
        await query("DELETE FROM sessions WHERE user_id=?", [target.id]);
      }
      if (data.action === "unban")
        await query(
          "UPDATE users SET banned_until=NULL,ban_reason=NULL WHERE id=?",
          [target.id],
        );
      if (data.action === "delete") await removeUser(target.id);
      return { ok: true };
    }
  }
  throw new HttpError(404, "Acción no encontrada.");
}
async function route(req: NextRequest) {
  try {
    const result = await handle(req);
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof z.ZodError)
      return NextResponse.json(
        { error: error.issues[0]?.message || "Datos inválidos." },
        { status: 400 },
      );
    if (error instanceof HttpError)
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    if (error instanceof SyntaxError)
      return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
    console.error(
      "API error",
      error instanceof Error ? error.message : "unknown",
    );
    return NextResponse.json(
      { error: "No se ha podido completar la operación. Inténtalo de nuevo." },
      { status: 500 },
    );
  }
}
export { route as GET, route as POST, route as PUT, route as DELETE };
