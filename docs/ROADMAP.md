# Roadmap y estado — 9 de octubre de 2026

Estamos en la revisión y estabilización del MVP implementado. Las fases posteriores son propuestas de agrupación, sin fechas ni prioridad definitiva acordadas.

## 1. Definición — completada

Objetivo y alcance acordados: registro personal sencillo desde móvil y ordenador, datos opcionales, consulta visual y sustitución del tracking diario del Excel. Las decisiones se conservan en [MVP.md](MVP.md).

## 2. Implementación del MVP — funcionalidad principal completada

- Diario con comidas, valoración de dieta, fuerza, actividades adicionales, pasos, oficina, sueño, cuatro indicadores y notas.
- Autoguardado y edición de días pasados.
- Calendario y gráficas con rangos configurables y visibilidad por indicador.
- Evolución de los siete datos numéricos del diario: cuatro indicadores corporales, pasos, horas dormidas y calidad del sueño. Visibilidad configurable; las gráficas nuevas se activan también para cuentas existentes.
- Cuentas separadas, administración, bans, auditoría y borrado de cuentas.
- PostgreSQL y configuración de Next.js para Vercel.
- Instalación móvil como PWA incorporada al MVP el 10 de octubre, con iconos y modo independiente. Requiere conexión; prueba de instalación en móvil pendiente. Instrucciones en [PWA.md](PWA.md).
- Recuperación por correo implementada pero opcional; deshabilitada sin SMTP por decisión del usuario.

Compilación y pruebas locales pasan. El usuario ha mostrado la aplicación desplegada; no se ha verificado desde esta sesión el recorrido completo contra la base de producción.

## 3. Revisión UX y estabilización — fase actual

Ya incorporado: diseño Stitch, contexto completo de dieta, una comida por tipo y día, sueño en horas/minutos, cinco comidas opcionales clicables, iconos por comida y actividad, preselecciones de actividad física, resumen mensual y barra de periodos de evolución.

Pendiente para cerrar el MVP:

- Revisar y aceptar las pantallas con uso real; diario, calendario y evolución siguen en revisión, junto con opciones y administración.
- Verificar en producción registro, acceso, guardado, recarga, uso desde otro dispositivo y separación de cuentas.
- Verificar operaciones administrativas y borrado en la base real utilizando cuentas de prueba.
- Confirmar configuración operativa de base de datos, administrador, contacto de privacidad y copias de seguridad.
- Comprobar que el uso diario y la revisión de un mes resultan cómodos para el usuario.

Validación del usuario el 9 de octubre: diario completado (datos opcionales, autoguardado y edición día a día de fechas pasadas y futuras); comidas con descripción/tipo/valoración; calendario con colores y consulta diaria; fuerza con nombre libre/sugerencias; otras actividades múltiples. Estos bloques quedan aceptados funcionalmente, sin impedir futuras mejoras de UX. La ampliación a todas las gráficas numéricas se incorpora al MVP; su revisión por el usuario queda pendiente.

SMTP no bloquea este cierre; activar recuperación será una decisión posterior.

## 4. Comodidad y reutilización — propuesta posterior

Comidas predefinidas con descripción/color, reutilización avanzada, edición de varios días, pantalla inicial configurable, exportación y acceso vinculado con Google. Importación de histórico solo si aporta valor sin comprometer el modelo.

## 5. Hábitos y seguimiento ampliado — propuesta posterior

Hábitos y objetivos, rutinas frecuentes, meditación y otras actividades a concretar, niko-niko, indicadores personalizados, umbrales y avisos visuales. Gamificación después de definir qué objetivos incentivar.

## 6. Métricas e integraciones — propuesta posterior

Detalle opcional de natación (distancia, tiempo, ritmo) y de fuerza (ejercicios, series, repeticiones, cargas), e integraciones con relojes/básculas. Evitar convertir el registro básico en un formulario obligatorio extenso.

## 7. Análisis avanzado — propuesta posterior

Comparación de tendencias, relaciones entre hábitos y mediciones, avisos y posibles proyecciones. Requiere datos suficientes y definir cómo presentar resultados sin atribuir causas que los registros no demuestran.

## Siguiente paso

Terminar la revisión UX de las pantallas y validar el recorrido real del MVP antes de priorizar nuevas funciones. Las fases 4–7 no son compromisos de implementación ni una secuencia cerrada.
