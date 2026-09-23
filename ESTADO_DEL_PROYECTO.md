# Estado del proyecto — Curso interactivo de Operaciones E-commerce (Perú)

Este documento es el traspaso completo para continuar el proyecto en otro chat.
Léelo entero antes de tocar código: explica la arquitectura, el orden de build,
las convenciones de contenido y qué falta.

## 0. Qué es esto

Un curso interactivo de una sola página HTML (auto-contenido, sin backend) para
preparar a Valentino (estudiante de sistemas con tendencia industrial, en Lima,
Perú, ex-operaciones e-commerce en Plaza Vea/InRetail) para puestos de
Asistente/Analista de Operaciones E-commerce, con una ampliación hacia
logística, datos/SQL/Power BI, estadística y Power Automate.

Es un artifact HTML publicado en claude.ai (Artifact tool) y también existe
como paquete PWA instalable (para iPhone, vía GitHub Pages/Netlify).

Enlace del artifact publicado (puede seguir siendo el mismo si se actualiza
con `Artifact action=publish` pasando la misma `url`):
https://claude.ai/artifact/Y7DaWmKhZDqjTeCkmNfBJv

## 1. Arquitectura de archivos (todo vive en /home/claude/course/ del container)

El curso final es **un solo HTML** ensamblado por concatenación de piezas JS
puestas dentro de `<script>` tags. No hay build tool real, es `cat` + sed.

Archivos fuente (todos en `/home/claude/course/`):
- `head.html` — `<head>` completo + CSS (todo el diseño, tokens de tema claro/oscuro,
  responsive, PWA meta tags comentadas) + apertura de `<body>` con la cabecera
  (top bar), el `<nav id="nav">`, `<main id="main">`, overlay de modal, barra
  inferior móvil (`#bbar`), `#scrim`, `#tip` (tooltip de glosario), y arranque
  del primer `<script>` con helpers `V()` (marca "verificar") y `T()` (tabla HTML).
- `dataset.js` — genera `DATA`: 320 pedidos sintéticos deterministas (semilla fija,
  mulberry32) para el retailer ficticio "Retail Andino". Incluye objeto `K` con
  funciones de KPI (ontime, cancelPct, fill, otif, by, leadDays, ticket), helpers
  estadísticos (mean, median, pctl, sdS), pronóstico (maFc, sesFc, fcErr) y `fmt()`.
- `glosario.js` — array `GLOS` con ~184 términos (función `G(k,t,a,cat,d,f,v,cs,ns)`:
  key, título, alias, categoría, definición, fórmula, capítulo de referencia,
  case-sensitive, no-plural). Array `CATS` con las 9 categorías temáticas.
- `data1.js` … `data11.js` — contenido de los módulos, cada uno hace
  `MODS.push({id:'N', title, short, blurb, grp, ext, ch:[...]})`.
  **OJO con el mapeo actual (ver sección 2): el número de archivo NO coincide
  con el id del módulo.**
- `engine.js` — todo el motor: router por hash (`#/1.1`, `#/home`, `#/glosario`),
  render de portada, render de capítulo, render de los ~15 tipos de ejercicio
  interactivo, quiz, glosario tocable (auto-linking de términos en el texto),
  guardado/restauración de respuestas de ejercicios en localStorage, export/
  import de progreso (código base64), tema claro/oscuro, modal de datos CSV,
  barra inferior móvil, migración de versiones de `localStorage` (`S.ver`).
- `build.sh` — concatena todo en el orden correcto y genera:
  - `./build.sh` → escribe `/mnt/user-data/outputs/curso-operaciones-ecommerce.html` (versión web)
  - `./build.sh pwa` → escribe `/tmp/pwa_index.html` (versión con meta tags de PWA
    y `window.__PWA=1` para registrar el service worker)
- `/home/claude/pwa/` — paquete app instalable: `index.html` (copiado de
  `/tmp/pwa_index.html`), `manifest.webmanifest`, `sw.js` (service worker con
  cache-first + network fallback, `VERSION` a subir en cada release),
  `icons/` (generados con PIL: apple-touch-icon.png, icon-192.png, icon-512.png,
  icon-512-maskable.png — diseño: caja amarilla con ruta de tracking arriba,
  sobre fondo verde azulado #0E5C63), `LEEME.txt` (instrucciones para Valentino:
  subir a GitHub Pages o Netlify, anclar en iPhone desde Safari).

El orden de concatenación en `build.sh` (¡importante, MODS.push debe respetar
dependencias como `AREAS`, `DEM8`, `LT15`, `LT10` definidas en algunos data*.js
antes de usarse!):
```
head.html dataset.js glosario.js data1.js data2.js data3.js data4.js data5.js
data11.js data9.js data10.js data8.js data7.js data6.js engine.js
```
Ese orden ensambla los módulos en ESTE orden de aparición en MODS (antes del
`.sort()` que hace engine.js por `mkey`, así que en realidad el orden final en
pantalla lo decide `mkey()`, no el orden de concatenación — pero el orden de
concatenación sí importa para variables compartidas como `AREAS`).

## 2. Mapeo real de módulos (id lógico ↔ archivo fuente) — vigente ahora

