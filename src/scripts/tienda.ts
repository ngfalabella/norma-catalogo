/**
 * Pedido, favoritos y búsqueda. Todo vive en el navegador (localStorage):
 * el pedido se envía como mensaje de WhatsApp, no hay checkout.
 *
 * Los listeners se registran una sola vez (delegados en document) porque el
 * ClientRouter de Astro reemplaza el <body> en cada navegación sin recargar los módulos.
 */

interface Item {
  id: string;
  nombre: string;
  precio: number | null;
  categoria: string;
  url: string;
  thumb: string | null;
}
interface LineaPedido { item: Item; cantidad: number }

const WHATSAPP = '5492324650692';
const CLAVE_PEDIDO = 'moka:pedido';
const CLAVE_FAVORITOS = 'moka:favoritos';

const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const formato = new Intl.NumberFormat('es-AR');
const precioTexto = (p: number | null) => (p === null ? 'Consultar precio' : `$ ${formato.format(p)}`);
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const normalizar = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/* ---------- Estado ---------- */

function leer<T>(clave: string, porDefecto: T): T {
  try {
    const crudo = localStorage.getItem(clave);
    return crudo ? (JSON.parse(crudo) as T) : porDefecto;
  } catch {
    return porDefecto;
  }
}
function guardar(clave: string, valor: unknown) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    /* modo privado o almacenamiento bloqueado: el estado vive solo en memoria */
  }
}

let pedido: LineaPedido[] = leer(CLAVE_PEDIDO, []);
let favoritos: Item[] = leer(CLAVE_FAVORITOS, []);

const unidades = () => pedido.reduce((n, l) => n + l.cantidad, 0);

function cambiarCantidad(item: Item, delta: number) {
  const linea = pedido.find((l) => l.item.id === item.id);
  if (linea) {
    linea.cantidad += delta;
    linea.item = item;
  } else if (delta > 0) {
    pedido.push({ item, cantidad: delta });
  }
  pedido = pedido.filter((l) => l.cantidad > 0);
  guardar(CLAVE_PEDIDO, pedido);
  actualizarContadores();
  if (panelActual === 'pedido') renderPedido();
}

function alternarFavorito(item: Item) {
  const ya = favoritos.some((f) => f.id === item.id);
  favoritos = ya ? favoritos.filter((f) => f.id !== item.id) : [item, ...favoritos];
  guardar(CLAVE_FAVORITOS, favoritos);
  actualizarContadores();
  if (panelActual === 'favoritos') renderFavoritos();
  return !ya;
}

function mensajePedido() {
  const lineas = pedido.map((l) => {
    const sub = l.item.precio === null ? 'precio a consultar' : precioTexto(l.item.precio * l.cantidad);
    return `• ${l.cantidad} × ${l.item.nombre} — ${sub}`;
  });
  const total = pedido.reduce((t, l) => t + (l.item.precio ?? 0) * l.cantidad, 0);
  return [
    'Hola Mica! Quiero hacer este pedido:',
    ...lineas,
    '',
    total > 0 ? `Total estimado: ${precioTexto(total)}` : '',
    '¿Me confirmás disponibilidad y fecha de entrega?',
  ]
    .filter((l, i, arr) => l !== '' || arr[i - 1] !== '')
    .join('\n');
}

/* ---------- UI: contadores ---------- */

function actualizarContadores() {
  const n = unidades();
  document.querySelectorAll<HTMLElement>('[data-contador-pedido]').forEach((el) => {
    el.hidden = n === 0;
    el.textContent = el.closest('[data-isla-texto], nav[aria-label="Acciones"]') ? `· ${n}` : String(n);
  });
  document.querySelectorAll<HTMLElement>('[data-destino-pedido]').forEach((b) => {
    if (b.hasAttribute('aria-label')) b.setAttribute('aria-label', n ? `Ver mi pedido, ${n} ${n === 1 ? 'producto' : 'productos'}` : 'Ver mi pedido');
  });
  document.querySelectorAll<HTMLElement>('[data-contador-favoritos]').forEach((el) => (el.hidden = favoritos.length === 0));
  document.querySelectorAll<HTMLButtonElement>('[data-favorito]').forEach((b) => {
    const item = JSON.parse(b.dataset.favorito!) as Item;
    const activo = favoritos.some((f) => f.id === item.id);
    b.setAttribute('aria-pressed', String(activo));
    b.setAttribute('aria-label', activo ? `Quitar ${item.nombre} de favoritos` : `Guardar ${item.nombre} en favoritos`);
  });
}

