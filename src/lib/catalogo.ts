import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

/** Planilla pública (opensheet). Se puede sobreescribir con PUBLIC_SHEET_URL. */
const SHEET_URL_POR_DEFECTO =
  'https://opensheet.elk.sh/1KzkuYU5amUXubRmFvkf81cLhrjc_NTEKzFzfS_Lr78k/catalogo';
export const SHEET_URL: string = import.meta.env.PUBLIC_SHEET_URL || SHEET_URL_POR_DEFECTO;

export const WHATSAPP = '5492324650692';
export const INSTAGRAM = 'https://www.instagram.com/mokaa.pasteleria/';
export const whatsappLink = (texto?: string) =>
  `https://wa.me/${WHATSAPP}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`;

export interface Producto {
  /** id tal como está en la planilla, sin espacios a los costados */
  id: string;
  /** id apto para URL (/producto/{slug}) */
  slug: string;
  /** id apto para view-transition-name y atributos HTML */
  vt: string;
  nombre: string;
  descripcion: string;
  /** null = "Consultar precio" (texto, vacío o 0 en la planilla) */
  precio: number | null;
  precioTexto: string;
  categoria: string;
  categoriaId: string;
  foto?: ImageMetadata;
  /** Columna opcional "etiqueta" (ej. Nuevo, Sin TACC, Por encargo) */
  etiqueta?: string;
  /** Columna opcional "destacado" (sí / x / 1) */
  destacado: boolean;
}

export interface Categoria {
  nombre: string;
  id: string;
  productos: Producto[];
}

/* ---------- Fotos: src/assets/productos/{id}.{png,jpg,webp...} ---------- */

const archivos = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/productos/*.{png,jpg,jpeg,webp,avif,PNG,JPG,JPEG,WEBP}',
  { eager: true },
);

const fotos = new Map<string, ImageMetadata>();
for (const [ruta, mod] of Object.entries(archivos)) {
  const archivo = decodeURIComponent(ruta.split('/').pop()!).normalize('NFC');
  const punto = archivo.lastIndexOf('.');
  const clave = archivo.slice(0, punto).trim().toLowerCase();
  const esPng = archivo.slice(punto + 1).toLowerCase() === 'png';
  // Si hay dos formatos para el mismo id, gana el .png (es el que se viene actualizando)
  if (!fotos.has(clave) || esPng) fotos.set(clave, mod.default);
}

export const fotoDe = (id: string) => fotos.get(id.normalize('NFC').trim().toLowerCase());

/* ---------- Normalización de textos ---------- */

export const aId = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Palabras que mantienen mayúscula al pasar los nombres a caja normal. */
const NOMBRES_PROPIOS: Record<string, string> = {
  oreo: 'Oreo',
  patagonia: 'Patagonia',
  matilda: 'Matilda',
  bariloche: 'Bariloche',
  cabsha: 'Cabsha',
  rocklets: 'Rocklets',
  ny: 'NY',
  'red velvet': 'Red Velvet',
};

/** "BROWNIE OREO" → "Brownie Oreo" · "TARTA DE FRUTILLA" → "Tarta de frutilla" */
export function nombreLegible(crudo: string) {
  const base = crudo.trim().replace(/\s+/g, ' ').toLocaleLowerCase('es-AR');
  let nombre = base.charAt(0).toLocaleUpperCase('es-AR') + base.slice(1);
  for (const [palabra, reemplazo] of Object.entries(NOMBRES_PROPIOS)) {
    nombre = nombre.replace(new RegExp(`(^|\\s)${palabra}(?=\\s|$)`, 'gi'), `$1${reemplazo}`);
  }
  return nombre;
}

const capitalizar = (s: string) => s.charAt(0).toLocaleUpperCase('es-AR') + s.slice(1);

const formato = new Intl.NumberFormat('es-AR');
export const formatoPrecio = (precio: number | null) =>
  precio === null ? 'Consultar precio' : `$ ${formato.format(precio)}`;

function leerPrecio(valor: unknown): number | null {
  const limpio = String(valor ?? '').replace(/[$\s.]/g, '').replace(',', '.');
  const n = Number(limpio);
  return limpio && Number.isFinite(n) && n > 0 ? n : null;
}

const esVerdadero = (v: unknown) => /^(s[ií]|x|1|true)$/i.test(String(v ?? '').trim());

/* ---------- Lectura de la planilla ---------- */

type Fila = Record<string, unknown>;

export async function getProductos(): Promise<Producto[]> {
  const res = await fetch(SHEET_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`No se pudo leer la planilla (${res.status})`);
  const data = await res.json();
  const filas: Fila[] = Array.isArray(data) ? data : data?.data ?? Object.values(data ?? {});

  return filas
    .filter((f) => String(f.id ?? '').trim() && String(f.nombre ?? '').trim())
    .map((f) => {
      const id = String(f.id).trim();
      const categoria = String(f.categoria ?? 'Otros').trim() || 'Otros';
      const precio = leerPrecio(f.precio);
      const etiqueta = String(f.etiqueta ?? '').trim() || undefined;
      return {
        id,
        slug: encodeURIComponent(id),
        vt: aId(id) || 'producto',
        nombre: nombreLegible(String(f.nombre)),
        descripcion: capitalizar(String(f.descripcion ?? '').trim()),
        precio,
        precioTexto: formatoPrecio(precio),
        categoria,
        categoriaId: aId(categoria) || 'otros',
        foto: fotoDe(id),
        etiqueta,
        destacado: esVerdadero(f.destacado),
      };
    });
}

/** Agrupa respetando el orden en que cada categoría aparece por primera vez en la planilla. */
export function agruparPorCategoria(productos: Producto[]): Categoria[] {
  const grupos = new Map<string, Categoria>();
  for (const p of productos) {
    if (!grupos.has(p.categoriaId)) grupos.set(p.categoriaId, { nombre: p.categoria, id: p.categoriaId, productos: [] });
    grupos.get(p.categoriaId)!.productos.push(p);
  }
  return [...grupos.values()];
}

/** El destacado de la categoría: el marcado en la planilla o, si no hay, el primero con foto. */
export function destacadoDe(categoria: Categoria): Producto | undefined {
  if (categoria.productos.length < 3) return undefined;
  return categoria.productos.find((p) => p.destacado && p.foto) ?? categoria.productos.find((p) => p.foto);
}

/** Datos mínimos que usa el navegador (búsqueda, pedido, favoritos). */
export interface ItemCliente {
  id: string;
  nombre: string;
  precio: number | null;
  categoria: string;
  url: string;
  thumb: string | null;
}

export async function aItemCliente(p: Producto): Promise<ItemCliente> {
  const thumb = p.foto ? (await getImage({ src: p.foto, width: 160 })).src : null;
  return { id: p.id, nombre: p.nombre, precio: p.precio, categoria: p.categoria, url: `/producto/${p.slug}`, thumb };
}
