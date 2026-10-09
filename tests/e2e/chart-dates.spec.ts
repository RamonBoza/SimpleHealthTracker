import { test, expect } from "@playwright/test";
import { emptyDay } from "../../lib/model";

test("las etiquetas de fechas son únicas y conservan los intervalos reales", async ({
  page,
}) => {
  const suffix = Date.now();
  const headers = { Origin: "http://127.0.0.1:3100" };
  const registered = await page.request.post("/api/register", {
    headers,
    data: {
      username: "Dates" + suffix,
      email: `dates${suffix}@example.com`,
      password: "UnaClaveLarga!2026",
      consent: true,
    },
  });
  expect(registered.ok()).toBeTruthy();
  for (const [date, steps, sleep, quality] of [
    ["2026-10-05", 7000, null, null],
    ["2026-10-06", 7500, null, null],
    ["2026-10-08", 5447, 6.5, 88],
    ["2026-10-09", null, 7 + 7 / 60, 96],
  ] as const) {
    const saved = await page.request.put(`/api/days/${date}`, {
      headers,
      data: { ...emptyDay(), steps, sleep, quality },
    });
    expect(saved.ok()).toBeTruthy();
  }
  await page.goto("/");
  await page.getByRole("button", { name: "Evolución", exact: true }).click();
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const name of ["Pasos", "Horas dormidas", "Calidad del sueño"]) {
      const chart = page.getByRole("region", {
        name: `Evolución de ${name}`,
        exact: true,
      });
      const labels = chart.locator("svg text").filter({hasText: /^\d{1,2} oct$/});
      await expect(labels.first()).toBeVisible();
      const text = await labels.allTextContents();
      expect(text.length).toBeGreaterThan(1);
      expect(new Set(text).size).toBe(text.length);
      expect(
        text.every((label) =>
          ["5 oct", "6 oct", "8 oct", "9 oct"].includes(label),
        ),
      ).toBeTruthy();
    }
  }
});
