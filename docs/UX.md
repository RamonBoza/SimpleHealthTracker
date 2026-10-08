# Adaptación de la propuesta Stitch

Referencia: ZIP `stitch_simplehealthtracker_mvp_ux.zip`, conservado extraído en `design/ux-reference/`. Contiene las pantallas de diario, calendario, evolución, opciones y administración y el sistema Calm Vitality.

## Cambios incorporados

- Paleta de fondos claros azulados, verde profundo, tarjetas suaves y controles con mayor contraste y zonas táctiles.
- Cabecera compacta con acceso a cuenta y estado real de cambios/guardado; navegación inferior en móvil y lateral en ordenador.
- Navegación semanal del diario y accesos rápidos a alimentación, peso y sueño.
- Comidas presentadas en tarjetas y selectores con el contexto completo de seguimiento de la dieta.
- Autoguardado online tras una pausa, confirmado por el servidor. Cambios durante una petición se guardan después sin descartarlos. Error visible, conservación en la pantalla y reintento; sin prometer persistencia offline.
- Calendario con símbolos además del color, detalle de las comidas del día seleccionado y acceso explícito a editarlo.
- Peso destacado en evolución, acceso a registrar un peso y enlace a personalizar rangos.
- Opciones con agrupación de indicadores y campos visualmente diferenciados.
- Administración con búsqueda de cuenta y presentación adaptable al móvil; se mantienen el motivo y la auditoría reales.

## Diferencias respecto al prototipo

El prototipo contiene datos ilustrativos y funciones que no están dentro del alcance acordado. No se incorporan integraciones Apple Health, exportación, notas de consulta, cuotas, invitaciones, roles de nutricionista/paciente ni afirmaciones de cumplimiento/cifrado/backups sin soporte operativo.

Los datos se introducen manualmente. La grasa visceral sigue en porcentaje según lo acordado, aunque el prototipo usa un índice. Se conservan las reglas de colores del calendario, comidas opcionales, nombres libres y un único historial de peso. No se cambia la regla sobre comidas repetidas sin una decisión del usuario. Las gráficas no incluyen interpretaciones ni proyecciones.

Las opciones y las operaciones administrativas conservan confirmación explícita, especialmente los cambios destructivos. El autoguardado se aplica al diario.
