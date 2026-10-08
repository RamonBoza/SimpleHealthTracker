import { test, expect } from "@playwright/test";
test("autoguardado: error, reintento y cambios durante una petición en curso", async ({
  page,
}) => {
  const suffix = Date.now();
  const registered = await page.request.post("/api/register", {
    headers: { Origin: "http://127.0.0.1:3100" },
    data: {
      username: "Save" + suffix,
      email: `save${suffix}@example.com`,
      password: "UnaClaveMuyLarga2026!",
      consent: true,
    },
  });
  expect(registered.ok()).toBeTruthy();
  await page.goto("/");
  await page.route("**/api/days/*", (r) => r.abort("failed"));
  await page.getByLabel("Peso", { exact: true }).fill("81.5");
  await expect(
    page.getByRole("status", { name: "Estado de guardado" }),
  ).toHaveText("No se pudo guardar");
  expect(await (await page.request.get("/api/days")).json()).toEqual({});
  await page.unroute("**/api/days/*");
  await page.getByRole("button", { name: "Reintentar", exact: true }).click();
  await expect(
    page.getByRole("status", { name: "Estado de guardado" }),
  ).toHaveText("Guardado");
  let release: () => void = () => {};
  const held = new Promise<void>((r) => {
    release = r;
  });
  let first = true;
  await page.route("**/api/days/*", async (route) => {
    if (first) {
      first = false;
      await held;
    }
    await route.continue();
  });
  await page.getByLabel("Notas del día").fill("Primera nota");
  await expect(
    page.getByRole("status", { name: "Estado de guardado" }),
  ).toHaveText("Guardando…");
  await page
    .getByLabel("Notas del día")
    .fill("Nota final actualizada durante el guardado");
  release();
  await expect(
    page.getByRole("status", { name: "Estado de guardado" }),
  ).toHaveText("Guardado");
  const date = await page.getByLabel("Fecha del diario").inputValue();
  const data = await (await page.request.get("/api/days")).json();
  expect(data[date].notes).toBe("Nota final actualizada durante el guardado");
  expect(data[date].weight).toBe(81.5);
  await page.reload();
  await expect(page.getByLabel("Notas del día")).toHaveValue(
    "Nota final actualizada durante el guardado",
  );
  await page.getByRole("button", { name: "Opciones", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Tus referencias" }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({
    path: "test-results/mobile-options.png",
    fullPage: true,
  });
});
