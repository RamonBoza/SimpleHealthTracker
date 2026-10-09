import { z } from "zod";
export const indicators = [
  { key: "weight", name: "Peso", unit: "kg", min: 82, max: 92, limit: 500 },
  { key: "fat", name: "Masa grasa", unit: "%", min: 11, max: 22, limit: 100 },
  {
    key: "muscle",
    name: "Masa muscular",
    unit: "%",
    min: 33,
    max: 40,
    limit: 100,
  },
  {
    key: "visceral",
    name: "Grasa visceral",
    unit: "%",
    min: 1,
    max: 9,
    limit: 100,
  },
] as const;
export type IndicatorKey = (typeof indicators)[number]["key"];
export const colors = ["green", "yellow", "red"] as const;
export const meals = [
  "Desayuno",
  "Media mañana",
  "Comida",
  "Merienda",
  "Cena",
  "Otra",
] as const;
const optionalNumber = (max: number) =>
  z.number().finite().min(0).max(max).nullable();
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((v) => {
    const d = new Date(v + "T12:00:00Z");
    return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
  }, "Fecha inválida");
export const daySchema = z.object({
  meals: z
    .array(
      z.object({
        id: z.string().uuid(),
        type: z.enum([
          "Desayuno",
          "Media mañana",
          "Comida",
          "Merienda",
          "Cena",
          "Otra",
        ]),
        text: z.string().trim().max(1500),
        color: z.enum(colors),
      }),
    )
    .max(30),
  strength: z.string().trim().max(100),
  activities: z.array(z.string().trim().min(1).max(100)).max(30),
  office: z.enum(["yes", "no", "unset"]),
  steps: optionalNumber(200000).refine(
    (v) => v === null || Number.isInteger(v),
  ),
  sleep: optionalNumber(24),
  quality: optionalNumber(100).refine((v) => v === null || Number.isInteger(v)),
  weight: optionalNumber(500),
  fat: optionalNumber(100),
  muscle: optionalNumber(100),
  visceral: optionalNumber(100),
  notes: z.string().trim().max(5000),
});
export type Day = z.infer<typeof daySchema>;
export const emptyDay = (): Day => ({
  meals: [],
  strength: "",
  activities: [],
  office: "unset",
  steps: null,
  sleep: null,
  quality: null,
  weight: null,
  fat: null,
  muscle: null,
  visceral: null,
  notes: "",
});
export function dailyColor(day: Day) {
  if (!day.meals.length) return null;
  return day.meals.some((m) => m.color === "red")
    ? "red"
    : day.meals.some((m) => m.color === "yellow")
      ? "yellow"
      : "green";
}
const rangeSchema = z
  .object({
    min: z.number().finite().min(0),
    max: z.number().finite().min(0),
    visible: z.boolean(),
  })
  .refine((v) => v.min < v.max, "El mínimo debe ser menor que el máximo");
export const settingsSchema = z
  .object({
    officeGoal: z.number().int().min(0).max(31),
    ranges: z.object({
      weight: rangeSchema,
      muscle: rangeSchema,
      fat: rangeSchema,
      visceral: rangeSchema,
    }),
  })
  .superRefine((s, ctx) => {
    for (const i of indicators)
      if (s.ranges[i.key].max > i.limit)
        ctx.addIssue({
          code: "custom",
          path: ["ranges", i.key, "max"],
          message: "Rango fuera de límites",
        });
  });
export type Settings = z.infer<typeof settingsSchema>;
export const defaultSettings = (boza = false): Settings => ({
  officeGoal: boza ? 8 : 0,
  ranges: Object.fromEntries(
    indicators.map((i) => [i.key, { min: i.min, max: i.max, visible: true }]),
  ) as Settings["ranges"],
});
export function localDate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function officeCount(days: Record<string, Day>, month: string) {
  return Object.entries(days).filter(
    ([date, day]) => date.startsWith(month) && day.office === "yes",
  ).length;
}
