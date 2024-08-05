import { fileURLToPath } from 'url';
import { dirname } from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['192.168.254.104'],
    },
    webpack(config) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        config.resolve.alias['@'] = __dirname;
        return config;
    },
};

export default nextConfig;
