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
        config.resolve.alias['@'] = __dirname;
        return config;
    },

};

export default nextConfig;
