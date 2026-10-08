# SimpleHealthTracker

MVP de diario de salud: comidas y calendario de colores, fuerza y otras actividades, pasos, oficina, sueño, cuatro indicadores con gráficas y rangos editables, cuentas y administración.

## Arranque local

Requisitos: Node.js 24 o superior y npm.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Abre http://localhost:3000 y crea tu cuenta. Localmente los datos persisten en `data/health.sqlite`, que no se incluye en Git. No hay usuarios ni contraseñas predeterminados. Configura `APP_URL` con la URL exacta utilizada en el navegador; se valida el origen de las operaciones de escritura.

La recuperación por correo necesita SMTP real. Sin configurarlo, la aplicación indica que la recuperación no está disponible y nunca muestra ni registra tokens de recuperación.

## Cuenta administradora

En `.env.local`, configura `ADMIN_EMAIL`, `ADMIN_USERNAME` y una `ADMIN_PASSWORD` de 12–72 caracteres. Ejecuta:

```powershell
npm run admin:create
```

Después retira `ADMIN_PASSWORD` del archivo. El comando crea una cuenta nueva; no eleva cuentas ya registradas ni concede privilegios automáticamente por correo. No compartas esta cuenta. La administración permite consultar registros con un motivo, bloquear temporal o indefinidamente, desbloquear y borrar usuarios; las acciones quedan auditadas. No se permite moderar otras cuentas administradoras desde la web.

## Datos y acceso

- Identidad interna UUID separada del usuario/correo, preparada para añadir proveedores de acceso en una fase posterior.
- Contraseñas bcrypt, sesiones opacas almacenadas como hashes y cookies HttpOnly/SameSite. Cookie segura en producción.
- Datos asociados a la cuenta en todas las consultas; validación de fechas, límites y tamaño; consultas SQL parametrizadas; límites de intentos de autenticación y recuperación.
- Los bloqueos revocan sesiones; la recuperación revoca sesiones y tokens anteriores.
- Un valor por indicador y fecha. El sueño corresponde al día del despertar.
- Se borran cuenta, registros, sesiones y tokens por cascada. Los identificadores de la cuenta en auditoría se desvinculan al borrar; los motivos deben evitar datos personales o clínicos.
- Los registros de auditoría no incluyen una copia del contenido consultado.

Los rangos iniciales de indicadores proceden del Excel de Boza. Cada usuario puede modificarlos; no son recomendaciones médicas universales.

## Despliegue en Vercel

La configuración de la base, inicialización y comprobación se explican en [docs/VERCEL_DATABASE.md](docs/VERCEL_DATABASE.md). Se admite `DATABASE_URL` o `POSTGRES_URL` y están disponibles `npm run db:setup` y `npm run db:check`.

El código está preparado para Next.js en Vercel, pero no se ha publicado. Necesita:

1. PostgreSQL persistente y su `DATABASE_URL`, con la configuración TLS del proveedor. En Vercel se exige PostgreSQL: no se usa SQLite en el sistema de archivos efímero.
2. `APP_URL` con el dominio HTTPS del despliegue.
3. `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` y `SMTP_FROM` para recuperar contraseñas.
4. `DATA_CONTROLLER` y `PRIVACY_CONTACT` con información real.
5. Crear el administrador mediante el comando anterior contra esa base de datos.

Las tablas se inicializan al primer acceso. El adaptador PostgreSQL está implementado; las pruebas locales usan SQLite. Verifica el proveedor PostgreSQL y la entrega SMTP antes de abrir el servicio. El registro en Vercel se bloquea si faltan responsable, contacto o servidor SMTP.

## Privacidad y operación

La implementación incluye consentimiento explícito de salud, información de privacidad, borrado propio con contraseña y acceso administrativo justificado. Esto no certifica cumplimiento del RGPD. Antes de admitir datos de terceros, concreta y revisa:

- Bases jurídicas, información del responsable y condiciones del servicio; proveedores, encargados y transferencias internacionales.
- Plazos de conservación de cuentas bloqueadas, auditoría y copias de seguridad; proceso de restauración que no reactive cuentas borradas.
- Procedimiento para solicitudes de acceso, rectificación, retirada del consentimiento, supresión y portabilidad aplicable, también para usuarios bloqueados. Exportar desde la interfaz queda fuera del MVP, pero atender derechos no.
- Protección y acceso al servidor/base de datos, copias de seguridad y política de incidentes.

El código borra datos activos. El vencimiento de backups depende del proveedor y debe configurarse y documentarse. En local SQLite usa borrado seguro; sus archivos WAL/copias también requieren una política de conservación. No se promete borrar instantáneamente todas las copias.

## Validación

```powershell
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Las pruebas de navegador usan un servidor separado en el puerto 3100 y datos de prueba en `data/e2e`. Comprueban persistencia, calendario, visualización móvil sin desbordamiento, aislamiento de cuentas, rechazo de orígenes ajenos, límites, recuperación de un solo uso, bloqueos, auditoría y borrado en cascada. No envían correo real.

El alcance y las ideas para fases posteriores se conservan en [docs/MVP.md](docs/MVP.md).

La adaptación de las pantallas de Stitch se documenta en [docs/UX.md](docs/UX.md). El diario guarda automáticamente al añadir entradas o tras una pausa de edición; muestra estados reales de guardado y permite reintentar errores. Las opciones mantienen su botón de guardado explícito. Las pruebas del autoguardado cubren fallos y cambios durante una petición. El servidor de pruebas usa `.next-e2e` para poder ejecutarse sin interrumpir el servidor local habitual.