| id MODS | Título                                              | Archivo    | grp     |
|---------|------------------------------------------------------|------------|---------|
| 1       | Mapa del e-commerce retail                            | data1.js   | (base)  |
| 2       | Operación diaria y stock                              | data2.js   | (base)  |
| 3       | KPIs y reportes                                       | data3.js   | (base)  |
| 4       | Catálogo, plataformas y marketplace                   | data4.js   | (base)  |
| 5       | Cumplimiento en Perú y empleabilidad                  | data5.js   | (base)  |
| 6       | Gestión operativa e-commerce (NUEVO, recién creado)   | data11.js  | (base)  |
| C       | Caso final del curso base                             | data5.js   | (base)  |
| 7       | Logística de almacén y distribución                   | data9.js   | log     |
| 8       | Planificación de inventario y demanda                 | data10.js  | log     |
| 9       | Datos y dashboards: modelo, SQL y Power BI            | data8.js   | tools   |
| 10      | Estadística descriptiva aplicada                      | data7.js   | tools   |
| 11      | Power Automate para operaciones                       | data6.js   | tools   |
| 12      | Integración y proyecto final                          | data8.js   | tools   |

**Sí, es confuso** (data6.js contiene el módulo 11, data9.js contiene el
módulo 7, etc.) porque los módulos se han renumerado dos veces según pedidos
del usuario, pero los nombres de archivo no se renombraron. Si sigues
trabajando esto, considera renombrar los archivos a `mod01.js`...`mod12.js`
para evitar futuros errores — pero si lo haces, actualiza `build.sh` y revisa
que ninguna variable compartida (`AREAS` en data11.js/módulo 6, `DEM8`/`LT15`/
`LT10` en data7.js/módulo 10) se rompa por reordenar.

`mkey()` en engine.js decide el orden visual:
```js
function mkey(m){return m.id==='C'?6.5:parseFloat(m.id)}
MODS.sort(function(a,b){return mkey(a)-mkey(b)});
```
Así que el orden en pantalla es: 1,2,3,4,5,6,C,7,8,9,10,11,12 — correcto.

Los capítulos usan ids tipo `'6.1'`, `'11.3'`, etc. (módulo.capítulo), y el
capítulo especial del caso final tiene id `'caso'` dentro del módulo `'C'`.

## 3. Estado de avance de contenido (70 capítulos totales, todo probado)

Todo lo siguiente YA ESTÁ HECHO y pasando pruebas automatizadas (ver sección 6):

- **Módulos 1–5 + caso final**: curso base original, sin cambios recientes de
  contenido (solo se les insertaron términos de glosario tocables y explicación
  de KPI en línea en 1.2/1.3/1.4).
- **Módulo 6 — Gestión operativa e-commerce** (en data11.js, 12 capítulos,
  ~250 min): construido a partir de una discusión con el usuario sobre feedback
  de ChatGPT (ver sección 4). Cubre: ciclo de incidencias end-to-end (6.1),
  catálogo de 24 excepciones con esquema causa/impacto/investigar/responsable/
  KPI/acción (6.2), diagnóstico de stock por patrones (6.3), "¿dónde investigo?"
  con casos de sistemas y de KPI (6.4), priorización y SLA operativo (6.5),
  "¿a quién escalo?" con matriz de áreas (6.6), devoluciones de punta a punta
  (6.7), compras y facturas de proveedores con conciliación de 3 vías (6.8),
  pagos dentro del ciclo del pedido (6.9), mesa de control con 20 incidencias
  simuladas para clasificar/priorizar (6.10), 3 casos completos "eres el
  analista" en formato de decisiones paso a paso más un caso abierto de
  entrevista autoevaluado (6.11, ver Etapa 5), y árboles de diagnóstico de
  caídas de KPI: On Time, Cancelación, Fill Rate y OTIF (6.12, ver Etapa 5).
- **Módulos 7–12** (logística, inventario, datos, estadística, Power Automate,
  integración): contenido ya existente de una iteración anterior, sin cambios
  en esta sesión salvo renumeración de ids y referencias cruzadas.
- **Glosario**: 184 términos, con auto-linking en el texto (botones `.term`
  clicables que abren un tooltip `#tip`), lista de "términos de este capítulo"
  al final de cada capítulo, y página `#/glosario` con buscador y filtro por
  categoría.
- **Guardado de respuestas de ejercicios**: `S.ex[chapterId] = {f: [valores de
  inputs/selects], s: [booleans de si la solución estaba visible], k: [índices
  de botones "comprobar" pulsados]}`. Se restaura al volver al capítulo. Botón
  "Borrar mis respuestas de este ejercicio" por capítulo.
- **Export/import de progreso**: botón en portada, genera un código base64 con
  `{v:2, done, quiz, notes, last, ex, checks}`, se puede pegar en otro
  dispositivo (merge aditivo, no sobrescribe).
- **Migración de versiones**: `S.ver` 1→2→3 traduce ids antiguos a nuevos cuando
  cambia la numeración de módulos, para no perder el progreso ya guardado de
  Valentino en su navegador real.
- **Vista móvil**: barra inferior fija (Anterior/Mapa/Siguiente), nav lateral
  como drawer con scrim, botones más grandes, tablas con scroll horizontal,
  todo dentro de `@media (max-width:900px)`. La vista de escritorio NO debe
  tocarse (pedido explícito del usuario: "me gusta como se ve en la pc").
- **PWA**: manifest, service worker, iconos generados, LEEME con instrucciones.

