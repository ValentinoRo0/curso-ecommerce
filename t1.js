const fs=require('fs');eval(fs.readFileSync('dataset.js','utf8')+`
console.log('n',DATA.length,'onTime',r1(K.ontime(DATA)),'cancel',r1(K.cancelPct(DATA)),'fill',r1(K.fill(DATA)),'otif',r1(K.otif(DATA)));
var bt=K.by(DATA,'tienda');for(var t in bt)console.log(t,bt[t].length,'OT',r1(K.ontime(bt[t])),'Can',r1(K.cancelPct(bt[t])),'Fill',r1(K.fill(bt[t])));
var s=DATA.filter(r=>r.tienda==='Surco');
var pre=s.filter(r=>r.fecha<'2026-09-08'),post=s.filter(r=>r.fecha>='2026-09-08');
console.log('Surco pre',pre.length,r1(K.ontime(pre)),r1(K.cancelPct(pre)),'post',post.length,r1(K.ontime(post)),r1(K.cancelPct(post)));
var st=post.filter(r=>r.categoria==='Tecnología');console.log('Surco Tec post',st.length,r1(K.cancelPct(st)));
var mot={};K.can(DATA).forEach(r=>mot[r.motivo]=(mot[r.motivo]||0)+1);console.log(mot);
var rest=DATA.filter(r=>!(r.tienda==='Surco'&&r.fecha>='2026-09-08'));console.log('resto',rest.length,r1(K.ontime(rest)),r1(K.cancelPct(rest)));
var bd=K.by(DATA,'fecha');for(var d in bd)console.log(d,bd[d].length,r1(K.ontime(bd[d])),r1(K.cancelPct(bd[d])));
console.log('ticket',r1(K.ticket(DATA)),'lead',r1(K.leadDays(DATA)));
var bm=K.by(DATA,'modalidad');for(var m in bm)console.log(m,bm[m].length,r1(K.ontime(bm[m])));
var bc=K.by(DATA,'canal');for(var m in bc)console.log(m,bc[m].length);
`);
