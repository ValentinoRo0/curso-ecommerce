/* ===== Glosario ===== */
var GLOS=[];
function G(k,t,a,cat,d,f,v,cs,ns){GLOS.push({k:k,t:t,a:a,cat:cat,d:d,f:f||'',v:v||'',cs:!!cs,ns:!!ns})}
var CATS=['Sistemas y plataformas','Operación y logística','Inventario','KPIs y métricas','Catálogo y comercial','Normativa en Perú','Datos y estadística','SQL y Power BI','Power Automate'];

/* --- Sistemas y plataformas --- */
G('plataforma','Plataforma e-commerce',['Plataforma e-commerce','plataforma de e-commerce'],CATS[0],'El sistema que ve el cliente: vitrina, carrito, checkout, catálogo y precios. Cobra y crea el pedido, pero no lo prepara ni lo entrega.','','1.1');
G('oms','OMS (gestión de pedidos)',['OMS','Order Management System'],CATS[0],'Sistema que recibe el pedido, decide desde qué tienda o almacén se atiende, reserva el inventario y controla los estados y las cancelaciones. Es la fuente de verdad del estado del pedido.','','1.1',1);
G('wms','WMS (gestión de almacén)',['WMS','Warehouse Management System'],CATS[0],'Sistema del almacén: controla ubicaciones, recepción, picking, packing e inventario físico.','','1.1',1);
G('erp','ERP',['ERP'],CATS[0],'Sistema central de la empresa: compras, finanzas, costos, inventario contable, maestro de productos y facturación.','','1.1',1);
G('tms','TMS (gestión de transporte)',['TMS','Transportation Management System'],CATS[0],'Sistema de transporte: rutas, transportistas, tracking y costo de despacho.','','1.1',1);
G('pos','POS (punto de venta)',['POS','punto de venta'],CATS[0],'La caja de la tienda física. Vende y descuenta stock de tienda por un camino distinto al online, por eso es fuente clásica de desalineación de stock.','','1.1',1);
G('crm','CRM',['CRM'],CATS[0],'Sistema que guarda la ficha del cliente, su historial, campañas y atención, incluidos los reclamos.','','1.1',1);
G('api','API',['API'],CATS[0],'Puerta por la que un sistema ofrece sus datos o funciones a otro, sin que nadie los copie a mano. Sin API, la integración suele ser frágil.','','11.1',1);
G('integracion','Integración entre sistemas',['integración entre sistemas','integraciones','integración OMS'],CATS[0],'Conexión que hace viajar un dato de un sistema a otro (por ejemplo, un ajuste de stock del almacén hacia la plataforma). Casi todos los problemas operativos nacen en estas fronteras.','','1.1');
G('vtex','VTEX',['VTEX'],CATS[0],'Plataforma comercial con OMS y módulo de marketplace. Su documentación pública es una buena referencia de estados de pedido, reservas y sellers.','','1.2',1);
G('shopify','Shopify',['Shopify'],CATS[0],'Plataforma de comercio electrónico. Su documentación describe ubicaciones de inventario, pedidos divididos por ubicación y entrega local o retiro.','','4.5');
G('marketplace','Marketplace',['marketplace','marketplaces'],CATS[0],'Plataforma donde el retailer vende productos propios (1P) y también de sellers externos (3P), y cobra comisión por estos últimos.','','1.5');
G('1p','1P (first party)',['1P','first party'],CATS[0],'Modelo en que el retailer compra el producto, lo almacena y lo vende. Gana el margen completo y controla stock y entrega.','','1.5',1);
G('3p','3P (third party)',['3P','third party'],CATS[0],'Modelo en que un seller externo publica en el marketplace y responde por el producto; el retailer cobra una comisión.','','1.5',1);
G('seller','Seller',['seller','sellers'],CATS[0],'Vendedor externo que publica sus productos en un marketplace.','','1.5');
G('comision','Comisión',['comisión','comisiones'],CATS[0],'Porcentaje de la venta que el marketplace retiene al seller. Liquidación neta = venta − comisión − otros conceptos pactados.','Liquidación neta = venta × (1 − comisión)','1.5');
G('bandera','Bandera',['bandera','banderas'],CATS[0],'Marca o formato comercial de un grupo retail (supermercado, hogar, moda…). Cada bandera puede tener su catálogo, promociones y ventanas de entrega.','','1.4');
G('canal','Canal',['canal de venta','canales'],CATS[0],'Por dónde entra el pedido: web, app, marketplace, WhatsApp o call center.','','1.4');
G('omnicanal','Omnicanal',['omnicanal'],CATS[0],'Modelo en que tienda, web y app funcionan como una sola operación, con stock y pedidos conectados.','','7.1');
G('dlp','Política DLP',['DLP','políticas DLP'],CATS[8],'Reglas de un administrador que bloquean o agrupan los conectores permitidos en Power Platform. Aunque un conector exista, tu organización puede no permitirlo.','','11.3',1);

