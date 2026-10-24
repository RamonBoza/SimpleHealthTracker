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
            meals: [{ id: randomUUID(), type: "Comida", text, color }],
          },
        })
      ).ok(),
    ).toBeTruthy();
  }
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
