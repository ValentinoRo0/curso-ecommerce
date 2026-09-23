MODS.push({id:'11',grp:'tools',title:'11. Power Automate para operaciones',short:'Tipos de flujo, conectores, recetas, buenas prácticas',blurb:'Cuándo y cómo automatizar tareas de operaciones con Forms, Lists, Excel, Outlook, Teams y Power BI.',ch:[
{id:'11.1',title:'Qué es Power Automate y cuándo conviene usarlo',min:18,
goal:'Distinguir los tipos de flujo, saber qué tareas de operaciones sí conviene automatizar y cuáles no.',
body:`<p><b>Power Automate</b> es el servicio de Microsoft para automatizar tareas repetitivas conectando aplicaciones. Piénsalo como el «pegamento» entre herramientas de oficina: un formulario, una lista, un correo, un canal de Teams, una hoja de Excel. No reemplaza al OMS, al WMS ni al ERP: automatiza el trabajo que ocurre <i>alrededor</i> de ellos.</p>
${T(['Tipo de flujo','Se inicia por…','Ejemplo en operaciones e-commerce'],[
['Automatizado (cloud)','Un evento: llega un correo, se envía un formulario, se crea un elemento en una lista','Registrar y clasificar una incidencia cuando alguien llena el formulario'],
['Instantáneo (cloud)','Un botón, en la web o el móvil','Botón «tienda sin picker» que avisa al jefe de operaciones'],
['Programado (cloud)','Un horario','Cada mañana, enviar la lista de pedidos atorados'],
['De escritorio (RPA)','Un robot que repite clics y teclas en Windows o en la web','Copiar datos de una pantalla sin API a Excel'],
['De proceso de negocio','Una guía por etapas dentro de una aplicación','Llevar un caso por etapas hasta cerrarlo']])}
<p>Microsoft documenta los flujos de nube (automatizados, instantáneos y programados), los de escritorio y los de proceso de negocio; su clasificación se ha ido actualizando (por ejemplo, ya aparecen «acciones generativas» en vista previa) ${V('lista vigente de tipos y funciones con IA')}.</p>
<h3>Cuándo sí</h3>
<ul><li>La tarea se repite y tiene <b>reglas claras</b> («si severidad es alta, avisa a X»).</li><li>Los datos entran <b>estructurados</b> (formulario con listas desplegables, tabla).</li><li>Hay riesgo de olvido o demora (recordatorios, vencimientos).</li><li>Existe un conector para el sistema.</li></ul>
<h3>Cuándo no, o todavía no</h3>
<ul><li>El proceso está mal definido: automatizas el desorden.</li><li>Hay excepciones en la mayoría de los casos.</li><li>Una fórmula de Excel o un filtro de Power BI ya lo resuelve.</li><li>Manejas datos personales o financieros y no tienes autorización.</li><li>Solo puedes hacerlo con robots de pantalla (RPA) sobre un sistema crítico que cambia mucho: es frágil.</li></ul>
<p>Regla de trabajo: <b>define, mide, automatiza</b>. Si no sabes cuánto tarda hoy la tarea, no sabrás si la automatización sirvió.</p>`,
example:`<p>En «Retail Andino» (ficticio), las tiendas reportan incidencias por WhatsApp y alguien las copia a un Excel al final del día. Con un formulario, una lista y un flujo, la incidencia queda registrada al momento, clasificada y con aviso al responsable. El equipo deja de perder tiempo copiando y tú ganas datos limpios para analizar.</p>`,
ex:{type:'match',intro:'¿Qué tipo de flujo usarías?',opts:['Automatizado','Instantáneo','Programado','De escritorio (RPA)','De proceso de negocio'],items:[
{t:'Cada vez que alguien envía el formulario de incidencias',a:'Automatizado'},
{t:'Todos los días a las 8:00, enviar los pedidos atorados',a:'Programado'},
{t:'Un botón en el móvil para avisar «tienda sin picker»',a:'Instantáneo'},
{t:'Un robot que repite clics en una pantalla web sin API para bajar datos',a:'De escritorio (RPA)'},
{t:'Guiar por etapas a quien gestiona un caso dentro de una aplicación',a:'De proceso de negocio'}],
sol:'<p>Bien. Para operaciones e-commerce, empieza casi siempre con flujos <b>automatizados y programados</b>: son los más simples de mantener.</p>'},
quiz:[
{q:'Power Automate sirve sobre todo para…',o:['Reemplazar el ERP','Automatizar tareas repetitivas conectando aplicaciones','Calcular KPI avanzados','Diseñar dashboards'],a:1,w:'Es un integrador de tareas y aplicaciones.'},
{q:'¿Cuál es una mala razón para automatizar?',o:['La tarea se repite todos los días','El proceso es confuso y cambia cada vez','Hay reglas claras','Hay riesgo de olvido'],a:1,w:'Automatizar un proceso confuso multiplica el desorden.'},
{q:'Un flujo que se ejecuta cada mañana a una hora fija es…',o:['Instantáneo','Programado','De proceso de negocio','Un RPA obligatoriamente'],a:1,w:'Se inicia por horario.'}],
src:[['https://learn.microsoft.com/en-us/flow/flow-types','Microsoft Learn: tipos de flujos de Power Automate'],['https://learn.microsoft.com/en-us/training/modules/explore-power-automate/2-examine-functionality','Microsoft Learn: automatizados, instantáneos, programados, de proceso y de escritorio']],
ver:['Tipos de flujo, funciones con IA y nombres de la interfaz en 2026/2027: '+V('Microsoft Learn'),'Los ejemplos de operaciones son propuestas didácticas, no casos de una empresa real.']},

{id:'11.2',title:'Anatomía de un flujo: disparador, acciones, condiciones y expresiones',min:20,
goal:'Leer y diseñar un flujo paso a paso, incluido el tuyo de incidencias, y usar las expresiones más comunes.',
body:`<p>Todo flujo tiene un <b>disparador</b> (lo que lo inicia) y una o más <b>acciones</b> (lo que hace). Entre medias puedes poner <b>condiciones</b> (Sí/No), <b>bucles</b> (aplicar a cada elemento), <b>variables</b> y acciones de <b>Redactar</b> (Compose) para preparar datos. Los resultados de cada paso se reutilizan como <b>contenido dinámico</b>.</p>
<p>Un detalle clave del conector de Forms: el disparador «Cuando se envía una nueva respuesta» solo entrega el <b>ID</b> del formulario y de la respuesta. Para leer los campos necesitas la acción <b>«Obtener los detalles de la respuesta»</b>. Además, los valores llegan como <b>texto</b> aunque el campo del formulario sea de otro tipo; por eso conviene usar listas desplegables y validar en el flujo.</p>
<h3>Expresiones que usarás seguido</h3>
${T(['Expresión','Para qué'],[
['<code>utcNow()</code>','Fecha y hora actual en UTC'],
['<code>convertTimeZone(utcNow(),\'UTC\',\'SA Pacific Standard Time\',\'yyyy-MM-dd HH:mm\')</code>','Hora de Lima (verifica el nombre de la zona en tu entorno)'],
['<code>formatDateTime(utcNow(),\'yyyy-MM-dd\')</code>','Dar formato a una fecha'],
['<code>addDays(utcNow(),15)</code>','Sumar días calendario (no hábiles)'],
['<code>if(equals(variables(\'sev\'),\'Alta\'),\'Urgente\',\'Normal\')</code>','Decidir un valor según una condición'],
['<code>coalesce(x,\'sin dato\')</code>','Reemplazar vacíos'],
['<code>length(body(\'Obtener_elementos\')?[\'value\'])</code>','Contar elementos devueltos']])}
<p>Perú usa UTC−5 todo el año, y si no conviertes la zona, las horas de registro saldrán desfasadas ${V('nombre de zona horaria y comportamiento de fechas en tu entorno')}.</p>`,
example:`<p>Tu flujo de incidencias sigue esta lógica. Recórrelo en el diagrama de abajo y fíjate en el orden: primero se obtienen los detalles, luego se guarda, luego se decide a quién avisar.</p>`,
ex:{type:'flow',intro:'Flujo «Registro y clasificación de incidencia» (versión de referencia, con datos ficticios).',steps:[
{k:'trigger',t:'Cuando se envía una nueva respuesta (Microsoft Forms)',d:'Solo entrega el ID de la respuesta. Selecciona el formulario de incidencias de la lista; evita pegar un ID a mano.'},
{k:'action',t:'Obtener los detalles de la respuesta',d:'Recupera los campos como texto. Usa listas desplegables en el formulario para evitar valores libres.'},
{k:'action',t:'Crear elemento (SharePoint / Microsoft Lists)',d:'Mapea cada campo a una columna. Estado inicial «Nuevo». Fecha de registro con <code>convertTimeZone(...)</code>.'},
{k:'cond',t:'¿Severidad = Alta?',d:'Rama Sí: mensaje al canal de Teams y correo al responsable. Rama No: solo correo al responsable.'},
{k:'action',t:'Enviar correo (Outlook) o publicar en Teams',d:'Asunto claro (tienda, categoría, severidad) y enlace al elemento. Sin datos personales del cliente.'},
{k:'action',t:'Actualizar elemento',d:'Cambia el estado a «Notificado» y guarda la fecha de aviso, para medir tiempos después.'},
{k:'end',t:'Resultado: incidencia registrada, clasificada y notificada',d:'Además quedan datos limpios para analizar en Power BI.'}],
task:'Marca 4 puntos donde este flujo puede fallar y cómo te enterarías.',
sol:'<ol><li><b>Campo del formulario renombrado o borrado:</b> el mapeo a la lista se rompe. Te enteras por el historial de ejecuciones, o mejor por un aviso de error.</li><li><b>Tipo de columna incompatible</b> (por ejemplo, texto en una columna de número o fecha): falla «Crear elemento».</li><li><b>Correo sin destinatario</b> o permisos de la cuenta que envía: falla el aviso.</li><li><b>Cuenta de conexión desactivada o contraseña cambiada:</b> todo el flujo se detiene.</li></ol><p>Solución común: bloque Try/Catch con aviso (capítulo 11.5).</p>'},
quiz:[
{q:'El disparador de Forms «Cuando se envía una nueva respuesta» entrega…',o:['Todos los campos ya listos','Solo el ID de la respuesta; los detalles se piden con otra acción','El PDF del formulario','El correo del jefe'],a:1,w:'Se necesita «Obtener los detalles de la respuesta».'},
{q:'¿Qué hace <code>addDays(utcNow(),15)</code>?',o:['Suma 15 días hábiles','Suma 15 días calendario','Resta 15 días','Suma 15 horas'],a:1,w:'No conoce sábados, domingos ni feriados.'},
{q:'Los campos de Forms llegan al flujo como…',o:['Fechas y números tipados siempre','Texto','Imágenes','Nada'],a:1,w:'Conviene validar y convertir cuando haga falta.'}],
src:[['https://github.com/MicrosoftDocs/power-automate-docs/blob/live/articles/forms/overview.md','Documentación de Power Automate (fuente): conector de Forms'],['https://manueltgomes.com/microsoft/powerautomate/forms-when-a-new-response-is-submitted-trigger','Manuel T. Gomes: el disparador de Forms devuelve solo IDs (fuente secundaria)'],['https://manueltgomes.com/reference/power-automate-action-reference/forms-get-response-details-action/','Manuel T. Gomes: valores como texto (fuente secundaria)']],
ver:['Nombres de acciones y de zona horaria según el idioma y el entorno de tu Power Automate: '+V('probar en tu entorno'),'Este flujo es una versión de referencia; el tuyo puede tener otros pasos.']},

{id:'11.3',title:'Conectores, licencias y dónde guardar los datos',min:18,
goal:'Saber qué conectores puedes usar con tu cuenta, qué es «premium» y dónde conviene guardar los datos de tus flujos.',
body:`<p>Un <b>conector</b> es lo que permite al flujo hablar con una aplicación. Se dividen en <b>estándar</b> y <b>premium</b>. Con Microsoft 365 suelen estar cubiertos los estándar más usados (Outlook, SharePoint, Teams, Forms, Excel Online, OneDrive, Aprobaciones). Los premium, como <b>SQL Server</b>, Dataverse o HTTP, exigen una licencia adicional; el propio FAQ de licencias de Microsoft clasifica SQL Server como premium. Y basta con <b>una</b> acción premium en el flujo para que todo el flujo requiera esa licencia ${V('licencias, precios y reglas actuales; consúltalo con TI')}.</p>
<p>En una empresa, además, los administradores pueden aplicar <b>políticas DLP</b> que bloquean o agrupan conectores. Aunque un conector exista, tu organización puede no permitirlo.</p>
<h3>Dónde guardar datos para tus flujos</h3>
${T(['Opción','Cuándo usarla','Cuidado'],[
['Microsoft Lists / SharePoint','Registros como incidencias, reclamos y aprobaciones','Define columnas tipadas y listas desplegables'],
['Excel Online (Business)','Tablas pequeñas y reportes','Los datos deben estar en una Tabla dentro de OneDrive o SharePoint, no en un archivo local'],
['Dataverse','Aplicaciones más grandes','Premium'],
['SQL Server','Datos transaccionales','Premium; requiere permisos y, para fuentes locales, una puerta de enlace']])}
<p>Para empezar, la combinación <b>Forms + Lists + Outlook/Teams + Excel + Power BI</b> resuelve mucho y usa conectores estándar.</p>
<p>Otro dato: los límites dependen del plan. Con planes de Microsoft 365 el flujo tiene el perfil de rendimiento más bajo (límites de solicitudes menores), lo que importa cuando el volumen crece.</p>`,
example:`<p>Un analista de «Retail Andino» (ficticio) quiere leer directamente la base de pedidos de SQL Server desde el flujo. Se encuentra con un conector premium. Alternativa práctica: exportar cada mañana una tabla resumen a Excel Online y leer esa tabla desde el flujo, o pedir a TI el permiso y la licencia si el caso lo justifica.</p>`,
ex:{type:'match',intro:'¿Qué conector usarías?',opts:['Microsoft Forms','SharePoint / Lists','Microsoft Teams','Outlook','Excel Online (Business)','SQL Server (premium)'],items:[
{t:'Recibir los datos de un formulario de incidencias',a:'Microsoft Forms'},
{t:'Guardar registros de incidencias con columnas y estados',a:'SharePoint / Lists'},
{t:'Avisar al canal del equipo de operaciones',a:'Microsoft Teams'},
{t:'Enviar un correo con el resumen diario',a:'Outlook'},
{t:'Leer las filas de una tabla en un Excel de OneDrive',a:'Excel Online (Business)'},
{t:'Consultar directamente una base de datos SQL Server',a:'SQL Server (premium)'}],
sol:'<p>Bien. Antes de diseñar, pregunta a TI qué conectores y qué entorno están permitidos.</p>'},
quiz:[
{q:'Una sola acción premium en un flujo implica que…',o:['Solo esa acción requiere licencia','Todo el flujo requiere la licencia correspondiente','No hay cambios','El flujo se borra'],a:1,w:'La licencia se aplica al flujo completo.'},
{q:'Para Excel Online en un flujo, los datos deben estar…',o:['En un archivo local','En una Tabla dentro de OneDrive o SharePoint','En un PDF','En un correo'],a:1,w:'Las acciones de Excel trabajan con tablas.'},
{q:'Una política DLP sirve para…',o:['Acelerar los flujos','Restringir o agrupar los conectores que se pueden usar','Reducir el precio','Crear formularios'],a:1,w:'Es control de gobernanza del administrador.'}],
src:[['https://www.microsoft.com/licensing/faqs/8','Microsoft Licensing FAQ: lista de conectores premium (incluye SQL Server)'],['https://learn.microsoft.com/en-us/power-automate/limits-and-config','Microsoft Learn: perfiles de rendimiento y límites'],['https://team400.ai/blog/2026-04-15-power-automate-licensing-australia','Team400: licencias de Power Automate 2026 (fuente secundaria)']],
ver:['Precios y planes: no los cito porque cambian y varían por país '+V('consultar a TI o a Microsoft'),'Conectores permitidos por tu empleador: depende de las políticas DLP.']},

{id:'11.4',title:'Cinco recetas para operaciones e-commerce',min:20,
goal:'Conocer cinco flujos útiles, con su tipo, sus pasos y qué datos necesitan, para decidir cuál construir primero.',
body:`<p>Cada receta indica el <b>disparador</b>, las <b>acciones</b> y la <b>fuente de datos</b>. Elige una pestaña y toca los pasos. Son diseños de referencia, no plantillas oficiales.</p>
<p>Ojo con la fuente de datos: si tu OMS o tu SQL Server no ofrecen un conector estándar, el flujo puede leer un <b>resumen exportado a Excel o a una lista</b>, que a su vez se actualiza desde un reporte. Es más lento, pero funciona sin licencias adicionales.</p>`,
example:`<p>Empieza por la receta 1 (la que ya hiciste) y la 5 (el reporte diario). Las dos usan datos estructurados, conectores estándar y producen un ahorro fácil de medir.</p>`,
ex:{type:'flow',intro:'',recipes:[
{t:'1 Incidencias',d:'Automatizado. Fuente: Forms y Lists.',steps:[
{k:'trigger',t:'Cuando se envía una respuesta (Forms)',d:'Formulario con categoría, tienda, severidad y número de pedido.'},
{k:'action',t:'Obtener detalles y crear elemento en la lista',d:'Registra con estado «Nuevo» y fecha de registro en hora de Lima.'},
{k:'cond',t:'¿Severidad alta?',d:'Sí: Teams al canal. No: correo al responsable.'},
{k:'end',t:'Datos listos para un Pareto de causas en Power BI',d:'Ver capítulo 2.4.'}]},
{t:'2 Pedidos atorados',d:'Programado. Fuente: tabla exportada a Excel o lista.',steps:[
{k:'trigger',t:'Recurrencia (por ejemplo, cada hora en turno)',d:'Define zona horaria de Lima y días hábiles. El intervalo mínimo de recurrencia es de 60 segundos, pero rara vez hace falta tan seguido.'},
{k:'action',t:'Obtener filas de la tabla de pedidos',d:'Filtra por estado y por horas en estado mayor al umbral (capítulo 2.1).'},
{k:'cond',t:'¿Hay pedidos atorados?',d:'Si la cantidad es 0, el flujo termina sin molestar a nadie.'},
{k:'action',t:'Crear tabla HTML y enviar por Outlook o Teams',d:'Agrupa por tienda para mostrar dónde llamar.'},
{k:'end',t:'Lista diaria de excepciones, sin trabajo manual',d:'Depende de que la tabla de origen esté actualizada.'}]},
{t:'3 Plazo de reclamos',d:'Programado. Fuente: lista de reclamos.',steps:[
{k:'trigger',t:'Recurrencia diaria',d:'Cada mañana, en hora de Lima.'},
{k:'action',t:'Obtener reclamos abiertos',d:'La lista guarda la fecha límite. El plazo es de 15 días hábiles (capítulo 5.2). La fecha se registra al crear el reclamo, no con <code>addDays</code>.'},
{k:'cond',t:'¿Faltan 3 días hábiles o menos?',d:'Compara con la fecha límite. Los feriados van en una lista aparte '+V('regla de cómputo y feriados con el área legal')+'.'},
{k:'action',t:'Recordar al responsable y escalar al jefe si vence',d:'Correo con el enlace al reclamo.'},
{k:'end',t:'Menos reclamos vencidos',d:'El riesgo real es la fecha límite mal calculada, no el envío.'}]},
{t:'4 Aprobaciones',d:'Automatizado. Fuente: lista o formulario.',steps:[
{k:'trigger',t:'Cuando se crea un elemento (ajuste de stock o devolución especial)',d:'Ejemplo: ajuste negativo grande o reembolso excepcional.'},
{k:'action',t:'Iniciar y esperar una aprobación',d:'El aprobador responde por correo o Teams.'},
{k:'cond',t:'¿Aprobado?',d:'Sí: actualiza la lista y avisa a almacén. No: notifica y cierra con motivo.'},
{k:'ctrl',t:'Recordatorio y escalamiento',d:'Una ejecución dura como máximo 30 días; después, los pasos pendientes caducan. Programa recordatorios mucho antes.'},
{k:'end',t:'Ajustes con trazabilidad',d:'Queda registrado quién aprobó y cuándo.'}]},
{t:'5 Reporte diario',d:'Programado. Fuente: tabla de Excel Online.',steps:[
{k:'trigger',t:'Recurrencia, todos los días a las 8:00 (hora de Lima)',d:'Configura la zona horaria explícitamente.'},
{k:'action',t:'Obtener filas de la tabla de KPIs',d:'La tabla se alimenta con Power Query o desde tu proceso diario.'},
{k:'action',t:'Seleccionar y crear tabla HTML',d:'Columnas: KPI, valor, meta, variación.'},
{k:'action',t:'Enviar correo (Outlook)',d:'Asunto con fecha; cuerpo con la tabla y el enlace al tablero.'},
{k:'end',t:'Reporte que sale solo',d:'Mide cuánto tiempo tomaba antes (capítulo 11.6).'}]}],
task:'¿Cuál construirías primero? Da tres criterios para decidir.',
sol:'<p>Criterios: <b>frecuencia</b> (cuántas veces al día o semana), <b>dolor</b> (tiempo perdido o riesgo si se olvida) y <b>simplicidad</b> (datos estructurados y conectores estándar). Con esos criterios, las recetas 1 y 5 suelen ganar. La 3 tiene más valor de negocio, pero exige definir bien la fecha límite y los feriados; conviene construirla con el área legal.</p>'},
quiz:[
{q:'¿Cuál es una limitación importante de esperar una aprobación en un flujo?',o:['No se puede','La ejecución dura como máximo 30 días','Solo funciona en domingo','Requiere premium siempre'],a:1,w:'La documentación de límites indica 30 días de duración de ejecución.'},
{q:'Si no hay pedidos atorados, ¿qué debería hacer el flujo de la receta 2?',o:['Enviar un correo vacío','Terminar sin notificar','Borrar la tabla','Reiniciar'],a:1,w:'Evita ruido y fatiga de alertas.'},
{q:'¿Por qué la receta 3 exige cuidado?',o:['Porque usa Forms','Porque el cálculo de la fecha límite en días hábiles con feriados es delicado','Porque es más lenta','Porque es ilegal'],a:1,w:'Un error de fecha equivale a un reclamo vencido.'}],
src:[['https://learn.microsoft.com/en-us/power-automate/limits-and-config','Microsoft Learn: 30 días de ejecución, recurrencia mínima de 60 segundos'],['https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/error-handling','Microsoft Learn: guía de manejo de errores y alertas']],
ver:['Las cinco recetas son diseños didácticos. Conectores, nombres de acciones y límites exactos: '+V('según tu entorno y plan')]},

{id:'11.5',title:'Buenas prácticas: errores, seguridad, propiedad y límites',min:20,
goal:'Construir flujos que no se rompen en silencio, que no exponen datos y que sobreviven a los cambios de personal.',
body:`<h3>1. Errores</h3>
<p>Por defecto, cada acción solo se ejecuta si la anterior fue exitosa, así que el primer error detiene todo. Microsoft recomienda agrupar acciones en <b>Scopes</b> con patrón <b>Try / Catch</b>: en «Try» va el trabajo principal y en «Catch», configurado para ejecutarse si «Try» falla (<i>Configure run after</i>), identificas el error, lo registras y avisas por correo o Teams. Un flujo sin esto falla en silencio.</p>
<h3>2. Datos personales</h3>
<p>Si un flujo envía correos o mensajes, incluye lo mínimo: número de pedido, tienda, estado. No pongas DNI, teléfono ni dirección. Es el principio del capítulo 5.3.</p>
<h3>3. Propiedad</h3>
<p>Los flujos usan las <b>conexiones</b> de quien los creó. Si esa persona deja la empresa y su cuenta se desactiva, los flujos pueden dejar de funcionar; las fuentes de la comunidad recomiendan tener <b>co-propietarios</b>, una <b>cuenta de servicio</b> (con aprobación de TI) o flujos dentro de <b>soluciones</b>. Añadir un co-propietario ayuda a que otra persona pueda entrar y cambiar las conexiones, pero no hace que el flujo use sus credenciales automáticamente.</p>
<p>Y una regla de oro: <b>lo que construyes en una empresa pertenece a la empresa</b>. No copies flujos ni datos a tu cuenta personal.</p>
<h3>4. Límites y mantenimiento</h3>
<ul><li>Una ejecución dura como máximo 30 días y el historial de ejecuciones se conserva 30 días.</li><li>Nombres claros: «Incidencias - Forms a Lista - Alta», no «Flow 3 final v2».</li><li>Una <b>ficha del flujo</b>: objetivo, dueño, conexiones, fuentes de datos, fallos conocidos y cómo apagarlo.</li><li>Prueba con casos límite: campos vacíos, texto donde esperas número, un adjunto enorme.</li></ul>`,
example:`<p>El flujo de incidencias de tu compañero de «Retail Andino» (ficticio) usa su cuenta personal. Cuando cambia de área y su licencia se retira, las incidencias dejan de registrarse y nadie lo nota durante tres días. Con un Catch que avise y un co-propietario, se habría detectado el primer día.</p>`,
ex:{type:'match',intro:'Une cada problema con la práctica que lo previene.',opts:['Try/Catch con aviso','Co-propietario o cuenta de servicio','Minimizar datos personales','Nombre claro y ficha del flujo','Recordatorio y escalamiento','Pruebas con casos límite'],items:[
{t:'Si Forms falla, nadie se entera',a:'Try/Catch con aviso'},
{t:'El flujo corre con tu cuenta personal y te vas de la empresa',a:'Co-propietario o cuenta de servicio'},
{t:'El correo lleva DNI, teléfono y dirección de 200 clientes',a:'Minimizar datos personales'},
{t:'Nadie sabe qué hace «Flow 3 final v2»',a:'Nombre claro y ficha del flujo'},
{t:'Una aprobación queda esperando 45 días',a:'Recordatorio y escalamiento'},
{t:'Solo probaste con un caso perfecto y falla con un campo vacío',a:'Pruebas con casos límite'}],
sol:'<p>Bien. Si dudas sobre cuentas de servicio o solutions, esa decisión es de TI o del administrador de Power Platform, no tuya.</p>'},
quiz:[
{q:'En un flujo sin manejo de errores, cuando falla una acción…',o:['Continúa igual','Se detiene el resto de acciones dependientes','Se repara sola','Se borra'],a:1,w:'Por defecto, las acciones siguientes solo corren si la anterior tuvo éxito.'},
{q:'Añadir un co-propietario garantiza…',o:['Que el flujo use sus credenciales','Que otra persona pueda entrar y cambiar las conexiones si hace falta','Que nunca falle','Nada'],a:1,w:'No cambia las conexiones por sí solo.'},
{q:'¿Puedes copiar a tu cuenta personal un flujo hecho en tu empresa?',o:['Sí, es tuyo','No, pertenece a la empresa y manejas sus datos','Solo los viernes','Sí, si borras el nombre'],a:1,w:'Gobernanza y confidencialidad.'}],
src:[['https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/error-handling','Microsoft Learn: manejo de errores con Scopes (Try/Catch)'],['https://learn.microsoft.com/en-us/power-automate/limits-and-config','Microsoft Learn: límites de duración y retención'],['https://learn.microsoft.com/et-ee/training/modules/get-started-flows/8-flow-share-flows','Microsoft Learn: compartir flujos y conexiones'],['https://sharepains.com/2020/12/10/how-to-handle-leavers-in-power-automate/','SharePains: qué pasa con los flujos de quien se va (fuente secundaria)'],['https://powerusers.microsoft.com/t5/General-Power-Automate/What-happens-to-the-flow-if-flow-owner-leave-the-organisation/m-p/399563','Comunidad Power Users: propiedad y solutions (foro, sin garantía oficial)']],
ver:['Qué pasa exactamente con un flujo cuando se desactiva la cuenta de su dueño depende del tipo de flujo y de la configuración de tu organización: '+V('consultar al administrador'),'Los límites de la documentación pueden cambiar: '+V('límites vigentes')]},

{id:'11.6',title:'Tu flujo real: de 8 columnas a datos que se pueden analizar',min:20,
goal:'Revisar tu lista de incidencias tal como está, decidir qué mejorar (y qué no) y medir el ahorro con números.',
body:`<p>Tu lista actual tiene ocho columnas: <code>Titulo</code>, <code>NumeroPedido</code>, <code>Producto</code>, <code>TipoIncidencia</code>, <code>Descripcion</code>, <code>Severidad</code>, <code>ResponsablePicking</code> y <code>Estado</code>. Para una primera automatización de un curso es una base correcta: registra, deja evidencia y permite avisar. <b>No necesitas cambiar nada para aprender.</b> Lo que sigue son mejoras opcionales, ordenadas por lo que más rinde.</p>
<h3>Lo que ya puedes analizar con tus 8 columnas</h3>
<ul><li><b>Pareto por <code>TipoIncidencia</code>:</b> qué tipos concentran las incidencias.</li><li><b>Reincidencia por <code>Producto</code>:</b> qué productos se repiten.</li><li><b>Carga por <code>ResponsablePicking</code></b> y por <code>Estado</code>.</li><li><b>Incidencias por día</b>, si SharePoint guarda la fecha de creación de cada elemento (normalmente lo hace; compruébalo en tu lista).</li></ul>
<h3>El límite: texto libre</h3>
<p><code>TipoIncidencia</code>, <code>Severidad</code> y <code>Estado</code> son texto de una línea. Si alguien escribe «Alta», «alta» y «ALTA », para el análisis son tres valores distintos. La mejora de mayor impacto es convertir esas tres columnas en <b>columnas de elección (Choice)</b> con opciones fijas, y usar en el formulario una <b>lista desplegable</b> con exactamente las mismas opciones. La forma de cambiar el tipo de columna puede variar según tu versión ${V('probar primero en una copia de la lista')}.</p>
<h3>Mejoras que puedes dejar para después</h3>
<ul><li><code>ResponsablePicking</code> como columna de <b>Persona</b>, solo si los responsables son cuentas de tu organización; sirve para avisar directamente.</li><li>Una <b>fecha de cierre</b>, si quieres medir el tiempo de resolución (capítulo 10.1: media y percentil 90).</li><li>Una columna de <b>tienda</b>, solo si vas a analizar por tienda.</li></ul>
<p>No agregues columnas «por si acaso». Cada columna nueva es un dato que alguien tiene que llenar.</p>`,
example:`<p>Con las opciones fijas, en un tablero de Power BI verás una barra por cada tipo de incidencia, no diez variantes del mismo. Con tus datos de práctica ya puedes preparar tu Pareto (capítulo 2.4) y presentarlo en la entrevista, aclarando que son datos ficticios.</p>`,
ex:{type:'match',intro:'¿Qué tipo de columna elegirías para cada campo de tu lista?',opts:['Texto de una línea','Texto de varias líneas','Elección (Choice)','Persona (si son usuarios de tu organización)'],items:[
{t:'Titulo',a:'Texto de una línea'},
{t:'NumeroPedido',a:'Texto de una línea'},
{t:'Producto',a:'Texto de una línea'},
{t:'TipoIncidencia',a:'Elección (Choice)'},
{t:'Descripcion',a:'Texto de varias líneas'},
{t:'Severidad',a:'Elección (Choice)'},
{t:'ResponsablePicking',a:'Persona (si son usuarios de tu organización)'},
{t:'Estado',a:'Elección (Choice)'}],
sol:'<p>Bien. <code>NumeroPedido</code> conviene como texto porque no se suma ni se promedia y podría tener ceros a la izquierda. Si tus responsables no son cuentas de la organización, deja <code>ResponsablePicking</code> como texto.</p>',
also:{type:'check',id:'11.6',intro:'Checklist opcional para tu flujo «ORIGEN - Registro y clasificación de incidencia». Marca lo que ya tengas.',items:[
'TipoIncidencia como Elección con opciones fijas',
'Severidad como Elección (por ejemplo Alta, Media, Baja)',
'Estado como Elección (por ejemplo Nuevo, En análisis, Resuelto)',
'El formulario usa listas desplegables con las mismas opciones escritas igual',
'Bloque Try/Catch con aviso si el flujo falla',
'Ficha del flujo: objetivo, dueño, conexiones y cómo apagarlo',
'Probé el flujo con un campo vacío y con un texto inesperado',
'Opcional: Persona en ResponsablePicking, o una fecha de cierre'],
also:{type:'calc',intro:'Ahora calcula el ahorro con supuestos ficticios: 25 incidencias por día, 22 días al mes. Antes, 4 minutos por incidencia copiando a mano. Ahora, 1 minuto (llenar el formulario) más 30 minutos por semana de mantenimiento (4 semanas al mes).',
task:'Calcula el ahorro mensual en minutos y en horas, y el % de reducción del tiempo.',
parts:[{l:'Ahorro mensual',u:'minutos',tol:0,fn:function(){return 25*22*4-(25*22*1+30*4)}},{l:'Ahorro mensual',u:'horas',tol:0.05,fn:function(){return (25*22*4-(25*22*1+30*4))/60}},{l:'Reducción del tiempo',u:'%',tol:0.1,fn:function(){var a=25*22*4;return 100*(a-(25*22+30*4))/a}}],
sol:function(v){return '<p>Antes: 25 × 22 × 4 = 2200 min. Ahora: 25 × 22 × 1 = 550 min, más 120 de mantenimiento = 670 min. Ahorro = <b>'+v[0]+' minutos</b> = <b>'+fmt(v[1])+' horas</b>, una reducción de <b>'+fmt(v[2])+'%</b>. Si no cuentas el mantenimiento, exageras el ahorro. Todas las cifras son inventadas.</p>'}}}},
quiz:[
{q:'¿Por qué conviene una columna de elección en lugar de texto libre?',o:['Por estética','Para que «Alta», «alta» y «ALTA » no cuenten como valores distintos','Por licencia','Para ocultar errores'],a:1,w:'El texto libre genera variantes del mismo valor.'},
{q:'Al medir el ahorro de una automatización, ¿qué no debes olvidar?',o:['El color','El tiempo de mantenimiento','El nombre del flujo','La hora del correo'],a:1,w:'El mantenimiento es un costo real.'},
{q:'¿Puedes usar datos reales de un empleador anterior en tu portafolio?',o:['Sí','No; usa datos ficticios o de un proyecto propio','Solo sin nombres','Solo en PDF'],a:1,w:'Confidencialidad y riesgo legal.'}],
src:[['https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/error-handling','Microsoft Learn: manejo de errores'],['https://learn.microsoft.com/en-us/power-automate/limits-and-config','Microsoft Learn: límites de Power Automate']],
ver:['Todas las cifras del cálculo de ahorro son ficticias.','Cómo cambiar el tipo de una columna en Microsoft Lists y qué pasa con los valores ya guardados: '+V('probar en una copia de la lista'),'Que SharePoint guarde la fecha de creación de cada elemento: '+V('comprobar en tu lista')]},

{id:'11.7',title:'Catálogo de ideas y ruta de práctica guiada',min:20,
goal:'Ver qué más se puede automatizar en operaciones, logística, reportes, atención y estudio, y practicar en un orden que funcione.',
body:`<p>Power Automate sirve para casi cualquier tarea repetitiva con reglas claras. El catálogo de abajo reúne ideas por <b>área</b> y por <b>nivel</b>. «Estándar» significa que la idea se apoya en conectores estándar según la documentación de Microsoft; «premium» o «verificar» indica que puede exigir licencia o permisos adicionales ${V('licencias y conectores permitidos en tu plan y en tu empresa')}.</p>
<h3>Ruta de práctica, en orden</h3>
${T(['Nivel','Qué practicas','Pasa al siguiente cuando…'],[
['1 Básico','Un disparador, una acción, un aviso. Avisos por correo, guardar adjuntos, recordatorios.','Sabes leer el historial de ejecuciones y encontrar por qué falló un flujo.'],
['2 Intermedio','Condiciones, listas y Excel Online, expresiones de fecha, un flujo programado.','Tus flujos usan Try/Catch y evitan enviar avisos vacíos.'],
['3 Avanzado','Aprobaciones, bucles, Power BI y varios sistemas en un mismo proceso.','Puedes explicar cómo medirías el ahorro y qué pasa si el flujo falla.'],
['4 Requiere permisos o licencias','SQL Server, IA o robots de escritorio.','Tienes autorización de TI y un caso de negocio claro.']])}
<h3>Cómo elegir una idea</h3>
<ul><li>Tarea que se repite <b>a menudo</b> y duele o se olvida.</li><li>Datos <b>estructurados</b> (formulario, lista, tabla).</li><li>Puedes <b>medir el antes</b> (minutos, errores).</li><li>No expone <b>datos personales</b> innecesarios.</li></ul>
<p>Empieza por una del nivel 1 o 2 en tu área, hazla funcionar con datos de prueba, añade el manejo de errores del capítulo 11.5 y anota su ficha. Luego pasa a la siguiente.</p>`,
example:`<p>Una progresión razonable con lo que ya hiciste: (1) aviso por correo con cada incidencia → (2) clasificación por severidad con Choice → (3) reporte diario con el conteo por tipo → (3) alerta desde Power BI cuando el número sube más de lo normal (capítulo 12.1).</p>`,
ex:{type:'ideas',intro:'Filtra por área y nivel. Toca una idea para ver su ficha: problema, disparador, acciones, conectores y cómo medir el ahorro.',ideas:[
{t:'Aviso por correo con cada incidencia nueva',area:'Operaciones e-commerce',n:1,lic:'estándar',p:'Nadie se entera de una incidencia hasta que alguien revisa la lista.',tr:'Cuando se crea un elemento en la lista de incidencias.',ac:['Enviar correo (Outlook) al responsable','Incluir título, severidad y enlace al elemento','No incluir datos personales del cliente'],co:'SharePoint / Lists, Outlook',m:'Minutos entre el registro y la primera respuesta, antes y después.'},
{t:'Incidencias con clasificación y alerta por severidad',area:'Operaciones e-commerce',n:2,lic:'estándar',p:'Las incidencias graves se pierden entre las demás.',tr:'Cuando se envía una respuesta de Microsoft Forms.',ac:['Obtener detalles de la respuesta','Crear elemento en la lista con columnas de elección','Condición: si severidad es Alta, publicar en Teams y avisar al jefe','Actualizar el estado a «Notificado»'],co:'Forms, Lists, Teams, Outlook',m:'Tiempo de primera respuesta en incidencias altas.'},
{t:'Pedidos atorados cada mañana',area:'Operaciones e-commerce',n:2,lic:'estándar',p:'Revisar a mano qué pedidos llevan demasiadas horas en un estado.',tr:'Recurrencia diaria en horario de Lima.',ac:['Obtener filas de una tabla de Excel Online con estado y horas','Filtrar las que superan el umbral','Si no hay ninguna, terminar sin avisar','Crear tabla HTML agrupada por tienda y enviarla'],co:'Excel Online (Business), Outlook o Teams',m:'Minutos de revisión manual evitados por día.'},
{t:'Aprobación de ajustes de stock y devoluciones especiales',area:'Operaciones e-commerce',n:3,lic:'estándar',p:'Los ajustes grandes se hacen sin trazabilidad.',tr:'Cuando se crea un elemento de ajuste en la lista.',ac:['Iniciar y esperar una aprobación','Si se aprueba, actualizar la lista y avisar a almacén','Si se rechaza, cerrar con motivo','Recordar y escalar antes de 30 días'],co:'Lists, Aprobaciones, Outlook',m:'Ajustes con aprobación registrada frente al total.'},
{t:'Seguimiento semanal de sellers',area:'Operaciones e-commerce',n:3,lic:'estándar',p:'Armar cada semana la lista de sellers bajo el umbral.',tr:'Recurrencia semanal.',ac:['Leer la tabla de indicadores de sellers','Filtrar los que están bajo el umbral acordado','Enviar tabla con sus casos','Crear una tarea de seguimiento por seller'],co:'Excel Online, Outlook, Planner (verificar)',m:'Horas de armado semanal antes y después.'},
{t:'Control de recepción de mercadería',area:'Logística y almacén',n:2,lic:'estándar',p:'Diferencias entre lo esperado y lo recibido se detectan tarde.',tr:'Cuando se envía el formulario de recepción.',ac:['Registrar SKU, unidades esperadas y recibidas y daños','Calcular la diferencia','Si es distinta de cero, avisar a compras e inventarios','Bloquear las unidades dañadas (capítulo 2.5)'],co:'Forms, Lists, Outlook',m:'Días entre la recepción y la corrección del stock.'},
{t:'Checklist de turno de picking',area:'Logística y almacén',n:2,lic:'estándar',p:'No hay registro ordenado del personal, incidentes y pendientes por turno.',tr:'Formulario al inicio y al cierre del turno.',ac:['Guardar respuestas en una lista','Enviar resumen diario al supervisor','Alertar si faltan personas frente al plan (capítulo 7.3)'],co:'Forms, Lists, Outlook',m:'Turnos con registro completo.'},
{t:'Alerta de cobertura baja',area:'Logística y almacén',n:3,lic:'estándar',p:'Un SKU se queda sin stock antes de que alguien lo note.',tr:'Recurrencia diaria.',ac:['Leer la tabla de stock y demanda diaria','Calcular la cobertura en días (capítulo 8.5)','Listar los SKU bajo el umbral, empezando por clase A','Enviar la lista al responsable de inventario'],co:'Excel Online, Outlook',m:'Quiebres evitados o días de quiebre por mes.'},
{t:'Reporte diario de KPIs por correo',area:'Reportes y datos',n:2,lic:'estándar',p:'El reporte se arma a mano todos los días.',tr:'Recurrencia, a las 8:00 (hora de Lima).',ac:['Leer la tabla de KPIs','Crear tabla HTML con valor, meta y variación','Enviar por Outlook con el enlace al tablero'],co:'Excel Online, Outlook',m:'Minutos por día antes y después, más días sin reporte.'},
{t:'Guardar adjuntos de reportes automáticamente',area:'Reportes y datos',n:1,lic:'estándar',p:'Los reportes llegan por correo y se pierden.',tr:'Cuando llega un correo con adjunto que cumple un filtro.',ac:['Filtrar por remitente o asunto','Guardar el archivo en una carpeta con la fecha en el nombre','Opcional: avisar que se guardó'],co:'Outlook, OneDrive o SharePoint',m:'Reportes encontrados sin búsqueda manual.'},
{t:'Alerta de KPI desde Power BI',area:'Reportes y datos',n:3,lic:'verificar',p:'Nadie mira el tablero cuando el KPI empeora.',tr:'Cuando se activa una alerta de datos de Power BI.',ac:['Obtener valor y hora','Si baja del umbral crítico, avisar en Teams','Crear incidencia en la lista'],co:'Power BI, Teams, Lists',m:'Tiempo entre la caída del KPI y la primera acción.'},
{t:'Consulta programada a SQL Server',area:'Reportes y datos',n:4,lic:'premium',p:'Se necesita leer la base directamente y con horario.',tr:'Recurrencia.',ac:['Ejecutar una consulta sobre pedidos atorados','Convertir el resultado en tabla','Enviar por correo o Teams'],co:'SQL Server (premium), Outlook',m:'Minutos de extracción manual evitados.'},
{t:'Extraer datos de facturas o PDF con IA',area:'Reportes y datos',n:4,lic:'verificar',p:'Copiar datos de documentos a mano.',tr:'Cuando llega un archivo a una carpeta.',ac:['Procesar el documento con un modelo de IA','Guardar los campos en una lista','Revisión humana de los casos dudosos'],co:'AI Builder u otros (verificar), SharePoint',m:'Errores y tiempo por documento; siempre con revisión.'},
{t:'Plazo de reclamos con recordatorios',area:'Atención y reclamos',n:3,lic:'estándar',p:'Un reclamo vence sin respuesta (capítulo 5.2).',tr:'Recurrencia diaria.',ac:['Leer los reclamos abiertos con su fecha límite','Comparar con hoy','Recordar al responsable y escalar al jefe si vence','Registrar el aviso en la lista'],co:'Lists, Outlook',m:'Reclamos respondidos dentro del plazo.'},
{t:'Cierre de incidencia con encuesta breve',area:'Atención y reclamos',n:3,lic:'estándar',p:'No sabes si el cliente quedó conforme.',tr:'Cuando el estado cambia a Resuelto.',ac:['Enviar enlace a un formulario de una pregunta','Guardar el puntaje','Calcular un NPS interno (capítulo 3.3)'],co:'Lists, Forms, Outlook',m:'Tasa de respuesta y puntaje por tipo de incidencia.'},
{t:'Registro de gastos por formulario con resumen mensual',area:'Finanzas personales',n:2,lic:'estándar',p:'Anotar gastos es tedioso y se abandona.',tr:'Cuando se envía el formulario de gasto (desde el móvil).',ac:['Agregar una fila a una tabla de Excel Online','El día 1 de cada mes, calcular el total por categoría','Enviar el resumen por correo'],co:'Forms, Excel Online, Outlook',m:'Días del mes con gastos registrados.'},
{t:'Recordatorio de pagos y vencimientos',area:'Finanzas personales',n:1,lic:'estándar',p:'Olvidas una fecha de pago.',tr:'Recurrencia diaria.',ac:['Leer la lista de vencimientos','Avisar con 3 días de anticipación','Opcional: notificación al móvil'],co:'Lists, Outlook o notificaciones',m:'Pagos hechos a tiempo.'},
{t:'Bitácora de estudio con resumen semanal',area:'Portafolio y estudio',n:2,lic:'estándar',p:'No tienes registro de cuánto estudiaste ni en qué te bloqueaste.',tr:'Formulario diario de tres preguntas.',ac:['Guardar en una lista','Cada domingo, resumir horas y bloqueos','Enviar el resumen por correo'],co:'Forms, Lists, Outlook',m:'Constancia: días de estudio por semana.'}],
also:{type:'reveal',task:'Elige una idea de tu área y completa su ficha en seis líneas: problema, disparador, acciones, datos, riesgos y métrica de éxito.',
sol:'<p>Ejemplo con «Aviso por correo con cada incidencia nueva»: <b>Problema:</b> las incidencias se revisan al final del día. <b>Disparador:</b> nuevo elemento en la lista. <b>Acciones:</b> correo al responsable con título, severidad y enlace. <b>Datos:</b> solo número de pedido y tipo, sin datos del cliente. <b>Riesgos:</b> correo que no llega, o responsable sin asignar. Se controla con Try/Catch y con un responsable por defecto. <b>Éxito:</b> reducir los minutos hasta la primera respuesta.</p>'}},
quiz:[
{q:'¿Cómo decides qué automatizar primero?',o:['La más vistosa','La que se repite, duele y tiene datos estructurados','La más difícil','La que otra persona te pida sin explicar'],a:1,w:'Frecuencia, dolor y datos ordenados.'},
{q:'«Nivel 4» en este catálogo indica…',o:['Que es imposible','Que puede requerir permisos o licencias adicionales','Que es gratis siempre','Que no lleva flujo'],a:1,w:'Verifica con TI antes de construirlo.'},
{q:'Antes de pasar al siguiente nivel debes…',o:['Borrar tus flujos','Poder leer el historial de ejecuciones y manejar errores','Comprar una licencia','Cambiar de empresa'],a:1,w:'Sin depuración no hay avance seguro.'}],
src:[['https://www.microsoft.com/licensing/faqs/8','Microsoft Licensing FAQ: conectores premium'],['https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/error-handling','Microsoft Learn: manejo de errores'],['https://learn.microsoft.com/en-nz/power-bi/create-reports/service-set-data-alerts','Microsoft Learn: alertas de datos de Power BI']],
ver:['Las ideas son diseños didácticos, no plantillas oficiales de Microsoft.','Licencia de cada conector (Planner, AI Builder, Power BI) y qué permite tu empresa: '+V('consultar a TI o la documentación de Microsoft')]}
]});