function rebotar() {
  document.querySelectorAll<HTMLElement>('[data-destino-pedido]').forEach((el) => {
    el.classList.remove('rebota');
    void el.offsetWidth;
    el.classList.add('rebota');
  });
}

let avisoTimer: number | undefined;
function avisar(texto: string) {
  const aviso = document.querySelector<HTMLElement>('[data-aviso]');
  if (!aviso) return;
  aviso.textContent = texto;
  aviso.dataset.visible = '';
  clearTimeout(avisoTimer);
  avisoTimer = window.setTimeout(() => delete aviso.dataset.visible, 1800);
}

/* La miniatura vuela en curva hasta el botón del pedido */
function volar(origen: HTMLElement, item: Item) {
  const destino = [...document.querySelectorAll<HTMLElement>('[data-destino-pedido]')].find(
    (el) => el.getClientRects().length > 0,
  );
  const foto = origen.closest('article, [data-detalle]')?.querySelector<HTMLImageElement>('img.foto');
  const src = foto?.currentSrc || item.thumb;
  if (!destino || !src || reduceMotion()) return rebotar();

  const a = (foto ?? origen).getBoundingClientRect();
  const b = destino.getBoundingClientRect();
  const lado = 64;
  const x0 = a.left + a.width / 2 - lado / 2;
  const y0 = a.top + a.height / 2 - lado / 2;
  const x1 = b.left + b.width / 2 - lado / 2;
  const y1 = b.top + b.height / 2 - lado / 2;

  const img = document.createElement('img');
  img.src = src;
  img.alt = '';
  Object.assign(img.style, {
    position: 'fixed', left: '0', top: '0', width: `${lado}px`, height: `${lado}px`, objectFit: 'cover',
    borderRadius: '50%', zIndex: '70', pointerEvents: 'none', boxShadow: '0 12px 24px -10px rgb(42 9 16 / .5)',
  });
  document.body.append(img);
  img
    .animate(
      [
        { transform: `translate(${x0}px, ${y0}px) scale(1)`, opacity: 1 },
        { transform: `translate(${(x0 + x1) / 2}px, ${Math.min(y0, y1) - 90}px) scale(.75)`, opacity: 1, offset: 0.45 },
        { transform: `translate(${x1}px, ${y1}px) scale(.25)`, opacity: 0.4 },
      ],
      { duration: 500, easing: 'cubic-bezier(.22,1,.36,1)' },
    )
    .finished.then(() => {
      img.remove();
      rebotar();
    });
}

/* ---------- Hoja inferior ---------- */

type Panel = 'buscar' | 'pedido' | 'favoritos';
let panelActual: Panel | null = null;
let origenHoja: HTMLElement | null = null;
let filtroCategoria = '';

const TITULOS: Record<Panel, string> = { buscar: 'Buscar', pedido: 'Mi pedido', favoritos: 'Favoritos' };

const hoja = () => document.querySelector<HTMLDialogElement>('#hoja');