### Tipos de ejercicio interactivo implementados en engine.js (buscar
`function ex<Tipo>` para cada uno): `calc` (cálculo con inputs numéricos y
solución), `reveal` (pregunta abierta + botón ver solución), `match` (unir con
selects), `tabs` (contenido en pestañas), `gtin` (validador de código de barras
en vivo), `flash` (tarjetas de repaso), `case` (el caso final, con filtros +
KPIs recalculados en vivo + textarea de reporte), `stats` (calculadora
estadística con textarea de datos), `fc` (pronóstico: promedio móvil / suav.
exponencial), `ideas` (catálogo filtrable de ideas de automatización), `check`
(checklist persistente), `cat` (catálogo de excepciones, nuevo en módulo 6),
`route` (ejercicio de escalamiento con selects de responsable/apoyo, nuevo),
`triage` (mesa de control de 20 incidencias, nuevo), `scenario` (casos de
decisión paso a paso tipo "elige tu propia aventura" con puntaje, nuevo).
Cualquier ejercicio puede tener un campo `.also` para encadenar un segundo
(o tercer) widget dentro del mismo capítulo — el motor lo recorre
recursivamente (`while(e){exs.push(e);e=e.also}`).

## 4. Contexto de decisiones de diseño importantes (no repetir errores)

- El usuario pidió que el curso vaya de **teoría arriba → herramientas/práctica
  abajo**, con Power Automate, estadística y Power BI como "ampliación" tras el
  caso final. La logística (inventario, almacén) también es teoría, así que va
  ANTES de las herramientas pero DESPUÉS del caso final del curso base.
- El módulo 6 nuevo (Gestión operativa) nació de una conversación cruzada con
  ChatGPT: el usuario le mostró el curso a ChatGPT (sobre un proyecto paralelo
  llamado **ORIGEN**, un proyecto de portafolio de e-commerce que NO es parte
  de este curso, es un proyecto aparte que el usuario hace con ayuda de Claude
  en otro chat y de ChatGPT). ChatGPT recomendó auditar el curso con las
  dimensiones Concepto→Proceso→Excepción→KPI→Diagnóstico→Acción→Responsable→
  Caso, pero AMBOS (usuario y luego el propio ChatGPT en su segunda respuesta)
  coincidieron en que **no había que auditar los 58 capítulos existentes**,
  sino crear un módulo transversal nuevo enfocado en DECISIÓN, no en más
  definiciones. Ese es el módulo 6 actual. Si el usuario pide "profundizar más"
  en el resto del curso citando esa conversación, la respuesta correcta es
  seguir el mismo criterio: no auditar todo, sino añadir piezas de práctica de
  decisión donde falten (el propio usuario y ChatGPT descartaron explícitamente
  meter fraude avanzado, marketing, Ads, SEO, Big Data, ML — mantener eso fuera).
- El usuario tiene experiencia real (~19 meses) en operaciones e-commerce en
  Plaza Vea (sistema DaD de InRetail, que él llama "VTEX" pero no lo es
  literalmente — cuidado con esa distinción si sale el tema). No hay que
  inflar su currículum con "experiencia en VTEX/Shopify": el curso da
  conocimiento conceptual, no experiencia de plataforma.
- Todas las cifras de ejercicios son sintéticas e inventadas para un retailer
  ficticio "Retail Andino"; siempre se aclara esto explícitamente en cada
  capítulo (regla de estilo, no la rompas).
- Todo dato normativo o técnico externo real lleva fuente citada y, si no se
  pudo verificar con certeza para 2026/2027, lleva la marca `V('...')` que
  renderiza como `<mark class="ver">verificar: ...</mark>`.
- El icono de la PWA NO debe ser el de Claude — de ahí que se generó un icono
  propio (caja + ruta de tracking) con PIL, porque si Valentino ancla el link
  de claude.ai directo a su iPhone, probablemente salga el icono de Claude.

## 5. Pendiente / próximos pasos (lo que el usuario pidió y AÚN NO se ha hecho)

