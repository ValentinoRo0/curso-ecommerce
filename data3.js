MODS.push({id:'3',title:'3. KPIs y reportes',short:'On Time, OTIF, NPS, Excel, SQL, Power BI',blurb:'Fórmulas con su denominador correcto y cómo calcularlas en Power Query, SQL Server y Power BI.',ch:[
{id:'3.1',title:'Diccionario de KPIs y la trampa del denominador',min:20,
goal:'Definir On Time, Off Time, cancelación, lead time y ticket promedio con el denominador correcto.',
body:`<p>Un KPI mal definido es peor que ninguno. Antes de calcular, responde siempre: <b>¿sobre qué universo?</b></p>
${T(['KPI','Fórmula','Denominador'],[
['On Time %','Pedidos entregados hasta la fecha o franja prometida / pedidos entregados','Entregados (no incluye cancelados)'],
['Off Time %','100% − On Time %, o entregados fuera de promesa / entregados','Entregados'],
['Tasa de cancelación %','Pedidos cancelados / pedidos creados','Creados'],
['Lead time','Fecha de entrega − fecha de compra, promedio (días u horas)','Entregados'],
['Ticket promedio','Ventas de pedidos entregados / número de pedidos entregados','Entregados']])}
<p>Errores clásicos: meter cancelados en el denominador del On Time (lo «mejora» o «empeora» artificialmente), mezclar días calendario con hábiles, o medir contra la fecha de compra en vez de la promesa. Si tu empresa define On Time por franja horaria y no por día, cambia la comparación: usa la definición interna y escríbela en el pie del reporte.</p>
<p>Tip de entrevista: cuando te pidan un KPI, empieza con «lo defino así, con este denominador, ¿es igual que lo que manejan ustedes?». Suena a analista.</p>`,
example:`<p>Si «Retail Andino» (ficticio) tiene 100 pedidos creados, 6 cancelados y 94 entregados, de los cuales 84 a tiempo: On Time = 84/94 = 89,4%. Si divides por 100 obtienes 84%, y eso castiga a operaciones por algo que no es entrega.</p>`,
ex:{type:'calc',data:true,lab:{t:'Laboratorio: On Time',fields:[{k:'e',l:'Entregados',v:94},{k:'a',l:'A tiempo',v:84},{k:'c',l:'Creados',v:100}],out:[{l:'On Time (sobre entregados)',u:'%',f:function(v){return 100*v.a/v.e}},{l:'Off Time',u:'%',f:function(v){return 100-100*v.a/v.e}},{l:'On Time mal calculado (sobre creados)',u:'%',f:function(v){return 100*v.a/v.c}}]},
task:'Con el CSV completo calcula On Time %, tasa de cancelación %, ticket promedio de entregados (S/) y lead time medio (días).',
parts:[{l:'On Time',u:'%',tol:0.1,fn:function(d){return K.ontime(d)}},{l:'Cancelación',u:'%',tol:0.1,fn:function(d){return K.cancelPct(d)}},{l:'Ticket promedio',u:'S/',tol:0.5,fn:function(d){return K.ticket(d)}},{l:'Lead time medio',u:'días',tol:0.05,fn:function(d){return K.leadDays(d)}}],
sol:function(v){return '<p>On Time <b>'+fmt(v[0])+'%</b>, cancelación <b>'+fmt(v[1])+'%</b>, ticket <b>S/ '+fmt(v[2])+'</b>, lead time <b>'+fmt(v[3],2)+' días</b>. Fíjate: On Time filtra <code>estado="Entregado"</code>; la cancelación usa todos los pedidos.</p>'}},
quiz:[
{q:'¿Cuál es el denominador correcto del On Time?',o:['Pedidos creados','Pedidos entregados','Pedidos cancelados','Pedidos del mes anterior'],a:1,w:'Un pedido cancelado no tuvo entrega que medir.'},
{q:'La tasa de cancelación se calcula sobre…',o:['Entregados','Creados','Facturados','Devueltos'],a:1,w:'Se cancela sobre lo que se creó.'},
{q:'100 creados, 10 cancelados, 90 entregados, 81 a tiempo. ¿On Time?',o:['81%','90%','91%','100%'],a:1,w:'81/90 = 90%.'}],
src:[['https://sourceday.com/blog/otif/','SourceDay: definición y fórmula de OTIF'],['https://kaizen.com/insights/otif-supply-chain-indicator/','Kaizen: OTIF, OTD y fill rate']],
ver:['On Time por fecha o por franja horaria y días calendario u hábiles: '+V('definición interna de cada empresa')]},

{id:'3.2',title:'Fill Rate, In Full y OTIF',min:20,
goal:'Calcular Fill Rate, pedidos completos y OTIF, y entender por qué OTIF no es el producto de On Time por In Full.',
body:`<ul><li><b>Fill Rate</b> (por unidades): unidades entregadas / unidades pedidas. Mide cuánto de lo pedido se logró surtir.</li><li><b>In Full %</b>: pedidos entregados completos / pedidos entregados.</li><li><b>OTIF</b> (On Time In Full): pedidos que cumplen <b>ambas</b> condiciones a la vez / pedidos entregados.</li></ul>
<p>Las fuentes coinciden en que OTIF es binario por pedido: si llega tarde o incompleto, falla. Y que solo cuenta la intersección: 96% a tiempo y 95% completos no dan 95,5% de OTIF, porque los fallos pueden estar en pedidos distintos. Algunas empresas miden OTIF por línea de pedido en vez de por pedido completo, lo que da valores más altos; confirma cuál usa la tuya.</p>
<p>Fill Rate puede verse alto incluso cuando muchos clientes recibieron pedidos parciales, porque promedia unidades. Por eso conviene mirar los tres juntos.</p>`,
example:`<p>Un pedido de tres unidades en «Retail Andino» (ficticio) llega a tiempo pero con dos: para Fill Rate aporta 2 de 3; para In Full es un fallo; para OTIF, un fallo. El cliente ya habrá calificado.</p>`,
ex:{type:'calc',lab:{t:'Laboratorio: Fill Rate',fields:[{k:'p',l:'Unidades pedidas',v:21},{k:'e',l:'Unidades entregadas',v:19}],out:[{l:'Fill Rate',u:'%',f:function(v){return 100*v.e/v.p}}]},
intro:'Diez pedidos entregados (datos sintéticos).',cols:['Pedido','Uds pedidas','Uds entregadas','A tiempo'],rows:[['O1',2,2,'Sí'],['O2',1,1,'Sí'],['O3',3,2,'Sí'],['O4',1,1,'No'],['O5',2,2,'No'],['O6',4,4,'Sí'],['O7',2,1,'No'],['O8',1,1,'Sí'],['O9',3,3,'Sí'],['O10',2,2,'Sí']],num:[1,2],
task:'Calcula el Fill Rate por unidades, el % de pedidos completos y el OTIF.',
parts:[{l:'Fill Rate',u:'%',tol:0.1,fn:function(r){var p=0,e=0;r.forEach(function(x){p+=x[1];e+=x[2]});return 100*e/p}},{l:'Pedidos completos',u:'%',tol:0.1,fn:function(r){return 100*r.filter(function(x){return x[1]===x[2]}).length/r.length}},{l:'OTIF',u:'%',tol:0.1,fn:function(r){return 100*r.filter(function(x){return x[1]===x[2]&&x[3]==='Sí'}).length/r.length}}],
sol:function(v){return '<p>Fill Rate = 19/21 = <b>'+fmt(v[0])+'%</b>. Completos: 8 de 10 = <b>'+fmt(v[1])+'%</b>. A tiempo: 7 de 10 = 70%. OTIF: solo O1, O2, O6, O8, O9 y O10 cumplen ambas = <b>'+fmt(v[2])+'%</b>, no 70% × 80% = 56%. Fill Rate se ve mejor porque promedia unidades.</p>'}},
quiz:[
{q:'OTIF cuenta un pedido como éxito cuando…',o:['Llega a tiempo','Llega completo','Llega a tiempo y completo','Se factura'],a:2,w:'Necesita ambas condiciones a la vez.'},
{q:'Fill Rate 96% no garantiza…',o:['Que haya stock','Que los clientes recibieron sus pedidos completos','Nada','Que se facturó'],a:1,w:'Se puede tener alto Fill Rate con muchos pedidos parciales.'},
{q:'OTIF por línea frente a por pedido completo…',o:['Da siempre menor','Suele dar mayor valor y hay que confirmar cuál se usa','Es igual','No existe'],a:1,w:'Cambia la unidad de conteo.'}],
src:[['https://sourceday.com/blog/otif/','SourceDay: OTIF, pedido vs línea'],['https://agilebrandguide.com/wiki/ecommerce/on-time-in-full-otif/','Agile Brand Guide: OTIF (solo cuenta la intersección)'],['https://kaizen.com/insights/otif-supply-chain-indicator/','Kaizen: OTIF, OTD, DIFOT y fill rate']],
ver:['Base de OTIF (entregados o programados) y unidad (pedido o línea): '+V('confirmar con el equipo')]},

{id:'3.3',title:'NPS y satisfacción',min:15,
goal:'Calcular NPS, interpretar promotores, pasivos y detractores, y conocer sus límites.',
body:`<p>El <b>Net Promoter Score</b> se basa en una pregunta: «del 0 al 10, ¿qué tan probable es que nos recomiendes?». Se agrupa así: <b>promotores</b> 9 y 10, <b>pasivos</b> 7 y 8, <b>detractores</b> 0 a 6. La fórmula es <code>NPS = % promotores − % detractores</code>, con rango de −100 a +100. Los pasivos cuentan en el total pero no suman ni restan. Lo desarrolló Fred Reichheld en Bain & Company en 2003.</p>
<p>En e-commerce el NPS suele ser <b>transaccional</b>: una encuesta después de la entrega. Por eso se mueve con On Time, completitud y trato del repartidor. Límites que debes conocer: pocas respuestas dan un valor inestable, quien responde no siempre representa al cliente promedio, y un número sin comentarios no dice qué arreglar.</p>
<p>No hay un NPS «bueno» universal: compáralo con tu propia serie histórica y con tu categoría, no con cifras de internet.</p>`,
example:`<p>«Retail Andino» (ficticio) cruza el NPS con la modalidad: retiro en tienda tiene más promotores que domicilio. Al leer los comentarios de los detractores, la mayoría menciona «llegó fuera de la franja». La causa es de despacho, no de producto.</p>`,
ex:{type:'calc',lab:{t:'Laboratorio: NPS',fields:[{k:'p',l:'Promotores',v:11},{k:'a',l:'Pasivos',v:5},{k:'d',l:'Detractores',v:4}],out:[{l:'NPS',f:function(v){var t=v.p+v.a+v.d;return t?100*(v.p-v.d)/t:0}}]},
intro:'Veinte respuestas (datos sintéticos): 10, 9, 9, 8, 7, 10, 6, 3, 9, 10, 8, 9, 5, 10, 9, 7, 2, 9, 10, 8.',
task:'Calcula % de promotores, % de detractores y el NPS.',
parts:[{l:'% promotores',u:'%',tol:0.1,fn:function(){var s=[10,9,9,8,7,10,6,3,9,10,8,9,5,10,9,7,2,9,10,8];return 100*s.filter(function(x){return x>=9}).length/s.length}},{l:'% detractores',u:'%',tol:0.1,fn:function(){var s=[10,9,9,8,7,10,6,3,9,10,8,9,5,10,9,7,2,9,10,8];return 100*s.filter(function(x){return x<=6}).length/s.length}},{l:'NPS',tol:0.1,fn:function(){var s=[10,9,9,8,7,10,6,3,9,10,8,9,5,10,9,7,2,9,10,8];return 100*(s.filter(function(x){return x>=9}).length-s.filter(function(x){return x<=6}).length)/s.length}}],
sol:function(v){return '<p>Promotores: 11 de 20 = <b>'+fmt(v[0])+'%</b>. Detractores: 4 de 20 = <b>'+fmt(v[1])+'%</b>. NPS = 55 − 20 = <b>'+fmt(v[2])+'</b>. Los 5 pasivos no suman ni restan, pero sí están en el denominador.</p>'}},
quiz:[
{q:'¿Quiénes son detractores?',o:['0 a 6','7 y 8','9 y 10','Solo el 0'],a:0,w:'0 a 6.'},
{q:'¿Los pasivos entran al denominador?',o:['No','Sí, cuentan en el total aunque no sumen ni resten','Solo si son muchos','Depende del día'],a:1,w:'Se calculan porcentajes sobre todas las respuestas.'},
{q:'Con 8 respuestas, ¿qué cuidado tomas?',o:['Ninguno','Cuidado: el valor es muy inestable con tan poca muestra','Doblas el NPS','Lo comparas con internet'],a:1,w:'Un solo cambio mueve mucho el resultado.'}],
src:[['https://www.productplan.com/glossary/net-promoter-score','ProductPlan: fórmula y grupos del NPS'],['https://uschamber.com/co/grow/marketing/net-promoter-score','U.S. Chamber of Commerce: NPS'],['https://1up.ai/net-promoter-score-nps','1up: origen del NPS (Bain, 2003)']],
ver:['Escala, momento de encuesta y objetivos internos de NPS: '+V('definición interna')]},

{id:'3.4',title:'Cálculo en Excel y Power Query',min:20,
goal:'Calcular On Time y cancelaciones con fórmulas y con una consulta de Power Query reutilizable.',
body:`<p>Pega el CSV de «Datos sintéticos» en Excel. Columnas: A id, B fecha, C canal, D vendedor, E tienda, F modalidad, G categoría, H uds, I uds_ent, J monto, K estado, L motivo, M prometida, N entrega.</p>
<h3>Con fórmulas</h3>
<pre><code>Columna O (a_tiempo):
=SI(K2&lt;&gt;"Entregado";"";SI(N2&lt;=M2;1;0))

On Time global:
=SUMA(O:O)/CONTAR.SI(K:K;"Entregado")

Cancelación de una tienda (E2 = tienda):
=CONTAR.SI.CONJUNTO(E:E;"Surco";K:K;"Cancelado")/CONTAR.SI(E:E;"Surco")</code></pre>
<p>Si tu Excel usa comas en vez de punto y coma, cambia el separador. Si las fechas se importan como texto ISO (AAAA-MM-DD), comparan bien igualmente; si las conviertes, hazlo en ambas columnas.</p>
<h3>Con Power Query (reutilizable)</h3>
<pre><code>let
  Origen = Excel.CurrentWorkbook(){[Name="Pedidos"]}[Content],
  Tipos = Table.TransformColumnTypes(Origen,{{"prometida", type date},{"entrega", type date}}),
  OnTime = Table.AddColumn(Tipos, "a_tiempo", each if [estado]="Entregado" and [entrega] &lt;= [prometida] then 1 else 0, Int64.Type),
  Entregados = Table.SelectRows(OnTime, each [estado]="Entregado"),
  PorTienda = Table.Group(Entregados, {"tienda"}, {{"entregados", each Table.RowCount(_), Int64.Type},{"a_tiempo", each List.Sum([a_tiempo]), Int64.Type}}),
  Pct = Table.AddColumn(PorTienda, "pct_on_time", each [a_tiempo]/[entregados], Percentage.Type)
in
  Pct</code></pre>
<p>Ventaja frente a fórmulas: mañana reemplazas el CSV y pulsas <i>Actualizar todo</i>; el reporte diario se recalcula solo. Si sabes macros, una sola macro que actualice y exporte a PDF cierra el ciclo.</p>`,
example:`<p>Tu jefe pide «On Time por tienda de ayer» a las 9:05. Con Power Query cargas el archivo del OMS, actualizas y copias la tabla. Con fórmulas repites pasos manuales cada día y aumenta el riesgo de arrastrar mal una fila.</p>`,
ex:{type:'calc',data:true,task:'Calcula el On Time de Surco y de Chorrillos, y el número de pedidos entregados de Chorrillos.',
parts:[{l:'On Time Surco',u:'%',tol:0.1,fn:function(d){return K.ontime(d.filter(function(r){return r.tienda==='Surco'}))}},{l:'On Time Chorrillos',u:'%',tol:0.1,fn:function(d){return K.ontime(d.filter(function(r){return r.tienda==='Chorrillos'}))}},{l:'Entregados en Chorrillos',tol:0,fn:function(d){return d.filter(function(r){return r.tienda==='Chorrillos'&&r.estado==='Entregado'}).length}}],
sol:function(v){return '<p>Surco <b>'+fmt(v[0])+'%</b>, Chorrillos <b>'+fmt(v[1])+'%</b>, con <b>'+v[2]+'</b> pedidos entregados en Chorrillos. Verifica que tu consulta filtra entregados antes de agrupar; si no, tu On Time baja artificialmente.</p>'}},
quiz:[
{q:'Ventaja principal de Power Query sobre fórmulas manuales:',o:['Es más bonito','El proceso se repite al actualizar la fuente','No necesita datos','Reemplaza al ERP'],a:1,w:'Reproducibilidad y menos pasos manuales.'},
{q:'¿Dónde filtras «Entregado» al calcular On Time?',o:['Nunca','Antes de agrupar o dividir','Después de mostrar','Solo en el gráfico'],a:1,w:'Define el universo del denominador.'},
{q:'Tu Excel pide «;» y no «,». ¿Qué significa?',o:['Está roto','Depende de la configuración regional del sistema','Es otra versión de Excel obligatoria','No importa'],a:1,w:'El separador de argumentos depende de la configuración regional.'}],
src:[],
ver:['Sintaxis de Excel, Power Query (M) y separadores según tu versión y configuración regional: '+V('probar en tu Excel; consultar documentación de Microsoft Learn')]},

{id:'3.5',title:'Cálculo en SQL Server y Power BI',min:20,
goal:'Escribir la misma métrica en T-SQL y en Power BI, y comparar con la de Excel.',
body:`<h3>T-SQL (SQL Server)</h3>
<pre><code>SELECT tienda,
       COUNT(*) AS entregados,
       SUM(CASE WHEN fecha_entrega &lt;= fecha_prometida THEN 1 ELSE 0 END) AS a_tiempo,
       CAST(100.0 * SUM(CASE WHEN fecha_entrega &lt;= fecha_prometida THEN 1 ELSE 0 END)
            / COUNT(*) AS DECIMAL(5,1)) AS pct_on_time
FROM pedidos
WHERE estado = 'Entregado'
GROUP BY tienda;

-- Cancelación por tienda (sobre creados)
SELECT tienda,
       CAST(100.0 * SUM(CASE WHEN estado = 'Cancelado' THEN 1 ELSE 0 END) / COUNT(*) AS DECIMAL(5,1)) AS pct_cancelacion
FROM pedidos
GROUP BY tienda;</code></pre>
<p>Detalle importante: <code>100.0 *</code> fuerza decimales; sin él, la división de enteros en SQL Server trunca el resultado.</p>
<h3>Power BI: dos medidas mínimas</h3>
<p>Primero crea en Power Query una columna <code>a_tiempo</code> (1 o 0) como en el capítulo anterior. Luego, tres medidas cortas:</p>
<pre><code>Entregados = CALCULATE(COUNTROWS(Pedidos), Pedidos[estado] = "Entregado")
A tiempo = CALCULATE(SUM(Pedidos[a_tiempo]), Pedidos[estado] = "Entregado")
% On Time = DIVIDE([A tiempo], [Entregados])</code></pre>
<p>No hace falta más DAX para este nivel. Usa <code>DIVIDE</code> para evitar errores por cero. La misma lógica que viste en Excel y SQL, pero como medida reutilizable en cualquier visual.</p>
<p>Regla de oro: <b>la misma fórmula debe dar el mismo número en las tres herramientas</b>. Si no, hay diferencia de denominador o de filtro.</p>`,
example:`<p>Si tu dashboard de Power BI muestra 88,4% y tu Excel 87,5%, empieza por el denominador: ¿uno incluye cancelados? ¿uno excluye pedidos del último día por corte de extracción? La diferencia casi siempre está ahí.</p>`,
ex:{type:'calc',intro:'Resultado intermedio de una consulta por tienda (datos sintéticos).',cols:['Tienda','Entregados','A tiempo'],rows:[['A',40,36],['B',25,20],['C',35,34]],num:[1,2],
task:'Calcula el On Time de B, el global ponderado y el promedio simple de los tres porcentajes.',
parts:[{l:'On Time B',u:'%',tol:0.1,fn:function(r){return 100*r[1][2]/r[1][1]}},{l:'On Time global',u:'%',tol:0.1,fn:function(r){var e=0,a=0;r.forEach(function(x){e+=x[1];a+=x[2]});return 100*a/e}},{l:'Promedio simple de %',u:'%',tol:0.1,fn:function(r){var s=0;r.forEach(function(x){s+=100*x[2]/x[1]});return s/r.length}}],
sol:function(v){return '<p>B = 20/25 = <b>'+fmt(v[0])+'%</b>. Global = 90/100 = <b>'+fmt(v[1])+'%</b>. El promedio simple de los tres porcentajes da <b>'+fmt(v[2])+'%</b>: es distinto porque no pondera por volumen. En un reporte usa siempre la versión ponderada.</p>'}},
quiz:[
{q:'En SQL Server, sin «100.0 *» en la división de dos enteros…',o:['Da decimales','Trunca a entero','Falla','Da NULL siempre'],a:1,w:'La división entera trunca.'},
{q:'Ventaja de DIVIDE frente a «/» en DAX:',o:['Es más rápido','Maneja la división por cero','Cambia el color','Filtra entregados'],a:1,w:'Devuelve vacío o valor alternativo en lugar de error.'},
{q:'Excel da 87,5% y Power BI 88,4%. Primero revisas…',o:['El color','Denominador y filtros','El logo','La fuente'],a:1,w:'Casi siempre es la definición del universo.'}],
src:[],
ver:['Sintaxis T-SQL y DAX según tu versión de SQL Server y Power BI: '+V('validar en tu entorno; documentación de Microsoft Learn')]},

{id:'3.6',title:'Plantillas: reporte diario y reporte semanal de sellers',min:20,
goal:'Armar un reporte diario que se lee en dos minutos y un reporte semanal de sellers que provoca acciones.',
body:`<h3>Reporte diario (para operaciones)</h3>
<p>Orden sugerido: <b>1)</b> fecha y corte de datos. <b>2)</b> KPIs del día frente a meta y semana anterior: pedidos, On Time, cancelación, Fill Rate. <b>3)</b> Pedidos atorados con antigüedad. <b>4)</b> Cancelaciones por motivo y tienda. <b>5)</b> Stock: quiebres, ajustes y SKU críticos. <b>6)</b> Incidencias principales. <b>7)</b> Acciones y responsables para hoy.</p>
<p>Principio: <b>qué pasó, por qué, qué se hace</b>. Un número sin causa ni acción es decoración.</p>
<h3>Reporte semanal de sellers</h3>
${T(['Columna','Para qué'],[['Seller','Identificación'],['Pedidos','Volumen, para ponderar'],['Despachados a tiempo %','Cumplimiento de SLA de despacho'],['Cancelados por seller %','Fallas de stock o gestión del seller'],['Reclamos y devoluciones %','Calidad de producto y de información'],['Semáforo','Verde, amarillo, rojo según umbrales acordados']])}
<p>Los umbrales del semáforo los fija el negocio con el seller; no inventes cifras de referencia. Cierra el reporte con las tres acciones de la semana: a quién llamas, qué pides y cuándo revisas.</p>`,
example:`<p>El lunes envías a «Moda Rímac» (seller ficticio) su tabla con fechas y pedidos que fallaron, no solo un porcentaje. Un seller reacciona a una lista de pedidos concretos, no a un promedio.</p>`,
ex:{type:'calc',intro:'Semana de cuatro sellers (datos sintéticos).',cols:['Seller','Pedidos','Despachados a tiempo','Cancelados por seller'],rows:[['Tecnoandes',120,108,6],['Moda Rímac',80,60,10],['Hogar Sur',60,57,1],['Belleza Lima',40,38,0]],num:[1,2,3],
task:'Calcula % a tiempo de Moda Rímac, la cancelación global por seller y cuántos sellers quedan por debajo de 90% a tiempo.',
parts:[{l:'% a tiempo Moda Rímac',u:'%',tol:0.1,fn:function(r){return 100*r[1][2]/r[1][1]}},{l:'Cancelación global',u:'%',tol:0.1,fn:function(r){var p=0,c=0;r.forEach(function(x){p+=x[1];c+=x[3]});return 100*c/p}},{l:'Sellers bajo 90%',tol:0,fn:function(r){return r.filter(function(x){return 100*x[2]/x[1]<90}).length}}],
sol:function(v){return '<p>Moda Rímac = <b>'+fmt(v[0])+'%</b>. Cancelación global = 17/300 = <b>'+fmt(v[1])+'%</b>. Bajo 90%: solo Moda Rímac (<b>'+v[2]+'</b>); Tecnoandes está justo en 90,0%, no por debajo. El 90% es un umbral inventado para el ejercicio.</p>'}},
quiz:[
{q:'¿Qué debe tener todo bloque de un reporte diario?',o:['Solo números','Qué pasó, por qué y qué se hace','Solo gráficos','Solo texto'],a:1,w:'Cada bloque lleva causa y acción.'},
{q:'¿Por qué mostrar los pedidos concretos que fallaron a un seller?',o:['Para castigar','Porque actúa sobre casos, no sobre promedios','Por costumbre','No se debe'],a:1,w:'Sin casos no puede investigar.'},
{q:'¿Quién fija los umbrales del semáforo?',o:['Tú, inventándolos','El negocio con el seller, con datos históricos','Nadie','Internet'],a:1,w:'Debe ser un acuerdo, no una cifra suelta.'}],
src:[],
ver:['Formato exacto de reportes: el de tu empresa. Esta plantilla es una propuesta didáctica sin norma.']}
]});
