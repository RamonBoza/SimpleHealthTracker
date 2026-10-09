# SimpleHealthTracker — alcance del MVP

Estado: MVP implementado, en revisión UX y estabilización a 9 de octubre de 2026. Las decisiones posteriores quedan conservadas para definir las fases. Estado y próximos pasos en [ROADMAP.md](ROADMAP.md).

## Objetivo

Registrar datos de salud fácilmente y consultarlos de forma visual, por ejemplo para mostrar a la nutricionista la alimentación del mes. Web con conexión a internet, adaptable al móvil y al ordenador, incluidas pantallas alargadas. El diario de hoy será la pantalla inicial y el panel de evolución será accesible mediante un botón.

## Decisiones confirmadas para el MVP

### Diario

Todos los datos de salud son opcionales y tienen frecuencias independientes. Se permite registrar al momento, completar después y añadir, editar o eliminar datos de fechas pasadas navegando día a día. Se empieza sin importar Excel: el histórico puede introducirse manualmente. No hay edición masiva ni estado de día completado. Sin registrar no equivale a cero o a no.

### Alimentación

- Comidas con descripción libre y tipo (desayuno, media mañana, comida, merienda, cena u otra).
- Una entrada por tipo de comida y día. Seleccionar un tipo ya registrado carga su descripción y color para actualizarlo sin duplicarlo.
- Valoración manual: verde (sigue la dieta), amarillo (parcialmente) y rojo (se sale de ella).
- Color diario calculado: verde si todas las comidas registradas son verdes; amarillo si hay alguna amarilla y ninguna roja; rojo si hay alguna roja; sin color cuando no hay registros.
- Un único desayuno verde basta para mostrar el día verde. No se exige registrar todas las comidas ni un número concreto.
- Calendario mensual con colores como visualización suficiente de alimentación para el MVP.
- Sin fotos, calorías, macronutrientes ni valoración automática.

### Actividad, pasos y oficina

- Fuerza: una rutina por día con nombre libre (pushA, pullA, legs, push+pull, full body u otro), o vacío si no se ha hecho. Sin detalle de ejercicios, cargas, series ni repeticiones.
- Fuerza y natación pueden coexistir el mismo día.
- Otras actividades físicas: varias por día, con nombre libre; natación, caminar, correr, escalada y otras. Sin distancia, duración o ritmo.
- Los nombres de fuerza y otras actividades ofrecen opciones recientes del propio usuario al enfocar el campo y sugerencias de nombres previos similares al escribir. Seleccionar es opcional: siempre se puede introducir un nombre nuevo. No se crean catálogos ni plantillas completas de rutinas en el MVP.
- Pasos: total diario introducido manualmente.
- Oficina: sí / no / sin registrar, indicando asistencia presencial.
- Contador y progreso visual mensual respecto a un objetivo editable por usuario; ocho días como objetivo inicial para la cuenta del usuario.

### Sueño

Horas dormidas y calidad introducidas manualmente. La calidad es la puntuación calculada por el Apple Watch del usuario, de 0 a 100; la web no la calcula ni importa automáticamente.

El sueño se asigna a la fecha del despertar: el 8 de octubre contiene la noche del 7 al 8, aunque se empiece a dormir después de medianoche. Sin siestas en el MVP.

La duración se introduce en horas y minutos separados (0–59 minutos). Introducir solo horas equivale a cero minutos. El almacenamiento conserva horas decimales para mantener la compatibilidad con los registros existentes.

### Indicadores y evolución

Cuatro indicadores fijos, con último valor, estado dentro/fuera del rango y gráfica de evolución con la franja de referencia claramente visible:

| Indicador | Unidad | Rango inicial |
| --- | --- | --- |
| Masa grasa | % | 11–22 |
| Masa muscular | % | 33–40 |
| Grasa visceral | % | 1–9 |
| Peso | kg | 82–92 |