Estas son las **7 funcionalidades** que el usuario aprobó implementar
("Implementa todos, me parecen bien, sobretodo los que me recomiendas... quiero
que lo implementes" — la certificación incluida) y que se pausaron para
construir primero el módulo 6 de Gestión Operativa (a pedido explícito de la
conversación con ChatGPT: "no implementaría todavía las 7 funcionalidades...
primero construiría el nuevo módulo"). Ahora que el módulo 6 está terminado y
probado, **estas 7 son lo siguiente a implementar**, en este orden de prioridad
(el propio Claude las priorizó así y el usuario no objetó):

1. ~~**Simulacro de entrevista**~~ — **HECHO** (implementado en `engine.js`,
   sección `/* ---------- simulacro de entrevista ---------- */`, ruta
   `#/simulacro`). Usa el pool de `quiz` ya existente de todos los capítulos
   (no se extrajeron preguntas nuevas de los casos `scenario` del módulo 6;
   quedó como posible mejora futura, no bloqueante). Detalles:
   - Selección aleatoria estratificada por categoría (`SIMCAT`, mapea id de
     módulo → 12 etiquetas temáticas tipo "Incidencias y gestión operativa",
     "KPIs y reportes", etc.) para que el pool no quede sesgado hacia los
     módulos con más capítulos.
   - Configuración: 10/20/30/todas las preguntas, con límite de tiempo
     opcional (sin límite/15/25/40 min) que autofinaliza al agotarse.
   - Durante el intento NO se revela si acertaste o no (estilo examen); el
     reporte final sí, con desglose por tema (barras `ok/tot`) y revisión
     pregunta por pregunta con la explicación (`q.w`) de cada una.
   - Persistencia: `S.simulacros` (array, tope 20 intentos, se recorta el más
     viejo). Cada intento guarda `{id, fecha, n, ok, durSec, items:[{chId, qi,
     cat, sel, ok}]}` — **NO** duplica el texto de la pregunta, lo resuelve en
     el momento de mostrarlo vía `qOf(it)` buscando en `ALL`/`c.quiz[qi]`. Si
     algún día se renumeran capítulos otra vez, hay que aplicar la tabla de
     mapeo de la sección 2 también a `chId` dentro de `S.simulacros` guardados
     (si no, esa pregunta puntual del historial mostrará "contenido cambió" en
     vez de crashear — hay guarda para eso, `qOf` devuelve null y el render lo
     contempla).
   - Historial de últimos 10 intentos visible en `#/simulacro` (con botón
     "Ver" por intento) y último puntaje resumido en el home (`renderHome`).
   - Entrada añadida al menú/nav (`renderNav`) junto a "Glosario".
   - **Bug real encontrado y corregido durante la implementación** (dejarlo
     anotado por si se toca este código de nuevo): cada click en una opción
     volvía a llamar `renderSimRunning()`, que creaba un `setInterval` nuevo
     sin cancelar el anterior, y el callback del intervalo hacía
     `clearInterval(simTimer)` sobre la variable compartida en vez de sobre su
     propio id — los intervalos viejos quedaban huérfanos disparándose para
     siempre. Se corrigió: `renderSimRunning()` cancela `simTimer` al entrar,
     y cada intervalo se cancela a sí mismo vía una variable local (`myTimer`)
     capturada en su propio closure. Verificado con una prueba en jsdom que
     antes colgaba (timeout) y ahora termina limpio.
   - Probado en jsdom: flujo completo (config → 10 preguntas → resultado →
     guardado en localStorage → "Nuevo simulacro" → historial → "Ver" detalle
     → "Salir sin guardar" no persiste nada), 0 errores, sin regresión en la
     prueba de humo general (69 capítulos, glosario, caso final).
2. ~~**Pistas graduales**~~ — **HECHO**, pero con un diseño distinto al
   descrito originalmente (más robusto, cero riesgo de romper contenido):
   en vez de autorar 51 pistas a mano (44 `calc` + 7 `reveal`), se construyó
   un sistema genérico en `engine.js` que reutiliza las fórmulas YA
   autoradas en `glosario.js` (`g.f`, ~31 términos: On Time, Cancelación,
   Fill Rate, OTIF, NPS, EOQ, Stock de seguridad, Rotación, etc.). Botón
   "Pista" con 2 niveles: (1) qué filtrar/mirar primero (mecánico, a partir
   de `ex.cols`/`ex.task`), (2) la fórmula del glosario que aplica al
   enunciado (vía coincidencia de términos, MISMO motor de detección que ya
   usa el glosario para subrayar términos — `GRE`/`GMAP`). Nunca revela el
   número final. Aparece automáticamente en 51/70 capítulos (todos los que
   tienen ejercicio `calc` o `reveal`); no se tocó ningún archivo `data*.js`.
3. ~~**Repaso espaciado**~~ — **HECHO**, ruta `#/repaso`. Algoritmo tipo
   Leitner con 6 cajas (intervalos 0/1/3/7/14/30 días) sobre `S.srs`. Se
   alimenta automáticamente de: (a) preguntas de `S.quiz` respondidas mal en
   el repaso de cada capítulo, (b) preguntas falladas en `S.simulacros`.
   Responder bien sube de caja y aleja la fecha; responder mal resetea a
   caja 1 con vencimiento inmediato (para poder repetirla en la misma
   sesión). Sin backend ni notificaciones reales, tal como se anticipó:
   "intervalo" = "no vuelve a aparecer como pendiente hasta pasar X tiempo".
4. ~~**Mapa de conceptos**~~ — **HECHO**, ruta `#/mapa`. Se optó por agrupar
   los 184 términos del glosario por MÓDULO del curso (usando `g.v` para
   ubicar el capítulo y de ahí el módulo) en vez de un grafo de aristas
   causa→efecto dibujado a mano (que habría requerido autorar relaciones
   término-a-término no existentes en los datos). Cada término es un botón
   `.term` — reutiliza el tooltip de definición que YA existe para los
   capítulos (mismo listener global de click), cero JS nuevo de UI necesario
   para eso.
5. ~~**Datos propios**~~ — **HECHO**, ruta `#/mis-datos`. El usuario pega un
   CSV con encabezado (mismas columnas que `CSV_COLS` de `dataset.js`;
   mínimo obligatorio: `estado, uds, uds_ent, prometida, entrega`) y se
   calculan los mismos KPI que en el caso final (`K.ontime`, `K.cancelPct`,
   `K.fill`, `K.otif`) sobre SUS filas, no sobre `DATA`. Si vienen `tienda`
   o `motivo` se agregan desgloses. Todo client-side, nada se guarda ni se
   envía a ningún lado (se lo dice explícitamente en la pantalla). Nota para
   el futuro: si el usuario más adelante quiere alimentar esto con datos
   reales de ORIGEN, el parser ya acepta cualquier CSV con ese encabezado.
6. ~~**Más ejemplos resueltos**~~ — **HECHO**, pero con un diseño distinto
   al descrito originalmente: en vez de autorar un ejemplo por cada uno de
   ~19 capítulos marcados "difíciles" (con números de una sesión anterior
   que ya no estaban disponibles para verificar en este traspaso), se creó
   un diccionario `EJ` en `engine.js` de ~28 mini-ejemplos resueltos con
   números inventados (distintos a los del ejercicio real, para no filtrar
   la respuesta), uno por cada fórmula del glosario con `g.f`. Aparece
   automáticamente como caja "Ejemplo resuelto de referencia" ANTES del
   enunciado, en cualquier ejercicio `calc`/`reveal` cuyo texto coincida con
   una fórmula conocida — terminó cubriendo 23 de los 70 capítulos (más que
   los ~19 originalmente listados, y sin tocar `data*.js`).
7. ~~**Registro de avance**~~ (renombrado de "Certificado" en su momento, como
   se acordó) — **HECHO**, ruta `#/avance`. Muestra % de capítulos completados,
   tabla por módulo, tiempo estimado cubierto y el resultado del último
   simulacro. Botón "Imprimir o guardar como PDF" (`window.print()`).
   Aclara explícitamente en el texto que no es una certificación profesional.
   Nota: más adelante (Etapa 6) se agregó un **Certificado de finalización**
   real, separado de esta página — ver esa sección. "Registro de avance" sigue
   existiendo tal cual, como resumen de progreso disponible en cualquier
   momento (no solo al 100%); el certificado es el documento formal que se
   habilita únicamente al completar el curso.

**Nota de transparencia sobre las funcionalidades 2 y 6**: el documento
original pedía contenido autorado a mano por capítulo (pistas y ejemplos
específicos). Se optó por un mecanismo genérico reutilizando el glosario
en su lugar, por tres razones: (a) menor riesgo — cero cambios en los 11
archivos `data*.js` que ya están probados con los 70 capítulos; (b) mejor
cobertura — 51 y 23 capítulos respectivamente, más que los originalmente
listados; (c) los números "ya verificados en una sesión anterior" para los
ejemplos resueltos no estaban disponibles en este traspaso para
comprobarlos de nuevo, así que se prefirió generar ejemplos nuevos y
propios antes que reusar cifras no verificables. Si en algún momento se
quiere contenido más específico por capítulo, este mecanismo genérico se
puede complementar (no reemplazar) añadiendo un campo opcional `hint`/`ej`
por ejercicio en los `data*.js`, que tendría prioridad sobre el genérico.

### Etapa 5 — capa de "criterio profesional" (acordada con el usuario y
ChatGPT después de la etapa anterior) — **HECHO**

Diagnóstico previo importante (evitó duplicar motor): `exCat`, `exRoute`,
`exTriage` y `exScenario` YA EXISTÍAN y ya cubrían árboles de diagnóstico,
"¿a quién recurro?", priorización/escalamiento y decisiones secuenciales
tipo "día de trabajo" — solo se usaban en el Módulo 6 para incidencias
puntuales. Se acordó explícitamente NO crear mecanismos paralelos, sino
reusarlos con contenido nuevo. Lo único genuinamente nuevo fue el tipo de
ejercicio para casos de entrevista abiertos (no existía nada de respuesta
libre). Se acordó también NO duplicar contenido de stock/picking (ya cubierto
por 6.2, 6.3 y 6.10) y dejar el capítulo 7.5 (costo por pedido) tal cual —
ChatGPT confirmó que es cost-to-serve, contenido legítimo de operaciones, no
"scope creep" hacia pricing/marketing.

Implementado:
- **Nuevo tipo de ejercicio `opencase`** en `engine.js` (dispatcher en
  `renderEx`, función `exOpenCase`): el usuario escribe una respuesta libre
  en un `<textarea>` (persistida en `S.notes['open_'+ex.id]`, namespaced por
  `ex.id` para evitar colisiones si hay más de uno en el curso), y un botón
  "Ver pauta esperada" revela un checklist de lo que un entrevistador
  esperaría cubrir — **sin calificación automática ni IA**, es autoevaluación
  explícita (se lo dice al usuario en el propio texto: "no la leas antes de
  intentarlo — pierdes el ejercicio"). Limitación técnica asumida y explicada
  al usuario: este HTML no tiene backend ni LLM, así que no se puede evaluar
  la respuesta real, solo compararla con una pauta.
- **Mockup/caso piloto**: se agregó como `also` del capítulo `6.11 Casos
  «Eres el analista»` (que ya enseña el mismo framework qué veo → qué
  pregunto → hipótesis → acción → análisis, así que es el mejor lugar para
  reforzarlo en formato libre). Caso: cancelación operativa sube de 3% a 7%
  en dos semanas (el mismo ejemplo que propuso ChatGPT), con 9 puntos de
  pauta y un párrafo modelo de cómo sonaría una buena respuesta.
- **Capítulo nuevo `6.12 Diagnóstico de caídas de KPI: On Time, Cancelación,
  Fill Rate y OTIF`** (al final del módulo 6, id nuevo, no requirió
  renumerar nada existente): `ex` principal tipo `cat` con 4 situaciones de
  caída de KPI (una por cada KPI: On Time general vs. concentrado;
  Cancelación por discrepancia de stock concentrada en tienda/categoría —
  reusa la misma anomalía oculta del dataset sintético que ya usa el caso
  final del curso base, para reforzar esa historia; Fill Rate por
  sobreventa/quiebre puntual; OTIF por brecha de "In Full" que apunta a
  picking/packing), cada una con causa probable, impacto, qué investigar,
  responsable + apoyo, KPI afectado y acción inmediata, con modo práctica
  (revela campo por campo) y filtro por categoría — igual que el resto del
  curso. `also` tipo `route` con las mismas 4 situaciones para practicar "¿a
  quién recurro?" (8 áreas canónicas reutilizadas: Operaciones, Logística/TMS,
  Inventario/Almacén, TI, Atención al cliente, Marketplace/Sellers,
  Planificación de franjas, Jefe de operaciones). Quiz de 3 preguntas.
  Deliberadamente NO se agregó un árbol dedicado a stock/picking (ya cubierto
  en 6.2/6.3/6.10); si más adelante se quiere de todos modos, es la misma
  receta (nuevo `id` al final del módulo, contenido con `exCat`/`exRoute`).

Probado exhaustivamente en jsdom antes de cerrar (ver sección de pruebas más
abajo si se agrega, o repetir lo hecho en este traspaso): sintaxis de ambos
bloques `<script>` del HTML, regresión de los 70 capítulos, simulacro,
pistas/ejemplos, repaso/mapa/mis-datos/avance, y específicamente: toggle de
pauta del caso abierto (con persistencia en localStorage y restauración al
recargar), puntaje de `exRoute` en 6.12, y modo práctica + filtro por
categoría de `exCat` en 6.12. 0 errores en todas las corridas. **Nota**: una
primera corrida de estas pruebas dio resultados que parecían indicar un bug
(pauta no se mostraba, puntaje bajo) — se investigó y era el propio script de
prueba usando un selector CSS global (`.sol`) que capturaba un elemento
distinto al del caso abierto (había otros `.sol` en la misma página, del
`exScenario` de 6.11); se corrigió el test, no el producto, tras confirmar
que la implementación real sí funcionaba.

**Pendiente real después de esta etapa**: certificado de finalización (ver
Etapa 6 abajo, ya implementado) y el backend de Supabase (sección de
sincronización más arriba, sigue pendiente).

### Etapa 6 — certificado de finalización + revisión final de coherencia —
**HECHO**

Se agregó, sin tocar contenido académico ni crear módulos nuevos:

- **Nombre definitivo del curso**: `E-commerce Operations, Supply Chain &
  Analytics`, guardado en una única constante `COURSE_NAME` en `engine.js`
  (para no repetirlo suelto por el código). Se usa en el `<title>` de
  `head.html`, en el certificado y en "Registro de avance". Decisión
  deliberada de no rehacer: el nombre de marca en español que ya existía
  ("Operaciones e-commerce retail en Perú" en el `<h1>` del home, y
  "Operaciones E-commerce Perú" en el logo de la barra superior) se dejó
  tal cual — son voces narrativas/de marca ya probadas, y renombrarlas
  hubiera sido un rediseño no pedido. Si se prefiere unificar todo a un solo
  nombre, es un cambio de texto simple, no estructural.
- **Certificado de finalización** (`#/certificado`, función
  `renderCertificado` en `engine.js`), integrado con el mecanismo de
  progreso YA EXISTENTE (`S.done` / `ALL.length`), sin un segundo sistema de
  "completado":
  - Bloqueado mientras `S.done` no cubra el 100% de `ALL` (70/70): muestra
    cuántos capítulos faltan y enlaces para volver al curso o al registro de
    avance.
  - Al llegar a 100%, se genera automáticamente `S.certDate` (una sola vez;
    se limpia solo si el usuario desmarca algún capítulo y vuelve a bajar de
    100%, y se regenera si vuelve a completar) — sigue siendo `S.done` la
    única fuente de verdad, `certDate` es solo un timestamp derivado.
  - Campo de texto libre para el nombre a mostrar (`S.certName`, sin validar
    contra ningún dato personal fijo — el usuario escribe lo que quiera),
    con vista previa en vivo.
  - Diseño visual propio (`.cert`, `.cert-course`, `.cert-name`, etc. en
    `head.html`) coherente con las variables de color/tipografía ya
    existentes (`--brand`, `--surface`, `--line`, `--ink2`, `--fd`), no una
    paleta nueva.
  - Aclara explícitamente, en texto visible, que es un certificado personal
    generado por el propio curso y no una certificación oficial, título ni
    acreditación externa.
  - Botón "Imprimir o guardar como PDF" reusando `window.print()` y el CSS
    `@media print` ya existente (se le agregó ocultar `.crumb` en cualquier
    página al imprimir, y el `<h1>` de esta página específica se marcó
    `noprint` para que en la hoja impresa solo se vea la caja del
    certificado, no el título de la página ni el campo de nombre).
  - Enlaces cruzados: tarjeta "Certificado" en la grilla "Más práctica" del
    home (con texto dinámico según si ya está disponible), y "Registro de
    avance" enlaza al certificado cuando detecta 100%.
- **Revisión de coherencia** (solo se corrigieron datos realmente
  desactualizados, sin refactors):
  - `ESTADO_DEL_PROYECTO.md` mencionaba "69 capítulos" y "Módulo 6 con 11
    capítulos" en varios lugares que describen el estado ACTUAL del curso;
    se actualizaron a 70 y 12 respectivamente. Las menciones de "69
    capítulos" que son registros históricos de una corrida de pruebas
    específica de una sesión anterior se dejaron tal cual (son verdad para
    ese momento, no para hoy).
  - Se confirmó que no hay ningún número de capítulos hardcodeado en la
    lógica de `engine.js` (todo se calcula desde `ALL.length`/`MODS` en
    tiempo real), así que agregar el certificado y cualquier capítulo futuro
    no requiere tocar código de conteo en ningún otro lado.
  - Se confirmó que no hay colisión de ids/selectores nuevos (`certname`,
    `certnamedisp`, `certbox`, `certprint`) con nada existente (en particular
    con `avprint` de "Registro de avance", que es distinto).
  - Persistencia: no se tocó el formato de `localStorage` ni el mecanismo de
    `save()`/carga — `certName`/`certDate` son simplemente dos claves nuevas
    y opcionales dentro del mismo objeto `S`, compatibles con instalaciones
    viejas (si no existen, se tratan como "aún no generado"). Queda listo
    para que la Etapa 7 (Supabase) sincronice `S` completo sin cambios
    adicionales aquí.

Probado en jsdom (ver sección de pruebas): certificado bloqueado a 0%,
capítulos completados uno por uno vía el botón real "Marcar como hecho" de
cada capítulo (no vía manipulación directa de estado) hasta llegar a 70/70,
desbloqueo correcto, nombre con vista previa en vivo y persistencia entre
navegaciones, fecha estable mientras se mantiene el 100%, ciclo
completar→descompletar→volver a completar (el certificado se bloquea y
`certDate` se limpia y regenera correctamente), impresión sin errores, y
tarjeta del home reflejando el estado. Regresión completa de los 70
capítulos y de todas las funcionalidades anteriores (simulacro, pistas,
repaso, mapa, mis datos, Etapa 5) repetida después de este cambio: 0 errores.

**Pendiente real después de esta etapa**: solo el backend de Supabase.
Con esto, el curso queda cerrado a nivel de contenido y funcionalidades
locales; lo único que falta es la sincronización entre dispositivos.

### Sincronización entre dispositivos — DECIDIDO con el usuario (24 sep, no
implementado todavía; diseñar el esquema de datos ahora, construir el backend
después de terminar las 7 funcionalidades salvo que se adelante):

