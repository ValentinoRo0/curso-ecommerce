MODS.push({id:'2',title:'2. Operación diaria y stock',short:'Estados, picking, despacho, devoluciones, stock',blurb:'Lo que pasa entre el pago y la entrega, y por qué el stock se desalinea.',ch:[
{id:'2.1',title:'Estados del pedido y pedidos atorados',min:18,
goal:'Leer el ciclo de vida de un pedido, distinguir estado de pedido, de picking y de despacho, y detectar pedidos atorados por antigüedad.',
body:`<p>Un pedido tiene <b>un estado principal</b> en el OMS, y a la vez estados de subprocesos: el picking (por atender, en preparación, listo) y el despacho (asignado, en ruta, entregado, fallido). Confundirlos es la causa de muchos reportes contradictorios.</p>
<p>VTEX documenta que solo hay dos estados finales: <code>Invoiced</code> y <code>Canceled</code>. Todo lo demás es tránsito, y un pedido en tránsito no debería quedarse horas sin moverse.</p>
<p>La herramienta clave es la <b>antigüedad en estado</b> (aging): horas que lleva el pedido en cada estado. El reporte diario útil no solo cuenta pedidos: lista los que superan el umbral. Los umbrales los define cada operación; los del ejercicio son inventados.</p>`,
example:`<p>A las 10 de la mañana, en «Retail Andino» (ficticio), la lista de atorados muestra 14 pedidos de la tienda Surco en «Ready for handling». No es 14 problemas distintos: es una tienda sin picker o una integración caída. Agrupar por tienda te dice dónde llamar.</p>`,
ex:{type:'calc',intro:'Doce pedidos y su antigüedad en el estado actual (datos sintéticos). Regla del ejercicio: es atorado si Ready for handling supera 4 h, Verifying invoice supera 2 h, o Payment pending supera 24 h.',cols:['Pedido','Estado','Horas en el estado'],rows:[['P1','Ready for handling',1.5],['P2','Ready for handling',6],['P3','Payment pending',0.5],['P4','Ready for handling',9],['P5','Verifying invoice',3],['P6','Verifying invoice',12],['P7','Cancellation window',0.2],['P8','Ready for handling',2],['P9','Invoiced',20],['P10','Ready for handling',5],['P11','Verifying invoice',1],['P12','Payment pending',26]],num:[2],
task:'¿Cuántos pedidos están atorados y qué porcentaje son del total?',
parts:[{l:'Pedidos atorados',tol:0,fn:function(r){var lim={'Ready for handling':4,'Verifying invoice':2,'Payment pending':24};return r.filter(function(x){return lim[x[1]]!=null&&x[2]>lim[x[1]]}).length}},{l:'% del total',u:'%',tol:0.1,fn:function(r){var lim={'Ready for handling':4,'Verifying invoice':2,'Payment pending':24};return 100*r.filter(function(x){return lim[x[1]]!=null&&x[2]>lim[x[1]]}).length/r.length}}],
sol:function(v){return '<p>Atorados: P2, P4, P10 (Ready for handling), P5 y P6 (Verifying invoice) y P12 (Payment pending) = <b>'+v[0]+'</b>, o <b>'+fmt(v[1])+'%</b>. P9 está en un estado final y no cuenta. En Excel: <code>=CONTAR.SI.CONJUNTO(B:B;"Ready for handling";C:C;">4")</code> y sumas los otros dos estados.</p>'}},
quiz:[
{q:'¿Cuáles son los estados finales en VTEX?',o:['Ready for handling y Invoiced','Invoiced y Canceled','Payment approved y Canceled','Solo Invoiced'],a:1,w:'La documentación de VTEX indica que hay solo dos estados finales.'},
{q:'¿Qué mide la antigüedad en estado?',o:['El precio','Cuántas horas lleva el pedido en su estado actual','La edad del cliente','El NPS'],a:1,w:'Sirve para detectar pedidos que no avanzan.'},
{q:'14 pedidos atorados, todos de una tienda. ¿Qué haces?',o:['Los cancelas','Investigas primero causa común: personal, integración o stock de esa tienda','Los reasignas a ciegas','Esperas'],a:1,w:'Buscar el patrón antes de tocar pedidos uno por uno.'}],
src:[['https://help.vtex.com/en/docs/tutorials/order-flow-and-status','VTEX Help Center: order flow and status'],['https://newhelp.vtex.com/docs/tracks/order-flow','VTEX Help Center: solo dos estados finales']],
ver:['Umbrales de horas: los de tu empresa. Los del ejercicio son inventados.']},

{id:'2.2',title:'Picking y packing',min:18,
goal:'Comparar métodos de picking y calcular productividad (UPH) y tasa de error por picker.',
body:`<p><b>Picking</b> es recoger los productos en sus ubicaciones; <b>packing</b> es embalar y etiquetar. Métodos habituales:</p>
<ul><li><b>Por pedido:</b> un picker, un pedido. Simple, lento con muchos pedidos.</li><li><b>Por lote (batch):</b> varios pedidos a la vez con el mismo picker, luego se separan.</li><li><b>Por zona:</b> cada picker cubre una zona y el pedido pasa de zona en zona.</li><li><b>Por oleada (wave):</b> se lanzan grupos de pedidos en horarios fijos, alineados al corte de despacho.</li></ul>
<p>Métricas base: <b>UPH</b> (unidades por hora) y <b>tasa de error</b> (pedidos con error de preparación sobre pedidos preparados, o errores sobre unidades: define cuál usas). Decisión de fondo: qué haces cuando el picker no encuentra un producto: búsqueda ampliada por tiempo limitado, reasignación a otra tienda, sustituto con autorización del cliente, o cancelación parcial o total. Adelantarse y cancelar antes de iniciar el picking, cuando el sistema ya sabe que no hay stock, evita horas de espera.</p>`,
example:`<p>En una tienda de barrio grande de Lima, el picking de supermercado tiene frágiles, refrigerados y secos. Se suele preparar por zona para no mezclar temperaturas. En moda o tecnología el picking es corto pero el riesgo es el <b>error de variante</b> (talla, color, modelo).</p>`,
ex:{type:'calc',intro:'Turno de picking en una tienda (datos sintéticos).',cols:['Picker','Unidades','Horas','Errores'],rows:[['A',240,6,3],['B',180,5,9],['C',300,6,3]],num:[1,2,3],
task:'Calcula el UPH del picker B, el UPH global del turno y la tasa de error global sobre unidades.',
parts:[{l:'UPH de B',tol:0.1,fn:function(r){return r[1][1]/r[1][2]}},{l:'UPH global',tol:0.1,fn:function(r){var u=0,h=0;r.forEach(function(x){u+=x[1];h+=x[2]});return u/h}},{l:'Tasa de error',u:'%',tol:0.05,fn:function(r){var u=0,e=0;r.forEach(function(x){u+=x[1];e+=x[3]});return 100*e/u}}],
sol:function(v){return '<p>B = 180 / 5 = <b>'+fmt(v[0])+'</b>. Global = 720 / 17 = <b>'+fmt(v[1])+'</b> (no promedies los UPH de cada picker: pondera por horas). Error = 15 / 720 = <b>'+fmt(v[2],2)+'%</b>. B es el más lento y el que más falla: mira si tiene zona difícil o falta capacitación.</p>'}},
quiz:[
{q:'¿Por qué no se promedian los UPH individuales para obtener el UPH del turno?',o:['Porque es más lento','Porque hay que ponderar por horas trabajadas','No pasa nada si se promedian','Porque UPH no existe'],a:1,w:'El promedio simple ignora que cada picker trabajó distinto tiempo.'},
{q:'Picking por lote sirve sobre todo cuando…',o:['Hay pocos pedidos','Muchos pedidos comparten ubicaciones','El cliente pide factura','El stock es cero'],a:1,w:'Agrupas recorridos y ahorras tiempo.'},
{q:'El picker no encuentra el producto. La primera opción razonable es…',o:['Cancelar de inmediato','Búsqueda ampliada acotada, luego reasignar o sustituir según reglas','Marcar entregado','Ignorar'],a:1,w:'Cancelar es último recurso.'}],
src:[['https://help.vtex.com/en/docs/tutorials/order-flow-and-status','VTEX: el seller asume la reserva de ítems al confirmar el inicio de atención']],
ver:['Métodos de picking y definiciones de UPH y tasa de error: práctica general de logística, sin norma. Confirma la definición interna de cada empresa.']},

{id:'2.3',title:'Despachos, rutas y capacidad',min:17,
goal:'Entender cortes, consolidación y rutas, y calcular cuántas rutas hacen falta.',
body:`<p>El despacho agrupa pedidos listos en <b>rutas</b> y los entrega con vehículos propios o de un operador logístico. Tres conceptos:</p>
<ul><li><b>Corte:</b> hora límite para que el pedido entre en la ruta de hoy.</li><li><b>Consolidación:</b> juntar pedidos cercanos en una misma ruta para bajar costo.</li><li><b>Capacidad:</b> paradas o volumen máximo por vehículo y por franja.</li></ul>
<p>Consolidar tiene un límite: si dos distritos están lejos, unirlos ahorra vehículos en el papel pero alarga el tiempo y puede romper la promesa. La pregunta correcta del analista es cuánto cuesta el ahorro en términos de On Time.</p>
<p>Los incidentes típicos de despacho: pedido preparado pero sin ruta asignada, ruta cerrada tarde, dirección incompleta, cliente ausente y reprogramación.</p>`,
example:`<p>Rutas de «Retail Andino» (ficticio) que salen de Surco hacia Chorrillos y San Miguel: un vehículo con 20 paradas puede completar Chorrillos, pero si se le suman paradas de San Miguel a última hora, las últimas se entregan fuera de franja.</p>`,
ex:{type:'calc',intro:'Paradas por distrito para el turno de la tarde (datos sintéticos). Capacidad: 20 paradas por vehículo.',cols:['Distrito','Paradas'],rows:[['Surco',38],['Chorrillos',22],['San Miguel',30],['Los Olivos',26]],num:[1],
task:'Calcula las rutas necesarias si cada distrito va por separado y si se consolidan todas las paradas.',
parts:[{l:'Rutas por distrito',tol:0,fn:function(r){return r.reduce(function(a,x){return a+Math.ceil(x[1]/20)},0)}},{l:'Rutas consolidadas',tol:0,fn:function(r){var s=0;r.forEach(function(x){s+=x[1]});return Math.ceil(s/20)}}],
sol:function(v){return '<p>Por distrito: 2+2+2+2 = <b>'+v[0]+'</b>. Consolidado: 116 / 20 = 5,8, sube a <b>'+v[1]+'</b>. Ahorras '+(v[0]-v[1])+' rutas, pero Los Olivos queda lejos de Surco: el ahorro solo es real si las rutas mixtas respetan la promesa. Mide On Time antes y después de consolidar.</p>'}},
quiz:[
{q:'El corte de despacho es…',o:['El precio final','La hora límite para entrar en la ruta del día','La hora de entrega','La firma del cliente'],a:1,w:'Define qué pedidos salen hoy.'},
{q:'Consolidar distritos lejanos puede…',o:['Mejorar siempre el On Time','Ahorrar vehículos pero poner en riesgo la promesa','No tener efecto','Cancelar pedidos automáticamente'],a:1,w:'Costo contra servicio.'},
{q:'Un pedido «preparado» sin ruta asignada es un problema de…',o:['Picking','Despacho o integración con TMS','Precio','Marketing'],a:1,w:'Se quedó entre la preparación y la ruta.'}],
src:[['https://help.shopify.com/en/manual/fulfillment/fulfilling-orders/local-delivery-fulfillment','Shopify Help: flujo de entrega local (sin preparar, listo para entrega, entregado)']],
ver:['Capacidad de 20 paradas y todos los números del ejercicio: inventados. Los cortes reales los define cada operación.']},

{id:'2.4',title:'Incidencias, cambios y devoluciones',min:18,
goal:'Clasificar incidencias, entender la logística inversa y usar un Pareto para priorizar causas.',
body:`<p>Una <b>incidencia</b> es cualquier desvío entre lo prometido y lo ocurrido: cliente ausente, dirección errada, producto dañado, faltante, demora. Un <b>cambio</b> reemplaza el producto; una <b>devolución</b> lo regresa y normalmente genera reembolso. El camino del producto de vuelta se llama <b>logística inversa</b>.</p>
<p>Para el analista lo importante es <b>tipificar</b> bien: causa, responsable (cliente, tienda, transporte, seller, sistema) y costo. Sin causa clara no hay acción. Un <b>Pareto</b> ordena causas de mayor a menor y muestra el acumulado: suele revelar que pocas causas explican la mayoría de incidencias.</p>
<p>Conexión tributaria: cuando un pedido facturado se devuelve, el comprobante se corrige con una nota de crédito (lo verás en el capítulo 5.1). Y las <b>mermas</b> (producto dañado o vencido que no se puede vender) se registran aparte de las devoluciones vendibles.</p>`,
example:`<p>En Lima, «cliente ausente» y «dirección incompleta» suelen dominar las fallas de última milla en departamentos y edificios sin referencia clara. Un campo obligatorio de referencia y un mensaje previo por WhatsApp pueden bajar ambas causas. Las cifras del ejercicio son inventadas.</p>`,
ex:{type:'calc',intro:'Incidencias de entrega de una semana (datos sintéticos).',cols:['Causa','Casos'],rows:[['Cliente ausente',58],['Dirección incompleta',39],['Producto dañado',15],['Faltante',10],['Demora de ruta',3]],num:[1],
task:'Calcula el total, y el % acumulado de las dos primeras causas.',
parts:[{l:'Total de incidencias',tol:0,fn:function(r){return r.reduce(function(a,x){return a+x[1]},0)}},{l:'% acumulado de las 2 primeras',u:'%',tol:0.1,fn:function(r){var t=0,s=r.map(function(x){t+=x[1];return x[1]}).sort(function(a,b){return b-a});return 100*(s[0]+s[1])/t}}],
sol:function(v){return '<p>Total = <b>'+v[0]+'</b>. Las dos primeras suman 97 casos = <b>'+fmt(v[1])+'%</b>. Prioriza ahí. En Excel: ordenas descendente y calculas acumulado con <code>=SUMA($B$2:B2)/SUMA($B$2:$B$6)</code>.</p>'}},
quiz:[
{q:'¿Qué es logística inversa?',o:['Enviar más rápido','El flujo de retorno de productos del cliente al retailer','Un tipo de picking','Un sistema ERP'],a:1,w:'Cambios, devoluciones y mermas.'},
{q:'¿Para qué sirve un Pareto?',o:['Para calcular NPS','Para priorizar las pocas causas que explican la mayoría de casos','Para facturar','Para medir stock'],a:1,w:'Ordena causas y muestra acumulado.'},
{q:'Producto dañado que no se puede volver a vender se registra como…',o:['Devolución vendible','Merma','Cambio','Sobreventa'],a:1,w:'Es pérdida de inventario por daño o vencimiento.'}],
src:[['https://cpe.sunat.gob.pe/informacion_general/obligados_cpe','SUNAT: comprobantes de pago electrónicos (notas de crédito y débito)']],
ver:['Tipificación de incidencias y responsables: la de cada empresa. La nota de crédito para devoluciones se explica en el capítulo 5.1 '+V('casos concretos en SUNAT')]},

{id:'2.5',title:'Stock físico, disponible, ajustes y mermas',min:20,
goal:'Calcular stock disponible a partir del físico, entender ajustes y medir precisión de inventario.',
body:`<p>El <b>stock físico</b> es lo que realmente hay en la ubicación. El <b>stock disponible</b> es lo que se puede ofrecer online:</p>
<pre><code>Disponible publicado = máx(0, Físico − Reservado − Bloqueado − Stock de seguridad)</code></pre>
<p><b>Reservado</b> son unidades comprometidas a pedidos en curso. <b>Bloqueado</b> son unidades dañadas, en revisión o apartadas. El <b>stock de seguridad</b> es un colchón que se resta a propósito para absorber desalineaciones. Cada empresa decide sus reglas.</p>
<p>Un <b>ajuste</b> corrige la diferencia entre el sistema y la realidad: positivo si sobra, negativo si falta. Salen de conteos cíclicos, mermas, errores de recepción o hallazgos de picking. Un ajuste solo sirve si el stock corregido llega a la plataforma a tiempo.</p>
<p>VTEX advierte algo útil: al confirmar el inicio de atención, el seller asume la reserva de los ítems; si hay actualizaciones de inventario después, la plataforma descarta la reserva de esos SKU, por eso recomienda actualizar el inventario solo después de facturar el pedido, para evitar discrepancias con el backoffice.</p>
<p>La <b>precisión de inventario</b> (IRA) suele medirse como SKUs o ubicaciones contadas sin diferencia sobre el total contado.</p>`,
example:`<p>Una tienda de «Retail Andino» (ficticia) recibe 30 unidades de una licuadora. Recepción registra 30, pero llegaron 3 con caja rota. Si nadie bloquea esas 3, el sistema ofrece 30, se venden 30 y tres pedidos se caen en picking. La causa no está en el picking: está en <b>no haber bloqueado la merma</b>.</p>`,
ex:{type:'calc',intro:'Stock de cuatro SKU (datos sintéticos).',cols:['SKU','Físico','Reservado','Bloqueado','Seguridad'],rows:[['A',12,5,1,2],['B',3,3,0,1],['C',25,4,2,3],['D',0,0,0,0]],num:[1,2,3,4],
task:'Calcula el disponible publicado total y cuántos SKU quedan con disponible cero.',
parts:[{l:'Disponible publicado total',tol:0,fn:function(r){return r.reduce(function(a,x){return a+Math.max(0,x[1]-x[2]-x[3]-x[4])},0)}},{l:'SKU con disponible 0',tol:0,fn:function(r){return r.filter(function(x){return Math.max(0,x[1]-x[2]-x[3]-x[4])===0}).length}}],
sol:function(v){return '<p>A = 4, B = máx(0, -1) = 0, C = 16, D = 0. Total = <b>'+v[0]+'</b>; SKU en cero = <b>'+v[1]+'</b> (B y D). B tiene 3 unidades físicas pero todas están reservadas más el colchón: si vendes una más, es sobreventa.</p>'}},
quiz:[
{q:'¿Para qué sirve el stock de seguridad online?',o:['Para subir el precio','Para absorber desalineaciones entre sistemas y evitar sobreventa','Para el marketing','Para el TMS'],a:1,w:'Es un colchón deliberado.'},
{q:'Según VTEX, ¿cuándo conviene actualizar el inventario tras iniciar la atención?',o:['Antes de facturar','Después de que el pedido esté facturado','Nunca','Cuando llegue el cliente'],a:1,w:'Evita que la plataforma descarte reservas y genere discrepancias.'},
{q:'Un ajuste negativo aparece cuando…',o:['Sobra stock','El sistema dice más de lo que hay físicamente','Baja el precio','Sube el NPS'],a:1,w:'Se corrige una diferencia contra el conteo real.'}],
src:[['https://help.vtex.com/en/docs/tutorials/order-flow-and-status','VTEX Help Center: reserva de ítems y actualización de inventario']],
ver:['La fórmula de disponible publicado es un modelo didáctico. Tu sistema puede sumar o restar otros conceptos. '+V('confirmar reglas de stock de seguridad en cada empresa')]},

{id:'2.6',title:'Sobreventa y cancelaciones por producto sin ubicar',min:20,
goal:'Encadenar causa raíz de una cancelación por stock y medir cuánto pesa en el total de cancelaciones.',
body:`<p><b>Sobreventa:</b> se vendió más de lo que realmente existe. <b>Producto sin ubicar:</b> el picker no lo encuentra donde el sistema dice. Son el mismo problema visto desde dos lados: el sistema cree que hay stock y la tienda no lo tiene disponible.</p>
<h3>Causas frecuentes</h3>
<ul><li><b>Stock fantasma:</b> físicamente no está (merma, hurto, error de recepción) y nadie ajustó.</li><li><b>Producto mal ubicado:</b> existe, pero en otra ubicación.</li><li><b>Ventas por fuera del online:</b> el POS vende y el OMS se entera tarde.</li><li><b>Ajustes tardíos:</b> se corrigió en almacén pero la plataforma no lo refleja.</li><li><b>Picos:</b> promoción o campaña que consume stock más rápido que la sincronización.</li></ul>
<h3>Qué hacer antes de cancelar</h3>
<ol><li>Búsqueda ampliada con tiempo tope.</li><li>Conteo puntual y ajuste inmediato.</li><li>Reasignar a otra tienda si el plazo lo permite.</li><li>Sustituto con autorización del cliente.</li><li>Recién entonces, cancelar y registrar el motivo correcto.</li></ol>
<p>Mide: % de cancelación por sin ubicar y sobreventa sobre cancelaciones totales, y sobre pedidos creados; tiempo hasta detección; y SKU y tienda repetidos.</p>`,
example:`<p>Si en un mes «Retail Andino» (ficticio) recibe muchas cancelaciones por «sin ubicar» en el mismo SKU y la misma tienda, no son 20 problemas de picking: es una entrada de inventario mal registrada. Corriges el ajuste una vez y las cancelaciones desaparecen.</p>`,
ex:{type:'calc',data:true,intro:'Practica con el CSV de pedidos sintéticos.',
task:'Cuenta las cancelaciones con motivo «Producto sin ubicar» o «Sobreventa» y calcula qué porcentaje son del total de cancelaciones.',
parts:[{l:'Cancelaciones por stock',tol:0,fn:function(d){return d.filter(function(r){return r.estado==='Cancelado'&&(r.motivo==='Producto sin ubicar'||r.motivo==='Sobreventa')}).length}},{l:'% del total de cancelaciones',u:'%',tol:0.1,fn:function(d){var c=d.filter(function(r){return r.estado==='Cancelado'});var s=c.filter(function(r){return r.motivo==='Producto sin ubicar'||r.motivo==='Sobreventa'}).length;return 100*s/c.length}}],
sol:function(v){return '<p>Son <b>'+v[0]+'</b> cancelaciones, un <b>'+fmt(v[1])+'%</b> del total. En Excel: <code>=CONTAR.SI.CONJUNTO(K:K;"Cancelado";L:L;"Producto sin ubicar")+CONTAR.SI.CONJUNTO(K:K;"Cancelado";L:L;"Sobreventa")</code>. En el caso final descubrirás dónde se concentran.</p>'}},
quiz:[
{q:'«Producto sin ubicar» y «sobreventa» son…',o:['Causas sin relación','Dos manifestaciones de stock desalineado','Un tipo de merma','Errores de facturación'],a:1,w:'Ambos nacen de que el sistema y la tienda no coinciden.'},
{q:'¿Qué haces antes de cancelar un pedido por sin ubicar?',o:['Cancelas de inmediato','Buscas, ajustas, reasignas o sustituyes según regla','Lo marcas entregado','Llamas al cliente para que espere'],a:1,w:'La cancelación es el último recurso.'},
{q:'Muchas cancelaciones en un mismo SKU y tienda apuntan a…',o:['Mala suerte','Una causa raíz común, como un ajuste o recepción mal registrada','Marketing','El cliente'],a:1,w:'Los patrones repetidos delatan causa común.'}],
src:[['https://help.vtex.com/en/docs/tutorials/order-flow-and-status','VTEX Help Center: reservas e inventario']],
ver:['Los tiempos tope de búsqueda y las reglas de sustitución dependen de la política de cada empresa.']}
]});
