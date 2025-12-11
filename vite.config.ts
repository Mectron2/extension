import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "path";
import {viteStaticCopy} from "vite-plugin-static-copy";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(),
        viteStaticCopy({
            targets: [
                {
                    src: 'src/manifest.json',
                    dest: '.'
                }
            ]
        })
    ],
    build: {
        outDir: "dist",
        rollupOptions: {
            input: {
                popup: resolve(__dirname, "popup.html"),
                content: resolve(__dirname, "src/content.ts"),
            },
            output: {
                entryFileNames: "[name].js",
                chunkFileNames: "[name].js",
                assetFileNames: "[name].[ext]"
            }
        }
    }
})
