import { databaseConfig } from "../lib/database-config";
import { init, query, closeDb } from "../lib/db";
import { schemaStatements } from "../lib/schema";
async function main() {
  const action = process.argv[2];
  if (!["setup", "check"].includes(action || ""))
    throw new Error("Usa db:setup o db:check.");
  const config = databaseConfig();
  if (config.kind !== "postgres")
    throw new Error(
      "Configura DATABASE_URL o POSTGRES_URL para comprobar la base de Vercel.",
    );
  if (action === "setup") await init();
  await query("SELECT 1 AS connected");
  // Check every expected table without reading any personal records.
  for (const statement of schemaStatements.filter((s) =>
    s.startsWith("CREATE TABLE"),
  )) {
    const table = statement.match(/EXISTS (\w+)/)![1];
    await query(`SELECT 1 FROM ${table} WHERE 1=0`);
  }
  console.log(
    action === "setup"
      ? "Esquema PostgreSQL inicializado."
      : "Conexión PostgreSQL y tablas verificadas.",
  );
}
main()
  .catch(() => {
    console.error(
      "No se pudo verificar PostgreSQL. Revisa la conexión, TLS, permisos y que se haya ejecutado db:setup. No se han mostrado credenciales.",
    );
    process.exitCode = 1;
  })
  .finally(closeDb);
