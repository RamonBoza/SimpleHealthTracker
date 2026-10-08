# Base de datos en Vercel

La aplicación utiliza PostgreSQL al configurar `DATABASE_URL` o `POSTGRES_URL`. Si existen ambas, tiene prioridad `DATABASE_URL`. En Vercel se exige una conexión: nunca se guardan registros en SQLite dentro de una función.

## Configurar

El repositorio incluye `vercel.json` con el framework Next.js, el comando `npm run build` y la salida `.next`. Esta configuración sustituye los ajustes de compilación del panel. La raíz del proyecto en Vercel debe ser la raíz del repositorio, donde están `package.json` y `vercel.json`. No configures `public` como directorio de salida. Si aparece el error «No Output Directory named public», despliega el último commit que incluye esta configuración.

1. En el proyecto de Vercel, conecta una integración **PostgreSQL** de Storage/Marketplace. No sirve una base Redis o un almacén de archivos para este adaptador.
2. Copia o vincula la cadena de conexión del proveedor a `DATABASE_URL`, o conserva `POSTGRES_URL` si la integración ya la ha creado. Usa la conexión con pooling cuando el proveedor la ofrezca. Debe tener formato `postgresql://usuario:contraseña@host/base`.
3. Asigna la variable al entorno que corresponda. Usa bases o ramas independientes para Production y Preview para que las pruebas de despliegue no modifiquen datos reales.
4. Configura `APP_URL` con el origen HTTPS del entorno. Selecciona Node.js 24; el repositorio lo declara en `package.json`.
5. Vuelve a desplegar después de cambiar las variables. La compilación no necesita conectarse a la base; se inicializa al primer acceso o mediante el comando de preparación.

La conexión en Vercel usa TLS con verificación de certificado. La base debe aceptar conexiones desde las funciones y proporcionar una cadena compatible con el driver PostgreSQL. No se desactiva la verificación para solucionar errores de conexión.

## Preparar y comprobar las tablas

Para comprobar desde tu equipo la base configurada, guarda su conexión en `.env.local` (archivo excluido de Git) o en variables de entorno de tu terminal. No la pegues en el chat ni la incluyas en el repositorio.

```powershell
npm run db:setup
npm run db:check
```

`db:setup` crea las tablas e índices si no existen, sin borrar registros. La inicialización PostgreSQL utiliza una transacción y un bloqueo de esquema compartido para coordinar varias instancias. `db:check` verifica conectividad y existencia de tablas sin leer datos personales. Los comandos cierran la conexión al terminar y no muestran credenciales.

El usuario de conexión necesita permiso para crear tablas e índices y utilizar las tablas de la aplicación. La inicialización también se realiza al primer acceso a la API; por tanto esos permisos son necesarios con esta versión. Para una futura política de roles separados se podrá mover la inicialización a un proceso de migraciones.

## Administrador y registro

Tras preparar la base, crea el administrador con el procedimiento del README, utilizando la misma conexión PostgreSQL. No se crea un administrador mediante el registro público.

Conectar la base no basta para abrir el registro en Vercel: también deben configurarse `DATA_CONTROLLER` y `PRIVACY_CONTACT`. El correo de recuperación (`SMTP_*`) es opcional; sin SMTP se permite crear cuentas y la recuperación queda deshabilitada. Los detalles están en el README.

## Datos locales

Sin conexión configurada, el desarrollo local sigue usando `data/health.sqlite`. Al configurar PostgreSQL se utiliza un almacenamiento distinto: los usuarios y registros de SQLite no se trasladan automáticamente. Los comandos de preparación no importan, borran ni convierten tus datos locales.

## Referencias oficiales

- [PostgreSQL en Vercel](https://vercel.com/docs/postgres).
- [Integraciones de almacenamiento](https://vercel.com/docs/marketplace-storage).
- [Versiones de Node.js](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

La conexión a tu proveedor real queda pendiente hasta disponer de su configuración; las pruebas automáticas se mantienen aisladas en SQLite.
