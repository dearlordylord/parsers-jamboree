import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
//import Icons from "unplugin-icons/vite";

// https://astro.build/config
export default defineConfig({
  site: 'https://www.typescript-validators.com',
  outDir: '../../dist/apps/astro-jamboree',
  integrations: [react(), tailwind({
    configFile: './apps/astro-jamboree/tailwind.config.mjs',
  }), mdx(), sitemap()],
  // output: "server",
  vite: {
    ssr: {
      external: ['react', 'react-dom'],
      noExternal: true // somehow this way astro sitemap doesn't fail
    }
  }
  //   plugins: [
  //     Icons({
  //       jsx: "react",
  //       compiler: "jsx",
  //       autoInstall: true,
  //     }),
  //     Icons({
  //       compiler: "astro",
  //       autoInstall: true,
  //     }),
  //   ],
  // },
});
