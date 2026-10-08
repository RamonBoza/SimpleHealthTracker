import { init, query, closeDb } from "../lib/db";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { defaultSettings } from "../lib/model";
async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const username = process.env.ADMIN_USERNAME || "Boza";
  if (!email || !password || password.length < 12 || password.length > 72)
    throw new Error(
      "Configura ADMIN_EMAIL y ADMIN_PASSWORD (12–72 caracteres).",
    );
  await init();
  const [existing] = await query("SELECT id FROM users WHERE email=?", [email]);
  if (existing)
    throw new Error(
      "La cuenta ya existe. Para evitar elevar una cuenta no verificada, usa un correo nuevo para crear el administrador.",
    );
  await query(
    "INSERT INTO users(id,username,username_key,email,password,settings,created,consent,role) VALUES(?,?,?,?,?,?,?,?,?)",
    [
      randomUUID(),
      username,
      username.toLowerCase(),
      email,
      await bcrypt.hash(password, 12),
      JSON.stringify(defaultSettings(true)),
      new Date().toISOString(),
      "health-v1:admin-bootstrap",
      "admin",
    ],
  );
  console.log("Cuenta administradora creada.");
  await closeDb();
}
main().catch(async (e) => {
  console.error(e.message);
  await closeDb();
  process.exitCode = 1;
});