/* --- Operación y logística --- */
G('promesa','Promesa de entrega',['promesa de entrega','promesa vigente','promesa'],CATS[1],'Fecha o franja de entrega que se le confirma al cliente al comprar. Es el punto de comparación para medir On Time.','','1.2');
G('picking','Picking',['picking'],CATS[1],'Recoger los productos de un pedido en sus ubicaciones de almacén o tienda.','','2.2');
G('packing','Packing',['packing'],CATS[1],'Embalar y etiquetar el pedido ya recogido.','','2.2');
G('batch','Picking por lote, por zona y por oleada',['picking por lote','batch picking','picking por zona','oleadas','oleada','wave'],CATS[1],'Métodos de picking. Por lote: un picker recoge varios pedidos a la vez y luego se separan. Por zona: cada picker cubre una zona y el pedido pasa de zona en zona. Por oleada: se lanzan grupos de pedidos en horarios fijos, alineados al corte de despacho.','','2.2');
G('putwall','Put wall',['put wall'],CATS[1],'Muro con casilleros donde se reparten los productos de un lote a cada pedido.','','7.3');
G('putaway','Putaway (ubicación de ingreso)',['putaway'],CATS[1],'Asignar en qué ubicación se guarda lo que acaba de recibirse.','','7.2');
G('slotting','Slotting',['slotting'],CATS[1],'Decidir dónde ubicar cada SKU en el almacén. Lo que más rota va cerca del packing y a una altura cómoda, para reducir la caminata.','','7.2');
G('fefo','FIFO y FEFO',['FIFO','FEFO'],CATS[1],'FIFO: sale primero lo que entró primero. FEFO: sale primero lo que vence primero (perecibles).','','7.2',1);
G('corte','Corte (cut-off)',['corte','cut-off'],CATS[1],'Hora límite para que un pedido entre en la ruta o el despacho de hoy. Pasada esa hora, sale al día siguiente.','','1.3',0,1);
G('franja','Franja horaria',['franja horaria','franjas horarias','franja','franjas','ventana horaria','ventanas horarias'],CATS[1],'Rango de horas en que se promete la entrega. Cada franja tiene una capacidad máxima de pedidos.','','1.3');
G('capacidad','Capacidad de entrega',['capacidad por franja','capacidades de entrega','capacidad de entrega'],CATS[1],'Cuántos pedidos puede atender la operación en una franja. Si se venden más que la capacidad, llegarán tarde aunque nadie falle.','','1.3');
G('retiro','Retiro en tienda (click and collect)',['retiro en tienda','click and collect'],CATS[1],'El cliente recoge el pedido en la tienda. No hay transporte de por medio; el hito clave es «pedido listo para retiro».','','1.3');
G('mismodia','Mismo día',['mismo día','same day','express'],CATS[1],'Entrega con promesa en horas. Depende del corte horario, del radio de cobertura y de tener stock y picker en tienda.','','1.3');
G('shipfromstore','Despacho desde tienda (ship-from-store)',['ship-from-store','despacho desde tienda'],CATS[1],'Atender pedidos online con el stock y el personal de una tienda física. Rápido y cercano, pero con picking más caro.','','7.1');
G('darkstore','Dark store y micro-fulfillment',['dark store','micro-fulfillment'],CATS[1],'Espacio pequeño dedicado solo a preparar pedidos online, cerca de zonas de alta demanda.','','7.1');
G('crossdock','Cross-docking',['cross-docking','cross-dock'],CATS[1],'Recibir mercadería y despacharla sin almacenarla.','','7.1');
G('cd','Centro de distribución (CD)',['centro de distribución','CD'],CATS[1],'Almacén grande y centralizado que abastece tiendas y pedidos online.','','7.1',1);
G('3pl','Operador logístico (3PL)',['operador logístico','operadores logísticos','3PL'],CATS[1],'Empresa externa que presta servicios de almacenaje, transporte o entrega.','','7.6',1);
G('courier','Courier',['courier','couriers'],CATS[1],'Empresa de mensajería o paquetería que entrega envíos.','','7.4');
G('ultimamilla','Última milla',['última milla'],CATS[1],'Tramo final: del último nodo (tienda o almacén) a la puerta del cliente. Suele ser la etapa más cara.','','7.4');
G('ruta','Ruta',['ruta','rutas'],CATS[1],'Conjunto de paradas que recorre un vehículo o repartidor en un turno.','','2.3');
G('consolidacion','Consolidación',['consolidación','consolidar','consolidan'],CATS[1],'Juntar pedidos cercanos en una misma ruta para bajar costo. Tiene un límite: si los distritos están lejos, alarga el tiempo y puede romper la promesa.','','2.3');
G('pod','Prueba de entrega (POD)',['prueba de entrega','POD'],CATS[1],'Evidencia de que se entregó (firma, foto o código). Sirve para reclamos y para cerrar el pedido.','','7.4',1);
G('gre','Guía de remisión electrónica (GRE)',['guía de remisión','GRE'],CATS[5],'Documento que sustenta el traslado de bienes (por ejemplo, del almacén a una tienda). No es comprobante de pago.','','5.1',1);
G('incidencia','Incidencia',['incidencia','incidencias'],CATS[1],'Cualquier desvío entre lo prometido y lo ocurrido: cliente ausente, dirección errada, producto dañado, faltante o demora.','','2.4');
G('cambio','Cambio y devolución',['cambio y devolución','cambios y devoluciones','devolución','devoluciones'],CATS[1],'Cambio: se reemplaza el producto. Devolución: el producto regresa y normalmente hay reembolso.','','2.4');
G('logisticainversa','Logística inversa',['logística inversa'],CATS[1],'Flujo de retorno de productos del cliente al retailer: cambios, devoluciones y mermas.','','2.4');
G('merma','Merma',['merma','mermas'],CATS[2],'Producto dañado, vencido o perdido que no se puede vender. Se registra aparte de las devoluciones vendibles.','','2.4');
G('pareto','Pareto',['Pareto'],CATS[6],'Ordena causas de mayor a menor con su porcentaje acumulado. Suele mostrar que pocas causas explican la mayoría de los casos.','','2.4');
G('aging','Antigüedad en estado (aging)',['antigüedad en estado','aging'],CATS[1],'Horas que lleva un pedido en su estado actual. Sirve para detectar pedidos que no avanzan.','','2.1');
G('atorado','Pedido atorado',['pedidos atorados','pedido atorado','atorados'],CATS[1],'Pedido cuya antigüedad en un estado supera el umbral definido por la operación.','','2.1');
G('estadosvtex','Estados de pedido (VTEX)',['Ready for handling','Payment pending','Payment approved','Cancellation window','Verifying invoice','Invoiced'],CATS[1],'Payment pending: pago en revisión. Payment approved: pago aprobado. Cancellation window: periodo en que el cliente puede cancelar sin aprobación. Ready for handling: listo para que la tienda empiece a atenderlo. Verifying invoice: se espera el comprobante. Invoiced: facturado (estado final, junto a Canceled).','','1.2');
G('precancelacion','Cancelación anticipada (pre-cancelación)',['pre-cancelación','cancelación anticipada'],CATS[1],'Cancelar un pedido antes de iniciar el picking, cuando ya se sabe que no hay stock. Evita horas de espera del cliente.','','2.2');
G('sustituto','Sustitución',['sustituto','sustitutos','sustitución'],CATS[1],'Ofrecer otro producto cuando el pedido no se puede completar, con autorización del cliente.','','2.2');
G('reasignacion','Reasignación',['reasignación','reasignaciones','reasignar'],CATS[1],'Mover un pedido de un nodo (tienda o almacén) a otro. Muchas reasignaciones suelen indicar stock poco confiable.','','1.2');
G('split','Pedido dividido',['pedido dividido','pedidos divididos'],CATS[1],'Pedido que sale en varios envíos porque no se puede completar desde una sola ubicación. Sube el costo y el riesgo de errores.','','7.1');
G('dockstock','Dock-to-stock',['dock-to-stock'],CATS[1],'Tiempo entre la llegada de la mercadería y el momento en que queda disponible para vender.','Hora de disponible − hora de llegada','7.2');
G('reposicion','Reposición',['reposición'],CATS[2],'Reabastecer una ubicación o un SKU. Puede ser interna (del almacén a la ubicación de picking) o al proveedor.','','7.3');
G('ocupacion','Ocupación',['ocupación'],CATS[1],'Porcentaje del espacio o de la capacidad que está en uso.','Ocupadas / totales','7.2');
G('lph','LPH y UPH',['LPH','UPH'],CATS[3],'Productividad de picking: líneas por hora (LPH) o unidades por hora (UPH).','UPH = unidades / horas trabajadas','2.2',1);

