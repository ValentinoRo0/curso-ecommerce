/* ===== Motor del curso ===== */
(function(){
var COURSE_NAME='E-commerce Operations, Supply Chain & Analytics';
var LS='ecom-curso-v1',S={done:{},quiz:{},theme:'',notes:{},ex:{},simulacros:[],srs:{}};
try{var raw=localStorage.getItem(LS);if(raw){var o=JSON.parse(raw);for(var k in o)S[k]=o[k]}}catch(e){}
function save(){try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}}
(function migrate(){
  var k,p;
  if(!S.ver||S.ver<2){
    var M={};for(var n=1;n<=6;n++)M['6.'+n]='10.'+n;for(n=1;n<=5;n++)M['7.'+n]='9.'+n;M['8.5']='11.1';M['8.6']='11.2';
    var nd={};for(k in S.done)nd[M[k]||k]=S.done[k];S.done=nd;
    var nq={};for(k in S.quiz){p=k.split('.');nq[(M[p[0]+'.'+p[1]]||(p[0]+'.'+p[1]))+'.'+p[2]]=S.quiz[k]}S.quiz=nq;
    var ck={'chk_6.6':'chk_10.6','chk_8.6':'chk_11.2'};for(k in ck){if(S[k]){S[ck[k]]=S[k];delete S[k]}}
    S.ver=2;
  }
  if(S.ver<3){
    function sh(id){var m=/^(\d+)\.(\d+)$/.exec(id);return m&&+m[1]>=6?(+m[1]+1)+'.'+m[2]:id}
    var d2={};for(k in S.done)d2[sh(k)]=S.done[k];S.done=d2;
    var q2={};for(k in S.quiz){p=k.split('.');q2[sh(p[0]+'.'+p[1])+'.'+p[2]]=S.quiz[k]}S.quiz=q2;
    var x2={};for(k in (S.ex||{}))x2[sh(k)]=S.ex[k];S.ex=x2;
    for(k in S.notes){}
    var ks=Object.keys(S);ks.forEach(function(kk){if(kk.indexOf('chk_')===0){var nid='chk_'+sh(kk.slice(4));if(nid!==kk){S[nid]=S[kk];delete S[kk]}}});
    if(S.last)S.last=sh(S.last);
    S.ver=3;
  }
  save();
})();
function $(s,e){return (e||document).querySelector(s)}
function $$(s,e){return Array.prototype.slice.call((e||document).querySelectorAll(s))}
function E(html){var d=document.createElement('div');d.innerHTML=html.trim();return d.firstElementChild}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
if(!S.ex)S.ex={};
if(S.theme)document.documentElement.setAttribute('data-theme',S.theme);

function mkey(m){return m.id==='C'?6.5:parseFloat(m.id)}
MODS.sort(function(a,b){return mkey(a)-mkey(b)});
var ALL=[];MODS.forEach(function(m){m.ch.forEach(function(c){c.mod=m;ALL.push(c)})});
var main=$('#main'),nav=$('#nav'),cur='home';
var totalMin=ALL.reduce(function(a,c){return a+c.min},0);

/* ---------- navegación ---------- */
var GL={log:'Logística y cadena de suministro (teoría)',tools:'Herramientas y práctica'};
function setNav(o){nav.classList.toggle('open',o);$('#scrim').hidden=!o}
function renderNav(){
  var h='<button class="btn sm navclose" id="navclose">Cerrar mapa</button><a class="homelink" href="#/home">Inicio y plan</a><a class="homelink" href="#/simulacro">Simulacro de entrevista</a><a class="homelink" href="#/repaso">Repaso espaciado</a><a class="homelink" href="#/mapa">Mapa de conceptos</a><a class="homelink" href="#/mis-datos">Mis datos</a><a class="homelink" href="#/avance">Registro de avance</a><a class="homelink" href="#/certificado">Certificado</a><a class="homelink" href="#/glosario">Glosario</a>';
  var lastg='';
  MODS.forEach(function(m){
    var g=m.grp||'';
    if(g&&g!==lastg)h+='<p class="navsep">'+GL[g]+'</p>';
    lastg=g;
    var d=m.ch.filter(function(c){return S.done[c.id]}).length;
    h+='<div class="stop"><div class="mtitle"><span class="node m'+(d===m.ch.length?' done':'')+'"></span><span>'+m.title+'</span><small>'+d+'/'+m.ch.length+'</small></div><ul>';
    m.ch.forEach(function(c){
      h+='<li class="'+(cur===c.id?'on':'')+(S.done[c.id]?' done':'')+'"><a href="#/'+c.id+'"><span class="node"></span><span>'+(c.id==='caso'?'':c.id+' ')+c.title+'</span><em>'+c.min+' min</em></a></li>';
    });
    h+='</ul></div>';
  });
  nav.innerHTML=h;
}
function updateProgress(){
  var d=ALL.filter(function(c){return S.done[c.id]}).length;
  $('#pfill').style.width=(100*d/ALL.length)+'%';
  $('#ptxt').textContent=d+' de '+ALL.length+' completados';
}
function updateBar(c){
  var p=$('#bprev'),n=$('#bnext');
  if(c){var i=ALL.indexOf(c),pv=ALL[i-1],nx=ALL[i+1];
    if(pv){p.hidden=false;p.href='#/'+pv.id}else p.hidden=true;
    if(nx){n.hidden=false;n.href='#/'+nx.id;n.textContent='Siguiente ›'}else n.hidden=true;
  }else{p.hidden=true;var f=ALL.filter(function(x){return !S.done[x.id]})[0]||ALL[0];n.hidden=false;n.href='#/'+f.id;n.textContent='Continuar ›'}
}
function route(){
  var id=(location.hash||'#/home').slice(2)||'home';cur=id;
  var c=ALL.filter(function(x){return x.id===id})[0];
  hideTip();
  if(simTimer){clearInterval(simTimer);simTimer=null}
  if(id==='glosario'){renderGlossary()}
  else if(id==='simulacro'){renderSimulacro()}
  else if(id==='repaso'){renderRepaso()}
  else if(id==='mapa'){renderMapa()}
  else if(id==='mis-datos'){renderMisDatos()}
  else if(id==='avance'){renderAvance()}
  else if(id==='certificado'){renderCertificado()}
  else if(c){renderChapter(c);S.last=c.id;save()}else{cur='home';renderHome()}
  renderNav();updateProgress();updateBar(c);window.scrollTo(0,0);setNav(false);
}

/* ---------- inicio ---------- */
function modMin(ids){var t=0;MODS.forEach(function(m){if(ids.indexOf(m.id)>-1)m.ch.forEach(function(c){t+=c.min})});return t}
function hm(t){var h=Math.floor(t/60),m=t%60;return '~'+(h?h+' h ':'')+(m?m+' min':'')}
function planRows(){return [
 ['Días 1-2','Módulo 1: mapa del e-commerce',hm(modMin(['1']))],
 ['Días 3-4','Módulo 2: operación diaria y stock',hm(modMin(['2']))],
 ['Días 5-6','Módulo 3: KPIs y reportes (pega el CSV en Excel y practica)',hm(modMin(['3']))],
 ['Día 7','Módulo 4: catálogo, plataformas y marketplace',hm(modMin(['4']))],
 ['Día 8','Módulo 5: cumplimiento y empleabilidad',hm(modMin(['5']))],
 ['Días 9-11','Módulo 6: gestión operativa (incidencias, excepciones, escalamiento, mesa de control y casos)',hm(modMin(['6']))],
 ['Día 12','Caso final del curso base',hm(modMin(['C']))],
 ['Días 13-14','Simulacro de entrevista, prueba de Excel cronometrada y repaso de errores','libre'],
 ['Semanas 3-4','Logística (módulos 7 y 8): almacén, distribución, inventario y un caso de campaña',hm(modMin(['7','8']))],
 ['Semana 5','Datos y dashboards (módulo 9) y estadística aplicada (módulo 10)',hm(modMin(['9','10']))],
 ['Semanas 6-7','Power Automate (módulo 11) e integración con proyecto final (módulo 12). Puedes intercalar el módulo 11 antes',hm(modMin(['11','12']))+' + práctica']
]}
function routeHtml(list,here){return list.map(function(m){var d=m.ch.every(function(c){return S.done[c.id]});return '<li class="'+(d?'done':'')+(m===here?' here':'')+'"><b>'+(m.id==='C'?'Caso final':'Módulo '+m.id)+'</b><span>'+m.short+'</span></li>'}).join('')}
function mcards(list){return list.map(function(m){var d=m.ch.filter(function(c){return S.done[c.id]}).length;return '<a class="mcard" href="#/'+m.ch[0].id+'"><h3>'+m.title+'</h3><p>'+m.blurb+'</p><p class="small">'+d+' de '+m.ch.length+' capítulos · '+m.ch.reduce(function(a,c){return a+c.min},0)+' min</p></a>'}).join('')}
function renderHome(){
  var g0=MODS.filter(function(m){return !m.grp}),g1=MODS.filter(function(m){return m.grp==='log'}),g2=MODS.filter(function(m){return m.grp==='tools'});
  var here=null;MODS.forEach(function(m){if(!here&&m.ch.some(function(c){return !S.done[c.id]}))here=m});
  var lastc=S.last&&ALL.filter(function(c){return c.id===S.last})[0];
  var first=lastc||ALL.filter(function(c){return !S.done[c.id]})[0]||ALL[0];
  var t0=modMin(g0.map(function(m){return m.id})),t1=modMin(g1.map(function(m){return m.id})),t2=modMin(g2.map(function(m){return m.id}));
  var cls=function(n){return n>=8?'':(n===7?' r7':(n===4?' r4':(n===2?' r2':' r3')))};
  main.innerHTML='<div class="wrap"><section class="hero"><h1>Operaciones e-commerce retail en Perú</h1><p class="lead">Un curso base de cinco módulos y un caso final (unas '+fmt(t0/60,1)+' horas) para llegar a la entrevista con conceptos claros, fórmulas que sabes calcular y tu experiencia bien contada. Después, dos módulos de logística y cadena de suministro (unas '+fmt(t1/60,1)+' horas de teoría) y cuatro de herramientas y práctica (unas '+fmt(t2/60,1)+' horas) para crecer hacia analista de datos.</p><a class="btn pri" href="#/'+first.id+'">'+(lastc?'Continuar donde lo dejaste ('+(first.id==='caso'?'caso final':'cap. '+first.id)+')':'Empezar por el capítulo 1.1')+'</a></section>'
  +'<h2>Curso base</h2><ol class="route'+cls(g0.length)+'" aria-label="Ruta del curso base">'+routeHtml(g0,here)+'</ol>'
  +'<h2>Logística y cadena de suministro</h2><ol class="route'+cls(g1.length)+'">'+routeHtml(g1,here)+'</ol>'
  +'<h2>Herramientas y práctica</h2><ol class="route'+cls(g2.length)+'">'+routeHtml(g2,here)+'</ol>'
  +'<h2>Cómo funciona</h2><div class="body"><ul><li>Cada capítulo trae objetivo, explicación con ejemplo peruano, un ejercicio con datos sintéticos y tres preguntas de repaso.</li><li>Todas las cifras de los ejercicios son inventadas para practicar (retailer ficticio «Retail Andino»). Las normas y datos externos llevan fuente.</li><li>Lo que no pude confirmar para 2026/2027 lleva la marca '+V()+'. Compruébalo en la fuente oficial antes de citarlo en una entrevista.</li><li>El botón «Datos sintéticos» te da un CSV de 320 pedidos para practicar en Excel Power Query, SQL Server y Power BI.</li><li>Los términos subrayados con puntos se pueden tocar para ver su definición. Al final de cada capítulo hay una lista de sus términos y en el menú está el <a href="#/glosario">glosario</a> completo.</li><li>Los módulos posteriores al caso final no hacen falta para las ofertas de asistente o analista de operaciones que ya viste: sirven para lo que viene después.</li></ul></div>'
  +'<h2>Plan sugerido</h2>'+T(['Cuándo','Qué hacer','Tiempo'],planRows())
  +'<h2>Módulos</h2><div class="grid2">'+mcards(MODS)+'</div>'
  +'<h2>Simulacro de entrevista</h2><p class="body">Preguntas mezcladas de todo el curso (conceptos, KPIs, excepciones, escalamiento, logística, sistemas) con un resultado final por tema, pensado como diagnóstico de preparación y no como nota académica.</p>'+(S.simulacros.length?'<p class="small">Último intento: '+simScoreTxt(S.simulacros[S.simulacros.length-1])+'</p>':'')+'<p><a class="btn pri" href="#/simulacro">Ir al simulacro</a></p>'
  +'<h2>Más práctica</h2><div class="grid2">'
    +'<a class="mcard" href="#/repaso"><h3>Repaso espaciado</h3><p>Las preguntas que fallaste, con repetición espaciada.</p></a>'
    +'<a class="mcard" href="#/mapa"><h3>Mapa de conceptos</h3><p>'+GLOS.length+' términos agrupados por módulo.</p></a>'
    +'<a class="mcard" href="#/mis-datos"><h3>Mis datos</h3><p>Calcula los KPIs del curso sobre tus propios pedidos.</p></a>'
    +'<a class="mcard" href="#/avance"><h3>Registro de avance</h3><p>Resumen imprimible de tu progreso.</p></a>'
    +'<a class="mcard" href="#/certificado"><h3>Certificado</h3><p>'+(ALL.every(function(c){return S.done[c.id]})?'Disponible: 100% completado.':'Se habilita al completar el 100% del curso.')+'</p></a>'
  +'</div>'
  +'<h2>Tu progreso</h2><p class="body">Tu avance se guarda en este navegador. Si estudias en el móvil y en la computadora, o en la app instalada, copia tu código de progreso y pégalo en el otro dispositivo.</p><p><button class="btn" id="pgbtn">Exportar o importar progreso</button></p>'
  +'<p class="small">Excluidos a propósito: fundamentos de Python, Google/Meta Ads, SEO, estadística avanzada y Big Data. El módulo 10 es estadística descriptiva aplicada, de nivel intermedio.</p></div>';
  var pb=$('#pgbtn');if(pb)pb.onclick=openProgress;
}

/* ---------- capítulo ---------- */
function renderChapter(c){
  var m=c.mod,i=ALL.indexOf(c),prev=ALL[i-1],next=ALL[i+1];
  var src=(c.src||[]).map(function(s){return '<li><a href="'+s[0]+'" target="_blank" rel="noopener">'+esc(s[1])+'</a></li>'}).join('');
  var ver=(c.ver||[]).map(function(v){return '<li>'+v+'</li>'}).join('');
  main.innerHTML='<div class="wrap"><article class="chap"><p class="crumb">'+m.title+(m.grp?' · '+(m.grp==='log'?'logística':'herramientas'):'')+'</p><h1>'+(c.id==='caso'?'':c.id+' ')+c.title+'</h1><p class="meta">'+c.min+' minutos</p>'
  +'<div class="goal"><b>Objetivo.</b> '+c.goal+'</div><section class="body">'+c.body+'</section>'
  +(c.example?'<aside class="pe"><h3>Ejemplo peruano</h3>'+c.example+'</aside>':'')
  +'<h2>Ejercicio</h2><div class="ex" id="exbox"></div><p class="rst"><button class="btn sm" id="rstbtn">Borrar mis respuestas de este ejercicio</button></p>'
  +(c.quiz?'<h2>Repaso</h2><div class="ex nolink" id="qbox"></div>':'')
  +'<section class="terms nolink" id="tsec" hidden><h2>Términos de este capítulo</h2><p class="small">Toca uno para ver su definición. El glosario completo está en el menú.</p><div id="tchips"></div></section>'
  +'<section class="src nolink"><h2>Fuentes y puntos por verificar</h2>'+(src?'<ul>'+src+'</ul>':'')+(ver?'<p><b>Por verificar antes de usarlo:</b></p><ul>'+ver+'</ul>':'')+'</section>'
  +'<div class="pager nolink">'+(prev?'<a class="btn pn" href="#/'+prev.id+'">Anterior</a>':'')+'<span class="grow"></span><button class="btn '+(S.done[c.id]?'':'pri')+'" id="donebtn">'+(S.done[c.id]?'Completado (deshacer)':'Marcar como completado')+'</button>'+(next?'<a class="btn pn" href="#/'+next.id+'">Siguiente</a>':'')+'</div></article></div>';
  curCh=c.id;
  renderEx(c.ex,$('#exbox'));
  if(c.quiz)renderQuiz(c,$('#qbox'));
  restoreEx(c);attachSave(c);
  linkTerms($('.wrap'));buildChips();
  $('#rstbtn').onclick=function(){resetEx(c)};
  $('#donebtn').onclick=function(){if(S.done[c.id])delete S.done[c.id];else S.done[c.id]=1;save();renderChapter(c);renderNav();updateProgress()};
}

/* ---------- ejercicios ---------- */
function renderEx(ex,box){
  if(ex.lab)box.appendChild(labWidget(ex.lab));
  var t=ex.type;
  if(t==='calc')exCalc(ex,box);
  else if(t==='reveal')exReveal(ex,box);
  else if(t==='match')exMatch(ex,box);
  else if(t==='tabs')exTabs(ex,box);
  else if(t==='gtin')exGtin(ex,box);
  else if(t==='flash')exFlash(ex,box);
  else if(t==='case')exCase(ex,box);
  else if(t==='flow')exFlow(ex,box);
  else if(t==='stats')exStats(ex,box);
  else if(t==='check')exCheck(ex,box);
  else if(t==='ideas')exIdeas(ex,box);
  else if(t==='fc')exFc(ex,box);
  else if(t==='cat')exCat(ex,box);
  else if(t==='route')exRoute(ex,box);
  else if(t==='triage')exTriage(ex,box);
  else if(t==='scenario')exScenario(ex,box);
  else if(t==='opencase')exOpenCase(ex,box);
  if(ex.also){var b2=document.createElement('div');b2.style.marginTop='16px';box.appendChild(b2);renderEx(ex.also,b2)}
}
function addHtml(box,html){var d=document.createElement('div');d.innerHTML=html;while(d.firstChild)box.appendChild(d.firstChild)}
function exReveal(ex,box){
  var h='';if(ex.intro)h+='<p>'+ex.intro+'</p>';
  if(ex.cols)h+=T(ex.cols,ex.rows,ex.num);
  h+=workedExampleHtml(ex);
  h+='<p><b>'+ex.task+'</b></p><div class="row">'+hintButtonHtml()+'<button class="btn sm" data-a="sol">Ver solución</button></div><div class="sol" hidden>'+ex.sol+'</div>';
  addHtml(box,h);
  wireHint(box,ex,[ex]);
  var b=$('[data-a=sol]',box),s=$('.sol',box);
  b.onclick=function(){s.hidden=!s.hidden;b.textContent=s.hidden?'Ver solución':'Ocultar solución'};
}
function parseN(s){s=String(s).trim().replace('%','').replace(/\s/g,'');if(s.indexOf(',')>-1&&s.indexOf('.')>-1)s=s.replace(/\./g,'');s=s.replace(',','.');return parseFloat(s)}
function exCalc(ex,box){
  var rows=ex.data?DATA:ex.rows;
  var parts=ex.parts||[ex];
  var h='';
  if(ex.timer)h+='<div class="row"><span class="timer" id="tm">'+clock(ex.timer)+'</span><button class="btn sm" id="tstart">Iniciar cronómetro</button><button class="btn sm" id="tstop">Pausar</button></div>';
  if(ex.intro)h+='<p>'+ex.intro+'</p>';
  if(ex.cols)h+=T(ex.cols,ex.rows,ex.num);
  if(ex.data)h+='<p class="small">Datos: usa el botón «Datos sintéticos» de arriba, copia el CSV en Excel y calcula tú mismo.</p>';
  h+=workedExampleHtml(ex);
  h+='<p><b>'+ex.task+'</b></p>';
  parts.forEach(function(p,i){h+='<div class="row"><label>'+(p.l||'Tu respuesta')+' <input type="text" inputmode="decimal" data-i="'+i+'" autocomplete="off"></label><span>'+(p.u||'')+'</span><span class="fb" data-f="'+i+'"></span></div>'});
  h+='<div class="row"><button class="btn pri sm" data-a="chk">Comprobar</button>'+hintButtonHtml()+'<button class="btn sm" data-a="sol">Ver solución</button></div><div class="sol" hidden></div>';
  addHtml(box,h);
  wireHint(box,ex,parts);
  var vals=parts.map(function(p){return p.fn(rows)});
  $('[data-a=chk]',box).onclick=function(){
    parts.forEach(function(p,i){
      var v=parseN($('[data-i="'+i+'"]',box).value),f=$('[data-f="'+i+'"]',box),tol=p.tol==null?0.1:p.tol;
      if(isNaN(v)){f.className='fb';f.textContent='Escribe un número.';return}
      if(Math.abs(v-vals[i])<=tol){f.className='fb ok';f.textContent='Correcto'}
      else{f.className='fb bad';f.textContent='Todavía no. Revisa el denominador y el filtro.'}
    });
  };
  var sb=$('[data-a=sol]',box),sd=$('.sol',box);
  sb.onclick=function(){if(sd.hidden){sd.innerHTML=ex.sol(vals,rows);sd.hidden=false;sb.textContent='Ocultar solución'}else{sd.hidden=true;sb.textContent='Ver solución'}};
  if(ex.timer){
    var left=ex.timer,iv=null,tm=$('#tm',box);
    $('#tstart',box).onclick=function(){if(iv)return;iv=setInterval(function(){left--;tm.textContent=clock(left);if(left<=0){clearInterval(iv);iv=null}},1000)};
    $('#tstop',box).onclick=function(){clearInterval(iv);iv=null};
  }
}
function clock(s){var m=Math.floor(s/60),x=s%60;return (m<10?'0':'')+m+':'+(x<10?'0':'')+x}
function exMatch(ex,box){
  var h='';if(ex.intro)h+='<p>'+ex.intro+'</p>';
  ex.items.forEach(function(it,i){h+='<div class="row"><span style="flex:1;min-width:220px">'+it.t+'</span><select data-i="'+i+'"><option value="">Elige</option>'+ex.opts.map(function(o){return '<option>'+o+'</option>'}).join('')+'</select><span class="fb" data-f="'+i+'"></span></div>'});
  h+='<div class="row"><button class="btn pri sm" data-a="chk">Comprobar</button></div><div class="sol" hidden>'+(ex.sol||'')+'</div>';
  addHtml(box,h);
  $('[data-a=chk]',box).onclick=function(){
    var okn=0;
    ex.items.forEach(function(it,i){var v=$('[data-i="'+i+'"]',box).value,f=$('[data-f="'+i+'"]',box);
      if(v===it.a){okn++;f.className='fb ok';f.textContent='Correcto'}else{f.className='fb bad';f.textContent=v?'Revisa':'Elige una opción'}});
    if(okn===ex.items.length)$('.sol',box).hidden=false;
  };
}
function exTabs(ex,box){
  var h='';if(ex.intro)h+='<p>'+ex.intro+'</p>';
  h+='<div class="tabs">'+ex.items.map(function(it,i){return '<button class="tab'+(i===0?' on':'')+'" data-t="'+i+'">'+it.t+'</button>'}).join('')+'</div><div class="tabp"></div>';
  if(ex.task)h+='<p><b>'+ex.task+'</b></p><div class="row"><button class="btn sm" data-a="sol">Ver solución</button></div><div class="sol" hidden>'+ex.sol+'</div>';
  addHtml(box,h);
  var p=$('.tabp',box);function show(i){p.innerHTML=ex.items[i].d;$$('.tab',box).forEach(function(b,j){b.classList.toggle('on',i===j)})}
  $$('.tab',box).forEach(function(b){b.onclick=function(){show(+b.getAttribute('data-t'))}});show(0);
  var sb=$('[data-a=sol]',box);if(sb){var sd=$('.sol',box);sb.onclick=function(){sd.hidden=!sd.hidden;sb.textContent=sd.hidden?'Ver solución':'Ocultar solución'}}
}
function gtinCheck(d12){var s=0;for(var i=0;i<12;i++)s+=(+d12[i])*(i%2===0?1:3);return (10-s%10)%10}
function exGtin(ex,box){
  addHtml(box,'<p>'+ex.intro+'</p><div class="row"><label>Código de 13 dígitos <input type="text" inputmode="numeric" maxlength="13" id="gin" style="width:190px" value="4006381333931"></label><button class="btn sm" id="gbad">Probar con un error de digitación</button></div><div class="fb" id="gout"></div><hr><p><b>'+ex.task+'</b></p><div class="row"><label>Dígito verificador <input type="text" inputmode="numeric" id="gans" style="width:70px"></label><button class="btn pri sm" id="gchk">Comprobar</button><span class="fb" id="gfb"></span></div>');
  var inp=$('#gin',box),out=$('#gout',box);
  function upd(){var v=inp.value.replace(/\D/g,'');if(v.length!==13){out.className='fb';out.textContent='Escribe 13 dígitos ('+v.length+' hasta ahora).';return}
    var c=gtinCheck(v),ok=c===+v[12];var terms=[];for(var i=0;i<12;i++)terms.push(v[i]+'×'+(i%2===0?1:3));
    out.className='fb '+(ok?'ok':'bad');out.innerHTML=(ok?'Válido. ':'Inválido. ')+'Suma ponderada de los 12 primeros dígitos = '+(function(){var s=0;for(var i=0;i<12;i++)s+=(+v[i])*(i%2===0?1:3);return s})()+'. Dígito verificador esperado: <b>'+c+'</b>, tú escribiste '+v[12]+'.<br><span class="small">'+terms.join(' + ')+'</span>'}
  inp.oninput=upd;upd();
  $('#gbad',box).onclick=function(){inp.value='4006381333913';upd()};
  var exp=gtinCheck(ex.base);
  $('#gchk',box).onclick=function(){var v=$('#gans',box).value.trim(),f=$('#gfb',box);if(v===String(exp)){f.className='fb ok';f.textContent='Correcto. Código completo: '+ex.base+exp}else{f.className='fb bad';f.textContent='No. Pesos 1 y 3 alternados, empezando por 1 en la primera posición.'}};
}
function exFlash(ex,box){
  var i=0,shown=false;
  addHtml(box,'<p>'+ex.intro+'</p><div class="flash" id="fc"></div><div class="row"><button class="btn sm" id="fprev">Anterior</button><button class="btn pri sm" id="fshow">Ver estructura de respuesta</button><button class="btn sm" id="fnext">Siguiente</button><span class="small" id="fcnt"></span></div>');
  function paint(){var c=ex.cards[i];$('#fc',box).innerHTML='<h3>'+c.q+'</h3>'+(shown?'<div>'+c.a+'</div>':'<p class="small">Contesta en voz alta durante 60 segundos antes de mirar.</p>');$('#fcnt',box).textContent=(i+1)+' de '+ex.cards.length;$('#fshow',box).textContent=shown?'Ocultar':'Ver estructura de respuesta'}
  $('#fshow',box).onclick=function(){shown=!shown;paint()};
  $('#fnext',box).onclick=function(){i=(i+1)%ex.cards.length;shown=false;paint()};
  $('#fprev',box).onclick=function(){i=(i-1+ex.cards.length)%ex.cards.length;shown=false;paint()};
  paint();
}

var KIND={trigger:'Disparador',action:'Acción',cond:'Condición',loop:'Bucle',ctrl:'Control',end:'Resultado'};
function flowHtml(steps){
  return steps.map(function(s,i){return '<div class="fstep k-'+s.k+'"><button class="fhead" aria-expanded="false" data-i="'+i+'"><span class="fkind">'+KIND[s.k]+'</span><b>'+s.t+'</b></button><div class="fdet" hidden>'+s.d+'</div></div>'}).join('<div class="farrow" aria-hidden="true"></div>');
}
function exFlow(ex,box){
  var h='';if(ex.intro)h+='<p>'+ex.intro+'</p>';
  if(ex.recipes)h+='<div class="tabs">'+ex.recipes.map(function(r,i){return '<button class="tab'+(i===0?' on':'')+'" data-t="'+i+'">'+r.t+'</button>'}).join('')+'</div><p class="small" id="rdesc"></p>';
  h+='<div id="fl"></div><p class="small">Toca cada paso para ver su configuración.</p>';
  if(ex.task)h+='<p><b>'+ex.task+'</b></p><div class="row"><button class="btn sm" data-a="sol">Ver solución</button></div><div class="sol" hidden>'+ex.sol+'</div>';
  addHtml(box,h);
  function draw(steps){var f=$('#fl',box);f.innerHTML=flowHtml(steps);$$('.fhead',f).forEach(function(b){b.onclick=function(){var d=b.nextElementSibling;d.hidden=!d.hidden;b.setAttribute('aria-expanded',String(!d.hidden))}})}
  if(ex.recipes){var show=function(i){$('#rdesc',box).textContent=ex.recipes[i].d;draw(ex.recipes[i].steps);$$('.tab',box).forEach(function(b,j){b.classList.toggle('on',i===j)})};$$('.tab',box).forEach(function(b){b.onclick=function(){show(+b.getAttribute('data-t'))}});show(0)}
  else draw(ex.steps);
  var sb=$('[data-a=sol]',box);if(sb){var sd=$('.sol',box);sb.onclick=function(){sd.hidden=!sd.hidden;sb.textContent=sd.hidden?'Ver solución':'Ocultar solución'}}
}
function parseList(s){return s.split(/[\s;,]+/).map(parseN).filter(function(x){return !isNaN(x)})}
function exStats(ex,box){
  addHtml(box,'<p>'+ex.intro+'</p><textarea id="sin" style="min-height:64px">'+ex.sample+'</textarea><div class="row">'+(ex.loaders||[]).map(function(l,i){return '<button class="btn sm" data-l="'+i+'">'+l.t+'</button>'}).join('')+'</div><div id="sout" class="nolink"></div>');
  var ta=$('#sin',box);
  function upd(){var a=parseList(ta.value),o=$('#sout',box);if(a.length<2){o.innerHTML='<p class="small">Escribe al menos 2 números separados por coma, espacio o salto de línea.</p>';return}
    var q1=pctl(a,.25),q3=pctl(a,.75),iqr=q3-q1,lo=q1-1.5*iqr,hi=q3+1.5*iqr,out=a.filter(function(x){return x<lo||x>hi}),m=mean(a),sd=sdS(a);
    var s=sortedNums(a),mn=s[0],mx=s[s.length-1],bins=8,w=(mx-mn)/bins||1,cnt=[];for(var i=0;i<bins;i++)cnt.push(0);a.forEach(function(x){var k=Math.min(bins-1,Math.floor((x-mn)/w));cnt[k]++});
    function k(v,l){return '<div class="kpi"><b>'+v+'</b><span>'+l+'</span></div>'}
    o.innerHTML='<div class="kpis">'+k(a.length,'n')+k(fmt(m),'Media')+k(fmt(median(a)),'Mediana')+k(fmt(pctl(a,.9)),'Percentil 90')+k(fmt(sd,2),'Desv. estándar (muestral)')+k(m?fmt(100*sd/m):'—','Coef. de variación %')+k(fmt(q1)+' a '+fmt(q3),'Q1 a Q3')+k(fmt(mn)+' / '+fmt(mx),'Mín / Máx')+'</div><p class="small">Atípicos (regla 1,5 × RIQ, límites '+fmt(lo)+' a '+fmt(hi)+'): '+(out.length?out.map(function(x){return fmt(x)}).join(', '):'ninguno')+'</p><div class="bars">'+cnt.map(function(c,i){var mxc=Math.max.apply(null,cnt);return '<span>'+fmt(mn+i*w,0)+' a '+fmt(mn+(i+1)*w,0)+'</span><div class="bar"><i style="width:'+(100*c/mxc)+'%"></i></div><b>'+c+'</b>'}).join('')+'</div>';
  }
  ta.oninput=upd;$$('[data-l]',box).forEach(function(b){b.onclick=function(){ta.value=ex.loaders[+b.getAttribute('data-l')].f();upd()}});upd();
}
function exCheck(ex,box){
  var key='chk_'+ex.id;S[key]=S[key]||[];
  var h=(ex.intro?'<p>'+ex.intro+'</p>':'')+'<div class="checks">'+ex.items.map(function(t,i){return '<label class="chk"><input type="checkbox" data-c="'+i+'"'+(S[key][i]?' checked':'')+'><span>'+t+'</span></label>'}).join('')+'</div><p class="small" id="cprog"></p>';
  addHtml(box,h);
  function upd(){var n=S[key].filter(Boolean).length;$('#cprog',box).textContent=n+' de '+ex.items.length+' listos'}
  $$('[data-c]',box).forEach(function(c){c.onchange=function(){S[key][+c.getAttribute('data-c')]=c.checked;save();upd()}});upd();
}

function exIdeas(ex,box){
  var areas=[];ex.ideas.forEach(function(i){if(areas.indexOf(i.area)<0)areas.push(i.area)});
  addHtml(box,'<p>'+ex.intro+'</p><div class="row"><label>Área <select id="ia"><option>Todas</option>'+areas.map(function(a){return '<option>'+a+'</option>'}).join('')+'</select></label><label>Nivel <select id="in2"><option value="">Todos</option><option value="1">1 Básico</option><option value="2">2 Intermedio</option><option value="3">3 Avanzado</option><option value="4">4 Requiere permisos o licencias</option></select></label></div><p class="small" id="icount"></p><div id="ilist" class="nolink"></div>');
  function draw(){
    var a=$('#ia',box).value,n=$('#in2',box).value;
    var L=ex.ideas.filter(function(i){return (a==='Todas'||i.area===a)&&(!n||String(i.n)===n)});
    $('#icount',box).textContent=L.length+' ideas';
    $('#ilist',box).innerHTML=L.map(function(i){return '<details class="idea"><summary><b>'+i.t+'</b><span class="chips"><span class="chip">'+i.area+'</span><span class="chip">Nivel '+i.n+'</span><span class="chip'+(i.lic==='estándar'?'':' warn')+'">'+i.lic+'</span></span></summary><div class="ibody"><p><b>Problema.</b> '+i.p+'</p><p><b>Disparador.</b> '+i.tr+'</p><p><b>Acciones.</b></p><ol>'+i.ac.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ol><p><b>Conectores.</b> '+i.co+'</p><p><b>Cómo medir el ahorro.</b> '+i.m+'</p></div></details>'}).join('');
  }
  $$('select',box).forEach(function(s){s.onchange=draw});draw();
}
function exFc(ex,box){
  addHtml(box,'<p>'+ex.intro+'</p><textarea id="fin" style="min-height:64px">'+ex.sample+'</textarea><div class="row"><label>Método <select id="fm2"><option value="ma">Promedio móvil</option><option value="ses">Suavizamiento exponencial simple</option></select></label><label>Parámetro <input type="number" id="fp2" step="any" value="3" style="width:90px"></label></div><p class="small" id="fhint"></p><div id="fout" class="nolink"></div>');
  function upd(){
    var a=parseList($('#fin',box).value),m=$('#fm2',box).value,pv=parseFloat($('#fp2',box).value),o=$('#fout',box);
    $('#fhint',box).textContent=m==='ma'?'Parámetro = periodos a promediar (entero de 1 en adelante).':'Parámetro = α entre 0 y 1. Más alto reacciona más rápido, con más ruido. El nivel inicial es el primer dato.';
    if(a.length<4||!(pv>0)){o.innerHTML='<p class="small">Escribe al menos 4 valores y un parámetro válido.</p>';return}
    var r=m==='ma'?maFc(a,Math.max(1,Math.min(a.length-1,Math.round(pv)))):sesFc(a,Math.min(1,pv));
    var er=fcErr(a,r.f);
    o.innerHTML='<div class="kpis"><div class="kpi"><b>'+fmt(r.next)+'</b><span>Pronóstico del próximo periodo</span></div><div class="kpi"><b>'+fmt(er.mae)+'</b><span>Error absoluto medio (MAE)</span></div><div class="kpi"><b>'+(isNaN(er.mape)?'—':fmt(er.mape)+'%')+'</b><span>MAPE</span></div><div class="kpi"><b>'+fmt(er.bias)+'</b><span>Sesgo (real − pronóstico)</span></div></div>'+T(['Periodo','Real','Pronóstico'],a.map(function(x,i){return [i+1,fmt(x),r.f[i]==null?'—':fmt(r.f[i])]}),[0,1,2]);
  }
  $('#fin',box).oninput=upd;$('#fp2',box).oninput=upd;
  $('#fm2',box).onchange=function(){$('#fp2',box).value=this.value==='ma'?3:0.3;upd()};
  upd();
}
function copyFrom(ta,f,txt){
  function fb(){ta.focus();ta.select();try{if(document.execCommand('copy')){f.className='fb ok';f.textContent='Copiado';return}}catch(e){}f.className='fb';f.textContent='Texto seleccionado: pulsa copiar en tu teclado.'}
  try{navigator.clipboard.writeText(txt).then(function(){f.className='fb ok';f.textContent='Copiado'},fb)}catch(e){fb()}
}
function packState(){var o={v:2,done:S.done,quiz:S.quiz,notes:S.notes,last:S.last,ex:S.ex,checks:{}};for(var k in S){if(k.indexOf('chk_')===0)o.checks[k]=S[k]}return btoa(unescape(encodeURIComponent(JSON.stringify(o))))}
function openProgress(){
  $('#modal').innerHTML='<h2 style="margin-bottom:8px">Tu progreso</h2><p>Copia este código y pégalo en el otro dispositivo. Para importar, pega un código en el cuadro y pulsa «Importar». La importación suma los capítulos completados y no borra los que ya tienes.</p><textarea id="pcode" style="min-height:120px;font:12px ui-monospace,Consolas,monospace"></textarea><div class="row"><button class="btn sm" id="pcopy">Copiar mi código</button><button class="btn pri sm" id="pimp">Importar</button><button class="btn sm" id="pclose">Cerrar</button></div><p class="fb" id="pfb"></p>';
  var ta=$('#pcode'),code=packState(),f=$('#pfb');ta.value=code;
  $('#pclose').onclick=closeOv;
  $('#pcopy').onclick=function(){ta.value=code;copyFrom(ta,f,code)};
  $('#pimp').onclick=function(){
    try{
      var o=JSON.parse(decodeURIComponent(escape(atob(ta.value.trim()))));
      if(!o||o.v!==2||typeof o.done!=='object')throw 1;
      var k;for(k in o.done)S.done[k]=1;
      for(k in (o.quiz||{}))if(S.quiz[k]==null)S.quiz[k]=o.quiz[k];
      if(o.notes&&o.notes.caso&&!S.notes.caso)S.notes.caso=o.notes.caso;
      for(k in (o.checks||{})){var cur2=S[k]||[];o.checks[k].forEach(function(v,i){if(v)cur2[i]=true});S[k]=cur2}
      for(k in (o.ex||{}))if(!S.ex[k])S.ex[k]=o.ex[k];
      if(o.last&&!S.last)S.last=o.last;
      save();f.className='fb ok';f.textContent='Importado';route();
    }catch(e){f.className='fb bad';f.textContent='Ese código no es válido. Cópialo completo.'}
  };
  $('#ov').hidden=false;
}

/* ---------- widgets de gestión operativa ---------- */
function exCat(ex,box){
  var cats=[];ex.items.forEach(function(i){if(cats.indexOf(i.cat)<0)cats.push(i.cat)});
  addHtml(box,'<p>'+ex.intro+'</p><div class="row"><label>Categoría <select id="ca"><option>Todas</option>'+cats.map(function(c){return '<option>'+c+'</option>'}).join('')+'</select></label><label class="chk"><input type="checkbox" id="cp"><span>Modo práctica: piensa tu respuesta y luego revela cada campo</span></label></div><p class="small" id="ccount"></p><div id="clist" class="nolink"></div>');
  function fields(i){return [['Causa probable',i.causa],['Impacto',i.impacto],['Qué investigar','<ol>'+i.invest.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ol>'],['Responsable probable',i.resp+' (apoyo: '+i.apoyo+')'],['KPI afectado',i.kpi],['Acción inmediata',i.accion]]}
  function draw(){
    var c=$('#ca',box).value,pr=$('#cp',box).checked;
    var L=ex.items.filter(function(i){return c==='Todas'||i.cat===c});
    $('#ccount',box).textContent=L.length+' situaciones';
    $('#clist',box).innerHTML=L.map(function(i){return '<details class="idea"><summary><b>'+i.t+'</b><span class="chips"><span class="chip">'+i.cat+'</span><span class="chip">KPI: '+i.kpi+'</span></span></summary><div class="ibody">'+fields(i).map(function(f){return pr?'<div class="pf"><button type="button" class="btn sm" data-pf="1">Ver: '+f[0]+'</button><div class="pfv" hidden><b>'+f[0]+'.</b> '+f[1]+'</div></div>':'<p><b>'+f[0]+'.</b> '+f[1]+'</p>'}).join('')+'</div></details>'}).join('');
  }
  $('#ca',box).onchange=draw;$('#cp',box).onchange=draw;
  $('#clist',box).addEventListener('click',function(ev){var b=ev.target.closest('[data-pf]');if(b){var v=b.nextElementSibling;v.hidden=!v.hidden}});
  draw();
}
function exRoute(ex,box){
  var opts='<option value="">Elige</option>'+ex.areas.map(function(a){return '<option>'+a+'</option>'}).join('');
  addHtml(box,'<p>'+ex.intro+'</p>'+ex.items.map(function(it,i){return '<div class="rt"><p><b>'+it.t+'</b></p><div class="row"><label>Responsable probable <select data-rr="'+i+'">'+opts+'</select></label><label>Apoyo <select data-ra="'+i+'">'+opts+'</select></label></div><div class="rfb" data-rf="'+i+'"></div></div>'}).join('')+'<div class="row"><button class="btn pri sm" data-a="chk">Comprobar</button><span class="fb" id="rsum"></span></div><p class="small">En cada empresa la organización varía: lo que importa es el razonamiento y la información que entregas.</p>');
  $('[data-a=chk]',box).onclick=function(){
    var pts=0,tot=ex.items.length*2;
    ex.items.forEach(function(it,i){
      var r=$('[data-rr="'+i+'"]',box).value,a=$('[data-ra="'+i+'"]',box).value,f=$('[data-rf="'+i+'"]',box);
      var okr=it.r.indexOf(r)>-1,oka=it.a.indexOf(a)>-1;pts+=(okr?1:0)+(oka?1:0);
      f.innerHTML='<p class="fb"><span class="'+(okr?'ok':'bad')+'">Responsable: '+(okr?'bien':'sugerido '+it.r[0])+'.</span> <span class="'+(oka?'ok':'bad')+'">Apoyo: '+(oka?'bien':'sugerido '+it.a[0])+'.</span></p><p class="small"><b>Información que entregas:</b> '+it.info+' <b>Por qué:</b> '+it.why+'</p>';
    });
    var s=$('#rsum',box);s.className='fb '+(pts>=tot*0.75?'ok':'bad');s.textContent=pts+' de '+tot+' aciertos';
  };
}
function exTriage(ex,box){
  function sel(name,i,list){return '<label>'+name+' <select data-t="'+name+'" data-i2="'+i+'"><option value="">Elige</option>'+list.map(function(x){return '<option>'+x+'</option>'}).join('')+'</select></label>'}
  addHtml(box,'<p>'+ex.intro+'</p>'+ex.inc.map(function(x,i){
    return '<div class="tri"><p class="trih"><b>'+x.id+'</b> · '+x.pedido+' · Estado: '+x.estado+' · Antigüedad: '+x.aging+' h · SLA vence en: '+x.sla+' h</p><p>'+x.prob+' <span class="small">Tienda: '+x.tienda+'. Stock sistema: '+x.sis+'. Stock físico: '+x.fis+'.'+(x.nota?' '+x.nota:'')+'</span></p><div class="row">'+sel('Tipo',i,ex.tipos)+sel('Severidad',i,ex.sevs)+sel('Acción',i,ex.accs)+sel('Responsable',i,ex.resps)+'</div><div class="row"><label class="chk"><input type="checkbox" data-top="'+i+'"><span>La atendería entre las primeras 3</span></label></div><div class="trf" data-trf="'+i+'"></div></div>';
  }).join('')+'<div class="row"><button class="btn pri sm" data-a="chk">Comprobar mis decisiones</button></div><div class="sol" id="trsum" hidden></div>');
  $('[data-a=chk]',box).onclick=function(){
    var ok=0,tot=ex.inc.length*4,fails={};
    ex.inc.forEach(function(x,i){
      var vals={Tipo:'',Severidad:'',Acción:'',Responsable:''};var keys={Tipo:x.k[0],Severidad:x.k[1],'Acción':x.k[2],Responsable:x.k[3]};
      var line=[];
      Object.keys(keys).forEach(function(n){var v=$('[data-t="'+n+'"][data-i2="'+i+'"]',box).value,acc=(keys[n]||'').split('|'),g=acc.indexOf(v)>-1;if(g)ok++;else fails[n]=(fails[n]||0)+1;line.push('<span class="'+(g?'ok':'bad')+'">'+n+': '+(g?'bien':'sugerido '+acc[0])+'</span>')});
      $('[data-trf="'+i+'"]',box).innerHTML='<p class="fb">'+line.join(' · ')+'</p><p class="small"><b>Razonamiento:</b> '+x.why+'</p>';
    });
    var picked=ex.inc.map(function(x,i){return $('[data-top="'+i+'"]',box).checked?x.id:null}).filter(Boolean);
    var hit=picked.filter(function(id){return ex.top.indexOf(id)>-1}).length;
    var weak=Object.keys(fails).sort(function(a,b){return fails[b]-fails[a]});
    var s=$('#trsum',box);s.hidden=false;
    s.innerHTML='<p><b>Decisiones correctas: '+ok+' de '+tot+' ('+Math.round(100*ok/tot)+'%).</b> '+(weak.length?'Donde más fallaste: '+weak.map(function(n){return n+' ('+fails[n]+')'}).join(', ')+'.':'')+'</p><p><b>Priorización:</b> marcaste '+picked.length+' incidencias y acertaste '+hit+' de las 3 más urgentes. Las más urgentes según el modelo: '+ex.top.join(', ')+'. '+ex.topwhy+'</p>';
  };
}
function exScenario(ex,box){
  var cases=ex.cases;
  var tabs=cases.length>1?'<div class="tabs">'+cases.map(function(c,i){return '<button type="button" class="tab'+(i===0?' on':'')+'" data-cs="'+i+'">'+c.t+'</button>'}).join('')+'</div>':'';
  function panel(c,ci){
    return '<div class="scp" data-sp="'+ci+'"'+(ci?' hidden':'')+'><div class="pe" style="margin-top:8px"><h3>'+c.t+'</h3>'+c.sit+'</div>'+c.steps.map(function(s,si){
      return '<div class="scs" data-ss="'+ci+'-'+si+'"'+(si?' hidden':'')+'><p><b>Paso '+(si+1)+' de '+c.steps.length+'.</b> '+s.q+'</p>'+s.o.map(function(o,oi){return '<label class="opt2"><input type="radio" name="c'+ci+'s'+si+'" value="'+oi+'" data-c="'+ci+'" data-s="'+si+'"><span>'+o.t+'</span></label>'}).join('')+'<div class="fb2" data-fb="'+ci+'-'+si+'" hidden></div></div>';
    }).join('')+'<div class="sol" data-end="'+ci+'" hidden></div></div>';
  }
  addHtml(box,'<p>'+ex.intro+'</p>'+tabs+cases.map(panel).join(''));
  $$('[data-cs]',box).forEach(function(b){b.onclick=function(){var k=b.getAttribute('data-cs');$$('[data-cs]',box).forEach(function(x){x.classList.toggle('on',x===b)});$$('[data-sp]',box).forEach(function(p){p.hidden=p.getAttribute('data-sp')!==k})}});
  $$('input[type=radio]',box).forEach(function(r){r.addEventListener('change',function(){
    if(!r.checked)return;
    var ci=+r.getAttribute('data-c'),si=+r.getAttribute('data-s'),c=cases[ci],o=c.steps[si].o[+r.value];
    var fb=$('[data-fb="'+ci+'-'+si+'"]',box);fb.hidden=false;fb.className='fb2 p'+o.p;fb.innerHTML='<b>'+(o.p===2?'Buena decisión.':(o.p===1?'Aceptable, con reservas.':'Mejorable.'))+'</b> '+o.f;
    var next=$('[data-ss="'+ci+'-'+(si+1)+'"]',box);if(next)next.hidden=false;
    var done=c.steps.every(function(s,k){return $('input[name="c'+ci+'s'+k+'"]:checked',box)});
    if(done){var pts=0,max=c.steps.length*2;c.steps.forEach(function(s,k){var ch=$('input[name="c'+ci+'s'+k+'"]:checked',box);pts+=s.o[+ch.value].p});
      var end=$('[data-end="'+ci+'"]',box);end.hidden=false;end.innerHTML='<p><b>Puntaje del caso: '+pts+' de '+max+'.</b></p>'+c.cierre}
  })});
}
function exOpenCase(ex,box){
  var key='open_'+ex.id;
  addHtml(box,'<div class="pe"><h3>Caso abierto</h3>'+ex.sit+'</div><p><b>'+ex.task+'</b></p><textarea id="ocin_'+ex.id+'" style="min-height:170px" placeholder="Escribe tu respuesta como si se la explicaras a tu jefe. No hay una única respuesta correcta.">'+esc(S.notes[key]||'')+'</textarea><p class="small">No se te evalúa automáticamente: escribe tu respuesta con calma, y recién después compárala con la pauta. No la leas antes de intentarlo — pierdes el ejercicio.</p><div class="row"><button class="btn pri sm" data-a="ocsol">Ver pauta esperada</button></div><div class="sol" hidden></div>');
  var ta=$('#ocin_'+ex.id,box);
  ta.oninput=function(){S.notes[key]=ta.value;save()};
  var b=$('[data-a=ocsol]',box),s=$('.sol',box);
  b.onclick=function(){
    if(s.hidden){
      s.innerHTML='<p class="small">Compárala con la tuya; no es una lista de requisitos exactos, es lo que un entrevistador esperaría escuchar en algún orden.</p><ul>'+ex.pautas.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>'+(ex.modelo?'<p><b>Ejemplo de cómo sonaría.</b> '+ex.modelo+'</p>':'');
      s.hidden=false;b.textContent='Ocultar pauta';
    }else{s.hidden=true;b.textContent='Ver pauta esperada'}
  };
}
function labWidget(lab){
  var h='<div class="lab"><h3>'+lab.t+'</h3><div class="row">'+lab.fields.map(function(f){return '<label>'+f.l+' <input type="number" step="any" data-k="'+f.k+'" value="'+f.v+'" style="width:100px"></label>'}).join('')+'</div><div class="row" data-out></div></div>';
  var el=E(h);
  function upd(){var v={};$$('input',el).forEach(function(i){v[i.getAttribute('data-k')]=parseFloat(i.value)||0});
    $('[data-out]',el).innerHTML=lab.out.map(function(o){var x=o.f(v);return '<span class="kpi" style="min-width:130px"><b>'+(isFinite(x)?fmt(x,o.d==null?1:o.d):'—')+(o.u||'')+'</b><span>'+o.l+'</span></span>'}).join('')}
  $$('input',el).forEach(function(i){i.oninput=upd});upd();return el;
}

/* ---------- repaso ---------- */
function renderQuiz(c,box){
  c.quiz.forEach(function(q,qi){
    var key=c.id+'.'+qi;
    var d=E('<div class="q"><p>'+(qi+1)+'. '+q.q+'</p>'+q.o.map(function(o,oi){return '<button class="opt" data-o="'+oi+'">'+o+'</button>'}).join('')+'<p class="why" hidden></p></div>');
    function paint(){var a=S.quiz[key];if(a==null)return;$$('.opt',d).forEach(function(b,oi){b.disabled=true;if(oi===q.a)b.classList.add('right');else if(oi===a)b.classList.add('wrong')});var w=$('.why',d);w.hidden=false;w.innerHTML=(a===q.a?'<span class="ok">Correcto. </span>':'<span class="bad">No era esa. </span>')+q.w}
    $$('.opt',d).forEach(function(b){b.onclick=function(){if(S.quiz[key]!=null)return;S.quiz[key]=+b.getAttribute('data-o');save();paint()}});
    box.appendChild(d);paint();
  });
}

/* ---------- caso final ---------- */
function exCase(ex,box){
  var per={'Todo el período':function(r){return true},'1 al 7 de septiembre':function(r){return r.fecha<'2026-09-08'},'8 al 14 de septiembre':function(r){return r.fecha>='2026-09-08'}};
  function opts(arr){return '<option>Todas</option>'+arr.map(function(a){return '<option>'+a+'</option>'}).join('')}
  var tiendas=['Surco','San Miguel','Los Olivos','Chorrillos','Seller'],cats=['Tecnología','Hogar','Moda','Belleza'],mods=['Domicilio','Retiro en tienda','Mismo día'];
  addHtml(box,'<p>'+ex.intro+'</p><div class="row"><label>Período <select id="fp">'+Object.keys(per).map(function(k){return '<option>'+k+'</option>'}).join('')+'</select></label><label>Tienda <select id="ft">'+opts(tiendas)+'</select></label><label>Categoría <select id="fc2">'+opts(cats)+'</select></label><label>Modalidad <select id="fm">'+opts(mods)+'</select></label></div><div id="cout" class="nolink"></div>');
  function bars(items,red){var mx=Math.max.apply(null,items.map(function(i){return i[1]}).concat([1]));return '<div class="bars">'+items.map(function(i){return '<span>'+i[0]+'</span><div class="bar"><i class="'+(red?'red':'')+'" style="width:'+(100*i[1]/mx)+'%"></i></div><b>'+i[2]+'</b>'}).join('')+'</div>'}
  function upd(){
    var fp=per[$('#fp',box).value],ft=$('#ft',box).value,fc=$('#fc2',box).value,fm=$('#fm',box).value;
    var rs=DATA.filter(function(r){return fp(r)&&(ft==='Todas'||r.tienda===ft)&&(fc==='Todas'||r.categoria===fc)&&(fm==='Todas'||r.modalidad===fm)});
    if(!rs.length){$('#cout',box).innerHTML='<p class="bad">Sin pedidos con ese filtro.</p>';return}
    var bt=K.by(rs,'tienda'),tk=Object.keys(bt).sort();
    var mot={};K.can(rs).forEach(function(r){mot[r.motivo]=(mot[r.motivo]||0)+1});
    var mk=Object.keys(mot).sort(function(a,b){return mot[b]-mot[a]});
    var bd=K.by(rs,'fecha'),dk=Object.keys(bd).sort();
    var h='<div class="kpis"><div class="kpi"><b>'+rs.length+'</b><span>Pedidos</span></div><div class="kpi"><b>'+fmt(K.ontime(rs))+'%</b><span>On Time (sobre entregados)</span></div><div class="kpi"><b>'+fmt(K.cancelPct(rs))+'%</b><span>Cancelación (sobre creados)</span></div><div class="kpi"><b>'+fmt(K.fill(rs))+'%</b><span>Fill Rate (unidades)</span></div><div class="kpi"><b>'+fmt(K.otif(rs))+'%</b><span>OTIF (sobre entregados)</span></div></div>';
    h+='<h3>On Time por tienda</h3>'+bars(tk.map(function(t){var v=K.ontime(bt[t]);return [t+' ('+bt[t].length+')',v,fmt(v)+'%']}));
    h+='<h3>Cancelaciones por motivo</h3>'+(mk.length?bars(mk.map(function(m){return [m,mot[m],mot[m]]}),true):'<p class="small">No hay cancelaciones con este filtro.</p>');
    h+='<h3>Cancelación % por tienda y categoría (usa período y modalidad)</h3>';
    var base=DATA.filter(function(r){return fp(r)&&(fm==='Todas'||r.modalidad===fm)});
    h+=T(['Tienda'].concat(cats),tiendas.map(function(t){return [t].concat(cats.map(function(c2){var x=base.filter(function(r){return r.tienda===t&&r.categoria===c2});return x.length?fmt(K.cancelPct(x))+'% <span class="small">('+x.length+')</span>':'—'}))}),[1,2,3,4]);
    h+='<h3>Por día</h3>'+T(['Fecha','Pedidos','On Time %','Cancelación %'],dk.map(function(d){return [d,bd[d].length,fmt(K.ontime(bd[d])),fmt(K.cancelPct(bd[d]))]}),[1,2,3]);
    $('#cout',box).innerHTML=h;
  }
  $$('select',box).forEach(function(s){s.onchange=upd});upd();
  addHtml(box,'<h3>Preguntas del caso</h3>');
  var q=document.createElement('div');box.appendChild(q);var ex2={};for(var kk in ex)ex2[kk]=ex[kk];ex2.intro='';exCalc(ex2,q);
  var note=S.notes.caso||ex.template;
  addHtml(box,'<h3>Tu reporte para el jefe de operaciones</h3><p class="small">Escríbelo en 6 bloques. Se guarda en este navegador.</p><textarea id="rep" style="min-height:230px"></textarea><div class="row"><button class="btn sm" id="repsol">Ver reporte modelo</button></div><div class="sol" id="repm" hidden></div>');
  var ta=$('#rep',box);ta.value=note;ta.oninput=function(){S.notes.caso=ta.value;save()};
  $('#repsol',box).onclick=function(){var m=$('#repm',box);m.innerHTML=ex.model();m.hidden=!m.hidden};
}


/* ---------- pistas graduales y ejemplos resueltos (a partir del glosario) ---------- */
var EJ={
  ontime:'Ejemplo: de 40 pedidos entregados, 34 llegaron dentro de la promesa → On Time % = 34/40 × 100 = 85%.',
  cancel:'Ejemplo: se crearon 250 pedidos y 18 se cancelaron → Cancelación % = 18/250 × 100 = 7,2%.',
  fillrate:'Ejemplo: se pidieron 120 unidades y se entregaron 111 → Fill Rate = 111/120 × 100 = 92,5%.',
  otif:'Ejemplo: de 40 pedidos entregados, 30 llegaron a tiempo y completos → OTIF = 30/40 × 100 = 75%.',
  nps:'Ejemplo: de 100 respuestas, 55 promotores, 30 pasivos y 15 detractores → NPS = 55 − 15 = 40.',
  ticket:'Ejemplo: 20 pedidos entregados suman S/ 4 800 → Ticket promedio = 4800/20 = S/ 240.',
  conversion:'Ejemplo: 2 000 visitas generaron 60 compras → Conversión = 60/2000 × 100 = 3%.',
  margen:'Ejemplo: precio S/ 150, costo S/ 95 → Margen bruto = 150 − 95 = S/ 55.',
  promocion:'Ejemplo: precio regular S/ 200, precio promo S/ 150 → Descuento % = (200−150)/200 × 100 = 25%.',
  rotacion:'Ejemplo: costo de ventas del año S/ 480 000, inventario promedio S/ 60 000 → Rotación = 480000/60000 = 8 veces al año.',
  diasinv:'Ejemplo: con una rotación de 8 → Días de inventario = 365/8 ≈ 45,6 días.',
  cobertura:'Ejemplo: stock de 300 unidades, demanda diaria de 25 → Cobertura = 300/25 = 12 días.',
  eoq:'Ejemplo: demanda anual D=2400, costo de emitir un pedido S=S/ 50, costo de mantener H=S/ 4 por unidad al año → EOQ = √(2×2400×50/4) = √60000 ≈ 245 unidades.',
  ss:'Ejemplo: z=1,65 (95% de servicio), σd=8 unidades/día, lead time L=4 días → SS = 1,65 × 8 × √4 ≈ 26,4, redondea a 27 unidades.',
  rop:'Ejemplo: demanda diaria 30, lead time 5 días, stock de seguridad 27 → ROP = 30×5+27 = 177 unidades.',
  ocupacion:'Ejemplo: 380 ubicaciones ocupadas de 500 totales → Ocupación = 380/500 × 100 = 76%.',
  lph:'Ejemplo: un picker preparó 96 unidades en 8 horas → UPH = 96/8 = 12 unidades por hora.',
  ira:'Ejemplo: de 200 SKU contados, 184 no tuvieron diferencia → IRA = 184/200 × 100 = 92%.',
  dockstock:'Ejemplo: la mercadería llegó a las 09:00 y quedó disponible para vender a las 13:30 → Dock-to-stock = 4,5 horas.',
  error:'Ejemplo: se prepararon 500 pedidos y 6 tuvieron un ítem equivocado → Tasa de error = 6/500 × 100 = 1,2%.',
  scorecard:'Ejemplo: On Time 90% (peso 40%), Fill Rate 95% (peso 30%), errores bajos 98% (peso 30%) → Puntaje = 90×0,4 + 95×0,3 + 98×0,3 = 93,9.',
  costopedido:'Ejemplo: S/ 45 000 de costos logísticos del mes entre 3 000 pedidos → Costo por pedido = 45000/3000 = S/ 15.',
  contribucion:'Ejemplo: margen bruto de un pedido S/ 60, costo por pedido S/ 15 → Contribución = 60 − 15 = S/ 45.',
  comision:'Ejemplo: venta de S/ 300 con comisión de marketplace de 15% → Liquidación neta = 300×(1−0,15) = S/ 255.',
  xyz:'Ejemplo: demanda media 100 con desviación estándar 15 → CV = 15/100 = 0,15 (15%, clase X: estable).',
  cv:'Ejemplo: demanda media 100 con desviación estándar 15 → CV = 15/100 = 0,15 (15%).',
  margenerror:'Ejemplo: On Time de 85% sobre una muestra de 200 pedidos → margen ≈ 1,96×√(0,85×0,15/200) ≈ 4,9 puntos porcentuales.',
  control:'Ejemplo: On Time diario promedio 82% con desviación estándar 5 → LCL = 82−3×5 = 67%, UCL = 82+3×5 = 97%.',
  ses:'Ejemplo: nivel anterior 120, dato nuevo 140, α=0,3 → Nivel nuevo = 0,3×140 + 0,7×120 = 126.',
  tiemporest:'Ejemplo: el SLA total de ese tipo de incidencia es 240 minutos y ya lleva 95 minutos abierta → Tiempo restante = 240−95 = 145 minutos.'
};
function matchTerms(text){
  var out=[],seen={};if(!text||!GRE)return out;
  GRE.lastIndex=0;var m;
  while((m=GRE.exec(text))){var ent=GMAP[m[0].toLowerCase()];if(ent&&!seen[ent.g.k]){seen[ent.g.k]=1;out.push(ent.g)}}
  return out;
}
function hintStage1(ex){
  var base=ex.cols?'Tabla con columnas: '+ex.cols.join(', ')+'. Ubica primero la fila o filas que cumplen la condición del enunciado.':(ex.data?'Usa los pedidos sintéticos: filtra primero por lo que pide el enunciado (tienda, categoría, fecha, modalidad, estado) antes de calcular.':'Relee el enunciado con calma: ¿qué te piden exactamente y con qué unidad?');
  return '<p><b>Pista 1.</b> '+base+'</p>';
}
function hintStage2(ex,parts){
  var lines=(parts||[ex]).map(function(p,i){
    var text=(p.l||'')+' '+(ex.task||'')+' '+(ex.intro||'');
    var forms=matchTerms(text).filter(function(g){return g.f});
    var lbl=(parts&&parts.length>1)?(i+1)+'. '+(p.l||''):'';
    if(forms.length)return '<p>'+(lbl?'<b>'+lbl+'</b> ':'')+forms.map(function(g){return g.t+': <code>'+esc(g.f)+'</code>'}).join(' · ')+'</p>';
    return '<p>'+(lbl?'<b>'+lbl+'</b> ':'')+'No calcules el número final todavía: separa qué va en el numerador y qué en el denominador (o si es una resta o multiplicación directa), y si el resultado es un porcentaje.</p>';
  });
  return '<p><b>Pista 2 — fórmula.</b></p>'+lines.join('');
}
function hintButtonHtml(){return '<button class="btn sm" data-a="hint">Pista</button>'}
function wireHint(box,ex,parts){
  var hbtn=$('[data-a=hint]',box);if(!hbtn)return;
  var hb=document.createElement('div');hb.className='hintbox';hb.hidden=true;hbtn.parentNode.insertBefore(hb,hbtn.nextSibling);
  var stage=0;
  hbtn.onclick=function(){
    stage=stage>=2?0:stage+1;
    if(stage===0){hb.hidden=true;hbtn.textContent='Pista'}
    else{hb.hidden=false;hb.innerHTML=stage===1?hintStage1(ex):hintStage1(ex)+hintStage2(ex,parts);hbtn.textContent=stage===1?'Otra pista':'Ocultar pista'}
  };
}
function workedExampleHtml(ex){
  var text=(ex.task||'')+' '+(ex.intro||'');
  var terms=matchTerms(text).filter(function(g){return EJ[g.k]});
  if(!terms.length)return '';
  return '<div class="workbox"><p><b>Ejemplo resuelto de referencia</b> (con números distintos a los de este ejercicio, solo para ver el método):</p>'+terms.slice(0,2).map(function(g){return '<p>'+EJ[g.k]+'</p>'}).join('')+'</div>';
}


var GBY={},GMAP={},GRE=null,LET=/[\p{L}\p{N}_]/u,curCh='';
(function(){
  var alts=[];
  GLOS.forEach(function(g){GBY[g.k]=g;g.a.forEach(function(a){GMAP[a.toLowerCase()]={g:g,orig:a};alts.push(a)})});
  alts.sort(function(x,y){return y.length-x.length});
  GRE=new RegExp('('+alts.map(function(a){return a.replace(/[.*+?^${}()|[\]\\\/]/g,'\\$&')}).join('|')+')','giu');
})();
var SKIPT={CODE:1,PRE:1,A:1,BUTTON:1,MARK:1,TEXTAREA:1,SELECT:1,OPTION:1,LABEL:1,SCRIPT:1,STYLE:1,H1:1,H2:1,H3:1,SUMMARY:1,INPUT:1,TH:1};
function skipNode(n){
  for(var p=n.parentNode;p&&p.nodeType===1;p=p.parentNode){
    if(SKIPT[p.tagName])return true;
    var cl=p.classList;if(cl&&(cl.contains('term')||cl.contains('chip')||cl.contains('crumb')||cl.contains('nolink')||cl.contains('timer')))return true;
    if(p.id==='main')break;
  }
  return false;
}
function linkTerms(root){
  if(!root||!GRE)return;
  var seen={};$$('.term',root).forEach(function(t){seen[t.getAttribute('data-g')]=1});
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),nodes=[],n;
  while((n=w.nextNode()))nodes.push(n);
  nodes.forEach(function(tn){
    var txt=tn.nodeValue;if(!txt||txt.trim().length<2||skipNode(tn))return;
    var ms=[],m;GRE.lastIndex=0;
    while((m=GRE.exec(txt))){
      var s=m.index,e2=s+m[0].length,ent=GMAP[m[0].toLowerCase()];
      if(!ent)continue;
      if(ent.g.cs&&m[0]!==ent.orig)continue;
      if(s>0&&LET.test(txt[s-1]))continue;
      var after=e2<txt.length?txt[e2]:'';
      if(after&&LET.test(after)){if(!ent.g.ns&&after==='s'&&(e2+1>=txt.length||!LET.test(txt[e2+1])))e2=e2+1;else continue}
      if(seen[ent.g.k])continue;
      seen[ent.g.k]=1;ms.push([s,e2,ent.g.k]);GRE.lastIndex=e2;
    }
    if(!ms.length)return;
    var frag=document.createDocumentFragment(),pos=0;
    ms.forEach(function(x){
      if(x[0]>pos)frag.appendChild(document.createTextNode(txt.slice(pos,x[0])));
      var b=document.createElement('button');b.type='button';b.className='term';b.setAttribute('data-g',x[2]);b.textContent=txt.slice(x[0],x[1]);frag.appendChild(b);pos=x[1];
    });
    if(pos<txt.length)frag.appendChild(document.createTextNode(txt.slice(pos)));
    tn.parentNode.replaceChild(frag,tn);
  });
}
function buildChips(){
  var sec=$('#tsec');if(!sec)return;
  var seen={},ks=[];
  $$('.goal .term,.body .term,.pe .term,#exbox .term').forEach(function(t){var k=t.getAttribute('data-g');if(!seen[k]){seen[k]=1;ks.push(k)}});
  if(!ks.length){sec.hidden=true;return}
  $('#tchips').innerHTML=ks.map(function(k){var g=GBY[k];return g?'<button type="button" class="term chipbtn" data-g="'+k+'">'+g.t+'</button>':''}).join('');
  sec.hidden=false;
}
var tip=null;
function hideTip(){if(tip)tip.hidden=true}
function showTip(btn){
  tip=tip||$('#tip');
  var g=GBY[btn.getAttribute('data-g')];if(!g)return;
  tip.innerHTML='<button class="tclose" aria-label="Cerrar">×</button><p class="tcat">'+g.cat+'</p><h3>'+g.t+'</h3><p>'+g.d+'</p>'+(g.f?'<p><b>Fórmula:</b> <code>'+esc(g.f)+'</code></p>':'')+'<p class="tlinks">'+(g.v?'<a href="#/'+g.v+'">Ver capítulo '+g.v+'</a> · ':'')+'<a href="#/glosario">Abrir glosario</a></p>';
  tip.hidden=false;
  if(window.innerWidth>900){
    var r=btn.getBoundingClientRect(),w=tip.offsetWidth||370,h=tip.offsetHeight||140;
    var left=Math.max(8,Math.min(r.left,window.innerWidth-w-8)),top=r.bottom+8;
    if(top+h>window.innerHeight-8)top=Math.max(8,r.top-h-8);
    tip.style.left=left+'px';tip.style.top=top+'px';tip.style.bottom='auto';tip.style.right='auto';
  }else{tip.style.left='';tip.style.top='';tip.style.right='';tip.style.bottom=''}
}
function renderGlossary(){
  cur='glosario';
  var cat='Todos',q='';
  main.innerHTML='<div class="wrap"><article class="chap"><p class="crumb">Glosario</p><h1>Glosario</h1><p class="meta">'+GLOS.length+' términos</p><p>Busca un término o filtra por tema. En los capítulos, los términos subrayados con puntos se pueden tocar para ver su definición.</p><input type="text" id="gq" placeholder="Buscar un término…" style="width:100%" autocomplete="off"><div class="gchips" id="gc"></div><p class="small" id="gn"></p><div id="glist" class="nolink"></div></article></div>';
  function draw(){
    var L=GLOS.filter(function(g){
      if(cat!=='Todos'&&g.cat!==cat)return false;
      if(!q)return true;
      var s=(g.t+' '+g.a.join(' ')+' '+g.d).toLowerCase();return s.indexOf(q)>-1;
    }).sort(function(a,b){return a.t.localeCompare(b.t,'es')});
    $('#gn').textContent=L.length+' términos';
    $('#glist').innerHTML=L.map(function(g){return '<div class="gitem"><h3>'+g.t+'</h3><p class="small">'+g.cat+'</p><p>'+g.d+'</p>'+(g.f?'<p><b>Fórmula:</b> <code>'+esc(g.f)+'</code></p>':'')+(g.v?'<p class="small"><a href="#/'+g.v+'">Ver capítulo '+g.v+'</a></p>':'')+'</div>'}).join('')||'<p>No hay resultados.</p>';
  }
  function chips(){$('#gc').innerHTML=['Todos'].concat(CATS).map(function(c){return '<button type="button" class="tab'+(c===cat?' on':'')+'" data-c="'+c+'">'+c+'</button>'}).join('');$$('#gc .tab').forEach(function(b){b.onclick=function(){cat=b.getAttribute('data-c');chips();draw()}})}
  $('#gq').oninput=function(){q=this.value.trim().toLowerCase();draw()};
  chips();draw();
}
document.addEventListener('click',function(ev){
  var t=ev.target.closest?ev.target.closest('.term'):null;
  if(t){ev.preventDefault();showTip(t);return}
  if(tip&&!tip.hidden){if(ev.target.closest&&ev.target.closest('.tclose')){hideTip();return}if(!ev.target.closest('#tip'))hideTip()}
});
document.addEventListener('keydown',function(ev){if(ev.key==='Escape')hideTip()});
try{new MutationObserver(function(list){
  list.forEach(function(r){r.addedNodes.forEach(function(n){
    var el=n.nodeType===1?n:n.parentElement;
    if(!el||(el.closest&&el.closest('.term')))return;
    linkTerms(el);
  })});
}).observe(main,{childList:true,subtree:true})}catch(err){}

/* ---------- respuestas del ejercicio ---------- */
var restoring=false;
function fieldsOf(box){return $$('input,select,textarea',box).filter(function(f){return f.id!=='rep'})}
function saveEx(c,src){
  if(restoring||curCh!==c.id)return;
  var box=$('#exbox');if(!box||(src&&src!==box))return;
  var st=S.ex[c.id]||(S.ex[c.id]={});
  st.f=fieldsOf(box).map(function(f){return (f.type==='checkbox'||f.type==='radio')?(f.checked?1:0):f.value});
  st.s=$$('.sol',box).map(function(s){return s.hidden?0:1});
  save();
}
function attachSave(c){
  var box=$('#exbox');if(!box)return;
  function later(){setTimeout(function(){saveEx(c,box)},0)}
  box.addEventListener('input',later);box.addEventListener('change',later);
  box.addEventListener('click',function(ev){
    var b=ev.target.closest?ev.target.closest('[data-a=chk]'):null;
    if(b&&!restoring){var i=$$('[data-a=chk]',box).indexOf(b),st=S.ex[c.id]||(S.ex[c.id]={});st.k=st.k||[];if(i>-1&&st.k.indexOf(i)<0)st.k.push(i)}
    later();
  });
}
function restoreEx(c){
  var st=S.ex[c.id];if(!st||!st.f)return;
  var box=$('#exbox');if(!box)return;
  restoring=true;
  var fs=fieldsOf(box);
  function setAll(){st.f.forEach(function(v,i){var f=fs[i];if(!f)return;if(f.type==='checkbox'||f.type==='radio')f.checked=!!v;else f.value=v})}
  setAll();
  fs.forEach(function(f){f.dispatchEvent(new Event(f.tagName==='SELECT'||f.type==='checkbox'||f.type==='radio'?'change':'input',{bubbles:true}))});
  setAll();
  fs.forEach(function(f){if(f.tagName!=='SELECT'&&f.type!=='checkbox'&&f.type!=='radio')f.dispatchEvent(new Event('input',{bubbles:true}))});
  (st.k||[]).forEach(function(i){var b=$$('[data-a=chk]',box)[i];if(b)b.click()});
  $$('.sol',box).forEach(function(s,i){
    if(st.s&&st.s[i]&&s.hidden){var row=s.previousElementSibling,b=row&&row.querySelector?row.querySelector('[data-a=sol]'):null;if(b)b.click();else s.hidden=false}
  });
  restoring=false;
}
function resetEx(c){
  delete S.ex[c.id];
  var e=c.ex;while(e){if(e.type==='check')delete S['chk_'+e.id];e=e.also}
  save();renderChapter(c);window.scrollTo(0,0);
}

/* ---------- simulacro de entrevista ---------- */
var SIMCAT={'1':'Mapa y operación','2':'Operación diaria y stock','3':'KPIs y reportes','4':'Catálogo y marketplace','5':'Cumplimiento y empleo','6':'Incidencias y gestión operativa','C':'Caso final','7':'Logística y almacén','8':'Planificación de inventario','9':'Datos y dashboards','10':'Estadística aplicada','11':'Power Automate','12':'Integración y proyecto final'};
var SIM=null,simTimer=null;
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function quizPool(){
  var pool=[];
  ALL.forEach(function(c){if(!c.quiz)return;var cat=SIMCAT[c.mod.id]||c.mod.title;c.quiz.forEach(function(q,qi){pool.push({chId:c.id,qi:qi,cat:cat})})});
  return pool;
}
function pickSim(n){
  var byCat={};quizPool().forEach(function(it){(byCat[it.cat]=byCat[it.cat]||[]).push(it)});
  var cats=Object.keys(byCat);cats.forEach(function(c){byCat[c]=shuffle(byCat[c])});
  var idx={};cats.forEach(function(c){idx[c]=0});
  var total=cats.reduce(function(a,c){return a+byCat[c].length},0);
  n=Math.min(n,total);
  var picked=[];
  while(picked.length<n){
    var any=false;
    shuffle(cats).forEach(function(c){if(picked.length<n&&idx[c]<byCat[c].length){picked.push(byCat[c][idx[c]]);idx[c]++;any=true}});
    if(!any)break;
  }
  return shuffle(picked);
}
function simScoreTxt(att){return att.ok+' de '+att.n+' ('+Math.round(100*att.ok/att.n)+'%) · '+new Date(att.fecha).toLocaleDateString('es-PE')}
function qOf(it){var c=ALL.filter(function(x){return x.id===it.chId})[0];return c&&c.quiz?{c:c,q:c.quiz[it.qi]}:null}
function renderSimulacro(){
  cur='simulacro';
  if(simTimer){clearInterval(simTimer);simTimer=null}
  if(SIM&&SIM.done)renderSimResults(SIM);
  else if(SIM)renderSimRunning();
  else renderSimConfig();
}
function renderSimConfig(){
  var pool=quizPool().length;
  var hist=S.simulacros.slice(-10).reverse();
  main.innerHTML='<div class="wrap"><article class="chap"><p class="crumb">Práctica</p><h1>Simulacro de entrevista</h1>'
    +'<p class="meta">Preguntas mezcladas de todos los módulos, con resultado final por tema.</p>'
    +'<div class="ex"><p>Elige cuántas preguntas quieres (hay '+pool+' disponibles en total) y si quieres ponerte un límite de tiempo.</p>'
    +'<div class="row"><label>Cantidad de preguntas <select id="sn"><option value="10">10</option><option value="20" selected>20</option><option value="30">30</option><option value="'+pool+'">Todas ('+pool+')</option></select></label>'
    +'<label>Tiempo <select id="st"><option value="0">Sin límite</option><option value="900">15 minutos</option><option value="1500">25 minutos</option><option value="2400">40 minutos</option></select></label></div>'
    +'<p><button class="btn pri" id="sstart">Empezar simulacro</button></p></div>'
    +(hist.length?'<h2>Tus últimos intentos</h2>'+T(['Fecha','Puntaje','Duración','Detalle'],hist.map(function(a){return [new Date(a.fecha).toLocaleString('es-PE'),a.ok+'/'+a.n+' ('+Math.round(100*a.ok/a.n)+'%)',clock(a.durSec||0),'<button class="btn sm" data-view="'+a.id+'">Ver</button>']})):'')
    +'</article></div>';
  $('#sstart').onclick=function(){
    var n=parseInt($('#sn').value,10),lim=parseInt($('#st').value,10);
    var items=pickSim(n);
    if(!items.length)return;
    var answers=[];for(var k=0;k<items.length;k++)answers.push(null);
    SIM={items:items,answers:answers,i:0,started:Date.now(),limit:lim,done:false};
    renderSimulacro();
  };
  $$('[data-view]',main).forEach(function(b){b.onclick=function(){
    var id=b.getAttribute('data-view'),att=S.simulacros.filter(function(a){return a.id===id})[0];
    if(att){SIM=att;renderSimulacro()}
  }});
}
function renderSimRunning(){
  if(simTimer){clearInterval(simTimer);simTimer=null}
  var n=SIM.items.length,i=SIM.i,it=SIM.items[i],info=qOf(it);
  if(!info){SIM.answers[i]=null;if(i<n-1){SIM.i++;renderSimRunning()}else finishSim();return}
  var q=info.q;
  var elapsedS=Math.floor((Date.now()-SIM.started)/1000);
  var remain=SIM.limit?Math.max(0,SIM.limit-elapsedS):null;
  main.innerHTML='<div class="wrap"><article class="chap"><p class="crumb">Simulacro de entrevista · '+it.cat+'</p>'
    +'<h1>Pregunta '+(i+1)+' de '+n+'</h1>'
    +'<div class="row"><span class="timer" id="simclock">'+(remain==null?'Tiempo: '+clock(elapsedS):'Te queda: '+clock(remain))+'</span></div>'
    +'<div class="ex">'+'<p>'+(i+1)+'. '+q.q+'</p>'+q.o.map(function(o,oi){return '<button class="opt'+(SIM.answers[i]===oi?' right':'')+'" data-o="'+oi+'">'+o+'</button>'}).join('')
    +'</div><div class="pager nolink"><button class="btn pn" id="simprev"'+(i===0?' disabled':'')+'>Anterior</button><span class="grow"></span><button class="btn '+(i===n-1?'pri':'')+'" id="simnext">'+(i===n-1?'Finalizar y ver resultado':'Siguiente ›')+'</button></div>'
    +'<p class="rst"><button class="btn sm" id="simquit">Salir sin guardar</button></p></article></div>';
  $$('[data-o]',main).forEach(function(b){b.onclick=function(){SIM.answers[i]=+b.getAttribute('data-o');renderSimRunning()}});
  $('#simprev').onclick=function(){if(SIM.i>0){SIM.i--;renderSimRunning()}};
  $('#simnext').onclick=function(){if(i===n-1)finishSim();else{SIM.i++;renderSimRunning()}};
  $('#simquit').onclick=function(){if(confirm('¿Salir del simulacro sin guardar el resultado?')){SIM=null;renderSimulacro()}};
  var myTimer=setInterval(function(){
    var e=Math.floor((Date.now()-SIM.started)/1000),cl=$('#simclock');
    if(!cl){clearInterval(myTimer);return}
    if(SIM.limit){var r=Math.max(0,SIM.limit-e);cl.textContent='Te queda: '+clock(r);if(r<=0){clearInterval(myTimer);finishSim()}}
    else cl.textContent='Tiempo: '+clock(e);
  },1000);
  simTimer=myTimer;
}
function finishSim(){
  if(simTimer){clearInterval(simTimer);simTimer=null}
  var durSec=Math.floor((Date.now()-SIM.started)/1000);
  var items=SIM.items.map(function(it,i){
    var info=qOf(it),ok=!!(info&&SIM.answers[i]===info.q.a);
    return {chId:it.chId,qi:it.qi,cat:it.cat,sel:SIM.answers[i],ok:ok};
  });
  var ok=items.filter(function(x){return x.ok}).length;
  var att={id:'sim_'+Date.now(),fecha:Date.now(),n:items.length,ok:ok,durSec:durSec,items:items};
  S.simulacros.push(att);
  if(S.simulacros.length>20)S.simulacros=S.simulacros.slice(-20);
  save();
  att.done=true;SIM=att;
  renderSimulacro();
}
function renderSimResults(att){
  var byCat={};att.items.forEach(function(it){var c=byCat[it.cat]=byCat[it.cat]||{ok:0,tot:0};c.tot++;if(it.ok)c.ok++});
  var cats=Object.keys(byCat).sort();
  var barsHtml=cats.map(function(c){var d=byCat[c];return '<span>'+c+'</span><div class="bar"><i style="width:'+(100*d.ok/d.tot)+'%"></i></div><b>'+d.ok+'/'+d.tot+'</b>'}).join('');
  var revHtml=att.items.map(function(it,i){
    var info=qOf(it);
    if(!info)return '<div class="q"><p>'+(i+1)+'. (pregunta no disponible: el contenido cambió)</p></div>';
    var q=info.q;
    return '<div class="q"><p>'+(i+1)+'. '+q.q+' <span class="small">('+it.cat+')</span></p>'+q.o.map(function(o,oi){var cls=oi===q.a?'right':(oi===it.sel?'wrong':'');return '<button class="opt '+cls+'" disabled>'+o+'</button>'}).join('')+'<p class="why">'+(it.ok?'<span class="ok">Correcto. </span>':(it.sel==null?'<span class="bad">Sin responder. </span>':'<span class="bad">No era esa. </span>'))+q.w+'</p></div>';
  }).join('');
  main.innerHTML='<div class="wrap"><article class="chap"><p class="crumb">Simulacro de entrevista</p><h1>Resultado</h1>'
    +'<p class="meta">'+new Date(att.fecha).toLocaleString('es-PE')+' · '+clock(att.durSec||0)+'</p>'
    +'<div class="kpis"><div class="kpi"><b>'+att.ok+'/'+att.n+'</b><span>Aciertos</span></div><div class="kpi"><b>'+Math.round(100*att.ok/att.n)+'%</b><span>Puntaje</span></div></div>'
    +'<h2>Por tema</h2><div class="bars">'+barsHtml+'</div>'
    +'<h2>Revisión pregunta por pregunta</h2><div class="ex nolink">'+revHtml+'</div>'
    +'<div class="row" style="margin-top:20px"><button class="btn pri" id="simagain">Nuevo simulacro</button><a class="btn" href="#/home">Volver al inicio</a></div>'
    +'</article></div>';
  $('#simagain').onclick=function(){SIM=null;renderSimulacro()};
}

/* ---------- repaso espaciado ---------- */
var SRS_INT=[0,1,3,7,14,30];
function dayMs(n){return n*86400000}
function srsKeyParts(key){var i=key.lastIndexOf('.');return {chId:key.slice(0,i),qi:+key.slice(i+1)}}
function syncSRS(){
  S.srs=S.srs||{};
  var now=Date.now();
  for(var key in S.quiz){
    var p=srsKeyParts(key),info=qOf(p);
    if(info&&S.quiz[key]!==info.q.a&&!S.srs[key])S.srs[key]={box:1,due:now};
  }
  S.simulacros.forEach(function(att){att.items.forEach(function(it){
    if(it.ok)return;var key=it.chId+'.'+it.qi;
    if(!S.srs[key])S.srs[key]={box:1,due:now};
  })});
  save();
}
function srsDue(){
  var now=Date.now(),out=[];
  for(var key in S.srs){if(S.srs[key].due<=now){var p=srsKeyParts(key);if(qOf(p))out.push(key)}}
  return out;
}
var REP=null;
function renderRepaso(){
  cur='repaso';
  syncSRS();
  if(REP&&REP.done)renderRepResults();
  else if(REP)renderRepRunning();
  else renderRepConfig();
}
function renderRepConfig(){
  var due=srsDue();
  var total=Object.keys(S.srs||{}).length;
  var byCat={};due.forEach(function(key){var p=srsKeyParts(key),info=qOf(p);if(info){var cat=SIMCAT[info.c.mod.id]||info.c.mod.title;byCat[cat]=(byCat[cat]||0)+1}});
  var cats=Object.keys(byCat).sort();
  main.innerHTML='<div class="wrap"><article class="chap"><p class="crumb">Práctica</p><h1>Repaso espaciado</h1>'
    +'<p class="meta">Junta lo que fallaste en el repaso de cada capítulo o en un simulacro. Lo que aciertas vuelve cada vez más tarde; lo que fallas, vuelve pronto.</p>'
    +'<div class="kpis"><div class="kpi"><b>'+due.length+'</b><span>Pendientes hoy</span></div><div class="kpi"><b>'+total+'</b><span>En seguimiento</span></div></div>'
    +(cats.length?'<h2>Por tema</h2><div class="bars">'+cats.map(function(c){return '<span>'+c+'</span><div class="bar"><i style="width:100%"></i></div><b>'+byCat[c]+'</b>'}).join('')+'</div>':'')
    +(due.length?'<p><button class="btn pri" id="repstart">Repasar ahora ('+due.length+')</button></p>':'<p class="body">No tienes repasos pendientes hoy. Vuelve cuando falles alguna pregunta nueva, o cuando venza el plazo de las que ya tienes en seguimiento.</p>')
    +'<p class="small">No hace falta hacer nada aparte: esto se llena solo con las preguntas de repaso de cada capítulo y con tus simulacros de entrevista.</p>'
    +'</article></div>';
  var b=$('#repstart');if(b)b.onclick=function(){REP={queue:shuffle(due),i:0,correct:0,answered:false,done:false};renderRepaso()};
}
function renderRepRunning(){
  var key=REP.queue[REP.i],p=srsKeyParts(key),info=qOf(p);
  if(!info){REP.i++;if(REP.i>=REP.queue.length)finishRep();else renderRepRunning();return}
  var q=info.q,c=info.c,cat=SIMCAT[c.mod.id]||c.mod.title,answered=REP.answered;
  main.innerHTML='<div class="wrap"><article class="chap"><p class="crumb">Repaso espaciado · '+cat+'</p><h1>Pregunta '+(REP.i+1)+' de '+REP.queue.length+'</h1>'
    +'<p class="small">Del capítulo <a href="#/'+c.id+'">'+c.id+' '+c.title+'</a></p>'
    +'<div class="ex nolink"><p>'+q.q+'</p>'+q.o.map(function(o,oi){var cls=answered?(oi===q.a?'right':(oi===REP.sel?'wrong':'')):'';return '<button class="opt '+cls+'" data-o="'+oi+'"'+(answered?' disabled':'')+'>'+o+'</button>'}).join('')+(answered?'<p class="why">'+(REP.sel===q.a?'<span class="ok">Correcto. </span>':'<span class="bad">No era esa. </span>')+q.w+'</p>':'')+'</div>'
    +'<div class="pager nolink"><span class="grow"></span><button class="btn pri" id="repnext"'+(answered?'':' disabled')+'>'+(REP.i===REP.queue.length-1?'Terminar':'Siguiente ›')+'</button></div>'
    +'</article></div>';
  if(!answered)$$('[data-o]',main).forEach(function(b){b.onclick=function(){
    REP.sel=+b.getAttribute('data-o');REP.answered=true;
    var ok=REP.sel===q.a;if(ok)REP.correct++;
    var e=S.srs[key]||{box:1,due:Date.now()};
    if(ok){e.box=Math.min(5,e.box+1);e.due=Date.now()+dayMs(SRS_INT[e.box])}
    else{e.box=1;e.due=Date.now()}
    S.srs[key]=e;save();
    renderRepRunning();
  }});
  $('#repnext').onclick=function(){if(!REP.answered)return;REP.answered=false;if(REP.i<REP.queue.length-1){REP.i++;renderRepRunning()}else finishRep()};
}
function finishRep(){REP.done=true;renderRepaso()}
function renderRepResults(){
  main.innerHTML='<div class="wrap"><article class="chap"><p class="crumb">Repaso espaciado</p><h1>Repaso terminado</h1>'
    +'<div class="kpis"><div class="kpi"><b>'+REP.correct+'/'+REP.queue.length+'</b><span>Correctas</span></div></div>'
    +'<p class="body">Lo que acertaste volverá a aparecer más adelante; lo que fallaste, hoy mismo si vuelves a entrar.</p>'
    +'<div class="row" style="margin-top:16px"><button class="btn pri" id="repagain">Volver al repaso</button><a class="btn" href="#/home">Volver al inicio</a></div>'
    +'</article></div>';
  $('#repagain').onclick=function(){REP=null;renderRepaso()};
}

/* ---------- mapa de conceptos ---------- */
function conceptGroups(){
  var byMod={},order=[];
  GLOS.forEach(function(g){
    var c=g.v?ALL.filter(function(x){return x.id===g.v})[0]:null;
    var mid=c?c.mod.id:'_',mt=c?c.mod.title:'Sin capítulo asociado';
    if(!byMod[mid]){byMod[mid]={title:mt,terms:[]};order.push(mid)}
    byMod[mid].terms.push(g);
  });
  var hasBlank=order.indexOf('_')>-1;
  order=order.filter(function(x){return x!=='_'}).sort(function(a,b){return mkey({id:a})-mkey({id:b})});
  if(hasBlank)order.push('_');
  return order.map(function(mid){return {title:byMod[mid].title,terms:byMod[mid].terms.sort(function(a,b){return a.t.localeCompare(b.t,'es')})}});
}
function renderMapa(){
  cur='mapa';
  var groups=conceptGroups();
  main.innerHTML='<div class="wrap"><article class="chap"><p class="crumb">Mapa</p><h1>Mapa de conceptos</h1>'
    +'<p class="meta">'+GLOS.length+' términos agrupados por módulo. Toca cualquiera para ver su definición, su fórmula (si tiene) y el capítulo donde aparece.</p>'
    +groups.map(function(g){return '<div class="gcluster"><h3>'+g.title+'</h3>'+g.terms.map(function(t){return '<span class="gnode"><button type="button" class="term" data-g="'+t.k+'">'+t.t+'</button></span>'}).join('')+'</div>'}).join('')
    +'</article></div>';
}

/* ---------- mis datos ---------- */
function parseCsvOwn(txt){
  var lines=txt.split(/\r?\n/).map(function(l){return l.trim()}).filter(Boolean);
  if(lines.length<2)return {err:'Pega un encabezado y al menos una fila.'};
  var head=lines[0].split(',').map(function(h){return h.trim().toLowerCase()});
  var need=['estado','uds','uds_ent','prometida','entrega'];
  var miss=need.filter(function(n){return head.indexOf(n)<0});
  if(miss.length)return {err:'Faltan columnas: '+miss.join(', ')+'. Columnas esperadas (case-insensitive): '+CSV_COLS.join(', ')+' (tienda, categoria y modalidad son opcionales pero mejoran el desglose).'};
  var rows=lines.slice(1).map(function(l){
    var vals=l.split(',');var r={};head.forEach(function(h,i){r[h]=(vals[i]||'').trim()});
    r.uds=parseFloat(r.uds)||0;r.uds_ent=parseFloat(r.uds_ent)||0;
    return r;
  });
  return {rows:rows};
}
function renderMisDatos(){
  cur='mis-datos';
  main.innerHTML='<div class="wrap"><article class="chap"><p class="crumb">Práctica</p><h1>Mis datos</h1>'
    +'<p class="meta">Pega tus propios pedidos (o los de tu trabajo, sin datos personales de clientes) con este formato de columnas y calcula los mismos KPIs del curso sobre TUS datos.</p>'
    +'<p class="small">Columnas: <code>'+CSV_COLS.join(', ')+'</code>. Como mínimo necesitas <code>estado, uds, uds_ent, prometida, entrega</code>. <code>estado</code> debe decir «Entregado» o «Cancelado» tal cual, y las fechas en formato AAAA-MM-DD para poder compararlas.</p>'
    +'<textarea id="mdin" style="min-height:160px;font:12px ui-monospace,Consolas,monospace;white-space:pre" placeholder="'+CSV_COLS.join(',')+'\nRA-1,2026-09-01,Web,Retail Andino 1P,Surco,Domicilio,Hogar,2,2,180,Entregado,,2026-09-03,2026-09-03"></textarea>'
    +'<div class="row"><button class="btn pri sm" id="mdgo">Calcular mis KPIs</button><button class="btn sm" id="mdclr">Borrar</button></div>'
    +'<div id="mdout" class="nolink"></div>'
    +'<p class="small">Nada de lo que pegues aquí sale de tu navegador: no se envía a ningún servidor, solo se calcula en tu pantalla (y no se guarda al recargar la página).</p>'
    +'</article></div>';
  var ta=$('#mdin');
  function bars(items,red){var mx=Math.max.apply(null,items.map(function(i){return i[1]}).concat([1]));return '<div class="bars">'+items.map(function(i){return '<span>'+i[0]+'</span><div class="bar"><i class="'+(red?'red':'')+'" style="width:'+(100*i[1]/mx)+'%"></i></div><b>'+i[2]+'</b>'}).join('')+'</div>'}
  $('#mdgo').onclick=function(){
    var out=$('#mdout'),r=parseCsvOwn(ta.value);
    if(r.err){out.innerHTML='<p class="bad">'+esc(r.err)+'</p>';return}
    var rs=r.rows;
    var h='<div class="kpis"><div class="kpi"><b>'+rs.length+'</b><span>Pedidos</span></div><div class="kpi"><b>'+fmt(K.ontime(rs))+'%</b><span>On Time (sobre entregados)</span></div><div class="kpi"><b>'+fmt(K.cancelPct(rs))+'%</b><span>Cancelación (sobre total)</span></div><div class="kpi"><b>'+fmt(K.fill(rs))+'%</b><span>Fill Rate (unidades)</span></div><div class="kpi"><b>'+fmt(K.otif(rs))+'%</b><span>OTIF (sobre entregados)</span></div></div>';
    if(rs[0]&&'tienda' in rs[0]){var bt=K.by(rs,'tienda'),tk=Object.keys(bt).sort().filter(Boolean);if(tk.length)h+='<h3>On Time por tienda</h3>'+bars(tk.map(function(t){var v=K.ontime(bt[t]);return [t+' ('+bt[t].length+')',v,fmt(v)+'%']}))}
    if(rs[0]&&'motivo' in rs[0]){var mot={};K.can(rs).forEach(function(r2){if(r2.motivo)mot[r2.motivo]=(mot[r2.motivo]||0)+1});var mk=Object.keys(mot);if(mk.length)h+='<h3>Cancelaciones por motivo</h3>'+bars(mk.map(function(m){return [m,mot[m],mot[m]]}),true)}
    out.innerHTML=h;
  };
  $('#mdclr').onclick=function(){ta.value='';$('#mdout').innerHTML=''};
}

/* ---------- registro de avance ---------- */
function renderAvance(){
  cur='avance';
  var d=ALL.filter(function(c){return S.done[c.id]}).length;
  var pct=Math.round(100*d/ALL.length);
  var minDone=ALL.filter(function(c){return S.done[c.id]}).reduce(function(a,c){return a+c.min},0);
  var last=S.simulacros.length?S.simulacros[S.simulacros.length-1]:null;
  var modRows=MODS.map(function(m){var dm=m.ch.filter(function(c){return S.done[c.id]}).length;return [(m.id==='C'?'Caso final':'Módulo '+m.id+': '+m.title),dm+' / '+m.ch.length,dm===m.ch.length?'Completo':(dm?'En curso':'Sin empezar')]});
  main.innerHTML='<div class="wrap"><article class="chap"><p class="crumb">Práctica</p><h1>Registro de avance</h1>'
    +'<p class="meta">'+COURSE_NAME+' · generado el '+new Date().toLocaleDateString('es-PE',{year:'numeric',month:'long',day:'numeric'})+'</p>'
    +'<p class="body">Esto es un registro personal de tu avance en el curso, no una certificación profesional ni un título: sirve para que tú (o quien lo mires) vea qué tanto has cubierto y cómo te fue en el último simulacro.</p>'
    +'<div class="kpis"><div class="kpi"><b>'+pct+'%</b><span>Capítulos completados</span></div><div class="kpi"><b>'+d+'/'+ALL.length+'</b><span>Capítulos</span></div><div class="kpi"><b>~'+Math.round(minDone/60)+' h</b><span>Tiempo estimado cubierto</span></div>'+(last?'<div class="kpi"><b>'+last.ok+'/'+last.n+'</b><span>Último simulacro</span></div>':'')+'</div>'
    +'<h2>Por módulo</h2>'+T(['Módulo','Capítulos','Estado'],modRows)
    +(last?'<h2>Último simulacro de entrevista</h2><p class="body">'+simScoreTxt(last)+' · duración '+clock(last.durSec||0)+'</p>':'')
    +(pct===100?'<p class="body">Completaste el 100% del curso — ya puedes <a href="#/certificado">generar tu certificado de finalización</a>.</p>':'')
    +'<div class="row noprint" style="margin-top:16px"><button class="btn pri" id="avprint">Imprimir o guardar como PDF</button></div>'
    +'<p class="small noprint">El botón usa la función de imprimir del navegador; en el diálogo de impresión elige «Guardar como PDF» si quieres un archivo.</p>'
    +'</article></div>';
  $('#avprint').onclick=function(){window.print()};
}

/* ---------- certificado de finalización ---------- */
function renderCertificado(){
  cur='certificado';
  var d=ALL.filter(function(c){return S.done[c.id]}).length,total=ALL.length,complete=d===total;
  if(complete&&!S.certDate){S.certDate=Date.now();save()}
  else if(!complete&&S.certDate){delete S.certDate;save()}
  if(!complete){
    main.innerHTML='<div class="wrap"><article class="chap"><p class="crumb">Práctica</p><h1>Certificado de finalización</h1>'
      +'<p class="meta">'+COURSE_NAME+'</p>'
      +'<p class="body">El certificado se habilita al completar el 100% de los capítulos del curso. Vas en <b>'+d+' de '+total+'</b> ('+Math.round(100*d/total)+'%).</p>'
      +'<div class="kpis"><div class="kpi"><b>'+d+'/'+total+'</b><span>Capítulos completados</span></div></div>'
      +'<p class="row"><a class="btn pri" href="#/home">Volver al curso</a><a class="btn" href="#/avance">Ver registro de avance</a></p>'
      +'</article></div>';
    return;
  }
  var dateStr=new Date(S.certDate).toLocaleDateString('es-PE',{year:'numeric',month:'long',day:'numeric'});
  main.innerHTML='<div class="wrap"><article class="chap"><p class="crumb">Práctica</p><h1 class="noprint">Certificado de finalización</h1>'
    +'<div class="row noprint"><label>Nombre a mostrar en el certificado <input type="text" id="certname" placeholder="Tu nombre completo" value="'+esc(S.certName||'')+'" style="min-width:260px"></label></div>'
    +'<div class="cert" id="certbox"><p class="cert-kicker">Certificado de finalización</p>'
    +'<p class="cert-course">'+COURSE_NAME+'</p>'
    +'<p class="cert-award">Se otorga a</p>'
    +'<p class="cert-name" id="certnamedisp">'+(esc(S.certName||'')||'Tu nombre aquí')+'</p>'
    +'<p class="cert-body">por haber completado la totalidad de los '+total+' capítulos del curso, cubriendo fundamentos de e-commerce, gestión operativa, logística, inventario, datos y criterio profesional de análisis operativo.</p>'
    +'<p class="cert-date">'+dateStr+'</p>'
    +'<p class="cert-disclaimer">Certificado de finalización personal, generado por el propio curso a partir del avance registrado localmente. No constituye una certificación oficial, un título académico ni una acreditación de una institución externa.</p>'
    +'</div>'
    +'<div class="row noprint" style="margin-top:16px"><button class="btn pri" id="certprint">Imprimir o guardar como PDF</button></div>'
    +'<p class="small noprint">Escribe tu nombre arriba antes de imprimir: se actualiza en vivo en la vista previa.</p>'
    +'</article></div>';
  var inp=$('#certname'),disp=$('#certnamedisp');
  inp.oninput=function(){S.certName=inp.value;save();disp.textContent=inp.value||'Tu nombre aquí'};
  $('#certprint').onclick=function(){window.print()};
}


/* ---------- modal de datos y tema ---------- */
function openData(){
  var csv=toCSV(DATA);
  var dict=[['id','Número de pedido'],['fecha','Fecha de compra (AAAA-MM-DD)'],['canal','Web, App o Marketplace'],['vendedor','Retail Andino 1P o el seller 3P'],['tienda','Tienda que atiende; «Seller» si despacha el seller'],['modalidad','Domicilio, Retiro en tienda o Mismo día'],['categoria','Tecnología, Hogar, Moda o Belleza'],['uds','Unidades pedidas'],['uds_ent','Unidades entregadas (0 si se canceló)'],['monto','Monto del pedido en soles, dato inventado'],['estado','Entregado o Cancelado'],['motivo','Motivo de cancelación (vacío si se entregó)'],['prometida','Fecha prometida de entrega'],['entrega','Fecha real de entrega (vacío si se canceló)']];
  $('#modal').innerHTML='<h2 style="margin-bottom:8px">Datos sintéticos: pedidos_retail_andino.csv</h2><p>320 pedidos del 1 al 14 de septiembre de 2026 de un retailer ficticio. Ninguna cifra corresponde a una empresa real. Cópialo, pégalo en Excel y en Datos → Desde tabla o rango para practicar Power Query, o impórtalo a SQL Server.</p><div class="row"><button class="btn pri sm" id="ccopy">Copiar CSV</button><button class="btn sm" id="cclose">Cerrar</button><span class="fb" id="cfb"></span></div>'+T(['Columna','Significado'],dict)+'<textarea id="ctxt" readonly style="min-height:160px;font:12px ui-monospace,Consolas,monospace;white-space:pre"></textarea>';
  var ta=$('#ctxt');ta.value=csv;
  $('#cclose').onclick=closeOv;
  $('#ccopy').onclick=function(){var f=$('#cfb');function fallback(){ta.focus();ta.select();try{if(document.execCommand('copy')){f.className='fb ok';f.textContent='Copiado';return}}catch(e){}f.className='fb';f.textContent='Texto seleccionado: pulsa Ctrl+C (o Cmd+C).'}
    try{navigator.clipboard.writeText(csv).then(function(){f.className='fb ok';f.textContent='Copiado'},fallback)}catch(e){fallback()}};
  $('#ov').hidden=false;
}
function closeOv(){$('#ov').hidden=true}
$('#ov').addEventListener('click',function(e){if(e.target.id==='ov')closeOv()});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeOv()});
$('#dbtn').onclick=openData;
$('#menu').onclick=function(){setNav(!nav.classList.contains('open'))};
$('#bmap').onclick=function(){setNav(!nav.classList.contains('open'))};
$('#scrim').onclick=function(){setNav(false)};
nav.addEventListener('click',function(ev){if(ev.target&&ev.target.id==='navclose')setNav(false)});
$('#tbtn').onclick=function(){var d=document.documentElement,now=d.getAttribute('data-theme');var dark=now?now==='dark':window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;S.theme=dark?'light':'dark';d.setAttribute('data-theme',S.theme);save()};
window.addEventListener('hashchange',route);
route();
if(window.__PWA&&'serviceWorker' in navigator&&/^https?:/.test(location.protocol)){try{navigator.serviceWorker.register('sw.js')}catch(err){}}
})();
