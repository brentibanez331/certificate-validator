import { fileURLToPath } from 'url';
import { dirname } from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        config.resolve.alias['@'] = __dirname;
        return config;
    },
};

export default nextConfig;
