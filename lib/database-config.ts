type Env = Record<string, string | undefined>;
export function databaseConfig(env: Env = process.env) {
  const url = env.DATABASE_URL?.trim() || env.POSTGRES_URL?.trim();
  if (!url) {
    if (env.VERCEL)
      throw new Error(
        "Configura DATABASE_URL o POSTGRES_URL con una conexión PostgreSQL en Vercel.",
      );
    return { kind: "sqlite" as const };
  }
  try {
    const parsed = new URL(url);
    if (
      !["postgres:", "postgresql:"].includes(parsed.protocol) ||
      !parsed.hostname ||
      !parsed.pathname ||
      parsed.pathname === "/"
    )
      throw new Error();
  } catch {
    throw new Error("La conexión debe ser una URL PostgreSQL válida.");
  }
  return { kind: "postgres" as const, url };
}
