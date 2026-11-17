/**
 * Chips de categorías con píldora deslizante + scroll-spy, e inclinación 3D de las cards destacadas.
 * Se inicializa en cada astro:page-load y limpia sus listeners al salir de la página.
 */

const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
let limpiar: AbortController | null = null;

/**
 * Scroll suave propio hasta una sección. El "smooth" nativo es muy rápido y no se puede ajustar:
 * acá la duración crece con la distancia (entre 0,6 y 1,1 s) con una curva que arranca y frena
 * suave. Si la persona toca, usa la rueda o el teclado, el scroll se cancela y le devuelve el control.
 * Devuelve la duración en ms.
 */
let scrollEnCurso = 0;
function scrollSuaveA(destino: HTMLElement): number {
  const margen = parseFloat(getComputedStyle(destino).scrollMarginTop) || 0;
  const inicio = window.scrollY;
  const maximo = document.documentElement.scrollHeight - innerHeight;
  const fin = Math.min(maximo, Math.max(0, destino.getBoundingClientRect().top + inicio - margen));
  const distancia = fin - inicio;
  if (reduceMotion() || Math.abs(distancia) < 2) {
    window.scrollTo({ top: fin, behavior: 'instant' });
    return 0;
  }

  const duracion = Math.min(1100, Math.max(600, 480 + Math.abs(distancia) * 0.12));
  const curva = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2); // ease-in-out cúbica
  const id = ++scrollEnCurso;
  const t0 = performance.now();

  const cancelar = () => {
    if (scrollEnCurso === id) scrollEnCurso++;
  };
  const opciones = { passive: true, once: true } as const;
  window.addEventListener('wheel', cancelar, opciones);
  window.addEventListener('touchstart', cancelar, opciones);
  window.addEventListener('keydown', cancelar, opciones);

  const paso = (ahora: number) => {
    if (id !== scrollEnCurso) return;
    const t = Math.min(1, (ahora - t0) / duracion);
    // behavior "instant": si no, el scroll-behavior: smooth del <html> pelearía con cada cuadro
    window.scrollTo({ top: inicio + distancia * curva(t), behavior: 'instant' });
    if (t < 1) requestAnimationFrame(paso);
    else {
      window.removeEventListener('wheel', cancelar);
      window.removeEventListener('touchstart', cancelar);
      window.removeEventListener('keydown', cancelar);
    }
  };
  requestAnimationFrame(paso);
  return duracion;
}

function iniciarChips(signal: AbortSignal) {
  const fila = document.querySelector<HTMLElement>('[data-chips-fila]');
  const pildora = document.querySelector<HTMLElement>('[data-pildora]');
  if (!fila || !pildora) return;

  const chips = [...fila.querySelectorAll<HTMLAnchorElement>('[data-chip]')];
  const secciones = chips
    .map((c) => document.getElementById(c.dataset.chip!))
    .filter((s): s is HTMLElement => !!s);
  let activo: HTMLAnchorElement | null = null;
  let bloqueoHasta = 0;

  const rect = (chip: HTMLElement) => ({ x: chip.offsetLeft, w: chip.offsetWidth });

  function activar(chip: HTMLAnchorElement, animar = true) {
    if (chip === activo) return;
    const anterior = activo;
    activo = chip;
    chips.forEach((c) => (c === chip ? c.setAttribute('aria-current', 'true') : c.removeAttribute('aria-current')));

    const b = rect(chip);
    pildora!.style.opacity = '1';
    pildora!.style.width = `${b.w}px`;
    pildora!.style.transform = `translateX(${b.x}px)`;

    if (anterior && animar && !reduceMotion()) {
      // Se estira para cubrir ambos chips a mitad de camino y llega al nuevo
      const a = rect(anterior);
      const desde = Math.min(a.x, b.x);
      const hasta = Math.max(a.x + a.w, b.x + b.w);
      pildora!.animate(
        [
          { transform: `translateX(${a.x}px)`, width: `${a.w}px` },
          { transform: `translateX(${desde}px)`, width: `${hasta - desde}px`, offset: 0.5 },
          { transform: `translateX(${b.x}px)`, width: `${b.w}px` },
        ],
        { duration: 300, easing: 'cubic-bezier(.22,1,.36,1)' },
      );
    }

    // El chip activo siempre queda visible en la fila
    const margen = 16;
    if (chip.offsetLeft - margen < fila!.scrollLeft || chip.offsetLeft + chip.offsetWidth + margen > fila!.scrollLeft + fila!.clientWidth) {
      fila!.scrollTo({ left: chip.offsetLeft - margen, behavior: reduceMotion() ? 'auto' : 'smooth' });
    }
  }

  activar(chips[0], false);

  // Scroll-spy: la sección que cruza la franja superior de la pantalla marca el chip
  const observador = new IntersectionObserver(
    (entradas) => {
      if (Date.now() < bloqueoHasta) return;
      const visible = entradas.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      const chip = chips.find((c) => c.dataset.chip === visible.target.id);
      if (chip) activar(chip);
    },
    { rootMargin: '-30% 0px -65% 0px' },
  );
  secciones.forEach((s) => observador.observe(s));
  signal.addEventListener('abort', () => observador.disconnect());

  fila.addEventListener(
    'click',
    (e) => {
      const chip = (e.target as HTMLElement).closest<HTMLAnchorElement>('[data-chip]');
      if (!chip) return;
      e.preventDefault();
      const destino = document.getElementById(chip.dataset.chip!);
      if (!destino) return;
      activar(chip);
      // El scroll-spy no mueve la píldora mientras dura el recorrido
      bloqueoHasta = Date.now() + scrollSuaveA(destino) + 150;
      history.replaceState(history.state, '', `#${chip.dataset.chip}`);
    },
    { signal },
  );

  // Recalcular la píldora si cambia el ancho (rotación de pantalla, fuentes cargadas)
  const reubicar = () => {
    if (!activo) return;
    const b = rect(activo);
    pildora.style.width = `${b.w}px`;
    pildora.style.transform = `translateX(${b.x}px)`;
  };
  window.addEventListener('resize', reubicar, { signal });
  document.fonts?.ready.then(reubicar);
}

