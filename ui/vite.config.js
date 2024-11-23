import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
let chunkCounter = 0;

const autoIncrementPlugin = () => {
    return {
        name: 'auto-increment-plugin',
        generateBundle(options, bundle) {
            for (const fileName in bundle) {
                const chunk = bundle[fileName];
                if (chunk.type === 'chunk') {
                    chunkCounter++;
                    chunk.fileName = `assets/js/chunk-${chunkCounter}.js`;
                }
            }
        }
    };
};

export default defineConfig({
    plugins: [react(), autoIncrementPlugin()],
    server: {
        open: true
    },
    build: {
        sourcemap: true,
        rollupOptions: {
            output: {
                entryFileNames: 'assets/js/[name].js',
                assetFileNames: 'assets/[ext]/[name].[ext]',
            },
        },
    },
    publicDir: 'public'
});
