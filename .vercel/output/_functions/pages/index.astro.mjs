import { a as createComponent, m as maybeRenderHead, b as addAttribute, f as renderScript, d as renderTemplate, c as createAstro, r as renderComponent, h as renderHead } from '../chunks/astro/server_Cm3X-lg3.mjs';
import 'piccolore';
import 'clsx';
import { w as whatsappLink, $ as $$ClientRouter } from '../chunks/catalogo_-1tqFzJQ.mjs';
/* empty css                                    */
export { renderers } from '../renderers.mjs';

const $$LandingHero = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="relative h-dvh w-full overflow-hidden bg-cocoa-950"> <div class="absolute inset-0"> <video id="hero-video" autoplay loop muted playsinline preload="auto" class="size-full object-cover"> <source src="/images/over.mp4" type="video/mp4"> </video> <div class="absolute inset-0 bg-[linear-gradient(to_top,rgb(42_9_16/.75),rgb(42_9_16/.25)_55%,rgb(42_9_16/.45))]"></div> </div> <div class="relative z-10 flex h-full flex-col items-center justify-end px-5 pb-[max(48px,env(safe-area-inset-bottom))] text-center md:justify-center md:pb-0"> <span aria-hidden="true" class="emblema emblema-chico mb-5 h-20 text-cream-50 md:h-24"></span> <h1 class="font-serif text-6xl font-normal tracking-[-.03em] text-cream-50 [font-variation-settings:'opsz'_144] md:text-8xl">Moka</h1> <p class="mb-10 mt-3 text-sm text-cream-50/85 md:text-base">Pastelería artesanal de Micaela Denapole</p> <div class="flex w-full max-w-xs flex-col gap-3"> <a href="/catalogo" class="flex h-14 items-center justify-center rounded-full bg-cream-50 text-[15px] font-semibold text-cocoa-950 no-underline shadow-float transition-transform duration-300 active:scale-[.97] hover:scale-[1.02]">
Ver catálogo
</a> <a${addAttribute(whatsappLink(), "href")} target="_blank" rel="noopener" class="liquid flex h-14 items-center justify-center rounded-full text-[15px] font-semibold text-cream-50 no-underline [background:linear-gradient(180deg,rgb(255_255_255/.22),rgb(255_255_255/.06))] transition-[filter] duration-300 hover:brightness-125">
Escribinos por WhatsApp
</a> </div> </div> </section> ${renderScript($$result, "C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/src/components/LandingHero.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/src/components/LandingHero.astro", void 0);

const $$Astro = createAstro("https://catalogo-26.vercel.app");
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const titulo = "Moka | Pasteler\xEDa artesanal";
  const descripcion = "Pasteler\xEDa artesanal de Micaela Denapole. Cat\xE1logo online de tortas, brownies, cheesecakes, minicakes y m\xE1s. Pedidos por WhatsApp.";
  const imagen = new URL("/images/social-image.png", Astro2.site);
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#2A0910"><meta name="description"${addAttribute(descripcion, "content")}><link rel="icon" type="image/svg+xml" href="/logooo.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"><title>${titulo}</title><meta property="og:type" content="website"><meta property="og:title"${addAttribute(titulo, "content")}><meta property="og:description"${addAttribute(descripcion, "content")}><meta property="og:image"${addAttribute(imagen, "content")}>${renderComponent($$result, "ClientRouter", $$ClientRouter, { "fallback": "animate" })}${renderHead()}</head> <body class="overflow-hidden bg-cocoa-950 font-sans antialiased"> <main> ${renderComponent($$result, "LandingHero", $$LandingHero, {})} </main> </body></html>`;
}, "C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/src/pages/index.astro", void 0);

const $$file = "C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