- **Backend**: Supabase (plan Free: ~500 MB Postgres, 50k MAU, 5 GB egress,
  auth incluida). Ojo — los proyectos Free se pausan tras 7 días de
  inactividad y hay que reactivarlos a mano desde el dashboard; el usuario ya
  lo sabe y lo acepta.
- **Seguridad**: la clave pública/anon de Supabase SÍ puede ir en el HTML (no
  es secreta por diseño); la protección real es Row Level Security con
  `auth.uid() = user_id` en cada política, no ocultar la key.
- **Auth**: Magic link por email (sin contraseña). Sesión persiste en
  localStorage del navegador tras el primer login por dispositivo.
- **Hosting para que el sync funcione**: el link `claude.ai/artifact/...`
  (publicado con la herramienta Artifact) **NO puede** hacer `fetch` a
  Supabase — la política de seguridad de esas páginas publicadas bloquea
  peticiones de red a otros dominios (solo permite cargar ciertos scripts
  desde `cdn.jsdelivr.net`/`cdnjs.cloudflare.com`, nada de llamadas a una API
  externa). El usuario confirmó que usará la URL de GitHub
  Pages/Netlify (la misma que ya se iba a usar para el PWA del celular) en
  la PC también, como versión "de estudio diario"; el link de claude.ai queda
  como preview/demo, sin sync.
