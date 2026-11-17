/**
 * Selector de tema claro/oscuro.
 * - El tema inicial lo pone un script inline en el <head> (Layout) antes de pintar, para no parpadear.
 * - Al cambiar, el tema nuevo se revela en círculo desde el botón (View Transition sobre root).
 * - La elección se guarda en localStorage ("moka:tema"); si no hay, se sigue al sistema.
 */

const CLAVE = 'moka:tema';
type Tema = 'light' | 'dark';

const actual = (): Tema => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

function aplicar(tema: Tema) {
  document.documentElement.dataset.theme = tema;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', tema === 'dark' ? '#160A0C' : '#FBF7F1');
  etiquetar();
}

function etiquetar() {
  const tema = actual();
  document.querySelectorAll<HTMLButtonElement>('[data-tema-toggle]').forEach((b) => {
    b.setAttribute('aria-label', tema === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
    b.setAttribute('aria-pressed', String(tema === 'dark'));
  });
}

document.addEventListener('click', (e) => {
  const boton = (e.target as HTMLElement).closest<HTMLElement>('[data-tema-toggle]');
  if (!boton) return;
  const nuevo: Tema = actual() === 'dark' ? 'light' : 'dark';
  try {
    localStorage.setItem(CLAVE, nuevo);
  } catch {
    /* sin almacenamiento: el cambio dura hasta recargar */
  }

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduce) return aplicar(nuevo);

  // Centro y radio del círculo que revela el tema nuevo
  const r = boton.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const radio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const html = document.documentElement;
  html.style.setProperty('--tema-x', `${x}px`);
  html.style.setProperty('--tema-y', `${y}px`);
  html.style.setProperty('--tema-r', `${radio}px`);
  html.dataset.cambioTema = '';
  document
    .startViewTransition(() => aplicar(nuevo))
    .finished.finally(() => delete html.dataset.cambioTema);
});

// Si no eligió nada, acompañamos los cambios del sistema
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  let guardado: string | null = null;
  try {
    guardado = localStorage.getItem(CLAVE);
  } catch {}
  if (!guardado) aplicar(e.matches ? 'dark' : 'light');
});

document.addEventListener('astro:page-load', etiquetar);
