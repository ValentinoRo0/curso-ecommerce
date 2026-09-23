MODS.push({id:'7',grp:'log',title:'7. Logística de almacén y distribución',short:'Red, almacén, picking, última milla, costos, operadores',blurb:'Cómo se diseña y se mide la operación física que sostiene al e-commerce: nodos, almacén, personal, transporte y costo por pedido.',ch:[
{id:'7.1',title:'La red logística omnicanal: dónde sale cada pedido',min:20,
goal:'Comparar los nodos desde los que puede salir un pedido y elegir el más conveniente según promesa, costo y confiabilidad del stock.',
body:`<p>Un retailer omnicanal puede atender un pedido desde varios <b>nodos</b>:</p>
<ul><li><b>Centro de distribución (CD):</b> stock concentrado, picking eficiente, pero más lejos del cliente.</li><li><b>Tienda como nodo de despacho (ship-from-store):</b> cerca del cliente y rápida, pero el picking es más caro y el stock compite con los clientes de tienda.</li><li><b>Retiro en tienda:</b> el cliente hace el último tramo.</li><li><b>Almacén o tienda dedicada a online (dark store o micro-fulfillment):</b> un espacio pequeño solo para preparar pedidos; ideal para mismo día en zonas de alta demanda. Los nombres varían según la empresa ${V('terminología de cada empleador')}.</li><li><b>Cross-docking:</b> la mercadería se recibe y se despacha sin almacenarse.</li></ul>
<h3>Criterios para asignar un pedido</h3>
<p>El OMS (capítulo 1.1) evalúa, en algún orden de prioridad: <b>1)</b> stock disponible y confiable en el nodo, <b>2)</b> tiempo hasta la entrega frente a la promesa, <b>3)</b> capacidad de picking y despacho, <b>4)</b> costo total (picking, embalaje y transporte), <b>5)</b> si el pedido se puede cumplir desde <b>un solo nodo</b>. Dividir un pedido entre varios nodos aumenta el costo y la posibilidad de errores; Shopify, por ejemplo, documenta que un pedido que no puede atenderse con el inventario de una sola ubicación se divide en varias entregas.</p>
<p>La regla práctica: <b>el nodo que cumple la promesa, con stock confiable, al menor costo total</b>. Que un nodo esté cerca no basta si su stock es dudoso: por eso el capítulo 2.6 insiste en el stock desalineado.</p>`,
example:`<p>«Retail Andino» (ficticio) tiene un CD en el sur de Lima y cuatro tiendas. Un pedido de mismo día para Chorrillos con entrega en 6 horas no puede salir del CD, que tarda 8. Sale de una tienda cercana con stock confiable. Los números del ejercicio son inventados.</p>`,
ex:{type:'calc',intro:'Un pedido debe entregarse en 6 horas o menos. Datos sintéticos de los nodos:',cols:['Nodo','Picking + embalaje (S/)','Transporte (S/)','Horas hasta entrega','Stock confiable'],rows:[['CD Sur',4.0,9.0,8,'Sí'],['Tienda Surco',7.5,4.0,3,'Sí'],['Tienda Chorrillos',7.5,3.5,2,'No'],['Tienda San Miguel',7.5,6.0,5,'Sí']],num:[1,2,3],
task:'Calcula cuántos nodos son elegibles (cumplen el plazo y tienen stock confiable), el costo total del mejor y la diferencia con el elegible más caro.',
parts:[{l:'Nodos elegibles',tol:0,fn:function(r){return r.filter(function(x){return x[3]<=6&&x[4]==='Sí'}).length}},{l:'Costo del mejor nodo',u:'S/',tol:0.01,fn:function(r){var c=r.filter(function(x){return x[3]<=6&&x[4]==='Sí'}).map(function(x){return x[1]+x[2]});return Math.min.apply(null,c)}},{l:'Diferencia con el elegible más caro',u:'S/',tol:0.01,fn:function(r){var c=r.filter(function(x){return x[3]<=6&&x[4]==='Sí'}).map(function(x){return x[1]+x[2]});return Math.max.apply(null,c)-Math.min.apply(null,c)}}],
sol:function(v){return '<p>El CD no cumple el plazo (8 h) y Chorrillos, aunque es el más rápido, no tiene stock confiable. Quedan <b>'+v[0]+'</b> nodos: Surco (11,5) y San Miguel (13,5). El mejor cuesta <b>S/ '+fmt(v[1],2)+'</b> y la diferencia es de <b>S/ '+fmt(v[2],2)+'</b> por pedido. Multiplicado por miles de pedidos, esa diferencia importa.</p>'}},
quiz:[
{q:'Dividir un pedido entre varios nodos…',o:['Siempre es mejor','Suele aumentar el costo y el riesgo de error','No tiene efecto','Reduce el transporte siempre'],a:1,w:'Más envíos, más picking y más puntos de falla.'},
{q:'Un nodo cercano con stock poco confiable…',o:['Es la mejor opción siempre','Puede generar cancelaciones aunque esté cerca','Elimina el riesgo','No importa'],a:1,w:'La confiabilidad del stock pesa tanto como la distancia.'},
{q:'Cross-docking significa…',o:['Almacenar por meses','Recibir y despachar sin almacenar','Devolver al proveedor','Facturar'],a:1,w:'La mercadería pasa de un muelle a otro.'}],
src:[['https://help.shopify.com/en/manual/locations/managing-orders','Shopify Help: pedidos divididos por ubicación'],['https://help.vtex.com/en/docs/tutorials/order-flow-and-status','VTEX Help Center: flujo de pedido y reservas']],
ver:['Definiciones de dark store, micro-fulfillment y ship-from-store son de práctica general; cada empresa las usa con matices.','Las cifras del ejercicio son inventadas.']},

{id:'7.2',title:'El almacén por dentro: flujo, ubicaciones y métricas',min:20,
goal:'Recorrer el flujo de un almacén, entender cómo se ubican los productos y calcular cuatro métricas básicas.',
body:`<p>Un almacén de e-commerce recorre siempre las mismas etapas: <b>recepción</b> (se descarga y se cuenta), <b>control</b> (calidad y diferencias), <b>ubicación</b> (putaway: se asigna dónde guardar), <b>almacenamiento</b>, <b>reposición</b> de las ubicaciones de picking, <b>picking</b>, <b>packing</b>, <b>despacho</b> y, aparte, la logística inversa (capítulo 2.4).</p>
<h3>Ubicaciones y slotting</h3>
<p>Cada posición tiene un código (por ejemplo pasillo-módulo-nivel-posición) y el WMS sabe qué SKU está en cada una. El <b>slotting</b> decide dónde poner cada SKU: los de más rotación (clase A, capítulo 8.2) cerca del packing y a una altura cómoda, para reducir caminata, que suele ser la mayor parte del tiempo de picking. En perecibles se usa <b>FEFO</b> (sale primero lo que vence primero) en vez de FIFO.</p>
<h3>Cuatro métricas básicas</h3>
${T(['Métrica','Fórmula','Qué revela'],[
['Dock-to-stock','Hora en que el stock queda disponible − hora de llegada','Qué tan rápido lo recibido puede venderse'],
['Ocupación','Ubicaciones ocupadas / ubicaciones totales','Espacio disponible; una ocupación muy alta frena la operación'],
['Exactitud de inventario (IRA)','Ubicaciones o SKU contados sin diferencia / contados','Confiabilidad del stock (capítulo 2.5)'],
['Exactitud de picking','Pedidos sin error / pedidos preparados','Calidad de preparación']])}
<p>Estas definiciones son de práctica general; cada empresa las ajusta ${V('definición interna de cada métrica')}.</p>`,
example:`<p>Un camión con 1200 unidades llega a las 8:00 a un almacén de «Retail Andino» (ficticio). Si el stock recién se ve en el sistema a las 10:30, durante 2,5 horas esas unidades no se pueden vender, aunque estén dentro del almacén. En campañas, ese retraso equivale a ventas perdidas.</p>`,
ex:{type:'calc',intro:'Datos del día (sintéticos): el camión llegó a las 8:00 y el stock quedó disponible a las 10:30. Hay 840 ubicaciones ocupadas de 1000. Se contaron 200 ubicaciones y 184 no tuvieron diferencia. Se prepararon 1500 pedidos y 21 tuvieron error.',
task:'Calcula el dock-to-stock, la ocupación, el IRA y la exactitud de picking.',
parts:[{l:'Dock-to-stock',u:'horas',tol:0.01,fn:function(){return 2.5}},{l:'Ocupación',u:'%',tol:0.1,fn:function(){return 100*840/1000}},{l:'IRA',u:'%',tol:0.1,fn:function(){return 100*184/200}},{l:'Exactitud de picking',u:'%',tol:0.1,fn:function(){return 100*(1500-21)/1500}}],
sol:function(v){return '<p>Dock-to-stock = <b>'+fmt(v[0])+' h</b>. Ocupación = 840/1000 = <b>'+fmt(v[1])+'%</b>. IRA = 184/200 = <b>'+fmt(v[2])+'%</b>. Exactitud de picking = 1479/1500 = <b>'+fmt(v[3])+'%</b>. Un 92% de IRA significa que 1 de cada 12 ubicaciones contadas tenía diferencia: ahí nacen las cancelaciones por producto sin ubicar.</p>'}},
quiz:[
{q:'El slotting busca…',o:['Ubicar el stock por orden alfabético','Reducir la caminata poniendo lo que más rota cerca del packing','Aumentar los costos','Eliminar el WMS'],a:1,w:'La caminata suele ser lo que más tiempo consume en el picking.'},
{q:'FEFO se usa cuando…',o:['Hay mucho stock','Los productos vencen y sale primero lo que vence antes','El producto es electrónico','Se cambia el precio'],a:1,w:'First Expired, First Out.'},
{q:'Una ocupación de 98% del almacén puede…',o:['Ser ideal siempre','Frenar la operación por falta de espacio para mover','Mejorar el IRA','Eliminar el dock-to-stock'],a:1,w:'Sin espacio libre, todo es más lento.'}],
src:[['https://help.vtex.com/en/docs/tutorials/order-flow-and-status','VTEX Help Center: la reserva de ítems depende del inventario actualizado']],
ver:['Métricas y fórmulas de almacén: práctica general de la industria, sin norma.','Cifras del ejercicio inventadas.']},

{id:'7.3',title:'Picking avanzado y cuánto personal necesitas',min:20,
goal:'Dimensionar el personal de picking para un día normal y para un día pico, y entender qué cuellos de botella limitan la capacidad.',
body:`<p>La fórmula base para dimensionar picking parte de la <b>carga de trabajo</b>:</p>
<pre><code>Líneas a preparar = pedidos × líneas por pedido
Productividad por picker = líneas por hora (LPH) × horas efectivas por turno
Pickers necesarios = líneas a preparar / productividad por picker
Con ausentismo = pickers necesarios / (1 − ausentismo)</code></pre>
<p>Siempre se redondea <b>hacia arriba</b> y se dimensiona para el <b>día pico</b>, no para el promedio (capítulo 10.1: los picos importan más que la media). Las <b>horas efectivas</b> descuentan descansos, capacitación y esperas.</p>
<h3>Qué limita la capacidad</h3>
<ul><li><b>Packing:</b> a veces el cuello de botella no está en el picking sino en el embalaje o en la etiquetación.</li><li><b>Cortes y ondas:</b> si todos los pedidos entran justo antes del corte, se forma un pico de trabajo.</li><li><b>Reposición:</b> si las ubicaciones de picking se quedan vacías, el picker espera.</li><li><b>Caminata:</b> el slotting (capítulo 7.2) reduce el tiempo sin valor.</li></ul>
<p>Al picking por lote, por zona y por oleadas (capítulo 2.2) se suman técnicas como <b>put wall</b> (muro donde se reparten los productos de un lote a cada pedido) para separar pedidos más rápido ${V('técnicas y nombres según la operación')}.</p>`,
example:`<p>En Cyber Wow, «Retail Andino» (ficticio) recibe seis veces los pedidos de un día normal. El equipo de siempre no alcanza, y contratar personal el mismo día no funciona si no está capacitado. Por eso el dimensionamiento se hace semanas antes, con el pronóstico del capítulo 8.1.</p>`,
ex:{type:'calc',lab:{t:'Laboratorio: pickers necesarios',fields:[{k:'p',l:'Pedidos',v:1800},{k:'l',l:'Líneas por pedido',v:2.4},{k:'r',l:'Líneas por hora (LPH)',v:60},{k:'h',l:'Horas efectivas',v:6.5},{k:'a',l:'Ausentismo (%)',v:8}],out:[{l:'Pickers (sin ausentismo)',f:function(v){return v.p*v.l/(v.r*v.h)},d:2},{l:'Pickers con ausentismo',f:function(v){return v.p*v.l/(v.r*v.h)/(1-v.a/100)},d:2}]},
intro:'Día pico (datos sintéticos): 1800 pedidos, 2,4 líneas por pedido, 60 líneas por hora por picker, 6,5 horas efectivas por turno y 8% de ausentismo.',
task:'Calcula los pickers necesarios sin ausentismo, redondeados hacia arriba, y con ausentismo (también redondeado).',
parts:[{l:'Pickers sin ausentismo (exacto)',tol:0.05,fn:function(){return 1800*2.4/(60*6.5)}},{l:'Redondeado hacia arriba',tol:0,fn:function(){return Math.ceil(1800*2.4/(60*6.5))}},{l:'Con ausentismo, redondeado',tol:0,fn:function(){return Math.ceil(1800*2.4/(60*6.5)/0.92)}}],
sol:function(v){return '<p>Líneas = 1800 × 2,4 = 4320. Productividad = 60 × 6,5 = 390 líneas por picker. Pickers = 4320/390 = <b>'+fmt(v[0],2)+'</b>, o <b>'+v[1]+'</b> al redondear. Con 8% de ausentismo: 11,08 / 0,92 = 12,04, así que necesitas <b>'+v[2]+'</b>. La diferencia entre 11 y 13 personas es lo que separa una campaña fluida de una con retrasos.</p>'}},
quiz:[
{q:'¿Para qué día dimensionas el personal?',o:['Para el promedio','Para el día pico esperado','Para el domingo','Para el peor día del año pasado siempre'],a:1,w:'Un promedio subestima los picos.'},
{q:'Un put wall sirve para…',o:['Guardar cajas','Repartir productos de un lote entre pedidos','Medir el ausentismo','Emitir comprobantes'],a:1,w:'Se usa tras el picking por lote.'},
{q:'Si el picking va bien pero los pedidos se atrasan, ¿dónde miras?',o:['Solo en picking','En packing, reposición y cortes también','Solo en marketing','En el ERP contable'],a:1,w:'El cuello de botella puede estar en otra etapa.'}],
src:[['https://help.vtex.com/en/docs/tutorials/order-flow-and-status','VTEX Help Center: estados del pedido (Ready for handling, Invoiced)']],
ver:['La fórmula de dimensionamiento es un modelo didáctico. Productividades reales (LPH) dependen del layout, del tipo de producto y de la medición de cada empresa.','Cifras del ejercicio inventadas.']},

{id:'7.4',title:'Transporte y última milla en Lima',min:20,
goal:'Entender cómo se organiza la entrega final, qué la vuelve cara y cómo se calcula el costo real de una entrega considerando reintentos.',
body:`<p>La <b>última milla</b> es el tramo final, del último nodo al cliente. Se cubre con <b>flota propia</b>, <b>operadores logísticos</b> o <b>couriers</b> y, en zonas urbanas, con <b>motos</b>. Las notas de prensa peruanas la describen como el eslabón más débil de la cadena: en Lima el tráfico, la informalidad y la falta de estandarización la vuelven difícil, y hay retailers que terminan internalizando parte de la operación por falta de operadores confiables. Son opiniones de un sector; para tus cifras usa datos de tu empresa.</p>
<h3>Qué pasa cuando una entrega falla</h3>
<p>Un reintento consume otra parada, tiempo del repartidor y comunicación con el cliente. Un artículo de prensa sobre México estima cerca de 8% de fallos al primer intento y que la última milla puede representar más de la mitad del costo de envío; es un dato de otro país y de una estimación de terceros, útil solo para dimensionar el problema ${V('cifras equivalentes para Perú')}.</p>
<p>El KPI clave es el <b>éxito al primer intento</b>: entregas completadas al primer intento / pedidos despachados. Se mejora con <b>direcciones validadas y con referencia</b>, aviso previo al cliente por mensaje o WhatsApp, franjas horarias, y prueba de entrega (foto o firma). Cada traslado de mercadería también requiere su documento (guía de remisión, capítulo 5.1).</p>
<p>Un buen seguimiento de operadores exige indicadores por zona (a tiempo, primer intento, fallos, rechazos, daños), no solo un resumen mensual global.</p>`,
example:`<p>En Lima, un edificio sin número visible o un cliente ausente hacen que la moto pierda 15 minutos. Con 40 paradas por ruta, esos minutos se acumulan y las últimas entregas llegan fuera de franja. Un campo obligatorio de referencia en el checkout suele rendir más que una moto extra.</p>`,
ex:{type:'calc',intro:'Ruta de un día (datos sintéticos): costo del vehículo con repartidor S/ 180, 40 paradas planificadas, 15% de entregas fallidas al primer intento. Cada reintento consume una parada adicional al costo de una parada normal. Todas se entregan al final.',
task:'Calcula las paradas fallidas, el costo total del día con reintentos, el costo por entrega y cuánto sube el costo respecto a una ruta sin fallos.',
parts:[{l:'Paradas fallidas',tol:0,fn:function(){return 0.15*40}},{l:'Costo total del día',u:'S/',tol:0.01,fn:function(){return 180+0.15*40*(180/40)}},{l:'Costo por entrega',u:'S/',tol:0.01,fn:function(){return (180+0.15*40*(180/40))/40}},{l:'Aumento frente a una ruta sin fallos',u:'%',tol:0.1,fn:function(){var b=180/40,c=(180+0.15*40*b)/40;return 100*(c-b)/b}}],
sol:function(v){return '<p>Fallidas = 15% de 40 = <b>'+v[0]+'</b>. Costo por parada = 180/40 = 4,50. Costo total = 180 + 6 × 4,50 = <b>S/ '+fmt(v[1],2)+'</b>. Por entrega = <b>S/ '+fmt(v[2],3)+'</b>, un <b>'+fmt(v[3])+'%</b> más que los 4,50 de una ruta perfecta. Y no incluye el costo de atención al cliente ni el impacto en el NPS.</p>'}},
quiz:[
{q:'El éxito al primer intento mide…',o:['Entregas hechas al primer intento sobre pedidos despachados','Pedidos creados sobre despachados','El ticket promedio','La rapidez del picking'],a:0,w:'Es un KPI clave de la última milla.'},
{q:'¿Qué puede reducir los fallos por dirección?',o:['Cobrar más','Direcciones validadas y con referencia, y aviso previo','Más motos siempre','Menos ventanas'],a:1,w:'Ataca la causa, no el síntoma.'},
{q:'Una cifra de otro país sobre costos de última milla…',o:['Se copia a tu reporte','Solo sirve como referencia de magnitud, no como dato propio','Es un dato oficial de Perú','No existe'],a:1,w:'Usa datos de tu operación.'}],
src:[['https://andina.pe/agencia/noticia-cinco-desafios-debe-superar-sector-logistico-peru-para-continuar-su-crecimiento-1034330.aspx','Andina (2025): desafíos del sector logístico en Perú, incluida la última milla'],['https://www.elmostrador.cl/agenda-pais/2020/08/05/la-ultima-milla-el-talon-de-aquiles-del-e-commerce/','El Mostrador (Chile, 2020): indicadores para exigir a operadores de última milla'],['https://mercado.com.ar/tendencias/entregas-fallidas-y-ultima-milla-el-costo-operativo-de-la-logistica-de-excepciones','Mercado (México): estimaciones sobre entregas fallidas y costo de última milla'],['https://cpe.sunat.gob.pe/node/122','SUNAT: preguntas frecuentes de guía de remisión electrónica']],
ver:['Las notas de prensa son opinión sectorial y estimaciones de terceros: '+V('datos oficiales o de tu empresa'),'Los costos de flota y las cifras del ejercicio son ficticios.']},

{id:'7.5',title:'Costos logísticos y costo por pedido',min:20,
goal:'Descomponer el costo logístico, calcular el costo y la contribución por pedido y fijar un ticket mínimo para envío gratis.',
body:`<p>El <b>costo por pedido</b> (cost-to-serve) reúne lo que cuesta atender un pedido después de venderlo: <b>picking y packing</b> (mano de obra), <b>materiales de embalaje</b>, <b>almacenamiento</b>, <b>transporte</b>, <b>devoluciones</b>, <b>atención al cliente</b> y <b>mermas</b>. Parte es variable (por pedido) y parte fija (alquiler, supervisores).</p>
<pre><code>Costo por pedido       = costos logísticos del periodo / pedidos del periodo
Margen bruto por pedido = ticket promedio × margen bruto %
Contribución por pedido = margen bruto por pedido − costo por pedido
Ticket mínimo para envío gratis ≈ costo de envío / margen bruto %</code></pre>
<p>La última fórmula es un punto de partida: indica el ticket en que el margen bruto de la compra cubre el costo del envío. En la práctica también se consideran comisiones de pago, devoluciones y el efecto de subir el ticket (más unidades por pedido).</p>
<h3>Qué mueve el costo por pedido</h3>
<ul><li><b>Ticket y unidades por pedido:</b> más productos por pedido diluyen el costo fijo de despacho.</li><li><b>Modalidad:</b> el retiro en tienda evita el transporte.</li><li><b>Devoluciones y cancelaciones tardías:</b> un pedido cancelado en picking ya consumió trabajo.</li><li><b>Zona:</b> las rutas más dispersas cuestan más.</li></ul>`,
example:`<p>«Retail Andino» (ficticio) analiza si ofrecer envío gratis desde S/ 50. Con los números del ejercicio, el envío cuesta S/ 12 y el margen es 28%: el punto en que la compra cubre el envío es cerca de S/ 43. Pedir S/ 50 deja un pequeño colchón.</p>`,
ex:{type:'calc',intro:'Costos del mes (datos sintéticos) para 1000 pedidos. Ticket promedio: S/ 180. Margen bruto: 28%. Costo de envío por pedido: S/ 12.',cols:['Concepto','Costo del mes (S/)'],rows:[['Picking y packing',5200],['Materiales de embalaje',1800],['Transporte',11500],['Devoluciones',1500],['Atención al cliente',1000]],num:[1],
task:'Calcula el costo por pedido, la contribución por pedido, el ticket mínimo para envío gratis y el costo logístico como % del ticket.',
parts:[{l:'Costo por pedido',u:'S/',tol:0.01,fn:function(r){return r.reduce(function(a,x){return a+x[1]},0)/1000}},{l:'Contribución por pedido',u:'S/',tol:0.01,fn:function(r){return 180*0.28-r.reduce(function(a,x){return a+x[1]},0)/1000}},{l:'Ticket mínimo (envío gratis)',u:'S/',tol:0.1,fn:function(){return 12/0.28}},{l:'Costo logístico sobre el ticket',u:'%',tol:0.1,fn:function(r){return 100*(r.reduce(function(a,x){return a+x[1]},0)/1000)/180}}],
sol:function(v){return '<p>Costo total = 21 000 → por pedido = <b>S/ '+fmt(v[0],2)+'</b>. Margen bruto = 180 × 0,28 = 50,40, contribución = <b>S/ '+fmt(v[1],2)+'</b>. Ticket mínimo = 12 / 0,28 ≈ <b>S/ '+fmt(v[2])+'</b>. Costo logístico = <b>'+fmt(v[3])+'%</b> del ticket. Si el ticket cayera a 100 con el mismo costo, la contribución sería negativa: por eso el ticket importa.</p>'}},
quiz:[
{q:'Costo por pedido =',o:['Ventas / pedidos','Costos logísticos del periodo / pedidos del periodo','Margen / ticket','Pedidos / costos'],a:1,w:'Todo lo que cuesta atender pedidos, sobre el número de pedidos.'},
{q:'Para que el envío gratis no destruya el margen…',o:['Se ignora el ticket','Se fija un ticket mínimo cercano al costo de envío / margen bruto %','Se sube el costo del envío','Se elimina el picking'],a:1,w:'El margen de la compra debe cubrir el envío.'},
{q:'Un pedido cancelado durante el picking…',o:['No cuesta nada','Ya consumió trabajo y suma al costo','Genera ganancia','No se registra'],a:1,w:'El trabajo de preparación ya se hizo.'}],
src:[],
ver:['Fórmulas de costo por pedido: práctica general de finanzas y logística; el detalle de conceptos lo define la empresa.','Todas las cifras son ficticias.']},

{id:'7.6',title:'Operadores logísticos y acuerdos de servicio (SLA)',min:18,
goal:'Decidir cuándo tercerizar, qué debe decir un SLA y cómo evaluar a un operador con indicadores por zona.',
body:`<p><b>Tercerizar</b> (3PL) da flexibilidad ante volumen variable, cobertura y menos inversión; <b>internalizar</b> da control y calidad de servicio, pero exige costos fijos y capacidad de gestión. Las notas del sector peruano describen a retailers que internalizan por falta de operadores confiables; es una tendencia que debes contrastar con tu empresa.</p>
<h3>Qué debe incluir un SLA</h3>
<ul><li><b>Cobertura y tiempos por zona</b> y ventanas horarias.</li><li><b>Indicadores:</b> entrega a tiempo, éxito al primer intento, fallos, rechazos, daños y extravíos, con su fórmula exacta.</li><li><b>Prueba de entrega y tracking</b> compartidos con tu sistema.</li><li><b>Reportes</b> semanales por zona, no solo un total.</li><li><b>Penalidades o incentivos</b> y proceso de reclamos.</li><li><b>Capacidad en campañas</b> reservada con anticipación.</li></ul>
<p>Un error común: contratar al operador y revisar solo los casos con retraso del día, sin exigir indicadores por zona. Así se detectan los focos problemáticos y se corrigen con el operador.</p>
<p>Conecta con lo que ya sabes: el scorecard de sellers (capítulo 4.4) y el reporte semanal (capítulo 3.6) se adaptan a operadores; y la propuesta de automatización de seguimiento semanal está en el catálogo del capítulo 11.7.</p>`,
example:`<p>El operador de «Retail Andino» (ficticio) reporta 93% de entrega a tiempo en el mes. Al abrir por zona, Lima Sur tiene 87% y arrastra el resultado. Sin el corte por zona, el reporte parecía aceptable.</p>`,
ex:{type:'calc',intro:'Reporte mensual de un operador (datos sintéticos). Objetivo de On Time: 92% por zona.',cols:['Zona','Entregas','A tiempo','Primer intento','Daños o extravíos'],rows:[['Lima Norte',420,397,360,3],['Lima Centro',380,366,351,1],['Lima Sur',300,262,240,5]],num:[1,2,3,4],
task:'Calcula el On Time global, el éxito al primer intento global y cuántas zonas están bajo el objetivo de 92%.',
parts:[{l:'On Time global',u:'%',tol:0.1,fn:function(r){var e=0,a=0;r.forEach(function(x){e+=x[1];a+=x[2]});return 100*a/e}},{l:'Primer intento global',u:'%',tol:0.1,fn:function(r){var e=0,a=0;r.forEach(function(x){e+=x[1];a+=x[3]});return 100*a/e}},{l:'Zonas bajo 92%',tol:0,fn:function(r){return r.filter(function(x){return 100*x[2]/x[1]<92}).length}}],
sol:function(v){return '<p>On Time global = 1025/1100 = <b>'+fmt(v[0])+'%</b>. Primer intento = 951/1100 = <b>'+fmt(v[1])+'%</b>. Zonas bajo 92%: solo Lima Sur (87,3%) = <b>'+v[2]+'</b>. El global esconde el foco: hay que negociar un plan concreto para esa zona.</p>'}},
quiz:[
{q:'¿Qué debe exigirse en el reporte de un operador?',o:['Solo un total mensual','Indicadores por zona con su fórmula','Solo fotos','Nada'],a:1,w:'Permite ubicar dónde falla.'},
{q:'Tercerizar frente a internalizar…',o:['Siempre es más barato','Da flexibilidad y menos inversión, con menos control directo','Elimina el SLA','Reduce el volumen'],a:1,w:'Hay trade-offs.'},
{q:'Capacidad en campañas: ¿cuándo se negocia?',o:['El mismo día','Con anticipación, dentro del acuerdo','Nunca','Solo si hay problema'],a:1,w:'La capacidad no aparece de un día para otro.'}],
src:[['https://www.elmostrador.cl/agenda-pais/2020/08/05/la-ultima-milla-el-talon-de-aquiles-del-e-commerce/','El Mostrador: indicadores por zona a exigir a operadores'],['https://andina.pe/agencia/noticia-cinco-desafios-debe-superar-sector-logistico-peru-para-continuar-su-crecimiento-1034330.aspx','Andina (2025): dificultades de tercerización en última milla']],
ver:['Contenido de SLA y penalidades: lo define cada contrato; lo que ves aquí es una guía didáctica.','Todas las cifras son ficticias.']}
]});
