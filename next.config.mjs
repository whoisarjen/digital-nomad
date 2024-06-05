/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    experimental: {
        serverActions: {
            allowedOrigins: [
                'localhost:3000',
                'fictional-lamp-qxxp6rpgp4q349q4-3000.app.github.dev',
            ],
        },
    },
};

export default nextConfig;
