import { test, expect, request } from "@playwright/test";
import { DatabaseSync } from "node:sqlite";
import { messages, startMail, stopMail } from "./smtp";
import { emptyDay } from "../../lib/model";
const origin = "http://127.0.0.1:3100";
const headers = { Origin: origin };
test.beforeAll(startMail);
test.afterAll(stopMail);
test("diario, privacidad entre cuentas, recuperación, moderación y borrado", async ({
  page,
}) => {
  const suffix = Date.now();
  const username = "User" + suffix;
  const password = "UnaClaveLarga!2026";
  await page.goto("/");
  await page.getByRole("button", { name: "Crear cuenta", exact: true }).click();
  await page.getByLabel("Nombre de usuario").fill(username);
  await page.getByLabel("Correo electrónico").fill(`${username}@example.com`);
  await page.getByLabel("Contraseña", { exact: true }).fill(password);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Crear cuenta", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Tu día, de un vistazo" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Cena Sin registrar · Opcional" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Cena Sin registrar · Opcional" })
    .click();
  await expect(page.getByLabel("Tipo de comida")).toHaveValue("Cena");
  await page
    .getByRole("button", { name: "Desayuno Sin registrar · Opcional" })
    .click();
  await page.getByLabel("Qué has comido").fill("Café y tostada");
  await page.getByRole("button", { name: "Añadir comida" }).click();
  await page
    .getByLabel("Tipo de comida", { exact: true })
    .selectOption("Desayuno");
  await expect(page.getByLabel("Qué has comido")).toHaveValue("Café y tostada");
  await page.getByLabel("Qué has comido").fill("Café y tostada actualizados");
  await page.getByRole("button", { name: "Actualizar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Eliminar Desayuno" }),
  ).toHaveCount(1);
  await page
    .getByRole("button", {
      name: "Comida Sin registrar · Opcional",
      exact: true,
    })
    .click();
  await page.getByLabel("Qué has comido").fill("Arroz con verduras");
  await page
    .getByRole("button", { name: "Añadir comida", exact: true })
    .click();
  await page.getByLabel("Nombre de la rutina").fill("pushA");
  await page
    .getByRole("group", { name: "Sugerencias de rutina de fuerza" })
    .getByRole("button", { name: "Full body" })
    .click();
  await expect(page.getByLabel("Nombre de la rutina")).toHaveValue("Full body");
  await page.getByLabel("Nombre de la rutina").fill("pushA");
  await page.getByLabel("Natación, caminar, correr…").fill("Natación");
  await page.getByRole("button", { name: "Añadir actividad" }).click();
  await page.getByLabel("Horas dormidas", { exact: true }).fill("6");
  await expect(
    page.getByLabel("Minutos dormidos", { exact: true }),
  ).toHaveValue("0");
  await page.getByLabel("Minutos dormidos", { exact: true }).fill("41");
  await page.getByLabel("Calidad del sueño", { exact: true }).fill("88");
  await page.getByLabel("Peso", { exact: true }).fill("103.2");
  await page.getByLabel("Masa grasa", { exact: true }).fill("25.6");
  await page.getByLabel("Masa muscular", { exact: true }).fill("34.4");
  await page.getByLabel("Grasa visceral", { exact: true }).fill("12");
  await expect(
    page.getByRole("status", { name: "Estado de guardado" }),
  ).toHaveText("Guardado");
  await page.reload();
  await expect(page.getByLabel("Peso", { exact: true })).toHaveValue("103.2");
  await expect(page.getByLabel("Horas dormidas", { exact: true })).toHaveValue(
    "6",
  );
  await expect(
    page.getByLabel("Minutos dormidos", { exact: true }),
  ).toHaveValue("41");
  const currentDate = await page.getByLabel("Fecha del diario").inputValue();
  await page.getByRole("button", { name: "Calendario", exact: true }).click();
  const summary = page.getByRole("region", {
    name: "Resumen de alimentación del mes",
  });
  await expect(summary).toContainText("1 día");
  await expect(summary).toContainText("Sin comidas registradas");
  await expect(
    page.getByRole("button", { name: new RegExp("Sigue la dieta") }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: new RegExp("Sigue la dieta") })
    .click();
  await expect(
    page.getByRole("region", { name: "Detalle del día seleccionado" }),
  ).toContainText("Café y tostada");
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({
    path: "test-results/mobile-calendar.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Evolución", exact: true }).click();
  const periods = page.getByRole("group", { name: "Periodo de evolución" });
  await periods.getByRole("button", { name: "1 mes", exact: true }).click();
  await expect(
    periods.getByRole("button", { name: "1 mes", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await periods.getByRole("button", { name: "Todo", exact: true }).click();
  await expect(page.getByText("Rango de referencia: 82–92 kg")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({
    path: "test-results/mobile-evolution.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Diario", exact: true }).click();
  await expect(
    page.getByRole("status", { name: "Estado de guardado" }),
  ).toHaveText("Guardado");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({
    path: "test-results/mobile-diary.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: "test-results/desktop-diary.png",
    fullPage: true,
  });
  const owner = page.request;
  const me = await (await owner.get("/api/me")).json();
  const other = await request.newContext({
    baseURL: origin,
    extraHTTPHeaders: headers,
  });
  expect(
    (
      await other.post("/api/register", {
        data: {
          username: "Other" + suffix,
          email: `other${suffix}@example.com`,
          password,
          consent: true,
        },
      })
    ).ok(),
  ).toBeTruthy();
  expect(await (await other.get("/api/days")).json()).toEqual({});
  expect((await other.get("/api/admin/users")).status()).toBe(403);
  expect(
    (await other.put("/api/days/2026-02-30", { data: emptyDay() })).status(),
  ).toBe(400);
  expect(
    (
      await other.put("/api/days/2026-10-07", {
        data: { ...emptyDay(), quality: 101 },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await owner.put("/api/days/" + currentDate, {
        headers: { Origin: "https://evil.example" },
        data: emptyDay(),
      })
    ).status(),
  ).toBe(403);
  const admin = await request.newContext({
    baseURL: origin,
    extraHTTPHeaders: headers,
  });
  expect(
    (
      await admin.post("/api/register", {
        data: {
          username: "Admin" + suffix,
          email: `admin${suffix}@example.com`,
          password,
          consent: true,
        },
      })
    ).ok(),
  ).toBeTruthy();
  const adminUser = await (await admin.get("/api/me")).json();
  const db = new DatabaseSync("data/e2e/health.sqlite");
  db.prepare("UPDATE users SET role='admin' WHERE id=?").run(adminUser.id);
  const inspect = await admin.post("/api/admin", {
    data: {
      target: me.id,
      action: "inspect",
      reason: "Revisión de un caso de soporte solicitado",
    },
  });
  expect(inspect.ok()).toBeTruthy();
  expect((await inspect.json()).days[currentDate].weight).toBe(103.2);
  const audits = await (await admin.get("/api/admin/audit")).json();
  expect(
    audits.some((a: any) => a.target === me.id && a.action === "inspect"),
  ).toBeTruthy();
  expect(
    (
      await admin.post("/api/admin", {
        data: {
          target: me.id,
          action: "ban",
          reason: "Bloqueo de prueba por abuso del servicio",
          until: new Date(Date.now() + 3600000).toISOString(),
        },
      })
    ).ok(),
  ).toBeTruthy();
  expect((await owner.get("/api/me")).status()).toBe(401);
  expect(
    (
      await owner.post("/api/login", {
        headers,
        data: { identity: username, password },
      })
    ).status(),
  ).toBe(403);
  await admin.post("/api/admin", {
    data: {
      target: me.id,
      action: "unban",
      reason: "Caso revisado y bloqueo levantado",
    },
  });
  expect(
    (
      await owner.post("/api/login", {
        headers,
        data: { identity: username, password },
      })
    ).ok(),
  ).toBeTruthy();
  const recovery = await owner.post("/api/forgot", {
    headers,
    data: { email: me.email },
  });
  expect(recovery.ok()).toBeTruthy();
  expect((await recovery.json()).message).toContain("Si existe la cuenta");
  expect(messages).toHaveLength(1);
  // Nodemailer may use quoted-printable and fold lines. Decode only the local test message.
  const decoded = messages[0]
    .replace(/=\n/g, "")
    .replace(/=([A-F0-9]{2})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    );
  const token = decoded.match(/reset=([a-f0-9]{64})/)?.[1];
  expect(token).toBeTruthy();
  const absent = await owner.post("/api/forgot", {
    headers,
    data: { email: `absent${suffix}@example.com` },
  });
  expect(await absent.json()).toEqual({
    ok: true,
    message:
      "Si existe la cuenta, recibirás un enlace para cambiar tu contraseña.",
  });
  expect(messages).toHaveLength(1);
  const newPassword = "OtraClaveMuyLarga!2026";
  expect(
    (
      await owner.post("/api/reset", {
        headers,
        data: { token, password: newPassword },
      })
    ).ok(),
  ).toBeTruthy();
  expect((await owner.get("/api/me")).status()).toBe(401);
  expect(
    (
      await owner.post("/api/reset", {
        headers,
        data: { token, password: newPassword },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await owner.post("/api/login", {
        headers,
        data: { identity: username, password: newPassword },
      })
    ).ok(),
  ).toBeTruthy();
  expect(
    (
      await owner.delete("/api/account", {
        headers,
        data: { password: newPassword, confirm: "ELIMINAR" },
      })
    ).ok(),
  ).toBeTruthy();
  expect(db.prepare("SELECT * FROM days WHERE user_id=?").all(me.id)).toEqual(
    [],
  );
  expect(
    db.prepare("SELECT * FROM sessions WHERE user_id=?").all(me.id),
  ).toEqual([]);
  expect(db.prepare("SELECT * FROM resets WHERE user_id=?").all(me.id)).toEqual(
    [],
  );
  expect(db.prepare("SELECT * FROM users WHERE id=?").all(me.id)).toEqual([]);
  const otherUser = await (await other.get("/api/me")).json();
  expect(
    (
      await admin.post("/api/admin", {
        data: {
          target: otherUser.id,
          action: "delete",
          reason: "Solicitud de borrado completa recibida",
        },
      })
    ).ok(),
  ).toBeTruthy();
  expect((await other.get("/api/me")).status()).toBe(401);
  db.close();
  await admin.dispose();
  await other.dispose();
});