/* --- Inventario --- */
G('stockfisico','Stock físico',['stock físico'],CATS[2],'Lo que realmente hay en la ubicación.','','2.5');
G('stockdisp','Stock disponible',['stock disponible','disponible publicado'],CATS[2],'Lo que se puede ofrecer online: físico menos reservado, bloqueado y stock de seguridad.','máx(0, Físico − Reservado − Bloqueado − Seguridad)','2.5');
G('reservado','Stock reservado y bloqueado',['reservado','reservados','bloqueado','bloqueados'],CATS[2],'Reservado: unidades comprometidas a pedidos en curso. Bloqueado: unidades dañadas, en revisión o apartadas.','','2.5');
G('ss','Stock de seguridad',['stock de seguridad'],CATS[2],'Colchón que se resta a propósito para absorber variaciones de la demanda o del proveedor, o desalineaciones entre sistemas.','SS = z × σd × √L','8.3');
G('ajuste','Ajuste de inventario',['ajuste de inventario','ajustes de inventario','ajuste de stock','ajustes de stock'],CATS[2],'Corrección de la diferencia entre el sistema y la realidad (positivo si sobra, negativo si falta).','','2.5');
G('conteo','Conteo cíclico',['conteo cíclico','conteos cíclicos'],CATS[2],'Contar una parte del inventario cada día en vez de todo una vez al año. Suele contarse más seguido lo de clase A.','','8.2');
G('ira','Exactitud de inventario (IRA)',['IRA','exactitud de inventario','precisión de inventario'],CATS[2],'Qué tan bien coincide el stock del sistema con el físico.','IRA = ubicaciones o SKU contados sin diferencia / contados','2.5',1);
G('sobreventa','Sobreventa',['sobreventa'],CATS[2],'Se vendió más de lo que realmente existe.','','2.6');
G('sinubicar','Producto sin ubicar',['sin ubicar','producto sin ubicar'],CATS[2],'El picker no encuentra el producto donde el sistema dice. Es el síntoma; la causa suele ser stock desalineado.','','2.6');
G('fantasma','Stock fantasma',['stock fantasma'],CATS[2],'El sistema dice que hay stock pero físicamente no está (merma, hurto o error de recepción sin ajustar).','','2.6');
G('quiebre','Quiebre de stock',['quiebre','quiebres'],CATS[2],'Situación en que un SKU se agota y no se puede vender.','','2.6');
G('desalineado','Stock desalineado',['stock desalineado','desalineación'],CATS[2],'El stock que muestra el sistema no coincide con el que hay en la tienda o el almacén.','','2.6');
G('leadtimerep','Lead time de reposición',['lead time de reposición','lead time del proveedor'],CATS[2],'Tiempo que tarda el proveedor entre el pedido y la recepción. No es lo mismo que el lead time de entrega al cliente.','','8.3');
G('rop','Punto de reorden (ROP)',['punto de reorden','ROP'],CATS[2],'Nivel de stock en que conviene pedir. Responde «¿cuándo pido?».','ROP = demanda diaria × lead time + stock de seguridad','8.3',1);
G('eoq','Lote económico (EOQ)',['lote económico','EOQ'],CATS[2],'Cantidad por pedido que minimiza la suma del costo de pedir y del costo de mantener. Responde «¿cuánto pido?».','EOQ = √(2 × D × S / H)','8.4',1);
G('nivelservicio','Nivel de servicio',['nivel de servicio'],CATS[2],'Probabilidad de no quedarte sin stock durante un ciclo de reposición. Subirlo encarece el inventario cada vez más.','','8.3');
G('rotacion','Rotación de inventario',['rotación de inventario','rotación'],CATS[2],'Cuántas veces se «renueva» el inventario en el periodo.','Costo de ventas / inventario promedio','8.5');
G('diasinv','Días de inventario',['días de inventario'],CATS[2],'Cuánto tarda el inventario en venderse.','365 / rotación','8.5');
G('cobertura','Cobertura (días)',['cobertura'],CATS[2],'Cuántos días de demanda cubre el stock actual. En entregas, «cobertura» también es el área geográfica que se atiende.','Stock / demanda diaria','8.5');
G('sellthrough','Sell-through',['sell-through'],CATS[2],'Proporción de las unidades disponibles que se vendieron en el periodo. La definición exacta la fija cada empresa.','','8.5');
G('abc','Clasificación ABC',['ABC','clasificación ABC','análisis ABC'],CATS[2],'Ordena los SKU por valor anual acumulado: A hasta cerca del 80%, B hasta cerca del 95% y C el resto. Sirve para decidir dónde poner atención.','','8.2',1);
G('xyz','Clasificación XYZ',['XYZ'],CATS[2],'Clasifica los SKU por variabilidad de la demanda con el coeficiente de variación: X estable, Y variable, Z errática.','CV = desviación / media','8.2',1);
G('muerto','Inventario inmovilizado',['inventario muerto','inventario inmovilizado','stock sin movimiento'],CATS[2],'Stock que no se mueve por un periodo definido; capital atado sin retorno.','','8.5');

