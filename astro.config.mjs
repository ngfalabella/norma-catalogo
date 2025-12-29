import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  
  site: 'https://catalogo-26.vercel.app', 
  
  vite: {
    plugins: [tailwindcss()]
  }
});