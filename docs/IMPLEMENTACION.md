# Implementación del MVP

## Estructura

- `app/page.tsx`: interfaz responsive, diario, calendario, evolución, opciones y administración.
- `app/api/[...path]/route.ts`: autenticación, recuperación, datos del usuario y moderación.
- `lib/model.ts`: validación y reglas del diario, colores y rangos.
- `lib/auth.ts`: sesiones, autorización y límites de intentos.
- `lib/db.ts`: persistencia local SQLite y adaptador PostgreSQL para Vercel, con conexiones limitadas y preparación transaccional del esquema.
- `lib/database-config.ts` y `lib/schema.ts`: selección por `DATABASE_URL`/`POSTGRES_URL` y esquema compartido.
- `scripts/database.ts`: comandos `db:setup` y `db:check`; pasos en `docs/VERCEL_DATABASE.md`.
- `scripts/admin.ts`: creación controlada del administrador.
- `tests/`: reglas de negocio y recorrido integrado de navegador/API.

## Decisiones de implementación

El diario guarda automáticamente tras una pausa de edición, muestra el estado confirmado por el servidor y permite reintentar errores. Al añadir una comida o actividad se guarda sin un segundo paso de confirmación. Las entradas aún no añadidas permanecen en el formulario; abandonar cambios pendientes pide confirmación. Durante una petición de guardado se evita cambiar de vista o fecha. El registro de fuerza es un nombre único por día; otras actividades son varios nombres, con sugerencias recientes privadas por usuario. Comidas y notas se editan dentro del día. Las fechas se seleccionan manualmente sin importación ni edición masiva.

Los cuatro indicadores y rangos se guardan por cuenta. Las gráficas respetan las fechas de las mediciones y muestran la franja de referencia. No generan interpretaciones ni proyecciones. Un indicador oculto conserva datos. Oficina tiene objetivo editable; Boza recibe ocho días y otras cuentas empiezan sin objetivo.

Se usa persistencia SQL con registros diarios JSON validados, clave única por usuario y fecha y claves foráneas para eliminación de datos asociados. Los rangos/configuración están separados del diario. El formato de datos es estable y ampliable; no se adapta al Excel.

## Configuración externa pendiente

Publicación, PostgreSQL real, SMTP real, dominio, información de privacidad y política de backups. El README recoge los pasos de operación y las limitaciones. No se han usado credenciales reales ni enviado mensajes a terceros.

## Verificación realizada

- TypeScript sin errores y compilación de producción correcta.
- Tres pruebas de reglas de negocio correctas: semáforo, validación y rangos/conteo mensual.
- Recorrido integrado Playwright correcto: diario persistente, calendario, gráficas, móvil sin desbordamiento, aislamiento de cuentas, rechazo de origen ajeno, límites, moderación con auditoría, bloqueo/desbloqueo y borrado de cuenta con registros/sesiones/tokens.
- Recuperación comprobada con SMTP simulado local: respuesta sin revelar existencia de la cuenta, entrega de enlace, token de un solo uso y revocación de sesiones. No se ha probado la entrega con un proveedor real.
- Revisión visual de capturas a 390 px y 1440 px.
- PostgreSQL y el despliegue Vercel están preparados en código, pendientes de validación contra servicios reales.