/* --- KPIs y métricas --- */
G('kpi','KPI (indicador clave)',['KPI','KPIs','indicador clave','indicadores'],CATS[3],'Medida numérica que dice si una etapa o un proceso va bien. Cada KPI necesita definición, fórmula y denominador claros.','','3.1',1);
G('denominador','Denominador',['denominador'],CATS[3],'El universo sobre el que se calcula un porcentaje. Mal elegido, «mejora» o «empeora» un KPI artificialmente.','','3.1');
G('ontime','On Time / Off Time',['On Time','Off Time'],CATS[3],'On Time: pedidos entregados dentro de la fecha o franja prometida. Off Time: los que llegaron fuera de la promesa.','On Time % = entregados a tiempo / entregados','3.1');
G('fillrate','Fill Rate',['Fill Rate'],CATS[3],'Cuánto de lo pedido se logró surtir, medido en unidades.','Unidades entregadas / unidades pedidas','3.2');
G('infull','In Full',['In Full'],CATS[3],'Pedidos entregados completos sobre pedidos entregados.','','3.2');
G('otif','OTIF (On Time In Full)',['OTIF'],CATS[3],'Pedidos que cumplen a la vez «a tiempo» y «completo». Los fallos de tiempo y de completitud pueden estar en pedidos distintos, por eso no es el producto de los dos porcentajes.','OTIF = a tiempo y completos / entregados','3.2',1);
G('nps','NPS',['NPS','Net Promoter Score'],CATS[3],'Encuesta de 0 a 10: «¿qué tan probable es que nos recomiendes?». Promotores 9-10, pasivos 7-8, detractores 0-6.','NPS = % promotores − % detractores','3.3',1);
G('promotores','Promotores, pasivos y detractores',['promotores','detractores','pasivos'],CATS[3],'Grupos del NPS según la nota: promotores 9 y 10, pasivos 7 y 8, detractores 0 a 6.','','3.3');
G('cancel','Tasa de cancelación',['tasa de cancelación','cancelación %'],CATS[3],'Porcentaje de pedidos creados que terminaron cancelados.','Cancelados / creados','3.1');
G('leadtime','Lead time (entrega)',['lead time'],CATS[3],'Tiempo desde la compra hasta la entrega, promedio en días u horas. En compras a proveedores es el tiempo de reposición.','Fecha de entrega − fecha de compra','3.1');
G('ticket','Ticket promedio',['ticket promedio','ticket'],CATS[3],'Valor promedio de un pedido.','Ventas de pedidos entregados / pedidos entregados','3.1');
G('conversion','Conversión',['conversión'],CATS[3],'Porcentaje de visitas que terminan en compra.','Compras / visitas','1.2');
G('error','Tasa de error de picking',['tasa de error','exactitud de picking'],CATS[3],'Pedidos (o unidades) con error de preparación sobre los preparados. Define cuál base usas.','Errores / preparados','2.2');
G('cumplsellers','Cumplimiento de sellers',['cumplimiento de sellers'],CATS[3],'Qué tan bien despacha, cancela y responde un seller: despacho a tiempo, cancelación por seller y reclamos.','','3.6');
G('scorecard','Scorecard',['scorecard'],CATS[3],'Puntaje ponderado que resume el desempeño de un seller u operador. Los pesos deben ser explícitos.','Puntaje = suma de (métrica × peso)','4.4');
G('primerintento','Éxito al primer intento',['éxito al primer intento','primer intento'],CATS[3],'Entregas completadas al primer intento sobre pedidos despachados.','','7.4');
G('costopedido','Costo por pedido',['costo por pedido','cost-to-serve'],CATS[3],'Lo que cuesta atender un pedido después de venderlo: picking, embalaje, transporte, devoluciones, atención y merma.','Costos logísticos / pedidos','7.5');
G('contribucion','Contribución por pedido',['contribución por pedido'],CATS[3],'Lo que deja un pedido después de cubrir su costo logístico.','Margen bruto − costo por pedido','7.5');
G('devolucion','Tasa de devolución',['tasa de devolución'],CATS[3],'Pedidos devueltos sobre pedidos entregados.','','1.2');
G('semaforo','Semáforo',['semáforo'],CATS[3],'Código de colores (verde, amarillo, rojo) sobre umbrales acordados de un indicador.','','3.6');
G('sla','SLA (acuerdo de servicio)',['SLA'],CATS[3],'Acuerdo que fija lo que debe cumplir un operador o seller: tiempos, cobertura, indicadores y penalidades.','','7.6',1);

