// Build frame for the kb export: just enough to render the pages as the desk sees them.
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const runbook = fileURLToPath(new URL('./src/lib/layouts/runbook.svelte', import.meta.url));

export default defineConfig({
  plugins: [
    sveltekit({
      extensions: ['.svelte', '.svx'],
      preprocess: [vitePreprocess(), mdsvex({ extensions: ['.svx'], layout: { runbook } })],
      adapter: adapter({ pages: 'build', assets: 'build', strict: true }),
      alias: { '#lib': 'src/lib' },
      prerender: { entries: ['/kb'] },
    }),
  ],
});