function filaHTML(item: Item, extra: string, cantidad?: number) {
  const thumb = item.thumb
    ? `<img src="${esc(item.thumb)}" alt="" class="size-14 shrink-0 rounded-2xl object-cover bg-tint">`
    : `<span aria-hidden="true" class="grid size-14 shrink-0 place-items-center rounded-2xl bg-tint text-accent/70"><span class="emblema emblema-chico h-9"></span></span>`;
  const precio = item.precio === null ? 'Consultar precio' : precioTexto(item.precio * (cantidad ?? 1));
  return `
    <a href="${esc(item.url)}" class="flex min-w-0 flex-1 items-center gap-3 rounded-2xl p-2 no-underline text-ink hover:bg-tint">
      ${thumb}
      <span class="min-w-0">
        <span class="block truncate font-serif text-[17px] leading-tight">${esc(item.nombre)}</span>
        <span class="mt-0.5 block text-sm text-ink-soft"><span class="tabular-nums font-semibold text-accent">${precio}</span> · ${esc(item.categoria)}</span>
      </span>
    </a>${extra}`;
}

const ICONO_MAS = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const ICONO_MENOS = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>';
const ICONO_CORAZON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>';

let catalogo: Item[] = [];
function leerCatalogo() {
  try {
    catalogo = JSON.parse(document.querySelector('#catalogo-items')?.textContent || '[]');
  } catch {
    catalogo = [];
  }
}

function renderBusqueda() {
  const h = hoja();
  if (!h) return;
  const q = normalizar(h.querySelector<HTMLInputElement>('[data-busqueda]')!.value.trim());
  const resultados = catalogo.filter(
    (p) =>
      (!filtroCategoria || p.categoria === filtroCategoria) &&
      (!q || normalizar(`${p.nombre} ${p.categoria}`).includes(q)),
  );
  const lista = h.querySelector<HTMLElement>('[data-resultados]')!;
  lista.innerHTML = resultados
    .map((p) => {
      const boton = `<button type="button" data-agregar='${esc(JSON.stringify(p))}' aria-label="Sumar ${esc(p.nombre)} al pedido" class="grid size-11 shrink-0 place-items-center rounded-full border border-line text-accent hover:bg-tint active:scale-90 transition-transform">${ICONO_MAS}</button>`;
      return `<li class="resultado flex items-center gap-1 pr-1" style="--vt: r-${esc(p.id.replace(/[^a-zA-Z0-9-]/g, '-'))}">${filaHTML(p, boton)}</li>`;
    })
    .join('');
  const estado = h.querySelector<HTMLElement>('[data-resultados-estado]')!;
  estado.textContent = resultados.length
    ? `${resultados.length} ${resultados.length === 1 ? 'producto' : 'productos'}`
    : 'No encontramos productos con esa búsqueda. Probá con otra palabra o elegí "Todas".';
}

