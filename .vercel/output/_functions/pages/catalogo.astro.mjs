import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderComponent, d as renderTemplate } from '../chunks/astro/server_Cm3X-lg3.mjs';
import 'piccolore';
import { $ as $$FotoProducto, a as $$Icono, b as $$Layout } from '../chunks/FotoProducto_FH_DtY0d.mjs';
import 'clsx';
import { g as getProductos, a as agruparPorCategoria, b as aItemCliente, d as destacadoDe } from '../chunks/catalogo_BbyxwB-f.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$2 = createAstro("https://catalogo-26.vercel.app");
const $$ProductCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$ProductCard;
  const { producto, item, eager = false } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<article class="aparece relative"${addAttribute(producto.id, "data-producto")}> <a${addAttribute(`/producto/${producto.slug}`, "href")} class="presionable group block rounded-[var(--radius-card)] text-ink no-underline"> <div class="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-tint shadow-warm"> ${renderComponent($$result, "FotoProducto", $$FotoProducto, { "producto": producto, "eager": eager, "widths": [320, 480, 640], "sizes": "(min-width: 1024px) 270px, (min-width: 768px) 32vw, 50vw", "class": "transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.04]" })} ${producto.etiqueta && renderTemplate`<span class="glass-soft absolute left-2.5 top-2.5 rounded-full px-2.5 py-1.5 text-xs font-medium">${producto.etiqueta}</span>`} </div> <h3 class="mx-1 mt-2.5 font-serif text-base font-medium leading-tight md:text-lg" data-vt="titulo"> ${producto.nombre} </h3> <p${addAttribute(["mx-1 mt-1 text-sm font-semibold tabular-nums md:text-[15px]", producto.precio === null ? "text-ink-soft font-medium" : "text-accent"], "class:list")} data-vt="precio"> ${producto.precioTexto} </p> </a> <!-- Capa del tamaño de la foto: el botón "+" queda en su esquina sin anidarse dentro del enlace --> <div class="pointer-events-none absolute inset-x-0 top-0 aspect-[4/5]"> <button type="button"${addAttribute(JSON.stringify(item), "data-agregar")}${addAttribute(`Sumar ${producto.nombre} al pedido`, "aria-label")} class="glass-soft pointer-events-auto absolute bottom-2 right-2 grid size-11 place-items-center rounded-full text-accent transition-[scale,background-color] duration-200 hover:bg-cream-50 active:scale-90"> ${renderComponent($$result, "Icono", $$Icono, { "nombre": "mas", "size": 16 })} </button> </div> </article>`;
}, "C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/src/components/ProductCard.astro", void 0);

const $$Astro$1 = createAstro("https://catalogo-26.vercel.app");
const $$FeaturedCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$FeaturedCard;
  const { producto, item, eager = false } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<article class="aparece relative col-span-2"${addAttribute(producto.id, "data-producto")}> <a${addAttribute(`/producto/${producto.slug}`, "href")} class="tilt presionable relative block h-[330px] overflow-hidden rounded-[var(--radius-feature)] bg-tint text-ink no-underline shadow-feature md:h-[370px]"> ${renderComponent($$result, "FotoProducto", $$FotoProducto, { "producto": producto, "eager": eager, "widths": [480, 640, 828, 1080], "sizes": "(min-width: 1024px) 560px, (min-width: 768px) 66vw, 100vw", "class": "absolute inset-0" })} ${producto.etiqueta && renderTemplate`<span class="glass-soft absolute left-3.5 top-3.5 rounded-full px-3 py-[7px] text-xs font-medium">${producto.etiqueta}</span>`} <div class="liquid absolute inset-x-2.5 bottom-2.5 flex items-center justify-between rounded-[20px] py-3.5 pl-4 pr-[68px] md:right-auto md:w-[320px]"> <div class="min-w-0"> <h3 class="truncate font-serif text-[22px] font-medium tracking-[-.01em] md:text-2xl" data-vt="titulo"> ${producto.nombre} </h3> <p class="mt-0.5 text-[15px] font-semibold tabular-nums md:text-base" data-vt="precio"> ${producto.precioTexto} </p> </div> </div> </a> <button type="button"${addAttribute(JSON.stringify(item), "data-agregar")}${addAttribute(`Sumar ${producto.nombre} al pedido`, "aria-label")} class="liquid-bordo absolute bottom-[22px] right-[22px] grid size-11 place-items-center rounded-full transition-[scale,filter] duration-200 hover:brightness-110 active:scale-90 md:left-[278px] md:right-auto"> ${renderComponent($$result, "Icono", $$Icono, { "nombre": "mas", "size": 18 })} </button> </article>`;
}, "C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/src/components/FeaturedCard.astro", void 0);

