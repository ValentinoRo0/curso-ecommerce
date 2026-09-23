MODS.push({id:'4',title:'4. Catálogo, plataformas y marketplace',short:'SKU, GTIN, precios, sync, scorecard, VTEX/Shopify',blurb:'La calidad del dato de producto, precios y stock, y las plataformas que verás en ofertas.',ch:[
{id:'4.1',title:'SKU, EAN/GTIN y atributos',min:18,
goal:'Distinguir SKU de EAN/GTIN, entender variantes y validar un código GTIN-13.',
body:`<ul><li><b>SKU:</b> código <i>interno</i> de la empresa para una variante vendible (por ejemplo, misma polera en talla M y color negro). Lo define cada retailer o seller.</li><li><b>EAN/GTIN:</b> código <i>global</i> del producto que aparece en el código de barras. EAN-13 es el mismo número que GTIN-13; lo administra GS1. Se compone de prefijo de empresa, referencia de producto y un dígito verificador.</li><li><b>Atributos:</b> marca, modelo, color, talla, peso, dimensiones, descripción e imágenes. Son la base de búsqueda, filtros y del picking correcto.</li><li><b>Variante:</b> producto «padre» con hijos por talla o color, cada uno con su SKU y su EAN.</li></ul>
<p>El dígito verificador del GTIN-13 se calcula con módulo 10: se multiplican los 12 primeros dígitos por pesos alternos 1 y 3 (empezando por 1), se suman, y el dígito es lo que falta para llegar a múltiplo de 10. Sirve para detectar errores de digitación.</p>
<p>Fallas comunes de catálogo: un mismo EAN en dos SKU, un SKU sin EAN, atributos distintos en 1P y en el seller para el mismo producto, o imágenes que no corresponden. Un EAN mal cargado hace que el picker escanee y no lo reconozca.</p>`,
example:`<p>«Retail Andino» (ficticio) recibe de un seller una zapatilla con el EAN de otra talla. El picker escanea, el sistema dice «producto correcto», y el cliente recibe talla equivocada. El reclamo llega como «error de preparación», pero la causa está en el catálogo.</p>`,
ex:{type:'gtin',intro:'Prueba el validador. El primer código es un ejemplo conocido de GTIN-13 válido. El botón simula un error de digitación.',base:'775123456789',task:'Calcula el dígito verificador del código sintético 775123456789.'},
quiz:[
{q:'El SKU es…',o:['Un código global de GS1','Un código interno de la empresa para una variante','El número de RUC','El número del pedido'],a:1,w:'Cada retailer o seller define el suyo.'},
{q:'¿Para qué sirve el dígito verificador del GTIN-13?',o:['Para el precio','Para detectar errores de digitación','Para el IGV','Para la ruta'],a:1,w:'Valida que el código sea coherente.'},
{q:'Dos SKU con el mismo EAN provocan…',o:['Nada','Confusión en escaneo, picking y stock','Descuentos','Más ventas'],a:1,w:'El sistema no distingue el producto correcto.'}],
src:[['https://gs1.se/en/guides/how-to-guides/gtin-13/','GS1 Sweden: guía de GTIN-13'],['https://www.activebarcode.com/codes/ean13','ActiveBarcode: estructura del EAN-13'],['https://www.omnicalculator.com/all/gtin-check-digit','Omni Calculator: dígito verificador GTIN']],
ver:['El prefijo GS1 asignado a Perú (775 según referencia general) y la afiliación GS1 Perú de cada proveedor: '+V('confirmar en GS1 Perú')]},

{id:'4.2',title:'Precios y promociones',min:17,
goal:'Calcular descuento y margen en una promoción y reconocer errores típicos de precio.',
body:`<p>Un producto tiene <b>precio regular</b>, <b>precio promocional</b> y, a veces, precio por canal o por bandera. Las promociones definen vigencia, tope de unidades, canal y condiciones (medio de pago, mínimo de compra).</p>
<pre><code>Descuento % = (Precio regular − Precio promo) / Precio regular
Margen S/  = Precio promo − Costo
Margen %   = Margen S/ / Precio promo</code></pre>
<p>Riesgos frecuentes: precio con un cero de menos, promoción que sigue activa después de su fecha, precio distinto entre web y app, y sellers que cambian precio sin que se refleje en el marketplace. Un error de precio se convierte rápido en una ola de pedidos que luego se cancelan, con daño en NPS y reclamos.</p>
<p>Para el ejercicio se ignoran impuestos por simplicidad. La forma de mostrar precios al consumidor (por ejemplo, incluyendo o no impuestos) tiene reglas propias ${V('norma de información de precios al consumidor')}.</p>`,
example:`<p>Un televisor de «Retail Andino» (ficticio) sale a S/ 100 en vez de S/ 1000 por un cero faltante. En 20 minutos entran cientos de pedidos. La operación tendrá que decidir si cancelar, con impacto en reclamos, o cumplir, con pérdida. Por eso los cambios de precio tienen revisión y alertas de variación.</p>`,
ex:{type:'calc',intro:'Promoción de un producto (datos sintéticos): precio regular S/ 1000, precio promo S/ 850, costo S/ 700. Sin impuestos.',
task:'Calcula el descuento %, el margen en soles y el margen % sobre el precio promo.',
parts:[{l:'Descuento',u:'%',tol:0.1,fn:function(){return 100*(1000-850)/1000}},{l:'Margen',u:'S/',tol:0.01,fn:function(){return 850-700}},{l:'Margen sobre precio promo',u:'%',tol:0.1,fn:function(){return 100*(850-700)/850}}],
sol:function(v){return '<p>Descuento = 150/1000 = <b>'+fmt(v[0])+'%</b>. Margen = 850 − 700 = <b>S/ '+v[1]+'</b>. Margen % = 150/850 = <b>'+fmt(v[2])+'%</b>. Sin promoción el margen era S/ 300 (30% sobre 1000): el descuento de 15% recortó el margen a la mitad. Por eso el descuento no es «solo un porcentaje».</p>'}},
quiz:[
{q:'Un precio 10 veces menor por error de digitación genera…',o:['Nada','Una ola de pedidos y luego cancelaciones o pérdida','Más margen','Mejor NPS'],a:1,w:'Es un riesgo operativo y de reputación.'},
{q:'El margen % de una promoción se calcula sobre…',o:['El costo siempre','El precio promo, según la fórmula del ejercicio','El IGV','El stock'],a:1,w:'Margen S/ dividido por el precio de venta.'},
{q:'Un precio distinto en web y app suele indicar…',o:['Sincronización o regla de precios por canal mal configurada','Nada','Promoción intencional siempre','Error de picking'],a:0,w:'Se revisa configuración y sincronización.'}],
src:[],
ver:['Cómo se debe informar el precio al consumidor (con impuestos, plazos de promoción, etc.): '+V('revisar la norma vigente de Indecopi')]},

{id:'4.3',title:'Sincronización de stock y disponibilidad',min:20,
goal:'Entender de dónde viene el stock que ve el cliente y calcular el riesgo por retraso de sincronización.',
body:`<p>El stock que ve el cliente es una <b>copia</b> del stock real, y toda copia llega con retraso. La cadena típica: tienda o almacén (físico) → ERP o WMS (contable/lógico) → OMS (reservas) → plataforma (publicado). Cada salto agrega latencia.</p>
<h3>Palancas para reducir sobreventa</h3>
<ul><li><b>Sincronización por evento</b> (cada movimiento actualiza) frente a por lote (cada X minutos).</li><li><b>Stock de seguridad</b> en la publicación.</li><li><b>Reservas</b> al confirmar el pedido, no al pagar.</li><li><b>Alertas</b> cuando el picker reporta sin ubicar en un SKU: se corta la publicación de ese SKU en esa tienda hasta contar.</li><li><b>Ajustes con hora</b>: saber a qué hora se corrigió el stock para explicar cancelaciones.</li></ul>
<p>Recuerda la advertencia de VTEX: tras iniciar la atención el seller asume la reserva, y actualizar el inventario antes de facturar puede descartar reservas y crear discrepancias. La regla práctica es sincronizar con orden y trazabilidad, no «lo antes posible».</p>`,
example:`<p>En una campaña, «Retail Andino» (ficticio) vende cientos de unidades en un fin de semana. El POS de la tienda vende en caja a la misma hora. Si la sincronización es por lote cada 30 minutos, hay media hora de sobreventa potencial por SKU popular.</p>`,
ex:{type:'calc',intro:'Ventas de caja que aún no se reflejan online (datos sintéticos).',cols:['SKU','Publicado online','Ventas POS pendientes de sincronizar'],rows:[['X',5,2],['Y',2,3],['Z',10,1],['W',0,0]],num:[1,2],
task:'Calcula cuántas unidades publicadas ya no existen (máximo el publicado de cada SKU) y cuántos SKU tienen riesgo de sobreventa.',
parts:[{l:'Unidades publicadas inexistentes',tol:0,fn:function(r){return r.reduce(function(a,x){return a+Math.min(x[1],x[2])},0)}},{l:'SKU con riesgo',tol:0,fn:function(r){return r.filter(function(x){return x[2]>0}).length}}],
sol:function(v){return '<p>X: 2, Y: mín(2,3)=2, Z: 1, W: 0 = <b>'+v[0]+'</b> unidades. Riesgo en X, Y y Z = <b>'+v[1]+'</b> SKU. Y es el más peligroso: se vendió en caja más de lo que se publicaba, así que todo lo publicado ya es fantasma.</p>'}},
quiz:[
{q:'¿Por qué el stock online siempre llega con retraso?',o:['Por diseño de la plataforma únicamente','Porque cada salto entre sistemas suma latencia','Por el color','Por el IGV'],a:1,w:'Cadena de copias.'},
{q:'¿Qué ayuda a reducir sobreventa en SKU populares?',o:['Sincronización por evento y stock de seguridad','Subir el precio','Quitar imágenes','Cerrar la web'],a:0,w:'Menos retraso y colchón.'},
{q:'Un picker reporta «sin ubicar» en un SKU. Medida operativa razonable:',o:['Seguir vendiendo','Pausar su publicación en esa tienda hasta contar y ajustar','Duplicar el stock','Ignorar'],a:1,w:'Evita más cancelaciones mientras se investiga.'}],
src:[['https://help.vtex.com/en/docs/tutorials/order-flow-and-status','VTEX Help Center: reservas y actualización de inventario']],
ver:['Frecuencia y mecanismo de sincronización de cada empresa: '+V('preguntar en entrevista')]},

{id:'4.4',title:'Scorecard de sellers y comisiones',min:20,
goal:'Construir un puntaje ponderado de sellers y calcular la liquidación neta con comisión.',
body:`<p>Un <b>scorecard</b> resume en un número el desempeño de un seller. Pasos: elegir métricas, normalizarlas a una escala común (0 a 100), asignar pesos y sumar.</p>
${T(['Métrica (ejemplo)','Peso (ejemplo)'],[['Despacho a tiempo','40%'],['Baja cancelación (100 − cancelación %)','30%'],['Baja tasa de reclamos','20%'],['Calidad de catálogo','10%']],[1])}
<p>Los pesos de la tabla son didácticos. En un marketplace real los define el negocio; lo que importa es que sean <b>explícitos y conocidos por el seller</b>. La <b>comisión</b> es un porcentaje sobre la venta que el marketplace retiene; la <b>liquidación neta</b> es lo que recibe el seller después de descontar comisión y otros conceptos pactados.</p>
<p>Un buen scorecard <b>no reemplaza</b> al detalle: un seller de 92 puntos puede tener un problema serio en un solo SKU. Úsalo para priorizar, no para cerrar la conversación.</p>`,
example:`<p>Comisión: en 2023 Gestión reportó que variaba según rubro (por ejemplo, alrededor de 20% en ropa y 6 a 8% en celulares). Esas cifras eran de esa nota y de esa fecha; para 2026 pide el contrato del marketplace ${V('comisiones vigentes')}.</p>`,
ex:{type:'calc',intro:'Dos sellers (datos y pesos sintéticos): puntajes 0 a 100 en despacho, baja cancelación, reclamos y catálogo. Pesos: 40%, 30%, 20%, 10%.',cols:['Seller','Despacho','Baja cancelación','Reclamos','Catálogo'],rows:[['A',92,95,88,100],['B',75,85,90,70]],num:[1,2,3,4],
task:'Calcula el puntaje de A, el de B y la liquidación neta de B si vendió S/ 20 000 con comisión de 15%.',
parts:[{l:'Puntaje A',tol:0.05,fn:function(r){var x=r[0];return .4*x[1]+.3*x[2]+.2*x[3]+.1*x[4]}},{l:'Puntaje B',tol:0.05,fn:function(r){var x=r[1];return .4*x[1]+.3*x[2]+.2*x[3]+.1*x[4]}},{l:'Liquidación B',u:'S/',tol:0.5,fn:function(){return 20000*(1-0.15)}}],
sol:function(v){return '<p>A = 36,8 + 28,5 + 17,6 + 10 = <b>'+fmt(v[0])+'</b>. B = 30 + 25,5 + 18 + 7 = <b>'+fmt(v[1])+'</b>. Liquidación B = 20 000 × (1 − 0,15) = <b>S/ '+fmt(v[2],0)+'</b>. La diferencia mayor entre A y B está en despacho: ahí va la conversación.</p>'}},
quiz:[
{q:'¿Por qué normalizar métricas a 0-100?',o:['Por estética','Para poder sumarlas con pesos','Por norma legal','Porque Excel lo exige'],a:1,w:'Métricas en escalas distintas no se suman.'},
{q:'Los pesos de un scorecard deben…',o:['Ser secretos','Ser explícitos y conocidos por el seller','Cambiar cada día','Ser iguales siempre'],a:1,w:'Transparencia para que el seller pueda mejorar.'},
{q:'Un scorecard alto…',o:['Garantiza cero problemas','No excluye problemas puntuales en un SKU','Elimina el reclamo','Cambia la comisión sola'],a:1,w:'Resume, pero oculta detalle.'}],
src:[['https://gestion.pe/economia/empresas/marketplace-busca-vendedores-del-extranjero-para-ampliar-catalogo-las-razones-por-que-es-rentable-cyberwow-marketplace-comercio-electronico-falabellacom-ripley-app-tiendamia-mercado-libre-sellers-noticia/','Gestión (2023): comisiones aproximadas en marketplaces peruanos']],
ver:['Pesos y comisión de 15%: inventados para el ejercicio. Comisiones y métricas oficiales de cada marketplace: '+V('según contrato vigente')]},

{id:'4.5',title:'Plataformas vigentes: VTEX, Shopify y otras (2026/2027)',min:20,
goal:'Reconocer las plataformas que verás en ofertas de trabajo, qué documentar de cada una y qué preguntar en entrevista.',
body:`${T(['Plataforma','Lo que documenta o se sabe','Para verificar en 2027'],[
['VTEX','Documenta un OMS con estados de pedido, ventana de cancelación, reservas y flujo con seller externo. Se presenta como plataforma comercial con módulo de marketplace.','Módulos y nombres vigentes, pricing, integraciones locales'],
['Shopify','Documenta ubicaciones de inventario, división de pedidos por ubicación, estados de fulfillment y entrega local o retiro.','Funciones para retail omnicanal y límites en retiro parcial'],
['Adobe Commerce (Magento)','Mencionada en guías de mercado como plataforma potente para catálogos grandes.','Estado del producto, costos, soporte local'],
['Jumpseller y otras para pymes','Una guía de mercado peruana la recomienda por integración con pasarelas locales.','Alcance real, comisiones']])}
<p>Sobre marketplaces en Perú: según Similarweb, en agosto de 2026 los cinco sitios de marketplace más visitados fueron temu.com, falabella.com.pe, ripley.com.pe, mercadolibre.com.pe y plazavea.com.pe (tráfico, no ventas). Es un ranking de visitas; úsalo como contexto, no como cuota de mercado.</p>
<p>Lo más útil para tu perfil: entender los <b>conceptos comunes</b> (estados, reservas, ubicaciones, sellers, promesa) y poder aprender la plataforma concreta en semanas. En la entrevista pregunta qué plataforma y qué OMS usan y cómo se integran con ERP y WMS.</p>`,
example:`<p>Si una oferta pide «experiencia en VTEX» y tu empresa usaba un sistema interno de despacho, puedes traducir: «manejé el flujo de estados, reservas y cancelaciones en un OMS propio; la lógica es la misma que documenta VTEX». Es una respuesta honesta y fuerte.</p>`,
ex:{type:'reveal',intro:'Ejercicio de entrevista.',task:'Escribe 5 preguntas que harías sobre la plataforma y el stack tecnológico de la empresa.',
sol:'<ol><li>¿Qué plataforma e-commerce y qué OMS usan, y cómo se integran con ERP y WMS?</li><li>¿Cómo y cada cuánto se sincroniza el stock a la plataforma?</li><li>¿Cómo manejan reservas, y qué pasa con las ventas por POS?</li><li>¿Qué marketplaces y qué sellers integran, y cómo miden su cumplimiento?</li><li>¿Qué herramientas de reporte usan (Power BI, Looker Studio, Excel) y quién mantiene los datos?</li></ol>'},
quiz:[
{q:'¿Qué valor tiene un ranking de visitas?',o:['Mide ventas','Da contexto de tráfico, no de ventas ni de cuota','Mide margen','Mide NPS'],a:1,w:'Similarweb estima visitas.'},
{q:'Tu empresa no usaba VTEX. ¿Qué dices en la entrevista?',o:['Que no sabes nada','Que dominas los conceptos comunes y aprenderías la plataforma','Que mientes','Nada'],a:1,w:'Los conceptos son transferibles.'},
{q:'¿Qué haces para hablar de 2027 sin inventar?',o:['Adivinas','Verificas en documentación oficial y lo marcas como pendiente','Copias un blog','Ignoras'],a:1,w:'Documentación oficial y fechas.'}],
src:[['https://help.vtex.com/en/docs/tutorials/order-flow-and-status','VTEX Help Center'],['https://help.shopify.com/en/manual/locations/managing-orders','Shopify Help: pedidos por ubicación'],['https://shopify.dev/docs/api/storefront/latest/enums/orderfulfillmentstatus','Shopify Developers: estados de fulfillment'],['https://www.lmmarketing.com.pe/blog/mejores-plataformas-ecommerce/','LM Marketing: guía de plataformas ecommerce en Perú (blog comercial)'],['https://www.similarweb.com/es/top-websites/peru/e-commerce-and-shopping/marketplace/','Similarweb: ranking de marketplaces en Perú']],
ver:['Toda comparación de precios, funciones y cuota de mercado de plataformas para 2026/2027: '+V('la guía de LM Marketing es una fuente comercial; confirma en los sitios oficiales')]}
]});
