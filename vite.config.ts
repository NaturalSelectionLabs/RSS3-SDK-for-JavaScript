import { defineConfig } from 'vite';
import path from 'path';
import { version } from './package.json';

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'RSS3',
            formats: ['umd'],
            fileName: () => `rss3.js`,
        },
    },
    define: {
        SDK_VERSION: JSON.stringify(version),
    },
    server: {
        base: '/demo/',
    },
});