function renderPedido() {
  const h = hoja();
  if (!h) return;
  const lista = h.querySelector<HTMLElement>('[data-lista-pedido]')!;
  lista.innerHTML = pedido
    .map(({ item, cantidad }) => {
      const stepper = `
        <div class="flex shrink-0 items-center rounded-full border border-line bg-field">
          <button type="button" data-restar='${esc(JSON.stringify(item))}' aria-label="Quitar un ${esc(item.nombre)}" class="grid size-11 place-items-center">${ICONO_MENOS}</button>
          <span class="min-w-5 text-center text-[15px] font-semibold tabular-nums">${cantidad}</span>
          <button type="button" data-agregar='${esc(JSON.stringify(item))}' data-sin-vuelo aria-label="Sumar un ${esc(item.nombre)}" class="grid size-11 place-items-center">${ICONO_MAS}</button>
        </div>`;
      return `<li class="flex items-center gap-1 pr-1">${filaHTML(item, stepper, cantidad)}</li>`;
    })
    .join('');
  const vacio = pedido.length === 0;
  h.querySelector<HTMLElement>('[data-pedido-vacio]')!.hidden = !vacio;
  h.querySelector<HTMLElement>('[data-pedido-pie]')!.hidden = vacio;
  const total = pedido.reduce((t, l) => t + (l.item.precio ?? 0) * l.cantidad, 0);
  h.querySelector<HTMLElement>('[data-total]')!.textContent = total > 0 ? precioTexto(total) : 'A consultar';
  h.querySelector<HTMLElement>('[data-nota-consultar]')!.hidden = !pedido.some((l) => l.item.precio === null) || total === 0;
  h.querySelector<HTMLAnchorElement>('[data-enviar-pedido]')!.href =
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensajePedido())}`;
}

function renderFavoritos() {
  const h = hoja();
  if (!h) return;
  h.querySelector<HTMLElement>('[data-lista-favoritos]')!.innerHTML = favoritos
    .map((item) => {
      const botones = `
        <button type="button" data-favorito='${esc(JSON.stringify(item))}' aria-pressed="true" aria-label="Quitar ${esc(item.nombre)} de favoritos" class="grid size-11 shrink-0 place-items-center rounded-full text-accent hover:bg-tint">${ICONO_CORAZON}</button>
        <button type="button" data-agregar='${esc(JSON.stringify(item))}' aria-label="Sumar ${esc(item.nombre)} al pedido" class="grid size-11 shrink-0 place-items-center rounded-full border border-line text-accent hover:bg-tint">${ICONO_MAS}</button>`;
      return `<li class="flex items-center gap-1 pr-1">${filaHTML(item, botones)}</li>`;
    })
    .join('');
  h.querySelector<HTMLElement>('[data-favoritos-vacio]')!.hidden = favoritos.length > 0;
}

function mostrarPanel(panel: Panel) {
  const h = hoja()!;
  panelActual = panel;
  h.querySelector('#hoja-titulo')!.textContent = TITULOS[panel];
  h.querySelectorAll<HTMLElement>('[data-panel]').forEach((s) => (s.hidden = s.dataset.panel !== panel));
  if (panel === 'buscar') renderBusqueda();
  if (panel === 'pedido') renderPedido();
  if (panel === 'favoritos') renderFavoritos();
}

/** La lupa (o el botón de origen) se transforma en la hoja: mismo view-transition-name antes y después. */
function abrirHoja(panel: Panel, origen?: HTMLElement | null) {
  const h = hoja();
  if (!h) return;
  mostrarPanel(panel);
  if (h.open) return;
  origenHoja = origen ?? null;
  const caja = h.firstElementChild as HTMLElement;
  const abrir = () => {
    h.showModal();
    if (panel === 'buscar') h.querySelector<HTMLInputElement>('[data-busqueda]')?.focus({ preventScroll: true });
  };
  if (!document.startViewTransition || reduceMotion() || !origen) {
    h.dataset.animada = '';
    return abrir();
  }
  delete h.dataset.animada;
  origen.style.viewTransitionName = 'hoja';
  const t = document.startViewTransition(() => {
    origen.style.viewTransitionName = '';
    caja.style.viewTransitionName = 'hoja';
    abrir();
  });
  t.finished.finally(() => (caja.style.viewTransitionName = ''));
}

function cerrarHoja() {
  const h = hoja();
  if (!h?.open) return;
  const caja = h.firstElementChild as HTMLElement;
  const origen = origenHoja?.isConnected && origenHoja.getClientRects().length ? origenHoja : null;
  const cerrar = () => {
    h.close();
    panelActual = null;
  };
  if (!document.startViewTransition || reduceMotion() || !origen) return cerrar();
  caja.style.viewTransitionName = 'hoja';
  const t = document.startViewTransition(() => {
    caja.style.viewTransitionName = '';
    origen.style.viewTransitionName = 'hoja';
    cerrar();
  });
  t.finished.finally(() => (origen.style.viewTransitionName = ''));
}

function filtrar(categoria: string) {
  filtroCategoria = categoria;
  const h = hoja()!;
  h.querySelectorAll<HTMLButtonElement>('[data-filtro]').forEach((b) =>
    b.setAttribute('aria-pressed', String(b.dataset.filtro === categoria)),
  );
  if (!document.startViewTransition || reduceMotion()) return renderBusqueda();
  // Los resultados tienen nombre solo durante el filtrado (.animando), así no pesan en otras capturas
  const lista = h.querySelector<HTMLElement>('[data-resultados]')!;
  lista.classList.add('animando');
  document.startViewTransition(renderBusqueda).finished.finally(() => lista.classList.remove('animando'));
}

/* ---------- Eventos (una sola vez) ---------- */

document.addEventListener('click', (e) => {
  const t = e.target as HTMLElement;

  const agregar = t.closest<HTMLElement>('[data-agregar]');
  if (agregar) {
    e.preventDefault();
    const item = JSON.parse(agregar.dataset.agregar!) as Item;
    const ref = agregar.dataset.cantidadRef ? document.getElementById(agregar.dataset.cantidadRef) : null;
    const cantidad = Math.max(1, Number(ref?.dataset.valor ?? 1));
    cambiarCantidad(item, cantidad);
    if (!agregar.hasAttribute('data-sin-vuelo')) {
      if (hoja()?.open) rebotar();
      else volar(agregar, item);
      avisar(`${cantidad > 1 ? `${cantidad} × ` : ''}${item.nombre} en tu pedido`);
    }
    return;
  }

  const restar = t.closest<HTMLElement>('[data-restar]');
  if (restar) return cambiarCantidad(JSON.parse(restar.dataset.restar!), -1);

  const fav = t.closest<HTMLElement>('[data-favorito]');
  if (fav) {
    const activo = alternarFavorito(JSON.parse(fav.dataset.favorito!));
    if (!hoja()?.open) avisar(activo ? 'Guardado en favoritos' : 'Quitado de favoritos');
    return;
  }

  const abrir = t.closest<HTMLElement>('[data-abrir]');
  if (abrir) return abrirHoja(abrir.dataset.abrir as Panel, abrir);

  if (t.closest('[data-cerrar-hoja]')) return cerrarHoja();

  const filtro = t.closest<HTMLElement>('[data-filtro]');
  if (filtro) return filtrar(filtro.dataset.filtro ?? '');

  if (t.closest('[data-vaciar-pedido]')) {
    pedido = [];
    guardar(CLAVE_PEDIDO, pedido);
    actualizarContadores();
    return renderPedido();
  }

  // Stepper de cantidad del detalle
  const paso = t.closest<HTMLElement>('[data-paso]');
  if (paso) {
    const salida = document.getElementById(paso.dataset.objetivo!);
    if (salida) {
      const valor = Math.min(20, Math.max(1, Number(salida.dataset.valor ?? 1) + Number(paso.dataset.paso)));
      salida.dataset.valor = String(valor);
      salida.textContent = String(valor);
    }
    return;
  }

  // Tocar el fondo oscuro cierra la hoja
  if (t instanceof HTMLDialogElement && t.id === 'hoja') cerrarHoja();
});

document.addEventListener('input', (e) => {
  if ((e.target as HTMLElement).matches('[data-busqueda]')) renderBusqueda();
});

// Esc: cerramos con nuestra animación en lugar de la del navegador
document.addEventListener('cancel', (e) => {
  if ((e.target as HTMLElement).id === 'hoja') {
    e.preventDefault();
    cerrarHoja();
  }
}, true);

// Al navegar a un producto desde la hoja, se cierra antes del cambio de página
document.addEventListener('astro:before-preparation', () => {
  const h = hoja();
  if (h?.open) h.close();
  panelActual = null;
});

// Si otra pestaña cambia el pedido o los favoritos, nos sincronizamos
window.addEventListener('storage', (e) => {
  if (e.key === CLAVE_PEDIDO) pedido = leer(CLAVE_PEDIDO, []);
  if (e.key === CLAVE_FAVORITOS) favoritos = leer(CLAVE_FAVORITOS, []);
  actualizarContadores();
});

document.addEventListener('astro:page-load', () => {
  leerCatalogo();
  filtroCategoria = '';
  actualizarContadores();
  const params = new URLSearchParams(location.search);
  if (params.has('buscar')) {
    history.replaceState(history.state, '', location.pathname + location.hash);
    abrirHoja('buscar');
  }
});
