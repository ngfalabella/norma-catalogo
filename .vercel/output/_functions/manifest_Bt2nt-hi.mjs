import 'piccolore';
import { v as decodeKey } from './chunks/astro/server_Cm3X-lg3.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_BU0stHQ7.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/","cacheDir":"file:///C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/node_modules/.astro/","outDir":"file:///C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/dist/","srcDir":"file:///C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/src/","publicDir":"file:///C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/public/","buildClientDir":"file:///C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/dist/client/","buildServerDir":"file:///C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/catalogo.Bp80Tn3u.css"},{"type":"inline","content":"@keyframes astroFadeInOut{0%{opacity:1}to{opacity:0}}@keyframes astroFadeIn{0%{opacity:0;mix-blend-mode:plus-lighter}to{opacity:1;mix-blend-mode:plus-lighter}}@keyframes astroFadeOut{0%{opacity:1;mix-blend-mode:plus-lighter}to{opacity:0;mix-blend-mode:plus-lighter}}@keyframes astroSlideFromRight{0%{transform:translate(100%)}}@keyframes astroSlideFromLeft{0%{transform:translate(-100%)}}@keyframes astroSlideToRight{to{transform:translate(100%)}}@keyframes astroSlideToLeft{to{transform:translate(-100%)}}@media(prefers-reduced-motion){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}[data-astro-transition-scope]{animation:none!important}}.hoja{max-height:none}.hoja[open]{animation:hoja-sube .42s var(--ease-soft)}@keyframes hoja-sube{0%{translate:0 40px;opacity:0}}@media(prefers-reduced-motion:reduce){.hoja[open]{animation:none}}.filtro{flex-shrink:0;height:36px;padding:0 14px;border-radius:999px;font-size:14px;font-weight:500;border:1px solid var(--color-line);background:var(--color-field);color:var(--color-ink);transition:background-color .3s,color .3s,border-color .3s}.filtro[aria-pressed=true]{background:var(--color-bordo-700);border-color:var(--color-bordo-700);color:var(--color-cream-50)}[data-aviso][data-visible]{opacity:1;translate:0 0}\n"}],"routeData":{"route":"/catalogo","isIndex":false,"type":"page","pattern":"^\\/catalogo\\/?$","segments":[[{"content":"catalogo","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/catalogo.astro","pathname":"/catalogo","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/catalogo.Bp80Tn3u.css"},{"type":"inline","content":".favorito[aria-pressed=true] svg{fill:currentColor}\n@keyframes astroFadeInOut{0%{opacity:1}to{opacity:0}}@keyframes astroFadeIn{0%{opacity:0;mix-blend-mode:plus-lighter}to{opacity:1;mix-blend-mode:plus-lighter}}@keyframes astroFadeOut{0%{opacity:1;mix-blend-mode:plus-lighter}to{opacity:0;mix-blend-mode:plus-lighter}}@keyframes astroSlideFromRight{0%{transform:translate(100%)}}@keyframes astroSlideFromLeft{0%{transform:translate(-100%)}}@keyframes astroSlideToRight{to{transform:translate(100%)}}@keyframes astroSlideToLeft{to{transform:translate(-100%)}}@media(prefers-reduced-motion){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}[data-astro-transition-scope]{animation:none!important}}.hoja{max-height:none}.hoja[open]{animation:hoja-sube .42s var(--ease-soft)}@keyframes hoja-sube{0%{translate:0 40px;opacity:0}}@media(prefers-reduced-motion:reduce){.hoja[open]{animation:none}}.filtro{flex-shrink:0;height:36px;padding:0 14px;border-radius:999px;font-size:14px;font-weight:500;border:1px solid var(--color-line);background:var(--color-field);color:var(--color-ink);transition:background-color .3s,color .3s,border-color .3s}.filtro[aria-pressed=true]{background:var(--color-bordo-700);border-color:var(--color-bordo-700);color:var(--color-cream-50)}[data-aviso][data-visible]{opacity:1;translate:0 0}\n"}],"routeData":{"route":"/producto/[id]","isIndex":false,"type":"page","pattern":"^\\/producto\\/([^/]+?)\\/?$","segments":[[{"content":"producto","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/producto/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/catalogo.Bp80Tn3u.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://catalogo-26.vercel.app","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/src/components/SiteHeader.astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/src/layouts/Layout.astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/src/pages/catalogo.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/catalogo@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/src/pages/producto/[id].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/producto/[id]@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/src/components/BottomIsland.astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/src/components/BotonWhatsApp.astro",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/catalogo@_@astro":"pages/catalogo.astro.mjs","\u0000@astro-page:src/pages/producto/[id]@_@astro":"pages/producto/_id_.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_Bt2nt-hi.mjs","C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/node_modules/@astrojs/vercel/dist/image/build-service.js":"chunks/build-service_DEvS9F3o.mjs","C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts":"_astro/Layout.astro_astro_type_script_index_0_lang.B5S2ZZe4.js","C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/src/components/LandingHero.astro?astro&type=script&index=0&lang.ts":"_astro/LandingHero.astro_astro_type_script_index_0_lang.DznrjeDf.js","C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts":"_astro/ClientRouter.astro_astro_type_script_index_0_lang.QW52Ox2j.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/Users/nicol/OneDrive/Desktop/Aplicaciones/norma-catalogo/src/components/LandingHero.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"astro:page-load\",()=>{const e=document.getElementById(\"hero-video\");if(!e)return;const t=()=>e.play().catch(()=>{});t(),document.addEventListener(\"touchstart\",t,{once:!0})});"]],"assets":["/_astro/alfajor-chocolate.wuLvptgX.jpg","/_astro/alfajor-chocolate.DJNw7Mis.png","/_astro/alfajorcitos-maicena.8dI0FyWf.png","/_astro/alfajorcitos-nuez.Bq8KFz0K.png","/_astro/brownie-frutilla.CrXGHktH.png","/_astro/brownie-frutos-rojos.BoNok30X.png","/_astro/brownie-oreo.DN91VWwR.png","/_astro/cheesecake-frio.CZeA95n9.png","/_astro/cheesecake-pistacho.DuOAZjOB.png","/_astro/chocotorta.z7UnkxF7.png","/_astro/mc-brownie.hAdFDmtV.png","/_astro/mc-coco.h-L2uF1y.png","/_astro/mc-mouse-choc.tcDFr2E0.png","/_astro/mc-pastrafrola.DbjWeL75.jpg","/_astro/pastafrolas.BiI5iqef.png","/_astro/tarta-avellanas.CRXg_QTY.png","/_astro/tarta-coco.Dvkb7dwV.png","/_astro/tiramisu.-CoT5MyO.png","/_astro/tarta-frutilla.DMnSRuT_.png","/_astro/torta-patagonia.qGjR14y-.png","/_astro/brownie-brc.Bqtbk8Oq.png","/_astro/keylime.CsrQM9lI.png","/_astro/mc-brownie-ddl.Dx6X9O5O.png","/_astro/brownie-crema.hq8rF5FF.png","/_astro/cabsha.B6MbInDM.png","/_astro/brownie-merengue.BXj_e-dt.png","/_astro/chocotorta-redonda.BRgA8oHm.png","/_astro/mousse-chocolate.lAAs4uHC.png","/_astro/petit-fours.CBIqinrQ.png","/_astro/rogel.L0e5rh7L.png","/_astro/lemon-pie.Ba4p9ATa.png","/_astro/tres-sueños.DkicXvXm.png","/_astro/torta-matilda.DGz-i5bP.png","/_astro/mc-brownie-oreo.CTRypOMw.png","/_astro/mc-cabsha.Di26ErUQ.png","/_astro/brownie-clasico.DlnM7E_t.png","/_astro/mc-keylime.BSB5bNdB.png","/_astro/mc-lemon-pie.DJhkSraC.png","/_astro/mc-pastrafrola.Dsh7aT3G.png","/_astro/brownie-solo.BfIDg0J1.png","/_astro/catalogo.Bp80Tn3u.css","/favicon.svg","/logo.svg","/logooo.svg","/images/logo-emblema-chico.png","/images/logo-emblema.png","/images/logo.png","/images/over.mp4","/images/social-image.png","/_astro/ClientRouter.astro_astro_type_script_index_0_lang.QW52Ox2j.js","/_astro/Layout.astro_astro_type_script_index_0_lang.B5S2ZZe4.js"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"ef69Nv3bkx82ggsYm9dnynpkxSLYDi+DDOCINRN+Tpw="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
