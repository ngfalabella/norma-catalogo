import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://catalogo-26.vercel.app',

  output: 'server',

  adapter: vercel({
    // Las fotos de src/assets/productos se optimizan con la Image Optimization de Vercel
    // (AVIF/WebP según el navegador). En desarrollo se usa sharp.
    imageService: true,
    imagesConfig: {
      sizes: [160, 320, 480, 640, 828, 1080, 1600],
      formats: ['image/avif', 'image/webp'],
    },
  }),

  vite: {
    plugins: [tailwindcss()],
  },
});
