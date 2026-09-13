import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com', // TODO: replace with final domain
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