Las unidades de composición corporal son las confirmadas por el usuario según su nutricionista. Los rangos proceden de su Excel, no son valores universales de la aplicación, y son editables por usuario.

- Mediciones de consulta aproximadamente cada dos meses, sin exigir esa frecuencia.
- Un único historial de peso, sin distinguir consultas o dispositivos ni marcar muestras de consulta. Puede tener registros diarios y una gráfica más detallada, con un único valor por día, corregible.
- Se pueden mostrar u ocultar los indicadores del panel. Ocultar conserva el histórico y permite seguir registrando.
- No hay textos interpretando acercamiento al rango: la tendencia se observa visualmente.
- Las gráficas usan valores reales y sus fechas; no se inventan datos para los huecos.
- Actualización del 9 de octubre: todos los datos numéricos registrados en el diario aparecen en Evolución. Se añaden pasos, horas dormidas y calidad del sueño a los cuatro indicadores corporales. Todas las gráficas están visibles por defecto y se pueden ocultar desde Opciones sin eliminar registros. Las preferencias existentes de los indicadores corporales se conservan. Los nuevos datos no incorporan umbrales ni rangos automáticos.

### Cuentas y administración

- Registro abierto a quien acceda a la URL, con usuario, correo y contraseña.
- Recuperación de contraseña mediante el correo asociado cuando se configura SMTP. Por decisión posterior del usuario, SMTP es opcional y sin él se deshabilita la recuperación sin bloquear el registro.
- Datos privados y separados por usuario, persistentes y accesibles desde sus dispositivos.
- Cuenta administradora específica para consultar contenido en casos justificados de soporte o moderación, con motivo y registro de acceso, y borrar o banear usuarios. Ban temporal o indefinido; borrado de cuenta y registros asociados.
- Identidad interna estable, independiente del método de acceso, para vincular Google u otros proveedores en el futuro sin duplicar cuentas ni perder el historial.
- Google y otros proveedores no se implementan en el MVP.

## Fuera del MVP: decisiones conservadas para futuras fases

Esta lista no fija todavía prioridades ni compromete todas las funciones.

| Funcionalidad | Intención o decisión |
| --- | --- |
| Fotos de comidas | Retiradas del MVP para reducir almacenamiento y complejidad |
| Comidas y rutinas predefinidas | Reutilizar descripción y valoración; permitir modificaciones |
| Reutilización avanzada | Comidas y plantillas completas quedan para después; sugerencias de nombres de actividades sí entran en el MVP |
| Valoración automática de comidas | Posible evolución; manual en el MVP |
| Detalle de fuerza | Ejercicios, cargas, series y repeticiones opcionales; gráficas de progresión |
| Detalle de natación | Distancia, duración y cálculo de ritmo por 100 metros |
| Rutinas frecuentes | Movilidad, barra, caminata por intervalos, sentadillas, estiramientos, cardio y cargas, como en la imagen aportada |
| Otros hábitos | Meditación, yoga, mindfulness y posiblemente lectura; revisar su encaje con el foco de salud |
| Hábitos a conseguir | Definir hábitos y objetivos personales y seguir su cumplimiento; fuera del MVP |
| Gamificación | Impulsar objetivos y constancia en los hábitos; mecánicas y prioridades por definir después del MVP |
| Indicadores personalizados | Crear, quitar y destacar indicadores adicionales |
| Límites para cualquier dato | Configurar thresholds y mostrar una advertencia visual fuera del rango |
| Análisis de tendencias | Comparar alimentación, oficina, actividad, sueño y evolución corporal |
| Avisos de hábitos | Identificar cambios relevantes; definir posteriormente su interpretación |
| Proyecciones | Posibles escenarios de evolución |
| Edición de varios días | Mejora de comodidad; deseable antes de compartir ampliamente con amigos |
| Exportación | CSV u otros formatos |
| Importación de histórico | No necesaria al empezar; no comprometer la estructura por el Excel |
| Integraciones | Relojes, básculas y otras fuentes; primero registro manual |
| Acceso federado | Vincular Google u otros proveedores a la cuenta existente |
| Pantalla inicial configurable | Idea propuesta, pendiente de priorizar |
| Resúmenes adicionales | Estadísticas de alimentación, actividad y otras variables |