const $$Astro = createAstro("https://catalogo-26.vercel.app");
const $$CategoryChips = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CategoryChips;
  const { categorias } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<nav aria-label="Categorías" class="sticky top-[76px] z-30 -mx-4 mt-4 py-2 md:top-[88px] md:-mx-6" data-chips> <div class="sin-scrollbar relative flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-px-4 px-4 md:scroll-px-6 md:px-6" data-chips-fila> <!-- Píldora activa: se desliza (y se estira en el camino) de un chip al otro --> <span aria-hidden="true" data-pildora class="liquid-bordo pointer-events-none absolute left-0 top-0 h-10 rounded-full opacity-0"></span> ${categorias.map((c, i) => renderTemplate`<a${addAttribute(`#${c.id}`, "href")}${addAttribute(c.id, "data-chip")}${addAttribute(i === 0 ? "true" : void 0, "aria-current")} class="glass-soft relative flex h-10 shrink-0 snap-start items-center whitespace-nowrap rounded-full border-line px-4 text-sm font-medium text-ink no-underline transition-colors duration-300 aria-[current=true]:border-transparent aria-[current=true]:bg-transparent aria-[current=true]:text-cream-50 aria-[current=true]:shadow-none"> <span class="relative">${c.nombre}</span> </a>`)} </div> </nav>`;
}, "C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/src/components/CategoryChips.astro", void 0);

const prerender = false;
const $$Catalogo = createComponent(async ($$result, $$props, $$slots) => {
  const productos = await getProductos();
  const categorias = agruparPorCategoria(productos);
  const items = await Promise.all(productos.map(aItemCliente));
  const itemDe = new Map(items.map((i) => [i.id, i]));
  const total = categorias.length;
  const dosDigitos = (n) => String(n).padStart(2, "0");
  let primeras = 0;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Cat\xE1logo | Moka", "items": items, "categorias": categorias.map(({ nombre, id }) => ({ nombre, id })) }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mx-auto max-w-6xl px-4 md:px-6"> <!-- Tres niveles: título (marca del oficio), línea fina, y debajo qué es la página + cómo se pide --> <section class="hero-colapsa pb-1 pt-9 md:pb-2 md:pt-16"> <h1 class="font-serif text-[46px] font-normal leading-[.95] tracking-[-.035em] [font-variation-settings:'opsz'_144] md:text-[76px] lg:text-[88px]">
Pastelería<br class="md:hidden"> artesanal
</h1> <div class="mt-6 flex flex-col gap-1 border-t border-line pt-4 md:mt-8 md:flex-row md:items-baseline md:justify-between md:pt-5"> <p class="font-serif text-[22px] font-light tracking-[-.01em] md:text-[28px]">Catálogo online</p> <p class="text-sm text-ink-soft md:text-[15px]">Los pedidos se confirman por WhatsApp.</p> </div> </section> ${renderComponent($$result2, "CategoryChips", $$CategoryChips, { "categorias": categorias })} <div class="space-y-14 pb-8 pt-6 md:space-y-20"> ${categorias.map((categoria, i) => {
    const destacado = destacadoDe(categoria);
    const resto = categoria.productos.filter((p) => p !== destacado);
    return renderTemplate`<section${addAttribute(categoria.id, "id")}${addAttribute(`t-${categoria.id}`, "aria-labelledby")} class="scroll-mt-36 md:scroll-mt-40"> <div class="flex items-end justify-between px-1 pb-3.5 md:mb-5 md:border-b md:border-line md:pb-4"> <div> <p class="mb-0.5 text-xs font-medium tracking-[.08em] text-ink-soft tabular-nums"> ${dosDigitos(i + 1)} / ${dosDigitos(total)} </p> <h2${addAttribute(`t-${categoria.id}`, "id")} class="font-serif text-[34px] font-normal tracking-[-.02em] md:text-[40px]"> ${categoria.nombre} </h2> </div> <p class="mb-1.5 text-[13px] text-ink-soft md:text-sm"> ${categoria.productos.length} ${categoria.productos.length === 1 ? "producto" : "productos"} </p> </div> <div class="grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-3 md:gap-x-4 md:gap-y-6 lg:grid-cols-4"> ${destacado && renderTemplate`${renderComponent($$result2, "FeaturedCard", $$FeaturedCard, { "producto": destacado, "item": itemDe.get(destacado.id), "eager": i === 0 })}`} ${resto.map((p) => renderTemplate`${renderComponent($$result2, "ProductCard", $$ProductCard, { "producto": p, "item": itemDe.get(p.id), "eager": primeras++ < 4 })}`)} </div> </section>`;
  })} </div> </div> ` })}`;
}, "C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/src/pages/catalogo.astro", void 0);

const $$file = "C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/src/pages/catalogo.astro";
const $$url = "/catalogo";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Catalogo,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