/* --- Catálogo y comercial --- */
G('sku','SKU',['SKU'],CATS[4],'Código interno de la empresa para una variante vendible (por ejemplo, la misma polera en talla M y color negro).','','4.1',1);
G('gtin','EAN / GTIN',['EAN','GTIN','GTIN-13','EAN-13'],CATS[4],'Código global del producto que aparece en el código de barras; lo administra GS1. El último dígito es de verificación.','','4.1',1);
G('variante','Variante',['variante','variantes'],CATS[4],'Versión de un producto padre por talla, color u otro atributo, cada una con su SKU.','','4.1');
G('atributos','Atributos del producto',['atributos'],CATS[4],'Marca, modelo, color, talla, peso, dimensiones, descripción e imágenes. Alimentan la búsqueda, los filtros y el picking correcto.','','4.1');
G('margen','Margen bruto',['margen bruto','margen'],CATS[4],'Lo que queda de una venta después del costo del producto.','Precio − costo','4.2');
G('promocion','Promoción',['promoción','promociones','precio promocional'],CATS[4],'Precio o beneficio temporal con vigencia, tope de unidades, canal y condiciones (medio de pago, mínimo de compra).','Descuento % = (regular − promo) / regular','4.2');
G('igv','IGV',['IGV'],CATS[5],'Impuesto general a las ventas. Las facturas permiten usarlo como crédito fiscal.','','5.1',1);
G('costoventas','Costo de ventas',['costo de ventas'],CATS[4],'Costo de los productos vendidos en el periodo. Se usa (en vez del precio) para calcular la rotación.','','8.5');

