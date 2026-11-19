import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Repository: https://github.com/Ozsefuenla/cemollet-web (see CHANGELOG.md).
export default defineConfig({
  site: 'https://ozsefuenla.github.io',
  base: '/cemollet-web',
  output: 'static',
  integrations: [tailwind({ applyBaseStyles: false })],
});
