import { defineConfig } from 'vite'
import liveReload from 'vite-plugin-live-reload'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        liveReload(['./**/*.php']),
        tailwindcss(),
    ],
    build: {
        outDir: 'resources/dist',
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
            input: 'resources/src/index.ts',
        },
    },
})