function iniciarTilt(signal: AbortSignal) {
  if (reduceMotion()) return;
  document.querySelectorAll<HTMLElement>('.tilt').forEach((el) => {
    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--rx', `${(-py * 6).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(px * 6).toFixed(2)}deg`);
      el.style.setProperty('--gx', `${((px + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty('--gy', `${((py + 0.5) * 100).toFixed(1)}%`);
    };
    const soltar = () => ['--rx', '--ry', '--gx', '--gy'].forEach((p) => el.style.removeProperty(p));
    el.addEventListener('pointermove', mover, { signal });
    el.addEventListener('pointerleave', soltar, { signal });
    el.addEventListener('pointercancel', soltar, { signal });
  });
}

function marcarFotosCargadas() {
  // Las fotos que ya estaban en caché pueden terminar antes de que corra el onload inline
  document.querySelectorAll<HTMLImageElement>('img.foto:not([data-cargada])').forEach((img) => {
    if (img.complete && img.naturalWidth) img.dataset.cargada = '';
  });
}

/* Header: el bordó sigue al scroll (ver .header-tinta y .h-* en global.css).
   --p va de 0 (arriba de todo) a 1 en los primeros RECORRIDO px. En lugar de copiar el scroll
   tal cual, el valor se acerca al objetivo un poco en cada cuadro (interpolación), así incluso
   un ruedazo brusco se ve como un fundido continuo. */
const RECORRIDO = 180;
let pActual = 0;
let animando = false;
const suave = (t: number) => t * t * (3 - 2 * t); // smoothstep

function objetivoHeader() {
  return Math.min(1, Math.max(0, (window.scrollY - 4) / RECORRIDO));
}

function pintarHeader(p: number) {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  const pc = suave(p);
  // Textos: la misma curva pero concentrada entre 35% y 65% del recorrido
  const pt = suave(Math.min(1, Math.max(0, (pc - 0.35) / 0.3)));
  header.style.setProperty('--p', pc.toFixed(4));
  header.style.setProperty('--pt', pt.toFixed(4));
}

function cuadroHeader() {
  const objetivo = objetivoHeader();
  const reduce = reduceMotion();
  pActual = reduce ? objetivo : pActual + (objetivo - pActual) * 0.14;
  if (Math.abs(objetivo - pActual) < 0.002) pActual = objetivo;
  pintarHeader(pActual);
  if (pActual !== objetivo) requestAnimationFrame(cuadroHeader);
  else animando = false;
}

window.addEventListener(
  'scroll',
  () => {
    if (animando) return;
    animando = true;
    requestAnimationFrame(cuadroHeader);
  },
  { passive: true },
);

document.addEventListener('astro:page-load', () => {
  // Al entrar a una página, el header toma el estado del scroll actual sin animar
  pActual = objetivoHeader();
  pintarHeader(pActual);
  limpiar?.abort();
  limpiar = new AbortController();
  marcarFotosCargadas();
  iniciarChips(limpiar.signal);
  iniciarTilt(limpiar.signal);
});
