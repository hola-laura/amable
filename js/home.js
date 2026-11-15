/* amable · portada: entrada, hero, casos apilados, títulos, cursor, Monzo y pie */
/* home: hero vivo, casos apilados, pasos y pie */(()=>{
const calma=matchMedia('(prefers-reduced-motion:reduce)').matches;
const fino=matchMedia('(hover:hover) and (pointer:fine)').matches;
const lim=(v,a,b)=>Math.min(b,Math.max(a,v));
/* hero: la luz sigue al cursor y, sin cursor, se mueve despacio */
const hero=document.querySelector('.hero'),luz=document.querySelector('.hero-luz');
if(hero&&luz&&!calma){let x=70,y=34,tx=70,ty=34,dentro=false,visible=true,raf=0;
const paso=(t)=>{raf=0;if(!visible||document.hidden)return;
if(!dentro){tx=50+28*Math.cos(t/5200);ty=42+20*Math.sin(t/3900)}
x+=(tx-x)*.06;y+=(ty-y)*.06;const w=hero.clientWidth/100,h=hero.clientHeight/100;luz.style.setProperty('--x1',(x*w).toFixed(1)+'px');luz.style.setProperty('--y1',(y*h).toFixed(1)+'px');luz.style.setProperty('--x2',((100-x)*w).toFixed(1)+'px');luz.style.setProperty('--y2',((104-y)*h).toFixed(1)+'px');raf=requestAnimationFrame(paso)};
const arranca=()=>{if(!raf)raf=requestAnimationFrame(paso)};
if(fino){hero.addEventListener('pointermove',(e)=>{const r=hero.getBoundingClientRect();dentro=true;tx=(e.clientX-r.left)/r.width*100;ty=(e.clientY-r.top)/r.height*100},{passive:true});
hero.addEventListener('pointerleave',()=>{dentro=false})}
new IntersectionObserver((es)=>{visible=es[0].isIntersecting;if(visible)arranca()}).observe(hero);
document.addEventListener('visibilitychange',arranca);arranca()}
/* puertas: foco bajo el cursor */
if(fino)document.querySelectorAll('.puerta').forEach((p)=>p.addEventListener('pointermove',(e)=>{const r=p.getBoundingClientRect();p.style.setProperty('--px',(e.clientX-r.left)+'px');p.style.setProperty('--py',(e.clientY-r.top)+'px')},{passive:true}));
/* casos: aparecen los mensajes y la tarjeta de debajo se aleja */
const casos=[...document.querySelectorAll('.caso')],pasos=document.querySelector('.pasos');
const ve=new IntersectionObserver((es)=>es.forEach((e)=>{if(e.isIntersecting){e.target.classList.add('en');ve.unobserve(e.target)}}),{threshold:.35});
casos.forEach((c)=>ve.observe(c));
const marca=document.querySelector('.pie-marca');
if(marca){const vm=new IntersectionObserver((es)=>{if(es[0].isIntersecting){marca.classList.add('en');vm.disconnect()}},{threshold:.2});vm.observe(marca)}
let pend=false;
const mide=()=>{pend=false;const vh=innerHeight;
if(!calma)casos.forEach((c,i)=>{const n=casos[i+1];if(!n)return;const r=c.getBoundingClientRect(),d=n.getBoundingClientRect().top-r.top;c.style.setProperty('--s',lim(1-d/r.height,0,1).toFixed(3))});
if(pasos){const p=calma?1:lim((vh*.82-pasos.getBoundingClientRect().top)/(vh*.42),0,1);pasos.style.setProperty('--p',p.toFixed(3));[...pasos.children].forEach((li,i)=>li.classList.toggle('on',p>=i/2-.01&&p>0))}};
const pide=()=>{if(!pend){pend=true;requestAnimationFrame(mide)}};
addEventListener('scroll',pide,{passive:true});addEventListener('resize',pide);mide();
/* pie: las letras se levantan cerca del cursor */
if(marca&&fino&&!calma){const ls=[...marca.querySelectorAll('b,i')];
marca.addEventListener('pointermove',(e)=>{ls.forEach((l)=>{const r=l.getBoundingClientRect(),d=Math.abs(e.clientX-(r.left+r.width/2)),f=lim(1-d/(r.width*1.6+60),0,1);l.style.transform='translateY('+(-f*f*9).toFixed(2)+'%)'})},{passive:true});
marca.addEventListener('pointerleave',()=>ls.forEach((l)=>{l.style.transform=''}))}
/* desplazamiento suave: solo con ratón y si no se ha pedido menos movimiento */
if(fino&&!calma){const sc=document.createElement('script');sc.src='/js/lenis.min.js';sc.onload=()=>{try{new Lenis({autoRaf:true,anchors:true})}catch(e){}};document.head.append(sc)}
/* títulos: una palabra detrás de otra */
if(!calma)document.querySelectorAll('.tit h2,.yo h2,.quiere h2,.contacto h2').forEach((h)=>{let w=0;[...h.childNodes].forEach((n)=>{if(n.nodeType!==3)return;const f=document.createDocumentFragment();n.textContent.split(/(\s+)/).forEach((t)=>{if(!t)return;if(/^\s+$/.test(t)){f.append(' ');return}const o=document.createElement('span'),i=document.createElement('span');o.className='pw';i.textContent=t;i.style.setProperty('--w',w++);o.append(i);f.append(o)});n.replaceWith(f)});const pt=h.querySelector(':scope>.pt'),ult=[...h.querySelectorAll('.pw>span')].pop();if(pt&&ult)ult.append(pt);h.setAttribute('aria-label',h.textContent.replace(/\s+/g,' ').trim());h.querySelectorAll('.pw').forEach((o)=>o.setAttribute('aria-hidden','true'))});
/* casos: una etiqueta acompaña al cursor */
if(fino&&!calma&&casos.length){const cur=document.createElement('div'),tx=document.createElement('span');cur.className='cur';cur.setAttribute('aria-hidden','true');cur.append(tx);document.body.append(cur);
let cx=0,cy=0,px=0,py=0,viva=0,activa=false;
const anda=()=>{cx+=(px-cx)*.2;cy+=(py-cy)*.2;cur.style.setProperty('--cx',cx.toFixed(1)+'px');cur.style.setProperty('--cy',cy.toFixed(1)+'px');if(activa||Math.abs(px-cx)+Math.abs(py-cy)>.5)viva=requestAnimationFrame(anda);else viva=0};
casos.forEach((c)=>{c.addEventListener('pointerenter',(e)=>{const ab=c.querySelector('.ab');tx.textContent=ab?ab.textContent.replace(/\s+/g,' ').trim():'';px=cx=e.clientX+18;py=cy=e.clientY+18;activa=true;cur.classList.add('on');if(!viva)viva=requestAnimationFrame(anda)});
c.addEventListener('pointermove',(e)=>{px=e.clientX+18;py=e.clientY+18},{passive:true});
c.addEventListener('pointerleave',()=>{activa=false;cur.classList.remove('on')})});
addEventListener('scroll',()=>{if(activa&&!document.querySelector('.caso:hover')){activa=false;cur.classList.remove('on')}},{passive:true})}
})();
/* propuesta atrevida: rodeo a mano y pantallas de Monzo que se mueven al bajar */(()=>{
const calma=matchMedia('(prefers-reduced-motion:reduce)').matches,lim=(v,a,b)=>Math.min(b,Math.max(a,v));
/* un rodeo a mano en la última palabra de «Trabajo real» */
const t=document.querySelector('#trabajos .tit h2');
if(t){const ps=t.querySelectorAll('.pw'),u=ps[ps.length-1];if(u){const r=document.createElement('span');r.className='rodeo';u.replaceWith(r);r.append(u);r.insertAdjacentHTML('beforeend','<svg aria-hidden="true"><path class="traz" pathLength="1"/></svg>');
const sv=r.querySelector('svg'),pt=sv.firstChild,N=[.855,.21,.695,.04,.31,.01,.135,.24,-.015,.44,.03,.82,.31,.92,.61,1.02,.955,.87,.975,.52,.99,.25,.78,.07,.56,.11];
const traza=()=>{const w=sv.clientWidth,h=sv.clientHeight;if(!w||!h)return;const q=N.map((v,i)=>(v*(i%2?h:w)).toFixed(1));sv.setAttribute('viewBox','0 0 '+w+' '+h);pt.setAttribute('d','M'+q[0]+' '+q[1]+'C'+q.slice(2,8).join(' ')+'C'+q.slice(8,14).join(' ')+'C'+q.slice(14,20).join(' ')+'C'+q.slice(20,26).join(' '))};
traza();addEventListener('resize',traza);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(traza)}}
const mz=document.querySelector('.mz-vi');
let pend=false;
const mide=()=>{pend=false;const vh=innerHeight;
if(mz&&!calma){const r=mz.getBoundingClientRect();mz.style.setProperty('--m',lim((r.top+r.height/2-vh/2)/vh,-1,1).toFixed(3))}};
const pide=()=>{if(!pend){pend=true;requestAnimationFrame(mide)}};
addEventListener('scroll',pide,{passive:true});addEventListener('resize',pide);mide();
})();
