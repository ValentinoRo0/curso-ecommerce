MODS.push({id:'9',grp:'tools',title:'9. Datos y dashboards: modelo, SQL y Power BI',short:'Modelo estrella, SQL analítico, DAX, diseño de tableros',blurb:'De la tabla de pedidos a un tablero operativo: modelo de datos, SQL analítico, medidas DAX y diseño.',ch:[
{id:'9.1',title:'Modelo de datos para operaciones: hechos y dimensiones',min:18,
goal:'Clasificar campos como hechos o dimensiones, elegir el grano de una tabla y evitar el error de sumar de más.',
body:`<p>La guía de Microsoft para Power BI recomienda el <b>esquema en estrella</b>: las <b>dimensiones</b> describen entidades (tienda, producto, fecha, seller) y sirven para <b>filtrar y agrupar</b>; los <b>hechos</b> registran eventos o mediciones (pedidos, entregas, movimientos de stock) y sirven para <b>resumir</b>. Las relaciones suelen ser de uno a muchos, de la dimensión al hecho. La dimensión más constante de todas es la de <b>fecha</b>.</p>
<h3>El grano</h3>
<p>El <b>grano</b> es lo que representa una fila. Decídelo antes de nada:</p>
${T(['Tabla de hechos','Una fila es…','Sirve para'],[
['Pedidos','Un pedido','On Time, cancelación, ticket'],
['Líneas de pedido','Un producto dentro de un pedido','Fill Rate por unidades, productos más cancelados'],
['Historial de estados','Un cambio de estado con hora','Antigüedad en estado, cuellos de botella'],
['Stock (foto diaria)','Un SKU por tienda por día','Quiebres, desalineación'],
['Incidencias','Una incidencia','Pareto de causas, tiempo de resolución']])}
<p>Errores comunes: mezclar granos en una misma tabla y sumar un monto de pedido después de unirlo a las líneas (se repite una vez por línea y el total se infla). Esa es la trampa del <b>abanico</b> (fan-out) en un JOIN uno a muchos.</p>
<p>Si ya diseñaste un modelo con dimensiones y hechos para tu proyecto Origen, úsalo como ejemplo en entrevistas: explica el grano de cada tabla y por qué.</p>`,
example:`<p>«Retail Andino» (ficticio) reporta ventas de 1300 soles un día en que la caja dice 600. La causa: el monto del pedido se unió a la tabla de líneas y se sumó por cada línea. El arreglo es sumar el monto en la tabla de pedidos, o repartirlo por línea desde el origen.</p>`,
ex:{type:'match',intro:'¿Es un hecho o una dimensión?',opts:['Hecho (se suma o se cuenta)','Dimensión (filtra o agrupa)'],items:[
{t:'Monto del pedido',a:'Hecho (se suma o se cuenta)'},
{t:'Unidades entregadas',a:'Hecho (se suma o se cuenta)'},
{t:'Horas que estuvo el pedido en un estado',a:'Hecho (se suma o se cuenta)'},
{t:'Nombre de la tienda',a:'Dimensión (filtra o agrupa)'},
{t:'Categoría del producto',a:'Dimensión (filtra o agrupa)'},
{t:'Mes y día de la semana',a:'Dimensión (filtra o agrupa)'},
{t:'Descripción del motivo de cancelación',a:'Dimensión (filtra o agrupa)'}],
sol:'<p>Bien. Regla práctica: si lo sumas o promedias, es un hecho; si lo usas para cortar, es una dimensión.</p>',
also:{type:'calc',intro:'Abanico: tres pedidos con su monto y su número de líneas (datos sintéticos).',cols:['Pedido','Monto del pedido (S/)','Líneas'],rows:[['P1',300,3],['P2',200,1],['P3',100,2]],num:[1,2],
task:'Calcula la suma correcta de montos, la suma que resulta si unes a las líneas y la sumas por cada línea, y cuántas veces se infla.',
parts:[{l:'Suma correcta',u:'S/',tol:0,fn:function(r){return r.reduce(function(a,x){return a+x[1]},0)}},{l:'Suma inflada',u:'S/',tol:0,fn:function(r){return r.reduce(function(a,x){return a+x[1]*x[2]},0)}},{l:'Factor de inflado',u:'veces',tol:0.01,fn:function(r){var c=0,i=0;r.forEach(function(x){c+=x[1];i+=x[1]*x[2]});return i/c}}],
sol:function(v){return '<p>Correcto: <b>S/ '+v[0]+'</b>. Inflado: 300×3 + 200×1 + 100×2 = <b>S/ '+v[1]+'</b>, unas <b>'+fmt(v[2],2)+'</b> veces. Antes de sumar después de un JOIN, comprueba el grano y cuenta filas.</p>'}}},
quiz:[
{q:'En un esquema en estrella, las dimensiones sirven para…',o:['Sumar montos','Filtrar y agrupar','Guardar contraseñas','Emitir comprobantes'],a:1,w:'Y los hechos, para resumir.'},
{q:'¿Qué es el «grano» de una tabla de hechos?',o:['El tamaño del archivo','Lo que representa una fila','El color','El número de columnas'],a:1,w:'Se define antes de construir el modelo.'},
{q:'Sumaste un monto de pedido tras unirlo a las líneas y el total se duplicó. Causa probable:',o:['Error de tipeo','Fan-out por unir un uno-a-muchos','Falla del servidor','El IGV'],a:1,w:'El monto se repite por cada línea.'}],
src:[['https://learn.microsoft.com/power-bi/guidance/star-schema','Microsoft Learn: esquema en estrella y su importancia para Power BI'],['https://learn.microsoft.com/en-us/training/modules/build-power-bi-report/2-build-data-model','Microsoft Learn: construir el modelo de datos']],
ver:['Los granos propuestos son una guía didáctica; el diseño final depende de tus preguntas de negocio.']},

{id:'9.2',title:'SQL analítico: JOIN, CTE y funciones de ventana',min:20,
goal:'Escribir consultas que respondan preguntas de operaciones: tendencias, rankings y comparaciones con el día anterior.',
body:`<p>Además de <code>GROUP BY</code>, hay tres herramientas que un analista usa todos los días.</p>
<h3>CTE: dividir en pasos legibles</h3>
<pre><code>WITH diario AS (
  SELECT CAST(fecha AS date) AS dia,
         COUNT(*) AS creados,
         SUM(CASE WHEN estado = 'Cancelado' THEN 1 ELSE 0 END) AS cancelados
  FROM pedidos
  GROUP BY CAST(fecha AS date)
)
SELECT dia, creados, cancelados,
       CAST(100.0 * cancelados / creados AS DECIMAL(5,1)) AS pct_cancel,
       LAG(cancelados) OVER (ORDER BY dia) AS cancelados_dia_anterior,
       SUM(cancelados) OVER (ORDER BY dia ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cancelados_acum
FROM diario
ORDER BY dia;</code></pre>
<p><code>LAG</code> accede a una fila anterior del mismo resultado sin auto-JOIN; en su forma <code>OVER (PARTITION BY ... ORDER BY ...)</code> el <code>ORDER BY</code> es obligatorio. Con <code>PARTITION BY</code> reinicias el cálculo por grupo (por tienda, por ejemplo).</p>
<h3>Top N por grupo con ROW_NUMBER</h3>
<pre><code>SELECT tienda, sku, cancelaciones
FROM (
  SELECT tienda, sku, COUNT(*) AS cancelaciones,
         ROW_NUMBER() OVER (PARTITION BY tienda ORDER BY COUNT(*) DESC) AS rn
  FROM pedidos
  WHERE estado = 'Cancelado'
  GROUP BY tienda, sku
) t
WHERE rn &lt;= 3;</code></pre>
<h3>Percentil por modalidad</h3>
<pre><code>SELECT DISTINCT modalidad,
       PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY horas_entrega)
         OVER (PARTITION BY modalidad) AS p90_horas
FROM entregas;</code></pre>
<h3>JOIN sin trampas</h3>
<ul><li><code>INNER JOIN</code> descarta filas sin pareja; <code>LEFT JOIN</code> las conserva.</li><li>Si haces <code>LEFT JOIN</code> y luego filtras en <code>WHERE</code> una columna de la tabla derecha, lo conviertes en un INNER JOIN; pon la condición en el <code>ON</code>.</li><li>Cuenta filas antes y después de cada JOIN (capítulo 9.1).</li></ul>`,
example:`<p>Tu jefe pregunta: «¿en qué tienda se repiten las mismas cancelaciones?». Con el Top 3 por tienda ves los SKU que más se cancelan en cada una, y si un SKU aparece en varias tiendas, sospechas de un problema de catálogo o de stock del proveedor.</p>`,
ex:{type:'calc',intro:'Resultado del CTE diario de la consulta anterior (datos sintéticos).',cols:['dia','creados','cancelados'],rows:[['01',20,1],['02',25,2],['03',22,0],['04',30,4]],num:[1,2],
task:'¿Qué devuelven las columnas calculadas en la fila del día 04?',
parts:[{l:'cancelados_dia_anterior',tol:0,fn:function(r){return r[2][2]}},{l:'cancelados_acum',tol:0,fn:function(r){return r.reduce(function(a,x){return a+x[2]},0)}},{l:'pct_cancel',u:'%',tol:0.1,fn:function(r){return 100*r[3][2]/r[3][1]}}],
sol:function(v){return '<p>En el día 04, <code>LAG</code> trae los cancelados del día 03 = <b>'+v[0]+'</b>. El acumulado 1+2+0+4 = <b>'+v[1]+'</b>. El porcentaje = 4/30 = <b>'+fmt(v[2])+'%</b>. En la fila del día 01, <code>LAG</code> devuelve NULL porque no hay día anterior.</p>'}},
quiz:[
{q:'¿Qué hace <code>LAG(cancelados) OVER (ORDER BY dia)</code>?',o:['Suma los cancelados','Devuelve el valor de la fila anterior según el orden','Borra la fila','Ordena la tabla al final'],a:1,w:'Compara la fila actual con la anterior.'},
{q:'LEFT JOIN + WHERE sobre una columna de la tabla derecha…',o:['Mantiene todas las filas siempre','Puede convertirlo en un INNER JOIN','No cambia nada','Es un error de sintaxis'],a:1,w:'Filtra las filas sin pareja (NULL). Pon la condición en el ON.'},
{q:'Para «los 3 SKU con más cancelaciones por tienda» usas…',o:['ROW_NUMBER() OVER (PARTITION BY tienda ORDER BY COUNT(*) DESC)','Solo COUNT','Solo SUM','UNION'],a:0,w:'Numeras dentro de cada grupo.'}],
src:[['https://learn.microsoft.com/pl-pl/sql/t-sql/functions/lag-transact-sql','Microsoft Learn: LAG (Transact-SQL)']],
ver:['Sintaxis de PERCENTILE_CONT y de la ventana con ROWS según tu versión de SQL Server: '+V('probar en tu servidor')]},

{id:'9.3',title:'DAX esencial sin miedo: medidas para operaciones',min:20,
goal:'Escribir las medidas básicas de un tablero de operaciones y entender por qué cambian según el filtro.',
body:`<p>Una <b>medida</b> en Power BI es una fórmula que se recalcula según los filtros del visual (tienda, fecha, categoría). Una <b>columna calculada</b> se calcula fila por fila al cargar los datos. Regla práctica: si necesitas un porcentaje, un total o una comparación, usa una medida; si necesitas etiquetar filas (a tiempo sí o no), usa una columna, mejor creada en Power Query.</p>
<pre><code>Pedidos            = COUNTROWS(Pedidos)
Cancelados         = CALCULATE([Pedidos], Pedidos[estado] = "Cancelado")
% Cancelación      = DIVIDE([Cancelados], [Pedidos])
Entregados         = CALCULATE([Pedidos], Pedidos[estado] = "Entregado")
A tiempo           = CALCULATE(SUM(Pedidos[a_tiempo]), Pedidos[estado] = "Entregado")
% On Time          = DIVIDE([A tiempo], [Entregados])
% On Time sem. ant.= CALCULATE([% On Time], DATEADD(Calendario[Fecha], -7, DAY))
Variación (pp)     = [% On Time] - [% On Time sem. ant.]</code></pre>
<p>Ideas clave:</p>
<ul><li><code>CALCULATE</code> evalúa una medida cambiando el filtro.</li><li><code>DIVIDE</code> evita errores por cero.</li><li>Las comparaciones de fechas (<code>DATEADD</code>) requieren una tabla <b>Calendario</b> continua, marcada como tabla de fechas ${V('requisitos de la tabla de fechas en tu versión')}.</li><li>Guarda las medidas en una tabla propia («Medidas») para tenerlas ordenadas.</li></ul>
<p>Las medidas deben coincidir con la definición de KPI del capítulo 3.1. Anota la definición en la descripción de cada medida.</p>`,
example:`<p>El mismo <code>% On Time</code> muestra 88% en la tarjeta general, y al elegir «Surco» en el segmentador muestra 82%. No cambiaste la fórmula: cambió el filtro. Eso es el <b>contexto de filtro</b>, y explica la mayoría de sorpresas al empezar con DAX.</p>`,
ex:{type:'reveal',intro:'Ejercicio de escritura. Usa tu tabla <code>Pedidos</code> con las columnas del CSV.',task:'Escribe (a) la medida de % OTIF y (b) la medida de participación de cada tienda en el total de cancelaciones.',
sol:'<p><b>(a)</b> Primero, en Power Query, una columna <code>otif</code>:</p><pre><code>if [estado]="Entregado" and [entrega] &lt;= [prometida] and [uds_ent] = [uds] then 1 else 0</code></pre><pre><code>% OTIF = DIVIDE(SUM(Pedidos[otif]), [Entregados])</code></pre><p><b>(b)</b> Con la medida <code>Cancelados</code> de arriba:</p><pre><code>% del total de cancelados =\nDIVIDE([Cancelados], CALCULATE([Cancelados], ALL(Pedidos[tienda])))</code></pre><p><code>ALL</code> quita el filtro de tienda en el denominador, así cada tienda se compara con el total de cancelaciones. Verifica la sintaxis en tu Power BI.</p>'},
quiz:[
{q:'Una medida frente a una columna calculada:',o:['La medida se calcula una vez al cargar','La medida se recalcula según el filtro del visual','Son idénticas','La medida no puede dividir'],a:1,w:'Por eso reacciona a los segmentadores.'},
{q:'¿Para qué sirve <code>DIVIDE</code>?',o:['Para restar','Para dividir sin errores por cero','Para filtrar','Para ordenar'],a:1,w:'Devuelve vacío o un valor alterno en lugar de un error.'},
{q:'La comparación con la semana anterior (<code>DATEADD</code>) requiere…',o:['Solo la tabla de pedidos','Una tabla Calendario continua marcada como tabla de fechas','Excel','Un premium'],a:1,w:'Sin una tabla de fechas adecuada, los resultados no son fiables.'}],
src:[['https://learn.microsoft.com/power-bi/guidance/star-schema','Microsoft Learn: medidas explícitas e implícitas en el modelo']],
ver:['Sintaxis DAX y comportamiento de DATEADD en tu versión de Power BI: '+V('probar en tu Power BI Desktop')]},

{id:'9.4',title:'Diseño de un dashboard operativo que se lee en 10 segundos',min:18,
goal:'Diseñar un tablero que responda preguntas concretas, con los visuales adecuados y sin ruido.',
body:`<p><b>Empieza por la decisión</b>, no por el gráfico: ¿quién lo mira, cada cuánto, y qué acción debe poder tomar? Un tablero para el jefe de operaciones (diario, excepciones) es distinto de uno para gerencia (semanal, tendencia) y del de un seller (sus pedidos).</p>
<div class="wire" aria-label="Boceto de dashboard operativo"><div class="w4"><b>Filtros:</b> fecha, tienda, bandera, canal, modalidad</div><div>Pedidos<br><small>vs sem. ant.</small></div><div>On Time<br><small>vs meta / sem. ant.</small></div><div>Cancelación<br><small>vs sem. ant.</small></div><div>OTIF<br><small>vs sem. ant.</small></div><div class="w2">Tendencia diaria de On Time con límites de control</div><div class="w2">Cancelaciones por motivo (barras ordenadas)</div><div class="w2">Matriz tienda × categoría (mapa de calor)</div><div class="w2">Tabla de excepciones: pedidos atorados, con formato condicional</div></div>
<h3>Reglas de diseño (criterios propios, no una norma)</h3>
<ul><li><b>Una página, una pregunta.</b> Si necesitas explicar la página con más de dos frases, divídela.</li><li><b>KPIs con contexto:</b> valor, comparación y denominador escritos. Un número solo no dice si es bueno.</li><li><b>Barras ordenadas</b> para rankings, <b>líneas</b> para tiempo, <b>tabla</b> para casos concretos. Evita gráficos circulares con muchas categorías.</li><li><b>Color solo para señalar</b> (semáforo, excepción) y con cuidado para personas con daltonismo; agrega iconos o texto.</li><li><b>Definiciones a un clic:</b> descripción del KPI en la información sobre herramientas.</li><li><b>Menos visuales:</b> cada uno debe responder una pregunta.</li></ul>
<p>Looker Studio aplica los mismos principios y suele ser más simple para fuentes como Hojas de cálculo de Google ${V('conectores y límites vigentes')}. Si ya sabes uno, aprende las ideas: cambian los botones, no el criterio.</p>`,
example:`<p>El jefe de operaciones de «Retail Andino» (ficticio) abre el tablero a las 8:30. En diez segundos quiere saber si hoy hay algo que atender: las tarjetas le dicen que la cancelación subió, la matriz le muestra dónde, y la tabla de excepciones le da los pedidos a los que debe llamar.</p>`,
ex:{type:'match',intro:'Une cada pregunta con el visual más adecuado.',opts:['Tarjeta KPI','Línea de tendencia','Barras ordenadas','Matriz o mapa de calor','Tabla de excepciones'],items:[
{t:'¿Cómo va el On Time de hoy frente a la semana pasada?',a:'Tarjeta KPI'},
{t:'¿Cómo evoluciona la cancelación día a día?',a:'Línea de tendencia'},
{t:'¿Qué motivo explica más cancelaciones?',a:'Barras ordenadas'},
{t:'¿En qué tienda y categoría se concentra el problema?',a:'Matriz o mapa de calor'},
{t:'¿A qué pedidos debo llamar hoy?',a:'Tabla de excepciones'}],
sol:'<p>Bien. Con esas cinco piezas ya tienes el esqueleto del tablero del caso final.</p>'},
quiz:[
{q:'Antes de elegir gráficos, definimos…',o:['La paleta de colores','Quién lo usa y qué decisión toma','El tamaño de la pantalla','El logo'],a:1,w:'La decisión manda.'},
{q:'Para mostrar el ranking de motivos de cancelación usas…',o:['Un gráfico circular con 12 porciones','Barras ordenadas','Un mapa','Una línea'],a:1,w:'Las barras ordenadas se comparan mejor.'},
{q:'Un KPI sin comparación ni denominador…',o:['Es suficiente','No permite saber si el valor es bueno ni cómo se calculó','Es mejor','Es ilegal'],a:1,w:'Falta contexto.'}],
src:[['https://learn.microsoft.com/power-bi/guidance/star-schema','Microsoft Learn: guía de modelado (base para tableros consistentes)']],
ver:['Las reglas de diseño son criterios de práctica, sin norma formal. Detalles de Looker Studio (conectores, límites, precios): '+V('documentación de Google')]}
]});

