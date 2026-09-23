MODS.push({id:'1',title:'1. Mapa del e-commerce retail',short:'Sistemas, flujo, entregas, canales, sellers',blurb:'Qué hace cada sistema, cómo viaja un pedido y quién hace qué en 1P y 3P.',ch:[
{id:'1.1',title:'Los siete sistemas y qué hace cada uno',min:18,
goal:'Ubicar plataforma, OMS, WMS, ERP, TMS, POS y CRM en un mismo mapa y saber a cuál preguntarle según el problema.',
body:`<p>Un pedido online toca varios sistemas. Casi todos los problemas operativos nacen en la <b>frontera</b> entre dos de ellos: el stock que ve el cliente no coincide con el de la tienda, o un estado no baja del OMS al despacho.</p>
${T(['Sistema','Qué resuelve','Dato que manda'],[
['Plataforma e-commerce','Vitrina, carrito, checkout, catálogo y precios visibles','Precio, promoción, stock mostrado'],
['OMS (gestión de pedidos)','Recibe el pedido, lo asigna a una tienda o almacén, reserva inventario y controla estados y cancelaciones','Estado del pedido'],
['WMS (gestión de almacén)','Ubicaciones, picking, packing, recepción e inventario físico','Ubicación y stock físico'],
['ERP','Compras, finanzas, inventario contable, maestro de productos, facturación','Costo, stock contable'],
['TMS (transporte)','Rutas, transportistas, tracking y costo de despacho','Ruta y estado de entrega'],
['POS','Caja de la tienda física; vende y descuenta stock de tienda','Ventas de tienda'],
['CRM','Cliente, historial, campañas y atención (incluye reclamos)','Ficha del cliente']])}
<p>En la práctica los límites se mezclan: muchas empresas resuelven OMS y TMS en un solo sistema interno, y las tiendas hacen de mini almacén. Por eso, lo primero que haces en un trabajo nuevo es dibujar <i>tu</i> mapa: qué sistema es la fuente de verdad de cada dato.</p>
<p>VTEX, por ejemplo, documenta el OMS como el módulo donde vive el flujo de estados del pedido (pago, ventana de cancelación, ready for handling, facturado). Es una buena referencia para hablar en entrevista aunque tu empresa use otro nombre.</p>`,
example:`<p>Un cliente de Chorrillos compra un televisor en la app de «Retail Andino» (retailer ficticio). La <b>plataforma</b> cobra. El <b>OMS</b> elige la tienda de Surco y reserva la unidad. El <b>WMS</b> o el sistema de tienda guía el picking. Cuando el <b>ERP</b> emite la factura o boleta, el <b>TMS</b> asigna ruta. Si a las 6 pm el <b>POS</b> de la tienda vende esa misma unidad, el OMS y la plataforma se enteran tarde: ahí nace una sobreventa.</p>`,
ex:{type:'match',intro:'Elige el sistema principal para cada situación.',opts:['Plataforma','OMS','WMS','ERP','TMS','POS','CRM'],items:[
{t:'El cliente ve el precio promocional y paga con tarjeta',a:'Plataforma'},
{t:'Decide que el pedido sale de la tienda Surco y reserva la unidad',a:'OMS'},
{t:'Indica al picker el pasillo y la ubicación del SKU',a:'WMS'},
{t:'Registra la compra al proveedor y el costo del producto',a:'ERP'},
{t:'Asigna la ruta y el transportista y da el tracking',a:'TMS'},
{t:'El cajero vende la última unidad en tienda',a:'POS'},
{t:'Guarda el reclamo y el historial de contactos del cliente',a:'CRM'}],
sol:'<p>Bien. Fíjate en el POS: es el único que puede <b>quitar stock por fuera del canal online</b>, y por eso es fuente clásica de desalineación.</p>'},
quiz:[
{q:'El pedido figura «Entregado» para el cliente pero el stock del SKU no bajó en el almacén. ¿Dónde empiezas a revisar?',o:['En el CRM','En la integración entre OMS/despacho y WMS o ERP','En el precio de la plataforma','En el TMS'],a:1,w:'Un dato que no viaja entre sistemas es un problema de integración, no del sistema individual.'},
{q:'¿Qué sistema suele ser la fuente de verdad del estado de un pedido online?',o:['POS','ERP contable','OMS','CRM'],a:2,w:'El OMS orquesta el ciclo de vida del pedido.'},
{q:'Tu empresa usa un sistema interno de despacho. ¿Qué haces primero?',o:['Asumir que es un TMS','Mapear qué funciones cubre (OMS, TMS, ambas) y qué datos son fuente de verdad','Pedir que lo cambien','Ignorarlo'],a:1,w:'Los nombres cambian entre empresas; las funciones no.'}],
src:[['https://help.vtex.com/en/tutorial/order-flow-on-the-oms','VTEX Help Center: order flow on the OMS'],['https://help.vtex.com/en/docs/tutorials/order-flow-and-status','VTEX Help Center: order flow and status']],
ver:['Las definiciones de WMS, TMS, ERP, POS y CRM son de práctica general de la industria, sin cita normativa; compáralas con la arquitectura real de cada empleador.']},

{id:'1.2',title:'Del clic a la puerta: flujo pedido-a-entrega',min:20,
goal:'Recorrer las etapas del pedido, saber qué sistema y qué KPI mira cada una, y dónde suelen atorarse.',
body:`<p>El flujo estándar tiene ocho paradas. Recórrelas en la caja de abajo y mira qué cambia entre etapas.</p>
<p>Un <b>KPI</b> (indicador clave) es una medida numérica que dice si una etapa va bien. En cada parada verás qué KPI se mira y qué significa, en una línea. El capítulo 3.1 los explica con su fórmula completa y el denominador correcto.</p>
<p>VTEX documenta estados como <code>Payment pending</code>, <code>Payment approved</code>, <code>Cancellation window</code>, <code>Ready for handling</code>, <code>Verifying invoice</code> e <code>Invoiced</code>, con <code>Canceling</code> y <code>Canceled</code> como salida. Dos detalles útiles: el pedido queda en <i>Ready for handling</i> hasta que el vendedor confirma que empezó a atenderlo, y al confirmar asume la responsabilidad de reservar los ítems.</p>
<p>Tu sistema interno tendrá otros nombres. Ejercicio mental de entrevista: traduce cada estado tuyo a este flujo.</p>`,
example:`<p>Pedido de «Retail Andino» a las 15:40 con entrega mismo día. Si el corte de mismo día es 16:00 y el pago se aprueba a las 16:05, el pedido ya no entra al corte y pasa a entrega del día siguiente. El cliente verá «mañana», y en tu reporte de On Time cuenta contra la promesa que se le mostró, no contra la hora de compra.</p>`,
ex:{type:'tabs',intro:'Toca cada etapa.',items:[
{t:'1 Compra',d:'<b>Sistema:</b> plataforma. <b>Qué pasa:</b> el cliente elige modalidad y franja. <b>Se atora:</b> stock mostrado que no existe. <b>KPI a mirar:</b> <i>conversión</i> (porcentaje de visitas que terminan en compra) y <i>pedidos creados</i> (cuántos pedidos se registran en el periodo).'},
{t:'2 Pago',d:'<b>Sistema:</b> plataforma y pasarela. <b>Estados:</b> payment pending (pago en revisión) y payment approved (pago aprobado). <b>Se atora:</b> pago rechazado o en revisión antifraude. <b>KPI a mirar:</b> <i>cancelación por pago</i> (porcentaje de pedidos creados que se cancelan porque el pago no se aprobó).'},
{t:'3 Ventana de cancelación',d:'<b>Sistema:</b> OMS. El cliente puede cancelar sin aprobación de la tienda durante un periodo configurado. <b>KPI a mirar:</b> <i>cancelaciones tempranas</i> (pedidos que el cliente cancela dentro de la ventana, sobre pedidos creados).'},
{t:'4 Asignación y reserva',d:'<b>Sistema:</b> OMS. Elige tienda o almacén y reserva. <b>Se atora:</b> asignación a una tienda sin stock físico. <b>KPI a mirar:</b> <i>reasignaciones</i> (pedidos que hubo que mover a otra tienda o almacén; muchas suelen indicar stock poco confiable).'},
{t:'5 Picking y packing',d:'<b>Sistema:</b> WMS o app de tienda. <b>Se atora:</b> producto sin ubicar, sustitutos, falta de personal. <b>KPI a mirar:</b> <i>tiempo de picking</i> (minutos desde que empieza la preparación hasta que termina) y <i>Fill Rate</i> (unidades entregadas sobre unidades pedidas; capítulo 3.2).'},
{t:'6 Facturación',d:'<b>Sistema:</b> ERP/OMS. Se genera el comprobante y el pedido pasa a facturado. <b>Se atora:</b> error de datos del cliente (RUC, DNI). <b>KPI a mirar:</b> <i>pedidos sin comprobante</i> (pedidos preparados que todavía no tienen boleta o factura).'},
{t:'7 Despacho o retiro',d:'<b>Sistema:</b> TMS o módulo de despacho. Ruta, transportista, o aviso «listo para retiro». <b>Se atora:</b> capacidad de franja, direcciones. <b>KPI a mirar:</b> <i>On Time</i> (porcentaje de pedidos entregados dentro de la fecha o franja prometida, sobre los entregados; capítulo 3.1).'},
{t:'8 Entrega y postventa',d:'<b>Sistema:</b> TMS, CRM. Prueba de entrega, encuesta NPS, cambios y devoluciones. <b>KPI a mirar:</b> <i>NPS</i> (encuesta del 0 al 10: porcentaje de promotores menos porcentaje de detractores; capítulo 3.3) y <i>tasa de devolución</i> (pedidos devueltos sobre pedidos entregados).'}],
task:'Un pedido lleva 6 horas en «Ready for handling». Lista tus 4 primeras verificaciones en orden.',
sol:'<ol><li>¿La tienda o el almacén confirmó el inicio de atención? En VTEX el pedido no avanza hasta esa confirmación.</li><li>¿La integración OMS-tienda está viva o hubo un error de sincronización?</li><li>¿La tienda asignada tiene el stock físico y personal en turno?</li><li>¿Es un problema aislado o hay decenas de pedidos igual? Si son muchos, escala como incidente.</li></ol>'},
quiz:[
{q:'En el flujo de VTEX, ¿cuándo puede el cliente cancelar sin que la tienda lo apruebe?',o:['Después de facturado','Durante la ventana de cancelación','Nunca','Solo con reclamo'],a:1,w:'Después de la ventana la tienda debe autorizar la cancelación, según la documentación de VTEX.'},
{q:'¿En qué etapa aparece típicamente un «producto sin ubicar»?',o:['Compra','Pago','Picking y packing','Postventa'],a:2,w:'El picker no lo encuentra aunque el sistema diga que hay stock.'},
{q:'Un pedido con corte a las 16:00 se paga a las 16:05. Contra qué promesa mides On Time?',o:['La hora de compra','La promesa vigente mostrada al cliente','La que prefiera la tienda','No se mide'],a:1,w:'La promesa es la fecha o franja confirmada al cliente.'}],
src:[['https://help.vtex.com/en/docs/tutorials/order-flow-and-status','VTEX Help Center: order flow and status'],['https://newhelp.vtex.com/docs/tracks/order-flow','VTEX Help Center: order flow (track)']],
ver:['Los nombres y el orden exacto de estados de tu sistema (por ejemplo el sistema interno de despacho) pueden diferir de VTEX. '+V('mapear estados propios')]},

{id:'1.3',title:'Despacho a domicilio, retiro en tienda y mismo día',min:18,
goal:'Distinguir las tres modalidades, entender corte y capacidad por franja, y calcular sobreventa de franjas.',
body:`<ul><li><b>Despacho a domicilio:</b> sale de tienda o centro de distribución con promesa de fecha y a veces franja horaria.</li><li><b>Retiro en tienda (click and collect):</b> el cliente recoge; el hito clave es «pedido listo para retiro» y el plazo máximo de espera. No hay TMS de por medio.</li><li><b>Mismo día (express):</b> promesa en horas. Depende de un <b>corte horario</b>, del radio de cobertura y de que la tienda tenga stock y picker disponibles.</li></ul>
<p>La <b>capacidad por franja</b> es cuántos pedidos puede atender la operación en una ventana. Si el OMS o la plataforma vende más pedidos que la capacidad, algunos llegarán tarde aunque no falle nadie. Es un problema de planificación, no de ejecución.</p>
<p>Shopify documenta algo parecido: si un pedido no puede cumplirse con el inventario de una sola ubicación, se divide en varias entregas por ubicación, y su flujo de entrega local pasa por estados como sin preparar, listo para entrega y entregado.</p>`,
example:`<p>En Lima, entre Surco y Chorrillos hay pocos kilómetros pero tráfico variable. Un radio de mismo día pensado sobre el mapa puede fallar en hora punta. Por eso muchos equipos miden On Time (porcentaje de pedidos entregados dentro de lo prometido) <b>por modalidad y por franja</b> y no solo global. Los números del ejercicio son inventados.</p>`,
ex:{type:'calc',intro:'Franjas de domicilio de un día en la tienda Surco (datos sintéticos).',cols:['Franja','Capacidad','Pedidos asignados'],rows:[['09:00-12:00',40,46],['12:00-15:00',40,38],['15:00-18:00',40,44],['18:00-21:00',30,25]],num:[1,2],
task:'Calcula el exceso total sobre capacidad (solo franjas que se pasan) y la ocupación total.',
parts:[{l:'Pedidos que exceden capacidad',u:'pedidos',tol:0,fn:function(r){return r.reduce(function(a,x){return a+Math.max(0,x[2]-x[1])},0)}},{l:'Ocupación total',u:'%',tol:0.1,fn:function(r){var c=0,p=0;r.forEach(function(x){c+=x[1];p+=x[2]});return 100*p/c}}],
sol:function(v){return '<p>Excesos: 6 en la mañana y 4 en la tarde = <b>'+v[0]+'</b>. Ocupación total = 153 / 150 = <b>'+fmt(v[1])+'%</b>. Ojo: la ocupación total parece casi normal, pero la operación falla por franja. Por eso mira el detalle, no el promedio.</p>'}},
quiz:[
{q:'Un retiro en tienda con demora es sobre todo un problema de…',o:['Ruta del transportista','Preparación del pedido en tienda','Facturación','Precio'],a:1,w:'En retiro no hay transporte; el hito es «listo para retiro».'},
{q:'Ocupación total de 98% con dos franjas en 120%. ¿Qué conclusión sacas?',o:['Todo bien','Hay cuellos de botella por franja','Falta stock','Hay que subir precios'],a:1,w:'Los promedios esconden picos.'},
{q:'¿Qué define principalmente si un pedido entra en mismo día?',o:['El color del pedido','El corte horario, la cobertura y la disponibilidad en tienda','El ERP','El NPS'],a:1,w:'Corte, cobertura y disponibilidad operativa.'}],
src:[['https://help.shopify.com/en/manual/locations/managing-orders','Shopify Help: fulfilling orders by location'],['https://help.shopify.com/en/manual/fulfillment/fulfilling-orders/local-delivery-fulfillment','Shopify Help: local delivery fulfillment']],
ver:['Los cortes, radios y ventanas de cancelación reales dependen de cada empresa: '+V('preguntar en entrevista cuáles maneja')]},

{id:'1.4',title:'Banderas y canales',min:15,
goal:'Diferenciar bandera (marca o formato comercial) de canal (por dónde entra el pedido) y usar ambos como cortes de reporte.',
body:`<p>Un grupo retail puede operar varias <b>banderas</b>: marcas o formatos como supermercado, hogar, moda o especializados. El <b>canal</b> es por donde entra el pedido: web, app, marketplace, WhatsApp o call center.</p>
<p>Por qué te importa como analista: cada bandera puede tener su catálogo, sus promociones, su ventana de entrega y hasta su razón social. Si mezclas banderas en un solo On Time (porcentaje de pedidos entregados dentro de lo prometido), escondes al que arrastra el resultado. En un reporte útil siempre puedes contestar «¿en qué bandera y en qué canal?».</p>
<p>Un ejemplo real de bandera múltiple: CAPECE describe que un seller de Intercorp Marketplaces puede vender casi automáticamente en Plaza Vea, Oechsle, Promart y Shopstar. Es un texto de 2024, así que confirma si sigue vigente ${V('estructura de banderas 2026')}.</p>`,
example:`<p>Para «Retail Andino» ficticio: un pedido de moda por app y otro de supermercado por web tienen SLA, picking y devoluciones distintos. Un dashboard con filtros de bandera y canal te evita tener que explicar «el promedio mejoró pero supermercado empeoró».</p>`,
ex:{type:'calc',intro:'Pedidos de una semana por bandera y canal (datos sintéticos).',cols:['Bandera','Web','App','Marketplace'],rows:[['Fresh (supermercado)',520,380,0],['Hogar',210,90,150],['Moda',160,140,230]],num:[1,2,3],
task:'Calcula el total de pedidos, el % que entra por App y el % de Marketplace dentro de la bandera Moda.',
parts:[{l:'Total de pedidos',tol:0,fn:function(r){var s=0;r.forEach(function(x){s+=x[1]+x[2]+x[3]});return s}},{l:'% por App',u:'%',fn:function(r){var a=0,s=0;r.forEach(function(x){a+=x[2];s+=x[1]+x[2]+x[3]});return 100*a/s}},{l:'% Marketplace en Moda',u:'%',fn:function(r){var x=r[2];return 100*x[3]/(x[1]+x[2]+x[3])}}],
sol:function(v){return '<p>Total = <b>'+v[0]+'</b>. App = 610 / '+v[0]+' = <b>'+fmt(v[1])+'%</b>. Moda tiene 230 de 530 pedidos en Marketplace = <b>'+fmt(v[2])+'%</b>: casi la mitad depende de sellers, así que su On Time depende de ellos.</p>'}},
quiz:[
{q:'La app móvil es…',o:['Una bandera','Un canal','Un sistema ERP','Una modalidad de entrega'],a:1,w:'La bandera es la marca o formato; la app es un canal de entrada.'},
{q:'¿Por qué no mezclar banderas en un solo KPI?',o:['Porque es ilegal','Porque un promedio puede ocultar a la bandera problemática','Porque el ERP lo prohíbe','Por estética'],a:1,w:'Simpson en pequeño: el agregado engaña.'},
{q:'¿Qué corte añadirías primero a un reporte de On Time?',o:['Solo el mes','Bandera, canal y modalidad','Color de logo','Ninguno'],a:1,w:'Son los cortes que explican las diferencias operativas.'}],
src:[['https://www.capece.org.pe/blog/marketplaces-peru/','CAPECE: marketplaces en Perú (incluye Intercorp Marketplaces)']],
ver:['Estructura de banderas y de marketplace de cada grupo: '+V('cambia con frecuencia')]},

{id:'1.5',title:'Marketplace: 1P, 3P y sellers',min:20,
goal:'Explicar la diferencia entre 1P y 3P, quién cobra, quién despacha y cómo cambia tu reporte de sellers.',
body:`<ul><li><b>1P (first party):</b> el retailer compra el producto, lo almacena y lo vende. Gana margen y controla stock y entrega.</li><li><b>3P (third party):</b> un <b>seller</b> externo publica en el marketplace y el retailer cobra una <b>comisión</b>. El seller pone inventario, a menudo despacha, y responde por el cumplimiento.</li></ul>
<p>Variantes de fulfillment 3P: el seller despacha él mismo, o el marketplace opera su almacén y despacha por él. En cada caso cambia quién responde ante un retraso.</p>
<p>En VTEX, cuando un pedido lo atiende un seller externo, el marketplace recibe el pago y el seller debe confirmar que empezó a atender: hasta ese momento el estado queda en Ready for handling. Gestión (2023) reportó, según un vocero citado, comisiones aproximadas de 20% en ropa y de 6 a 8% en celulares y computación; son cifras de esa nota, no vigentes para 2026 ${V('comisiones actuales')}.</p>
<p>Por eso existe el <b>reporte semanal de sellers</b>: mide quién cumple, quién cancela y a quién hay que llamar.</p>`,
example:`<p>«Moda Rímac», seller ficticio, vende una casaca. El cliente paga al marketplace, el seller entrega, y a fin de mes el marketplace liquida el monto menos la comisión. Si el seller cancela por falta de stock, el cliente culpa al marketplace, no al seller.</p>`,
ex:{type:'calc',intro:'Supuestos sintéticos por unidad de un mismo producto: precio S/ 500. En 1P el costo es S/ 380. En 3P la comisión es 12% del precio y el costo lo asume el seller.',
task:'Calcula el margen por unidad en 1P, el ingreso por unidad en 3P y cuántas unidades 3P hacen falta para igualar el margen de 100 unidades 1P.',
parts:[{l:'Margen 1P por unidad',u:'S/',tol:0.01,fn:function(){return 500-380}},{l:'Comisión 3P por unidad',u:'S/',tol:0.01,fn:function(){return 500*0.12}},{l:'Unidades 3P para igualar 100 de 1P',tol:0,fn:function(){return Math.round(100*(500-380)/(500*0.12))}}],
sol:function(v){return '<p>1P = 500 - 380 = <b>S/ '+v[0]+'</b>. 3P = 12% de 500 = <b>S/ '+v[1]+'</b>. Igualar 100 unidades 1P (S/ 12 000) exige <b>'+v[2]+'</b> unidades 3P. El 3P gana en variedad y capital de trabajo, pierde en margen por unidad y en control de la experiencia.</p>'}},
quiz:[
{q:'En 3P el retailer gana principalmente…',o:['El margen completo','Una comisión sobre la venta','Nada','El costo del seller'],a:1,w:'El retailer cobra comisión por usar su plataforma.'},
{q:'Un seller cancela por falta de stock. ¿Quién sufre primero el NPS?',o:['Solo el seller','El marketplace, porque el cliente compró en él','Nadie','El transportista'],a:1,w:'El cliente asocia la promesa a la marca del marketplace.'},
{q:'¿Qué columna es imprescindible en un reporte de sellers?',o:['Seller','Fecha de pedido, seller, estado, cancelación y fecha entregada','Solo ventas','Solo NPS'],a:1,w:'Sin fechas y estado no puedes medir cumplimiento.'}],
src:[['https://help.vtex.com/en/docs/tutorials/order-flow-and-status','VTEX Help Center: flujo de pedido con seller externo'],['https://gestion.pe/economia/empresas/marketplace-busca-vendedores-del-extranjero-para-ampliar-catalogo-las-razones-por-que-es-rentable-cyberwow-marketplace-comercio-electronico-falabellacom-ripley-app-tiendamia-mercado-libre-sellers-noticia/','Gestión (2023): marketplaces buscan sellers y comisiones'],['https://www.similarweb.com/es/top-websites/peru/e-commerce-and-shopping/marketplace/','Similarweb: ranking de marketplaces en Perú']],
ver:['Comisión de 12% del ejercicio: valor inventado para practicar.','Comisiones por categoría en Perú en 2026: '+V('consultar términos de cada marketplace')]}
]});
