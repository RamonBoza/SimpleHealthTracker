import { test, expect } from "@playwright/test";
import { emptyDay } from "../../lib/model";
import { randomUUID } from "node:crypto";

test("mapa anual de lectura: semanas, año bisiesto y colores", async ({
  page,
}) => {
  const suffix = Date.now();
  const headers = { Origin: "http://127.0.0.1:3100" };
  expect(
    (
      await page.request.post("/api/register", {
        headers,
        data: {
          username: `Year${suffix}`,
          email: `year${suffix}@example.com`,
          password: "UnaClaveLarga2026!",
          consent: true,
        },
      })
    ).ok(),
  ).toBeTruthy();
  for (const [date, color, text] of [
    ["2024-02-29", "green", "Comida del día bisiesto"],
    ["2024-03-02", "red", "Cena especial"],
  ] as const) {
    expect(
      (
        await page.request.put(`/api/days/${date}`, {
          headers,
          data: {
            ...emptyDay(),
            steps: date === "2024-02-29" ? 8000 : 8001,
            meals: [{ id: randomUUID(), type: "Comida", text, color }],
          },
        })
      ).ok(),
    ).toBeTruthy();
  }
  const user = await (await page.request.get("/api/me")).json();
  expect(
    (
      await page.request.put("/api/settings", {
        headers,
        data: { ...user.settings, stepsGoal: 8000 },
      })
    ).ok(),
  ).toBeTruthy();
  expect(
    (
      await page.request.put("/api/days/2024-03-03", {
        headers,
        data: { ...emptyDay(), steps: 0 },
      })
    ).ok(),
  ).toBeTruthy();
  await page.goto("/");
  await page.getByRole("button", { name: "Tu año", exact: true }).click();
  await page.getByLabel("Año del calendario").fill("2024");
  const map = page.getByLabel("Alimentación de 2024", { exact: true });
  await expect(map.getByRole("img")).toHaveCount(366);
  await expect(map.getByRole("button")).toHaveCount(0);
  await expect(
    page.getByRole("region", { name: "Detalle del día seleccionado" }),
  ).toHaveCount(0);
  await expect(map.locator(".year-bit.green")).toHaveCount(1);
  await expect(map.locator(".year-bit.red")).toHaveCount(1);
  const stepsMap = page.getByLabel("Pasos de 2024", { exact: true });
  await expect(stepsMap.getByRole("img")).toHaveCount(366);
  await expect(stepsMap.locator(".year-bit.green")).toHaveCount(1);
  await expect(stepsMap.locator(".year-bit.yellow")).toHaveCount(2);
  await expect(stepsMap.locator(".year-bit.unrecorded")).toHaveCount(363);
  await expect(
    stepsMap.getByRole("img", { name: /29 de febrero de 2024/ }),
  ).toHaveAttribute("class", /yellow/);
  // The first Monday is 1 January; leap day falls in the Thursday column.
  const leap = map.getByRole("img", { name: /29 de febrero de 2024/ });
  expect(
    await leap.evaluate((el) =>
      Array.from(el.parentElement!.children).indexOf(el),
    ),
  ).toBe(4);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  const bounds = await map.boundingBox();
  expect(bounds!.height).toBeLessThan(480);
  await expect(
    map.locator(".year-month").filter({ hasText: /^[EFMAJSOND]$/ }),
  ).toHaveCount(12);
  const info = await page
    .getByRole("complementary", {
      name: "Información del mapa anual de alimentación",
    })
    .boundingBox();
  expect(info!.y + info!.height).toBeLessThanOrEqual(bounds!.y + 1);
  const stepsBounds = await stepsMap.boundingBox();
  expect(stepsBounds!.x).toBeGreaterThan(bounds!.x);
  expect(Math.abs(stepsBounds!.y - bounds!.y)).toBeLessThan(2);
  await page.screenshot({
    path: "test-results/mobile-year-calendar.png",
    fullPage: true,
  });
  await page.getByLabel("Año del calendario").fill("2025");
  await expect(
    page.getByLabel("Alimentación de 2025", { exact: true }).getByRole("img"),
  ).toHaveCount(365);
  await page.getByLabel("Año del calendario").fill("2028");
  await expect(
    page
      .getByLabel("Alimentación de 2028", { exact: true })
      .getByRole("img")
      .first(),
  ).toHaveAttribute("class", /future/);
});
