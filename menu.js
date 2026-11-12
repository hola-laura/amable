/* amable · menú: se esconde al bajar y vuelve al subir */
(() => {
  const nav = document.querySelector('nav.nav, nav.vnav');
  if (!nav) return;
  nav.classList.add('am');

  const css = `
nav.am{transition:translate .55s cubic-bezier(.7,0,.84,0),scale .55s cubic-bezier(.7,0,.84,0),opacity .4s ease,filter .45s ease,box-shadow .4s ease,background .4s ease!important;will-change:translate,opacity}
nav.am.am-fuera{translate:0 calc(-100% - 36px);scale:.94;opacity:0;filter:blur(6px);pointer-events:none}
nav.am.am-vuelve{transition:translate .7s cubic-bezier(.2,1.35,.35,1),scale .7s cubic-bezier(.2,1.35,.35,1),opacity .35s ease,filter .4s ease,box-shadow .4s ease,background .4s ease!important}
nav.am.am-flota{box-shadow:0 1px 0 rgba(255,255,255,.9) inset,0 14px 34px -20px rgba(17,17,17,.4)!important}
@media (prefers-reduced-motion:reduce){nav.am,nav.am.am-vuelve{transition:opacity .2s linear!important}nav.am.am-fuera{translate:none;scale:none;filter:none}}
`;
  const st = document.createElement('style');
  st.textContent = css;
  document.head.append(st);

  let ultimo = scrollY, acumulado = 0, pendiente = false, fuera = false;
  const ARRIBA = 140;   // cerca del inicio, siempre visible
  const BAJAR = 60;     // px seguidos hacia abajo para esconder
  const SUBIR = 8;      // px hacia arriba para volver

  const poner = (esconder) => {
    if (esconder === fuera) return;
    fuera = esconder;
    nav.classList.toggle('am-vuelve', !esconder);
    nav.classList.toggle('am-fuera', esconder);
  };

  const ocupado = () => nav.classList.contains('abierto') || nav.matches(':focus-within');

  const mira = () => {
    pendiente = false;
    const y = Math.max(scrollY, 0);
    const d = y - ultimo;
    ultimo = y;
    nav.classList.toggle('am-flota', y > 24);
    if (y < ARRIBA || ocupado()) { acumulado = 0; poner(false); return; }
    if (d > 0) { acumulado = Math.max(acumulado, 0) + d; if (acumulado > BAJAR) poner(true); }
    else if (d < 0) { acumulado = Math.min(acumulado, 0) + d; if (-acumulado > SUBIR) poner(false); }
  };

  addEventListener('scroll', () => { if (!pendiente) { pendiente = true; requestAnimationFrame(mira); } }, { passive: true });

  // En ordenador, acercar el ratón arriba del todo también lo trae de vuelta
  addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' && e.clientY < 72) { acumulado = 0; poner(false); } }, { passive: true });
  nav.addEventListener('focusin', () => poner(false));

  mira();
})();
