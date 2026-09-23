/* ===== Dataset sintético (retailer ficticio "Retail Andino") ===== */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function isoAdd(iso,n){var d=new Date(iso+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)}
var DATA=(function(){
  var R=mulberry32(20260919);
  function pick(arr,w){var s=0,i;for(i=0;i<w.length;i++)s+=w[i];var t=R()*s;for(i=0;i<arr.length;i++){t-=w[i];if(t<0)return arr[i]}return arr[arr.length-1]}
  var days=[];for(var i=0;i<14;i++)days.push(isoAdd('2026-09-01',i));
  var dw=days.map(function(d){return (d==='2026-09-12'||d==='2026-09-13')?2.2:1});
  var tiendas=['Surco','San Miguel','Los Olivos','Chorrillos'];
  var cats=['Tecnología','Hogar','Moda','Belleza'];
  var price={'Tecnología':[180,1600],'Hogar':[60,420],'Moda':[40,260],'Belleza':[25,190]};
  var sellers={'Tecnología':'Tecnoandes','Hogar':'Hogar Sur','Moda':'Moda Rímac','Belleza':'Belleza Lima'};
  var sla={'Domicilio':2,'Retiro en tienda':1,'Mismo día':0};
  var rows=[];
  for(var n=0;n<320;n++){
    var fecha=pick(days,dw);
    var canal=pick(['Web','App','Marketplace'],[.53,.32,.15]);
    var mp=canal==='Marketplace';
    var tienda=mp?'Seller':pick(tiendas,[.32,.24,.2,.24]);
    var cat=pick(cats,tienda==='Surco'?[.46,.2,.2,.14]:[.3,.25,.28,.17]);
    var mod=pick(['Domicilio','Retiro en tienda','Mismo día'],mp?[.9,.0,.1]:[.55,.32,.13]);
    var uds=pick([1,2,3],[.62,.28,.10]);
    var p=price[cat];var monto=Math.round((p[0]+R()*(p[1]-p[0]))*uds);
    var zona=(!mp&&tienda==='Surco'&&fecha>='2026-09-08');
    var zonaTec=zona&&cat==='Tecnología';
    var cancel=R()<(zonaTec?0.5:0.04);
    var estado=cancel?'Cancelado':'Entregado';
    var motivo='';
    if(cancel){
      if(zonaTec&&R()<0.88)motivo=pick(['Producto sin ubicar','Sobreventa'],[.62,.38]);
      else motivo=pick(['Cliente desiste','Pago rechazado','Dirección/cobertura','Producto sin ubicar'],[.42,.24,.24,.10]);
    }
    var prom=isoAdd(fecha,sla[mod]);
    var ent='',ue=0;
    if(!cancel){
      var pl=mp?0.12:0.07;
      if(zona)pl=(mod==='Domicilio')?0.32:0.20;
      var late=R()<pl;
      var delay=late?(mod==='Mismo día'?1:pick([1,2],[.65,.35])):0;
      ent=isoAdd(prom,delay);
      var pp=zona?0.22:0.03;
      ue=(uds>1&&R()<pp)?uds-1:uds;
    }
    rows.push({fecha:fecha,canal:canal,vendedor:mp?sellers[cat]:'Retail Andino 1P',tienda:tienda,modalidad:mod,categoria:cat,uds:uds,uds_ent:ue,monto:monto,estado:estado,motivo:motivo,prometida:prom,entrega:ent});
  }
  rows.sort(function(a,b){return a.fecha<b.fecha?-1:a.fecha>b.fecha?1:0});
  rows.forEach(function(r,i){r.id='RA-'+(100001+i);});
  return rows;
})();
var CSV_COLS=['id','fecha','canal','vendedor','tienda','modalidad','categoria','uds','uds_ent','monto','estado','motivo','prometida','entrega'];
function toCSV(rows){return [CSV_COLS.join(',')].concat(rows.map(function(r){return CSV_COLS.map(function(c){return r[c]}).join(',')})).join('\n')}
var K={
  ent:function(rs){return rs.filter(function(r){return r.estado==='Entregado'})},
  can:function(rs){return rs.filter(function(r){return r.estado==='Cancelado'})},
  ontime:function(rs){var e=K.ent(rs);return e.length?100*e.filter(function(r){return r.entrega<=r.prometida}).length/e.length:0},
  cancelPct:function(rs){return rs.length?100*K.can(rs).length/rs.length:0},
  fill:function(rs){var p=0,e=0;rs.forEach(function(r){p+=r.uds;e+=r.uds_ent});return p?100*e/p:0},
  otif:function(rs){var e=K.ent(rs);return e.length?100*e.filter(function(r){return r.entrega<=r.prometida&&r.uds_ent===r.uds}).length/e.length:0},
  by:function(rs,key){var m={};rs.forEach(function(r){(m[r[key]]=m[r[key]]||[]).push(r)});return m},
  leadDays:function(rs){var e=K.ent(rs);if(!e.length)return 0;var s=0;e.forEach(function(r){s+=(new Date(r.entrega)-new Date(r.fecha))/864e5});return s/e.length},
  ticket:function(rs){var e=K.ent(rs);if(!e.length)return 0;var s=0;e.forEach(function(r){s+=r.monto});return s/e.length}
};
function r1(x){return Math.round(x*10)/10}
function fmt(x,d){d=(d==null?1:d);var p=Math.pow(10,d);return (Math.round(x*p)/p).toString().replace('.',',')}
/* helpers estadísticos (equivalentes a PROMEDIO, MEDIANA, PERCENTIL.INC, DESVEST.M) */
function sortedNums(a){return a.slice().sort(function(x,y){return x-y})}
function mean(a){var s=0;a.forEach(function(x){s+=x});return a.length?s/a.length:0}
function pctl(a,p){var s=sortedNums(a),n=s.length;if(!n)return 0;var r=p*(n-1),i=Math.floor(r),f=r-i;return i+1<n?s[i]+f*(s[i+1]-s[i]):s[i]}
function median(a){return pctl(a,0.5)}
function sdS(a){var n=a.length;if(n<2)return 0;var m=mean(a),s=0;a.forEach(function(x){s+=(x-m)*(x-m)});return Math.sqrt(s/(n-1))}
/* pronósticos simples */
function maFc(a,k){var f=[];for(var i=0;i<a.length;i++)f.push(i>=k?mean(a.slice(i-k,i)):null);return {f:f,next:mean(a.slice(a.length-k))}}
function sesFc(a,al){var f=[null],l=a[0];for(var i=1;i<a.length;i++){f.push(l);l=al*a[i]+(1-al)*l}return {f:f,next:l}}
function fcErr(a,f){var n=0,ae=0,b=0,ap=0,nb=0;for(var i=0;i<a.length;i++){if(f[i]==null)continue;n++;ae+=Math.abs(a[i]-f[i]);b+=a[i]-f[i];if(a[i]!==0){ap+=Math.abs(a[i]-f[i])/a[i];nb++}}return {n:n,mae:n?ae/n:NaN,bias:n?b/n:NaN,mape:nb?100*ap/nb:NaN}}