MODS.push({id:'12',grp:'tools',title:'12. Integración y proyecto final',short:'Alertas, automatización y proyecto de portafolio',blurb:'Une datos, dashboards y automatización en un proyecto guiado para tu portafolio.',ch:[
{id:'12.1',title:'Actualización, alertas y Power BI con Power Automate',min:20,
goal:'Mantener el tablero actualizado y conectar una alerta de Power BI con un flujo que avise y registre.',
body:`<h3>Actualización de datos</h3>
<ul><li>Con modo <b>Importar</b> los datos se guardan en el modelo y se actualizan por horario. Con <b>DirectQuery</b> o conexión en vivo, la mayoría de los datos no dependen de la actualización programada.</li><li>Para una base <b>SQL Server local</b> hace falta una <b>puerta de enlace de datos</b> (gateway); Microsoft tiene un tutorial paso a paso.</li><li>En capacidad compartida hay un máximo de horarios diarios de actualización (la documentación menciona hasta ocho) y la actualización programada se pausa tras dos meses de inactividad del modelo ${V('límites vigentes según licencia')}.</li><li>Power BI no ofrece intervalo mensual; con Power Automate puedes crear uno personalizado.</li></ul>
<h3>Alertas de datos</h3>
<p>Las alertas se crean en el <b>servicio</b> de Power BI (no en Desktop), sobre mosaicos de un <b>dashboard</b> anclados desde visuales de tipo <b>tarjeta, KPI o medidor</b>. Puedes integrarlas con Power Automate: el disparador «Cuando se activa una alerta basada en datos» arranca un flujo que envía a Teams, correo o crea un elemento en una lista. Límites documentados: hasta 250 alertas por persona y sin co-propiedad (si cambias de dueño hay que recrear la alerta y el flujo) ${V('licencias necesarias para usar alertas con Power Automate')}.</p>
<h3>Cuidado con la fatiga de alertas</h3>
<p>Microsoft advierte que el uso excesivo de alertas degrada la efectividad de un flujo. Para evitarlo: umbrales basados en el <b>límite de control</b> (capítulo 10.5), no en la intuición; una alerta por problema, no cinco; un dueño claro; y revisar trimestralmente cuáles se ignoran.</p>`,
example:`<p>«Retail Andino» (ficticio) fija una alerta cuando el On Time diario cae por debajo del LCL. El flujo publica en el canal de operaciones y crea una incidencia en la lista de incidencias con estado «Nuevo». Así cierras el ciclo del capítulo 11.1: la alerta se convierte en un registro con responsable.</p>`,
ex:{type:'flow',intro:'Flujo de referencia: de la alerta de Power BI a una incidencia registrada.',steps:[
{k:'trigger',t:'Cuando se activa una alerta basada en datos (Power BI)',d:'Elige la alerta creada sobre la tarjeta de On Time del dashboard. Recuerda que las alertas no se crean en Desktop.'},
{k:'action',t:'Obtener el valor y la hora',d:'Usa el contenido dinámico de la alerta y <code>convertTimeZone(...)</code> para hora de Lima.'},
{k:'cond',t:'¿Valor bajo el umbral crítico?',d:'Sí: avisa al canal y crea incidencia. No: solo registra, sin avisar (evita ruido).'},
{k:'action',t:'Publicar mensaje en Teams',d:'Incluye KPI, valor, umbral y enlace al tablero. Sin datos personales.'},
{k:'action',t:'Crear elemento en la lista de incidencias',d:'Categoría «Alerta de KPI», estado «Nuevo», responsable de turno.'},
{k:'end',t:'Resultado: alerta con dueño y trazabilidad',d:'Falta el bloque Try/Catch del capítulo 11.5 para saber si el flujo falla.'}],
task:'Define umbral, destinatarios y horario para no generar fatiga de alertas.',
sol:'<ul><li><b>Umbral:</b> el LCL del On Time diario calculado con un periodo estable (capítulo 10.5), no un número «que se ve mal».</li><li><b>Destinatarios:</b> el responsable de turno primero; escalar al jefe si no se atiende en un tiempo definido.</li><li><b>Horario:</b> solo en horario operativo, y una sola alerta por día por el mismo problema.</li><li><b>Revisión:</b> cada trimestre, retirar las alertas que nadie usa.</li></ul>'},
quiz:[
{q:'¿Dónde se crean las alertas de datos de Power BI?',o:['En Power BI Desktop','En el servicio de Power BI, sobre mosaicos de un dashboard','En Excel','En Outlook'],a:1,w:'No están disponibles en Desktop.'},
{q:'Para actualizar automáticamente datos desde una base SQL Server local se usa…',o:['Una puerta de enlace de datos','Un correo','Un PDF','Nada'],a:0,w:'El gateway conecta el servicio con la fuente local.'},
{q:'¿Cómo reduces la fatiga de alertas?',o:['Más alertas','Umbrales basados en límites de control, un dueño y revisión periódica','Alertas cada minuto','Sin dueño'],a:1,w:'Menos alertas, mejor definidas.'}],
src:[['https://learn.microsoft.com/en-us/power-bi/refresh-scheduled-refresh','Microsoft Learn: actualización programada de Power BI'],['https://learn.microsoft.com/en-us/power-bi/connect-data/service-gateway-sql-tutorial','Microsoft Learn: actualizar desde SQL Server local con gateway'],['https://learn.microsoft.com/en-nz/power-bi/create-reports/service-set-data-alerts','Microsoft Learn: alertas de datos en el servicio de Power BI'],['https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/error-handling','Microsoft Learn: advertencia sobre uso excesivo de alertas']],
ver:['Requisitos de licencia (Pro, Premium) para alertas con Power Automate: '+V('consultar la documentación y a TI'),'Nombres de los disparadores y acciones de Power BI en el conector de Power Automate: '+V('probar en tu entorno')]},

{id:'12.2',title:'Mini proyecto integrador: incidencias de punta a punta',min:20,
goal:'Armar una pieza de portafolio que una Forms, Lists, Power Automate, un modelo de datos y Power BI, con datos ficticios.',
body:`<p>Este capítulo no explica algo nuevo: te pide <b>construir</b>. Es el proyecto que puedes enseñar en una entrevista y que demuestra juntos los módulos de datos, estadística y automatización.</p>
<p><b>El caso:</b> un retailer ficticio necesita registrar incidencias operativas, medir cuánto tardan en resolverse y alertar cuando algo se sale de lo normal.</p>
<h3>Reglas del proyecto</h3>
<ul><li><b>Datos ficticios.</b> Genera unas 200 incidencias con una historia oculta (por ejemplo, una causa que se concentra en una tienda desde cierta fecha). No uses datos reales de ningún empleador.</li><li><b>Sin datos personales.</b> Número de pedido ficticio, sin nombres ni teléfonos.</li><li><b>Documenta límites.</b> Qué no hace tu proyecto y qué asumiste.</li></ul>
<h3>Cómo presentarlo (90 segundos)</h3>
<p><b>Problema</b> (una frase), <b>solución</b> (Forms + Lists + flujo + tablero), <b>resultado medible</b> (tiempo de registro, tiempo medio y p90 de resolución) y <b>aprendizaje</b> (qué harías distinto). Si lo puedes contar sin mirar la pantalla, lo dominas.</p>`,
example:`<p>Entrevistador: «¿Qué construiste con Power Automate?» Tú: «Un flujo que registra incidencias desde un formulario en una lista con causa, tienda y severidad, y avisa al responsable. Sobre esa lista armé un tablero con un Pareto de causas y una alerta basada en límites de control. Con datos ficticios, el registro pasó de unos 4 minutos a 1. Lo que haría distinto: añadir un cierre de ciclo con aprobación para las incidencias graves.»</p>`,
ex:{type:'check',id:'12.2',intro:'Checklist del proyecto. Marca a medida que avances.',items:[
'Definí el problema y quién usará el tablero, y qué decisión tomará',
'Formulario con listas desplegables y sin datos personales',
'Lista con columnas tipadas: categoría, causa, tienda, severidad, estado, fecha de registro y de cierre',
'Flujo con Try/Catch, aviso de error y ficha del flujo',
'Datos ficticios suficientes (unas 200 filas) con una concentración que se pueda descubrir',
'Modelo simple: hecho de incidencias más dimensiones de fecha, tienda, categoría y causa',
'Medidas: total, % por causa, tiempo medio y p90 de resolución, variación frente a la semana anterior',
'Tablero de una página con filtros, tarjetas, tendencia, Pareto y tabla de excepciones',
'Alerta con umbral basado en un límite de control, conectada a un flujo',
'README: problema, decisiones, límites, datos ficticios y cómo reproducirlo',
'Guion de 90 segundos ensayado en voz alta'],
also:{type:'reveal',intro:'Cuando termines, compara tu enfoque.',task:'¿Qué historia oculta pondrías en los datos ficticios para que el análisis tenga algo que descubrir?',
sol:'<p>Ideas: una causa («producto sin ubicar») que se concentra en una tienda y una categoría a partir de una fecha; un aumento del tiempo de resolución en un turno; o un responsable que acumula incidencias abiertas. Lo importante es que <b>la historia exista y esté oculta</b>, para que tu tablero y tu análisis la descubran, como en el caso final del curso base.</p>'}},
quiz:[
{q:'¿Puedes usar datos reales de un empleador anterior en tu proyecto?',o:['Sí','No; usa datos ficticios','Solo los de este año','Solo sin fechas'],a:1,w:'Confidencialidad y riesgo legal.'},
{q:'Un buen resultado para el proyecto es…',o:['«Quedó bonito»','Un dato medible, como el tiempo de registro o de resolución','Muchas páginas','Muchos colores'],a:1,w:'Concreto y verificable.'},
{q:'¿Qué añade valor a un proyecto de portafolio?',o:['Ocultar los límites','Explicar decisiones y límites con honestidad','Copiar plantillas sin entenderlas','Usar muchos visuales'],a:1,w:'Muestra criterio.'}],
src:[['https://learn.microsoft.com/power-bi/guidance/star-schema','Microsoft Learn: esquema en estrella'],['https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/error-handling','Microsoft Learn: manejo de errores'],['https://learn.microsoft.com/en-nz/power-bi/create-reports/service-set-data-alerts','Microsoft Learn: alertas de datos']],
ver:['Cómo conectar Power BI a una lista de SharePoint o de Microsoft Lists en tu tenant: '+V('probar en tu entorno')]}
]});