/* --- Normativa en Perú --- */
G('sunat','SUNAT',['SUNAT'],CATS[5],'Superintendencia Nacional de Aduanas y de Administración Tributaria: regula los comprobantes de pago electrónicos.','','5.1',1);
G('cpe','Comprobante de pago electrónico (CPE)',['CPE','comprobantes electrónicos','comprobante electrónico','comprobantes de pago electrónicos'],CATS[5],'Factura, boleta y notas emitidas y firmadas digitalmente según las reglas de SUNAT.','','5.1');
G('factura','Factura electrónica',['factura','facturas'],CATS[5],'Comprobante para empresas con RUC; permite crédito fiscal del IGV.','','5.1');
G('boleta','Boleta de venta electrónica',['boleta','boletas'],CATS[5],'Comprobante para consumidor final.','','5.1');
G('notacredito','Nota de crédito',['nota de crédito','notas de crédito'],CATS[5],'Documento que reduce o anula una operación ya facturada (devolución, descuento posterior o error). Va ligada al comprobante original.','','5.1');
G('notadebito','Nota de débito',['nota de débito','notas de débito'],CATS[5],'Documento que aumenta el valor de una operación ya facturada (por ejemplo, un cargo adicional).','','5.1');
G('ruc','RUC',['RUC'],CATS[5],'Registro Único de Contribuyentes: identifica a una empresa o persona ante SUNAT.','','5.1',1);
G('ose','OSE',['OSE'],CATS[5],'Operador de Servicios Electrónicos: una de las vías para emitir comprobantes electrónicos.','','5.1',1);
G('libro','Libro de Reclamaciones',['Libro de Reclamaciones'],CATS[5],'Registro donde el consumidor deja un reclamo o una queja. El proveedor debe responder en 15 días hábiles improrrogables; las plataformas de e-commerce también deben tenerlo.','','5.2');
G('reclamo','Reclamo y queja',['reclamo','reclamos','queja','quejas'],CATS[5],'Reclamo: disconformidad con el producto o servicio. Queja: malestar por la atención, sin pedido concreto de solución.','','5.2');
G('indecopi','Indecopi',['Indecopi'],CATS[5],'Institución que protege al consumidor y supervisa el cumplimiento del Libro de Reclamaciones.','','5.2');
G('datospers','Datos personales',['datos personales'],CATS[5],'Información que identifica a una persona (DNI, teléfono, dirección, correo). Se usan solo para la finalidad autorizada y con seguridad.','','5.3');
G('anpd','ANPD',['ANPD'],CATS[5],'Autoridad Nacional de Protección de Datos Personales.','','5.3',1);
G('minimizacion','Minimización de datos',['minimización','mínimo necesario'],CATS[5],'Compartir solo los datos necesarios para la tarea. En un reporte de KPI casi nunca hace falta el DNI ni el teléfono.','','5.3');

/* --- Datos y estadística --- */
G('media','Media (promedio)',['media'],CATS[6],'Suma dividida por la cantidad. Sensible a valores extremos.','','10.1');
G('mediana','Mediana',['mediana'],CATS[6],'Valor central: la mitad de los datos está por debajo y la mitad por encima. Resistente a extremos.','','10.1');
G('percentil','Percentil',['percentil','percentil 90','p90'],CATS[6],'Valor que cierto porcentaje de los datos no supera. El p90 sirve para promesas realistas de tiempo.','','10.1');
G('desv','Desviación estándar',['desviación estándar'],CATS[6],'Cuánto se alejan, en promedio, los datos de la media. La muestral divide entre n − 1.','','10.2');
G('cv','Coeficiente de variación',['coeficiente de variación','CV'],CATS[6],'Desviación estándar entre la media, en %. Permite comparar variabilidad entre cosas de distinta escala.','CV = desviación / media','10.2',1);
G('riq','Rango intercuartil (RIQ)',['rango intercuartil','RIQ'],CATS[6],'Q3 − Q1: dispersión del 50% central de los datos.','','10.2',1);
G('atipico','Valor atípico',['atípico','atípicos','valores atípicos'],CATS[6],'Dato muy alejado del resto. Regla práctica: fuera de Q1 − 1,5·RIQ o Q3 + 1,5·RIQ. Se investiga, no se borra por reflejo.','','10.2');
G('margenerror','Margen de error',['margen de error'],CATS[6],'Incertidumbre de un porcentaje calculado con una muestra. Solo cubre el error de muestreo, no los sesgos.','1,96 × √(p(1−p)/n)','10.3');
G('correlacion','Correlación',['correlación'],CATS[6],'Cuánto se mueven juntas dos variables (de −1 a 1). No prueba que una cause la otra.','','10.4');
G('simpson','Paradoja de Simpson',['paradoja de Simpson'],CATS[6],'El porcentaje global puede empeorar aunque cada segmento mejore, si cambia la mezcla de segmentos.','','10.4');
G('control','Gráfico de control',['gráfico de control','LCL','UCL'],CATS[6],'Grafica una medida en el tiempo con línea central y límites a tres desviaciones. Un punto fuera sugiere una causa especial.','LCL/UCL = media ∓ 3 × desviación','10.5',1);
G('pronostico','Pronóstico',['pronóstico','pronósticos'],CATS[6],'Estimación de la demanda futura a partir de la historia.','','8.1');
G('mediamovil','Promedio móvil',['promedio móvil'],CATS[6],'Pronóstico igual al promedio de los últimos k periodos.','','8.1');
G('ses','Suavizamiento exponencial',['suavizamiento exponencial'],CATS[6],'Pronóstico que da más peso a lo reciente.','Nivel nuevo = α × dato + (1 − α) × nivel anterior','8.1');
G('mae','MAE, MAPE y sesgo',['MAE','MAPE','sesgo'],CATS[6],'Errores de pronóstico. MAE: promedio del error absoluto. MAPE: error absoluto en %. Sesgo: promedio de (real − pronóstico).','','8.1',1);
G('sinteticos','Datos sintéticos',[],CATS[6],'Datos inventados para practicar. No corresponden a ninguna empresa real.','','1.1');

