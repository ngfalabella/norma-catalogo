/**
 * View Transitions con una sola card nombrada.
 *
 * Si las 54 cards tuvieran view-transition-name fijo, el navegador capturaría ~160 capas en cada
 * navegación (y en cada apertura de la hoja), y eso baja los fps. Por eso solo se nombran la foto,
 * el título y el precio de la card que se tocó, justo antes de la captura, y se limpian después.
 * El detalle tiene los nombres fijos (vt-foto, vt-titulo, vt-precio).
 */

const PARTES = ['foto', 'titulo', 'precio'] as const;

function nombrar(raiz: Element | null) {
  if (!raiz) return;
  for (const parte of PARTES) {
    const el = raiz.querySelector<HTMLElement>(`[data-vt="${parte}"]`);
    if (el) el.style.viewTransitionName = `vt-${parte}`;
  }
}

function limpiarCards() {
  document.querySelectorAll<HTMLElement>('article[data-producto] [data-vt]').forEach((el) => {
    el.style.viewTransitionName = '';
  });
}

const cardDe = (id: string) => document.querySelector(`article[data-producto="${CSS.escape(id)}"]`);

/** Producto del detalle que se está dejando (para encontrar su card al volver) */
let volviendoDe: string | null = null;

document.addEventListener('astro:before-preparation', (e) => {
  limpiarCards();
  const origen = (e as Event & { sourceElement?: Element }).sourceElement;
  const card = origen?.closest?.('article[data-producto]') ?? null;
  // Ida: la card tocada (en el detalle, los relacionados no son cards nombrables)
  if (card) nombrar(card);
  volviendoDe = document.querySelector<HTMLElement>('[data-detalle]')?.dataset.producto ?? null;
});

document.addEventListener('astro:after-swap', () => {
  // Vuelta: en el catálogo recién montado, nombramos la card del producto que se estaba viendo
  if (volviendoDe && !document.querySelector('[data-detalle]')) nombrar(cardDe(volviendoDe));
});

document.addEventListener('astro:page-load', () => {
  // Cuando terminó la transición, sacamos los nombres para que no se capturen en otras animaciones
  setTimeout(limpiarCards, 400);
});
