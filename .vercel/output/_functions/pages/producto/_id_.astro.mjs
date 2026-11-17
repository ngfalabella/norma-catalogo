import { c as createAstro, a as createComponent, r as renderComponent, d as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Cm3X-lg3.mjs';
import 'piccolore';
import { b as $$Layout, a as $$Icono, $ as $$FotoProducto } from '../../chunks/FotoProducto_FH_DtY0d.mjs';
import { $ as $$Image } from '../../chunks/_astro_assets_zPhqQOR3.mjs';
import { g as getProductos, b as aItemCliente, a as agruparPorCategoria, w as whatsappLink } from '../../chunks/catalogo_BbyxwB-f.mjs';
/* empty css                                   */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://catalogo-26.vercel.app");
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const idPedido = (Astro2.params.id ?? "").trim().toLowerCase();
  const productos = await getProductos();
  const producto = productos.find((p) => p.id.toLowerCase() === idPedido);
  if (!producto) {
    return Astro2.redirect("/catalogo");
  }
  const items = await Promise.all(productos.map(aItemCliente));
  const item = items.find((i) => i.id === producto.id);
  const categorias = agruparPorCategoria(productos).map(({ nombre, id }) => ({ nombre, id }));
  const relacionados = [
    ...productos.filter((p) => p !== producto && p.categoriaId === producto.categoriaId && p.foto),
    ...productos.filter((p) => p !== producto && p.categoriaId !== producto.categoriaId && p.foto)
  ].slice(0, 3);
  const consulta = whatsappLink(`Hola Mica! Te quer\xEDa consultar por: ${producto.nombre} que vi en el cat\xE1logo`);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${producto.nombre} | Moka`, "description": producto.descripcion || void 0, "items": items, "categorias": categorias, "detalle": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="md:mx-auto md:max-w-6xl md:px-6 md:pt-8" data-detalle${addAttribute(producto.id, "data-producto")}> <a href="/catalogo" class="mb-5 hidden items-center gap-2 text-sm text-ink-soft no-underline hover:text-ink md:inline-flex"> ${renderComponent($$result2, "Icono", $$Icono, { "nombre": "volver", "size": 16 })} Volver al catálogo
</a> <div class="md:grid md:grid-cols-2 md:items-start md:gap-10"> <!-- Foto a sangre en mobile, tarjeta en tablet/desktop --> <div class="relative h-[460px] overflow-hidden bg-tint md:sticky md:top-28 md:h-auto md:aspect-[4/5] md:rounded-[var(--radius-feature)] md:shadow-feature"> ${renderComponent($$result2, "FotoProducto", $$FotoProducto, { "producto": producto, "eager": true, "widths": [640, 828, 1080, 1600], "sizes": "(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw", "class": "absolute inset-0", "monograma": "grande", "fija": true })} <div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgb(255_255_255/.35),transparent_50%)] mix-blend-soft-light"></div> <!-- Controles sobre la foto (mobile) --> <div class="absolute inset-x-3.5 top-[max(14px,env(safe-area-inset-top))] flex justify-between md:hidden"> <a href="/catalogo" aria-label="Volver al catálogo" class="liquid grid size-11 place-items-center rounded-full text-ink"> ${renderComponent($$result2, "Icono", $$Icono, { "nombre": "volver" })} </a> <div class="flex gap-2"> <button type="button"${addAttribute(JSON.stringify(item), "data-favorito")} aria-pressed="false"${addAttribute(`Guardar ${producto.nombre} en favoritos`, "aria-label")} class="favorito liquid grid size-11 place-items-center rounded-full text-accent"> ${renderComponent($$result2, "Icono", $$Icono, { "nombre": "corazon" })} </button> <button type="button" data-abrir="pedido" data-destino-pedido aria-label="Ver mi pedido" class="liquid-bordo relative grid size-11 place-items-center rounded-full"> ${renderComponent($$result2, "Icono", $$Icono, { "nombre": "bolsa", "size": 19 })} <span data-contador-pedido hidden class="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold-400 px-1 text-[11px] font-semibold tabular-nums text-cocoa-950"></span> </button> </div> </div> </div> <!-- Hoja de información: se superpone a la foto en mobile --> <div class="relative -mt-10 rounded-t-[var(--radius-sheet)] bg-paper px-5 pb-36 pt-3 shadow-[0_-12px_30px_-16px_rgb(42_9_16/.35)] md:mt-0 md:rounded-none md:bg-transparent md:px-0 md:pb-0 md:pt-6 md:shadow-none"> <div aria-hidden="true" class="mx-auto mb-[18px] h-1 w-10 rounded-full bg-ink/15 md:hidden"></div> <p class="mb-1.5 text-xs font-medium uppercase tracking-[.14em] text-ink-soft"> <a${addAttribute(`/catalogo#${producto.categoriaId}`, "href")} class="text-ink-soft no-underline hover:text-accent">${producto.categoria}</a> </p> <div class="flex items-baseline justify-between gap-3 md:block"> <h1 class="font-serif text-[32px] font-normal leading-[1.05] tracking-[-.02em] md:text-5xl" style="view-transition-name: vt-titulo"> ${producto.nombre} </h1> <p${addAttribute(["whitespace-nowrap text-xl font-semibold tabular-nums md:mt-4 md:text-2xl", producto.precio === null ? "text-ink-soft font-medium text-base md:text-xl" : "text-accent"], "class:list")} style="view-transition-name: vt-precio"> ${producto.precioTexto} </p> </div> ${producto.descripcion && renderTemplate`<p class="mt-3 max-w-prose text-[15px] leading-relaxed text-ink-soft md:mt-5 md:text-[17px]">${producto.descripcion}</p>`} <!-- Acciones (tablet/desktop) --> <div class="mt-8 hidden items-center gap-3 md:flex"> <div class="flex items-center rounded-full border border-line bg-field"> <button type="button" data-paso="-1" data-objetivo="cantidad-desk" aria-label="Quitar uno" class="grid size-12 place-items-center">${renderComponent($$result2, "Icono", $$Icono, { "nombre": "menos", "size": 18 })}</button> <span id="cantidad-desk" data-valor="1" aria-live="polite" class="min-w-6 text-center text-base font-semibold tabular-nums">1</span> <button type="button" data-paso="1" data-objetivo="cantidad-desk" aria-label="Agregar uno" class="grid size-12 place-items-center">${renderComponent($$result2, "Icono", $$Icono, { "nombre": "mas", "size": 18 })}</button> </div> <button type="button"${addAttribute(JSON.stringify(item), "data-agregar")} data-cantidad-ref="cantidad-desk" class="liquid-bordo h-12 flex-1 rounded-full px-6 text-[15px] font-medium transition-[filter] hover:brightness-110">
Agregar al pedido
</button> <button type="button"${addAttribute(JSON.stringify(item), "data-favorito")} aria-pressed="false"${addAttribute(`Guardar ${producto.nombre} en favoritos`, "aria-label")} class="favorito grid size-12 place-items-center rounded-full border border-line text-accent hover:bg-tint"> ${renderComponent($$result2, "Icono", $$Icono, { "nombre": "corazon" })} </button> </div> <p class="mt-5 text-sm text-ink-soft">
Pedidos con 24 a 48 hs de anticipación.
<a${addAttribute(consulta, "href")} target="_blank" rel="noopener" class="font-medium text-accent underline-offset-4 hover:underline"> ${producto.precio === null ? "Consult\xE1 el precio por WhatsApp" : "\xBFDudas? Escribinos por WhatsApp"} </a> </p> ${relacionados.length > 0 && renderTemplate`<section class="mt-8" aria-labelledby="relacionados"> <h2 id="relacionados" class="mb-2.5 font-sans text-[13px] font-semibold">También te puede gustar</h2> <div class="grid grid-cols-3 gap-2.5"> ${relacionados.map((r) => renderTemplate`<a${addAttribute(`/producto/${r.slug}`, "href")} class="presionable block text-ink no-underline"> ${renderComponent($$result2, "Image", $$Image, { "src": r.foto, "alt": "", "widths": [160, 320], "sizes": "(min-width: 768px) 160px, 30vw", "loading": "lazy", "class": "aspect-square w-full rounded-2xl bg-tint object-cover" })} <span class="mt-1.5 block text-xs leading-snug md:text-sm">${r.nombre}</span> </a>`)} </div> </section>`} </div> </div> </div>  <div class="liquid fixed inset-x-3 bottom-[max(18px,env(safe-area-inset-bottom))] z-40 flex items-center gap-2.5 rounded-full p-2 md:hidden"> <div class="flex items-center rounded-full border border-line bg-field"> <button type="button" data-paso="-1" data-objetivo="cantidad" aria-label="Quitar uno" class="grid size-11 place-items-center">${renderComponent($$result2, "Icono", $$Icono, { "nombre": "menos", "size": 18 })}</button> <span id="cantidad" data-valor="1" aria-live="polite" class="min-w-[18px] text-center text-[15px] font-semibold tabular-nums">1</span> <button type="button" data-paso="1" data-objetivo="cantidad" aria-label="Agregar uno" class="grid size-11 place-items-center">${renderComponent($$result2, "Icono", $$Icono, { "nombre": "mas", "size": 18 })}</button> </div> <button type="button"${addAttribute(JSON.stringify(item), "data-agregar")} data-cantidad-ref="cantidad" class="liquid-bordo h-12 flex-1 rounded-full text-[15px] font-medium active:scale-[.98] transition-transform">
Agregar al pedido
</button> </div> ` })} `;
}, "C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/src/pages/producto/[id].astro", void 0);

const $$file = "C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/src/pages/producto/[id].astro";
const $$url = "/producto/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
