import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
    plugins: [
        basicSsl()
    ],
    server: {
        host: '0.0.0.0',
        port: 8080,
        https: true
    }
});