/* --- SQL y Power BI --- */
G('hechos','Tabla de hechos',['tabla de hechos','tablas de hechos'],CATS[7],'Tabla que registra eventos o mediciones (pedidos, entregas, movimientos de stock) y sirve para resumir.','','9.1');
G('dimension','Tabla de dimensiones',['tabla de dimensiones','dimensiones de tienda'],CATS[7],'Tabla que describe entidades (tienda, producto, fecha, seller) y sirve para filtrar y agrupar.','','9.1');
G('estrella','Esquema en estrella',['esquema en estrella','esquema estrella'],CATS[7],'Modelo con una tabla de hechos en el centro y dimensiones alrededor, recomendado por Microsoft para Power BI.','','9.1');
G('grano','Grano',['grano'],CATS[7],'Lo que representa una fila de una tabla de hechos (un pedido, una línea, un cambio de estado).','','9.1');
G('fanout','Abanico (fan-out)',['fan-out','abanico'],CATS[7],'Error al unir una tabla uno a muchos y sumar de más: el monto se repite por cada fila del lado «muchos».','','9.1');
G('join','JOIN',['JOIN','INNER JOIN','LEFT JOIN'],CATS[7],'Unir tablas por una columna. INNER descarta las filas sin pareja; LEFT las conserva.','','9.2',1);
G('cte','CTE',['CTE'],CATS[7],'Consulta con nombre (WITH) que divide una consulta larga en pasos legibles.','','9.2',1);
G('ventana','Función de ventana',['funciones de ventana','función de ventana','LAG','ROW_NUMBER'],CATS[7],'Cálculo sobre un conjunto de filas relacionado con la actual sin agrupar. LAG trae el valor de la fila anterior; ROW_NUMBER numera filas dentro de un grupo.','','9.2',1);
G('dax','DAX',['DAX'],CATS[7],'Lenguaje de fórmulas de Power BI para crear medidas.','','9.3',1);
G('medida','Medida (Power BI)',['medida en Power BI','medidas en Power BI','medida de Power BI','medidas de Power BI'],CATS[7],'Fórmula que se recalcula según los filtros del visual. Distinta de una columna calculada, que se calcula fila por fila al cargar.','','9.3');
G('contextofiltro','Contexto de filtro',['contexto de filtro'],CATS[7],'Los filtros activos (tienda, fecha…) que cambian el resultado de una medida sin cambiar su fórmula.','','9.3');
G('powerquery','Power Query',['Power Query'],CATS[7],'Herramienta de Excel y Power BI para importar y transformar datos con pasos repetibles.','','3.4');
G('dashboard','Dashboard (tablero)',['dashboard','tablero'],CATS[7],'Página de indicadores y gráficos pensada para una decisión concreta.','','9.4');
G('gateway','Puerta de enlace (gateway)',['puerta de enlace','gateway'],CATS[7],'Programa que conecta el servicio de Power BI con datos locales, como un SQL Server interno, para actualizarlos.','','12.1');
G('alertadatos','Alerta de datos',['alerta de datos','alertas de datos'],CATS[7],'Aviso de Power BI cuando un valor pasa un umbral. Se crea en el servicio sobre tarjetas, KPI o medidores de un dashboard.','','12.1');

