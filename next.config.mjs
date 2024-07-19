import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';

/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://certificate-validator-db.onrender.com/:path*', // Proxy to backend
            },
        ];
    },
    webpack: (config) => {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        config.resolve.alias['@'] = __dirname;
        return config;
    },
};

export default nextConfig;