No se han acordado funciones sociales, recomendaciones de dieta o entrenamiento ni un portal profesional para varios pacientes.

## Pendientes para cerrar la entrevista

- Administración funcional ya confirmada: acceso justificado registrado, bloqueo temporal o indefinido reversible y eliminación de cuenta y registros. Queda por cerrar la política operativa de conservación y backups.
- Concretar precisión decimal y límites de valores. Ya se ha confirmado un único valor por indicador y día, editable.
- Elegir arquitectura, almacenamiento y despliegue. Vercel es la plataforma mencionada, todavía sin diseño técnico acordado.

## Criterios de aceptación

- Registrar cada dato independientemente y con comodidad desde móvil y ordenador.
- Abrir el diario de hoy y poder consultar o corregir días pasados.
- Todos los datos de salud son opcionales y ausencia de datos se distingue de una respuesta negativa.
- Aplicar correctamente el color diario incluso con una única comida.
- Registrar fuerza y natación el mismo día, junto con pasos y oficina.
- Contar correctamente los días de oficina del mes.
- Asignar sueño al día del despertar y admitir calidad de 0 a 100.
- Mostrar las cuatro gráficas con rangos editables y visibles.
- Ocultar indicadores sin borrar sus valores y mantener un único historial de peso.
- Conservar datos privados por cuenta y permitir recuperación de contraseña por correo.
- Permitir administración y moderación conforme a las reglas que se concreten.

## Próximo paso

Resolver los puntos pendientes, revisar el alcance y definir las fases del producto a partir del registro de decisiones anterior.

## Administración y privacidad — actualización de la entrevista

Decisiones confirmadas:

- Ban temporal o indefinido: bloquea el acceso, sin equivaler a borrar la cuenta. El bloqueo temporal requiere fecha de fin; el indefinido puede levantarse manualmente.
- Borrar un usuario permite eliminar su cuenta y los registros asociados.
- El administrador puede consultar contenido ante un caso concreto de moderación o soporte, dejando registrado el motivo y el acceso. Esta regla ha sido confirmada por el usuario. No se revisan historiales por defecto ni se concede acceso ilimitado para cualquier finalidad.
- El cumplimiento del RGPD forma parte del diseño antes de abrir el servicio a terceros.

Propuesta de diseño pendiente de validar:

- Implementar el acceso administrativo confirmado con permisos limitados, motivo y registro de accesos; informar de esta finalidad en la política de privacidad.
- Información de privacidad clara sobre responsable, finalidades, proveedores, acceso administrativo, conservación y derechos.
- Determinar base jurídica del artículo 6 y condición del artículo 9 para los datos de salud. Evaluar consentimiento explícito, específico e informado, separado de aceptar condiciones generales.
- Facilitar solicitudes de acceso, rectificación, supresión y, cuando corresponda, portabilidad, incluso desde cuentas bloqueadas.
- La exportación de producto sigue fuera del MVP, pero debe existir un procedimiento para atender los derechos aplicables; no hace falta una interfaz CSV para ello.
- Definir eliminación en base de datos, sesiones y sistemas asociados, y vencimiento de copias de seguridad. No prometer borrado instantáneo de backups; impedir que una restauración reactive datos ya suprimidos.
- Definir conservación durante bans, protección de datos, proveedores y posibles transferencias internacionales antes de habilitar registros de terceros.

Referencias oficiales consultadas el 7 de octubre de 2026:

- RGPD, especialmente artículos 5, 6, 9, 12–20, 25, 28 y 32: https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng/
- EDPB, fundamentos de protección de datos: https://www.edpb.europa.eu/sme/learn-the-basics/data-protection-basics_en
- EDPB, derechos de las personas: https://www.edpb.europa.eu/topics/key-gdpr-concepts/data-subject-rights_en

