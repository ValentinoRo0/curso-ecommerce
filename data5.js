MODS.push({id:'5',title:'5. Cumplimiento en Perú y empleabilidad',short:'SUNAT, Indecopi, datos personales, entrevista, Excel',blurb:'Comprobantes, reclamos y datos personales, y cómo contar tu experiencia y rendir la prueba.',ch:[
{id:'5.1',title:'Comprobantes electrónicos SUNAT en e-commerce',min:20,
goal:'Elegir el documento correcto (factura, boleta, notas, guía de remisión) según la situación del pedido.',
body:`<ul><li><b>Factura electrónica:</b> a empresas con RUC; permite crédito fiscal del IGV.</li><li><b>Boleta de venta electrónica:</b> a consumidor final.</li><li><b>Nota de crédito:</b> reduce o anula una operación ya facturada (devolución, descuento posterior, error). Va ligada al comprobante original.</li><li><b>Nota de débito:</b> aumenta el valor o suma cargos (por ejemplo, un flete no incluido).</li><li><b>Guía de remisión electrónica (GRE):</b> no es comprobante de pago; sustenta el <i>traslado</i> de bienes. SUNAT indica que la factura-guía dejó de sustentar traslado desde el 13.07.2022 y que el código QR es una de las formas de sustentar el traslado.</li></ul>
<p>Los comprobantes electrónicos se emiten y se firman digitalmente; una vez emitido, no se «borra»: se corrige con una nota o, en casos acotados, se anula dentro de un plazo. SUNAT menciona un plazo excepcional de hasta el décimo día hábil para anular o corregir ciertos casos ${V('condiciones exactas del plazo')}. Existen varias vías de emisión (portal de SUNAT, sistema propio, OSE), según el contribuyente.</p>
<p>Qué debes saber como operaciones: cuando cambias o devuelves un producto ya facturado, hay <b>un documento fiscal detrás</b>. Si la tienda hace el cambio pero nadie emite la nota, aparece el descuadre entre ventas, stock y contabilidad.</p>`,
example:`<p>Un cliente de «Retail Andino» (ficticio) recibe una polera en talla equivocada y pide cambio. Operación: recoge la prenda, ingresa la devolución al stock, se emite la nota de crédito por la boleta original y se genera un nuevo pedido con su propio comprobante. Cada movimiento físico tiene su documento.</p>`,
ex:{type:'match',intro:'¿Qué documento corresponde?',opts:['Factura','Boleta','Nota de crédito','Nota de débito','Guía de remisión'],items:[
{t:'Persona natural sin RUC compra un televisor',a:'Boleta'},
{t:'Empresa con RUC compra 10 laptops y quiere crédito fiscal',a:'Factura'},
{t:'Cliente devuelve un producto ya facturado y se le reembolsa',a:'Nota de crédito'},
{t:'Se omitió cobrar un flete y se cobra aparte sobre un comprobante ya emitido',a:'Nota de débito'},
{t:'El almacén traslada mercadería a la tienda de Surco',a:'Guía de remisión'}],
sol:'<p>Correcto. Tema de entrevista: el sistema genera el comprobante automáticamente, pero tú debes saber <b>cuál</b> y <b>cuándo</b> para entender por qué un pedido queda «sin comprobante».</p>'},
quiz:[
{q:'La guía de remisión sirve para…',o:['Cobrar el IGV','Sustentar el traslado de bienes','Emitir reclamos','Reembolsar'],a:1,w:'No es comprobante de pago.'},
{q:'Una devolución de producto ya facturado se documenta con…',o:['Otra factura','Nota de crédito','Guía','Recibo por honorarios'],a:1,w:'Corrige o anula la operación original.'},
{q:'Un comprobante electrónico emitido y firmado…',o:['Se borra libremente','Se corrige o anula por vías y plazos previstos','No se puede tocar jamás','Se cambia por WhatsApp'],a:1,w:'Existen mecanismos formales.'}],
src:[['https://cpe.sunat.gob.pe/informacion_general/obligados_cpe','SUNAT: sujetos obligados a emitir comprobantes electrónicos'],['https://cpe.sunat.gob.pe/node/122','SUNAT: preguntas frecuentes de guía de remisión electrónica'],['https://cpe.sunat.gob.pe/sistema_emision/see_contribuyente','SUNAT: Sistema de Emisión del Contribuyente (plazos excepcionales)'],['https://perugestiona.pe/tramites-sunat/comprobantes-pago-tipos/','Perú Gestiona: tipos de comprobantes (fuente secundaria)']],
ver:['Cuándo emitir factura tras una boleta, y GRE en entregas a domicilio de e-commerce: '+V('confirmar con SUNAT y con el área contable'),'Cambios normativos de SUNAT en 2026 y 2027 (por ejemplo, fechas de obligatoriedad de nuevos sistemas): '+V('portal de SUNAT')]},

{id:'5.2',title:'Libro de Reclamaciones e Indecopi',min:20,
goal:'Distinguir reclamo de queja, conocer el plazo de respuesta y explicar la nueva obligación para plataformas de e-commerce.',
body:`<p>El <b>Libro de Reclamaciones</b> está regulado en el Código de Protección y Defensa del Consumidor (Ley 29571, arts. 150 y 151) y en su reglamento (DS 011-2011-PCM). Un <b>reclamo</b> es una disconformidad con el producto o servicio; una <b>queja</b> es un malestar sobre la atención, sin pedido concreto de solución.</p>
<p><b>Plazo:</b> la Ley 31435 y el DS 101-2022-PCM fijan 15 días hábiles improrrogables para responder, por el canal que indique el consumidor. El reclamo no impide ir al Indecopi ni es requisito previo.</p>
<p><b>Novedad 2025-2026:</b> la Ley 32495, publicada el 11 de noviembre de 2025, incluye a las plataformas digitales de comercio electrónico en la obligación de contar con Libro de Reclamaciones y exige mostrar de forma permanente un enlace visible. Indecopi supervisa. Según el mismo texto legal, el Ejecutivo debía adecuar el reglamento en 30 días calendario. En julio de 2026 se publicó para comentarios un proyecto de decreto supremo que define «plataforma digital de comercio electrónico» y amplía el alcance a redes sociales; el plazo de comentarios vencía el 2 de agosto de 2026. ${V('si el reglamento final ya se aprobó y cuándo entra en vigor')}</p>
<p>Para operaciones: un reclamo de e-commerce casi siempre nace de una incidencia operativa (entrega tardía, producto equivocado, cancelación). Conoce el flujo con el área de atención al cliente: quién responde, con qué evidencia (estado del pedido, fechas, fotos) y en qué plazo.</p>`,
example:`<p>«Retail Andino» (ficticio) recibe un reclamo por entrega tardía. Atención pide a operaciones: fecha de compra, promesa, fecha de entrega, y motivo del retraso. Si el sistema no guarda la promesa vigente en cada estado, la respuesta se vuelve difícil de sostener.</p>`,
ex:{type:'calc',intro:'Un cliente registra un reclamo el lunes 7 de septiembre de 2026. Supón cómputo desde el día hábil siguiente, sábados y domingos no hábiles y sin feriados en el periodo (ejercicio didáctico).',
task:'¿Qué día de septiembre vence el plazo de 15 días hábiles y cuántos días calendario transcurren desde el 7?',
parts:[{l:'Día de septiembre del vencimiento',tol:0,fn:function(){var d=new Date(Date.UTC(2026,8,7)),n=15;while(n>0){d.setUTCDate(d.getUTCDate()+1);var w=d.getUTCDay();if(w!==0&&w!==6)n--}return d.getUTCDate()}},{l:'Días calendario transcurridos',tol:0,fn:function(){var d=new Date(Date.UTC(2026,8,7)),n=15,c=0;while(n>0){d.setUTCDate(d.getUTCDate()+1);c++;var w=d.getUTCDay();if(w!==0&&w!==6)n--}return c}}],
sol:function(v){return '<p>Vence el <b>'+v[0]+' de septiembre de 2026</b> (lunes), <b>'+v[1]+'</b> días calendario después. En Excel: <code>=DIA.LAB(FECHA(2026;9;7);15;feriados)</code>. El cómputo y los feriados aplicables debes confirmarlos con el área legal; el objetivo es que sepas hacer la cuenta.</p>'}},
quiz:[
{q:'Plazo para responder un reclamo:',o:['5 días','15 días hábiles improrrogables','30 días calendario','No hay plazo'],a:1,w:'Establecido por la Ley 31435 y el DS 101-2022-PCM.'},
{q:'La Ley 32495 (Nov 2025) exige a plataformas de e-commerce…',o:['Solo cobrar comisión','Contar con Libro de Reclamaciones y mostrar su enlace de forma visible y permanente','Cerrar redes sociales','Nada'],a:1,w:'Modifica los artículos 150 y 151 del Código.'},
{q:'Un reclamo registrado en el Libro…',o:['Impide acudir a Indecopi','No impide acudir a Indecopi','Reemplaza la denuncia','Se archiva solo'],a:1,w:'No es requisito previo ni excluye otras vías.'}],
src:[['https://lpderecho.pe/ley-32495-plataformas-digitales-comercio-electronico-libro-reclamaciones/','LP Derecho: texto de la Ley 32495'],['https://www.gob.pe/institucion/indecopi/noticias/1286430-comercios-electronicos-tambien-estan-obligados-a-contar-con-libro-de-reclamaciones-activo-y-visible','Indecopi (gob.pe): comercios electrónicos y Libro de Reclamaciones'],['https://blog.prcp.com.pe/competencia/client-memo-plataformas-digitales-de-comercio-electronico-se-encuentran-obligadas-a-contar-con-un-libro-de-reclamaciones/','Payet, Rey, Cauvi, Pérez: alcance de la Ley 32495'],['https://www.cuatrecasas.com/es/latam/publico/art/se-propone-obligaciones-libro-reclamaciones-plataformas-digitales','Cuatrecasas: proyecto de reglamento (RM 244-2026-PCM)'],['https://gestion.pe/economia/libro-de-reclamaciones-que-cambia-para-las-ventas-por-redes-sociales-noticia/','Gestión: qué cambia para ventas por redes sociales'],['https://laley.pe/libro-de-reclamaciones-cuando-usarlo-y-que-pasa-despues-de-tu-reclamo/','La Ley: reclamo vs. queja y plazo']],
ver:['Número de la ley: la mayoría de fuentes indica Ley 32495; una nota de prensa la cita como 32497. '+V('confirmar en El Peruano'),'Estado del reglamento final y fecha de entrada en vigor: '+V('El Peruano e Indecopi'),'Regla exacta de cómputo del plazo (desde qué día, feriados): '+V('normativa y área legal')]},

{id:'5.3',title:'Protección de datos personales',min:18,
goal:'Reconocer datos personales en tus reportes y aplicar buenas prácticas básicas según la Ley 29733 y su nuevo reglamento.',
body:`<p>La <b>Ley 29733</b> regula el tratamiento de datos personales. Su nuevo reglamento (DS 016-2024-JUS, publicado el 30 de noviembre de 2024) entró en vigor el 31 de marzo de 2025 según la ANPD; algunas fuentes dan el 30 de marzo. La <b>ANPD</b> es la autoridad. Ideas que debes manejar:</p>
<ul><li><b>Consentimiento y finalidad:</b> los datos se usan para lo que el cliente autorizó. El nuevo reglamento refuerza el consentimiento en llamadas publicitarias.</li><li><b>Seguridad:</b> acceso solo a quien lo necesita, y cuidado con exportar y enviar archivos con datos.</li><li><b>Bancos de datos:</b> las empresas deben inscribirlos ante la ANPD ${V('obligaciones vigentes de registro')}.</li><li><b>Incidentes:</b> fuentes secundarias indican notificación a la ANPD en 48 horas ante una brecha ${V('plazo exacto en el DS 016-2024-JUS')}.</li></ul>
<p><b>Práctica del analista:</b> en un reporte operativo casi nunca hace falta el DNI ni el teléfono. Trabaja con número de pedido y agrégalo por tienda, canal y fecha. Si necesitas casos concretos, comparte solo con quien debe actuar. No mandes bases con datos personales por chats personales ni a correos externos.</p>`,
example:`<p>Un Excel de pedidos atorados con nombre, teléfono y dirección se reenvía por WhatsApp a un proveedor de transporte «para agilizar». Aunque la intención sea buena, expone datos de clientes por un canal no autorizado. Alternativa: enviar solo pedido, distrito y estado, y los datos de contacto mediante el sistema autorizado.</p>`,
ex:{type:'match',intro:'En un reporte semanal para gerencia, ¿qué haces con cada campo?',opts:['Quitar o proteger','Mantener'],items:[
{t:'DNI del cliente',a:'Quitar o proteger'},{t:'Teléfono del cliente',a:'Quitar o proteger'},{t:'Dirección exacta de entrega',a:'Quitar o proteger'},{t:'Correo del cliente',a:'Quitar o proteger'},{t:'Distrito de entrega (agregado)',a:'Mantener'},{t:'Estado del pedido',a:'Mantener'},{t:'SKU y monto del pedido',a:'Mantener'}],
sol:'<p>Regla práctica: mínimo necesario. Si la audiencia necesita rastrear un caso concreto, entrega el número de pedido y que atención lo consulte en el sistema.</p>'},
quiz:[
{q:'La autoridad de protección de datos personales en Perú es…',o:['SUNAT','ANPD','Indecopi','SBS'],a:1,w:'Autoridad Nacional de Protección de Datos Personales.'},
{q:'¿Qué datos necesita normalmente un reporte de KPIs?',o:['DNI y teléfono','Datos agregados y número de pedido','Dirección exacta','Tarjeta'],a:1,w:'Principio de minimización.'},
{q:'Enviar una base con datos de clientes por WhatsApp personal es…',o:['Buena práctica','Un riesgo de seguridad y cumplimiento','Obligatorio','Indiferente'],a:1,w:'Canales no autorizados.'}],
src:[['https://www.gob.pe/institucion/anpd/campa%C3%B1as/128319-nuevo-reglamento-de-proteccion-de-datos-personales','ANPD (gob.pe): nuevo Reglamento, vigente desde 31 de marzo de 2025'],['https://www.gob.pe/institucion/minjus/noticias/1137398-nuevo-reglamento-de-proteccion-de-datos-personales-refuerza-el-consentimiento-de-usuarios-para-recibir-llamadas-publicitarias','Minjus (gob.pe): consentimiento en llamadas publicitarias'],['https://iapp.org/news/a/se-publica-el-nuevo-reglamento-de-protecci-n-de-datos-personales-en-per-','IAPP: publicación del nuevo reglamento'],['https://www.altimea.com/blog/nuevo-reglamento-proteccion-datos-peru-ds-016-2024-jus/','Altimea: cambios clave (fuente secundaria)']],
ver:['Fecha de vigencia: la ANPD indica 31 de marzo de 2025; otras fuentes 30 de marzo. '+V('DS 016-2024-JUS'),'Plazo de 48 horas para notificar brechas y montos de sanciones: '+V('texto del reglamento')]},

{id:'5.4',title:'Preguntas de entrevista y cómo contar tu experiencia',min:20,
goal:'Preparar respuestas con estructura para las preguntas típicas del puesto, apoyadas en tu experiencia real.',
body:`<p>Estructura útil para casi toda pregunta de experiencia: <b>Situación → Tarea → Acción → Resultado</b> (STAR). Regla de oro: <b>usa tus cifras reales o di que no las recuerdas con exactitud y cómo las medías</b>. Inventar un número es el error que más te cuesta si te repreguntan.</p>
<p>Tus materiales base: tus reportes diarios de pedidos, el reporte semanal de sellers, el seguimiento de On Time y NPS, el control de stock con ajustes vía almacén de tienda, y el sistema interno de despacho y retiro. Cada uno es una historia potencial.</p>
<p>Recorre las tarjetas de abajo: contesta en voz alta 60 segundos y luego compara con la estructura sugerida.</p>`,
example:`<p>Una respuesta débil: «hacía reportes». Una respuesta fuerte: «armaba cada día el reporte de pedidos y cancelaciones; detectaba las cancelaciones por producto sin ubicar concentradas en unas tiendas; se lo enviaba a operaciones con el motivo y la acción sugerida». Verbo, dato, acción.</p>`,
ex:{type:'flash',intro:'Ocho preguntas típicas. Responde primero, mira después.',cards:[
{q:'Cuéntame de tu experiencia en e-commerce.',a:'<p>Tres frases: <b>dónde</b> (rol y sistema), <b>qué hacías cada semana</b> (reportes diarios y semanales, On Time, NPS, stock) y <b>qué lograste</b> (un ejemplo con tu cifra real). Cierra con lo que buscas ahora.</p>'},
{q:'¿Cómo calculas On Time y qué denominador usas?',a:'<p>Entregados a tiempo sobre entregados, contra la promesa vigente. Aclara que la definición puede variar por empresa y ofrécete a alinearla. Los cancelados no entran al denominador.</p>'},
{q:'El On Time cayó 10 puntos esta semana. ¿Qué haces?',a:'<p>1) Verifico definición y datos. 2) Segmento por tienda, modalidad, categoría y día. 3) Busco concentración. 4) Cruzo con cancelaciones, stock y cambios de proceso o sistema. 5) Propongo hipótesis y cómo confirmarla. 6) Acciones con responsable.</p>'},
{q:'¿Qué es OTIF y por qué no es On Time por In Full?',a:'<p>OTIF cuenta pedidos que cumplen ambas condiciones a la vez; los fallos de tiempo y de completitud pueden estar en pedidos distintos, por eso el producto de los dos porcentajes no coincide.</p>'},
{q:'Explica sobreventa y cómo la reducirías.',a:'<p>Definición breve, causas (POS, ajustes tardíos, stock fantasma, picos), y medidas: sincronización, stock de seguridad, pausar SKU con sin ubicar reiterado, conteos cíclicos y trazabilidad de ajustes.</p>'},
{q:'¿Cómo armas un reporte semanal de sellers?',a:'<p>Columnas: seller, pedidos, despacho a tiempo, cancelación por seller, reclamos y devoluciones. Semáforo con umbrales acordados. Cierro con acciones, casos concretos y responsables.</p>'},
{q:'El dato de Excel no coincide con el de Power BI. ¿Qué haces?',a:'<p>Comparo definición, denominador, filtros, corte de fecha y duplicados. Reproduzco el cálculo paso a paso en ambos y documento la diferencia.</p>'},
{q:'Cuéntame un error tuyo y qué aprendiste.',a:'<p>Elige un error real y acotado. Cuenta qué pasó, cómo lo detectaste, qué corregiste y qué cambio de proceso o control dejaste (por ejemplo, una validación).</p>'}]},
quiz:[
{q:'Si no recuerdas una cifra exacta de tu trabajo anterior, ¿qué haces?',o:['La inventas','Das un rango y explicas cómo la medías','Cambias de tema','Mientes'],a:1,w:'Honestidad y método.'},
{q:'En STAR, la «R» es…',o:['Riesgo','Resultado','Rol','Regla'],a:1,w:'Resultado medible.'},
{q:'Una respuesta fuerte incluye…',o:['Solo adjetivos','Verbo, dato y acción','Solo el nombre de la empresa','Solo el sistema'],a:1,w:'Concreta y verificable.'}],
src:[],
ver:['Este capítulo es método de práctica, sin fuente normativa. Adapta las respuestas a tus cifras reales.']},

{id:'5.5',title:'Prueba de Excel para el puesto (cronometrada)',min:20,
goal:'Practicar el tipo de tareas que suelen pedir en una prueba de Excel para operaciones e-commerce, con reloj.',
body:`<p>Las pruebas varían, pero para este puesto suelen pedir: buscar datos entre tablas (<code>BUSCARV</code> o <code>BUSCARX</code>), sumar y contar con condiciones (<code>SUMAR.SI.CONJUNTO</code>, <code>CONTAR.SI.CONJUNTO</code>), <code>SI</code> y <code>SI.ERROR</code>, fechas (<code>DIAS.LAB</code>, <code>DIA.LAB</code>), tablas dinámicas, formato condicional y limpieza de datos con Power Query ${V('confirmar con la convocatoria de cada empresa')}.</p>
<p>Pega el CSV en Excel (botón «Datos sintéticos»), inicia el cronómetro de 30 minutos y resuelve las seis preguntas. Después compara con la solución. Practica hacerlo <b>sin mirar apuntes</b> al menos una vez.</p>`,
example:`<p>Un consejo práctico: antes de fórmulas, convierte el rango en <b>Tabla</b> (Ctrl+T) y ponle nombre. Las referencias estructuradas evitan errores al ampliar datos, y en una prueba te ahorran minutos.</p>`,
ex:{type:'calc',data:true,timer:1800,task:'Resuelve con el CSV en Excel.',
parts:[
{l:'1. Monto total de pedidos entregados',u:'S/',tol:0.5,fn:function(d){return d.filter(function(r){return r.estado==='Entregado'}).reduce(function(a,r){return a+r.monto},0)}},
{l:'2. Cancelaciones por «Pago rechazado»',tol:0,fn:function(d){return d.filter(function(r){return r.motivo==='Pago rechazado'}).length}},
{l:'3. Ticket promedio de Tecnología entregados',u:'S/',tol:0.5,fn:function(d){return K.ticket(d.filter(function(r){return r.categoria==='Tecnología'}))}},
{l:'4. On Time de «Mismo día»',u:'%',tol:0.1,fn:function(d){return K.ontime(d.filter(function(r){return r.modalidad==='Mismo día'}))}},
{l:'5. Lead time medio de Domicilio',u:'días',tol:0.05,fn:function(d){return K.leadDays(d.filter(function(r){return r.modalidad==='Domicilio'}))}},
{l:'6. Entregados con 2 o más días de retraso',tol:0,fn:function(d){return d.filter(function(r){return r.estado==='Entregado'&&(new Date(r.entrega)-new Date(r.prometida))/864e5>=2}).length}}],
sol:function(v){return '<ol><li><b>S/ '+fmt(v[0],0)+'</b>: <code>=SUMAR.SI(K:K;"Entregado";J:J)</code></li><li><b>'+v[1]+'</b>: <code>=CONTAR.SI(L:L;"Pago rechazado")</code></li><li><b>S/ '+fmt(v[2])+'</b>: <code>=PROMEDIO.SI.CONJUNTO(J:J;K:K;"Entregado";G:G;"Tecnología")</code></li><li><b>'+fmt(v[3])+'%</b>: columna auxiliar de a_tiempo y luego <code>=SUMAR.SI.CONJUNTO(O:O;F:F;"Mismo día")/CONTAR.SI.CONJUNTO(F:F;"Mismo día";K:K;"Entregado")</code></li><li><b>'+fmt(v[4],2)+' días</b>: columna auxiliar <code>=SI(K2="Entregado";N2-B2;"")</code> y <code>=PROMEDIO.SI(F:F;"Domicilio";P:P)</code></li><li><b>'+v[5]+'</b>: auxiliar <code>=SI(K2="Entregado";N2-M2;"")</code> y <code>=CONTAR.SI(Q:Q;">=2")</code></li></ol><p class="small">Si tu Excel usa comas, sustituye los puntos y coma. Si las fechas se importaron como texto, conviértelas primero.</p>'}},
quiz:[
{q:'¿Por qué convertir el rango en Tabla (Ctrl+T)?',o:['Por estética','Para usar referencias estructuradas que se amplían solas','Para bloquear la hoja','Para ocultar columnas'],a:1,w:'Reduce errores al ampliar datos.'},
{q:'Para contar filas con dos condiciones usas…',o:['CONTAR.SI.CONJUNTO','SUMA','MAX','ALEATORIO'],a:0,w:'Acepta varios criterios.'},
{q:'BUSCARX frente a BUSCARV:',o:['Solo busca a la derecha','Busca en cualquier dirección y no depende del número de columna','Es más lento','No existe'],a:1,w:'Más flexible; verifica que tu versión de Excel lo incluya.'}],
src:[],
ver:['Funciones disponibles según tu versión de Excel (por ejemplo, BUSCARX). '+V('probar en tu Excel')]}
]});

