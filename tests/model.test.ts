import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import {
  dailyColor,
  emptyDay,
  daySchema,
  dateSchema,
  defaultSettings,
  settingsSchema,
  officeCount,
} from "../lib/model";
test("semáforo diario: vacío, una verde, varias amarillas y una roja", () => {
  const day = emptyDay();
  assert.equal(dailyColor(day), null);
  day.meals.push({
    id: randomUUID(),
    type: "Desayuno",
    text: "Café",
    color: "green",
  });
  assert.equal(dailyColor(day), "green");
  day.meals.push({
    id: randomUUID(),
    type: "Cena",
    text: "Cena",
    color: "yellow",
  });
  assert.equal(dailyColor(day), "yellow");
  day.meals.push({
    id: randomUUID(),
    type: "Otra",
    text: "Otra",
    color: "yellow",
  });
  assert.equal(dailyColor(day), "yellow");
  day.meals[0].color = "red";
  assert.equal(dailyColor(day), "red");
});
test("valores opcionales, límites y fechas reales", () => {
  assert.ok(daySchema.safeParse(emptyDay()).success);
  for (const patch of [
    { quality: 101 },
    { quality: 50.5 },
    { sleep: 25 },
    { steps: -1 },
    { fat: 101 },
    { weight: Infinity },
    { activities: [""] },
    { strength: "a".repeat(101) },
  ])
    assert.equal(
      daySchema.safeParse({ ...emptyDay(), ...patch }).success,
      false,
    );
  assert.ok(dateSchema.safeParse("2024-02-29").success);
  assert.equal(dateSchema.safeParse("2026-02-29").success, false);
  assert.equal(dateSchema.safeParse("2026-13-01").success, false);
});
test("rangos propios editables y conteo mensual de oficina", () => {
  const settings = defaultSettings(true);
  assert.equal(settings.officeGoal, 8);
  assert.equal(defaultSettings().officeGoal, 0);
  settings.ranges.fat.min = 30;
  assert.equal(settingsSchema.safeParse(settings).success, false);
  const days = {
    "2026-10-01": { ...emptyDay(), office: "yes" as const },
    "2026-10-02": { ...emptyDay(), office: "no" as const },
    "2026-09-01": { ...emptyDay(), office: "yes" as const },
  };
  assert.equal(officeCount(days, "2026-10"), 1);
});
