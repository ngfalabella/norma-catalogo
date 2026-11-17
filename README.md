# Moka — Catálogo de Pastelería Artesanal

Catálogo web de una pastelería artesanal. La marca visible es **Moka** (de **Micaela Denapole**, "Mica").

No es una tienda online: no hay checkout ni pagos. El cliente arma un **pedido** en el navegador (botón `+` en cada producto) y lo **envía por WhatsApp** como un mensaje con el detalle y el total estimado. También puede guardar **favoritos** y **buscar** productos.

- **Producción:** https://catalogo-26.vercel.app (hosteado en Vercel)
- **WhatsApp de pedidos:** `+54 9 2324 650692`
- **Instagram:** https://www.instagram.com/mokaa.pasteleria/ (enlazado desde el footer)

---

## Stack

| Tecnología | Uso |
| --- | --- |
| [Astro 5](https://docs.astro.build) | Framework. Modo `output: 'server'` (SSR) |
| `@astrojs/vercel` (serverless) | Adapter para el deploy en Vercel. `imageService: true`: las fotos se optimizan con Vercel Image Optimization (AVIF/WebP) |
| Tailwind CSS 4 (`@tailwindcss/vite`) | Estilos. Los tokens están en `src/styles/global.css` (`@theme`) |
| `astro:assets` (`<Image>`) | Fotos responsive con `srcset` y carga diferida |
| `astro:transitions` (`<ClientRouter />`) | Navegación con View Transitions: la foto, el título y el precio "viajan" de la card al detalle |
| Google Fonts | `Fraunces` (serif variable con eje óptico) e `Inter` |
| `astro-icon` | Está instalado, pero no se usa (los íconos están en `Icono.astro`) |

## Comandos

| Comando | Acción |
| --- | --- |
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor local en `localhost:4321` |
| `npm run build` | Build de producción |
| `npm run preview` | Previsualiza el build |

> **`.env` local (opcional):** `PUBLIC_SHEET_URL=https://opensheet.elk.sh/1KzkuYU5amUXubRmFvkf81cLhrjc_NTEKzFzfS_Lr78k/catalogo`. Si falta, `src/lib/catalogo.ts` usa esa misma URL por defecto. No hacen falta credenciales, porque la planilla es pública. Está en `.gitignore`. En Vercel, la variable está en la configuración del proyecto.

---

## De dónde salen los datos (importante)

**Los productos se cargan desde una planilla de Google Sheets**, no desde el repo. La planilla se lee como JSON con [opensheet](https://opensheet.elk.sh) (pestaña `catalogo`). Las páginas son SSR (`prerender = false`) y piden los datos con `cache: "no-store"`. Así, **un cambio en la planilla se ve en el sitio sin redeployar**.

**Toda la lectura y la normalización está en [`src/lib/catalogo.ts`](src/lib/catalogo.ts)**. La usan el catálogo y el detalle, y la URL de la planilla está en un solo lugar.

Columnas de la planilla:

| Columna | Descripción |
| --- | --- |
| `id` | Identificador único. Se usa en la URL (`/producto/{id}`) **y como nombre de la foto** (`src/assets/productos/{id}.png`). Se le sacan los espacios a los costados |
| `nombre` | Se escribe en MAYÚSCULAS. `nombreLegible()` lo pasa a caja normal ("BROWNIE OREO" → "Brownie Oreo"). Los nombres propios que van con mayúscula están en `NOMBRES_PROPIOS` |
| `descripcion` | Texto del detalle. Se pone en mayúscula la primera letra |
| `precio` | **Número sin `$` ni puntos** (ej. `22000`). Si está vacío, es texto (`Consultar`) o es `0`, se muestra **"Consultar precio"** y no suma al total del pedido |
| `categoria` | Agrupa en secciones, en el orden en que aparece cada categoría por primera vez. Se le sacan los espacios a los costados y se genera un id sin acentos para las anclas (`#petit-fours`) |
| `etiqueta` *(opcional)* | Insignia sobre la foto: "Nuevo", "Sin TACC", "Por encargo". Si la columna no existe, no se muestra nada |
| `destacado` *(opcional)* | `sí` / `x` / `1`: ese producto es la card grande de su categoría. Si no hay ninguno marcado, se destaca el primero con foto. Solo hay card destacada en categorías de 3 productos o más |

`src/data/*.json|txt` son la versión vieja del catálogo, de antes de Google Sheets. **Ya no los usa nada.**

---

## Estructura

```text
/
├── astro.config.mjs              # SSR + Vercel (imageService, sizes 160…1600) + Tailwind
├── public/images/                # logo.png, social-image.png (preview al compartir), over.mp4 (video de la landing)
├── src/
│   ├── assets/productos/         # FOTOS DE PRODUCTOS: {id}.png (o .jpg/.webp). Las optimiza <Image>
│   ├── lib/catalogo.ts           # Lectura de la planilla, normalización, fotos por id, precios, WhatsApp
│   ├── pages/
│   │   ├── index.astro           # Landing: video a pantalla completa + "Ver catálogo" / WhatsApp
│   │   ├── catalogo.astro        # Hero, chips sticky, secciones por categoría (destacada + grilla)
│   │   └── producto/[id].astro   # Detalle: foto a sangre, hoja superpuesta, cantidad, "Agregar al pedido", relacionados
│   ├── layouts/Layout.astro      # <head>, fondo papel/aurora, header, footer, isla, hojas, scripts
│   ├── components/
│   │   ├── SiteHeader.astro      # Header de vidrio (56 px mobile / 64 px tablet+): logo, buscar, favoritos, pedido
│   │   ├── CategoryChips.astro   # Chips sticky con todas las categorías y píldora activa deslizante
│   │   ├── FeaturedCard.astro    # Card destacada (2 columnas) con tilt 3D y franja de vidrio
│   │   ├── ProductCard.astro     # Card de grilla: foto 4:5, nombre, precio, botón "+"
│   │   ├── FotoProducto.astro    # <Image> con blur-up o placeholder de marca "M · Foto en camino"
│   │   ├── BottomIsland.astro    # Isla flotante (solo mobile): Buscar · Pedir por WhatsApp · Favoritos
│   │   ├── Hojas.astro           # <dialog> inferior con 3 paneles: buscar, pedido, favoritos
│   │   ├── SiteFooter.astro      # Footer con CTA, Instagram y WhatsApp
│   │   ├── Icono.astro           # Íconos SVG de trazo
│   │   ├── LandingHero.astro
│   │   └── Welcome.astro         # Resto del starter de Astro, no se usa
│   ├── scripts/
│   │   ├── tienda.ts             # Pedido + favoritos (localStorage), búsqueda, hoja, vuelo de miniatura, mensaje de WhatsApp
│   │   ├── interacciones.ts      # Tinte del header según el scroll, scroll suave a categorías, scroll-spy de chips, tilt 3D
│   │   ├── transiciones.ts       # Nombra solo la card tocada para la View Transition card ↔ detalle
│   │   └── tema.ts               # Selector claro/oscuro con revelado circular (View Transition)
│   └── styles/global.css         # Tokens, vidrio, grano, animaciones por scroll, View Transitions
```

**Notas sobre el `ClientRouter`:** Astro reemplaza el `<body>` en cada navegación sin recargar los scripts. Por eso `tienda.ts` registra sus listeners **una sola vez**, delegados en `document`, e `interacciones.ts` se reinicia en cada `astro:page-load` (con un `AbortController` para limpiar).

---

## Diseño: "Patisserie de vidrio"

Sale del informe crítico de diseño (12/11/2026) y de su prototipo visual (artifact de Claude "Design", con mobile, tablet, detalle y storyboard de transiciones). Las fotos son protagonistas, la interfaz es una capa de vidrio esmerilado encima y el movimiento es lento y suave.

| Token (Tailwind) | Color | Uso |
| --- | --- | --- |
| `cocoa-950` | `#2A0910` | Texto principal, footer |
| `cocoa-600` | `#6B4E52` | Texto secundario (contraste 7:1 sobre crema) |
| `bordo-700` | `#5A1626` | Acento, botones, píldora activa |
| `rose-200` | `#F1DCD6` | Placeholders, fondos alternos |
| `sand-200` | `#EBD3B4` | Aurora del fondo |
| `cream-50` | `#FBF7F1` | Fondo base |
| `gold-400` | `#C9A46A` | Contador del pedido, detalles |

**Esos colores de marca no cambian con el tema.** La interfaz usa tokens **semánticos**, que sí cambian: `paper` / `paper-2` (fondo), `ink` (texto), `ink-soft` (secundario), `tint` (placeholders, hover), `accent` (precios, enlaces), `line` (bordes) y `field` (campos). Ejemplos: `bg-paper`, `text-ink`, `border-line`. Para algo nuevo hay que usar estos y no `cream-50` / `cocoa-950`; si no, el tema oscuro se rompe.

- **Tema claro/oscuro:** `data-theme="light|dark"` en `<html>`. Un script inline en el `<head>` del Layout lo pone antes de pintar, a partir de `localStorage` (`moka:tema`) o de la preferencia del sistema, y lo reaplica en `astro:after-swap`. El botón sol/luna del header usa `scripts/tema.ts` y revela el tema nuevo en círculo desde el botón. Variante Tailwind: `dark:`. En el detalle en mobile no hay header, así que no hay selector.
- **Header:** liquid glass arriba del todo. **El bordó sigue al scroll:** `interacciones.ts` escribe `--p` (0 → 1 en los primeros 180 px, con interpolación por cuadro para que nunca salte) y `--pt` (la misma curva concentrada en el medio, para los textos) en el `<header>`. La tinta (`.header-tinta`) usa `opacity: var(--p)` y textos, íconos y campo se mezclan con `color-mix` (clases `.h-ink`, `.h-soft`, `.h-campo`, `.h-sobre-tinta`). La velocidad se ajusta con `RECORRIDO` y el factor `0.14`.
- **Scroll a una categoría:** `scrollSuaveA()` en `interacciones.ts`, con ease-in-out cúbica y una duración de 0,6 a 1,1 s según la distancia. Se cancela si la persona toca la pantalla, usa la rueda o el teclado.
- **Fondo:** luz cenital, degradé vertical `paper` → `paper-2`, dos auroras y grano de papel (`.fondo-papel`).
- **WhatsApp:** botón flotante verde abajo a la derecha (`BotonWhatsApp.astro`). En mobile queda arriba de la isla. La isla dice "Mi pedido" para no confundirse con el contacto directo.

- **Tipografía:** `font-serif` = Fraunces (títulos en caja normal, peso 400–500) y `font-sans` = Inter (precios con `tabular-nums`). Nada por debajo de 12 px.
- **Tono:** sobrio, informativo, nada de eslóganes. El encabezado tiene tres niveles: "Pastelería artesanal" (título grande), una línea fina y debajo "Catálogo online" + "Los pedidos se confirman por WhatsApp."
- **Liquid glass** (`.liquid`): degradé claro, `backdrop-filter`, borde especular hecho con máscara y brillo interno. Se usa solo en piezas únicas que flotan sobre fotos: header, isla, franja de la card destacada, controles y barra del detalle, y botón de WhatsApp de la landing. `.liquid-bordo` es la versión "gel" para la píldora activa y los botones principales.
- **Rendimiento:** `backdrop-filter` va solo en esas piezas únicas. Lo que se repite (chips, botones `+`, etiquetas) usa `.glass-soft`, que es opaco y no tiene blur. Las animaciones solo mueven `opacity` y `transform`, sin `filter: blur` animado, y la aurora es un degradé radial.
- **Otras clases** (`global.css`): `.presionable` (scale .97 al tocar), `.tilt`, `.aparece` (entrada con `animation-timeline: view()`), `.hero-colapsa`, `.foto` (fundido al cargar).
- **Grilla:** 2 columnas en mobile, 3 en tablet y 4 en desktop. La destacada ocupa 2.
- **View Transitions:** el detalle tiene nombres fijos (`vt-foto`, `vt-titulo`, `vt-precio`). En el catálogo, `src/scripts/transiciones.ts` le pone esos nombres **solo a la card tocada**: a la ida en `astro:before-preparation` y a la vuelta en `astro:after-swap`. Después los limpia. No hay que volver a poner `transition:name` en todas las cards, porque así cada navegación capturaba ~160 capas y se trababa. La ida sube 12 px (0,34 s) y la vuelta se "hunde" (escala .96), un 15% más rápida; las dos usan `html[data-astro-transition]`. La lupa se transforma en la hoja (`view-transition-name: hoja`). Los resultados de búsqueda solo tienen nombre mientras se filtra (clase `.animando`).
- **Accesibilidad:** todo el movimiento respeta `prefers-reduced-motion`, el foco visible es un anillo bordó, los botones tienen 44 px como mínimo y las hojas son `<dialog>` nativos (Esc cierra).
- Al trabajar en UI en este proyecto, usar el skill `frontend-design`.

---

## Tareas frecuentes

**Cambiar un precio o una descripción** → se edita en la planilla. No hace falta tocar código.

**Agregar un producto**
1. Agregar una fila en la planilla con un `id` nuevo en minúsculas, con guiones y sin espacios.
2. Poner la foto en **`src/assets/productos/{id}.png`** (también sirven `.jpg` y `.webp`), con el nombre igual al id. Conviene que sea vertical 4:5 o cuadrada. No hace falta achicarla: `<Image>` la optimiza.
3. Commit y push. Las fotos sí necesitan deploy. Mientras no haya foto, se muestra el placeholder "Foto en camino".

Las categorías nuevas aparecen solas en los chips y en la búsqueda.

**Prefijos de id que se usan:** `mc-` = minicake, `brownie-`, `cheesecake-`, `alfajor-`, `cookies-`, `tarta-`, `torta-`.

**Mensajes de WhatsApp:** el del pedido se arma en `mensajePedido()` de `src/scripts/tienda.ts` (el número está en `WHATSAPP`, en ese mismo archivo y en `src/lib/catalogo.ts`). La consulta individual está en `src/pages/producto/[id].astro`.

**Deploy** → push a `main`, y Vercel deploya solo. Los commits son cortos y en español ("Fix imagenes", "Chocotorta").

---

## Pendientes

1. **Productos sin foto** (al 12/11/2026): `cheesecake-blanco`, `mc-tarta-maracuya`, `mc-ck-ft`, `mc-ck-pistacho`, `mc-brownie-crema`, `mc-brownie-rojos`, `scons-queso`, `carrot`, `red velvet`, `cookies-av`, `cookies-pist`, `cookies-vai`, `cookies-rockets`, `brownie-merengue`, `alfajor-limon`, `alfajor-frambuesa`, `Granola `. Conviene corregir en la planilla los ids con espacios o mayúsculas.
2. **Footer:** faltan horarios y zona de entrega (no están en ningún lado; agregarlos en `SiteFooter.astro`).
3. **Filtros de búsqueda** por tamaño o "sin TACC": necesitan columnas nuevas en la planilla.
4. **Producto 3D girable** (`<model-viewer>`) del informe: no está implementado, porque necesita modelos `.glb` o secuencias de fotos.
5. Sobras: `Welcome.astro`, `src/assets/astro.svg|background.svg`, `src/data/`, `astro-icon` y el `.env` repetido en `.gitignore`.