/* --- Power Automate --- */
G('pa','Power Automate',['Power Automate'],CATS[8],'Servicio de Microsoft para automatizar tareas repetitivas conectando aplicaciones.','','11.1');
G('flujonube','Flujo de nube',['flujo de nube','flujos de nube','cloud flow'],CATS[8],'Automatización que corre en la nube. Puede ser automatizada (por un evento), instantánea (por un botón) o programada (por un horario).','','11.1');
G('disparador','Disparador',['disparador'],CATS[8],'Lo que inicia un flujo: un evento, un botón o un horario.','','11.2');
G('conector','Conector',['conector','conectores'],CATS[8],'Pieza que permite al flujo hablar con una aplicación. Pueden ser estándar o premium.','','11.3');
G('premium','Conector premium',['premium'],CATS[8],'Conector que exige una licencia adicional (por ejemplo, SQL Server). Basta una acción premium para que todo el flujo la requiera.','','11.3');
G('trycatch','Try / Catch (Scope)',['Try/Catch','Try / Catch','Scope','Scopes'],CATS[8],'Patrón para manejar errores: el trabajo va en un bloque «Try» y en «Catch», configurado para correr si falla el anterior, registras el error y avisas.','','11.5');
G('runafter','Configure run after',['Configure run after'],CATS[8],'Opción de una acción para ejecutarse aunque la anterior haya fallado, según cómo terminó.','','11.5');
G('historial','Historial de ejecuciones',['historial de ejecuciones'],CATS[8],'Registro de cada vez que corrió un flujo, con su resultado y el error si lo hubo. Se conserva 30 días.','','11.5');
G('contdin','Contenido dinámico',['contenido dinámico'],CATS[8],'Resultados de pasos anteriores que se reutilizan en los siguientes.','','11.2');
G('recurrencia','Recurrencia',['recurrencia'],CATS[8],'Disparador de horario: el flujo corre cada cierto tiempo, con zona horaria configurada.','','11.4');
G('aprobaciones','Aprobaciones',['Aprobaciones','aprobación'],CATS[8],'Conector que envía una solicitud a una persona y espera su respuesta antes de seguir.','','11.4');
G('rpa','Flujo de escritorio (RPA)',['RPA','flujo de escritorio','flujos de escritorio'],CATS[8],'Robot que repite clics y teclas en Windows o en la web cuando no hay API. Es frágil si la pantalla cambia.','','11.1',1);
G('lists','Microsoft Lists',['Microsoft Lists','SharePoint'],CATS[8],'Listas de datos con columnas tipadas; sirven como pequeña base de datos para tus flujos.','','11.3');
G('forms','Microsoft Forms',['Forms','Microsoft Forms'],CATS[8],'Herramienta de formularios. Sus respuestas llegan al flujo como texto.','','11.2');
G('choice','Columna de elección (Choice)',['columna de elección','columnas de elección','Choice'],CATS[8],'Columna de una lista con opciones fijas. Evita variantes del mismo valor («Alta», «alta»).','','11.6');

/* --- Gestión operativa (módulo 6) --- */
G('severidad','Severidad y prioridad',['severidad','prioridad de atención'],CATS[1],'Severidad: cuánto daño causa una incidencia (clientes, ventas, cumplimiento). Prioridad: el orden en que se atiende; combina severidad con urgencia, es decir, con el tiempo que queda.','','6.1');
G('slaresol','SLA de resolución',['SLA de resolución'],CATS[3],'Tiempo objetivo para resolver una incidencia según su severidad. Lo define cada empresa.','','6.1',1);
G('causaraiz','Causa raíz',['causa raíz'],CATS[1],'El origen real de un problema, no su síntoma. «No hay stock» es el síntoma; «recepción sin ingresar» puede ser la causa raíz.','','6.1');
G('analisisrec','Análisis de recurrencia',['análisis de recurrencia','recurrencia de incidencias'],CATS[1],'Revisar si una incidencia se repite en el mismo SKU, tienda, turno o proveedor, para actuar sobre el origen.','','6.1');
G('escalamiento','Escalamiento',['escalamiento','escalar','escalo','escalarlo'],CATS[1],'Pasar un problema al área que controla su causa, con datos suficientes para que pueda actuar: qué pasó, alcance, qué revisaste y qué necesitas.','','6.6');
G('gestexc','Gestión por excepciones',['gestión por excepciones'],CATS[1],'Concentrar la atención en lo que sale del umbral (pedidos vencidos, en riesgo, con incidencia) en lugar de revisarlo todo.','','6.5');
G('tiemporest','Tiempo restante',['tiempo restante'],CATS[1],'Lo que le queda a un pedido antes de incumplir su promesa.','SLA total − antigüedad en estado','6.5');
G('conciliacion','Conciliación de tres vías',['conciliación de tres vías','conciliación'],CATS[4],'Comprobar que orden de compra, recepción y factura coincidan en cantidad, precio y total antes de aprobar un pago. También se concilian pagos, pedidos y comprobantes.','','6.8');
G('oc','Orden de compra (OC)',['orden de compra','OC'],CATS[4],'Documento con el que se pide mercadería o servicios a un proveedor: qué, cuánto y a qué precio.','','6.8',1);
G('conformidad','Conformidad',['conformidad'],CATS[4],'Confirmación de que lo recibido corresponde a lo pedido. Sin ella no se aprueba el pago de la factura.','','6.8');
G('inspeccion','Inspección de devoluciones',['inspección'],CATS[1],'Revisión del producto devuelto para decidir su destino: reingreso a stock, merma, devolución al proveedor o rechazo.','','6.7');
G('mesacontrol','Mesa de control',['mesa de control'],CATS[1],'Puesto o rutina donde se monitorean pedidos, SLA e incidencias y se decide qué atender primero y a quién escalar.','','6.10');