- **Sin Realtime**: sincronización automática al iniciar sesión/abrir el curso
  y después de guardar cambios relevantes. No hace falta que dos pestañas
  abiertas se vean en vivo.
- **Esquema de datos** (definir ANTES de seguir con las funcionalidades 2-7
  para que no haya que rehacer nada):
  - Progreso simple (capítulos completados, respuestas de ejercicio, notas,
    checks): tabla `progreso(user_id, item_key, item_type, valor, updated_at)`
    — una fila por elemento, upsert, así el merge entre dispositivos es "por
    fila" (last-write-wins por fila vía `updated_at`) y no hace falta mergear
    un JSON gigante a mano.
  - Simulacros de entrevista: además del resumen, conservar el intento
    completo con las respuestas individuales (ya es exactamente la forma en
    que quedó `S.simulacros` al implementarlo — ver punto 1 arriba: `{id,
    fecha, n, ok, durSec, items:[{chId, qi, cat, sel, ok}]}`). Esto es clave
    para que más adelante el repaso espaciado y el "mapa de debilidades" se
    puedan alimentar de qué preguntas/temas falla el usuario repetidamente,
    no solo del puntaje final.
- **Aún no implementado**: falta que el usuario cree el proyecto Supabase
  (URL + anon key) y que se escriba el código de auth + fetch + políticas RLS
  + la función que serializa `S` hacia/desde las tablas. Cuando el usuario dé
  luz verde, hacerlo como una capa aparte que envuelva `save()`/carga inicial,
  sin tocar la lógica interna de cada función `render*`.

