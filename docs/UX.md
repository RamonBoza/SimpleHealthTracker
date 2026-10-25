# Adaptación de la propuesta Stitch

Referencia: ZIP `stitch_simplehealthtracker_mvp_ux.zip`, conservado extraído en `design/ux-reference/`. Contiene las pantallas de diario, calendario, evolución, opciones y administración y el sistema Calm Vitality.

## Cambios incorporados

- Revisión móvil del 25 de octubre de «Tu año»: mapa a la izquierda con inicial de cada mes, nombre completo accesible y líneas en los cambios de mes; leyenda, recuentos e instrucciones a la derecha. Se elimina el bloque de texto superior y se conserva el carácter de solo lectura y el mapa completo en una vista.

- «Tu año» se confirma como representación exclusivamente visual y de lectura: casillas sin interacción y sin panel de detalle diario. Solo se elige el año; consulta y edición permanecen en Calendario/Diario. Base para futuras representaciones anuales de evolución.

- Ajuste posterior del 24 de octubre: «Tu año» pasa a ser una sección independiente en la navegación. El mapa conserva siete columnas y semanas verticales, con casillas pequeñas ajustadas a la altura de pantalla para consultar el año de un vistazo; el calendario mensual queda separado.

- Vista anual de alimentación (24 de octubre): selector Mes/Año, siete columnas de lunes a domingo y semanas continuas en vertical, etiquetas de meses, colores de dieta y detalle al seleccionar un día. Los futuros sin comidas tienen borde discontinuo; los registros existentes conservan su color. Incluye selector de año y años bisiestos. Solo alimentación en esta primera versión, sin objetivos nuevos.

- Paleta de fondos claros azulados, verde profundo, tarjetas suaves y controles con mayor contraste y zonas táctiles.
- Cabecera compacta con acceso a cuenta y estado real de cambios/guardado; navegación inferior en móvil y lateral en ordenador.
- Navegación semanal del diario y accesos rápidos a alimentación, peso y sueño.
- Comidas presentadas en tarjetas y selectores con el contexto completo de seguimiento de la dieta.
- Cinco accesos de comidas opcionales, con iconos distintos y edición directa; acceso adicional a otra comida o snack. El estado de dieta sigue expresado en texto y color.
- Actividad física con sugerencias clicables de fuerza y actividades, iconos según el tipo y nombres libres conservados.
- Autoguardado online tras una pausa, confirmado por el servidor. Cambios durante una petición se guardan después sin descartarlos. Error visible, conservación en la pantalla y reintento; sin prometer persistencia offline.
- Calendario con símbolos además del color, detalle de las comidas del día seleccionado y acceso explícito a editarlo.
- Resumen del mes completo con días verdes, parciales, fuera de dieta y sin comidas registradas; los días futuros del mes cuentan como sin registro. El detalle reutiliza los iconos propios de cada comida.
- Peso destacado en evolución, acceso a registrar un peso y enlace a personalizar rangos.
- Periodos de evolución seleccionables mediante una barra de botones (1, 3 y 6 meses, 1 año y todo el historial).
- Gráficas de pasos, duración y calidad del sueño, visibles por defecto y configurables desde Opciones sin borrar registros. Duración presentada en horas/minutos; rangos reservados a los indicadores corporales.
- Opciones con agrupación de indicadores y campos visualmente diferenciados.
- Administración con búsqueda de cuenta y presentación adaptable al móvil; se mantienen el motivo y la auditoría reales.

## Diferencias respecto al prototipo

Actualización del 12 de octubre: referencia adicional en `design/ux-reference/calendar-2026-10-12/code.html`. Se incorporan vistas general/nutrición/salud, filtros de días por valoración nutricional, resumen compacto con porcentajes sobre días con comidas y datos reales del día seleccionado (sueño, calidad, pasos, actividad y peso). El usuario confirma que todos los datos siguen opcionales: no hay puntuación de completitud ni datos pendientes obligatorios. Se omiten textos clínicos generados, correlaciones y exportación PDF, que no están implementados. Se mantiene el zoom manual y el tamaño de campos corregido para móvil.

El prototipo contiene datos ilustrativos y funciones que no están dentro del alcance acordado. No se incorporan integraciones Apple Health, exportación, notas de consulta, cuotas, invitaciones, roles de nutricionista/paciente ni afirmaciones de cumplimiento/cifrado/backups sin soporte operativo.

Los datos se introducen manualmente. La grasa visceral sigue en porcentaje según lo acordado, aunque el prototipo usa un índice. Se conservan las reglas de colores del calendario, comidas opcionales, nombres libres y un único historial de peso. Por decisión del usuario, cada tipo de comida tiene una única entrada por día: seleccionarlo de nuevo permite editarla. El sueño se introduce en horas y minutos separados. Las gráficas no incluyen interpretaciones ni proyecciones.

Las opciones y las operaciones administrativas conservan confirmación explícita, especialmente los cambios destructivos. El autoguardado se aplica al diario.
