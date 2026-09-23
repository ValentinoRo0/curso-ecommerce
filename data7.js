var LT15=[22,24,25,26,26,27,28,28,29,30,31,33,36,48,96];
var LT10=[30,32,33,35,36,38,40,41,44,150];
function me95(p,n){return 100*1.96*Math.sqrt(p*(1-p)/n)}
function surcoRows(d,post){return d.filter(function(r){return r.tienda==='Surco'&&(post?r.fecha>='2026-09-08':r.fecha<'2026-09-08')})}
function entr(d){return d.filter(function(r){return r.estado==='Entregado'})}
MODS.push({id:'10',grp:'tools',title:'10. Estadística descriptiva aplicada',short:'Percentiles, dispersión, muestras, control',blurb:'Lo justo de estadística para no equivocarte al leer promedios, porcentajes y variaciones.',ch:[
{id:'10.1',title:'Media, mediana y percentiles: por qué el promedio engaña',min:20,
goal:'Elegir entre media, mediana y percentil según la distribución, y usar el percentil 90 para hablar de tiempos de entrega.',
body:`<p>El <b>promedio</b> resume bien datos simétricos. Los tiempos de entrega suelen tener una cola larga: casi todos entregan en un rango normal y unos pocos se demoran muchísimo. Esos pocos arrastran el promedio.</p>
<ul><li><b>Media:</b> suma / cantidad. Sensible a valores extremos.</li><li><b>Mediana:</b> el valor central; la mitad está por debajo y la mitad por encima. Resistente a extremos.</li><li><b>Percentil 90 (p90):</b> el valor que 9 de cada 10 observaciones no superan. Sirve para promesas realistas: «el 90% se entrega en 43 horas o menos».</li></ul>
<p>En Excel (versión en español; comprueba los nombres en tu equipo): <code>PROMEDIO</code>, <code>MEDIANA</code>, <code>PERCENTIL.INC</code>, <code>CUARTIL.INC</code>. En SQL Server: <code>PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY x) OVER (PARTITION BY ...)</code>. En Power BI: <code>MEDIAN</code> y <code>PERCENTILE.INC</code> ${V('sintaxis y nombres en tu versión')}.</p>
<p>Cuándo reportar qué: <b>media</b> si la distribución es razonablemente simétrica; <b>mediana + p90</b> para tiempos con cola larga; y <b>siempre</b> el tamaño de muestra. Un promedio de lead time sin p90 esconde a los clientes que más esperaron, que además son los que más reclaman.</p>`,
example:`<p>«Retail Andino» (ficticio) prometía «entrega en 24 horas» porque el promedio era bajo. Al mirar el p90 vieron que 1 de cada 10 pedidos tardaba mucho más. Cambiaron la promesa de acuerdo con el p90 y bajaron los reclamos por retraso. Los números del ejercicio son inventados.</p>`,
ex:{type:'stats',intro:'Calculadora: edita la lista o carga datos del CSV. Muestra media, mediana, p90, dispersión y atípicos. Lista inicial: 15 tiempos de entrega en horas.',sample:LT15.join(', '),
loaders:[{t:'Cargar lead time (días) de entregados del CSV',f:function(){return entr(DATA).map(function(r){return Math.round((new Date(r.entrega)-new Date(r.fecha))/864e5)}).join(', ')}},{t:'Cargar montos (S/) de entregados del CSV',f:function(){return entr(DATA).map(function(r){return r.monto}).join(', ')}},{t:'Volver a la lista inicial',f:function(){return LT15.join(', ')}}],
also:{type:'calc',intro:'Con la lista inicial (22, 24, 25, 26, 26, 27, 28, 28, 29, 30, 31, 33, 36, 48, 96 horas):',task:'Calcula la media, la mediana y el percentil 90 (método inclusivo, como PERCENTIL.INC).',
parts:[{l:'Media',u:'h',tol:0.1,fn:function(){return mean(LT15)}},{l:'Mediana',u:'h',tol:0.1,fn:function(){return median(LT15)}},{l:'Percentil 90',u:'h',tol:0.1,fn:function(){return pctl(LT15,0.9)}}],
sol:function(v){return '<p>Media = <b>'+fmt(v[0])+' h</b>, mediana = <b>'+fmt(v[1])+' h</b>, p90 = <b>'+fmt(v[2])+' h</b>. El pedido de 96 horas empuja la media 6 horas por encima de la mediana. Percentil inclusivo: posición = 0,9 × (15 − 1) = 12,6; se interpola entre el 13.º valor (36) y el 14.º (48): 36 + 0,6 × 12 = 43,2.</p>'}}},
quiz:[
{q:'Los tiempos de entrega tienen una cola larga. ¿Qué reportas?',o:['Solo la media','Mediana y percentil 90, y el tamaño de muestra','Solo el máximo','Solo el mínimo'],a:1,w:'La media se distorsiona con extremos.'},
{q:'«P90 = 43 h» significa…',o:['El 90% tarda exactamente 43 h','El 90% de los pedidos tarda 43 h o menos','El 10% tarda 43 h o menos','Que la media es 43 h'],a:1,w:'Es un umbral de cobertura.'},
{q:'La mediana es…',o:['El valor más frecuente','El valor central que deja la mitad de los datos a cada lado','La suma dividida por n','El máximo'],a:1,w:'Resistente a extremos.'}],
src:[['https://itl.nist.gov/div898/handbook/pmc/section3/pmc32.htm','NIST/SEMATECH e-Handbook: media, desviación y control de procesos (referencia general)']],
ver:['Nombres de funciones de Excel en español, y de SQL Server y DAX, según tu versión: '+V('probar en tu equipo'),'Los cuadros de este capítulo son datos sintéticos.']},

{id:'10.2',title:'Dispersión: desviación estándar, RIQ y valores atípicos',min:18,
goal:'Medir cuánta variabilidad hay en un proceso y detectar valores atípicos con una regla simple.',
body:`<p>Dos tiendas pueden tener el mismo On Time promedio y ser muy distintas: una estable y otra que oscila entre 99% y 80%. La <b>dispersión</b> dice cuánto varía el proceso.</p>
<ul><li><b>Desviación estándar (muestral):</b> qué tanto se alejan, en promedio, los datos de la media. En Excel: <code>DESVEST.M</code> (muestral) y <code>DESVEST.P</code> (poblacional) ${V('nombres en tu Excel')}.</li><li><b>Coeficiente de variación:</b> desviación / media, en %. Sirve para comparar variabilidad entre cosas de distinta escala.</li><li><b>Rango intercuartil (RIQ):</b> Q3 − Q1. Mide la dispersión del 50% central y no se altera con extremos.</li><li><b>Atípicos (regla práctica de 1,5 × RIQ):</b> valores por debajo de Q1 − 1,5·RIQ o por encima de Q3 + 1,5·RIQ. Es una convención habitual, no una ley: un atípico se investiga, no se borra automáticamente.</li></ul>
<p>Pregunta útil ante un atípico: <b>¿es un error de datos, un caso real extremo o una señal de un problema nuevo?</b> Un pedido de 150 horas puede ser un dato mal cargado, un cliente ausente tres veces o un producto agotado que se repuso tarde.</p>`,
example:`<p>Si Surco y Chorrillos entregan ambos «en 30 horas de media», pero Surco tiene un RIQ el triple de grande, la promesa de Surco es menos confiable. Un p90 cercano a la mediana indica estabilidad; uno muy lejano indica una cola problemática.</p>`,
ex:{type:'stats',intro:'Diez tiempos de entrega en horas con un valor sospechoso. Pruébalo y cambia el último valor para ver cómo reaccionan la media y la desviación.',sample:LT10.join(', '),
also:{type:'calc',intro:'Lista: 30, 32, 33, 35, 36, 38, 40, 41, 44, 150.',task:'Calcula la desviación estándar muestral, el RIQ y cuántos atípicos hay con la regla de 1,5 × RIQ.',
parts:[{l:'Desviación estándar',u:'h',tol:0.1,fn:function(){return sdS(LT10)}},{l:'RIQ (Q3 − Q1)',u:'h',tol:0.05,fn:function(){return pctl(LT10,.75)-pctl(LT10,.25)}},{l:'Atípicos',tol:0,fn:function(){var q1=pctl(LT10,.25),q3=pctl(LT10,.75),i=q3-q1;return LT10.filter(function(x){return x<q1-1.5*i||x>q3+1.5*i}).length}}],
sol:function(v){return '<p>Desviación estándar = <b>'+fmt(v[0])+' h</b> (inflada por el 150). RIQ = 40,75 − 33,5 = <b>'+fmt(v[1],2)+' h</b>. Límite superior = 40,75 + 1,5 × 7,25 = 51,6: el 150 es el único atípico (<b>'+v[2]+'</b>). Sin el 150, la desviación cae mucho: un solo dato puede dominar la dispersión.</p>'}}},
quiz:[
{q:'El RIQ mide…',o:['La dispersión del 50% central de los datos','El promedio','El máximo menos el mínimo','La moda'],a:0,w:'Q3 − Q1.'},
{q:'Encuentras un pedido de 150 horas en tu reporte. Lo correcto es…',o:['Borrarlo sin más','Investigar si es error de datos o un caso real','Ignorarlo','Duplicarlo'],a:1,w:'Un atípico se investiga, no se elimina por reflejo.'},
{q:'Coeficiente de variación = …',o:['Media / desviación','Desviación / media','Máximo / mínimo','Mediana / media'],a:1,w:'Permite comparar variabilidad relativa.'}],
src:[['https://itl.nist.gov/div898/handbook/pmc/section3/pmc32.htm','NIST/SEMATECH e-Handbook: desviación estándar y límites de control']],
ver:['La regla de 1,5 × RIQ es una convención habitual; no la cito como norma '+V('confirmar criterio en tu equipo de datos')]},

{id:'10.3',title:'Muestras y margen de error: cuándo un número es solo ruido',min:20,
goal:'Calcular el margen de error de un porcentaje y saber cuándo una diferencia entre semanas o tiendas es probablemente real.',
body:`<p>Un On Time de 82% con 45 pedidos no es «exactamente 82%»: es una estimación con incertidumbre. Para una proporción, el margen de error al 95% de confianza es aproximadamente:</p>
<pre><code>Margen = 1,96 × √( p × (1 − p) / n )</code></pre>
<p>donde <code>p</code> es la proporción observada y <code>n</code> el número de pedidos. Dos ideas prácticas: el margen es mayor cuando <code>n</code> es pequeño y cuando <code>p</code> está cerca de 50%; y para reducir el margen a la mitad necesitas <b>cuatro veces</b> más datos.</p>
<p>Este margen solo cubre el <b>error de muestreo</b>. No corrige sesgos: una encuesta de NPS que contestan solo los clientes muy contentos o muy molestos no representa a todos, aunque tenga muchas respuestas. La aproximación además requiere <code>n</code> suficientemente grande (muchas guías piden al menos 5 o 10 casos de cada tipo) ${V('condiciones de la aproximación para muestras pequeñas')}.</p>
<p><b>Cómo lo usas:</b> si el On Time de una tienda pasa de 91% a 88% con 40 pedidos por semana, probablemente es ruido. Si pasa de 98% a 67% con 46 pedidos entregados en cada periodo, es casi seguro una señal.</p>`,
example:`<p>El gerente pregunta: «Surco bajó, ¿o es casualidad?». Con la calculadora de abajo compruebas si los intervalos de antes y después se superponen. Si no se superponen, hay evidencia fuerte de cambio; si se superponen, pide más datos o mira más días.</p>`,
ex:{type:'calc',data:true,lab:{t:'Laboratorio: margen de error',fields:[{k:'p',l:'On Time observado (%)',v:82},{k:'n',l:'Pedidos entregados',v:45}],out:[{l:'Margen (± puntos)',f:function(v){return me95(v.p/100,v.n)}},{l:'Límite inferior (%)',f:function(v){return v.p-me95(v.p/100,v.n)}},{l:'Límite superior (%)',f:function(v){return v.p+me95(v.p/100,v.n)}}]},
task:'Con el CSV: en Surco, calcula el On Time y el margen de error antes (1 al 7 sep) y después (8 al 14 sep). Responde con el margen de «después», el límite superior de «después» y el límite inferior de «antes».',
parts:[{l:'Margen «después»',u:'pp',tol:0.1,fn:function(d){var e=entr(surcoRows(d,true));return me95(K.ontime(e)/100,e.length)}},{l:'Límite superior «después»',u:'%',tol:0.1,fn:function(d){var e=entr(surcoRows(d,true)),p=K.ontime(e);return p+me95(p/100,e.length)}},{l:'Límite inferior «antes»',u:'%',tol:0.1,fn:function(d){var e=entr(surcoRows(d,false)),p=K.ontime(e);return p-me95(p/100,e.length)}}],
sol:function(v){return '<p>Margen «después» ≈ <b>±'+fmt(v[0])+' pp</b>. El límite superior de «después» es <b>'+fmt(v[1])+'%</b> y el inferior de «antes» es <b>'+fmt(v[2])+'%</b>. '+(v[2]>v[1]?'Como el mínimo plausible de «antes» supera al máximo plausible de «después», los intervalos no se superponen: hay evidencia fuerte de que el deterioro no es casualidad.':'Los intervalos se superponen: no hay evidencia suficiente.')+' Recuerda: los pedidos de un mismo día no son independientes del todo, así que esta cuenta es una guía, no una prueba formal.</p>'}},
quiz:[
{q:'Para reducir el margen de error a la mitad, necesitas…',o:['El doble de datos','Cuatro veces más datos','La misma cantidad','Diez veces menos datos'],a:1,w:'El margen depende de la raíz de n.'},
{q:'Una encuesta con muchas respuestas sesgadas…',o:['Es representativa igualmente','Puede seguir siendo engañosa: el margen no corrige el sesgo','Tiene margen cero','Es siempre válida'],a:1,w:'El margen mide solo error de muestreo.'},
{q:'On Time pasa de 91% a 88% con 40 pedidos por semana. ¿Conclusión prudente?',o:['Es una caída grave','Probablemente es ruido; mira más semanas','Hay que despedir a alguien','Es imposible'],a:1,w:'El margen con n=40 es de varios puntos.'}],
src:[['https://sol.utstat.utoronto.ca/modules/module-6/7-2-Confidence-Intervals-for-Proportions.pdf','Universidad de Toronto: intervalos de confianza para proporciones'],['https://www.calculate.co.nz/margin-of-error-calculator.php','Calculadora de margen de error: sobre sesgo y tamaño de muestra']],
ver:['Fórmula normal aproximada para proporciones; para n pequeño existen métodos exactos '+V('elegir método con un estadístico si el análisis es crítico')]},

{id:'10.4',title:'Correlación, causalidad y la paradoja de Simpson',min:20,
goal:'Distinguir «están relacionados» de «uno causa al otro» y detectar cuando un promedio global miente.',
body:`<p>La <b>correlación</b> (coeficiente r, de −1 a 1) mide cuánto se mueven dos variables juntas. En Excel: <code>COEF.DE.CORREL</code> ${V('nombre en tu Excel')}. Una correlación alta no prueba causa: dos variables pueden moverse juntas por una tercera (por ejemplo, ambas suben en campañas) o por casualidad.</p>
<p>Para sostener una causa necesitas: un <b>mecanismo</b> plausible, <b>orden temporal</b> (la causa antes del efecto), <b>descartar terceras variables</b> (segmentar por tienda, categoría, modalidad) y, si puedes, un <b>experimento</b> o comparación antes/después con un grupo de control.</p>
<h3>La paradoja de Simpson</h3>
<p>Un porcentaje global puede empeorar aunque cada segmento mejore, si cambia la <b>mezcla</b>. Es un error frecuente al comparar tiendas: una tienda con más pedidos difíciles (domicilio) se ve peor en el global aunque sea mejor en cada modalidad. Por eso el curso insiste: <b>corta por modalidad, canal y categoría antes de concluir</b>.</p>`,
example:`<p>«Retail Andino» (ficticio) compara la tienda X con la tienda Y. Y tiene mejor On Time en domicilio y en retiro, pero peor global porque casi todos sus pedidos son domicilio, la modalidad más difícil. Si el gerente solo ve el global, castiga a la tienda equivocada.</p>`,
ex:{type:'calc',intro:'Pedidos entregados por tienda y modalidad (datos sintéticos).',cols:['Tienda','Modalidad','Pedidos','A tiempo'],rows:[['X','Domicilio',10,6],['X','Retiro',90,85],['Y','Domicilio',90,63],['Y','Retiro',10,10]],num:[2,3],
task:'Calcula el On Time global de X, el global de Y y el On Time de Y en Domicilio.',
parts:[{l:'Global X',u:'%',tol:0.1,fn:function(r){var p=0,a=0;r.filter(function(x){return x[0]==='X'}).forEach(function(x){p+=x[2];a+=x[3]});return 100*a/p}},{l:'Global Y',u:'%',tol:0.1,fn:function(r){var p=0,a=0;r.filter(function(x){return x[0]==='Y'}).forEach(function(x){p+=x[2];a+=x[3]});return 100*a/p}},{l:'Y en Domicilio',u:'%',tol:0.1,fn:function(r){var x=r[2];return 100*x[3]/x[2]}}],
sol:function(v){return '<p>Global X = <b>'+fmt(v[0])+'%</b>; global Y = <b>'+fmt(v[1])+'%</b>. Pero en Domicilio Y logra <b>'+fmt(v[2])+'%</b> frente a 60% de X, y en Retiro Y logra 100% frente a 94,4% de X. Y es mejor en <b>cada</b> modalidad y peor en el global: efecto de mezcla (paradoja de Simpson).</p>'}},
quiz:[
{q:'Una correlación alta entre dos variables demuestra que…',o:['Una causa la otra','Se mueven juntas; la causa requiere más evidencia','Son idénticas','Hay error de datos'],a:1,w:'Correlación no es causalidad.'},
{q:'La paradoja de Simpson ocurre cuando…',o:['Los datos son pocos','El global contradice a los segmentos por cambio de mezcla','Hay atípicos','Falta el ERP'],a:1,w:'Cada segmento mejora, pero el peso de los segmentos cambia.'},
{q:'Antes de concluir que una tienda es peor…',o:['Miras solo el global','Cortas por modalidad, canal y categoría','Le preguntas al cliente','Esperas un año'],a:1,w:'Evita comparar mezclas distintas.'}],
src:[['https://itl.nist.gov/div898/handbook/pmc/section3/pmc32.htm','NIST/SEMATECH e-Handbook (referencia general de variabilidad y control)']],
ver:['Ejemplo de Simpson con cifras inventadas para ilustrar el efecto de mezcla.']},

{id:'10.5',title:'Control de procesos simple: cuándo una variación es señal',min:20,
goal:'Usar un gráfico de control básico para distinguir la variación normal de una señal que merece acción.',
body:`<p>Todo proceso varía. Un <b>gráfico de control</b> (Shewhart) grafica una medida en el tiempo con una línea central (la media) y dos límites: <b>LCL</b> y <b>UCL</b> a tres desviaciones estándar por debajo y por arriba. Un punto fuera de los límites sugiere una <b>causa especial</b> (algo cambió), mientras que la variación dentro de los límites es <b>causa común</b> (ruido normal).</p>
<pre><code>LCL = media − 3 × desviación estándar
UCL = media + 3 × desviación estándar</code></pre>
<p>Reglas de sentido común: define los límites con un <b>periodo estable</b> previo (línea base); recalcúlalos solo cuando el proceso cambió a propósito; y complementa con reglas como 8 puntos seguidos del mismo lado de la media, que indican un desplazamiento sostenido.</p>
<p><b>Cuidado con la muestra:</b> el manual del NIST recuerda la recomendación clásica de Shewhart de reunir del orden de 25 subgrupos antes de dar un proceso por controlado. Con 10 días de historia, los límites son provisionales. Y para porcentajes (como On Time) con distinto número de pedidos por día existe el gráfico p, cuyos límites cambian con n ${V('usar gráfico p si el volumen diario varía mucho')}.</p>
<p>Aplicación: usar el LCL del On Time diario como umbral de alerta en Power BI o Power Automate (capítulo 12.1). Así avisas cuando algo <i>realmente</i> cambió y no por cada pequeña oscilación.</p>`,
example:`<p>El On Time diario de «Retail Andino» (ficticio) oscila entre 89% y 95% durante meses. Un día marca 84%: fuera del LCL, se investiga. Otro día marca 88%: dentro del ruido normal, no se activa ninguna alarma. Eso evita la fatiga de alertas.</p>`,
ex:{type:'calc',intro:'On Time diario (%) de un periodo estable de 10 días (datos sintéticos): 92, 90, 94, 91, 93, 89, 92, 95, 90, 93. Días nuevos: 88, 84, 96.',
task:'Calcula la media, el LCL con 3 desviaciones (desviación muestral) y cuántos de los tres días nuevos caen por debajo del LCL.',
parts:[{l:'Media',u:'%',tol:0.05,fn:function(){return mean([92,90,94,91,93,89,92,95,90,93])}},{l:'LCL',u:'%',tol:0.1,fn:function(){var b=[92,90,94,91,93,89,92,95,90,93];return mean(b)-3*sdS(b)}},{l:'Días nuevos bajo el LCL',tol:0,fn:function(){var b=[92,90,94,91,93,89,92,95,90,93],l=mean(b)-3*sdS(b);return [88,84,96].filter(function(x){return x<l}).length}}],
sol:function(v){var b=[92,90,94,91,93,89,92,95,90,93];return '<p>Media = <b>'+fmt(v[0])+'%</b>, desviación muestral = '+fmt(sdS(b),2)+', LCL = <b>'+fmt(v[1])+'%</b>, UCL = '+fmt(mean(b)+3*sdS(b))+'%. Solo el día de 84% cae por debajo (<b>'+v[2]+'</b>). El 88% se ve mal pero está dentro de la variación normal; el 96% está dentro del UCL. Con solo 10 días de línea base los límites son provisionales.</p>'}},
quiz:[
{q:'Un punto fuera del LCL o UCL sugiere…',o:['Ruido normal','Una posible causa especial que hay que investigar','Un error del ERP siempre','Que hay que recalcular todo'],a:1,w:'Es una señal, no una certeza.'},
{q:'¿Para qué defines una línea base estable?',o:['Para calcular límites con un periodo sin cambios grandes','Para borrar datos','Por estética','Para ahorrar licencias'],a:0,w:'Los límites se calculan con un proceso estable.'},
{q:'¿Qué riesgo tienen los límites calculados con 10 puntos?',o:['Ninguno','Son provisionales y poco confiables','Son perfectos','Son ilegales'],a:1,w:'Shewhart recomendaba del orden de 25 subgrupos.'}],
src:[['https://itl.nist.gov/div898/handbook/pmc/section3/pmc32.htm','NIST/SEMATECH e-Handbook: gráficos de control de variables y cantidad de muestras'],['https://www.sqconline.com/node/15','SQCOnline: reglas de Western Electric y gráficos de control']],
ver:['Los límites de 3 sigma asumen aproximadamente una distribución normal e independencia entre puntos '+V('validar supuestos antes de automatizar alertas')]}
]});