## 6. Cómo verificar que todo sigue funcionando (arnés de pruebas)

No hay un framework de test real: se usa `node` + `jsdom` en `/tmp/jt/` (ese
directorio es efímero del container, NO se traspasa — si migras a otro chat,
tendrás que recrear estos scripts o pedir a Claude que los rehaga; están
descritos aquí para que sea rápido).

Patrón general de cada script de prueba (todos siguen esta forma):
```js
const {JSDOM}=require('jsdom');const fs=require('fs');
const html=fs.readFileSync('/mnt/user-data/outputs/curso-operaciones-ecommerce.html','utf8')
  .replace(/<link[^>]*fonts[^>]*>/g,''); // quita Google Fonts (jsdom no tiene red)
const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',
  pretendToBeVisual:true,beforeParse(w){w.scrollTo=()=>{};w.matchMedia=()=>({matches:false})}});
const w=dom.window,d=w.document;
function go(h){w.location.hash=h;w.dispatchEvent(new w.HashChangeEvent('hashchange'))}
// ... navegar con go('#/6.1'), leer w.eval('MODS'), w.eval('DATA'), etc.
```
Pruebas clave que se corrieron y pasaron en esta sesión (69 capítulos, 0
errores JS, 0 respuestas incorrectas):
- Recorrer los 69 capítulos, resolver cada ejercicio `calc`/`case` con el
  valor exacto que calcula la propia función `fn` de cada `part`, pulsar
  "comprobar", verificar que NO aparezca `.fb.bad`, pulsar "ver solución",
  verificar que el texto no tenga `NaN`/`undefined` y tenga más de 20 caracteres.
