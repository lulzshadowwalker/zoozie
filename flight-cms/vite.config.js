import { defineConfig } from 'vite'
import liveReload from 'vite-plugin-live-reload'

export default defineConfig({
    plugins: [
        liveReload(['./**/*.php']),
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