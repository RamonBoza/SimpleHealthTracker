import { test, expect } from "@playwright/test";
import { DatabaseSync } from "node:sqlite";
test("administración móvil: búsqueda y consulta justificada", async ({
  page,
}) => {
  const username = "UXAdmin" + Date.now();
  const result = await page.request.post("/api/register", {
    headers: { Origin: "http://127.0.0.1:3100" },
    data: {
      username,
      email: `${username}@example.com`,
      password: "UnaClaveMuyLarga2026!",
      consent: true,
    },
  });
  expect(result.ok()).toBeTruthy();
  const user = await (await page.request.get("/api/me")).json();
  const db = new DatabaseSync("data/e2e/health.sqlite");
  db.prepare("UPDATE users SET role='admin' WHERE id=?").run(user.id);
  db.close();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Administración", exact: true })
    .click();
  await page.getByLabel("Buscar cuenta").fill(username);
  await page.getByRole("button", { name: "Consultar", exact: true }).click();
  await page
    .getByLabel("Motivo (sin copiar datos sensibles)")
    .fill("Consulta de soporte solicitada para revisar el registro");
  await page
    .getByRole("button", { name: "Confirmar acción", exact: true })
    .click();
  await expect(page.getByText("Acceso registrado. 0 días.")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({
    path: "test-results/mobile-admin.png",
    fullPage: true,
  });
});