Estas referencias orientan los requisitos y no certifican por sí solas la conformidad del servicio.

## Cierre de diario y actividad — decisiones confirmadas

Estas decisiones sustituyen las propuestas anteriores sobre selección de fuerza y natación:

- Fuerza: una única rutina por día o campo vacío si no se ha realizado. Nombre libre para permitir pushA, pullA, legs, push+pull, full body u otras denominaciones. La aplicación no prescribe qué rutina realizar. No hay múltiples rutinas de fuerza en el mismo día ni detalle de ejercicios en el MVP.
- Aeróbico / actividad adicional: sección independiente que permite varias actividades por día, como natación, Japanese walking, walking, correr o escalada. Se mantiene la denominación de sección pendiente de revisar para que abarque actividades como escalada. En el MVP se registra la actividad, sin métricas deportivas detalladas. Natación pasa a ser una opción de esta sección y puede coexistir con fuerza y otras actividades.
- La petición más reciente usa el campo vacío de fuerza como no haber hecho, sin un selector adicional de sí/no. Para actividades adicionales queda por concretar si se distingue explícitamente ninguna actividad de ausencia de registro.
- Objetivo de oficina editable por usuario, con ocho días como valor inicial para la cuenta del usuario. Mostrar progreso visual mensual para ver cuánto falta para alcanzar el objetivo. No asignar obligatoriamente ocho días a otras cuentas.
- Un único valor por indicador y día, corregible; sin múltiples pesajes diarios.
- Campo opcional de notas generales del día.
- Niko-niko: idea posterior al MVP para registrar estado de ánimo o sensación del día; formato y escala pendientes de definir.

Pendientes anteriores ya resueltos: selección única de fuerza con nombre libre, objetivo editable de oficina, notas generales y una medición diaria por indicador. Se descarta marcar un peso como muestra de consulta.

## Sugerencias de nombres — decisión confirmada

El MVP admite texto libre para los nombres de actividades, mostrando las opciones recientes del usuario al enfocar el campo y nombres ya registrados similares mientras escribe. Las sugerencias permiten selección rápida sin imponer un nombre ni reutilizar métricas. Esta comodidad entra en el MVP; las plantillas de comidas y rutinas completas siguen fuera. Todos los pesajes comparten un historial, sin diferenciar dispositivos ni consultas: interesa la evolución global.

## Relación con el Excel actual — cierre de alcance

El MVP sustituye el registro diario y el seguimiento de métricas de la nutricionista. No necesita sustituir todas las pestañas del Excel para resultar útil.

| Parte del Excel | Alcance acordado |
| --- | --- |
| Tracking diario | Incluido |
| Métricas de nutricionista | Incluidas, con gráficas y rangos |
| Rutinas de fuerza con series, repeticiones y pesos | Fuera del MVP; solo nombre de una rutina diaria |
| Rutinas diarias como Japanese walking, bar hangs o world greatest stretch | Se puede registrar el nombre como actividad; sin instrucciones, niveles ni programación de rutinas |
| Hábitos a conseguir | Fase posterior |
| Gamificación para impulsar objetivos y hábitos | Fase posterior |

Mantener el Excel u otra herramienta para consultar rutinas detalladas durante el MVP es compatible con el objetivo. No se amplía el alcance para cubrirlas. Las futuras fases de hábitos y gamificación deben preservar la sencillez del registro.

## Adaptación UX de Stitch

La interfaz se adapta al diseño aportado en `stitch_simplehealthtracker_mvp_ux.zip`. El diario incorpora autoguardado online con confirmación del servidor y reintento; navegación semanal y accesos rápidos. El calendario permite consultar las comidas del día seleccionado antes de abrir su edición. Evolución destaca el peso y muestra los límites de referencia en las gráficas. Las diferencias respecto al prototipo y el alcance preservado se detallan en [UX.md](UX.md).
