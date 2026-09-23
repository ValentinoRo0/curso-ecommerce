var DEM8=[120,132,128,140,135,150,145,160];
MODS.push({id:'8',grp:'log',title:'8. Planificación de inventario y demanda',short:'Pronóstico, ABC, stock de seguridad, EOQ, cobertura, caso de campaña',blurb:'Cuánto pedir, cuándo pedir y cuánto stock proteger: fórmulas, calculadoras y un caso de campaña de alta demanda.',ch:[
{id:'8.1',title:'Demanda y pronóstico simple',min:20,
goal:'Construir un pronóstico con promedio móvil y suavizamiento exponencial, y medir su error con MAE, MAPE y sesgo.',
body:`<p>Una serie de demanda combina un <b>nivel</b> (lo normal), una posible <b>tendencia</b>, <b>estacionalidad</b> (semanas o meses que se repiten) y <b>ruido</b>. En Perú hay picos comerciales recurrentes, como Cyber Wow, Día de la Madre o Navidad; las fechas cambian, así que confírmalas cada año ${V('calendario de campañas del año')}.</p>
<h3>Dos métodos simples</h3>
<ul><li><b>Promedio móvil de k periodos:</b> el pronóstico es el promedio de los últimos k datos. Simple y estable, pero reacciona lento a los cambios.</li><li><b>Suavizamiento exponencial simple:</b> <code>nivel nuevo = α × dato + (1 − α) × nivel anterior</code>. Da más peso a lo reciente. α cercano a 1 reacciona rápido y con ruido; cercano a 0, lento y suave.</li></ul>
<p>El libro de Hyndman y Athanasopoulos, referencia habitual, recomienda preferir modelos simples que capturen bien el patrón y evaluar la precisión con datos que el modelo no usó para ajustarse.</p>
<h3>Medir el error</h3>
<pre><code>MAE  = promedio de |real − pronóstico|
MAPE = promedio de |real − pronóstico| / real   (no sirve si real = 0)
Sesgo = promedio de (real − pronóstico)          (positivo: pronosticas de menos)</code></pre>
<p>Reglas de trabajo: separa las <b>promociones</b> de la demanda base, no pronostiques con ventas cuando hubo quiebre (subestimas la demanda real), y no uses un método simple para SKUs con demanda intermitente (muchos ceros).</p>`,
example:`<p>«Retail Andino» (ficticio) vende cada semana unas 130 a 160 unidades de una licuadora. Un promedio móvil de tres semanas dice 152 para la próxima. Si viene una promoción, el método no lo sabe: hay que sumarle el efecto esperado aparte.</p>`,
ex:{type:'fc',intro:'Prueba dos métodos con la demanda semanal de un SKU (datos sintéticos). Cambia el método y el parámetro y mira cómo cambian el pronóstico y el error.',sample:DEM8.join(', '),
also:{type:'calc',intro:'Con la serie 120, 132, 128, 140, 135, 150, 145, 160:',task:'Calcula el pronóstico de la semana 9 con promedio móvil de 3 semanas y con suavizamiento exponencial α = 0,5 (nivel inicial = primer dato), y el MAE del promedio móvil.',
parts:[{l:'Promedio móvil (3)',tol:0.05,fn:function(){return maFc(DEM8,3).next}},{l:'Suavizamiento (α = 0,5)',tol:0.05,fn:function(){return sesFc(DEM8,0.5).next}},{l:'MAE del promedio móvil (3)',tol:0.05,fn:function(){return fcErr(DEM8,maFc(DEM8,3).f).mae}}],
sol:function(v){return '<p>Promedio móvil = (150 + 145 + 160)/3 = <b>'+fmt(v[0],2)+'</b>. Suavizamiento: nivel inicial 120 y se actualiza cada semana hasta <b>'+fmt(v[1],2)+'</b>. MAE del promedio móvil (5 periodos evaluables) = <b>'+fmt(v[2],2)+'</b>. La serie sube de forma sostenida: ambos métodos van por detrás de la tendencia y tienden a subestimar; ese es el sesgo que verás en la calculadora.</p>'}}},
quiz:[
{q:'α alto en el suavizamiento exponencial…',o:['Reacciona más lento','Da más peso a lo reciente, con más ruido','Elimina el error','No cambia'],a:1,w:'Más sensible a los últimos datos.'},
{q:'Si hubo quiebre de stock en una semana, esas ventas…',o:['Son la demanda real','Subestiman la demanda real','No importan','Se duplican'],a:1,w:'No vendiste lo que el cliente quería comprar.'},
{q:'Un sesgo positivo (real − pronóstico) significa…',o:['Pronosticas de más','Pronosticas de menos','No hay error','El MAPE es cero'],a:1,w:'El real fue mayor que el pronóstico.'}],
src:[['https://otexts.com/fpp3/','Hyndman y Athanasopoulos: Forecasting: Principles and Practice (libro en línea)'],['https://www.cleverence.com/articles/for-business/how-to-calculate-reorder-point-with-safety-stock-5829/','Cleverence: sobre demanda restringida por quiebres (fuente comercial)']],
ver:['Enlace del libro: '+V('comprobar que sigue disponible'),'Nombres de funciones y herramientas de previsión de Excel: '+V('probar en tu Excel'),'Los datos son sintéticos.']},

{id:'8.2',title:'Clasificación ABC y XYZ',min:20,
goal:'Clasificar SKUs por valor y por variabilidad para decidir dónde poner atención y cuánto stock proteger.',
body:`<p><b>ABC</b> ordena los SKU por valor anual (demanda × costo, o ventas, o margen) y acumula: típicamente <b>A</b> hasta cerca del 80% del valor acumulado, <b>B</b> hasta cerca del 95% y <b>C</b> el resto. Es una regla de partida: algunas empresas usan 70/20/10 o 75/20/5. Suele ocurrir que pocos SKU (alrededor de 10 a 20%) aportan la mayor parte del valor.</p>
<p><b>XYZ</b> mide la <b>variabilidad de la demanda</b> con el coeficiente de variación (desviación estándar / media): un corte habitual es X si es menor a 0,5, Y si está entre 0,5 y 1,0 y Z si es mayor a 1,0. Lo ideal es medirlo sobre datos sin promociones y con estacionalidad controlada.</p>
<p>Juntas dan una matriz de nueve celdas. Ejemplos: <b>AX</b> (valioso y estable) admite reposición ajustada; <b>AZ</b> (valioso y errático) exige más colchón y seguimiento; <b>CZ</b> puede simplificarse con reglas mínimas.</p>
<h3>Qué cambia con la clase</h3>
<ul><li>Frecuencia de conteo cíclico y precisión de inventario (capítulo 2.5): más en A.</li><li>Slotting: A cerca del packing (capítulo 7.2).</li><li>Nivel de servicio y stock de seguridad (capítulo 8.3).</li><li>Frecuencia de revisión y automatización de alertas (capítulo 11.7).</li></ul>`,
example:`<p>En «Retail Andino» (ficticio), tres SKU de tecnología explican casi 80% del valor. Un quiebre en cualquiera de ellos se nota en el reporte de ventas. Los SKU C, en cambio, se reponen con reglas simples y revisión mensual.</p>`,
ex:{type:'calc',lab:{t:'Laboratorio: coeficiente de variación',fields:[{k:'m',l:'Media semanal',v:24},{k:'s',l:'Desviación estándar',v:5}],out:[{l:'CV',f:function(v){return v.m?v.s/v.m:0},d:2}]},
intro:'Diez SKU con su valor anual en soles (datos sintéticos): 420 000, 260 000, 110 000, 70 000, 45 000, 30 000, 25 000, 20 000, 12 000 y 8 000. Regla del ejercicio: A si el % acumulado es ≤ 80%, B si es ≤ 95%, C el resto.',
task:'Calcula cuántos SKU son clase A, qué % del valor aportan y cuántos son clase C.',
parts:[{l:'SKU clase A',tol:0,fn:function(){var v=[420000,260000,110000,70000,45000,30000,25000,20000,12000,8000],t=1000000,c=0,n=0;v.forEach(function(x){c+=x;if(c/t<=0.8)n++});return n}},{l:'% del valor de los A',u:'%',tol:0.1,fn:function(){var v=[420000,260000,110000,70000,45000,30000,25000,20000,12000,8000],t=1000000,c=0,l=0;v.forEach(function(x){c+=x;if(c/t<=0.8)l=100*c/t});return l}},{l:'SKU clase C',tol:0,fn:function(){var v=[420000,260000,110000,70000,45000,30000,25000,20000,12000,8000],t=1000000,c=0,n=0;v.forEach(function(x){c+=x;if(c/t>0.95)n++});return n}}],
sol:function(v){return '<p>Acumulados: 42%, 68%, 79%, 86%, 90,5%, 93,5%, 96%, 98%, 99,2%, 100%. A: los tres primeros = <b>'+v[0]+'</b>, que aportan <b>'+fmt(v[1])+'%</b> del valor. B: del 4.º al 6.º. C: <b>'+v[2]+'</b> SKU. Con otras convenciones (por ejemplo incluir el SKU que cruza el 80%) el resultado cambia, por eso se documenta la regla.</p>'}},
quiz:[
{q:'ABC clasifica por…',o:['Variabilidad de la demanda','Valor anual acumulado','Color','Proveedor'],a:1,w:'XYZ es la que mide variabilidad.'},
{q:'Un SKU AZ es…',o:['Poco valioso y estable','Valioso y de demanda errática','Sin valor','Descontinuado'],a:1,w:'Alta importancia y difícil de pronosticar.'},
{q:'Los cortes 80/95 y CV 0,5/1,0 son…',o:['Leyes','Puntos de partida ajustables','Obligatorios por SUNAT','Iguales para todos los rubros'],a:1,w:'Se adaptan a la cartera y al riesgo.'}],
src:[['https://www.cleverence.com/articles/for-business/inventory-classification-methods-4721/','Cleverence: métodos de clasificación de inventario (fuente comercial)'],['https://metricgate.com/docs/abc-inventory-classification','Metricgate: pasos del análisis ABC'],['https://imperiascm.com/supply-chain-tools/abc-xyz-inventory-calculator','Imperia SCM: matriz ABC-XYZ']],
ver:['Los porcentajes de corte y los umbrales de CV son convenciones de fuentes comerciales: '+V('definir criterios con tu empresa'),'Datos sintéticos.']},

{id:'8.3',title:'Stock de seguridad y punto de reorden',min:20,
goal:'Calcular cuánto colchón necesitas para un nivel de servicio y en qué nivel de stock conviene reponer.',
body:`<p>El <b>stock de seguridad</b> (SS) protege contra la variabilidad de la demanda y del tiempo de reposición. El <b>punto de reorden</b> (ROP) responde «¿cuándo pido?».</p>
<pre><code>Demanda en el lead time = d × L
SS (solo varía la demanda)      = z × σd × √L
ROP = d × L + SS
SS (varían demanda y lead time) = z × √( L × σd² + d² × σL² )</code></pre>
<p>Donde <b>d</b> es la demanda media por periodo, <b>σd</b> su desviación, <b>L</b> el lead time medio en los mismos periodos, <b>σL</b> la desviación del lead time y <b>z</b> el valor de la distribución normal para el nivel de servicio. Valores usuales: 90% → 1,28; 95% → 1,65; 97,5% → 1,96; 99% → 2,33. En Excel: <code>DISTR.NORM.ESTAND.INV(0,95)</code> (nombre en español a confirmar).</p>
<h3>Cuidado con los supuestos</h3>
<ul><li><b>Misma unidad de tiempo:</b> si el lead time está en días, σd debe ser de demanda diaria. Mezclar meses con días infla el resultado.</li><li><b>Lead times reales, no prometidos:</b> calcula σL con fechas de recepción, no con lo que dice el proveedor.</li><li><b>Distribución normal:</b> no sirve para SKU con muchos ceros; ahí se usan otros métodos.</li><li>Subir el nivel de servicio encarece el stock cada vez más: pasar de 95% a 99% no cuesta lo mismo que de 90% a 95%.</li></ul>`,
example:`<p>Un SKU de «Retail Andino» (ficticio) vende 40 unidades diarias con desviación de 12, y el proveedor tarda 7 días. Con 95% de servicio, el colchón cubre las semanas en que la demanda se dispara. Si además el proveedor a veces tarda 9 días, el colchón debe ser mucho mayor.</p>`,
ex:{type:'calc',lab:{t:'Laboratorio: stock de seguridad',fields:[{k:'d',l:'Demanda diaria',v:40},{k:'s',l:'Desv. diaria',v:12},{k:'L',l:'Lead time (días)',v:7},{k:'z',l:'z',v:1.65}],out:[{l:'SS (demanda variable)',f:function(v){return v.z*v.s*Math.sqrt(v.L)},d:1},{l:'ROP',f:function(v){return v.d*v.L+v.z*v.s*Math.sqrt(v.L)},d:1}]},
intro:'SKU con demanda media de 40 unidades por día, desviación de 12, lead time de 7 días y nivel de servicio de 95% (z = 1,65). El lead time varía con una desviación de 2 días.',
task:'Calcula el stock de seguridad si solo varía la demanda, el ROP correspondiente, y el stock de seguridad si también varía el lead time.',
parts:[{l:'SS (solo demanda)',u:'uds',tol:0.1,fn:function(){return 1.65*12*Math.sqrt(7)}},{l:'ROP (solo demanda)',u:'uds',tol:0.1,fn:function(){return 40*7+1.65*12*Math.sqrt(7)}},{l:'SS (demanda y lead time)',u:'uds',tol:0.2,fn:function(){return 1.65*Math.sqrt(7*144+1600*4)}}],
sol:function(v){return '<p>SS = 1,65 × 12 × √7 = <b>'+fmt(v[0])+'</b> unidades. ROP = 280 + SS = <b>'+fmt(v[1])+'</b>. Con lead time variable: √(7 × 144 + 1600 × 4) = √7408 ≈ 86,07 y SS = <b>'+fmt(v[2])+'</b>. La variabilidad del proveedor casi triplica el colchón: por eso conviene mejorar el lead time antes de comprar más stock.</p>'}},
quiz:[
{q:'El ROP =',o:['d × L','d × L + SS','SS × z','σd × L'],a:1,w:'Demanda esperada en el lead time más el colchón.'},
{q:'σd de demanda mensual con un lead time en días…',o:['Está bien mezclar','Infla el stock de seguridad: usa la misma unidad','No importa','Reduce el stock'],a:1,w:'Unidades de tiempo consistentes.'},
{q:'Subir de 95% a 99% de nivel de servicio…',o:['Cuesta lo mismo','Aumenta el stock necesario más que proporcionalmente','Reduce el stock','No cambia z'],a:1,w:'z sube de 1,65 a 2,33.'}],
src:[['https://www.cleverence.com/articles/for-business/calculating-reorder-point-with-safety-stock-6283/','Cleverence: ROP, stock de seguridad y casos especiales (fuente comercial)'],['https://ecosire.com/pt/blog/eoq-safety-stock-reorder-point-guide','Ecosire: EOQ, SS y ROP: tabla de z (fuente comercial)']],
ver:['Fórmulas estándar de teoría de inventarios; las fuentes son guías comerciales, no textos académicos '+V('contrastar con un texto de gestión de operaciones'),'Nombre en español de la función de Excel para z.']},

{id:'8.4',title:'Lote económico y frecuencia de reposición',min:20,
goal:'Calcular el lote económico (EOQ) y entender su lógica y sus límites en e-commerce.',
body:`<p>El <b>lote económico de pedido (EOQ)</b> minimiza la suma del costo de pedir y del costo de mantener inventario:</p>
<pre><code>EOQ = √( 2 × D × S / H )
Costo total anual = (D / Q) × S + (Q / 2) × H</code></pre>
<p>Con <b>D</b> demanda anual, <b>S</b> costo de emitir y recibir un pedido y <b>H</b> costo de mantener una unidad un año (capital inmovilizado, espacio, seguros, obsolescencia). Responde «¿cuánto pido?», mientras que el ROP responde «¿cuándo pido?».</p>
<p>Supuestos del modelo: demanda estable, costos conocidos y constantes, sin descuentos por volumen. Los desvíos son frecuentes en e-commerce: <b>cantidades mínimas del proveedor</b>, camiones o contenedores completos, capacidad de almacén y demanda estacional. El EOQ sirve como <b>referencia</b>, no como orden. Una propiedad útil: cerca del óptimo, el costo total es poco sensible a pequeñas variaciones del lote.</p>`,
example:`<p>«Retail Andino» (ficticio) compra una licuadora a un proveedor que exige múltiplos de 100 unidades. El EOQ da 671; se pide 700, el múltiplo más cercano. La diferencia de costo es mínima.</p>`,
ex:{type:'calc',lab:{t:'Laboratorio: EOQ',fields:[{k:'D',l:'Demanda anual',v:12000},{k:'S',l:'Costo por pedido (S/)',v:150},{k:'H',l:'Costo de mantener (S/ por unidad y año)',v:8}],out:[{l:'EOQ (unidades)',f:function(v){return Math.sqrt(2*v.D*v.S/v.H)},d:1},{l:'Pedidos por año',f:function(v){return v.D/Math.sqrt(2*v.D*v.S/v.H)},d:1}]},
intro:'Demanda anual 12 000 unidades, costo de cada pedido S/ 150, costo de mantener S/ 8 por unidad por año (datos sintéticos).',
task:'Calcula el EOQ, el número de pedidos por año, el costo total anual en el EOQ y el costo total si se pide de a 1000 unidades.',
parts:[{l:'EOQ',u:'uds',tol:0.1,fn:function(){return Math.sqrt(2*12000*150/8)}},{l:'Pedidos por año',tol:0.1,fn:function(){return 12000/Math.sqrt(2*12000*150/8)}},{l:'Costo total en el EOQ',u:'S/',tol:1,fn:function(){var q=Math.sqrt(2*12000*150/8);return 12000/q*150+q/2*8}},{l:'Costo total con lotes de 1000',u:'S/',tol:0.5,fn:function(){return 12000/1000*150+1000/2*8}}],
sol:function(v){return '<p>EOQ = √(2 × 12000 × 150 / 8) = √450000 = <b>'+fmt(v[0])+'</b> unidades, unos <b>'+fmt(v[1])+'</b> pedidos al año. Costo en el EOQ = <b>S/ '+fmt(v[2],0)+'</b> (mitad pedir, mitad mantener). Con lotes de 1000 = 12 × 150 + 500 × 8 = <b>S/ '+fmt(v[3],0)+'</b>, cerca de 8% más. Poca diferencia, por eso los múltiplos comerciales rara vez rompen el modelo.</p>'}},
quiz:[
{q:'El EOQ responde…',o:['¿Cuándo pido?','¿Cuánto pido por pedido?','¿A quién compro?','¿Cuánto cuesta el flete?'],a:1,w:'El ROP responde cuándo.'},
{q:'En el EOQ óptimo, el costo de pedir y el de mantener…',o:['Son iguales','Son muy distintos','El de pedir es cero','El de mantener es cero'],a:0,w:'Se igualan en el mínimo del costo total.'},
{q:'Cantidades mínimas del proveedor…',o:['Anulan el modelo','Obligan a ajustar el EOQ al múltiplo permitido','Reducen los costos','No existen'],a:1,w:'El EOQ es una referencia.'}],
src:[['https://ecosire.com/pt/blog/eoq-safety-stock-reorder-point-guide','Ecosire: fórmula del EOQ y costo total (fuente comercial)']],
ver:['El modelo EOQ es estándar; la fuente es una guía comercial '+V('contrastar con un texto de gestión de operaciones'),'Datos sintéticos.']},

{id:'8.5',title:'Rotación, cobertura y salud del inventario',min:20,
goal:'Calcular rotación, días de inventario y cobertura, y detectar inventario inmovilizado.',
body:`<pre><code>Rotación de inventario = costo de ventas del periodo / inventario promedio
Días de inventario     = días del periodo / rotación
Cobertura (días)       = stock actual / demanda diaria promedio
Sell-through           = unidades vendidas / unidades disponibles (definición según la empresa)</code></pre>
<p>La <b>rotación</b> dice cuántas veces «se renueva» el inventario; los <b>días de inventario</b>, cuánto tarda en venderse. La <b>cobertura</b> es más operativa: si cubre menos días que el lead time, hay riesgo de quiebre. Cuidado con la base: rotación y días usan <b>costo</b>, no precio de venta.</p>
<h3>Señales de mala salud</h3>
<ul><li><b>Cobertura menor al lead time</b> en SKU A: quiebre casi seguro.</li><li><b>Stock sin movimiento</b> por un periodo definido (inventario muerto o de lenta rotación).</li><li><b>Sobrestock</b> de SKU C: capital atado sin retorno.</li><li><b>IRA bajo</b> (capítulo 7.2): el número del sistema no es confiable.</li></ul>
<p>Estas alertas se pueden automatizar (idea de cobertura baja del capítulo 11.7).</p>`,
example:`<p>Un SKU de «Retail Andino» (ficticio) tiene 900 unidades y vende 45 por día: cubre 20 días. Su proveedor tarda 14 días en reponer. El margen es de 6 días: cualquier retraso lo deja sin stock.</p>`,
ex:{type:'calc',intro:'Datos sintéticos. Costo de ventas del año: S/ 2 400 000. Inventario promedio: S/ 600 000. Un SKU tiene 900 unidades en stock, vende 45 por día y su lead time de reposición es de 14 días.',
task:'Calcula la rotación, los días de inventario (año de 365 días), la cobertura del SKU y su margen de seguridad frente al lead time (en días).',
parts:[{l:'Rotación',u:'veces',tol:0.01,fn:function(){return 2400000/600000}},{l:'Días de inventario',u:'días',tol:0.1,fn:function(){return 365/(2400000/600000)}},{l:'Cobertura del SKU',u:'días',tol:0.01,fn:function(){return 900/45}},{l:'Margen frente al lead time',u:'días',tol:0.01,fn:function(){return 900/45-14}}],
sol:function(v){return '<p>Rotación = 2 400 000 / 600 000 = <b>'+fmt(v[0])+'</b> veces al año. Días = 365/4 = <b>'+fmt(v[1])+'</b>. Cobertura = 900/45 = <b>'+fmt(v[2])+'</b> días. Frente a un lead time de 14 días, el margen es de <b>'+fmt(v[3])+'</b> días. Una rotación de 4 no es «buena» ni «mala» por sí sola: compárala con tu categoría y tu historial.</p>'}},
quiz:[
{q:'Rotación de inventario se calcula con…',o:['Ventas a precio de venta','Costo de ventas / inventario promedio','Solo unidades','El stock final'],a:1,w:'Se usa costo, no precio.'},
{q:'Cobertura menor que el lead time significa…',o:['Que sobra stock','Riesgo de quiebre antes de que llegue la reposición','Que se debe bajar el precio','Nada'],a:1,w:'El stock se acaba antes de reponer.'},
{q:'El stock sin movimiento por mucho tiempo…',o:['Es ideal','Es capital inmovilizado que hay que revisar','Aumenta la rotación','No cuenta'],a:1,w:'Candidato a liquidación o devolución al proveedor.'}],
src:[['https://www.cleverence.com/articles/for-business/what-is-abc-analysis-of-inventory-5827/','Cleverence: ABC, FSN y su uso para detectar inmovilizado (fuente comercial)']],
ver:['Definiciones de rotación, sell-through y de inventario inmovilizado: práctica general, con variantes por empresa '+V('definición interna'),'Datos sintéticos.']},

{id:'8.6',title:'Caso: preparar una campaña de alta demanda',min:20,
goal:'Encadenar demanda, personal, transporte e inventario para detectar el cuello de botella antes de que una campaña empiece.',
body:`<p><b>Situación.</b> «Retail Andino» (ficticio) prepara una campaña de tres días. Debes revisar si la operación resiste. Datos sintéticos:</p>
${T(['Dato','Valor'],[['Pedidos diarios normales','300'],['Multiplicador de campaña (por día)','2,5'],['Factor de pico del primer día','1,2'],['Capacidad contratada de última milla','900 entregas por día'],['Líneas por pedido','2,2'],['Productividad de picking','60 líneas por hora'],['Horas efectivas por turno','7'],['Ausentismo','6%'],['SKU estrella: demanda normal','60 unidades por día'],['SKU estrella: multiplicador en campaña','3'],['SKU estrella: stock actual','700 unidades'],['Lead time de reposición del SKU','7 días (no se puede acelerar)']],[1])}
<h3>Ruta de análisis</h3>
<ol><li><b>Demanda del día pico</b> = pedidos normales × multiplicador × factor de pico. Compárala con la capacidad de última milla.</li><li><b>Personal de picking</b> para el día pico (capítulo 7.3), con ausentismo.</li><li><b>SKU estrella</b>: demanda de los tres días de campaña frente al stock, y cuántos días de demanda normal cubre el saldo (capítulo 8.5).</li><li><b>Riesgo de quiebre</b> frente al lead time de reposición.</li></ol>`,
example:`<p>El mensaje para el jefe de operaciones debe ser corto: «el primer día llegamos al 100% de la capacidad de transporte, necesitamos seis pickers y el SKU estrella se queda sin stock unos cuatro días después de la campaña si no pedimos ya». Un resumen así vale más que diez tablas.</p>`,
ex:{type:'calc',intro:'',task:'Calcula el pedido pico, la utilización de la última milla, los pickers necesarios (con ausentismo, redondeados), la demanda de campaña del SKU estrella, la cobertura restante después de la campaña y los días de posible quiebre.',
parts:[{l:'Pedidos del día pico',tol:0,fn:function(){return 300*2.5*1.2}},{l:'Utilización de última milla',u:'%',tol:0.1,fn:function(){return 100*(300*2.5*1.2)/900}},{l:'Pickers necesarios',tol:0,fn:function(){return Math.ceil(300*2.5*1.2*2.2/(60*7)/0.94)}},{l:'Demanda del SKU en la campaña (3 días)',u:'uds',tol:0,fn:function(){return 60*3*3}},{l:'Cobertura tras la campaña',u:'días',tol:0.05,fn:function(){return (700-60*3*3)/60}},{l:'Días de posible quiebre',u:'días',tol:0.05,fn:function(){return 7-(700-60*3*3)/60}}],
sol:function(v){return '<p><b>1)</b> Pico = 300 × 2,5 × 1,2 = <b>'+v[0]+'</b> pedidos, o sea <b>'+fmt(v[1])+'%</b> de la capacidad de 900: sin margen. <b>2)</b> Líneas = 900 × 2,2 = 1980; productividad = 60 × 7 = 420; 1980/420 = 4,71; con 6% de ausentismo = 5,01 → <b>'+v[2]+'</b> pickers. <b>3)</b> SKU estrella: 60 × 3 × 3 = <b>'+v[3]+'</b> unidades, quedan 160, que cubren <b>'+fmt(v[4],2)+'</b> días de demanda normal. <b>4)</b> Con lead time de 7 días, hay unos <b>'+fmt(v[5],2)+'</b> días de posible quiebre.</p><h3>Decisiones</h3><ul><li><b>Transporte:</b> negociar capacidad adicional o limitar franjas del primer día.</li><li><b>Picking:</b> contratar y capacitar personal con anticipación.</li><li><b>Stock:</b> pedir ya la reposición del SKU estrella y proteger su stock en la tienda que más lo vende.</li><li><b>Control:</b> alertas de cobertura y de pedidos atorados durante la campaña (capítulo 11.7).</li></ul>'}},
quiz:[
{q:'Si el primer día usa 100% de la capacidad de transporte, el riesgo es…',o:['Ninguno','Que cualquier imprevisto genere retrasos','Que sobre capacidad','Que baje el costo'],a:1,w:'No hay margen para absorber variaciones.'},
{q:'¿Cuándo debe decidirse la reposición de un SKU estrella con lead time de 7 días?',o:['El último día de la campaña','Antes de la campaña','Al terminar el stock','Nunca'],a:1,w:'Después ya no hay tiempo de compensar.'},
{q:'¿Qué resume mejor un análisis para el jefe de operaciones?',o:['Diez tablas sin conclusión','Los cuellos de botella con cifras y una decisión propuesta','Solo gráficos','Solo la fórmula'],a:1,w:'Cifra, riesgo y acción.'}],
src:[['https://www.cleverence.com/articles/for-business/calculating-reorder-point-with-safety-stock-6283/','Cleverence: ROP y lead time (fuente comercial)']],
ver:['El caso es didáctico y todas las cifras son inventadas.','La lógica reúne fórmulas de los capítulos 7.3, 7.3 y 7.5.']}
]});
