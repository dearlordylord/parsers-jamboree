import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
//import Icons from "unplugin-icons/vite";

// https://astro.build/config
export default defineConfig({
  outDir: '../../dist/apps/astro-jamboree',
  integrations: [react(), tailwind({
    configFile: './apps/astro-jamboree/tailwind.config.mjs',
  }), mdx()],
  // output: "server",
  // vite: {
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