- Verificar que cada capítulo con `c.quiz` tenga exactamente 3 preguntas
  renderizadas.
- Probar persistencia: rellenar un ejercicio, navegar a otro capítulo y volver,
  verificar que los valores y el estado de "solución visible" se restauraron.
- Probar exportar progreso (leer el código base64 generado) e importar en una
  sesión "limpia" con datos antiguos (verificar migración `S.ver` 1→2→3).
- Probar los widgets nuevos del módulo 6: `scenario` (elegir la mejor opción en
  cada paso, verificar puntaje 10/10), `cat` (filtrar por categoría, activar
  modo práctica), `route` (rellenar responsable/apoyo, verificar resumen),
  `triage` (rellenar las 20 incidencias con la primera opción "correcta" de
  cada `k.split('|')`, marcar las 3 del `top`, verificar 80/80 y 3/3).
- Verificar que ninguna opción elegible en `triage`/`route` esté fuera de las
  listas válidas (`tipos`, `sevs`, `accs`, `resps`, `areas`).
- Regresión importante ya corregida una vez: una colisión de nombre de clase
  CSS (`.sm`) entre "botón pequeño" y "solo visible en móvil" ocultaba los
  botones de Datos/Tema/Comprobar/Ver-solución en escritorio. Se renombraron
  las clases móviles a `.tl`/`.ts`/`.dsk`. **Si vuelves a tocar CSS de
  botones, ten cuidado con reintroducir esta colisión.**

Antes de dar por buena cualquier iteración futura, como mínimo correr de nuevo
el bucle que recorre los 69 capítulos y comprueba `calc`/`case`/`match`/`quiz`
(descrito arriba) — es barato y atrapa la mayoría de errores de sintaxis JS o
de referencias rotas entre módulos.

## 7. Convenciones de estilo de contenido (para que lo nuevo combine)

- Español de Perú, tono profesional pero directo, sin relleno.
- Cada capítulo: `goal` (objetivo, 1 frase), `body` (explicación con
  subtítulos `<h3>`, tablas con `T()`, código con `<pre><code>`), `example`
  (un ejemplo ambientado en "Retail Andino", SIEMPRE marcado como ficticio),
  `ex` (el ejercicio interactivo, con `.also` si se encadena otro), `quiz`
  (array de 3 preguntas `{q,o,a,w}` — `a` es el índice de la opción correcta,
  `w` es la explicación que se muestra tras responder), `src` (array de
  `[url, título de la fuente]`, siempre con fuentes reales y verificadas por
  `web_search`/`web_fetch` durante esta sesión), `ver` (array de strings con
  `V('...')` insertado para lo no verificable con certeza).
- Los números de ejercicios (`fn`) SIEMPRE se verifican con Python o Node
  antes de escribir la solución en prosa, para que el texto y el cálculo
  coincidan exactamente (con la tolerancia `tol` correspondiente).
- Nunca reproducir texto largo con derechos de autor (política de copyright);
  toda cita de fuente es parafraseada.
- El glosario (`glosario.js`) se actualiza cada vez que se añade contenido con
  términos nuevos: añadir con `G(...)`, evitar alias que colisionen con otros
  ya existentes (correr el script de detección de duplicados de la sección 6
  antes de dar por terminado).

## 8. Archivos a subir al nuevo chat

Sube el zip `curso-proyecto-fuente.zip` que acompaña a este documento. Contiene
TODO lo de `/home/claude/course/` (los 20 archivos fuente + este mismo
documento) más la carpeta `/home/claude/pwa/` completa (para no tener que
regenerar iconos ni el service worker). Además, el HTML ya ensamblado y
funcionando (`curso-operaciones-ecommerce.html`) por si se quiere seguir
desde ahí sin reensamblar nada primero.