MODS.push({id:'C',title:'Caso final del curso base',short:'On Time y cancelaciones por stock desalineado',blurb:'Un reporte completo con datos sintéticos, de la exploración a la recomendación.',ch:[
{id:'caso',title:'On Time y cancelaciones por stock desalineado',min:75,
goal:'Producir un reporte para operaciones: qué pasó con el On Time y las cancelaciones, dónde se concentra, qué causa es probable y qué acciones tomar.',
body:`<p><b>Situación.</b> Eres analista en «Retail Andino» (ficticio). Operaciones nota que el On Time bajó y las cancelaciones subieron en septiembre. Tienes 320 pedidos del 1 al 14 de septiembre de 2026 (datos sintéticos). Tu jefe pide un reporte que explique qué pasó y qué hacer.</p>
<h3>Ruta de análisis sugerida</h3>
<ol><li><b>Define</b> On Time (sobre entregados) y cancelación (sobre creados) y escríbelo en el reporte.</li><li><b>Tendencia por día</b>: ¿hay un punto de quiebre?</li><li><b>Cortes</b>: tienda, categoría, modalidad y canal.</li><li><b>Concentración</b>: ¿pocas celdas explican la mayoría de cancelaciones?</li><li><b>Hipótesis</b>: qué la explicaría y cómo la confirmarías.</li><li><b>Acciones</b> con responsable y fecha.</li></ol>
<p>Cómo lo harías en cada herramienta: en <b>Power Query</b>, la consulta del capítulo 3.4 más un grupo por tienda, categoría y período. En <b>SQL Server</b>, el <code>GROUP BY</code> del 3.5 con <code>CASE WHEN fecha &gt;= '2026-09-08'</code>. En <b>Power BI</b>, las medidas del 3.5 con segmentadores de tienda, categoría y fecha.</p>
<p><b>Ojo:</b> encontrarás más de un hallazgo. No todos tienen la misma causa ni la misma urgencia. Distingue lo que ves en los datos de lo que solo es una hipótesis.</p>`,
ex:{type:'case',data:true,intro:'Explora los datos con los filtros. Cambia el período a «8 al 14 de septiembre» y compara. Luego responde las preguntas.',
task:'Preguntas del caso (calcúlalas tú con el CSV y compara).',
parts:[
{l:'On Time global',u:'%',tol:0.1,fn:function(d){return K.ontime(d)}},
{l:'Cancelación global',u:'%',tol:0.1,fn:function(d){return K.cancelPct(d)}},
{l:'On Time Surco, 1 al 7 sep',u:'%',tol:0.1,fn:function(d){return K.ontime(d.filter(function(r){return r.tienda==='Surco'&&r.fecha<'2026-09-08'}))}},
{l:'On Time Surco, 8 al 14 sep',u:'%',tol:0.1,fn:function(d){return K.ontime(d.filter(function(r){return r.tienda==='Surco'&&r.fecha>='2026-09-08'}))}},
{l:'Cancelación Surco Tecnología, 8 al 14 sep',u:'%',tol:0.1,fn:function(d){return K.cancelPct(d.filter(function(r){return r.tienda==='Surco'&&r.categoria==='Tecnología'&&r.fecha>='2026-09-08'}))}},
{l:'Cancelaciones por stock (sin ubicar o sobreventa) en Surco Tecnología desde el 8 sep',tol:0,fn:function(d){return d.filter(function(r){return r.tienda==='Surco'&&r.categoria==='Tecnología'&&r.fecha>='2026-09-08'&&r.estado==='Cancelado'&&(r.motivo==='Producto sin ubicar'||r.motivo==='Sobreventa')}).length}},
{l:'Esas cancelaciones sobre el total de cancelaciones',u:'%',tol:0.1,fn:function(d){var t=d.filter(function(r){return r.estado==='Cancelado'}).length;var s=d.filter(function(r){return r.tienda==='Surco'&&r.categoria==='Tecnología'&&r.fecha>='2026-09-08'&&r.estado==='Cancelado'&&(r.motivo==='Producto sin ubicar'||r.motivo==='Sobreventa')}).length;return 100*s/t}},
{l:'On Time del resto (todo menos Surco desde el 8 sep)',u:'%',tol:0.1,fn:function(d){return K.ontime(d.filter(function(r){return !(r.tienda==='Surco'&&r.fecha>='2026-09-08')}))}}],
sol:function(v){return '<p>On Time global <b>'+fmt(v[0])+'%</b>, cancelación <b>'+fmt(v[1])+'%</b>. Surco pasó de <b>'+fmt(v[2])+'%</b> a <b>'+fmt(v[3])+'%</b> de On Time tras el 8 de septiembre, mientras el resto de la operación se mantiene en <b>'+fmt(v[7])+'%</b>. En Surco Tecnología, la cancelación llega a <b>'+fmt(v[4])+'%</b>, y las cancelaciones por stock allí ('+v[5]+') son el <b>'+fmt(v[6])+'%</b> de todas las cancelaciones del período.'+(Math.abs(v[4]-v[6])<0.05?' Ojo: los dos porcentajes coinciden por casualidad (ambos son 7 de 16), pero miden universos distintos: uno sobre pedidos de esa celda y el otro sobre todas las cancelaciones.':'')+'</p>'},
template:'1. Resumen (2 líneas)\n\n\n2. Hallazgos (3 cifras con su denominador)\n\n\n3. Causa probable y cómo la confirmarías\n\n\n4. Acciones (qué, quién, cuándo)\n\n\n5. Riesgos si no se actúa\n\n\n6. Próximo reporte y datos que necesito\n',
model:function(){
  var d=DATA,ot=K.ontime(d),ca=K.cancelPct(d);
  var sp=d.filter(function(r){return r.tienda==='Surco'&&r.fecha<'2026-09-08'}),sq=d.filter(function(r){return r.tienda==='Surco'&&r.fecha>='2026-09-08'});
  var zt=sq.filter(function(r){return r.categoria==='Tecnología'});
  var stock=function(r){return r.estado==='Cancelado'&&(r.motivo==='Producto sin ubicar'||r.motivo==='Sobreventa')};
  var totC=d.filter(function(r){return r.estado==='Cancelado'}).length,zs=zt.filter(stock).length;
  var resto=d.filter(function(r){return !(r.tienda==='Surco'&&r.fecha>='2026-09-08')});
  var sell=d.filter(function(r){return r.tienda==='Seller'});
  return '<h3>Reporte modelo</h3><p class="small">Definiciones: On Time = entregados hasta la fecha prometida / entregados; cancelación = cancelados / creados. Datos sintéticos del 1 al 14 de septiembre de 2026.</p>'
  +'<p><b>1. Resumen.</b> El On Time global es '+fmt(ot)+'% y la cancelación '+fmt(ca)+'%. El deterioro se concentra en la tienda Surco desde el 8 de septiembre, sobre todo en Tecnología.</p>'
  +'<p><b>2. Hallazgos.</b></p><ul><li>Surco pasó de '+fmt(K.ontime(sp))+'% de On Time (1 al 7) a '+fmt(K.ontime(sq))+'% (8 al 14). El resto de la operación está en '+fmt(K.ontime(resto))+'%.</li><li>Surco Tecnología, 8 al 14: cancelación de '+fmt(K.cancelPct(zt))+'% ('+zt.filter(function(r){return r.estado==='Cancelado'}).length+' de '+zt.length+' pedidos).</li><li>Cancelaciones por stock (sin ubicar o sobreventa) en esa celda: '+zs+', el '+fmt(100*zs/totC)+'% de todas las cancelaciones del período.</li><li>Aparte, los pedidos de sellers (3P) tienen On Time de '+fmt(K.ontime(sell))+'%: es otro problema que merece su propio seguimiento.</li></ul>'
  +'<p><b>3. Causa probable.</b> Compatible con stock desalineado en Surco Tecnología (ajuste o recepción no reflejados, o ventas de caja no sincronizadas). Es una hipótesis: los datos muestran dónde y desde cuándo, no por qué. Confirmación: conteo físico de los SKU más cancelados y revisión de la hora de los ajustes y de las ventas de POS.</p>'
  +'<p><b>4. Acciones.</b> Hoy: pausar publicación de los SKU con más cancelaciones en Surco hasta contar (responsable: inventarios). En 48 h: conteo cíclico y ajuste con hora registrada (tienda y almacén). Esta semana: revisar sincronización POS a plataforma y stock de seguridad de Tecnología.</p>'
  +'<p><b>5. Riesgos.</b> Si sigue: más cancelaciones por stock, caída del NPS y reclamos con plazo de 15 días hábiles. En campañas, el efecto se multiplica.</p>'
  +'<p><b>6. Próximo reporte.</b> Repetir cortes por tienda y categoría en 7 días, más histórico de ajustes con fecha y hora para validar la causa.</p>';
}},
quiz:null,
src:[['https://sourceday.com/blog/otif/','SourceDay: OTIF'],['https://help.vtex.com/en/docs/tutorials/order-flow-and-status','VTEX Help Center: reservas e inventario']],
ver:['Todos los datos de este caso son sintéticos. Ninguna cifra corresponde a una empresa real.']}
]});
